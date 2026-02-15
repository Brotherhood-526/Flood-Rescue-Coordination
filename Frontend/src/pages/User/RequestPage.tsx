import { Label } from "@/components/ui/label"
import { useEffect, useRef, useMemo } from "react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Image, Locate } from "lucide-react"
import vietmapgl from "@vietmap/vietmap-gl-js"
import { useVietMap } from "@/lib/MapProvider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { requestSchema, type RequestSchemaType } from "@/validations/user.request.schema"

export default function RequestPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const markerRef = useRef<vietmapgl.Marker | null>(null)

  const { map, mount, unmount } = useVietMap()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(requestSchema),
    defaultValues: {
      type: "",
      address: "",
      locate: "",
      description: "",
      phone: "",
      name: "",
      url: "",
      image: null as any,
    },
  })
  const selectedType = watch("type")
  const currentImage = watch("image")

  // ================= MAP =================
  useEffect(() => {
    if (!mapContainer.current) return
    mount(mapContainer.current)

    return () => {
      unmount()
    }
  }, [mount, unmount])

  // ================= IMAGE PREVIEW =================
  const preview = useMemo(() => {
    if (!currentImage || !(currentImage instanceof File)) return null
    return URL.createObjectURL(currentImage)
  }, [currentImage])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setValue("image", file, { shouldValidate: true })
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
        // setValue("locate", `${lat.toFixed(6)}, ${lng.toFixed(6)}`, { shouldValidate: true }) ko cần phải tự điền form nữa vì sẽ convert địa chỉ ra tọa độ lun

        if (!map) return

        map.flyTo({ center: [lng, lat], zoom: 15 })

        if (markerRef.current) markerRef.current.remove()
        markerRef.current = new vietmapgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map)
      },
      () => alert("Bạn chưa cấp quyền định vị")
    )
  }

  // ================= CONVERT ADDRESS =================
  const handleConfirmAddress = async () => {
    const address = getValues("address");
    
    if (!address || address.trim() === "") {
      alert("Vui lòng nhập địa chỉ trước khi xác nhận!");
      return;
    }
    
    try {
      const SEARCH_KEY = import.meta.env.VITE_VIETMAP_SEARCH_KEY; 
      const searchRes = await fetch(
        `https://maps.vietmap.vn/api/search/v3?apikey=${SEARCH_KEY}&text=${encodeURIComponent(address)}`
      );

      if (!searchRes.ok) {
         console.error(`Lỗi API Vietmap Search: ${searchRes.status}`);
         return;
      }

      const searchData = await searchRes.json();
      const results = Array.isArray(searchData) ? searchData : (searchData.models || searchData.data || []);

      if (results && results.length > 0) {
        const refId = results[0].ref_id; // kết quả đầu tiên luôn đúng nhất (do nó trả về chuỗi json với 1 array các dữ liệu địa điểm)
        const placeRes = await fetch( // fetch nó ra để lấy kinh độ và vĩ độ
          `https://maps.vietmap.vn/api/place/v3?apikey=${SEARCH_KEY}&refid=${refId}`
        );

        if (!placeRes.ok) {
           console.error(`Lỗi API Vietmap Place: ${placeRes.status}`);
           return;
        }

        const placeData = await placeRes.json();
        const lat = parseFloat(placeData.lat);
        const lng = parseFloat(placeData.lng);
        
        if (isNaN(lat) || isNaN(lng)) {
           alert("Vietmap không hỗ trợ tọa độ cho địa chỉ này.");
           return;
        }
        setValue("locate", `${lat.toFixed(6)}, ${lng.toFixed(6)}`, { shouldValidate: true });
        if (map) {
          map.flyTo({ center: [lng, lat], zoom: 16 });
          
          if (markerRef.current) markerRef.current.remove();
          markerRef.current = new vietmapgl.Marker({ color: "#EF4444" })
            .setLngLat([lng, lat])
            .addTo(map);
        }
      } else {
        alert("Không tìm thấy địa chỉ này trên bản đồ Vietmap.");
      }

    } catch (error) {
      console.error("Lỗi tìm tọa độ:", error);
    }
  };

  const onSubmit = async (data: RequestSchemaType) => {
    const formData = new FormData()
    formData.append("type", data.type)
    formData.append("address", data.address)
    if (data.locate) 
      formData.append("locate", data.locate)
    formData.append("description", data.description)
    formData.append("phone", data.phone)
    formData.append("name", data.name)
    if (data.url) 
      formData.append("url", data.url)
    if (data.image) 
      formData.append("image", data.image as File)
    console.log("Dữ liệu gửi đi:", data)
    alert("Gửi yêu cầu thành công!")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  return (
      <div className="flex h-full w-full overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        {/* LEFT FORM */}
        <div className="w-[420px] bg-white p-6 shadow-md overflow-y-auto h-full pb-10 z-10 shrink-0 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" >
          <h1 className="text-2xl font-bold mb-4 text-center">
            Gửi thông tin cứu hộ
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
  
            {/* Phân loại */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">Phân loại <span className="text-red-500">*</span></Label>
              
              <div className="mt-3 flex flex-wrap gap-4">
                {["Nhu yếu phẩm", "Cứu hộ", "Khác"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-full border px-5 py-2 text-base font-medium transition-all duration-200 ${
                      selectedType === item
                        ? "bg-red-600 text-white shadow-md shadow-blue-500/30 border-red-600"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setValue("type", item, { shouldValidate: true })}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>
  
            {/* Vị trí */}
            <div>
              <Label>Địa chỉ <span className="text-red-500">*</span></Label>
              <input
                type="text"
                placeholder="Vui lòng nhập đầy đủ địa chỉ của bạn"
                className={`mt-2 w-full rounded-md border px-3 py-2 mb-2 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                {...register("address")}
              />
              {errors.address && <p className="text-red-500 text-xs mb-2">{errors.address.message}</p>}

              <button
                type="button"
                onClick={handleConfirmAddress} 
                className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Xác nhận
              </button>
            </div>

            {/* Tọa độ */}
            <div>
              <Label>Tọa độ</Label>
              <input
                type="text"
                readOnly
                className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 mb-2 outline-none"
                {...register("locate")}
              />
            </div>
  
            {/* Mô tả */}
            <div>
              <Label>Tình trạng <span className="text-red-500">*</span></Label>
              <textarea
                rows={3}
                placeholder="Nhập tình trạng của bạn (địa hình, thời tiết, khu vực) xung quanh..."
                className={`mt-2 w-full rounded-md border px-3 py-2 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                {...register("description")}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
  
            {/* Phone */}
            <div>
              <Label>Số điện thoại <span className="text-red-500">*</span></Label>
              <input
                type="text"
                className={`mt-2 w-full rounded-md border px-3 py-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                {...register("phone")}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
  
            {/* Name */}
            <div>
              <Label>Họ và tên <span className="text-red-500">*</span></Label>
              <input
                type="text"
                className={`mt-2 w-full rounded-md border px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            {/* Link nguồn */}
            <div>
              <Label>Link nguồn (nếu có)</Label>
              <input
                type="text"
                placeholder="Link nguồn google map"
                className={`mt-2 w-full rounded-md border px-3 py-2 ${errors.url ? 'border-red-500' : 'border-gray-300'}`}
                {...register("url")}
              />
              {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
            </div>
  
            {/* Upload ảnh */}
            <div>
              <Label>Hình ảnh hiện trường <span className="text-red-500">*</span></Label>
  
              {preview ? (
                <div className="relative mt-2">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-40 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("image", null)}
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
              disabled={isSubmitting}
              className="w-full rounded-md bg-green-500 py-3 mt-5 font-semibold text-white hover:bg-green-600 disabled:bg-green-300 transition-all"
            >
              {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu"}
            </button>
          </form>
        </div>
  
        {/* RIGHT MAP */}
        <div className="flex-1 relative h-full">
          <div
            ref={mapContainer}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          />
        <button 
            type="button"
            onClick={handleGetLocation} 
            className="absolute bottom-10 right-4 z-10 p-3 bg-white rounded-lg shadow-md hover:bg-gray-300 border group transition-all"
            title="Lấy vị trí hiện tại"
        ><Locate className="w-6 h-6 text-blue-600 group-hover:text-blue-700"/>
        </button>
      </div>
    </div>
  )
}