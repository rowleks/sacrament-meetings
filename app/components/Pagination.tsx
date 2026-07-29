"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const navigate = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage > 1) {
        params.set("page", String(newPage));
      } else {
        params.delete("page");
      }
      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition],
  );

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 text-sm" aria-label="Pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => navigate(page - 1)}
        className="rounded-md border border-border px-3 py-1.5 text-muted transition-colors hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-muted">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => navigate(p)}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              p === page
                ? "bg-primary/10 text-primary border border-primary/20 font-medium"
                : "border border-border text-muted hover:bg-secondary/20"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => navigate(page + 1)}
        className="rounded-md border border-border px-3 py-1.5 text-muted transition-colors hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
