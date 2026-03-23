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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useVietMap } from "@/lib/useVietMap";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { ROUTES } from "@/router/routes";
import { useRequestDetail } from "@/hooks/Coordinator/useRequestDetail";
import { useVehicleList } from "@/hooks/Coordinator/useVehicle";
import { timeAgo } from "@/utils/timeAgo";
import { getRequestTypeLabel } from "@/utils/requestHelpers";
import type { CoordinatorRequest } from "@/types/coordinator";

const DEFAULT_CENTER: [number, number] = [106.7009, 10.7769];

// TODO: thay bằng data thật từ API
const USER_LOCATIONS: [number, number][] = [
    [106.6297, 10.8231],
    [106.6577, 10.8453],
    [106.6936, 10.7314],
    [106.7143, 10.8012],
    [106.6723, 10.756],
    [106.743, 10.8655],
];

// TODO: thay bằng data thật từ API
const TEAM_LOCATIONS: [number, number][] = [
    [106.7009, 10.7769],
    [106.667, 10.838],
    [106.635, 10.7904],
    [106.6298, 10.7432],
    [106.803, 10.87],
];

export default function RequestDetailPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col flex-1 w-full bg-white pt-[6vh]">
                <div className="flex flex-row flex-[0.5] justify-between items-center px-[2vw] mb-[2vh]">
                    <div className="flex flex-row gap-[1vw]">
                        <Button
                            className="bg-gray-300!text-black! font-bold!"
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
                        onClick={() => navigate(ROUTES.COORDINATE_MAP)}
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
    return (
        <div className="w-full flex-[9.5] bg-white pt-[1vh] flex flex-row justify-between items-start px-[2vw]">
            <Information />
            <MiniMap />
        </div>
    );
}

function Information() {
    const [vehicle, setVehicle] = useState<string | null>(null);
    const [urgency, setUrgency] = useState<string | null>(null);
    const [rescueTeam, setRescueTeam] = useState<string | null>(null);

    const { id } = useParams();
    const location = useLocation();
    const request = location.state as CoordinatorRequest;

    const { requestDetail } = useRequestDetail(id!);
    const { vehicleList } = useVehicleList(id, vehicle);

    const displayVehicle = vehicle ?? requestDetail?.vehicleType ?? null;
    const displayUrgency = urgency ?? requestDetail?.urgency ?? null;
    const displayRescueTeam = rescueTeam ?? requestDetail?.rescueTeamName ?? null;

    const activeStyle = "!bg-gray-100";
    const normalStyle = "!bg-transparent";
    const vehiclesButton =
        "flex flex-col gap-0 !w-[6vw] !h-[8vh] !border-gray-300 !text-black";
    const miniDiv = "flex flex-col gap-1";

    // useEffect(() => {
    //     if (requestDetail?.vehicleType) {
    //         setVehicle(requestDetail.vehicleType);
    //     }
    // }, [requestDetail]);

    return (
        <Card className="bg-white w-[54vw] h-[75vh] py-[2vh]! overflow-y-auto hide-scrollbar">
            <CardHeader>
                <CardTitle className="text-lg font-bold mb-[-1vh]">
                    Yêu cầu loại {getRequestTypeLabel(requestDetail?.type)}{" "}
                    {/* dùng util */}
                </CardTitle>
                <CardDescription className="flex flex-row justify-between items-start text-black">
                    <div>
            <span className="text-base font-semibold">
              {requestDetail?.status === "processing" ? "yêu cầu mới" : ""}
            </span>
                        <br />
                        <span>
              {request?.createdAt ? timeAgo(request.createdAt) : ""}
            </span>{" "}
                        {/* dùng util */}
                    </div>
                    <Select
                        value={displayUrgency ?? undefined}
                        onValueChange={setUrgency}
                    >
                        <SelectTrigger className="h-[3vh]! w-full max-w-[17vw] rounded-full! text-[2vh]! bg-transparent!">
                            <SelectValue placeholder="Hãy chọn mức độ khẩn cấp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cao">cao</SelectItem>
                            <SelectItem value="trung bình">Trung bình</SelectItem>
                            <SelectItem value="thấp">Thấp</SelectItem>
                        </SelectContent>
                    </Select>
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-[2vh]">
                <div className={miniDiv}>
                    <div className="flex flex-row gap-[1vh]">
                        <Phone className="h-5! w-5!" /> Người yêu cầu
                    </div>
                    <span className="pl-[1.8vw] text-lg font-semibold">
            {request?.citizenName}
          </span>
                    <span className="pl-[1.8vw] text-lg font-semibold">
            {request?.phone}
          </span>
                </div>

                <div className={miniDiv}>
                    <div className="flex flex-row gap-[1vh]">
                        <MapPin className="h-5! w-5!" /> Vị trí
                    </div>
                    <span className="pl-[1.8vw] text-lg font-semibold">
            {requestDetail?.address}
          </span>
                    <div className="ml-[1.8vw]">
                        tọa độ gps
                    </div>
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
                            >
                                {v.icon}
                                {v.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className={miniDiv}>
                    Phân công đội cứu hộ phù hợp
                    <Select
                        value={displayRescueTeam ?? undefined}
                        onValueChange={setRescueTeam}
                    >
                        <SelectTrigger className="h-[5vh]! w-[80%] text-[2vh]! bg-transparent!">
                            <SelectValue placeholder="Chọn đội cứu hộ" />
                        </SelectTrigger>
                        <SelectContent>
                            {vehicleList.map(
                                (
                                    team, // đổi rescueTeams → vehicleList
                                ) => (
                                    <SelectItem
                                        key={team.rescueTeamId}
                                        value={team.rescueTeamName}
                                    >
                                        {team.rescueTeamName}
                                    </SelectItem>
                                ),
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>

            {requestDetail?.status !== "completed" && (
                <CardFooter className="flex flex-row items-center justify-center px-[2vw] gap-[3vw]">
                    <Button className="h-[5vh]! w-[8vw]! text-white! font-bold! bg-red-600!">
                        Từ chối
                    </Button>
                    <Button className="h-[5vh]! w-[8vw]! text-white! font-bold! bg-indigo-600!">
                        {requestDetail?.status === "processing" ? "Chấp nhận" : "Cập Nhật"}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

function MiniMap() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const { map, mount } = useVietMap();

    useEffect(() => {
        if (!mapContainer.current) return;
        mount(mapContainer.current);
    }, [mount]);

    useEffect(() => {
        if (!map) return;
        map.flyTo({ center: [DEFAULT_CENTER[0], DEFAULT_CENTER[1]], zoom: 13 });

        TEAM_LOCATIONS.forEach((position) => {
            const el = document.createElement("div");
            el.className = "w-3 h-3 bg-blue-600 rounded-full border-2 border-white";
            new vietmapgl.Marker({ element: el }).setLngLat(position).addTo(map);
        });

        USER_LOCATIONS.forEach((position) => {
            const el = document.createElement("div");
            el.className = "w-3 h-3 bg-red-600 rounded-full border-2 border-white";
            new vietmapgl.Marker({ element: el }).setLngLat(position).addTo(map);
        });
    }, [map]);

    return (
        <Card className="w-[40vw] h-[75vh] p-0 overflow-hidden">
            <div ref={mapContainer} className="h-full w-full" />
        </Card>
    );
}
