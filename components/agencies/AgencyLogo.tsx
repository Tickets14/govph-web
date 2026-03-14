import Link from "next/link";
import type { Agency } from "@/types";
import { cn } from "@/lib/utils";

interface AgencyLogoProps {
  agency: Agency;
  size?: "sm" | "md" | "lg";
}

export function AgencyLogo({ agency, size = "md" }: AgencyLogoProps) {
  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white transition-all group",
        size === "sm" && "p-2",
        size === "lg" && "p-4"
      )}
    >
      <div
        className={cn(
          "rounded-xl bg-navy/5 group-hover:bg-navy/10 flex items-center justify-center transition-colors",
          size === "sm" && "w-10 h-10",
          size === "md" && "w-14 h-14",
          size === "lg" && "w-16 h-16"
        )}
      >
        <span
          className={cn(
            "font-display font-extrabold text-navy text-center leading-none",
            size === "sm" && "text-[10px]",
            size === "md" && "text-xs",
            size === "lg" && "text-sm"
          )}
        >
          {agency.acronym}
        </span>
      </div>
      {size !== "sm" && (
        <span className="text-xs text-gray-500 text-center leading-tight max-w-[80px] line-clamp-2">
          {agency.acronym}
        </span>
      )}
    </Link>
  );
}
