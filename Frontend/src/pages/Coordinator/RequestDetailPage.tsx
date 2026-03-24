import {
  Undo2,
  Phone,
  MapPin,
  Image,
  Helicopter,
  Van,
  Ship,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useVietMap } from "@/lib/useVietMap";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { ROUTES } from "@/router/routes";
import { useRequestDetail } from "@/hooks/Coordinator/useRequestDetail";
import { useVehicleList } from "@/hooks/Coordinator/useVehicle";
import { useRequestUpdate } from "@/hooks/Coordinator/useRequestUpdate";
import { timeAgo } from "@/utils/timeAgo";
import { getRequestTypeLabel } from "@/utils/requestHelpers";
import type { CoordinatorRequest } from "@/types/coordinator";

export default function RequestDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { requestDetail } = useRequestDetail(id!);
  const location = useLocation();
  const request = location.state as CoordinatorRequest;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col flex-1 w-full bg-white pt-[6vh]">
        <div className="flex flex-row flex-[0.5] justify-between items-center px-[2vw] mb-[2vh]">
          <div className="flex flex-row gap-[1vw]">
            <Button
              className="bg-gray-300! text-black! font-bold!"
              onClick={() => navigate(-1)}
            >
              <Undo2 className="w-5! h-5!" strokeWidth={2.5} />
              Quay Lại
            </Button>
            <Button className="bg-gray-300! text-black! font-bold!">
              Hộp thoại
            </Button>
          </div>

          <Button
            className="bg-gray-300! text-black! font-bold!"
            onClick={() =>
              navigate(ROUTES.COORDINATE_MAP, {
                state: {
                  userLat: requestDetail?.latitude,
                  userLng: requestDetail?.longitude,
                  userName: request?.citizenName,
                  teamLat: requestDetail?.rescueTeamLatitude,
                  teamLng: requestDetail?.rescueTeamLongitude,
                  teamName: requestDetail?.rescueTeamName,
                },
              })
            }
          >
            Toàn bản đồ
          </Button>
        </div>
        <Solving />
      </div>
    </div>
  );
}

function Solving() {
  const { id } = useParams();
  const { requestDetail } = useRequestDetail(id!);
  const location = useLocation();
  const request = location.state as CoordinatorRequest;

  return (
    <div className="w-full flex-[9.5] bg-white pt-[1vh] flex flex-row justify-between items-start px-[2vw]">
      <Information />
      <MiniMap
        latitude={requestDetail?.latitude ?? null}
        longitude={requestDetail?.longitude ?? null}
        citizenName={request?.citizenName}
      />
    </div>
  );
}

