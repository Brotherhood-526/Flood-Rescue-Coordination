import { useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import type { Control, UseFormSetValue } from "react-hook-form";
import type { RequestSchemaType } from "@/validations/user.request.schema";

export const useRequestImages = ({
  control,
  setValue,
  currentImages,
  initialServerImages = [],
}: {
  control: Control<RequestSchemaType>;
  setValue: UseFormSetValue<RequestSchemaType>;
  currentImages: File[];
  initialServerImages?: { id: string; url: string }[];
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [serverImages, setServerImages] =
    useState<{ id: string; url: string }[]>(initialServerImages);
  const [pendingDeleteImageIds, setPendingDeleteImageIds] = useState<string[]>(
    [],
  );

  const imageUrls = serverImages.map((img) => img.url);

  const handleRemoveServerImage = (id: string) => {
    setServerImages((prev) => prev.filter((img) => img.id !== id));
    setPendingDeleteImageIds((prev) => [...prev, id]);
  };

  const imageFiles = (useWatch({ control, name: "image" }) as File[]) || [];

  const previews = useMemo(() => {
    return imageFiles.map((f) => URL.createObjectURL(f));
  }, [imageFiles]);

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const maxNew = 3 - serverImages.length;
    const total = [...currentImages, ...files];
    const capped = total.slice(0, maxNew);
    setValue("image", capped.length > 0 ? capped : undefined, {
      shouldValidate: true,
    });
    if (total.length > maxNew) alert(`Chỉ được tải thêm tối đa ${maxNew} ảnh`);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveImage = (i: number) => {
    const updated = currentImages.filter((_, idx) => idx !== i);
    setValue("image", updated.length > 0 ? updated : undefined, {
      shouldValidate: true,
    });
  };

  return {
    inputRef,
    serverImages,
    setServerImages,
    pendingDeleteImageIds,
    setPendingDeleteImageIds,
    imageUrls,
    previews,
    handleFileChange,
    handleRemoveImage,
    handleRemoveServerImage,
  };
};
