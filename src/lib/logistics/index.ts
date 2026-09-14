export type Point = { name: string; lat: number; lng: number };
export const haversineKm = (a: Point, b: Point) => {
  const r = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180,
    dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
};
/** Transparent demo formula: ₹40 dispatch base + distance × ₹0.6/km × 1–1.3 weight tier, clamped to ₹50–₹200. */
export const estimateLogistics = (distanceKm: number, weightKg: number) => {
  const tier = weightKg > 500 ? 1.3 : weightKg > 100 ? 1.15 : 1;
  return Math.min(200, Math.max(50, Math.round(40 + distanceKm * 0.6 * tier)));
};
export const nearestNeighborRoute = (start: Point, stops: Point[]) => {
  const remaining = [...stops],
    route: Point[] = [];
  let current = start,
    total = 0;
  while (remaining.length) {
    let best = 0,
      dist = Infinity;
    remaining.forEach((p, i) => {
      const d = haversineKm(current, p);
      if (d < dist) {
        best = i;
        dist = d;
      }
    });
    const next = remaining.splice(best, 1)[0];
    total += dist;
    route.push(next);
    current = next;
  }
  return {
    route,
    distanceKm: Math.round(total),
    durationMins: Math.round(total * 2.2),
  };
};
