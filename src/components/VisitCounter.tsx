"use client";

import { useEffect, useState } from "react";
import { isApiConfigured, recordVisit } from "@/lib/api";

const SESSION_KEY = "visit-counted";

/** Counts one visit per browser session and shows the total. Renders nothing if the API isn't set up. */
export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isApiConfigured()) return;

    let alreadyCounted = false;
    try {
      alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); just count the visit.
    }
    if (alreadyCounted) return;

    recordVisit()
      .then((n) => {
        setCount(n);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* the counter is decorative; fail quietly */
      });
  }, []);

  if (count === null) return null;
  return <span> · {count.toLocaleString()} visits</span>;
}
