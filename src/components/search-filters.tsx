import { DEALS, DEAL_LABELS, KINDS, KIND_LABELS } from "@/lib/types";
import type { PropertyFilters } from "@/lib/types";

interface Props {
  cities: string[];
  filters: PropertyFilters;
  variant?: "hero" | "sidebar";
}

export function SearchFilters({ cities, filters, variant = "sidebar" }: Props) {
  const isHero = variant === "hero";

  return (
    <form
      action="/prona"
      method="get"
      className={
        isHero
          ? "grid gap-4 border border-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
          : "card space-y-4 p-5"
      }
    >
      <div className={isHero ? "lg:col-span-2" : ""}>
        <label className="label" htmlFor="q">
          Kërko
        </label>
        <input
          id="q"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="qytet, zonë, fjalë kyçe…"
          className="field"
        />
      </div>

      <div>
        <label className="label" htmlFor="deal">
          Transaksion
        </label>
        <select id="deal" name="deal" defaultValue={filters.deal ?? ""} className="field">
          <option value="">Të gjitha</option>
          {DEALS.map((deal) => (
            <option key={deal} value={deal}>
              {DEAL_LABELS[deal]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="kind">
          Tipi
        </label>
        <select id="kind" name="kind" defaultValue={filters.kind ?? ""} className="field">
          <option value="">Të gjitha</option>
          {KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {KIND_LABELS[kind]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="city">
          Qyteti
        </label>
        <select id="city" name="city" defaultValue={filters.city ?? ""} className="field">
          <option value="">Të gjithë</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {!isHero && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="minPrice">
                Çmim min (€)
              </label>
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                min={0}
                defaultValue={filters.minPrice ?? ""}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="maxPrice">
                Çmim max (€)
              </label>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                min={0}
                defaultValue={filters.maxPrice ?? ""}
                className="field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="minRooms">
                Dhoma min
              </label>
              <input
                id="minRooms"
                name="minRooms"
                type="number"
                min={0}
                defaultValue={filters.minRooms ?? ""}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="minArea">
                m² min
              </label>
              <input
                id="minArea"
                name="minArea"
                type="number"
                min={0}
                defaultValue={filters.minArea ?? ""}
                className="field"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="sort">
              Rendit sipas
            </label>
            <select id="sort" name="sort" defaultValue={filters.sort ?? "newest"} className="field">
              <option value="newest">Më të rejat</option>
              <option value="price-asc">Çmimi: në rritje</option>
              <option value="price-desc">Çmimi: në zbritje</option>
            </select>
          </div>
        </>
      )}

      <button type="submit" className="btn-primary w-full">
        Kërko prona
      </button>
    </form>
  );
}
