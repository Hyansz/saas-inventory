"use client";

interface MobileCardListProps<T> {
    items: T[];
    empty?: React.ReactNode;
    renderItem: (item: T) => React.ReactNode;
}

export default function MobileCardList<T>({
    items,
    empty,
    renderItem,
}: MobileCardListProps<T>) {
    return (
        <div className="lg:hidden space-y-4">
            {items.length > 0
                ? items.map((item, index) => (
                        <div key={index}>{renderItem(item)}</div>
                    ))
                : empty}
        </div>
    );
}
