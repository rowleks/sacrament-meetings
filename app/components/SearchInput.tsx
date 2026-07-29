"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SearchIcon } from "./icons";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const initial = searchParams.get("query") ?? "";

  const push = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }
      params.delete("page");
      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition],
  );

  const debounced = useDebouncedCallback(push, 300);

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="text"
        defaultValue={initial}
        placeholder="Search meetings..."
        className="w-full rounded-md border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
        onChange={(e) => debounced(e.target.value)}
      />
    </div>
  );
}
