import {Undo2, Phone, MapPin, Image, Helicopter, Van, Ship} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";

import {useState, useEffect, useRef, useMemo} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "@/router/routes.tsx";
import { useVietMap } from "@/lib/MapProvider.tsx";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Input } from "@/components/ui/input.tsx";
import {useRequestDetail} from "@/hooks/useRequestDetail.ts";
import {useRequestUpdate} from "@/hooks/useRequestUpdate.ts";
import type {RescueRequest} from "@/pages/Coordinator/ListRequestPage.tsx";
import {useVehicleList} from "@/hooks/useVehicle.ts";
import {useRequestReject} from "@/hooks/useRequestReject.ts";

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];

const USER_LOCATIONS: [number, number][] = [
    [10.8231, 106.6297],
    [10.8453, 106.6577],
    [10.7314, 106.6936],
    [10.8012, 106.7143],
    [10.7560, 106.6723],
    [10.8655, 106.7430],
];

const TEAM_LOCATIONS: [number, number][] = [
    [10.7769, 106.7009],
    [10.8380, 106.6670],
    [10.7904, 106.6350],
    [10.7432, 106.6298],
    [10.8700, 106.8030],
];

export type RequestDetail = {
    id: string;
    type: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    additionalLink: string;
    status: string;
    createdAt: string;
    urgency: string | null;
    rescueTeamId: string | null;
    rescueTeamName: string | null;
    vehicleId: string | null;
    vehicleType: string | null;
};

export type UpdateRequest = {
    id: string;
    status?: string;
    urgency?: string;
    rescueTeamId?: string | null;
    vehicleType?: string | null;
    vehicleIdPrevious?: string | null;
    vehicleState?: string;
};

export type RejectRequest = {
    id: string;
};

