import { useState, useEffect } from "react"
import "./App.css"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet" // Import L object for custom icon

function App() {
  const [ipData, setIpData] = useState(null)
  const [ipInput, setIpInput] = useState("")
  const [error, setError] = useState(null)

  const fetchIpData = async (ipAddress = "") => {
    try {
      const res = await fetch(`/api/${ipAddress}/json/`)

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`API Error: ${res.status} - ${errorText}`)
      }

      let data
      try {
        data = await res.json()
      } catch {
        const errorText = await res.text()
        throw new Error(`API Response Error: ${errorText}`)
      }

      if (data.error) {
        throw new Error(data.reason)
      }

      setIpData(data)
    } catch (err) {
      setError(err.message)
      // Show modal
      const modal = document.getElementById("modal")
      if (modal) modal.showModal()
    }
  }

  // Komponen pembantu untuk memperbarui peta saat ipData berubah
  function MapUpdater({ ipData }) {
    const map = useMap()

    useEffect(() => {
      if (ipData) {
        map.setView([ipData.latitude, ipData.longitude], 15)
      }
    }, [ipData, map])

    return null
  }

  useEffect(() => {
    // Initial fetch
    fetchIpData()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchIpData(ipInput)
    setIpInput("") // Clear input after submission
  }

  const closeModal = () => {
    setError(null)
    const modal = document.getElementById("modal")
    if (modal) modal.close()
  }

  const customLocationIcon = L.icon({
    iconUrl: "/images/icon-location.svg",
    iconSize: [35, 35],
    iconAnchor: [15, 15]
  })

  const initialPosition = [0, 0] // Posisi awal sebelum data IP dimuat

  return (
    <main>
      <div className="top">
        <h1 className="title">IP Address Tracker</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            id="ip-input"
            autoFocus
            placeholder="Search for any IP address or domain"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
          />
          <button type="submit">
            <img src="/images/icon-arrow.svg" alt="Submit Button" />
          </button>
        </form>
        <div className="info" id="info">
          <div className="box ip-info-box">
            <span className="field-name">ip address</span>
            <span className="info-field" id="ip-info">
              {ipData?.ip || "Loading..."}
            </span>
          </div>
          <div className="box location-info-box">
            <span className="field-name">location</span>
            <span className="info-field" id="location-info">
              {ipData
                ? `${ipData.city}, ${ipData.region}, ${ipData.country_name}`
                : "Loading..."}
            </span>
          </div>
          <div className="box timezone-info-box">
            <span className="field-name">timezone</span>
            <span className="info-field" id="timezone-info">
              {ipData
                ? `UTC: ${ipData.utc_offset?.slice(0, 3) || ""}:${
                    ipData.utc_offset?.slice(3) || ipData.timezone
                  }`
                : "Loading..."}
            </span>
          </div>
          <div className="box isp-info-box">
            <span className="field-name">isp</span>
            <span className="info-field" id="isp-info">
              {ipData?.org || "Loading..."}
            </span>
          </div>
        </div>
      </div>

      <dialog id="modal">
        <h2>
          <i className="fas fa-exclamation-triangle"></i> OH SNAP
        </h2>
        <p id="error-message">{error}</p>
        <button id="close-btn" onClick={closeModal}>
          Close
        </button>
      </dialog>

      <MapContainer
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

      <footer className="footer">
        <p>
          Engineered with love by{" "}
          <a
            href="https://github.com/himanshuat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Himanshu Tegyalwar
          </a>
        </p>
        <div className="social">
          <a
            href="https://www.facebook.com/himanshu.tegyalwar"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://www.instagram.com/himaanshu.at"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://twitter.com/himanshuat_"
            aria-label="X(formerly Twitter)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/himanshu-tegyalwar"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </footer>
    </main>
  )
}

export default App
