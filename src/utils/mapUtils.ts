
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
