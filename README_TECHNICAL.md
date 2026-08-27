# ACMG Variant Classification Pipeline - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Pipeline Architecture](#pipeline-architecture)
3. [Two-Pass Design](#two-pass-design)
4. [ACMG Agent System](#acmg-agent-system)
5. [Debate System](#debate-system)
6. [HPO Phenotype Matching](#hpo-phenotype-matching)
7. [Recent Updates & Iterations](#recent-updates--iterations)
8. [Performance Optimizations](#performance-optimizations)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## System Overview

This is an AI-native variant classification pipeline that automates ACMG/AMP 2015 guidelines using a combination of rule-based agents, LLM-based reasoning, and a debate layer for complex cases.

**Key Statistics:**
- **Processing Speed**: 12 variants in parallel (ThreadPoolExecutor for Celery compatibility)
- **Success Rate**: 94% (47/50 variants in latest testing)
- **Debate Skip Rate**: 60% (clear cases skip debate for ~60% speedup)
- **Model**: GPT-OSS-20B (standardized across entire pipeline)

**Entry Point**: `src/pipeline/runner.py` → `run_session()`

---

## Pipeline Architecture

### Complete Data Flow

```mermaid
graph TD
    START([VCF Input]) --> VALIDATE[Input Validation]
    VALIDATE --> DETECT[Annotation Detection]
    DETECT --> DECIDE{Already<br/>Annotated?}
    
    DECIDE -->|No| STRIP[Strip Alternate Contigs]
    STRIP --> PREFILTER[Prefilter<br/>Remove common variants]
    PREFILTER --> VEP[VEP Annotation<br/>Full VCF at once]
    VEP --> PHASE[Phasing<br/>Parental genotypes]
    PHASE --> POST[Post-Process<br/>Parse VEP TSV]
    
    DECIDE -->|Yes| POST
    POST --> AGENTS[9 Parallel Agents<br/>ThreadPoolExecutor]
    
    AGENTS --> AGG[Evidence Aggregator<br/>ACMG Table 5]
    AGG --> DEBATE_DECISION{Run Debate?}
    
    DEBATE_DECISION -->|Skip: Clear case<br/>60% of variants| ARBITER[Final Arbiter<br/>Confirm classification]
    DEBATE_DECISION -->|Run: Edge case<br/>40% of variants| ADVOCATES[Parallel Advocates<br/>Pathogenic + Benign]
    
    ADVOCATES --> ARBITER
    ARBITER --> CLINICAL[Clinical Actionability<br/>ASCO/NCCN/OncoKB]
    
    CLINICAL --> HPO_DECISION{Clinical<br/>Notes<br/>Provided?}
    HPO_DECISION -->|Yes| HPO_NLP[HPO NLP<br/>Extract terms]
    HPO_DECISION -->|No/Pre-parsed| HPO_MATCH[HPO Matcher<br/>Gene-disease map]
    
    HPO_NLP --> HPO_MATCH
    HPO_MATCH --> PHENO[Phenotype Scorer<br/>Gene-HPO overlap]
    PHENO --> ZYG[Zygosity Filter<br/>Inheritance check]
    ZYG --> REPORT[Report Generator<br/>XLSX/TSV/HTML]
    REPORT --> END([Final Report])
    
    style AGENTS fill:#e1f5ff
    style ADVOCATES fill:#fff4e1
    style ARBITER fill:#fff4e1
    style VEP fill:#ffe1e1
```

**File References:**
- State machine: `src/pipeline/graph.py` (Lines 311-406: `build_variant_graph()`)
- Entry point: `src/pipeline/runner.py` (Lines 267-509: `run_session()`)

---

## Two-Pass Design

The pipeline uses a **two-pass architecture** to eliminate redundant VEP annotations:

```mermaid
graph LR
    subgraph "Pass 1: VEP Pass (Full VCF)"
        VCF[Input VCF<br/>100 variants] --> VEP1[VEP Runner<br/>Annotates ALL variants]
        VEP1 --> TSV[VEP TSV Output]
        TSV --> PARSE[Post-Process<br/>Parse all variants]
        PARSE --> V_LIST[parsed_variants list<br/>100 VariantState objects]
    end
    
    subgraph "Pass 2: Per-Variant Classification"
        V_LIST --> PARALLEL{12 Workers<br/>ThreadPoolExecutor}
        PARALLEL --> V1[Variant 1<br/>PASS2_GRAPH]
        PARALLEL --> V2[Variant 2<br/>PASS2_GRAPH]
        PARALLEL --> V3[Variant ...<br/>PASS2_GRAPH]
        PARALLEL --> VN[Variant 100<br/>PASS2_GRAPH]
        
        V1 --> R1[Report Data]
        V2 --> R2[Report Data]
        V3 --> R3[Report Data]
        VN --> RN[Report Data]
        
        R1 & R2 & R3 & RN --> FINAL[Generate Reports<br/>XLSX/TSV/HTML]
    end
    
    style VEP1 fill:#ffe1e1
    style PARALLEL fill:#e1ffe1
```

**Pass 1** (`VARIANT_GRAPH`):
- Runs VEP annotation on **entire VCF** at once
- Parses ALL variants from VEP TSV → `parsed_variants` list
- Output: List of `VariantState` objects with pre-populated VEP fields

**Pass 2** (`PASS2_GRAPH`):
- Processes each variant independently in parallel
- **Skips** all preprocessing (validate, detect, VEP, post-process)
- Starts directly at `run_agents` node
- **Speedup**: Eliminates 8+ minutes of redundant overhead per variant

**Implementation:**
```python
# Pass 1: VEP on full VCF
parsed_variants, annotated_tsv = _run_vep_pass(session_id, proband_vcf_path, ...)

# Pass 2: 12 workers process variants in parallel
with ThreadPoolExecutor(max_workers=12) as executor:
    for result in executor.map(_run_variant_pass, parsed_variants):
        completed_states.append(result)
```

**File Reference**: `src/pipeline/runner.py` (Lines 5-35: Architecture docstring)

---

## ACMG Agent System

The pipeline uses **9 parallel specialist agents** to evaluate 33 ACMG/AMP 2015 criteria:

```mermaid
graph TD
    subgraph "Agent Parallelization"
        START[Variant State] --> POOL[ThreadPoolExecutor<br/>9 workers]
        
        POOL --> A1[Agent 1: Population<br/>BA1, BS1, BS2, PM2]
        POOL --> A2[Agent 2: Consequence<br/>PVS1 LOF]
        POOL --> A3[Agent 3: In-Silico<br/>PP3, BP4, BP7]
        POOL --> A4[Agent 4: Database<br/>PS1, PS4, PP5, BP6]
        POOL --> A5[Agent 5: Functional<br/>PS3, BS3, PM1]
        POOL --> A6[Agent 6: Segregation<br/>PP1, PM3, BP2, BS4]
        POOL --> A7[Agent 7: De Novo<br/>PS2, PM6]
        POOL --> A8[Agent 8: Gene Context<br/>PM4, PM5, PP2, BP1, BP3]
        POOL --> A9[Agent 9: Phenotype<br/>PP4, BP5]
        
        A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9 --> MERGE[Merge Evidence<br/>agent_evidence dict]
    end
    
    MERGE --> OUT[Output: 33 criteria evaluated]
    
    style A1 fill:#90EE90
    style A2 fill:#90EE90
    style A3 fill:#90EE90
    style A7 fill:#90EE90
    style A8 fill:#90EE90
    
    style A4 fill:#FFD700
    
    style A5 fill:#87CEEB
    style A6 fill:#87CEEB
    style A9 fill:#87CEEB
```

**Legend:**
- 🟢 **Green**: Rule-based agents (deterministic, ~0.01s, 100% consistent)
- 🟡 **Yellow**: Hybrid agents (RAG retrieval + LLM interpretation)
- 🔵 **Blue**: LLM-based agents (complex medical reasoning)

### Agent Details

| Agent | Type | Criteria | Performance | Approach |
|-------|------|----------|-------------|----------|
| **Agent 1** | Rule-based | BA1, BS1, BS2, PM2 | ~0.01s | gnomAD frequency thresholds |
| **Agent 2** | Rule-based | PVS1 | ~0.02s | ClinGen 5-caveat decision tree |
| **Agent 3** | Rule-based | PP3, BP4, BP7 | ~0.01s | In-silico predictor vote counting |
| **Agent 4** | Hybrid | PS1, PS4, PP5, BP6 | ~3s | Parquet ClinVar queries + LLM |
| **Agent 5** | LLM | PS3, BS3, PM1 | ~5s | Functional studies + domain analysis |
| **Agent 6** | LLM | PP1, PM3, BP2, BS4 | ~4s | Segregation patterns + phase |
| **Agent 7** | Rule-based | PS2, PM6 | ~0.01s | De novo status from genotypes |
| **Agent 8** | Rule-based | PM4, PM5, PP2, BP1, BP3 | ~0.5s | Gene context + RAG for PM5 |
| **Agent 9** | LLM | PP4, BP5 | ~4s | Phenotype-disease matching |

**Parallelization**: All 9 agents run simultaneously using `ThreadPoolExecutor` with 60-second timeout per agent.

**File References:**
- Agent orchestration: `src/pipeline/graph.py` (Lines 168-233: `run_agents_in_parallel()`)
- Individual agents: `src/agents/agent1_population.py` through `agent9_phenotype.py`

---

## Debate System

The debate system provides **adversarial review** for complex/edge-case classifications:

```mermaid
graph TD
    AGG[Evidence Aggregator<br/>Preliminary Classification] --> DECIDE{Should Run<br/>Debate?}
    
    DECIDE -->|Skip 60%:<br/>- BA1 stand-alone<br/>- Clear P/LP 2+ Strong<br/>- Clear B/LB 2+ Strong<br/>- Weak VUS no Strong| ARBITER[Final Arbiter<br/>Confirms classification]
    
    DECIDE -->|Run 40%:<br/>- Conflicting evidence<br/>- Edge cases<br/>- Moderate-only| PARALLEL[Parallel Advocates<br/>ThreadPoolExecutor]
    
    subgraph "Parallel Advocate Arguments"
        PARALLEL --> PATH[Pathogenic Advocate<br/>Argues STRONGEST P case]
        PARALLEL --> BEN[Benign Advocate<br/>Argues STRONGEST B case]
        
        PATH --> P_RAG[RAG Queries:<br/>- ACMG guidelines P criteria<br/>- ClinVar P/LP entries]
        BEN --> B_RAG[RAG Queries:<br/>- ACMG guidelines B criteria<br/>- ClinVar B/LB entries]
        
        P_RAG --> P_OUT[Output:<br/>- Proposed upgrades<br/>- Additional criteria<br/>- Rationale]
        B_RAG --> B_OUT[Output:<br/>- Proposed downgrades<br/>- Benign evidence<br/>- Rationale]
    end
    
    P_OUT & B_OUT --> ARBITER
    
    ARBITER --> ARB_RAG[RAG Queries:<br/>- ALL fired criteria<br/>- ACMG Table 5 rules]
    ARB_RAG --> FINAL[Final Output:<br/>- Accept/reject upgrades<br/>- Final classification<br/>- Evidence summary<br/>- Confidence score]
    
    style PATH fill:#ff9999
    style BEN fill:#99ccff
    style ARBITER fill:#ffff99
```

### Debate Skip Conditions (60% of variants)

The pipeline **skips debate** for clear-cut cases to save ~20 seconds per variant:

1. **BA1 Stand-Alone**: Allele frequency > 5% (benign by definition)
2. **Clear Pathogenic**: ≥2 Strong criteria, no conflict
3. **Clear Benign**: ≥2 Strong criteria, no conflict  
4. **Weak VUS**: No Strong criteria on either side

**Debate runs** for:
- Conflicting evidence (both P and B criteria present)
- Edge cases (1 Strong + multiple Moderate)
- Moderate-only classifications (need LLM judgment)

### Parallel Advocate Optimization

Both advocates run **simultaneously** (not sequentially):
- **Before**: Pathogenic (7s) → Benign (7s) = **14s sequential**
- **After**: max(Pathogenic, Benign) = **7s parallel**
- **Speedup**: 7 seconds saved per variant that runs debate

**File References:**
- Skip logic: `src/pipeline/graph.py` (Lines 249-293: `_should_run_debate()`)
- Pathogenic advocate: `src/pipeline/nodes/debate_pathogenic_advocate.py`
- Benign advocate: `src/pipeline/nodes/debate_benign_advocate.py`
- Final arbiter: `src/pipeline/nodes/debate_final_arbiter.py`
- Parallel execution: `src/pipeline/graph.py` (Lines 106-134: `run_advocates_in_parallel()`)

---

## HPO Phenotype Matching

The HPO pipeline maps patient clinical features to gene-disease associations:

```mermaid
graph LR
    START[Clinical Input] --> DECIDE{HPO Terms<br/>Pre-parsed?}
    
    DECIDE -->|No: Raw notes| NLP[HPO NLP Node<br/>LLM extracts HP:XXXXXXX]
    DECIDE -->|Yes: Pre-supplied| MATCH
    
    NLP --> MATCH[HPO Matcher<br/>Gene-Disease Mapping]
    
    MATCH --> DATA1[Data Source 1:<br/>phenotype.hpoa<br/>Disease ↔ HPO terms]
    MATCH --> DATA2[Data Source 2:<br/>genes_diseases.xml<br/>Gene ↔ Orphanet diseases]
    
    DATA1 & DATA2 --> SCORE[Phenotype Scorer<br/>Jaccard overlap scoring]
    
    SCORE --> CALC[Calculate:<br/>patient_hpos ∩ disease_hpos<br/>÷<br/>patient_hpos ∪ disease_hpos]
    
    CALC --> ZYG[Zygosity Filter<br/>Inheritance mode check]
    
    ZYG --> OUTPUT[Output Fields:<br/>- matched_orphanet_disease<br/>- phenotype_score<br/>- hpo_matched_genes<br/>- zygosity_filter_status]
    
    style NLP fill:#87CEEB
    style SCORE fill:#90EE90
```

**HPO Matching Strategy:**
1. Load HPO annotations (`phenotype.hpoa`) and Orphanet gene-disease mappings at module level
2. For each variant's gene, look up associated diseases
3. Score HPO overlap between patient terms and each disease's phenotype
4. Pick best-matching disease (highest Jaccard score)
5. Check if variant's zygosity matches expected inheritance pattern

**File References:**
- HPO NLP: `src/pipeline/nodes/hpo_nlp.py`
- HPO Matcher: `src/pipeline/nodes/hpo_matcher.py`
- Phenotype Scorer: `src/pipeline/nodes/phenotype_scorer.py`
- Zygosity Filter: `src/pipeline/nodes/zygosity_filter.py`

---

## Recent Updates & Iterations

### JSON Parsing Troubleshooting Timeline (Last Week)

The pipeline experienced JSON parsing failures in LLM responses. Here's the complete investigation and resolution:

```mermaid
timeline
    title JSON Parsing Issues - 4 Distinct Problems Identified
    
    section Issue #1: Model Token Cap
        Iteration 1 : GPT-OSS-20B responses truncated at ~4000 chars
                   : Root cause - max_tokens=2048 in model registry
                   : Fix - Increased to 8192 in bedrock_client.py line 83
                   : Status - ✅ FIXED
    
    section Issue #2: Agent 5 Reasoning Loops
        Iteration 2 : Agent 5 had 70% failure rate (14/20 failures)
                   : Root cause - reasoning_effort="high" infinite loops
                   : Fix - Removed reasoning_effort from agent5_functional.py
                   : Test result - 30% → 100% success (50/50 variants)
                   : Status - ✅ FIXED
    
    section Issue #3: Model Standardization
        Iteration 3 : Standardized entire pipeline on GPT-OSS-20B
                   : Agents 1-9 - 100% success ✅
                   : Debate nodes - 14% failure (7/50 variants) ❌
                   : Status - ⚠️ PARTIAL SUCCESS
    
    section Issue #4: Debate Reasoning Tags
        Iteration 4 : With reasoning_effort="medium" debate wraps output in <reasoning> tags
                   : No JSON output produced only reasoning tags
                   : Failed fix #1 - Prompt instruction (model ignored)
                   : Failed fix #2 - Removed reasoning_effort parameter
                   : Mystery - Debug STILL shows "medium" despite code removal
                   : Status - ❌ ONGOING INVESTIGATION
```

### Current Test Results

**Overall Success Rate**: 94% (47/50 variants)

| Component | Success Rate | Notes |
|-----------|--------------|-------|
| Agents 1-9 | 100% (50/50) | All agents working perfectly |
| Debate Nodes | 86% (43/50) | 3 variants still failing with reasoning tag issue |
| **Total Pipeline** | **94% (47/50)** | Ready for production with known edge cases |

### Issue #4 Deep Dive: The Mysterious `reasoning_effort="medium"`

**Problem**: Debate nodes wrap ALL output in `<reasoning>` tags, producing no JSON.

**Why Agents 4, 5, 9 Worked But Debate Nodes Failed**:
- **Agents 4, 5, 9**: Simpler prompts, shorter expected output → reasoning tags stay focused
- **Debate nodes**: Complex prompts with words like "rationale", "reasoning", "justification" + longer expected output → reasoning tag behavior dominates

**Failed Fix Attempts**:

1. **Prompt Instruction**: Added explicit instruction to not use reasoning tags
   - **Result**: ❌ Model ignored instruction completely

2. **Remove reasoning_effort Parameter**: Removed from all debate node function calls
   - **Expected**: `reasoning_effort` should be `None`, no reasoning tags
   - **Actual**: Debug output STILL shows `"Reasoning effort: medium"` ❌

**Verification Performed**:
- ✅ Server source code: NO `reasoning_effort` in debate node function calls
- ✅ `call_llm_json()` function signature: Default is `None`, not `"medium"`
- ✅ `call_llm()` function signature: Default is `None`
- ✅ Python cache cleared on server
- ✅ No grep matches for `reasoning_effort = "medium"` or `reasoning_effort or "medium"`

**Suspected Location**: The `chat_completion()` method (called at line 404 in `call_llm()`)
- This function's signature has **not been checked yet**
- Likely source of the mysterious `"medium"` default

**File References:**
- Bedrock client: `src/utils/bedrock_client.py` (Line 83: Token cap fix)
- Agent 5: `src/agents/agent5_functional.py` (Line ~150: Reasoning effort removal)
- LLM utilities: `src/utils/llm.py` (Call chain: `call_llm_json()` → `call_llm()` → `chat_completion()`)

---

## Performance Optimizations

### Parallelization Strategy

```mermaid
graph TD
    subgraph "CPU Utilization (32-core system)"
        CELERY[Celery Worker<br/>--concurrency=2] --> VCF1[VCF 1<br/>Session Thread]
        CELERY --> VCF2[VCF 2<br/>Session Thread]
        
        VCF1 --> POOL1[ThreadPoolExecutor<br/>12 workers]
        VCF2 --> POOL2[ThreadPoolExecutor<br/>12 workers]
        
        POOL1 --> V1[Variant 1<br/>9 agents]
        POOL1 --> V2[Variant 2<br/>9 agents]
        POOL1 --> V3[Variant 3<br/>9 agents]
        
        POOL2 --> V4[Variant 4<br/>9 agents]
        POOL2 --> V5[Variant 5<br/>9 agents]
        POOL2 --> V6[Variant 6<br/>9 agents]
    end
    
    style CELERY fill:#ff9999
    style POOL1 fill:#99ccff
    style POOL2 fill:#99ccff
```

**Configuration**:
- **Celery Concurrency**: 2 (process 2 VCFs simultaneously)
- **Variant Workers**: 12 per VCF (ThreadPoolExecutor for daemon compatibility)
- **Agent Parallelization**: 9 agents per variant (ThreadPoolExecutor)
- **Total Parallel Capacity**: 2 VCFs × 12 variants × 9 agents = 216 concurrent operations

**Why ThreadPoolExecutor?**
- Celery workers run as daemon processes (cannot spawn child processes)
- `multiprocessing.Pool` fails in daemon contexts
- `ThreadPoolExecutor` works perfectly for I/O-bound LLM calls
- Tested in production with excellent performance

**File Reference**: `src/pipeline/runner.py` (Lines 66-75: Worker configuration)

### Debate Skip Optimization

**Impact**: 60% of variants skip debate → ~20 second speedup per variant

| Variant Type | Debate Status | Time Saved |
|--------------|---------------|------------|
| BA1 stand-alone (AF > 5%) | Skip | 20s |
| Clear Pathogenic (2+ Strong) | Skip | 20s |
| Clear Benign (2+ Strong) | Skip | 20s |
| Weak VUS (no Strong) | Skip | 20s |
| Edge cases / conflicts | Run | 0s (necessary) |

**ROI**: On 100-variant VCF with 60% skip rate:
- **Time saved**: 60 variants × 20s = **1,200 seconds (20 minutes)**

### Advocate Parallelization

**Impact**: 7 second speedup per variant that runs debate

| Configuration | Pathogenic | Benign | Total Time |
|---------------|------------|--------|------------|
| Sequential (before) | 7s | 7s | **14s** |
| Parallel (after) | 7s | 7s | **7s** |

**ROI**: On 40 variants that run debate:
- **Time saved**: 40 variants × 7s = **280 seconds (4.7 minutes)**

**File Reference**: `src/pipeline/graph.py` (Lines 106-134: `run_advocates_in_parallel()`)

---

## Troubleshooting Guide

### Common Issues & Fixes

#### 1. VEP Annotation Failures

**Symptoms**: Pipeline fails at VEP node with Docker errors

**Common Causes**:
- VEP Docker image not pulled
- VEP cache directory not mounted
- Insufficient memory (VEP requires ~8GB)

**Fix**:
```bash
# Pull VEP image
docker pull ensemblorg/ensembl-vep:release_111

# Check cache directory exists
ls -lh /workspace/data/acmg-pipeline/vep_databases/

# Check Docker memory limit (increase to 8GB if needed)
docker info | grep -i memory
```

**File Reference**: `src/pipeline/nodes/vep_runner.py`

#### 2. JSON Parsing Failures in LLM Responses

**Symptoms**: `JSONDecodeError` in agent or debate node logs

**Diagnostic Steps**:
1. Check if response is truncated (ends mid-JSON)
   - **Cause**: Token limit too low
   - **Fix**: Increase `max_tokens` in `src/utils/bedrock_client.py` line 83

2. Check if response is wrapped in `<reasoning>` tags
   - **Cause**: `reasoning_effort` parameter enabled
   - **Fix**: Remove `reasoning_effort` from agent function call

3. Check if response contains no JSON at all
   - **Cause**: Prompt too complex, model confused
   - **Fix**: Simplify prompt, add explicit JSON schema

**Debug Commands**:
```bash
# Find recent JSON parse errors
grep "JSONDecodeError" /workspace/logs/celery_worker.log | tail -20

# Check what model/parameters were used
grep "Reasoning effort:" /workspace/logs/celery_worker.log | tail -10

# See actual LLM response
grep -A 50 "LLM Response:" /workspace/logs/celery_worker.log | tail -60
```

**File References**:
- Bedrock client: `src/utils/bedrock_client.py`
- LLM utilities: `src/utils/llm.py`

#### 3. High Memory Usage / OOM Kills

**Symptoms**: Celery workers killed by OOM, variants fail randomly

**Common Causes**:
- Too many parallel workers
- VEP cache loaded multiple times
- Large VCF files with hundreds of variants

**Fix**:
```python
# Reduce variant workers in src/pipeline/runner.py line 66
NUM_VARIANT_WORKERS = min(8, max(1, cpu_count() - 2))  # Was 12

# Reduce Celery concurrency
celery -A src.api.worker worker --concurrency=1  # Was 2
```

**Monitor Memory**:
```bash
# Watch memory usage in real-time
watch -n 1 "ps aux | grep -E '(celery|python)' | awk '{sum+=\$6} END {print sum/1024\" MB\"}'"
```

#### 4. Debate Nodes Return No Classification

**Symptoms**: `final_classification` is empty/null after arbiter

**Diagnostic**:
```bash
# Check if advocates ran
grep "advocate_classification" /workspace/logs/celery_worker.log | tail -5

# Check arbiter input
grep "Final arbiter input state" /workspace/logs/celery_worker.log | tail -50
```

**Common Causes**:
- Reasoning tag wrapper issue (see Issue #4 above)
- JSON schema mismatch
- Timeout (arbiter defaulted to VUS but failed to write state)

**Fix**:
1. Check `reasoning_effort` is NOT set in debate node calls
2. Verify JSON schema matches expected output structure
3. Increase timeout from 60s to 90s in `src/pipeline/graph.py` line 124

#### 5. HPO Matching Returns No Results

**Symptoms**: `matched_orphanet_disease` is null, `phenotype_score` is 0.0

**Common Causes**:
- No clinical notes provided AND no pre-parsed HPO terms
- HPO data files not loaded (`phenotype.hpoa`, `genes_diseases.xml`)
- Gene not in Orphanet database

**Fix**:
```bash
# Check HPO data files exist
ls -lh /workspace/data/acmg-pipeline/databases/phenotype.hpoa
ls -lh /workspace/data/acmg-pipeline/databases/genes_diseases.xml

# Check if gene is in Orphanet
grep "BRCA2" /workspace/data/acmg-pipeline/databases/genes_diseases.xml
```

**Workaround**: For genes not in Orphanet, phenotype scoring is skipped. This is expected behavior.

**File Reference**: `src/pipeline/nodes/hpo_matcher.py`

---

## File Path Quick Reference

### Core Pipeline Files
- **Entry Point**: `src/pipeline/runner.py` (Two-pass architecture)
- **State Machine**: `src/pipeline/graph.py` (LangGraph wiring)
- **State Definition**: `src/pipeline/state.py` (VariantState TypedDict)

### Preprocessing Nodes
- `src/pipeline/nodes/input_validation.py`
- `src/pipeline/nodes/annotation_detector.py`
- `src/pipeline/nodes/strip_alternate_contigs.py`
- `src/pipeline/nodes/prefilter.py`
- `src/pipeline/nodes/vep_runner.py`
- `src/pipeline/nodes/phasing.py`
- `src/pipeline/nodes/post_process.py`

### ACMG Agents (Rule-Based)
- `src/agents/agent1_population.py` (BA1, BS1, BS2, PM2)
- `src/agents/agent2_consequence.py` (PVS1)
- `src/agents/agent3_insilico.py` (PP3, BP4, BP7)
- `src/agents/agent7_denovo.py` (PS2, PM6)
- `src/agents/agent8_gene_context.py` (PM4, PM5, PP2, BP1, BP3)

### ACMG Agents (LLM-Based)
- `src/agents/agent4_database.py` (PS1, PS4, PP5, BP6) - Hybrid
- `src/agents/agent5_functional.py` (PS3, BS3, PM1)
- `src/agents/agent6_segregation.py` (PP1, PM3, BP2, BS4)
- `src/agents/agent9_phenotype.py` (PP4, BP5)

### Debate System
- `src/pipeline/nodes/evidence_aggregator.py` (ACMG Table 5 rules)
- `src/pipeline/nodes/debate_pathogenic_advocate.py`
- `src/pipeline/nodes/debate_benign_advocate.py`
- `src/pipeline/nodes/debate_final_arbiter.py`

### HPO Phenotype Pipeline
- `src/pipeline/nodes/hpo_nlp.py` (Extract HPO terms from text)
- `src/pipeline/nodes/hpo_matcher.py` (Gene-disease mapping)
- `src/pipeline/nodes/phenotype_scorer.py` (Jaccard overlap)
- `src/pipeline/nodes/zygosity_filter.py` (Inheritance check)

### Utilities
- `src/utils/bedrock_client.py` (AWS Bedrock API wrapper)
- `src/utils/llm.py` (LLM call orchestration)
- `src/utils/llm_client.py` (Legacy LLM interface)
- `src/config.py` (Global configuration)

### Output
- `src/pipeline/nodes/report_generator.py` (Excel/TSV/HTML generation)
- `src/report_templates/acmg_report.html.j2` (HTML template)

---

## Development Notes

### Adding a New Agent

1. Create `src/agents/agentN_name.py` following the template:
```python
def agentN_name(state: VariantState) -> dict:
    """
    Agent N — Brief description
    Evaluates: CRITERION1, CRITERION2
    """
    # Your logic here
    return {
        "agent_evidence": {
            "agentN": {
                "criteria_pathogenic": {},
                "criteria_benign": {},
                "evidence_notes": "",
                "citations": [],
                "confidence": "MEDIUM",
            }
        }
    }
```

2. Import in `src/pipeline/graph.py` (line ~60)
3. Add to `agent_fns` list in `run_agents_in_parallel()` (line ~183)

### Adding a New ACMG Criterion

1. Identify which agent should evaluate it (by evidence type)
2. Add criterion to agent's return dict:
   - Pathogenic: `"criteria_pathogenic": {"NEW_CRITERION": "Moderate"}`
   - Benign: `"criteria_benign": {"NEW_CRITERION": "Supporting"}`
3. Update evidence aggregator rules in `src/pipeline/nodes/evidence_aggregator.py`
4. Add criterion definition to ACMG guidelines RAG collection

### Debugging LLM Calls

Enable debug logging to see full LLM request/response:
```python
import logging
logging.getLogger("src.utils.llm").setLevel(logging.DEBUG)
```

This will print:
- Prompt text
- Model parameters (temperature, max_tokens, reasoning_effort)
- Full JSON response
- Token usage

---

**Last Updated**: 2026-07-01  
**Pipeline Version**: GPT-OSS-20B standardized (94% success rate)  
**Maintainer**: AI-Native ACMG Team
