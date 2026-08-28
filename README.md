<div align="center">

# 🧊 3D-Yogi

### *Portfolio 3D interaktif — WebGL, Three.js, scroll-driven*

[![Made With](https://img.shields.io/badge/Made%20with-Three.js-000?logo=three.js&style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/Stack-Svelte%205%20%2B%20Vite%205-FF3E00?logo=vite&style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-Private-lightgrey?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Active%20Build-2EA043?style=for-the-badge)](#)

[**🌐 Lihat Demo**](./showcase.html) · [**📂 Showcase Animasi**](./showcase.html) · [**💬 Kontak**](mailto:yogiprasetya907@gmail.com)

---

```
   ██╗   ██╗ ██████╗  ██████╗ ██╗
   ╚██╗ ██╔╝██╔═══██╗██╔════╝ ██║
    ╚████╔╝ ██║   ██║██║  ███╗██║
     ╚██╔╝  ██║   ██║██║   ██║██║
      ██║   ╚██████╔╝╚██████╔╝███████╗
      ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
```

**Yogi Prasetya Sadewa** · *Mahasiswa Ilmu Komputer · Web 3D Freelance*

</div>

---

## ✨ Tentang Project

**3D-Yogi** adalah portfolio pribadi berbasis WebGL yang mengambil fondasi dari [`igloo.inc`](https://www.igloo.inc) (template 3D WebGL open-source) lalu di-*kustomisasi* total dengan branding dan konten Yogi. Project ini bukan halaman statis — ini **scrolling experience** yang:

- 🌀 **Animasi partikel GPU** — shader fragment menghitung puluhan ribu fragmen per detik
- 🎯 **Scroll-driven 3D camera** — kamera terbang mengikuti spline CatmullRom berdasarkan posisi scroll
- 💎 **Floating cubes interaktif** — tiap cube punya inner geometry + shader material custom
- ⚡ **Hot-module reload Vite** — edit config → langsung lihat perubahan di browser
- 🌐 **Offline-first asset proxy** — `dist/assets/` lokal menang dari proxy `igloo.inc` (lihat `vite.config.js`)

Tujuan: **bikin situs yang bukan cuma dibaca, tapi bisa kamu rasain.**

---

## 🎬 Demo

> **Status:** Belum di-deploy ke hosting publik. Untuk lihat animasi showcase, [**buka `showcase.html`**](./showcase.html) langsung dari repo ini (file ini self-contained, tidak butuh server).

Untuk jalanin portfolio 3D aslinya di lokal:

```bash
cd igloo-local
npm install
npm run dev          # → http://localhost:3000
```

Output:

```
  VITE v5.4.0  ready in 423 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

Buka `http://localhost:3000/` di browser **desktop modern** (Chrome/Edge/Firefox versi terbaru, support WebGL2).

---

## 🖼️ Tampilan & Scene

Portfolio ini punya **5 scene utama** yang ditransisikan mulus saat scroll:

| # | Scene | File | Apa yang terjadi |
|---|-------|------|------------------|
| 11 | **Home** | `11-home-scene.js` | Skybox partikel biru, ground mesh, wind-noise shader, hero text manifesto |
| 12 | **Cubes** | `12-cubes-scene.js` | Grid 125 cube (50 mobile) mengambang, masing-masing dengan inner geometry berputar |
| 13 | **Entry** | `13-entry-scene.js` | Transisi masuk detail scene dengan depth-of-field |
| 14 | **UI** | `14-ui-scene.js` | Overlay 2D: logo, navigation, scroll indicator |
| 15 | **Detail** | `15-detail-scene.js` | Cube yang diklik → close-up + panel konten + social link |

### 3 Cube (Proyek Showcase)

| Cube | Judul | Outer Texture | Inner Model | Konten |
|------|-------|---------------|-------------|--------|
| 1 | **PORTFOLIO_YOGI Tentang Saya** | cube3 (Pudgy-textured) | pudgy (spinning) | Biodata, skills, kontak |
| 2 | **PORTFOLIO_YOGI_02 Skill & Proyek** | cube1 (Overpass-textured) | overpass_logo | Tech stack, projects list |
| 3 | **PORTFOLIO_CO_03 Abstract** | cube2 (Abstract crypto default) | abstractlogo | (Belum di-customize) |

> ⚠ Catatan: Cube 1 inner masih pakai Pudgy model (artifact dari Igloo template) — title sudah dikustom tapi inner geometry belum di-swap. Cube 3 masih default Igloo crypto branding — siap di-customize ke project Yogi.

---

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (WebGL2)                        │
│                                                             │
│   ┌─────────────┐    ┌──────────────────────────────────┐  │
│   │  index.html │───▶│  index-2eb69c09.js  (Svelte 5)   │  │
│   └─────────────┘    └──────────────┬───────────────────┘  │
│                                     │                       │
│                                     ▼                       │
│   ┌──────────────────────────────────────────────────────┐ │
│   │  App3D-f554a111.js  (assembled from 17 source parts) │ │
│   │  ┌──────────────────────────────────────────────┐    │ │
│   │  │ 17-router-facade.js                         │    │ │
│   │  │ 16-controller.js                            │    │ │
│   │  │ 15-detail-scene.js                          │    │ │
│   │  │ 14-ui-scene.js                              │    │ │
│   │  │ 13-entry-scene.js                           │    │ │
│   │  │ 12-cubes-scene.js ◀── 125 floating cubes   │    │ │
│   │  │ 11-home-scene.js ◀── skybox, hero text     │    │ │
│   │  │ 10-config-shaders.js ◀── ALL CONFIG HERE   │    │ │
│   │  │ 09-input-compositor.js                     │    │ │
│   │  │ 08-loaders-workers.js                      │    │ │
│   │  │ 07-shared-runtime.js (event bus)           │    │ │
│   │  │ 06..00 three.js vendor                     │    │ │
│   │  └──────────────────────────────────────────────┘    │ │
│   └──────────────────────────────────────────────────────┘ │
│                            │                                │
│                            ▼                                │
│   ┌──────────────────────────────────────────────────────┐ │
│   │           WebGL2 Context (ShaderMaterial)            │ │
│   │   • Per-cube GLSL fragment shader                   │ │
│   │   • KTX2 compressed textures                        │ │
│   │   • DRC compressed 3D models                        │ │
│   └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                BUILD PIPELINE (Vite + Custom)               │
│                                                             │
│  npm run dev / build                                        │
│       │                                                     │
│       ├─▶ prebuild: scripts/assemble-app3d.mjs              │
│       │     • Baca parts.json order                         │
│       │     • Concat 17 files → public/App3D-f554a111.js    │
│       │     • Sync loader → public/index-2eb69c09.js        │
│       │                                                     │
│       ├─▶ vite build                                        │
│       │     • Compile Svelte 5 components                    │
│       │     • Bundle to dist/                                │
│       │                                                     │
│       └─▶ dev server (port 3000)                            │
│             • Proxy /assets/* → local-first, fallback proxy │
│             • HMR enabled                                   │
└─────────────────────────────────────────────────────────────┘
```

### Kenapa file Igloo dipecah jadi 17 bagian?

Igloo original `app3D.js` adalah satu **ES module raksasa** (~2.1 MB) yang **deklarasinya share satu lexical scope** — semua class dan constant hidup di scope yang sama. Kalau di-bundle Vite, semua symbol jadi minified. Solusinya: split ke `public/app3d/00..17` (sesuai `parts.json`), lalu `scripts/assemble-app3d.mjs` concat ulang sesuai urutan. Hasilnya: **bisa diedit per file, masih jalan sebagai single bundle**.

Lihat dokumentasi lengkap: [`igloo-local/public/app3d/README.md`](./igloo-local/public/app3d/README.md)

---

## 🛠️ Tech Stack

### Frontend Core

| Layer | Library | Versi | Kenapa |
|-------|---------|-------|--------|
| 3D Rendering | **Three.js** | 0.158+ | Standar industri WebGL |
| Framework | **Svelte 5** | ^5.0 | Reactive, compile-time, ringan |
| Build Tool | **Vite** | ^5.4 | HMR cepat, ESM native |
| Router | Vendor mini | (built-in) | Hash-based, 2 routes |

### Content Pipeline

| Layer | Tool | Output |
|-------|------|--------|
| Texture compression | KTX2 + Basis Universal | `.ktx2` (10× smaller dari PNG) |
| Mesh compression | Draco | `.drc` (compressed geometry) |
| Shader | GLSL fragment | Custom per-cube material |

### AI-Assisted Workflow

Stack development project ini sendiri **full AI-assisted**:

| AI Tool | Peran |
|---------|-------|
| **Claude Code** | Arsitek, perencana, refactor |
| **OpenCode + OpenRouter** | Eksekusi multi-model |
| **Obsidian** | Vault dokumentasi & catatan |
| **DeepSeek / GLM / Kimi / Claude** | Tiap model buat task spesifik |
| **Kiro / VS Code** | Prototyping cepat |

---

## 📁 Struktur Repo

```
3D-Yogi/
├── README.md                         ← kamu di sini
├── showcase.html                     ← landing animasi (open this!)
├── .gitignore
│
├── app3D.js                          ← archived Igloo original (2.1 MB)
├── index.js                          ← archived public loader original
│
└── igloo-local/                      ← workspace development
    ├── package.json
    ├── vite.config.js                ← proxy logic + plugin local-first
    ├── jsconfig.json
    │
    ├── public/
    │   ├── App3D-f554a111.js         ← assembled runtime (output)
    │   ├── index-2eb69c09.js         ← Svelte loader (output)
    │   ├── index.html                ← entry HTML
    │   ├── assets/                   ← logo KTX2 (fallback proxy)
    │   └── app3d/                    ← 17 source parts (EDIT HERE)
    │       ├── 00-three-vendor-01.js  ← Three.js core
    │       ├── 01..06-three-vendor.js ← Three.js extensions
    │       ├── 07-shared-runtime.js   ← Event bus (Q)
    │       ├── 08-loaders-workers.js  ← Asset loader + Worker
    │       ├── 09-input-compositor.js ← Renderer + input
    │       ├── 10-config-shaders.js   ← ★ SEMUA CONFIG KONTEN ★
    │       ├── 11-home-scene.js
    │       ├── 12-cubes-scene.js
    │       ├── 13-entry-scene.js
    │       ├── 14-ui-scene.js
    │       ├── 15-detail-scene.js
    │       ├── 16-controller.js
    │       ├── 17-router-facade.js
    │       ├── parts.json            ← concat order
    │       └── README.md              ← assembly docs
    │
    ├── scripts/
    │   └── assemble-app3d.mjs        ← 17 → 1 bundler
    │
    └── dist/                         ← build output (gitignored)
        ├── index.html
        └── assets/
            ├── index-[hash].js
            └── images/ui/logo-datatexture.ktx2
```

---

## ⚙️ Cara Kerja Singkat

### 1. Customization Flow

Semua **konten personal** hidup di satu file:

```js
// igloo-local/public/app3d/10-config-shaders.js
export const Be = {
    manifesto: {
        title: "////// Hello",
        text: "Hi, I'm Yogi. Welcome to my corner of the internet."
    },
    cubes: [
        {
            title: "PORTFOLIO_YOGI Tentang Saya",
            hash: "pudgy-penguins",  // ← TODO: ganti ke "tentang-saya"
            obj: "cube3",
            innerobject: "pudgy",    // ← TODO: ganti ke neutral geometry
            interior: {
                enabled: true,
                content: `Saya Yogi Prasetya Sadewa...`
            }
        }
    ]
};
```

Edit satu file → HMR Vite refresh otomatis → preview langsung berubah.

### 2. Asset Loading

Vite dev server punya **local-first proxy** untuk assets:

```js
// vite.config.js
server.middlewares.use('/assets', (req, res, next) => {
    const localPath = path.join('dist/assets', req.url);
    if (fs.existsSync(localPath)) {
        fs.createReadStream(localPath).pipe(res);  // serve lokal
    } else {
        next();  // fallback ke https://www.igloo.inc/assets/
    }
});
```

Artinya: kalau taruh KTX2/DRC di `igloo-local/dist/assets/`, **offline-safe** (Igloo.inc down = tetap jalan).

### 3. Scroll → Camera Animation

```js
// 16-controller.js (simplified)
this.scroll.targetY1 = lerpFPSLimited(
    this.scroll.targetY1,    // current
    this.scroll.targetY2,    // target (dari wheel event)
    0.075,                   // damping
    100 * scrollMultiplier   // speed
);
```

Scroll wheel → `targetY2` update → `targetY1` lerp ke target → camera position mengikuti spline CatmullRom → scene kelihatan "terbang".

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x (cek: `node --version`)
- **Browser** modern dengan **WebGL2** support (Chrome 90+, Edge 90+, Firefox 90+, Safari 15+)
- **GPU** yang tidak ada di blacklist (cek [webglreport.com](https://webglreport.com))

### Setup Lokal

```bash
# 1. Clone repo
git clone https://github.com/axolotl-void/3D-Yogi.git
cd 3D-Yogi

# 2. Masuk workspace & install
cd igloo-local
npm install

# 3. Assemble runtime (concat 17 parts)
npm run assemble

# 4. Jalankan dev server
npm run dev
# → http://localhost:3000
```

### Production Build

```bash
npm run build
# → igloo-local/dist/
```

Output siap deploy ke static hosting (Vercel, Netlify, GitHub Pages).

### Verify Assembly

```bash
npm run verify:app3d
```

Pastikan semua 17 parts di `parts.json` ada dan urutan concatenation valid.

---

## 📸 Roadmap

- [ ] **Customize cube 1 inner** — ganti Pudgy model ke neutral geometry atau brand Yogi
- [ ] **Customize cube 3** — saat ini masih default Igloo crypto branding
- [ ] **Bundle offline assets** — download 40+ KTX2/DRC ke `dist/assets/` (1-2 jam)
- [ ] **Fix cube 1 hash** — `pudgy-penguins` → `tentang-saya`
- [ ] **Translate manifesto ke Bahasa Indonesia** — saat ini masih English
- [ ] **Update social bar** — `Be.social[]` masih `twitter.com/iglooinc`
- [ ] **Deploy showcase.html** ke GitHub Pages
- [ ] **Deploy dist/** ke Vercel/Netlify untuk live demo

---

## 👤 Author

**Yogi Prasetya Sadewa**

| Channel | Link |
|---------|------|
| 🌐 Portfolio (live soon) | *Deploying...* |
| 📧 Email | yogiprasetya907@gmail.com |
| 💼 LinkedIn | [linkedin.com/in/yogi-prasetya-036b46323](https://www.linkedin.com/in/yogi-prasetya-036b46323) |
| 📷 Instagram | [@gik_prasetya](https://www.instagram.com/gik_prasetya) |
| 🐙 GitHub | [axolotl-void](https://github.com/axolotl-void) |
| 📱 WhatsApp | [+62 812-6031-2799](https://wa.me/6281260312799) |

### Current Projects

- 🎊 [undangan.zegika.com](https://undangan.zegika.com) — undangan pernikahan digital Jepang
- 📊 [lkps.zegika.com](https://lkps.zegika.com) — sistem informasi akademik
- 🎨 **portowebGL** (this project) — portfolio 3D in progress
- 🎌 WebGL-Kage — undangan Jepang procedural 3D

---

## 🙏 Credits & Acknowledgments

Project ini **forked & customized** dari:

- **[Igloo Inc](https://www.igloo.inc)** — original 3D portfolio template (WebGL + Svelte)
  - Source: [`www.igloo.inc/assets/app3D.js`](https://www.igloo.inc) (dimirror di `igloo-local/`)
  - Lisensi: Cek [`igloo.inc`](https://www.igloo.inc) untuk terms of use
  - Architecture: 17-part split + custom Vite assembler = modification oleh Yogi

### Built With

- [Three.js](https://threejs.org/) — WebGL rendering
- [Svelte](https://svelte.dev/) — UI framework
- [Vite](https://vitejs.dev/) — build tool
- [KTX2 / Basis Universal](https://github.com/BinomialLLC/basis_universal) — texture compression
- [Draco](https://github.com/google/draco) — mesh compression

### AI Tools

Developed with assistance from:
- Anthropic Claude (Claude Code)
- OpenCode + OpenRouter (multi-model orchestration)
- Obsidian (knowledge vault)

---

## 📄 License

**Private project** — © 2026 Yogi Prasetya Sadewa · [ZEGIKA.COM](https://www.zegika.com)

Underlying Igloo Inc template: subject to original author's terms (see [igloo.inc](https://www.igloo.inc)).

---

<div align="center">

```
   ╔════════════════════════════════════════════════════════╗
   ║  "Bikin situs yang bukan cuma dibaca, tapi dirasain."  ║
   ╚════════════════════════════════════════════════════════╝
```

**[⬆ Back to Top](#-3d-yogi)** · Made with 🧊 by Yogi

</div>
