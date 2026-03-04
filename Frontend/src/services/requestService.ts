const SEARCH_KEY = import.meta.env.VITE_VIETMAP_SEARCH_KEY;

// 1. Tọa độ → Địa chỉ
export const reverseGeocode = async (lat: number, lng: number) => {
  const res = await fetch(
    `https://maps.vietmap.vn/api/reverse/v3?apikey=${SEARCH_KEY}&lat=${lat}&lng=${lng}`,
  );
  if (!res.ok) throw new Error("Reverse geocode thất bại");
  const data = await res.json();
  return data[0]?.display || data[0]?.address || data[0]?.name || "";
};

// 2. Địa chỉ → Tọa độ
export const geocodeAddress = async (address: string) => {
  const searchRes = await fetch(
    `https://maps.vietmap.vn/api/search/v3?apikey=${SEARCH_KEY}&text=${encodeURIComponent(address)}`,
  );
  if (!searchRes.ok) throw new Error("Search thất bại");
  const searchData = await searchRes.json();
  const results = Array.isArray(searchData)
    ? searchData
    : searchData.models || searchData.data || [];
  if (!results.length) return null;

  const placeRes = await fetch(
    `https://maps.vietmap.vn/api/place/v3?apikey=${SEARCH_KEY}&refid=${results[0].ref_id}`,
  );
  if (!placeRes.ok) throw new Error("Place thất bại");
  const placeData = await placeRes.json();
  return { lat: parseFloat(placeData.lat), lng: parseFloat(placeData.lng) };
};

// 3. Submit form
// export const submitRescueRequest = async (data: FormData) => {
//   // sau này gọi BE ở đây
//   // const res = await fetch("/api/rescue-requests", { method: "POST", body: data });
//   // return res.json();
//   return { success: true }; // mock tạm
// };
