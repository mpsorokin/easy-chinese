// Short vibration where supported; silently ignored elsewhere (iOS, desktop, blocked).
export function vibrate(ms: number) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}
