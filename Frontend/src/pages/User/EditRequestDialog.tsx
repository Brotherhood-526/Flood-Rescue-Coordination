import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MapPin, Locate, X, Upload } from "lucide-react"
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form"
import { type RequestSchemaType } from "@/validations/user.request.schema"
import type { RefObject } from "react"

interface EditRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitted: boolean;
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

export default function EditRequestDialog(props: EditRequestDialogProps) {
  const {
    isOpen, onOpenChange, isSubmitted, isSubmitting, onSubmitForm,
    handleKeyDown, register, errors, selectedType, setValue,
    activeTab, setActiveTab, handleConfirmAddress, handleGetLocation,
    previews, handleRemoveImage, inputRef, handleFileChange
  } = props;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isSubmitted ? "Chỉnh sửa thông tin" : "Gửi thông tin cứu hộ"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmitForm} onKeyDown={handleKeyDown}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <Label className="font-semibold text-gray-700 flex items-center gap-1 mb-2">Họ và tên <span className="text-red-500">*</span></Label>
                <input type="text" placeholder="Nhập họ và tên..." className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} {...register("name")} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 flex items-center gap-1 mb-2">Phân loại <span className="text-red-500">*</span></Label>
                <div className="flex flex-wrap gap-2.5">
                  {["Nhu yếu phẩm", "Cứu hộ", "Khác"].map((item) => (
                    <button key={item} type="button" className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${selectedType === item ? "border-gray-800 bg-red-600 text-white shadow-sm" : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"}`} onClick={() => setValue("type", item, { shouldValidate: true })}>{item}</button>
                  ))}
                </div>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 block mb-2">Link nguồn (nếu có)</Label>
                <input type="text" placeholder="Dán link Google Maps..." className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 ${errors.url ? 'border-red-500' : 'border-gray-300'}`} {...register("url")} />
                {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 flex items-center gap-1 mb-2">Tình trạng <span className="text-red-500">*</span></Label>
                <textarea rows={5} placeholder="Mô tả chi tiết tình trạng hiện tại..." className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`} {...register("description")} />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="font-semibold text-gray-700 flex items-center gap-1 mb-2">Số điện thoại liên hệ <span className="text-red-500">*</span></Label>
                <input type="text" placeholder="Nhập số điện thoại..." className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} {...register("phone")} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-row items-center justify-between mb-2">
                  <Label className="font-semibold text-gray-700 flex items-center gap-1">Vị trí <span className="text-red-500">*</span></Label>
                  <TabsList className="grid grid-cols-2 w-[180px] h-9 bg-gray-100/80 rounded-lg">
                    <TabsTrigger value="address" className="text-xs font-medium"><MapPin className="w-3.5 h-3.5 mr-1.5" /> Địa chỉ</TabsTrigger>
                    <TabsTrigger value="coordinate" className="text-xs font-medium"><Locate className="w-3.5 h-3.5 mr-1.5" /> Tọa độ</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="address" className="mt-0">
                  <input type="text" placeholder="Nhập địa chỉ của bạn..." className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 ${errors.address ? 'border-red-500' : 'border-gray-300'}`} {...register("address")} />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  <button type="button" onClick={handleConfirmAddress} className="mt-2.5 w-full rounded-xl bg-[#56d376] py-2.5 text-sm text-white font-bold hover:bg-[#48b865] transition-colors shadow-sm">Xác nhận địa chỉ</button>
                </TabsContent>
                <TabsContent value="coordinate" className="mt-0">
                  <input type="text" placeholder="Tọa độ GPS..." className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm outline-none ${errors.locate ? 'border-red-500' : 'border-gray-300'}`} readOnly {...register("locate")} />
                  {errors.locate && <p className="text-red-500 text-xs mt-1">{errors.locate.message}</p>}
                  <button type="button" onClick={handleGetLocation} className="mt-2.5 w-full rounded-xl bg-[#56d376] hover:bg-[#48b865] py-2.5 text-sm text-white font-bold transition-colors shadow-sm">Lấy vị trí hiện tại</button>
                </TabsContent>
              </Tabs>

              <div>
                <Label className="font-semibold text-gray-700 flex flex-wrap items-baseline gap-1.5 mb-3">
                  Ảnh chụp hiện trường <span className="text-xs font-normal text-gray-500">(Tối đa 3 ảnh)</span> <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((src, index) => (
                    <div key={index} className="relative aspect-square w-full group rounded-xl bg-gray-50 border border-gray-200">
                      <img src={src} alt={`preview-${index}`} className="h-full w-full rounded-xl object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:scale-110 hover:bg-red-600" title="Xóa ảnh"><X className="w-3.5 h-3.5" strokeWidth={3} /></button>
                    </div>
                  ))}
                  {previews.length < 3 && (
                    <div onClick={() => inputRef.current?.click()} className="aspect-square flex flex-col cursor-pointer items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border-2 border-gray-300">
                      <Upload className="h-5 w-5 text-gray-400 mb-1" strokeWidth={2.5} />
                      <span className="text-[11px] font-semibold text-gray-500 text-center px-1">Tải ảnh lên<br/>({previews.length}/3)</span>
                    </div>
                  )}
                </div>
                <input ref={inputRef} type="file" multiple hidden accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button type="submit" disabled={isSubmitting} className="w-[200px] rounded-full bg-[#da291c] py-3.5 font-bold text-[15px] text-white hover:bg-[#b02115] disabled:bg-red-300 transition-all shadow-md">
              {isSubmitting ? "Đang xử lý..." : (isSubmitted ? "Lưu thay đổi" : "Gửi thông tin")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}