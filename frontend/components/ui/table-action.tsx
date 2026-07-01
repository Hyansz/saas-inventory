"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

interface Props {
    onEdit?: () => void;

    onDelete?: () => void;

    onView?: () => void;
}

export default function TableAction({ onEdit, onDelete, onView }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-zinc-200
                        bg-white
                        transition-all
                        hover:bg-zinc-100
                        cursor-pointer
                    "
                >
                    <MoreHorizontal size={18} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="
                    w-44
                    rounded-2xl
                    border-zinc-200
                    p-2
                "
            >
                {onView && (
                    <DropdownMenuItem
                        onClick={onView}
                        className="
                            h-10
                            cursor-pointer
                            rounded-xl
                        "
                    >
                        <Eye size={16} className="mr-2" />
                        View
                    </DropdownMenuItem>
                )}

                {onEdit && (
                    <DropdownMenuItem
                        onClick={onEdit}
                        className="
                            h-10
                            cursor-pointer
                            rounded-xl
                        "
                    >
                        <Pencil size={16} className="mr-2" />
                        Edit
                    </DropdownMenuItem>
                )}

                {onDelete && (
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="
                            h-10
                            cursor-pointer
                            rounded-xl
                            text-red-600
                            focus:text-red-600
                        "
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
