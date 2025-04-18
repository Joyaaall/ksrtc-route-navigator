// Function to get bus stops around a location using Overpass API
export async function getBusStops(lat: number, lon: number): Promise<any[]> {
  try {
    const query = `[out:json]; node["highway"="bus_stop"](around:2000,${lat},${lon}); out 30;`;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    });

    if (!response.ok) {
      console.error("Overpass API returned an error:", response.status);
      throw new Error(`Failed to fetch bus stops: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Found ${data.elements?.length || 0} bus stops nearby`);
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
  
  // Create a more natural-looking route with slight variations
  return [
    start,
    [start[0] + latDiff * 0.2 + (Math.random() * 0.001), start[1] + lngDiff * 0.2 + (Math.random() * 0.001)],
    [start[0] + latDiff * 0.4 + (Math.random() * 0.001), start[1] + lngDiff * 0.4 + (Math.random() * 0.001)],
    [start[0] + latDiff * 0.6 + (Math.random() * 0.001), start[1] + lngDiff * 0.6 + (Math.random() * 0.001)],
    [start[0] + latDiff * 0.8 + (Math.random() * 0.001), start[1] + lngDiff * 0.8 + (Math.random() * 0.001)],
    end
  ];
}

// Fallback function to use when geolocation fails
export function getDefaultLocation(): [number, number] {
  console.log("Using default location: Kochi");
  return [9.9312, 76.2673]; // Kochi coordinates
}

// Check if map container exists
export function validateMapContainer(containerId: string): boolean {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Map container #${containerId} not found in the DOM`);
    return false;
  }
  return true;
}

export interface BusStop {
  id: string;
  name: string;
  coordinates: [number, number];
  routes?: string[];
}

export async function fetchNearbyBusStops(
  location: [number, number],
  radius: number = 2000
): Promise<BusStop[]> {
  try {
    const busStops = await getBusStops(location[0], location[1]);
    
    return busStops
      .filter(stop => stop.lat && stop.lon)
      .map(stop => ({
        id: stop.id.toString(),
        name: stop.tags?.name || 'Bus Stop',
        coordinates: [stop.lat, stop.lon] as [number, number],
        routes: []
      }))
      .slice(0, 30); // Ensure we never return more than 30 stops
      
  } catch (error) {
    console.error("Error fetching nearby bus stops:", error);
    return [];
  }
}

export function calculateDistance(
  point1: [number, number],
  point2: [number, number]
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1[0] * Math.PI) / 180;
  const φ2 = (point2[0] * Math.PI) / 180;
  const Δφ = ((point2[0] - point1[0]) * Math.PI) / 180;
  const Δλ = ((point2[1] - point1[1]) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
