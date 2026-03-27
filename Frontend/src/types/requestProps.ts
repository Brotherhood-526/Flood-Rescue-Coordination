import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import type { RefObject } from "react";
import type { RequestSchemaType } from "@/validations/user.request.schema";
import type { ChatMessage } from "@/types/request";

export interface AfterRequestPageProps {
  submittedData: RequestSchemaType | null;
  requestId: string | number | null;
  imageUrls: string[];
  status: string | null;
  urgency: string | null;
  onCancel: () => void;
  onOpenEdit: () => void;
  onOpenChat: () => void;
}

export interface BeforeRequestPageProps {
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

export interface EditRequestDialogProps {
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
  imageUrls: string[];
}

export interface ChatBoxDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  requestStatus: string | null;
}
