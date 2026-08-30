"use client";

import Link from "next/link";
import { useActionState } from "react";

import { savePropertyAction } from "@/app/admin/actions";
import { initialFormState } from "@/app/admin/form-state";
import {
  DEALS,
  DEAL_LABELS,
  KINDS,
  KIND_LABELS,
  type Property,
} from "@/lib/types";

export function PropertyForm({ property }: { property?: Property }) {
  const [state, action, pending] = useActionState(
    savePropertyAction,
    initialFormState,
  );

  return (
    <form action={action} className="card space-y-5 p-6">
      {property && <input type="hidden" name="id" value={property.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="title">
            Titulli *
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={property?.title}
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="deal">
            Transaksion *
          </label>
          <select id="deal" name="deal" defaultValue={property?.deal ?? "shitje"} className="field">
            {DEALS.map((deal) => (
              <option key={deal} value={deal}>
                {DEAL_LABELS[deal]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="kind">
            Tipi *
          </label>
          <select id="kind" name="kind" defaultValue={property?.kind ?? "apartament"} className="field">
            {KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {KIND_LABELS[kind]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="price">
            Çmimi (€) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step="any"
            required
            defaultValue={property?.price}
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="city">
            Qyteti *
          </label>
          <input id="city" name="city" required defaultValue={property?.city} className="field" />
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="address">
            Adresa
          </label>
          <input id="address" name="address" defaultValue={property?.address} className="field" />
        </div>

        <div>
          <label className="label" htmlFor="area">
            Sipërfaqe (m²)
          </label>
          <input
            id="area"
            name="area"
            type="number"
            min={0}
            step="any"
            defaultValue={property?.area}
            className="field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="rooms">
              Dhoma
            </label>
            <input
              id="rooms"
              name="rooms"
              type="number"
              min={0}
              defaultValue={property?.rooms}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="baths">
              Banjo
            </label>
            <input
              id="baths"
              name="baths"
              type="number"
              min={0}
              defaultValue={property?.baths}
              className="field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="floor">
              Kati
            </label>
            <input
              id="floor"
              name="floor"
              type="number"
              defaultValue={property?.floor ?? ""}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="year">
              Viti
            </label>
            <input
              id="year"
              name="year"
              type="number"
              defaultValue={property?.year ?? ""}
              className="field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="lat">
              Gjerësia (lat)
            </label>
            <input
              id="lat"
              name="lat"
              type="number"
              step="any"
              defaultValue={property?.lat ?? ""}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="lng">
              Gjatësia (lng)
            </label>
            <input
              id="lng"
              name="lng"
              type="number"
              step="any"
              defaultValue={property?.lng ?? ""}
              className="field"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">
            Përshkrimi
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={property?.description}
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="features">
            Karakteristika (një për rresht)
          </label>
          <textarea
            id="features"
            name="features"
            rows={5}
            defaultValue={property?.features.join("\n")}
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="images">
            Fotot — URL ose shteg (një për rresht)
          </label>
          <textarea
            id="images"
            name="images"
            rows={5}
            placeholder="/images/prona-1.svg"
            defaultValue={property?.images.join("\n")}
            className="field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="slug">
            Slug (opsional)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={property?.slug}
            placeholder="gjenerohet automatikisht nga titulli"
            className="field"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={property?.featured}
          className="h-4 w-4 rounded border-slate-300"
        />
        Shfaq në &quot;Prona të zgjedhura&quot;
      </label>

      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-rose-600">
          {state.message}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Po ruhet…" : "Ruaj pronën"}
        </button>
        <Link href="/admin" className="btn-outline">
          Anulo
        </Link>
      </div>
    </form>
  );
}
