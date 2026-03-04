import {Undo2, Phone, MapPin, Image, Helicopter, Van, Ship} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";

import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/router/routes.tsx";
import { useVietMap } from "@/lib/MapProvider.tsx";
import vietmapgl from "@vietmap/vietmap-gl-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Input } from "@/components/ui/input.tsx";

const rescueTeams: string[] = [
    "Đội cứu hộ A",
    "Đội cứu hộ B",
    "Đội cứu hộ C",
    "Đội cứu hộ D",
    "Đội cứu hộ E",
    "Đội cứu hộ F",
    "Đội cứu hộ G",
    "Đội cứu hộ H",
];

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

export default function RequestDetailPage() {
    const topButoons =
        "!bg-gray-300 !text-black !font-bold";

    const navigate = useNavigate();

    const handleFullMap = () => {
        navigate(ROUTES.FULLMAP);
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col flex-1 w-full bg-white pt-[6vh]">
                <div className="flex flex-row flex-[0.5] justify-between items-center
            px-[2vw] mb-[2vh]">
                    <div className="flex flex-row gap-[1vw]">
                        <Button className={topButoons}>
                            <Undo2 className="!w-5 !h-5" strokeWidth={2.5} />
                            Quay Lại
                        </Button>
                        <Button className={topButoons}>
                            Hộp thoại
                        </Button>
                    </div>
                    <Button className="!bg-gray-300 !text-black !font-bold"
                    onClick={handleFullMap}>
                        Toàn bản đồ
                    </Button>
                </div>
                <Solving />
            </div>
        </div>
    );
}

export function Solving(){
    return (
        <div className="w-full flex-[9.5] bg-white pt-[1vh]
        flex flex-row justify-between items-start px-[2vw]">
            <Information/>
            <MiniMap/>
        </div>
    );
}

export function Information(){
    const [vehicle, setVehicle] = useState<string | null>(null);

    const activeStyle = "!bg-gray-100";
    const normalStyle = "!bg-transparent";

    const fakeDescription = "";
    const fakeImgLink = "";

    const vehiclesButton =
        "flex flex-col gap-0 !w-[6vw] !h-[8vh] !border-gray-300 !text-black";
    const miniDiv =
    "flex flex-col gap-1";

    return (
       <Card className="bg-white w-[54vw] h-[75vh] !py-[2vh]
        overflow-y-auto hide-scrollbar">
            <CardHeader>
                <CardTitle className="text-lg font-bold mb-[-1vh]">Yêu cầu #XXX</CardTitle>
                <CardDescription className="flex flex-row justify-between items-start text-black">
                    <div>
                        <span className="text-base font-semibold">Yêu cầu mới</span>
                        <br/>
                        <span>x phút trước</span>
                    </div>
                    <Select>
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
                    <span className="pl-[1.8vw] text-lg font-semibold">phone number</span>
                </div>

                <div className={miniDiv}>
                    <div className="flex flex-row gap-[1vh]">
                        <MapPin className="!h-5 !w-5"/> Vị trí
                    </div>
                    <span className="pl-[1.8vw] text-lg font-semibold">Address</span>
                </div>

                <div className={miniDiv}>
                    Mô tả tình trạng
                    <Textarea readOnly
                              value={fakeDescription  === "" ? "There is no description" : fakeDescription}/>
                </div>

                <div className={miniDiv}>
                    <div className="flex flex-row gap-[1vh]">
                        <Image className="!h-5 !w-5"/> Link ảnh đính kèm
                    </div>
                    <Input readOnly
                              value={fakeImgLink  === "" ? "There is no link" : fakeImgLink}/>
                </div>

                <div className={miniDiv}>
                    Phân loại phương tiện phù hợp
                    <div className="flex flex-row gap-[2vw]">
                        <Button
                            className={`${vehiclesButton} ${
                                vehicle === "van" ? activeStyle : normalStyle
                            }`}
                            onClick={() => setVehicle("van")}
                        >
                            <Van className="!h-7 !w-7" />
                            Xe cứu hộ
                        </Button>

                        <Button
                            className={`${vehiclesButton} ${
                                vehicle === "boat" ? activeStyle : normalStyle
                            }`}
                            onClick={() => setVehicle("boat")}
                        >
                            <Ship className="!h-7 !w-7" />
                            Xuồng
                        </Button>

                        <Button
                            className={`${vehiclesButton} ${
                                vehicle === "heli" ? activeStyle : normalStyle
                            }`}
                            onClick={() => setVehicle("heli")}
                        >
                            <Helicopter className="!h-7 !w-7" />
                            Trực thăng
                        </Button>
                    </div>
                </div>

                <div className={miniDiv}>
                    Phân công đội cứu hộ phù hợp
                    <Select>
                        <SelectTrigger className="!h-[5vh] w-[80%] !text-[2vh]
                        !bg-transparent ">
                            <SelectValue placeholder="Chọn đội cứu hộ"/>
                        </SelectTrigger>

                        <SelectContent>
                            {rescueTeams.map((team) => (
                                <SelectItem key={team} value={team}>
                                    {team}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>

            <CardFooter className="flex flex-row items-center justify-center px-[2vw] gap-[3vw]">
                <Button className="!h-[5vh] !w-[8vw]
                !text-white !font-bold !bg-red-600">
                    Từ chối
                </Button>
                <Button className="!h-[5vh] !w-[8vw]
                !text-white !font-bold !bg-indigo-600">
                    Chấp nhận
                </Button>
            </CardFooter>
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