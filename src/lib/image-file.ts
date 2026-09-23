const MAX_DIMENSION = 2400;
const QUALITY = 0.85;

function loadBitmap(file: File) {
  return new Promise<{ width: number; height: number; draw: CanvasImageSource }>(
    (resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new window.Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: image.naturalWidth, height: image.naturalHeight, draw: image });
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("decode"));
      };
      image.src = url;
    },
  );
}

export async function prepareImageForUpload(file: File): Promise<File> {
  try {
    const { width, height, draw } = await loadBitmap(file);
    if (!width || !height) return file;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(draw, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );
    if (!blob) return file;

    const name = `${file.name.replace(/\.[^.]+$/, "")}.jpg`;
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}
