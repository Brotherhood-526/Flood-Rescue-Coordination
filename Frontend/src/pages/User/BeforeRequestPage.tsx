import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MapPinned, Navigation, Locate, X, Upload } from "lucide-react"
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form"
import type { RefObject } from "react"
import { type RequestSchemaType } from "@/validations/user.request.schema"

interface BeforeRequestPageProps {
  isSubmitting: boolean;
  onSubmitForm: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLFormElement>) => void;
  register: UseFormRegister<RequestSchemaType>;
  errors: FieldErrors<RequestSchemaType>;
  selectedType: string;
  setValue: UseFormSetValue<RequestSchemaType>;
  activeTab: string;
  setActiveTab: (val: string) => void;
  handleConfirmAddress: () => void;
  handleGetLocation: () => void;
  previews: string[];
  handleRemoveImage: (index: number) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BeforeRequestPage(props: BeforeRequestPageProps) {
  const {
    isSubmitting, onSubmitForm, handleKeyDown, register, errors,
    selectedType, setValue, activeTab, setActiveTab,
    handleConfirmAddress, handleGetLocation, previews,
    handleRemoveImage, inputRef, handleFileChange
  } = props;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gửi thông tin cứu hộ
      </h1>
      <hr className="border-black mb-3" />
      <form onSubmit={onSubmitForm} onKeyDown={handleKeyDown} className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-gray-700">Phân loại <span className="text-red-500">*</span></Label>
          <div className="mt-3 flex flex-wrap gap-4">
            {["Nhu yếu phẩm", "Cứu hộ", "Khác"].map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-full border px-5 py-2 text-base font-medium transition-all duration-200 
                ${selectedType === item ? "bg-red-600 text-white border-red-600" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                onClick={() => setValue("type", item, { shouldValidate: true })}
              >
                {item}
              </button>
            ))}
          </div>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold text-gray-700">
              Vị trí <span className="text-red-500">*</span>
            </Label>
            <TabsList className="grid grid-cols-2 w-[200px] h-10">
              <TabsTrigger value="address" className="text-xs flex items-center justify-center gap-2">
                <MapPinned className="w-4 h-4" /> Địa chỉ
              </TabsTrigger>
              <TabsTrigger value="coordinate" className="text-xs flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4" /> Tọa độ
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="address" className="mt-0 space-y-2">
            <input
              type="text"
              placeholder="Vui lòng nhập đầy đủ địa chỉ của bạn"
              className={`w-full rounded-md border px-3 py-2 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              {...register("address")}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}

            <button
              type="button"
              onClick={handleConfirmAddress}
              className="w-full rounded-md bg-green-600 py-2.5 text-white font-medium hover:bg-green-700 transition-colors"
            >
              Xác nhận
            </button>
          </TabsContent>

          <TabsContent value="coordinate" className="mt-0 space-y-2">
            <input
              type="text"
              placeholder="Bấm nút bên dưới để lấy GPS hiện tại..."
              className={`w-full rounded-md border px-3 py-2 outline-none ${errors.locate ? 'border-red-500' : 'border-gray-300 bg-gray-50'}`}
              readOnly
              {...register("locate")}
            />
            {errors.locate && <p className="text-red-500 text-xs">{errors.locate.message}</p>}

            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full rounded-md bg-[#00c853] hover:bg-[#00e676] py-2.5 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Locate className="w-5 h-5" /> Lấy vị trí hiện tại
            </button>
          </TabsContent>
        </Tabs>

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
          <Label className="font-semibold">
            Hình ảnh hiện trường <span className="text-sm font-normal text-gray-500">(Tối đa 3 ảnh)</span> <span className="text-red-500">*</span>
          </Label>

          <div className="mt-2 grid grid-cols-3 gap-3">
            {previews.map((src, index) => (
              <div key={index} className="relative h-[110px] w-full group">
                <img src={src} alt={`preview-${index}`} className="h-full w-full rounded-xl object-cover border border-gray-200" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-black transition-all hover:scale-120"
                  title="Xóa ảnh"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                </button>

              </div>
            ))}

            {previews.length < 3 && (
              <div
                onClick={() => inputRef.current?.click()}
                className="h-[110px] flex flex-col cursor-pointer items-center justify-center rounded-xl bg-[#d9d9d9]/60 hover:bg-[#d9d9d9] transition-colors border-2 border-gray-400"
              >
                <Upload className="h-6 w-6 text-gray-600 mb-1" strokeWidth={2} />
                <span className="text-xs font-semibold text-gray-600 text-center px-1">Tải ảnh lên<br />({previews.length}/3)</span>
              </div>
            )}
          </div>

          <input ref={inputRef} type="file" multiple hidden accept="image/*" onChange={handleFileChange} />
        </div>


        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-green-500 py-3 mt-5 font-semibold text-white hover:bg-green-600 disabled:bg-green-300 transition-all"
        >
          {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu"}
        </button>
      </form>
    </>
  )
}