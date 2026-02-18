import * as z from "zod";

export const requestSchema = z.object({
  type: z.string().min(1, 
    { message: "Vui lòng chọn phân loại cứu hộ" }),
  address: z.string().min(5, 
    { message: "Địa chỉ quá ngắn, vui lòng nhập đầy đủ!" }),
  locate: z.string().optional(),
  description: z.string().min(10, 
    { message: "Vui lòng mô tả chi tiết tình trạng (ít nhất 10 ký tự)" }),
  phone: z.string()
    .min(10, 
        { message: "Số điện thoại phải có ít nhất 10 số (Số điện thoại ở Việt Nam" })
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 
        { message: "Số điện thoại không hợp lệ" }),
  name: z.string().min(2, 
    { message: "Vui lòng nhập họ và tên" }),
  url: z.string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const isGoogleMapLink = /(google\.com\/maps|maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl)/i.test(val);
        return isGoogleMapLink;
      },
      { message: "Link không hợp lệ. Vui lòng dán đúng đường dẫn chia sẻ từ Google Maps!" }
    ),
  image: z
  .array(z.instanceof(File))
  .min(1, { message: "Vui lòng tải lên ít nhất 1 ảnh" })
  .max(3, { message: "Tối đa 3 ảnh" })
  .optional()
  .or(z.undefined())
});

export type RequestSchemaType = z.infer<typeof requestSchema>;
