"use client";

type FilterTabsProps<T extends string> = {
    items: T[];
    value: T;
    onChange: (value: T) => void;
    counts?: Partial<Record<T, number>>;
};

export function FilterTabs<T extends string>({
    items,
    value,
    onChange,
    counts,
}: FilterTabsProps<T>) {
    return (
        <div className="listing-filter proto-tabs" role="tablist">
            {items.map((item) => {
                const active = value === item;
                const count = counts?.[item];

                return (
                    <button
                        key={item}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={active ? "filter-active" : undefined}
                        onClick={() => onChange(item)}
                    >
                        {item}

                        {count !== undefined && (
                            <span className="tab-count">{count}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
