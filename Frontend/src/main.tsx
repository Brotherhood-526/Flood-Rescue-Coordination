import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MapProvider } from "@/lib/MapProvider"
import { router } from "./router"
import "@/index.css"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <MapProvider>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <RouterProvider router={router} />
    </MapProvider>
  </QueryClientProvider>
)
