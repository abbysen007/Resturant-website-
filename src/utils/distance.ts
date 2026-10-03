/**
 * Calculates Great-Circle distance between two points on Earth using Haversine formula
 * Returns distance in kilometers (rounded to 1 decimal place)
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates delivery fee based on distance:
 * - Within 5 km: Base fee ₹40
 * - Beyond 5 km: ₹40 + ₹6 per km
 * - If order subtotal >= ₹799: Delivery is Free!
 */
export function calculateDeliveryFee(distanceKm: number, subtotal: number): number {
  if (subtotal >= 799) {
    return 0;
  }
  if (distanceKm <= 5) {
    return 40;
  }
  const extraKm = distanceKm - 5;
  return Math.round(40 + extraKm * 6);
}

/**
 * Estimated delivery time in minutes based on distance
 * Base prep time (25m) + travel time (approx 2 mins per km in city traffic)
 */
export function estimateDeliveryMinutes(distanceKm: number): number {
  const travelTime = Math.ceil(distanceKm * 1.8);
  const minEstimate = Math.max(30, 25 + travelTime);
  return minEstimate;
}
