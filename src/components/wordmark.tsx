import { site } from "@/lib/site";

type WordmarkProps = {
  size?: "sm" | "lg";
  block?: boolean;
};

export function Wordmark({ size = "sm", block = true }: WordmarkProps) {
  const isLarge = size === "lg";

  return (
    <span
      className={`inline-block text-center ${
        block ? "bg-brand text-white" : "text-white"
      } ${block ? (isLarge ? "px-10 py-6" : "px-6 py-3 sm:px-8 sm:py-4") : ""}`}
    >
      <span
        className={`block whitespace-nowrap font-serif uppercase leading-none tracking-[0.22em] ${
          isLarge ? "text-3xl sm:text-5xl" : "text-xl sm:text-3xl"
        }`}
      >
        {site.name}
      </span>
      <span
        className={`mt-3 flex items-center justify-center gap-3 font-medium uppercase tracking-[0.42em] ${
          isLarge ? "text-xs" : "text-[10px] sm:text-[11px]"
        }`}
      >
        <span className="h-px w-6 bg-white/55 sm:w-9" aria-hidden />
        Real Estate
        <span className="h-px w-6 bg-white/55 sm:w-9" aria-hidden />
      </span>
    </span>
  );
}
