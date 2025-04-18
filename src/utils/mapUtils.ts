
// Function to get bus stops around a location using Overpass API
export async function getBusStops(lat: number, lon: number): Promise<any[]> {
  try {
    const query = `[out:json]; node["highway"="bus_stop"](around:2000,${lat},${lon}); out 30;`;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bus stops");
    }

    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    console.error("Error fetching bus stops:", error);
    return [];
  }
}

// Calculate route between two points
// This is a simplified version - in a real app, you would use a routing service
export function calculateRoute(
  start: [number, number],
  end: [number, number]
): [number, number][] {
  // For demo purposes, we'll return a straight line with a few points
  const latDiff = end[0] - start[0];
  const lngDiff = end[1] - start[1];
  
  return [
    start,
    [start[0] + latDiff * 0.25, start[1] + lngDiff * 0.25],
    [start[0] + latDiff * 0.5, start[1] + lngDiff * 0.5],
    [start[0] + latDiff * 0.75, start[1] + lngDiff * 0.75],
    end
  ];
}
