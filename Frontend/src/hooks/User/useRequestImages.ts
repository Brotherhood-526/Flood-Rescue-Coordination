import { useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import type {
  Control,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import type { RequestSchemaType } from "@/validations/user.request.schema";

export const useRequestImages = ({
  control,
  setValue,
  getValues,
  initialServerImages = [],
}: {
  control: Control<RequestSchemaType>;
  setValue: UseFormSetValue<RequestSchemaType>;
  getValues: UseFormGetValues<RequestSchemaType>;
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

  const imageFiles = useWatch({ control, name: "image" }) as File[] | undefined;

  const previews = useMemo(() => {
    if (!imageFiles || imageFiles.length === 0) return [];
    return imageFiles.map((f) => URL.createObjectURL(f));
  }, [imageFiles]);

  useEffect(() => {
    const currentPreviews = previews;
    return () => {
      currentPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    console.log("Số ảnh bạn vừa chọn từ máy tính:", files.length);

    const rawImages = getValues("image");
    let actualCurrentLocalImages: File[] = [];
    if (Array.isArray(rawImages)) {
      actualCurrentLocalImages = rawImages;
    } else if (rawImages && typeof rawImages === "object") {
      actualCurrentLocalImages = Array.from(
        rawImages as unknown as Iterable<File>,
      );
    }

    const currentTotal = serverImages.length + actualCurrentLocalImages.length;
    if (currentTotal >= 3) {
      alert("Bạn đã tải đủ tối đa 3 ảnh.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const availableSlots = Math.max(0, 3 - currentTotal);
    const allowedFiles = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(
        `Bạn đã chọn ${files.length} ảnh, nhưng chỉ còn trống ${availableSlots} chỗ. Hệ thống sẽ tự động lấy ${availableSlots} ảnh đầu tiên.`,
      );
    }

    const updatedLocalImages = [...actualCurrentLocalImages, ...allowedFiles];

    console.log(
      "Tổng số ảnh local sau khi chốt sổ:",
      updatedLocalImages.length,
    );

    setValue(
      "image",
      updatedLocalImages.length > 0 ? updatedLocalImages : undefined,
      {
        shouldValidate: true,
      },
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveImage = (i: number) => {
    const rawImages = getValues("image");
    const currentLocalImages = Array.isArray(rawImages) ? rawImages : [];
    const updated = currentLocalImages.filter((_, idx) => idx !== i);
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
