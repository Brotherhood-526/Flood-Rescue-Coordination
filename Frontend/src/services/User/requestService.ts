import apiClient from "../axiosClient";
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

interface RescueResponse {
  requestId: string;
}
export const submitRescueRequest = async (
  data: FormData,
): Promise<RescueResponse> => {
  const res = await apiClient.post("/citizen/sendRequest", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res as unknown as RescueResponse;
};

export const updateRescueRequest = async (
  id: string | number,
  data: FormData,
) => {
  const res = await apiClient.put(`/api/requests/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};
