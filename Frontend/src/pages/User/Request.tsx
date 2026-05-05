import { Locate, User, LogOut } from "lucide-react";
import { useRequestController } from "@/hooks/User/useRequestController";
import { useRef } from "react";
import BeforeRequestPage from "./BeforeRequestPage";
import AfterRequestPage from "./AfterRequestPage";
import EditRequestDialog from "./EditRequestDialog";
import ChatBoxDialog from "./ChatBoxDialog";

export default function RequestPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const c = useRequestController(mapContainer);

  return (
    <div
      className="flex h-full w-full overflow-hidden"
      style={{ height: "calc(100vh - 80px)" }}
    >
      {/* LEFT PANEL */}
      <div className="w-105 bg-white p-6 shadow-md overflow-y-auto h-full pb-10 z-10 shrink-0 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {c.isSubmitted && (
          <>
            <div className="flex items-center gap-3 pb-5">
              <div className="w-12 h-12 rounded-full bg-gray-100 border-black border-2 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-black" />
              </div>
              <div className="flex flex-col justify-center flex-1">
                <span className="text-lg font-bold text-gray-800">
                  {c.submittedData?.name || "Người dùng"}
                </span>
              </div>
              <button
                onClick={c.handleCancelRequest}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-200 border-2 border-black text-black rounded-full text-xs font-semibold transition-all shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Thoát
              </button>
            </div>
            <hr className="border-black mb-3" />
          </>
        )}

        {!c.isSubmitted ? (
          <BeforeRequestPage
            isSubmitting={c.isSubmitting}
            onSubmitForm={c.onSubmitForm}
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
            requestId={c.requestId}
            status={c.status}
            urgency={c.urgency}
            imageUrls={c.imageUrls}
            onCancel={c.handleCancelRequest}
            onOpenEdit={() => c.setIsDialogOpen(true)}
            onOpenChat={() => c.setIsChatOpen(true)}
          />
        )}
      </div>

      {/* right map */}
      <div className="flex-1 relative h-full">
        <div
          ref={mapContainer}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        />

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
        onSubmitForm={c.onSubmitForm}
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
        imageUrls={c.imageUrls}
        serverImages={c.serverImages}
        handleRemoveServerImage={c.handleRemoveServerImage}
      />

      <ChatBoxDialog
        isOpen={c.isChatOpen}
        onOpenChange={c.setIsChatOpen}
        chatMessages={c.chatMessages}
        chatInput={c.chatInput}
        setChatInput={c.setChatInput}
        handleSendMessage={c.handleSendMessage}
        requestStatus={c.status}
      />
    </div>
  );
}
