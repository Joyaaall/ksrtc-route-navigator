
import React, { useEffect, useState } from "react";
import { calculateRoute, getBusStops } from "@/utils/mapUtils";
import { defaultUserLocation } from "@/data/busData";
import { BusType } from "@/components/BusList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MapViewProps {
  selectedBus: BusType | null;
}

// This is a simplified component since there are issues with the react-leaflet types
// In a real implementation, we would need to properly fix the typings
const MapView: React.FC<MapViewProps> = ({ selectedBus }) => {
  const [userLocation, setUserLocation] = useState<[number, number]>(defaultUserLocation);
  const [busStops, setBusStops] = useState<any[]>([]);
  const [tooManyStops, setTooManyStops] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Get user location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting location:", error);
        // Use default location
      }
    );
  }, []);

  // When a bus is selected, calculate routes and get bus stops
  useEffect(() => {
    if (!selectedBus) {
      setBusStops([]);
      return;
    }

    setLoading(true);

    // Get bus stops near the depot
    getBusStops(selectedBus.depot_location[0], selectedBus.depot_location[1])
      .then((stops) => {
        setBusStops(stops);
        setTooManyStops(stops.length >= 30);
        setLoading(false);
      })
      .catch(() => {
        setBusStops([]);
        setLoading(false);
      });
  }, [selectedBus]);

  // Initialize leaflet map on the client side
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedBus && !mapInitialized) {
      // We'll create the map manually using the leaflet library directly
      // This avoids the typing issues with react-leaflet
      import('leaflet').then(L => {
        // Remove any existing map
        const container = document.getElementById('map-container');
        if (container) {
          container.innerHTML = '';
          
          const map = L.map(container).setView(selectedBus.depot_location, 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add user marker
          L.marker(userLocation, {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(map).bindPopup('Your Location');
          
          // Add depot marker
          L.marker(selectedBus.depot_location, {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(map).bindPopup(`${selectedBus.name} Depot`);
          
          // Add route polyline
          const route = calculateRoute(userLocation, selectedBus.depot_location);
          L.polyline(route, {
            color: 'blue',
            weight: 3,
            dashArray: '5, 10'
          }).addTo(map);
          
          // Add bus stop markers
          busStops.forEach(stop => {
            if (stop.lat && stop.lon) {
              L.marker([stop.lat, stop.lon], {
                icon: L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })
              }).addTo(map).bindPopup(stop.tags?.name || 'Bus Stop');
            }
          });
          
          // Add pulsating circle for user location
          L.circle(userLocation, {
            radius: 100,
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.2
          }).addTo(map);
          
          setMapInitialized(true);
        }
      });
    }
  }, [selectedBus, busStops, userLocation, mapInitialized]);

  if (!selectedBus) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
        Select a bus to view the route
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-ksrtc-dark-purple">
        Route Map
      </h2>
      
      {tooManyStops && (
        <Alert className="mb-4 bg-amber-50 border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            Zoom in to see more stops. Showing maximum of 30 stops in this area.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="h-64 sm:h-96 rounded-xl overflow-hidden border relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin h-8 w-8 border-4 border-ksrtc-purple border-t-transparent rounded-full"></div>
          </div>
        )}
        
        <div id="map-container" className="h-full w-full"></div>
      </div>
      
      <div className="mt-3 text-sm text-ksrtc-gray">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Bus Depot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Bus Stops</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
