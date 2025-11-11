// Haversine formula to calculate distance between two points
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

module.exports = {
  // Check if a point is within radius of center (in kilometers)
  isWithinRadius: (point, center, radiusKm) => {
    if (!point || !center || !point.lat || !point.lon || !center.lat || !center.lon) {
      return false;
    }
    const distance = getDistance(point.lat, point.lon, center.lat, center.lon);
    return distance <= radiusKm;
  },

  // Calculate distance between two points
  getDistance: (point1, point2) => {
    if (!point1 || !point2 || !point1.lat || !point1.lon || !point2.lat || !point2.lon) {
      return null;
    }
    return getDistance(point1.lat, point1.lon, point2.lat, point2.lon);
  }
};
