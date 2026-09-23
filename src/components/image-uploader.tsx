"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { prepareImageForUpload } from "@/lib/image-file";

async function uploadOne(file: File): Promise<string> {
  const body = new FormData();
  body.append("files", await prepareImageForUpload(file));

  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const text = await response.text();

  let payload: { urls?: string[]; error?: string } = {};
  try {
    payload = JSON.parse(text) as { urls?: string[]; error?: string };
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(
      payload.error ??
        (response.status === 401
          ? "Sesioni i adminit skadoi — hyr përsëri."
          : response.status === 413
            ? `Foto "${file.name}" është shumë e madhe.`
            : `Ngarkimi dështoi (${response.status}).`),
    );
  }

  const url = payload.urls?.[0];
  if (!url) throw new Error(`Ngarkimi i fotos "${file.name}" dështoi.`);
  return url;
}

export function ImageUploader({ initial = [] }: { initial?: string[] }) {
  const [images, setImages] = useState<string[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const selected = Array.from(files);
    setError("");
    setUploading(true);

    const failed: string[] = [];
    for (const [index, file] of selected.entries()) {
      setProgress(`${index + 1}/${selected.length}`);
      try {
        const url = await uploadOne(file);
        setImages((current) => [...current, url]);
      } catch (uploadError) {
        failed.push(
          uploadError instanceof Error
            ? uploadError.message
            : `Foto "${file.name}" nuk u ngarkua.`,
        );
      }
    }

    setProgress("");
    setUploading(false);
    setError(failed.join(" "));
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(url: string) {
    setImages((current) => current.filter((item) => item !== url));
  }

  function move(index: number, delta: number) {
    setImages((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div>
      <span className="label">Fotot</span>
      <input type="hidden" name="images" value={images.join("\n")} />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
          className="text-sm"
        />
        {uploading && (
          <span className="text-sm text-slate-500">Po ngarkohet… {progress}</span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Zgjidh një ose disa foto nga pajisja (deri 8 MB secila). Foto e parë është kryesorja.
      </p>

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <li key={url} className="overflow-hidden rounded-lg border border-slate-200">
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image src={url} alt={`Foto ${index + 1}`} fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 px-2 py-1 text-xs">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    className="rounded px-1 hover:bg-slate-100"
                    aria-label="Zhvendos majtas"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    className="rounded px-1 hover:bg-slate-100"
                    aria-label="Zhvendos djathtas"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(url)}
                  className="font-medium text-rose-600 hover:underline"
                >
                  Hiq
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
