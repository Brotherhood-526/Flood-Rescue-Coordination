import { useEffect, useRef } from "react"
import { ArrowBigLeft } from "lucide-react"
import { useVietMap } from "@/lib/MapProvider.tsx"
import vietmapgl from "@vietmap/vietmap-gl-js"

const DEFAULT_CENTER: [number, number] = [106.7009, 10.7769]

const USER_LOCATIONS: [number, number][] = [
  [106.6297, 10.8231],
  [106.6577, 10.8453],
  [106.6936, 10.7314],
  [106.7143, 10.8012],
  [106.6723, 10.7560],
  [106.7430, 10.8655],
]

const TEAM_LOCATIONS: [number, number][] = [
  [106.7009, 10.7769],
  [106.6670, 10.8380],
  [106.6350, 10.7904],
  [106.6298, 10.7432],
  [106.8030, 10.8700],
]

export default function FullMapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const { map, mount } = useVietMap()

  useEffect(() => {
    if (!mapContainer.current) return
    mount(mapContainer.current)
  }, [mount])

  useEffect(() => {
    if (!map) return

    // Center map
    map.flyTo({
      center: DEFAULT_CENTER,
      zoom: 13,
    })

    // Clear old markers nếu cần
    // (nếu MapProvider có clearMarkers thì dùng)

    // Team markers (màu xanh)
    TEAM_LOCATIONS.forEach((position) => {
      const el = document.createElement("div")
      el.className = "w-4 h-4 bg-blue-600 rounded-full border-2 border-white"

      new vietmapgl.Marker({ element: el })
        .setLngLat(position)
        .addTo(map)
    })

    // User markers (màu đỏ)
    USER_LOCATIONS.forEach((position) => {
      const el = document.createElement("div")
      el.className = "w-4 h-4 bg-red-600 rounded-full border-2 border-white"

      new vietmapgl.Marker({ element: el })
        .setLngLat(position)
        .addTo(map)
    })

  }, [map])

  return (
    <>
      <div className="w-screen h-screen">
        <div
          ref={mapContainer}
          className="h-full w-full"
        />
      </div>

      <ArrowBigLeft
        className="fixed top-[11vh] left-[0.5vw] z-[999] w-10 h-10 p-2 rounded-full
        bg-white border border-black/20 transition-all duration-200
        hover:bg-gray-100 hover:border-2 hover:border-gray-400 cursor-pointer"
        strokeWidth={1.5}
      />
    </>
  )
}