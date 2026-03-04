import { useState } from "react"
import { findRequestByPhone, type ApiResponse } from "@/services/findRequestService"
export const useFindRequest = () => {
  const [phoneInput, setPhoneInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)

  const handleSearch = async () => {
    if (!phoneInput.trim()) return
    setIsLoading(true)
    setApiResponse(null)
    try {
      const result = await findRequestByPhone(phoneInput)
      setApiResponse(result)
    } finally {
      setIsLoading(false)
    }
  }

  return { phoneInput, setPhoneInput, isLoading, apiResponse, handleSearch }
}

