<div align="center">

<img src="public/logo.png" width="100" height="100" alt="Open-CV Logo" style="border-radius: 20px;" />

# Open-CV

[![Release](https://img.shields.io/github/v/release/Froizz7/Open-CV?color=10b981&label=Release)](https://github.com/Froizz7/Open-CV/releases/latest)
[![Free to Use](https://img.shields.io/badge/Free%20to%20Use-100%25-brightgreen.svg)](#license)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/Rust-Tauri%20v2-orange.svg)](https://v2.tauri.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)

**Open-CV** is an open-source ATS resume builder with AI.

[Downloads](#-downloads) • [Features](#-features) • [Security & Privacy](#-security--privacy) • [Build from Source](#-build-from-source) • [License](#-license)

</div>

---

## ⚡ Downloads

Installers and packages are available on the [**GitHub Releases page**](https://github.com/Froizz7/Open-CV/releases/latest):

| Platform | Packages | Link |
| :--- | :--- | :--- |
| **Windows** | Setup `.exe`, `.msi` (x64 & ARM64) | [Releases](https://github.com/Froizz7/Open-CV/releases/latest) |
| **macOS** | Universal `.dmg` (Apple Silicon & Intel) | [Releases](https://github.com/Froizz7/Open-CV/releases/latest) |
| **Linux** | `.AppImage`, `.deb`, `.rpm` (x86_64) | [Releases](https://github.com/Froizz7/Open-CV/releases/latest) |

---

## 🎯 Features

* **Multi-Format Import**: Import resumes from PDF, Word (.docx), JSON Resume, and TXT with AI structuring.
* **Native Word & PDF Export**: Instant export to ATS-compliant Microsoft Word (.docx) and vector PDF.
* **AI Career Assistant**: Generate and optimize resumes and tailored cover letters with Gemini, OpenAI, Claude, Ollama, or LM Studio.
* **Multi-Job Match**: Compare your profile simultaneously against 2 to 5 job offers with gap analysis.
* **Interview Simulator**: Interactive interview training (Technical, STAR Behavioral, Mixed) with instant feedback and scoring.
* **ATS Optimization**: 4 standard single-column templates, keyword auditing, and real-time score checker.
* **MCP Support**: Built-in Model Context Protocol client for local tool integrations.

---

## 🔒 Security & Privacy

* **100% Local**: All resumes, profiles, and data stay exclusively on your computer.
* **Encrypted Vault**: API keys and secrets are protected with AES-256-GCM hardware-derived encryption (`secrets.enc`).
* **Active AI Security**: Real-time detection of prompt injections and invisible Unicode characters in imported documents.
* **Zero Telemetry**: No tracking, analytics, or external requests other than your configured AI provider.

---

## 🛠️ Build from Source

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+)
* [Rust](https://www.rust-lang.org/) (v1.80+)

### Setup & Run
```bash
git clone https://github.com/Froizz7/Open-CV.git
cd Open-CV
npm install
npm run tauri dev
```

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.
