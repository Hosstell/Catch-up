import settings from "../settings.js"

export function getCurrentTime() {
  return Math.trunc(new Date().getTime() / settings.tickTime) * settings.tickTime
}

export function getTime() {
  return new Date().getTime()
}