function Information() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const request = location.state as CoordinatorRequest;
  const [vehicle, setVehicle] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [rescueTeam, setRescueTeam] = useState<string | null>(null);

  const { requestDetail } = useRequestDetail(id!);
  const { updateRequest, cancelRequest, loading: isUpdating, error: updateError } =
    useRequestUpdate();
  const tempDisplayVehicle = vehicle ?? requestDetail?.vehicleType ?? null;
  const { vehicleList } = useVehicleList(id, tempDisplayVehicle);
  const displayVehicle = vehicle ?? requestDetail?.vehicleType ?? null;
  const displayUrgency = urgency ?? requestDetail?.urgency ?? null;
  const selectedRescueTeamName =
    vehicleList.find((t) => t.id === rescueTeam)?.teamName ?? null;
  const displayRescueTeam = selectedRescueTeamName ?? requestDetail?.rescueTeamName ?? null;

  const activeStyle = "!bg-white !border-green-600 !border-2 !text-black";
  const normalStyle =
    "!bg-white !border-black !border-2 hover:!border-gray-400";
  const vehiclesButton =
    "flex flex-col gap-0 !w-[6vw] !h-[8vh] !border-gray-300 !text-black";
  const miniDiv = "flex flex-col gap-1";

  const handleUpdateStatus = async (action: "accept" | "reject") => {
    if (!id) return;
    try {
      if (action === "accept") {
        if (!displayUrgency || !rescueTeam || !displayVehicle) {
          alert(
            "Vui lòng chọn loại phương tiện, mức độ khẩn cấp và đội cứu hộ trước khi chấp nhận",
          );
          return;
        }

        const res = await updateRequest({
          requestId: id,
          urgency: displayUrgency,
          rescueTeamID: rescueTeam,
          vehicleType: displayVehicle,
        });
        if (!res) return;

        navigate(ROUTES.COORDINATE_MAP, {
          state: {
            userLat: res.latitude,
            userLng: res.longitude,
            userName: res.citizenName,
            teamLat: res.rescueTeamLatitude,
            teamLng: res.rescueTeamLongitude,
            teamName: res.rescueTeamName,
          },
        });
        return;
      }

      const cancelled = await cancelRequest(id);
      if (!cancelled) return;
      alert("Đã từ chối yêu cầu!");
      navigate(-1);
    } catch (error) {
      console.error("Lỗi API:", error);
      alert("Lỗi khi cập nhật trạng thái yêu cầu.");
    }
  };

  return (
    <Card className="bg-white w-[50vw] h-[75vh] py-[2vh]! overflow-y-auto hide-scrollbar">
      <CardHeader>
        <CardTitle className="text-lg font-bold mb-[-1vh]">
          Yêu cầu loại{" "}
          <span className="text-red-600">
            {getRequestTypeLabel(requestDetail?.type).toUpperCase()}
          </span>
        </CardTitle>
        <CardDescription className="flex flex-row justify-between items-start text-black">
          <div>
            <span className="text-base font-semibold capitalize text-blue-600">
              {requestDetail?.status}
            </span>
            <br />
            <span>{request?.createdAt ? timeAgo(request.createdAt) : ""}</span>
          </div>
          <select
            value={displayUrgency ?? ""}
            onChange={(e) => setUrgency(e.target.value)}
            disabled={requestDetail?.status !== "yêu cầu mới"}
            className="h-[3.5vh] w-[12vw] px-2 rounded-full border border-gray-400 text-[1.6vh] bg-white outline-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled hidden>
              Chọn mức độ
            </option>
            <option value="cao">Cao</option>
            <option value="trung bình">Trung bình</option>
            <option value="thấp">Thấp</option>
          </select>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-[2vh]">
        <div className={miniDiv}>
          <div className="flex flex-row gap-[1vh]">
            <Phone className="h-5! w-5!" /> Người yêu cầu cứu hộ
          </div>
          <span className="pl-[1.8vw] text-lg font-semibold">
            {request?.citizenName}
          </span>
          <span className="pl-[1.8vw] text-lg font-semibold">{request?.phone}</span>
        </div>

        <div className={miniDiv}>
          <div className="flex flex-row gap-[1vh]">
            <MapPin className="h-5! w-5!" /> Vị trí
          </div>
          <span className="pl-[1.8vw] text-lg font-semibold">
            {requestDetail?.address}
          </span>
          <div className="ml-[1.8vw]">Tọa độ GPS</div>
          <span className="pl-[1.8vw] text-lg font-semibold">
            {requestDetail?.longitude},{requestDetail?.latitude}
          </span>
        </div>

        <div className={miniDiv}>
          Mô tả tình trạng
          <Textarea
            readOnly
            value={requestDetail?.description || "Không có mô tả"}
          />
        </div>

        <div className={miniDiv}>
          <div className="flex flex-row gap-[1vh]">
            <Image className="h-5! w-5!" /> Link ảnh đính kèm
          </div>
          <Input
            readOnly
            value={requestDetail?.additionalLink || "Không có link"}
          />
        </div>

        <div className={miniDiv}>
          Phân loại phương tiện phù hợp
          <div className="flex flex-row gap-[2vw]">
            {[
              {
                value: "xe cứu hộ",
                label: "Xe cứu hộ",
                icon: <Van className="h-7! w-7!" />,
              },
              {
                value: "xuồng",
                label: "Xuồng",
                icon: <Ship className="h-7! w-7!" />,
              },
              {
                value: "trực thăng",
                label: "Trực thăng",
                icon: <Helicopter className="h-7! w-7!" />,
              },
            ].map((v) => (
              <Button
                key={v.value}
                className={`${vehiclesButton} ${displayVehicle === v.value ? activeStyle : normalStyle}`}
                onClick={() => setVehicle(v.value)}
                disabled={requestDetail?.status !== "yêu cầu mới"}
              >
                {v.icon}
                {v.label}
              </Button>
            ))}
          </div>
        </div>

        <div className={miniDiv}>
          Phân công đội cứu hộ phù hợp
          {requestDetail?.status === "yêu cầu mới" ? (
            <select
              value={rescueTeam ?? ""}
              onChange={(e) => setRescueTeam(e.target.value)}
              className="h-[5vh] w-[80%] px-3 text-[1.8vh] bg-white border-2 border-black rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled hidden>
                -- Chọn đội cứu hộ --
              </option>
              {vehicleList.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          ) : (
            <div className="h-[5vh] w-[80%] px-3 flex items-center text-[1.8vh] bg-gray-100 border-2 border-gray-300 rounded-lg font-bold text-gray-700">
              {displayRescueTeam || "Không có"}
            </div>
          )}
        </div>
      </CardContent>

      {requestDetail?.status !== "hoàn thành" &&
        requestDetail?.status !== "đã huỷ" && (
          <CardFooter className="flex flex-row items-center justify-center px-[2vw] gap-[3vw]">
            <Button
              onClick={() => handleUpdateStatus("reject")}
              disabled={isUpdating}
              className="h-[5vh]! w-[8vw]! text-white! font-bold! bg-red-600! hover:!bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Từ chối
            </Button>

            {requestDetail?.status === "yêu cầu mới" && (
              <Button
                onClick={() => handleUpdateStatus("accept")}
                disabled={isUpdating}
                className="h-[5vh]! w-[8vw]! text-white! font-bold! bg-blue-600! hover:!bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cập Nhật
              </Button>
            )}
          </CardFooter>
        )}
      {updateError && (
        <div className="px-[2vw] pb-[2vh] text-sm text-red-600">{updateError}</div>
      )}
    </Card>
  );
}

