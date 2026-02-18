import { useEffect, useRef, useMemo, useState } from "react"
import { Locate, User } from "lucide-react"
import vietmapgl from "@vietmap/vietmap-gl-js"
import { useVietMap } from "@/lib/MapProvider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { requestSchema, type RequestSchemaType } from "@/validations/user.request.schema"
//các trang con
import BeforeRequestPage from "./BeforeRequestPage";
import AfterRequestPage from "./AfterRequestPage";
import EditRequestDialog from "./EditRequestDialog";
import ChatBoxDialog, { type ChatMessage } from "./ChatBoxDialog";

export default function RequestPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const markerRef = useRef<vietmapgl.Marker | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<RequestSchemaType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { map, mount, unmount } = useVietMap()
  const [activeTab, setActiveTab] = useState("address");
  const [rescueStatus, setRescueStatus] = useState<"pending" | "completed">("pending")
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
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
      image: undefined,
    },
  })
  const selectedType = watch("type")
  const currentImages = (watch("image") as File[]) || []

  // ================= MAP =================
  useEffect(() => {
    if (!mapContainer.current) return
    mount(mapContainer.current)

    return () => {
      unmount()
    }
  }, [mount, unmount])

  // ================= IMAGE PREVIEW =================
  const previews = useMemo(() => {
    if (!currentImages || !Array.isArray(currentImages) || currentImages.length === 0) return []
    return currentImages.map(file => URL.createObjectURL(file))
  }, [currentImages])

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])
  
  const submittedPreviews = useMemo(() => {
    const images = (submittedData?.image as File[]) || [];
    if (!images || !Array.isArray(images) || images.length === 0) return [];
    return images.map(file => URL.createObjectURL(file));
  }, [submittedData?.image]);

  useEffect(() => {
    return () => {
      submittedPreviews.forEach(url => URL.revokeObjectURL(url));
    }
  }, [submittedPreviews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const totalImages = [...currentImages, ...files]

    if (totalImages.length > 3) {
      alert("Bạn chỉ được tải lên tối đa 3 ảnh")
      setValue("image", totalImages.slice(0, 3), { shouldValidate: true })
    } else {
      setValue("image", totalImages, { shouldValidate: true })
    }
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove)
    setValue("image", updatedImages.length > 0 ? updatedImages : undefined, { shouldValidate: true })
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setValue("locate", `${lat.toFixed(6)}, ${lng.toFixed(6)}`, { shouldValidate: true }) 

        if (map) {
          map.flyTo({ center: [lng, lat], zoom: 16 })
          if (markerRef.current) markerRef.current.remove()
          markerRef.current = new vietmapgl.Marker({ color: "#3B82F6" }) 
            .setLngLat([lng, lat])
            .addTo(map)
        }
        try {
          const SEARCH_KEY = import.meta.env.VITE_VIETMAP_SEARCH_KEY; 
          const reverseRes = await fetch(
            `https://maps.vietmap.vn/api/reverse/v3?apikey=${SEARCH_KEY}&lat=${lat}&lng=${lng}`
          );
          
          if (reverseRes.ok) {
            const reverseData = await reverseRes.json();
            if (reverseData && reverseData.length > 0) {
              const fullAddress = reverseData[0].display || reverseData[0].address || reverseData[0].name;
              setValue("address", fullAddress, { shouldValidate: true });
              setActiveTab("address"); 
            }
          }
        } catch (error) {
          console.error("Lỗi khi dịch tọa độ sang địa chỉ:", error);
        }
      },() => alert("Bạn chưa cấp quyền định vị")
    )
  }

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

      if (!searchRes.ok){ 
        return;
      }

      const searchData = await searchRes.json();
      const results = Array.isArray(searchData) ? searchData : (searchData.models || searchData.data || []);

      if (results && results.length > 0) {
        const refId = results[0].ref_id; 
        const placeRes = await fetch( 
          `https://maps.vietmap.vn/api/place/v3?apikey=${SEARCH_KEY}&refid=${refId}`
        );

        if (!placeRes.ok){ 
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
        setActiveTab("coordinate");

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

  // SUBMIT
  const onSubmit = async (data: RequestSchemaType) => {
    const formData = new FormData()
    formData.append("type", data.type)
    formData.append("address", data.address)
    if (data.locate) {
      formData.append("locate", data.locate)
    }
    formData.append("description", data.description)
    formData.append("phone", data.phone)
    formData.append("name", data.name)
    if (data.url) {
      formData.append("url", data.url)
    }
    if (data.image && Array.isArray(data.image)) {
      data.image.forEach((file, index) => {
      formData.append(`image${index}`, file)
      })
    }
    alert("Gửi yêu cầu thành công!")
    setSubmittedData(data);
    setIsSubmitted(true); 
  }

  const handleCancelRequest = () => {
    if (window.confirm("Bạn có chắc muốn hủy yêu cầu cứu hộ này và thoát không?")) {
      reset(); // Xóa sạch dữ liệu trong form
      setSubmittedData(null); // Xóa data đã lưu
      setIsSubmitted(false); // Quay về màn hình nhập
      setRescueStatus("pending"); // Trả trạng thái về mặc định
      setValue("image", undefined); // Reset thủ công ô hình ảnh
      if (markerRef.current) 
        markerRef.current.remove(); // Xóa location trên bản đồ
    }
  };

  const handleCompleteRescue = () => {
    if (rescueStatus === "completed"){
        return;
    }
    if (window.confirm("Bạn muốn xác nhận đã được cứu hộ thành công?")) {
      setRescueStatus("completed");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, role: "coordinator", name: "Điều phối viên", time: "Hard code", text: "Happy new year", colorClass: "text-[#3b82f6]", bgClass: "bg-[#3b82f6]" },
    { id: 2, role: "team", name: "Đội cứu hộ", time: "Hard code", text: "Happy birthday.", colorClass: "text-[#6366f1]", bgClass: "bg-[#6366f1]" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now(), role: "user", name: submittedData?.name || "Bạn",
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: chatInput, colorClass: "text-gray-700", bgClass: "bg-gray-200 text-gray-800"
    };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
  };
  
  return (
    // cái layout chính của trang bản đồ
      <div className="flex h-full w-full overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="w-[420px] bg-white p-6 shadow-md overflow-y-auto h-full pb-10 z-10 shrink-0 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" >
          <div className="flex items-center gap-3 pb-5">
            
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-gray-500" /> 
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="text-lg font-bold text-gray-800">
                {submittedData?.name || "Người dùng"}
              </span>
              
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md w-fit mt-0.5">
                ID: {submittedData?.phone ? `#${submittedData.phone}` : "#---"}
              </span>
            </div>
            
          </div>
          <hr className="border-black mb-3" />
          {!isSubmitted ? (
             <BeforeRequestPage
              isSubmitting={isSubmitting}
              onSubmitForm={handleSubmit(onSubmit)}
              handleKeyDown={handleKeyDown}
              register={register}
              errors={errors}
              selectedType={selectedType}
              setValue={setValue}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleConfirmAddress={handleConfirmAddress}
              handleGetLocation={handleGetLocation}
              previews={previews}
              handleRemoveImage={handleRemoveImage}
              inputRef={inputRef}
              handleFileChange={handleFileChange}
             />
          ) : (
          //After request
          <AfterRequestPage 
              submittedData={submittedData} 
              submittedPreviews={submittedPreviews} 
              rescueStatus={rescueStatus} 
              onCancel={handleCancelRequest} 
              onComplete={handleCompleteRescue} 
              onOpenEdit={() => setIsDialogOpen(true)} 
              onOpenChat={() => setIsChatOpen(true)} 
            />
          )}
        </div>
  
        {/* RIGHT MAP */}
        <div className="flex-1 relative h-full">
          <div
            ref={mapContainer}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          />
        {!isSubmitted && (
          <button 
              type="button"
              onClick={handleGetLocation} 
              className="absolute bottom-10 right-4 z-10 p-3 bg-white rounded-lg shadow-md hover:bg-gray-300 border group transition-all"
              title="Lấy vị trí hiện tại"
          ><Locate className="w-6 h-6 text-blue-600 group-hover:text-blue-700"/>
          </button>
        )}
      </div>

      <EditRequestDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          isSubmitted={isSubmitted} 
          isSubmitting={isSubmitting}
          onSubmitForm={handleSubmit(onSubmit)} 
          handleKeyDown={handleKeyDown} 
          register={register} 
          errors={errors}
          selectedType={selectedType} 
          setValue={setValue} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          handleConfirmAddress={handleConfirmAddress} 
          handleGetLocation={handleGetLocation} 
          previews={previews}
          handleRemoveImage={handleRemoveImage} 
          inputRef={inputRef} 
          handleFileChange={handleFileChange}
        />

        <ChatBoxDialog 
          isOpen={isChatOpen} 
          onOpenChange={setIsChatOpen} 
          chatMessages={chatMessages} 
          chatInput={chatInput}
          setChatInput={setChatInput} 
          handleSendMessage={handleSendMessage}
        />
    </div>
  )
}