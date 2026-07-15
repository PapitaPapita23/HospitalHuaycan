import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "./apiClient";

export type ServerStatus = "checking" | "online" | "offline";

export function useServerStatus() {
  const [status, setStatus] = useState<ServerStatus>("checking");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const check = useCallback(async () => {
    setStatus("checking");
    setLatencyMs(null);
    try {
      const start = performance.now();
      const res = await fetch(`${BASE_URL}/auth/ping`);
      if (!res.ok) throw new Error("ping failed");
      setLatencyMs(Math.round(performance.now() - start));
      setStatus("online");
    } catch {
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { status, latencyMs, check };
}
