import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { MapProvider } from "@/lib/MapProvider"
import { router } from "./router"
import "@/index.css"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <MapProvider>
    <RouterProvider router={router} />
  </MapProvider>
)