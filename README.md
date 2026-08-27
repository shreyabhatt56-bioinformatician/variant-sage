# Variant Sage &mdash; AI Genomics Platform (Frontend Demo)

A modern, light-themed, professional frontend demonstration for **Variant Sage**, an AI-powered genomics platform designed for clinical genetics, oncology, and next-generation sequencing (NGS) laboratories.

This repository contains the complete static frontend mockup built for the MENA pitch. It simulates a role-based, end-to-end clinical variant interpretation workflow without requiring a backend.

## 🚀 Live Demo

*To run this locally, simply clone the repository and open `frontend/index.html` in any modern web browser.*

```bash
git clone https://github.com/shreyabhatt56-bioinformatician/variant-sage.git
cd variant-sage/frontend
# Open index.html in your browser (e.g., Chrome, Firefox, Edge)
```

No build steps, no dependencies, no Node.js required. It runs entirely offline using vanilla HTML, CSS, and JavaScript.

## 🎯 Key Features

- **Role-Based Dashboards**: Tailored UI for 4 distinct clinical personas:
  - **🩺 Doctor**: Submit clinical history (HPO terms) and view finalized patient reports.
  - **🔬 Lab Supervisor**: Upload VCF files, manage sequencing queues, and monitor live AI analysis.
  - **🧬 Genetic Counselor**: Review automated ACMG classifications, validate data, and approve/reject reports.
  - **🖥️ Management / Admin**: System-wide analytics, user management, and live activity logs.
- **Clinical Data Simulation**: Medically grounded mock data featuring real ACMG criteria (PVS1, PS1, etc.), realistic variants (BRCA2, CFTR, TP53), and Human Phenotype Ontology (HPO) terms.
- **Modern Light Theme**: A clean, high-contrast, professional design system inspired by top-tier enterprise healthcare software.
- **Responsive & Interactive**: Includes smooth page transitions, animated progress bars, live-simulated pipeline execution, and Chart.js analytics.

## 📁 Repository Structure

```text
variant-sage/
├── frontend/
│   ├── index.html         # Login / Role selection portal
│   ├── doctor.html        # Doctor dashboard & report viewer
│   ├── lab.html           # Lab sequencing & analysis monitor
│   ├── counselor.html     # Variant review & approval queue
│   ├── admin.html         # Analytics & user management (Chart.js)
│   ├── css/
│   │   └── styles.css     # Shared design system (light theme)
│   └── js/
│       └── app.js         # Shared mock data store, utilities, & SVG icons
└── README.md              # Project documentation
```

## 🛠️ Tech Stack

- **HTML5**: Semantic markup for accessibility and structure.
- **Vanilla CSS3**: Custom CSS variables, Flexbox/Grid layouts, glassmorphism UI components, and CSS animations (no Tailwind/Bootstrap required).
- **Vanilla JavaScript (ES6)**: DOM manipulation, mock data rendering, and event handling.
- **Chart.js**: Included via CDN for rendering the bar and donut charts on the Admin dashboard.
- **Lucide Icons**: Clean, professional SVG icons embedded directly into the JS file (no external icon fonts to load).

## 💡 How to Replicate / Customize

Because this is a static demo, it is extremely easy to extend or customize for your own presentations:

1. **Modify Mock Data**: Open `frontend/js/app.js` and edit the `VS.patients` or `VS.variantDetails` arrays to add new patients, change variant classifications, or update HPO terms. All tables and reports will automatically populate with the new data.
2. **Update Branding**: In `frontend/js/app.js`, look for the `renderSidebar` function to change the application name, logo, or sidebar navigation links.
3. **Change Theme Colors**: Open `frontend/css/styles.css` and modify the `:root` CSS variables (e.g., `--accent`, `--bg-page`) to instantly reskin the entire application.

## 📝 License

This project was developed as a mockup for MolSys. Feel free to use it as a reference for building clinical genomics interfaces!
