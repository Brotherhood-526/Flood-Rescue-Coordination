import {Button} from "@/components/ui/button.tsx";
import {CommonTable} from "@/layouts/DataTable.tsx";
import {
    TableCell,
    TableRow,
} from "@/components/ui/table.tsx";
import { ClipboardPlus, RefreshCcw, Clock, SquareCheck, CircleX, SlidersVertical } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/router/routes.tsx";

export type RescueRequest = {
    id: number;
    phone: string;
    rescuer: string;
    status: "active" | "offline";
    createdAt: string;
};

const fakeRequests: RescueRequest[] = [
    {
        id: 1,
        phone: "0723456789",
        rescuer: "Nguyễn Văn A",
        status: "offline",
        createdAt: "01/01/2026 00:00",
    },
    {
        id: 2,
        phone: "0988123123",
        rescuer: "Trần Văn B",
        status: "active",
        createdAt: "02/01/2026 09:12",
    },
    {
        id: 3,
        phone: "0912345678",
        rescuer: "Lê Văn C",
        status: "active",
        createdAt: "03/01/2026 14:30",
    },
    {
        id: 4,
        phone: "0901112233",
        rescuer: "Phạm Văn D",
        status: "active",
        createdAt: "04/01/2026 08:45",
    },
    {
        id: 5,
        phone: "0377778888",
        rescuer: "Hoàng Văn E",
        status: "active",
        createdAt: "05/01/2026 11:10",
    },
    {
        id: 6,
        phone: "0399991111",
        rescuer: "Đỗ Văn F",
        status: "offline",
        createdAt: "06/01/2026 16:22",
    },
    {
        id: 7,
        phone: "0351234567",
        rescuer: "Bùi Văn G",
        status: "active",
        createdAt: "07/01/2026 19:05",
    },
    {
        id: 8,
        phone: "0384567890",
        rescuer: "Vũ Văn H",
        status: "active",
        createdAt: "08/01/2026 07:50",
    },
];

export default function ListRequestPage() {
    return (
        <div className="flex flex-col w-full pt-[3vh]">
            <Filters />
            <Requests />
        </div>
    );
}

export function Filters(){
    const filterButton =
        "!rounded-none !bg-white !border !border-gray-300 !w-[10vw] !h-[15vh] !text-black " +
        "flex flex-col items-center justify-center gap-2";

    return (
        <div className="!w-full bg-white flex-[2] !pt-[4vh] !pb-[1vh]
        flex flex-row justify-center items-center gap-10">
            <Button className={filterButton}>
                <ClipboardPlus className="!w-10 !h-10"/>
                <span className="!text-xl font-semibold">Yêu cầu mới</span>
            </Button>
            <Button className={filterButton}>
                <RefreshCcw className="!w-10 !h-10"/>
                <span className="!text-xl font-semibold">Đang xử lý</span>
            </Button>
            <Button className={filterButton}>
                <Clock className="!w-10 !h-10"/>
                <span className="!text-xl font-semibold">Tạm hoãn</span>
            </Button>
            <Button className={filterButton}>
                <SquareCheck className="!w-10 !h-10"/>
                <span className="!text-xl font-semibold">Hoàn thành</span>
            </Button>
            <Button className={filterButton}>
                <CircleX className="!w-10 !h-10"/>
                <span className="!text-xl font-semibold">Đã hủy</span>
            </Button>
        </div>
    );
}

export function Requests(){
    const navigate = useNavigate();

    const handleOpenRequest = () => {
        navigate(ROUTES.REQUESTDETAILS);
    }

    const columns = [
        "ID",
        "Số điện thoại",
        "Người cứu hộ",
        "Trạng thái",
        "Thời gian tạo",
    ];

    return (
        <div className="!w-full bg-white flex-[8] p-4
        flex flex-col !items-center justify-start">
            <div className="w-full flex justify-end mb-2">
                <SlidersVertical className="!w-10 !h-10 cursor-pointer"/>
            </div>
            {/*<Table className="table-fixed w-full">*/}
            {/*    <TableHeader className="bg-gray-200 [&_th]:text-center [&_th]:font-bold [&_th]:text-base">*/}
            {/*        <TableRow>*/}
            {/*            <TableHead className="w-20">ID</TableHead>*/}
            {/*            <TableHead>Số điện thoại</TableHead>*/}
            {/*            <TableHead>Người cứu hộ</TableHead>*/}
            {/*            <TableHead>Trạng thái</TableHead>*/}
            {/*            <TableHead>Thời gian tạo</TableHead>*/}
            {/*        </TableRow>*/}
            {/*    </TableHeader>*/}

            {/*    <TableBody className="text-center cursor-pointer">*/}
            {/*        {fakeRequests.map((r) => (*/}
            {/*            <TableRow key={r.id} onClick={handleOpenRequest}>*/}
            {/*                <TableCell className="font-semibold">0{r.id}</TableCell>*/}
            {/*                <TableCell>{r.phone}</TableCell>*/}
            {/*                <TableCell>{r.rescuer}</TableCell>*/}
            {/*                <TableCell>*/}
            {/*    <Status status={r.status}/>*/}
            {/*                </TableCell>*/}
            {/*                <TableCell>{r.createdAt}</TableCell>*/}
            {/*            </TableRow>*/}
            {/*        ))}*/}
            {/*    </TableBody>*/}
            {/*</Table>*/}

            <CommonTable
                columns={columns}
                data={fakeRequests}
                renderRow={(r) => (
                    <TableRow key={r.id} onClick={handleOpenRequest}>
                        <TableCell className="font-semibold">0{r.id}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell>{r.rescuer}</TableCell>
                        <TableCell>
                            <Status status={r.status} />
                        </TableCell>
                        <TableCell>{r.createdAt}</TableCell>
                    </TableRow>
                )}
            />
        </div>
    );
}

export function Status({status}:{status:string}){
    switch(status){
        case "active":
            return  <span className="px-4 py-1 rounded-full bg-emerald-200 text-emerald-700">
                        Hoạt động
                    </span>;
        case "offline":
            return <span className="px-4 py-1 rounded-full bg-red-200 text-red-700">
                        Tạm dừng
                    </span>;
    }
}