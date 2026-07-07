<div align="center">
  <img src="public/logo.svg" alt="AniXFlix Logo" width="300" />
  
  <br />
  <br />

  **The ultimate next-generation open-source cinematic streaming platform and TMDB indexer.**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State-yellow?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
  [![TMDB API](https://img.shields.io/badge/TMDB-API-01B4E4?style=for-the-badge&logo=themoviedb)](https://www.themoviedb.org/)

  <br />
  <p align="center">
    <a href="#features">✨ Features</a> •
    <a href="#architecture">🏗️ Architecture</a> •
    <a href="#getting-started">🚀 Getting Started</a> •
    <a href="#legal--dmca">⚖️ Legal</a>
  </p>
</div>

---

## 🌟 Overview

**AniXFlix** is a state-of-the-art, high-performance streaming directory built from the ground up using **Next.js App Router**, **React**, and **Tailwind CSS**. 

Designed to mimic the premium aesthetics of enterprise streaming giants, AniXFlix acts as an automated search engine and indexer, instantly aggregating metadata from TMDB and seamlessly routing it through beautiful, dynamic UIs.

> **Note:** AniXFlix is an indexer. It does **not** host, store, or stream any media files on its servers.

---

## ✨ Features

- 🎨 **Premium Aesthetic**: A masterfully crafted, pixel-perfect UI featuring glassmorphism, dynamic gradients, slick micro-animations, and a responsive layout that looks breathtaking on every device from mobile to 4K TVs.
- ⚡ **Dynamic Image Proxy**: Custom built Next.js API Routes acting as image proxies. It resolves English titled backdrops from TMDB on the fly via 302 redirects, perfectly dodging rate limits while eliminating client-side UI flashes.
- 🎬 **Infinite Catalog**: Deep integration with the TMDB API to pull trending movies, series, top-rated lists, cast details, similar content, and dynamic streaming provider data (e.g., Netflix, Prime, Hulu tabs).
- 💾 **Local First State**: Fully client-side Watchlist and History tracking powered by Zustand and LocalStorage. Your data stays completely private on your device.
- 🔍 **Global Search**: An instant, debounced, globally accessible search modal that queries movies, tv shows, and cast members simultaneously.
- 📱 **Mobile Optimized & APK Ready**: Flawless responsive design that adapts beautifully to Android screens, complete with immersive fullscreen mode and tailored mobile layouts.
- 🎭 **Immersive Title Pages**: Gorgeous detail pages featuring ultra-widescreen hero banners, cast lists, trailers, and seamless transitions into the integrated video player interface.

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: Zustand
- **Data Source**: TMDB API (Server-side rendering & Client-side fetching)

### The Image Proxy Innovation
TMDB list endpoints (like `/trending/movie/day`) only return textless backdrops. To achieve the premium look of localized, titled English backdrops without destroying server load times (120+ requests per page), AniXFlix utilizes a custom Next.js Edge proxy (`/api/images/[type]/[id]`). 

Images are natively lazy-loaded by the browser. When the `<Image>` requests the URL, our API intercepts it, dynamically fetches the detailed TMDB object, resolves the best English titled backdrop, and returns a cache-controlled `302 Redirect` to the TMDB CDN. 
**Result:** Instant load times, zero TMDB rate limits, and zero UI flashes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- A free API Key from [TMDB (The Movie Database)](https://www.themoviedb.org/documentation/api)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AniXDex/AniXFlix.git
   cd AniXFlix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your TMDB API Key:
   ```env
   TMDB_API_KEY=your_v3_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to experience AniXFlix!

---

## ⚖️ Legal & DMCA

**AniXFlix** is a demonstration project and acts purely as an automated search engine and indexer. 

- **No File Hosting**: We do **NOT** host, upload, or manage any video files, media, or content on our own servers. 
- **Safe Harbor**: All video content found via AniXFlix is embedded from third-party services and APIs. We have absolutely no control over the content hosted on these third-party servers. 
- **DMCA**: Any legal concerns regarding the media itself must be taken up with the actual file hosts and providers. However, we are fully committed to complying with the DMCA and will promptly remove links/indexes to infringing content upon receiving a valid notification.

For DMCA takedown requests regarding indexed links, please open an issue or contact us via this GitHub repository.

---

<div align="center">
  <i>Built with passion by <a href="https://github.com/anixdex">AniXDex</a></i>
</div>
