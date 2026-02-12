import { Label } from "@/components/ui/label"
import { useState, useEffect, useRef, useMemo } from "react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Image } from "lucide-react"

export default function RequestPage() {
  const [form, setForm] = useState({
    type: "",
    address: "",
    description: "",
    phone: "",
    name: "",
    image: null as File | null,
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const TILEMAP_KEY = import.meta.env.VITE_TILEMAP_KEY

  // ================= MAP =================
  useEffect(() => {
    if (!mapContainer.current || !TILEMAP_KEY) return

    const map = new vietmapgl.Map({
      container: mapContainer.current,
      style: `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${TILEMAP_KEY}`,
      center: [106.70098, 10.77689],
      zoom: 13,
    })

    map.addControl(new vietmapgl.NavigationControl())
    mapRef.current = map

    return () => map.remove()
  }, [TILEMAP_KEY])

  // ================= IMAGE PREVIEW =================
  const preview = useMemo(() => {
    if (!form.image) return null
    return URL.createObjectURL(form.image)
  }, [form.image])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setForm((prev) => ({
      ...prev,
      image: file,
    }))
  }

  // ================= GEOLOCATION =================
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setForm((prev) => ({
          ...prev,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        }))

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 15,
          })

          if (markerRef.current) markerRef.current.remove()

          markerRef.current = new vietmapgl.Marker()
            .setLngLat([lng, lat])
            .addTo(mapRef.current)
        }
      },
      () => alert("Bạn chưa cấp quyền định vị")
    )
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("type", form.type)
    formData.append("address", form.address)
    formData.append("description", form.description)
    formData.append("phone", form.phone)
    formData.append("name", form.name)

    if (form.image) {
      formData.append("image", form.image)
    }

    await fetch("/api/request", {
      method: "POST",
      body: formData,
    })

    alert("Gửi yêu cầu thành công!")
  }

  return (
    <div className="flex h-full w-full">
      {/* LEFT FORM */}
      <div className="w-[420px] bg-white p-6 shadow-md overflow-y-auto">
        <h1 className="text-lg font-bold mb-4 text-center">
          Gửi thông tin cứu hộ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Phân loại */}
          <div>
            <Label>Phân loại</Label>
            <div className="mt-2 flex gap-2">
              {["Nhu yếu phẩm", "Cứu hộ", "Khác"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`rounded-full border px-4 py-1 text-sm transition ${
                    form.type === item
                      ? "bg-red-500 text-white"
                      : "hover:bg-red-300"
                  }`}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, type: item }))
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Vị trí */}
          <div>
            <Label>Vị trí</Label>
            <input
              type="text"
              className="mt-2 w-full rounded-md border px-3 py-2"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
            <button
              type="button"
              onClick={handleGetLocation}
              className="mt-2 w-full rounded-md bg-green-500 py-2 text-white hover:bg-green-600"
            >
              Lấy vị trí hiện tại
            </button>
          </div>

          {/* Mô tả */}
          <div>
            <Label>Tình trạng</Label>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-md border px-3 py-2"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Số điện thoại</Label>
            <input
              type="text"
              className="mt-2 w-full rounded-md border px-3 py-2"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </div>

          {/* Name */}
          <div>
            <Label>Họ và tên</Label>
            <input
              type="text"
              className="mt-2 w-full rounded-md border px-3 py-2"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          {/* Upload ảnh */}
          <div>
            <Label>Hình ảnh hiện trường</Label>

            {preview ? (
              <div className="relative mt-2">
                <img
                  src={preview}
                  alt="preview"
                  className="h-40 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, image: null }))
                  }
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                >
                  Xoá
                </button>
              </div>
            ) : (
              <>
                <Empty
                  onClick={() => inputRef.current?.click()}
                  className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-muted/40 p-6 text-center hover:bg-muted/60"
                >
                  <EmptyHeader className="items-center gap-3">
                    <EmptyMedia variant="icon">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle className="text-sm font-medium">
                      Tải ảnh lên
                    </EmptyTitle>
                  </EmptyHeader>
                </Empty>

                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-red-500 py-3 font-semibold text-white hover:bg-red-600"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>

      {/* RIGHT MAP */}
      <div className="flex-1 relative min-h-0">
        <div
          ref={mapContainer}
          className="absolute inset-0"
          style={{ width: "100%", height: "100vh" }}
        />
      </div>
    </div>
  )
}