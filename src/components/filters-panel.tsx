"use client";

import { useState } from "react";

import { SearchFilters } from "@/components/search-filters";
import type { PropertyFilters } from "@/lib/types";

export function FiltersPanel({
  cities,
  filters,
  defaultOpen = false,
}: {
  cities: string[];
  filters: PropertyFilters;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="btn-outline w-full lg:hidden"
      >
        {open ? "Mbyll filtrat" : "Filtrat e kërkimit"}
      </button>
      <div className={`${open ? "mt-4 block" : "hidden"} lg:mt-0 lg:block`}>
        <SearchFilters cities={cities} filters={filters} />
      </div>
    </div>
  );
}
