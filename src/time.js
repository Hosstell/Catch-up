import settings from "./settings.js"

export function getCurrentTime() {
  return Math.trunc(new Date().getTime() / settings.tickTime)
}