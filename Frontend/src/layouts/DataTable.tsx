import {Table, TableHeader, TableRow, TableHead, TableBody} from "@/components/ui/table.tsx";
import React from "react";

type CommonTableProps<T> = {
    columns: string[];
    data: T[];
    renderRow: (item: T) => React.ReactNode;
};

export function CommonTable<T>({
                                   columns,
                                   data,
                                   renderRow,
                               }: CommonTableProps<T>) {
    return (
        <Table className="table-fixed w-full">
            <TableHeader className="bg-gray-200 [&_th]:text-center [&_th]:font-bold [&_th]:text-base">
                <TableRow>
                    {columns.map((col, index) => (
                        <TableHead key={index}>{col}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody className="text-center cursor-pointer">
                {data.map((item, index) => (
                    <React.Fragment key={index}>
                        {renderRow(item)}
                    </React.Fragment>
                ))}
            </TableBody>
        </Table>
    );
}
