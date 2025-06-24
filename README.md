# Frontend Mentor - IP address tracker solution

This is a solution to the [IP address tracker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [Fitur](#fitur)
  - [Screenshot](#screenshot)
  - [Demo](#demo)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Instalasi dan Penggunaan](#instalasi-dan-penggunaan)
- [Fitur Utama](#fitur-utama)
- [API yang Digunakan](#api-yang-digunakan)
- [Deployment](#deployment)
- [Struktur Proyek](#struktur-proyek)
- [Pembelajaran](#pembelajaran)
- [Pengembangan Selanjutnya](#pengembangan-selanjutnya)

## Overview

### Fitur

- 🌍 **Deteksi IP Otomatis**: Menampilkan IP publik pengguna secara otomatis saat halaman dimuat
- 🔍 **Pencarian IP/Domain**: Mencari informasi detail untuk alamat IP atau domain tertentu
- 📍 **Peta Interaktif**: Menampilkan lokasi geografis menggunakan Leaflet.js dengan OpenStreetMap
- 📱 **Responsive Design**: Tampilan optimal untuk desktop, tablet, dan mobile
- 🌐 **Deteksi IP Lokal**: Menampilkan IP lokal jaringan pengguna menggunakan WebRTC
- ⚡ **Loading States**: Indikator loading yang informatif selama proses pencarian
- 🎨 **Modern UI**: Desain yang bersih dan modern dengan hover effects
- 🔄 **Real-time Updates**: Peta dan informasi diperbarui secara real-time
- 🛡️ **Error Handling**: Penanganan error yang robust untuk berbagai skenario
- 📊 **Detailed Information**: Menampilkan IP, lokasi, ISP, timezone, dan informasi lainnya

### Screenshot

![Desktop Preview](./public/images/desktop-preview.jpg)

### Demo

- **Live Demo**: [GitHub Pages](https://your-username.github.io/ip-address-tracker-master/)
- **Repository**: [GitHub Repository](https://github.com/your-username/ip-address-tracker-master)

## Teknologi yang Digunakan

### Frontend

- **React 18** - Library JavaScript untuk UI
- **Vite** - Build tool dan development server
- **CSS3** - Styling dengan custom properties dan Flexbox
- **HTML5** - Semantic markup

### Maps & Geolocation

- **Leaflet.js** - Library peta interaktif
- **React-Leaflet** - Komponen React untuk Leaflet
- **OpenStreetMap** - Provider tile peta gratis

### APIs

- **ipapi.co** - API geolokasi IP untuk informasi detail
- **WebRTC** - Deteksi IP lokal jaringan

### Development Tools

- **ESLint** - Linting JavaScript
- **pnpm** - Package manager

## Instalasi dan Penggunaan

### Prerequisites

- Node.js (versi 16 atau lebih baru)
- pnpm (atau npm/yarn)

### Setup

```bash
# Clone repository
git clone https://github.com/your-username/ip-address-tracker-master.git
cd ip-address-tracker-master

# Install dependencies
pnpm install

# Jalankan development server
pnpm dev

# Build untuk production
pnpm build

# Preview build production
pnpm preview
```

## Fitur Utama

### 1. Deteksi IP Otomatis

Aplikasi secara otomatis mendeteksi dan menampilkan IP publik pengguna saat halaman pertama kali dimuat, beserta informasi geografis lengkap.

```jsx
useEffect(() => {
  const fetchInitialIP = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/json/")
      const data = await response.json()
      setIpData(data)
    } catch (error) {
      console.error("Error fetching initial IP:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchInitialIP()
}, [])
```

### 2. Pencarian IP/Domain

Pengguna dapat mencari informasi detail untuk alamat IP atau domain tertentu dengan validasi input yang robust.

```jsx
const handleSearch = async (searchTerm) => {
  setLoading(true)
  try {
    const response = await fetch(`/api/${searchTerm}/json/`)
    const data = await response.json()
    setIpData(data)
  } catch (error) {
    setError("Invalid IP address or domain")
  } finally {
    setLoading(false)
  }
}
```

### 3. Deteksi IP Lokal

Menggunakan WebRTC untuk mendeteksi IP lokal jaringan pengguna, memberikan perbedaan antara IP publik dan lokal.

```jsx
const getLocalIP = async () => {
  try {
    const pc = new RTCPeerConnection()
    pc.createDataChannel("")
    pc.createOffer().then((offer) => pc.setLocalDescription(offer))

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const ip = event.candidate.candidate.split(" ")[4]
        if (ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
          setLocalIP(ip)
          pc.close()
        }
      }
    }
  } catch (error) {
    console.error("Error getting local IP:", error)
  }
}
```

### 4. Peta Interaktif dengan React-Leaflet

Integrasi peta yang seamless menggunakan React-Leaflet dengan custom markers dan dynamic updates.

```jsx
<MapContainer center={initialPosition} zoom={15} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {ipData && (
    <Marker position={[ipData.latitude, ipData.longitude]} icon={customIcon}>
      <Popup>{ipData.ip}</Popup>
    </Marker>
  )}
  <MapUpdater ipData={ipData} />
</MapContainer>
```

### 5. State Management dengan React Hooks

Penggunaan useState dan useEffect untuk manajemen state yang efisien dan lifecycle management.

### 6. Responsive Design

Layout yang responsif menggunakan CSS Flexbox dan media queries untuk pengalaman optimal di semua device.

## API yang Digunakan

### ipapi.co

- **Endpoint**: `https://ipapi.co/{ip}/json/`
- **Fitur**: Geolokasi IP, informasi ISP, timezone, dll
- **Rate Limit**: 1,000 requests/day (gratis)

### WebRTC (Local IP Detection)

- **Teknologi**: RTCPeerConnection
- **Fitur**: Deteksi IP lokal jaringan
- **Kompatibilitas**: Modern browsers

## Deployment

### GitHub Pages

```bash
# Build project
pnpm build

# Deploy ke GitHub Pages
# Upload isi folder 'dist' ke branch gh-pages
```

### Konfigurasi Vite

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: "/ip-address-tracker-master/", // Sesuaikan dengan nama repo
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

## Struktur Proyek

```
ip-address-tracker-master/
├── public/
│   └── images/          # Assets statis
├── src/
│   ├── App.jsx         # Komponen utama
│   ├── App.css         # Styling utama
│   └── main.jsx        # Entry point
├── package.json        # Dependencies
├── vite.config.js      # Konfigurasi Vite
└── README.md          # Dokumentasi
```

## Pembelajaran

### Konversi Vanilla JavaScript ke React

- **State Management**: Mengadaptasi DOM manipulation tradisional ke React state management dengan useState
- **Lifecycle Management**: Menggunakan useEffect untuk side effects dan API calls
- **Event Handling**: Mengubah event listeners menjadi React event handlers
- **Component Architecture**: Memecah UI menjadi komponen yang reusable dan maintainable

### Integrasi Peta dengan React-Leaflet

- **React Integration**: Menggunakan react-leaflet untuk integrasi yang lebih natural dengan React
- **Custom Markers**: Implementasi custom marker icons untuk visual yang lebih menarik
- **Dynamic Updates**: Menggunakan useMap hook untuk update peta secara dinamis
- **Map State Management**: Mengelola state peta dalam React component

### Penanganan API dan Error Handling

- **Proxy Configuration**: Menggunakan Vite proxy untuk mengatasi CORS issues di development
- **Robust Error Handling**: Implementasi try-catch yang comprehensive untuk berbagai error scenarios
- **Loading States**: UX yang lebih baik dengan loading indicators
- **API Response Validation**: Validasi response API sebelum update state

### Build dan Deployment

- **Vite Configuration**: Konfigurasi base path untuk GitHub Pages deployment
- **Asset Management**: Penanganan static assets di Vite build process
- **Production Optimization**: Optimisasi untuk production build
- **Environment Handling**: Perbedaan konfigurasi untuk development dan production

### Modern React Patterns

- **Functional Components**: Penggunaan functional components dengan hooks
- **Custom Hooks**: Potensi untuk extract logic ke custom hooks
- **Performance Optimization**: Memoization dan optimization techniques
- **Code Organization**: Struktur kode yang clean dan maintainable

### WebRTC Integration

- **Local IP Detection**: Implementasi WebRTC untuk deteksi IP lokal
- **Browser Compatibility**: Handling untuk browser yang tidak support WebRTC
- **Error Handling**: Graceful fallback ketika WebRTC tidak tersedia

## Pengembangan Selanjutnya

### Fitur yang Direncanakan

- [ ] **History Pencarian**: Menyimpan riwayat pencarian IP
- [ ] **Export Data**: Export informasi IP ke CSV/JSON
- [ ] **Multiple Map Providers**: Opsi provider peta (Google Maps, Mapbox)
- [ ] **Dark Mode**: Toggle tema gelap/terang
- [ ] **Offline Support**: Service worker untuk caching
- [ ] **Unit Tests**: Testing dengan Jest dan React Testing Library

### Optimisasi

- [ ] **Performance**: Lazy loading untuk komponen peta
- [ ] **Accessibility**: ARIA labels dan keyboard navigation
- [ ] **SEO**: Meta tags dan structured data
- [ ] **PWA**: Progressive Web App features

---

**Dibuat dengan ❤️ menggunakan React dan Vite**
