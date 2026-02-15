import { createContext, useCallback, useContext, useRef, useState } from "react"
import vietmapgl from "@vietmap/vietmap-gl-js"

type Theme = "light" | "dark"

interface MapContextType {
  map: vietmapgl.Map | null
  mapLoaded: boolean
  mount: (container: HTMLElement) => void
  unmount: () => void
}

const MapContext = createContext<MapContextType>({
  map: null,
  mapLoaded: false,
  mount: () => {},
  unmount: () => {},
})

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const mapRef = useRef<vietmapgl.Map | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const TILEMAP_KEY = import.meta.env.VITE_TILEMAP_KEY
  const theme: Theme = "light" 

  const buildStyleUrl = () =>
    `https://maps.vietmap.vn/api/maps/${theme}/styles.json?apikey=${TILEMAP_KEY}`

  const destroyMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
    containerRef.current = null
    setMapLoaded(false)
  }, [])

  const mount = useCallback(
    (container: HTMLElement) => {
      if (!TILEMAP_KEY) 
        return
      if (mapRef.current && containerRef.current === container) 
        return
      if (mapRef.current && containerRef.current !== container) {
        destroyMap()
      }
      const hcmBounds: [number, number][] = [
        [106.3500, 10.3500],
        [107.1500, 11.1500]
      ];

      const map = new vietmapgl.Map({
        container,
        style: buildStyleUrl(),
        center: [106.70098, 10.77689],
        zoom: 13,
        maxBounds: hcmBounds,
      })
      map.setMinZoom(10);
      
      map.addControl(new vietmapgl.NavigationControl())

      map.on("load", () => {
        setMapLoaded(true)
      })

      mapRef.current = map
      containerRef.current = container
    },
    [TILEMAP_KEY, destroyMap]
  )

  const unmount = useCallback(() => {
    
    destroyMap()
  }, [destroyMap])

  return (
    <MapContext.Provider
      value={{
        map: mapRef.current,
        mapLoaded,
        mount,
        unmount,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useVietMap = () => useContext(MapContext)