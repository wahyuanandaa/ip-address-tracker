import { useState, useEffect } from "react"
import "./App.css"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet" // Import L object for custom icon

function App() {
  const [ipData, setIpData] = useState(null)
  const [ipInput, setIpInput] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [localIp, setLocalIp] = useState(null)

  const fetchIpData = async (ipAddress = "") => {
    setIsLoading(true)
    setError(null)

    try {
      const url = ipAddress
        ? `https://ipapi.co/${ipAddress}/json/`
        : "https://ipapi.co/json/"

      const res = await fetch(url)

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

      if (!data) {
        throw new Error("API returned no valid data.")
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
    } finally {
      setIsLoading(false)
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
    // Get local IP
    getLocalIp()
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
    iconUrl: "/ip-address-tracker/images/icon-location.svg",
    iconSize: [35, 35],
    iconAnchor: [15, 15]
  })

  const initialPosition = [20, 0] // Posisi awal menampilkan peta dunia

  // Fungsi untuk mendapatkan IP lokal
  const getLocalIp = async () => {
    try {
      // Menggunakan WebRTC untuk mendapatkan IP lokal
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      })

      pc.createDataChannel("")
      pc.createOffer().then((offer) => pc.setLocalDescription(offer))

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
          const match = ipRegex.exec(event.candidate.candidate)
          if (match) {
            const ip = match[1]
            // Filter IP lokal (bukan public IP)
            if (
              ip.startsWith("192.168.") ||
              ip.startsWith("10.") ||
              ip.startsWith("172.")
            ) {
              setLocalIp(ip)
            }
          }
        }
      }
    } catch (err) {
      console.log("Tidak bisa mendapatkan IP lokal:", err)
    }
  }

  return (
    <main>
      <div className="top">
        <h1 className="title">IP Address Tracker</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            id="ip-input"
            autoFocus
            placeholder="Search for any IP address or domain (e.g., 8.8.8.8, google.com)"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
          />
          <button type="submit">
            <img
              src="/ip-address-tracker/images/icon-arrow.svg"
              alt="Submit Button"
            />
          </button>
        </form>
        <div className="info" id="info">
          <div className="box ip-info-box">
            <span className="field-name">ip address (public)</span>
            <span className="info-field" id="ip-info">
              {isLoading
                ? "Detecting your IP..."
                : ipData?.ip || "Not available"}
            </span>
          </div>
          {localIp && (
            <div
              className="box ip-info-box"
              style={{ backgroundColor: "#f0f0f0" }}
            >
              <span className="field-name">ip address (local)</span>
              <span className="info-field" id="local-ip-info">
                {localIp}
              </span>
            </div>
          )}
          <div className="box location-info-box">
            <span className="field-name">location</span>
            <span className="info-field" id="location-info">
              {isLoading
                ? "Getting your location..."
                : ipData
                ? `${ipData.city}, ${ipData.region}, ${ipData.country_name}`
                : "Not available"}
            </span>
          </div>
          <div className="box timezone-info-box">
            <span className="field-name">timezone</span>
            <span className="info-field" id="timezone-info">
              {isLoading
                ? "Detecting timezone..."
                : ipData
                ? `UTC: ${ipData.utc_offset?.slice(0, 3) || ""}:${
                    ipData.utc_offset?.slice(3) || ipData.timezone
                  }`
                : "Not available"}
            </span>
          </div>
          <div className="box isp-info-box">
            <span className="field-name">isp</span>
            <span className="info-field" id="isp-info">
              {isLoading ? "Detecting ISP..." : ipData?.org || "Not available"}
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
        zoom={2}
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
    </main>
  )
}

export default App
