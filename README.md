# Frontend Mentor - IP address tracker solution

This is a solution to the [IP address tracker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for each page depending on their device's screen size
- See hover states for all interactive elements on the page
- See their own IP address on the map on the initial page load
- Search for any IP addresses or domains and see the key information and location

### Screenshot

![](./public/images/desktop-preview.jpg)

_Ganti dengan screenshot solusi Anda yang sebenarnya. Anda dapat menemukan file `desktop-preview.jpg` di folder `public/images` sebagai referensi atau ambil yang baru._

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- [React](https://react.dev/) - JS library
- [Vite](https://vitejs.dev/) - Build tool for React
- [Leaflet.js](https://leafletjs.com/) - Interactive maps JavaScript library
- [React-Leaflet](https://react-leaflet.js.org/) - React components for Leaflet maps
- [ipapi.co](https://ipapi.co/) - IP Geolocation API

### What I learned

Selama proses konversi proyek dari Vanilla JavaScript ke React Vite, saya banyak belajar tentang:

- **Konversi Proyek JavaScript ke React**: Mengadaptasi struktur HTML dan logika JavaScript (manipulasi DOM, event listener) ke dalam komponen React dengan `useState` dan `useEffect`.
- **Manajemen Aset Statis di Vite**: Memahami cara Vite menyajikan aset statis (gambar, favicon) dari folder `public` dan cara mereferensikannya menggunakan jalur absolut.
- **Penanganan CORS dengan Vite Proxy**: Mengatasi masalah Cross-Origin Resource Sharing (CORS) dengan mengonfigurasi proxy di `vite.config.js` untuk meneruskan permintaan API.
- **Penanganan Respons API yang Lebih Robust**: Mengimplementasikan penanganan kesalahan yang lebih baik untuk respons API, terutama ketika API mengembalikan respons non-JSON (seperti pesan "Too many requests") bahkan dengan status HTTP yang sukses.
- **Integrasi Peta dengan React-Leaflet**: Menggunakan pustaka `react-leaflet` untuk mengintegrasikan peta Leaflet secara deklaratif dan mengelola instance peta dan marker dalam state React. Ini termasuk penyesuaian zoom peta dan penggunaan `useMap` hook.

```jsx
// Contoh penggunaan react-leaflet untuk peta
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

function MapUpdater({ ipData }) {
  const map = useMap()
  useEffect(() => {
    if (ipData) {
      map.setView([ipData.latitude, ipData.longitude], 15)
    }
  }, [ipData, map])
  return null
}

// ... di dalam komponen App
;<MapContainer
  center={initialPosition}
  zoom={15}
  scrollWheelZoom={true}
  id="map"
>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {ipData && (
    <Marker
      position={[ipData.latitude, ipData.longitude]}
      icon={customLocationIcon}
    >
      <Popup>{ipData.ip}</Popup>
    </Marker>
  )}
  <MapUpdater ipData={ipData} />
</MapContainer>
```

```javascript
// Contoh konfigurasi proxy di vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://ipapi.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
```

### Continued development

Saya ingin terus fokus pada:

- Mengoptimalkan performa React, terutama untuk komponen peta yang mungkin kompleks.
- Meningkatkan penanganan error dan menampilkan pesan yang lebih ramah pengguna.
- Menambahkan pengujian unit dan integrasi untuk memastikan fungsionalitas yang kuat.
- Eksplorasi penggunaan React Context API atau Redux untuk manajemen state yang lebih kompleks jika aplikasi bertambah besar.

### Useful resources

- [Frontend Mentor](https://www.frontendmentor.io/) - Tantangan yang bagus untuk melatih keterampilan front-end.
- [ipapi.co Documentation](https://ipapi.co/documentation/) - Dokumentasi untuk API geolokasi IP.
- [Leaflet.js Documentation](https://leafletjs.com/reference.html) - Referensi untuk pustaka peta.
- [React-Leaflet Documentation](https://react-leaflet.js.org/docs/start-introduction/) - Dokumentasi untuk komponen React Leaflet.
- [Vite Official Documentation](https://vitejs.dev/guide/) - Panduan untuk build tool Vite, terutama bagian tentang Asset Handling dan Server Options (Proxy).

## Author

- Frontend Mentor - [@nama_pengguna_Anda](https://www.frontendmentor.io/profile/yourusername)
