"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
    Clock3,
    FolderTree,
    LayoutDashboard,
    Loader2,
    Package,
    Search,
} from "lucide-react";

import { searchGlobal } from "@/services/search";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CommandPalette({ open, onClose }: Props) {
    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(false);

    const [results, setResults] = useState<any>({
        menus: [],
        items: [],
        categories: [],
        transactions: [],
        stockOpnames: [],
    });

    const inputRef = useRef<HTMLInputElement>(null);

    /*
    |--------------------------------------------------------------------------
    | FOCUS INPUT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);

            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    /*
    |--------------------------------------------------------------------------
    | ESC CLOSE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        function esc(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", esc);

        return () => {
            document.removeEventListener("keydown", esc);
        };
    }, [onClose]);

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!query.trim()) {
            setResults({
                menus: [],
                items: [],
                categories: [],
                transactions: [],
                stockOpnames: [],
            });

            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);

                const data = await searchGlobal(query);

                setResults({
                    menus: data.menus || [],
                    items: data.items || [],
                    categories: data.categories || [],
                    transactions: data.transactions || [],
                    stockOpnames: data.stockOpnames || [],
                });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    /*
    |--------------------------------------------------------------------------
    | TOTAL
    |--------------------------------------------------------------------------
    */

    const total =
        (results?.menus?.length || 0) +
        (results?.items?.length || 0) +
        (results?.categories?.length || 0) +
        (results?.transactions?.length || 0);

    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-[999]
                bg-black/50
                backdrop-blur-sm
                flex
                items-start
                justify-center
                pt-20
                px-4
            "
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full
                    max-w-3xl
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-zinc-200
                    bg-white
                    shadow-[0_30px_120px_rgba(0,0,0,0.18)]
                "
            >
                {/* SEARCH BAR */}
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        border-b
                        border-zinc-200
                        px-5
                        h-16
                    "
                >
                    <Search size={18} className="text-zinc-400" />

                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search inventory, transaction..."
                        className="
                            flex-1
                            bg-transparent
                            outline-none
                            text-[15px]
                        "
                    />

                    {loading && (
                        <Loader2
                            size={18}
                            className="animate-spin text-zinc-400"
                        />
                    )}
                </div>

                {/* RESULTS */}
                <div
                    className="
                        max-h-[75vh]
                        overflow-y-auto
                        p-3
                    "
                >
                    {!query && (
                        <div
                            className="
                                py-16
                                text-center
                                text-sm
                                text-zinc-500
                            "
                        >
                            Search menu, item, transaction, stock opname...
                        </div>
                    )}

                    {query && total === 0 && !loading && (
                        <div
                            className="
                                py-16
                                text-center
                                text-sm
                                text-zinc-500
                            "
                        >
                            No results found
                        </div>
                    )}

                    {/* MENUS */}
                    <SearchGroup
                        title="Menus"
                        items={results.menus}
                        icon={<LayoutDashboard size={16} />}
                        onClose={onClose}
                    />

                    {/* ITEMS */}
                    <SearchGroup
                        title="Items"
                        items={results.items}
                        icon={<Package size={16} />}
                        onClose={onClose}
                    />

                    {/* CATEGORIES */}
                    <SearchGroup
                        title="Categories"
                        items={results.categories}
                        icon={<FolderTree size={16} />}
                        onClose={onClose}
                    />

                    {/* TRANSACTIONS */}
                    <SearchGroup
                        title="Transactions"
                        items={results.transactions}
                        icon={<Clock3 size={16} />}
                        onClose={onClose}
                    />

                    {/* STOCK OPNAME */}
                    <SearchGroup
                        title="Stock Opname"
                        items={results.stockOpnames}
                        icon={<Package size={16} />}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* SEARCH GROUP */
/* -------------------------------------------------------------------------- */

function SearchGroup({ title, items, icon, onClose }: any) {
    if (!items?.length) return null;

    return (
        <div className="mb-5">
            <div
                className="
                    px-3
                    pb-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-zinc-400
                "
            >
                {title}
            </div>

            <div className="space-y-1">
                {items.map((item: any, index: number) => (
                    <Link
                        key={`${item.type}-${item.id || index}`}
                        href={item.href}
                        onClick={onClose}
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            px-3
                            py-3
                            transition
                            hover:bg-zinc-100
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-zinc-100
                                text-zinc-700
                                shrink-0
                            "
                        >
                            {icon}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {item.title}
                            </p>

                            <p className="mt-1 truncate text-xs text-zinc-500">
                                {item.subtitle || item.href}
                            </p>
                        </div>

                        <div
                            className="
                                rounded-lg
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-zinc-500
                            "
                        >
                            {item.page || title}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
