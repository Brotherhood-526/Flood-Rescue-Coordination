import { Locate, User } from "lucide-react"
import { useRequestController } from "@/hooks/useRequestController"
import { useRef } from "react"
import BeforeRequestPage from "./BeforeRequestPage";
import AfterRequestPage from "./AfterRequestPage";
import EditRequestDialog from "./EditRequestDialog";
import ChatBoxDialog from "./ChatBoxDialog";

export default function RequestPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const c = useRequestController(mapContainer)
  
 return (
    <div className="flex h-full w-full overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
      
      {/* LEFT PANEL */}
      <div className="w-[420px] bg-white p-6 shadow-md overflow-y-auto h-full pb-10 z-10 shrink-0 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {c.isSubmitted && (
          <>
            <div className="flex items-center gap-3 pb-5">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-lg font-bold text-gray-800">{c.submittedData?.name || "Người dùng"}</span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md w-fit mt-0.5">
                  ID: {c.submittedData?.phone ? `#${c.submittedData.phone}` : "#---"}
                </span>
              </div>
            </div>
            <hr className="border-black mb-3" />
          </>
        )}

        {!c.isSubmitted ? (
          <BeforeRequestPage
            isSubmitting={c.isSubmitting}
            onSubmitForm={c.handleSubmit(c.onSubmit)}
            handleKeyDown={c.handleKeyDown}
            register={c.register}
            errors={c.errors}
            selectedType={c.selectedType}
            setValue={c.setValue}
            activeTab={c.activeTab}
            setActiveTab={c.setActiveTab}
            handleConfirmAddress={c.handleConfirmAddress}
            handleGetLocation={c.handleGetLocation}
            previews={c.previews}
            handleRemoveImage={c.handleRemoveImage}
            inputRef={c.inputRef}
            handleFileChange={c.handleFileChange}
          />
        ) : (
          <AfterRequestPage
            submittedData={c.submittedData}
            submittedPreviews={c.submittedPreviews}
            rescueStatus={c.rescueStatus}
            onCancel={c.handleCancelRequest}
            onComplete={c.handleCompleteRescue}
            onOpenEdit={() => c.setIsDialogOpen(true)}
            onOpenChat={() => c.setIsChatOpen(true)}
          />
        )}
      </div>

      {/* RIGHT MAP */}
      <div className="flex-1 relative h-full">
        <div ref={mapContainer} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />
        {!c.isSubmitted && (
          <button
            type="button"
            onClick={c.handleGetLocation}
            className="absolute bottom-10 right-4 z-10 p-3 bg-white rounded-lg shadow-md hover:bg-gray-300 border group transition-all"
            title="Lấy vị trí hiện tại"
          >
            <Locate className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
          </button>
        )}
      </div>

      {/* DIALOGS */}
      <EditRequestDialog
        isOpen={c.isDialogOpen}
        onOpenChange={c.setIsDialogOpen}
        isSubmitted={c.isSubmitted}
        isSubmitting={c.isSubmitting}
        onSubmitForm={c.handleSubmit(c.onSubmit)}
        handleKeyDown={c.handleKeyDown}
        register={c.register}
        errors={c.errors}
        selectedType={c.selectedType}
        setValue={c.setValue}
        activeTab={c.activeTab}
        setActiveTab={c.setActiveTab}
        handleConfirmAddress={c.handleConfirmAddress}
        handleGetLocation={c.handleGetLocation}
        previews={c.previews}
        handleRemoveImage={c.handleRemoveImage}
        inputRef={c.inputRef}
        handleFileChange={c.handleFileChange}
      />

      <ChatBoxDialog
        isOpen={c.isChatOpen}
        onOpenChange={c.setIsChatOpen}
        chatMessages={c.chatMessages}
        chatInput={c.chatInput}
        setChatInput={c.setChatInput}
        handleSendMessage={c.handleSendMessage}
      />
    </div>
  )
}