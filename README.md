# 🎓 DPI Student Portal

[![Website](https://img.shields.io/badge/Website-sdpi.pro.bd-blue)](https://sdpi.pro.bd)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple)](https://sdpi.pro.bd)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **Unofficial** student information portal for Dhaka Polytechnic Institute (DPI). Search board roll numbers, academic results, and student records easily and quickly.

---

## 📌 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Live Demo](#-live-demo)
- [Installation & Local Development](#-installation--local-development)
- [Data Source](#-data-source)
- [Deployment on Vercel](#-deployment-on-vercel)
- [SEO Optimizations](#-seo-optimizations)
- [PWA Features](#-pwa-features)
- [Disclaimer](#-disclaimer)
- [Developer](#-developer)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 Student Search | Search by Board Roll number or Student Name |
| 📊 Real-time Suggestions | Auto-suggestions while typing |
| 🖨️ Print Result | Print student information with official format |
| 📸 Export as Image | Download student info as PNG image |
| 📤 Share | Share student info via native share dialog |
| 📱 PWA Support | Install as app on mobile devices |
| 🎨 Responsive Design | Works perfectly on all devices |
| ⚡ Fast Loading | Optimized with service worker caching |
| 🌙 Animated UI | Smooth animations and modern design |
| 🔗 Result Link | Direct link to BTEB results from roll number |

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure & content |
| CSS3 | Styling & animations |
| JavaScript (ES6) | Functionality & interactions |
| Google Sheets API | Student data source (CSV export) |
| Vercel | Hosting & deployment |
| PWA | Offline & app-like experience |

### Libraries & CDN

| Library | Purpose |
|---------|---------|
| Font Awesome 6 | Icons and visual elements |
| Google Fonts (Inter) | Typography |
| html2canvas | Export result as image |

---

## 📁 Project Structure
dpi-student-portal/
│
├── index.html # Main homepage & search interface
├── about.html # About DPI & portal information
├── privacy.html # Privacy policy page
├── 404.html # Custom 404 error page
│
├── style.css # Main stylesheet (all CSS)
├── script.js # Core JavaScript functionality
│
├── manifest.json # PWA manifest configuration
├── service-worker.js # Service worker for caching
│
├── robots.txt # Search engine crawl instructions
├── sitemap.xml # XML sitemap for SEO
├── vercel.json # Vercel deployment configuration
│
└── README.md # Project documentation (this file)

---

## 🚀 Live Demo

**Website:** https://sdpi.pro.bd

### Test Search Examples

| Search Type | Example |
|-------------|---------|
| Board Roll | 123456 |
| Student Name | Md. Rahim |
| Partial Name | Rahim |

### URL Structure (Clean URLs)

| Page | Old URL | New URL |
|------|---------|---------|
| Home | /index.html | / |
| About | /about.html | /about |
| Privacy | /privacy.html | /privacy |

> .html extension has been removed for cleaner, SEO-friendly URLs.

---

## 🔧 Installation & Local Development

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari)
- Local server (optional, for testing PWA features)

### Steps

1. **Clone the repository**
   git clone https://github.com/yourusername/dpi-student-portal.git
   cd dpi-student-portal

2. **Run locally**
   - Option A: Open index.html directly in browser
   - Option B: Use Live Server (VS Code extension)
   - Option C: Use Python HTTP server
     python -m http.server 8000
     Then visit http://localhost:8000

3. **Update student data source (Optional)**
   
   Open script.js and modify the CSV URL:
   const csvUrl = "YOUR_GOOGLE_SHEETS_CSV_URL";

---

## 📊 Data Source

Student data is fetched from a publicly accessible Google Sheets CSV export.

The portal automatically displays all columns from the CSV file. No hardcoded field mapping is needed!

### Data Flow

Google Sheets -> CSV Export -> Fetch API -> Parse -> Display Results

---

## 🌐 Deployment on Vercel

This project is optimized for Vercel deployment (free tier works perfectly).

### Deployment Steps

1. **Push code to GitHub**
   git add .
   git commit -m "Initial commit"
   git push origin main

2. **Import to Vercel**
   - Go to vercel.com
   - Click "Add New" -> "Project"
   - Import your GitHub repository
   - Vercel auto-detects settings

3. **Deploy**
   - Click "Deploy"
   - Your site is live in seconds!

### vercel.json Configuration

{
  "cleanUrls": true,
  "trailingSlash": false
}

| Setting | Effect |
|---------|--------|
| cleanUrls: true | Removes .html extension from URLs |
| trailingSlash: false | No trailing slashes at end of URLs |

---

## 🔍 SEO Optimizations

| Optimization | Implementation | Status |
|--------------|----------------|--------|
| Meta Title | Custom title tag | Yes |
| Meta Description | 150-160 characters | Yes |
| Meta Keywords | Relevant keywords | Yes |
| Open Graph Tags | Facebook/LinkedIn sharing | Yes |
| Twitter Cards | Twitter sharing format | Yes |
| JSON-LD Schema | Structured data for search engines | Yes |
| Canonical URLs | Prevents duplicate content | Yes |
| XML Sitemap | sitemap.xml for Google | Yes |
| Robots.txt | Crawl instructions | Yes |
| Mobile Responsive | Works on all devices | Yes |
| Fast Loading | Service worker + optimized assets | Yes |
| Clean URLs | No .html extension | Yes |

---

## 📱 PWA Features

Your website can be installed as a native app on mobile devices!

### Installation Instructions

| Platform | Method |
|----------|--------|
| Android (Chrome) | Menu -> "Add to Home Screen" -> Install |
| iOS (Safari) | Share button -> "Add to Home Screen" |
| Desktop (Chrome/Edge) | Address bar install icon -> Install |

### PWA Files

| File | Purpose |
|------|---------|
| manifest.json | App name, icons, theme colors, start URL |
| service-worker.js | Caching strategy, offline support |

### Caching Strategy

The service worker uses a Network First strategy:
1. Try to fetch from network (always get latest data)
2. If network fails, serve from cache (offline support)
3. Cache is updated with each successful network request

---

## ⚠️ Disclaimer

> IMPORTANT: This is an unofficial student service portal.
> 
> - Not affiliated with Dhaka Polytechnic Institute (DPI)
> - Not affiliated with Bangladesh Technical Education Board (BTEB)
> - All data is collected from public sources for student convenience
> - For official information, please visit dhaka.polytechnic.gov.bd

---

## 👨‍💻 Developer

**Oahid Towsif Shamol**

| Role | Information |
|------|-------------|
| Full Stack Developer | Web application development |
| UI/UX Designer | Interface design & user experience |
| SEO Specialist | Search engine optimization |

### Contact

| Platform | Link |
|----------|------|
| Website | sdpi.pro.bd |
| Facebook | m.me/ots249 |
| Email | towsif@civil.engr.bd |

---

## 📄 License

This project is open source and available under the MIT License.

MIT License

Copyright (c) 2026 Oahid Towsif Shamol

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...

---

## 📞 Support

For issues, suggestions, or contributions:

| Issue Type | Contact Method |
|------------|----------------|
| Bug Report | Open GitHub Issue |
| Feature Request | Open GitHub Issue |
| Questions | Message on Facebook |
| Contributions | Submit Pull Request |

### Quick Links

- Report Bug: https://github.com/yourusername/dpi-student-portal/issues
- Request Feature: https://github.com/yourusername/dpi-student-portal/issues
- Contact Developer: https://m.me/ots249

---

## 📊 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-25 | Initial release |
| 1.1.0 | 2026-04-18 | Added clean URLs, PWA support |
| 1.2.0 | 2026-04-19 | SEO optimizations, README update |

---

## 🔮 Future Plans

- Add more filter options (department, semester)
- Implement batch-wise student lists
- Add result analytics and statistics
- Dark mode support
- Multi-language support (Bengali/English)

---

**Last Updated:** April 19, 2026

---

[Back to Top](#-dpi-student-portal)
