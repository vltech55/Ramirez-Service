import { ClientRecord } from '../types';

export function getStatusColor(status: ClientRecord['status']): string {
  switch (status) {
    case 'Active':
      return '#1db954';
    case 'Paused':
      return '#ff9f1a';
    case 'Cancelled':
      return '#ff4d4f';
    default:
      return '#8884d8';
  }
}

export function haversineDistanceMeters(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral): number {
  const R = 6371e3; // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function computeNearbyClients(
  selected: ClientRecord,
  all: ClientRecord[],
  limit = 5
): Array<{ client: ClientRecord; distanceMeters: number }> {
  if (!selected.location) return [];
  const others = all.filter((c) => c.id !== selected.id && c.location);
  const distances = others.map((client) => ({
    client,
    distanceMeters: haversineDistanceMeters(selected.location!, client.location!),
  }));
  distances.sort((a, b) => a.distanceMeters - b.distanceMeters);
  return distances.slice(0, limit);
}


