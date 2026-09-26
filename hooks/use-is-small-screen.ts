import { useSyncExternalStore } from "react";

// Matches Tailwind's `sm` breakpoint: true on phones (below 640px)
const SMALL_SCREEN_QUERY = "(max-width: 639px)";

function subscribeToSmallScreen(callback: () => void) {
  const mql = window.matchMedia(SMALL_SCREEN_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function useIsSmallScreen() {
  return useSyncExternalStore(
    subscribeToSmallScreen,
    () => window.matchMedia(SMALL_SCREEN_QUERY).matches,
    () => false,
  );
}
