import { UniqueDeviceIdKey } from "../constants/Key"

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(UniqueDeviceIdKey)

  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem(UniqueDeviceIdKey, deviceId)
  }

  return deviceId
}
