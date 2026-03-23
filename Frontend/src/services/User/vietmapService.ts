const SEARCH_KEY = import.meta.env.VITE_VIETMAP_SEARCH_KEY;
const BASE = "https://maps.vietmap.vn/api";

export const vietmapService = {
  reverseGeocode: async (lat: number, lng: number): Promise<string> => {
    const res = await fetch(
      `${BASE}/reverse/v3?apikey=${SEARCH_KEY}&lat=${lat}&lng=${lng}`,
    );
    if (!res.ok) throw new Error("Reverse geocode thất bại");
    const data = await res.json();
    return data[0]?.display ?? data[0]?.address ?? data[0]?.name ?? "";
  },

  geocodeAddress: async (
    address: string,
  ): Promise<{ lat: number; lng: number } | null> => {
    const searchRes = await fetch(
      `${BASE}/search/v3?apikey=${SEARCH_KEY}&text=${encodeURIComponent(address)}`,
    );
    if (!searchRes.ok) throw new Error("Search thất bại");
    const searchData = await searchRes.json();
    const results = Array.isArray(searchData)
      ? searchData
      : (searchData.models ?? searchData.data ?? []);
    if (!results.length) return null;

    const placeRes = await fetch(
      `${BASE}/place/v3?apikey=${SEARCH_KEY}&refid=${results[0].ref_id}`,
    );
    if (!placeRes.ok) throw new Error("Place thất bại");
    const placeData = await placeRes.json();
    return { lat: parseFloat(placeData.lat), lng: parseFloat(placeData.lng) };
  },
};