function MiniMap({
  latitude,
  longitude,
  citizenName,
}: {
  latitude: number | null;
  longitude: number | null;
  citizenName?: string;
}) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { map, mount, mapLoaded, unmount } = useVietMap();
  const markerRef = useRef<vietmapgl.Marker | null>(null);
  const popupRef = useRef<vietmapgl.Popup | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      mount(mapContainer.current);
    }
    return () => unmount();
  }, [mount, unmount]);

  useEffect(() => {
    if (!mapLoaded || !map || !latitude || !longitude) return;

    const lngLat: [number, number] = [longitude, latitude];
    popupRef.current?.remove();
    markerRef.current?.remove();
    popupRef.current = new vietmapgl.Popup({ offset: 25, closeButton: false })
      .setHTML(`
        <div>
          <p style="font-weight:700;font-size:13px;margin:0 0 4px;color:#111; text-align:center;">
            Người yêu cầu:${citizenName}
          </p>
        </div>
      `);

    markerRef.current = new vietmapgl.Marker({ color: "#ef4444" })
      .setLngLat(lngLat)
      .setPopup(popupRef.current)
      .addTo(map);
    markerRef.current.togglePopup();
    map.flyTo({ center: lngLat, zoom: 15, duration: 1500 });
  }, [mapLoaded, map, latitude, longitude, citizenName]);

  return (
    <Card className="w-[45vw] h-[75vh] p-0 overflow-hidden relative bg-gray-100">
      <div ref={mapContainer} className="h-full w-full absolute inset-0" />
      {(!latitude || !longitude) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <div className="text-gray-500 font-medium flex flex-col items-center gap-2">
            <MapPin
              size={48}
              className="opacity-30 text-red-500 animate-pulse"
            />
            <p className="bg-white px-4 py-1 rounded-full shadow-sm">
              {!latitude ? "Đang lấy tọa độ GPS..." : "Không có dữ liệu vị trí"}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
