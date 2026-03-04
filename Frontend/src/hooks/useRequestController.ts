import { useEffect, useRef, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { requestSchema, type RequestSchemaType } from "@/validations/user.request.schema"
import { useVietMap } from "@/lib/MapProvider"
import vietmapgl from "@vietmap/vietmap-gl-js"
import { reverseGeocode, geocodeAddress   } from "@/services/requestService" //submitRescueRequest
import type { ChatMessage } from "@/pages/User/ChatBoxDialog"

export const useRequestController = (mapContainer: React.RefObject<HTMLDivElement | null>) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const markerRef = useRef<vietmapgl.Marker | null>(null)
  const { map, mount, unmount } = useVietMap()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<RequestSchemaType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("address")
  const [rescueStatus, setRescueStatus] = useState<"pending" | "completed">("pending")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, role: "coordinator", name: "Điều phối viên", time: "Hard code", text: "Happy new year", colorClass: "text-[#3b82f6]", bgClass: "bg-[#3b82f6]" },
    { id: 2, role: "team", name: "Đội cứu hộ", time: "Hard code", text: "Happy birthday.", colorClass: "text-[#6366f1]", bgClass: "bg-[#6366f1]" }
  ])

  const { register, handleSubmit, setValue, getValues, watch, reset, formState: { errors, isSubmitting } } = useForm<RequestSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(requestSchema),
    defaultValues: { type: "", address: "", locate: "", description: "", phone: "", name: "", url: "", image: undefined },
  })

  const selectedType = watch("type")
  const currentImages = (watch("image") as File[]) || []

  // MAP 
  useEffect(() => {
    if (!mapContainer.current) return
    mount(mapContainer.current)
    return () => unmount()
  }, [mount, unmount])

  //IMAGE PREVIEW 
  const previews = useMemo(() => {
    if (!currentImages?.length) return []
    return currentImages.map(file => URL.createObjectURL(file))
  }, [currentImages])

  useEffect(() => () => previews.forEach(url => URL.revokeObjectURL(url)), [previews])

  const submittedPreviews = useMemo(() => {
    const images = (submittedData?.image as File[]) || []
    if (!images?.length) return []
    return images.map(file => URL.createObjectURL(file))
  }, [submittedData?.image])

  useEffect(() => () => submittedPreviews.forEach(url => URL.revokeObjectURL(url)), [submittedPreviews])

  //HANDLERS 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const totalImages = [...currentImages, ...files]
    setValue("image", totalImages.length > 3 ? totalImages.slice(0, 3) : totalImages, { shouldValidate: true })
    if (totalImages.length > 3) alert("Bạn chỉ được tải lên tối đa 3 ảnh")
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = currentImages.filter((_, i) => i !== indexToRemove)
    setValue("image", updated.length > 0 ? updated : undefined, { shouldValidate: true })
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) 
        return alert("Trình duyệt không hỗ trợ định vị")
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        setValue("locate", `${lat.toFixed(6)}, ${lng.toFixed(6)}`, { shouldValidate: true })
        if (map) {
          map.flyTo({ center: [lng, lat], zoom: 16 })
          markerRef.current?.remove()
          markerRef.current = new vietmapgl.Marker({ color: "#3B82F6" }).setLngLat([lng, lat]).addTo(map)
        }
        try {
          const address = await reverseGeocode(lat, lng)
          if (address) { setValue("address", address, { shouldValidate: true }); setActiveTab("address") }
        } catch (error) { console.error("Lỗi reverse geocode:", error) }
      },
      () => alert("Bạn chưa cấp quyền định vị")
    )
  }

  const handleConfirmAddress = async () => {
    const address = getValues("address")
    if (!address?.trim()) return alert("Vui lòng nhập địa chỉ trước khi xác nhận!")
    try {
      const coords = await geocodeAddress(address)
      if (!coords) return alert("Không tìm thấy địa chỉ này trên bản đồ Vietmap.")
      if (isNaN(coords.lat) || isNaN(coords.lng)) return alert("Vietmap không hỗ trợ tọa độ cho địa chỉ này.")
      setValue("locate", `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`, { shouldValidate: true })
      setActiveTab("coordinate")
      if (map) {
        map.flyTo({ center: [coords.lng, coords.lat], zoom: 16 })
        markerRef.current?.remove()
        markerRef.current = new vietmapgl.Marker({ color: "#EF4444" }).setLngLat([coords.lng, coords.lat]).addTo(map)
      }
    } catch (error) { console.error("Lỗi tìm tọa độ:", error) }
  }

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
    data.image?.forEach?.((file, i) => formData.append(`image${i}`, file))
    // await submitRescueRequest(formData)
    alert("Gửi yêu cầu thành công!")
    setSubmittedData(data)
    setIsSubmitted(true)
  }

  const handleCancelRequest = () => {
    if (!window.confirm("Bạn có chắc muốn hủy yêu cầu cứu hộ này và thoát không?"))
        return
    reset()
    setSubmittedData(null)
    setIsSubmitted(false)
    setRescueStatus("pending")
    setValue("image", undefined)
    markerRef.current?.remove()
  }

  const handleCompleteRescue = () => {
    if (rescueStatus === "completed") 
        return
    if (window.confirm("Bạn muốn xác nhận đã được cứu hộ thành công?")) 
        setRescueStatus("completed")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault()
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) 
        return
    setChatMessages(prev => [...prev, {
      id: Date.now(), role: "user", name: submittedData?.name || "Bạn",
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: chatInput, colorClass: "text-gray-700", bgClass: "bg-gray-200 text-gray-800"
    }])
    setChatInput("")
  }

  return {
    // refs
    inputRef,
    // state
    isSubmitted, submittedData, isDialogOpen, setIsDialogOpen,
    activeTab, setActiveTab, rescueStatus,
    isChatOpen, setIsChatOpen, chatInput, setChatInput, chatMessages,
    // form
    register, handleSubmit, setValue, errors, isSubmitting, selectedType,
    // previews
    previews, submittedPreviews,
    // handlers
    handleFileChange, handleRemoveImage, handleGetLocation,
    handleConfirmAddress, handleCancelRequest, handleCompleteRescue,
    handleKeyDown, handleSendMessage,
    // submit
    onSubmit,
  }
}