export default function RequestDetailPage() {
    const topButoons =
        "!bg-gray-300 !text-black !font-bold";

    const navigate = useNavigate();
    const { id } = useParams();

    const requestDetail = useRequestDetail({ id: id! });

    const handleFullMap = () => {
        navigate(ROUTES.FULLMAP);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleChatBox = () => {
        navigate(`/coordinate/chatbox/${requestDetail?.id}`);
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col flex-1 w-full bg-white pt-[4vh]">
                <div className="flex flex-row flex-[0.5] justify-between items-center
            px-[2vw] mb-[2vh]">
                    <div className="flex flex-row gap-[1vw]">
                        <Button className={topButoons}
                        onClick={handleBack}>
                            <Undo2 className="!w-5 !h-5" strokeWidth={2.5} />
                            Quay Lại
                        </Button>
                        <Button className={topButoons}
                        onClick={handleChatBox}>
                            Hộp thoại
                        </Button>
                    </div>
                    <Button className="!bg-gray-300 !text-black !font-bold"
                    onClick={handleFullMap}>
                        Toàn bản đồ
                    </Button>
                </div>
                <Solving requestDetail={requestDetail}/>
            </div>
        </div>
    );
}

export function Solving({ requestDetail }: { requestDetail: RequestDetail | null }){
    return (
        <div className="w-full flex-[9.5] bg-white pt-[1vh]
        flex flex-row justify-between items-start px-[2vw]">
            <Information requestDetail={requestDetail} />
            <MiniMap/>
        </div>
    );
}

export function Information({ requestDetail }: { requestDetail: RequestDetail | null }){
    const [vehicle, setVehicle] = useState<string | null >(null);
    const [urgency, setUrgency] = useState<string | null>(null);
    const [rescueTeam, setRescueTeam] = useState<string | null>(null);

    const {id} = useParams();
    const navigate = useNavigate();
    const {rejectRequest} = useRequestReject();
    const { updateRequest } = useRequestUpdate();

    const rescueTeams = useVehicleList({ type: vehicle });
    const rescueTeamsWithCurrent = useMemo(() => {
        if (!requestDetail || requestDetail?.vehicleType != vehicle) return rescueTeams;

        const exist = rescueTeams.some(
            (t) => t.rescueTeamId === requestDetail.rescueTeamId
        );

        if (!exist && requestDetail.rescueTeamId) {
            return [
                ...rescueTeams,
                {
                    id: requestDetail.vehicleId ?? "current",
                    type: requestDetail.vehicleType ?? "",
                    rescueTeamId: requestDetail.rescueTeamId,
                    rescueTeamName: requestDetail.rescueTeamName ?? "Current Team"
                }
            ];
        }

        return rescueTeams;

    }, [rescueTeams, requestDetail]);

    const activeStyle = "!bg-gray-200";

    console.log("ID from usePara", id);

    const location = useLocation();
    const request = location.state as RescueRequest;

    useEffect(() => {
        if (requestDetail?.vehicleType) {
            setVehicle(requestDetail.vehicleType);
        }
    }, [requestDetail]);

    useEffect(() => {
        if (requestDetail?.urgency) {
            setUrgency(requestDetail.urgency);
        }
    }, [requestDetail]);

    useEffect(() => {
        if (!rescueTeam && requestDetail?.rescueTeamId && rescueTeams.length > 0) {
            setRescueTeam(requestDetail.rescueTeamId);
        }
    }, [requestDetail, rescueTeams]);

    console.log(requestDetail);

    const normalStyle = "!bg-transparent";

    const fakeImgLink = "";

    const vehiclesButton =
        "flex flex-col gap-0 !w-[6vw] !h-[8vh] !border-gray-300 !text-black";
    const miniDiv =
    "flex flex-col gap-1";

    function timeAgo(createdAt:string) {
        const createdTime = new Date(createdAt.replace(" ", "T"));
        const now = new Date();

        // @ts-ignore
        const diffMs = now - createdTime;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return `${seconds} giây trước`;
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    }

    function requestType(type?:string) {
        switch (type) {
            case "goods": return "cung cấp như yếu phẩm";
            case "rescue": return "cứu hộ";
            default: return "khác";
        }
    }

    const getStatusText = (status?: string) => {
        switch (status) {
            case "accept":
                return "Chấp nhận";
            case "processing":
                return "Đang xử lý";
            case "completed":
                return "Hoàn thành";
            case "reject":
                return "từ chối";
            case "delayed":
                return "tạm hoãn";
            default:
                return "Không xác định";
        }
    };

    const handleSubmit = async () =>{
        const ok = await updateRequest({
            id: requestDetail!.id,
            status: "accept",
            urgency: urgency!,
            rescueTeamId: rescueTeam,
            vehicleType: vehicle,
            vehicleIdPrevious: requestDetail?.vehicleId,
            vehicleState: "using"
        });

        if (ok) {
            navigate(-1);
        }
    }

    const handleReject = async () =>{
        const ok = await rejectRequest({id: requestDetail!.id});

        if (ok) {navigate(-1);}
    }

    return (
       <Card className="bg-white w-[54vw] h-[75vh] !py-[2vh]
        overflow-y-auto hide-scrollbar">
            <CardHeader>

                <CardTitle className="text-lg font-bold mb-[-1vh]">Yêu cầu về {requestType(requestDetail?.type)}</CardTitle>
                <CardDescription className="flex flex-row justify-between items-start text-black">
                    <div>
                        <span className="text-base font-semibold">{getStatusText(requestDetail?.status)}</span>
                        <br/>
                        <span>{timeAgo(request.createdAt)}</span>
                    </div>
                    <Select value={urgency ?? undefined} onValueChange={setUrgency}>
                        <SelectTrigger className="!h-[3vh] w-full max-w-[17vw] !rounded-full !text-[2vh]
                        !bg-transparent ">
                            <SelectValue placeholder="Hãy chọn mức độ khẩn cấp"/>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="high">Cao</SelectItem>
                            <SelectItem value="medium">Trung bình</SelectItem>
                            <SelectItem value="low">Thấp</SelectItem>
                        </SelectContent>
                    </Select>
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-[2vh]">
                <div className={miniDiv}>
                    <div className="flex flex-row gap-[1vh]">
                        <Phone className="!h-5 !w-5"/> Người yêu cầu
                    </div>
                    <span className="pl-[1.8vw] text-lg font-semibold">{request.name}</span>
                </div>

                <div className={miniDiv}>
                    <div className="flex flex-row gap-[1vh]">
                        <MapPin className="!h-5 !w-5"/> Vị trí
                    </div>
                    <span className="pl-[1.8vw] text-lg font-semibold">{requestDetail?.address}</span>
                </div>

                <div className={miniDiv}>
                    Mô tả tình trạng
                    <Textarea readOnly
                              value={requestDetail?.description  === "" ? "There is no description" : requestDetail?.description}/>
                </div>

                <div className={miniDiv}>
                    <div className="flex flex-row gap-[1vh]">
                        <Image className="!h-5 !w-5"/> Link ảnh đính kèm
                    </div>
                    <Input readOnly
                              value={fakeImgLink  === "" ? "There is no link" : requestDetail?.additionalLink}/>
                </div>

                <div className={miniDiv}>
                    Phân loại phương tiện phù hợp
                    <div className="flex flex-row gap-[2vw]">
                        <Button
                            className={`${vehiclesButton} ${
                                vehicle === "Rescue Vehicle" ? activeStyle : normalStyle
                            }`}
                            onClick={() => setVehicle("Rescue Vehicle")}
                        >
                            <Van className="!h-7 !w-7" />
                            Xe cứu hộ
                        </Button>

                        <Button
                            className={`${vehiclesButton} ${
                                vehicle === "Boat" ? activeStyle : normalStyle
                            }`}
                            onClick={() => setVehicle("Boat")}
                        >
                            <Ship className="!h-7 !w-7" />
                            Xuồng
                        </Button>

                        <Button
                            className={`${vehiclesButton} ${
                                vehicle === "Helicopter" ? activeStyle : normalStyle
                            }`}
                            onClick={() => setVehicle("Helicopter")}
                        >
                            <Helicopter className="!h-7 !w-7" />
                            Trực thăng
                        </Button>
                    </div>
                </div>

                <div className={miniDiv}>
                    Phân công đội cứu hộ phù hợp
                    <Select value={rescueTeam ?? undefined} onValueChange={setRescueTeam}>
                        <SelectTrigger className="!h-[5vh] w-[80%] !text-[2vh]
                        !bg-transparent ">
                            <SelectValue placeholder="Chọn đội cứu hộ"/>
                        </SelectTrigger>

                        <SelectContent>
                            {rescueTeamsWithCurrent.map((team) => (
                                <SelectItem key={team.rescueTeamId} value={team.rescueTeamId}>
                                    {team.rescueTeamName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>

           {requestDetail?.status !== "completed" && (
               <CardFooter className="flex flex-row items-center justify-center px-[2vw] gap-[3vw]">
                   <Button className="!h-[5vh] !w-[8vw]
                !text-white !font-bold !bg-red-600"
                   onClick={handleReject}>
                       Từ chối
                   </Button>
                   <Button className="!h-[5vh] !w-[8vw]
                !text-white !font-bold !bg-indigo-600"
                   onClick={handleSubmit}>
                       {requestDetail?.status === "processing" ? "Chấp nhận"  : "Cập Nhật"}
                   </Button>
               </CardFooter>
           )}
        </Card>
    );
}

export function MiniMap() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const { map, mount } = useVietMap();

    useEffect(() => {
        if (!mapContainer.current) return;
        mount(mapContainer.current);
    }, [mount]);

    useEffect(() => {
        if (!map) return;

        map.flyTo({
            center: [DEFAULT_CENTER[1], DEFAULT_CENTER[0]],
            zoom: 13,
        });

        TEAM_LOCATIONS.forEach((position) => {
            const el = document.createElement("div");
            el.className =
                "w-3 h-3 bg-blue-600 rounded-full border-2 border-white";

            new vietmapgl.Marker({ element: el })
                .setLngLat([position[1], position[0]])
                .addTo(map);
        });

        USER_LOCATIONS.forEach((position) => {
            const el = document.createElement("div");
            el.className =
                "w-3 h-3 bg-red-600 rounded-full border-2 border-white";

            new vietmapgl.Marker({ element: el })
                .setLngLat([position[1], position[0]])
                .addTo(map);
        });

    }, [map]);

    return (
        <Card className="w-[40vw] h-[75vh] p-0 overflow-hidden">
            <div ref={mapContainer} className="h-full w-full"/>
        </Card>
    );
}
