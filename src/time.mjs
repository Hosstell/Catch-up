import settings from "./settings.mjs"

export function getCurrentTime() {
  return Math.trunc(new Date().getTime() / settings.tickTime)
}