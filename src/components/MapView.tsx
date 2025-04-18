import React, { useEffect, useState, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MapPin, Navigation } from "lucide-react";
import { useUserLocation } from "@/hooks/useUserLocation";
import { fetchNearbyBusStops, BusStop } from "@/utils/mapUtils";
import BusStopList from "./BusStopList";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateRoute, getBusStops, getDefaultLocation, validateMapContainer } from "@/utils/mapUtils";
import { defaultUserLocation } from "@/data/busData";
import { BusType } from "@/components/BusList";

interface MapViewProps {
  selectedBus: BusType | null;
}

const MapView: React.FC<MapViewProps> = ({ selectedBus }) => {
  const { coordinates: userLocation, error: locationError, isLoading } = useUserLocation();
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [tooManyStops, setTooManyStops] = useState(false);
  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (isLoading || !userLocation) return;

    fetchNearbyBusStops(userLocation)
      .then(stops => {
        setBusStops(stops);
        setTooManyStops(stops.length >= 30);
      })
      .catch(error => {
        console.error("Error fetching bus stops:", error);
        setMapError("Failed to load bus stops. Please try again.");
      });
  }, [userLocation, isLoading]);

  useEffect(() => {
    if (typeof window === 'undefined' || !selectedBus || !mapContainerRef.current || mapReady) return;

    const containerId = 'map-container';
    if (!validateMapContainer(containerId)) {
      setMapError("Map container not found. Please refresh the page.");
      return;
    }

    try {
      console.log("Initializing map with bus depot at:", selectedBus.depot_location);
      
      // Clean up any previous map instance
      const container = mapContainerRef.current;
      container.innerHTML = '';
      
      import('leaflet').then(L => {
        // Create the map instance
        const map = L.map(container).setView(selectedBus.depot_location, 13);
        
        // Add tile layer with error handling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).on('tileerror', function(error) {
          console.error('Tile loading error:', error);
          setMapError("Failed to load map tiles. Check your internet connection.");
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
          if (stop.coordinates && stop.coordinates.length === 2) {
            L.marker(stop.coordinates, {
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            }).addTo(map).bindPopup(stop.name || 'Bus Stop');
          }
        });
        
        // Add pulsating circle for user location
        L.circle(userLocation, {
          radius: 100,
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.2,
          className: 'pulsating-circle'
        }).addTo(map);
        
        // Add CSS animation for pulsating effect
        const style = document.createElement('style');
        style.innerHTML = `
          .pulsating-circle {
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.2; }
            100% { opacity: 0.6; }
          }
        `;
        document.head.appendChild(style);
        
        // Make the map responsive
        const resizeMap = () => {
          map.invalidateSize();
        };
        window.addEventListener('resize', resizeMap);
        
        setMapReady(true);
        
        // Cleanup function
        return () => {
          window.removeEventListener('resize', resizeMap);
          document.head.removeChild(style);
          map.remove();
          setMapReady(false);
        };
      }).catch(error => {
        console.error("Failed to load Leaflet:", error);
        setMapError("Failed to load map library. Please refresh the page.");
      });
    } catch (error) {
      console.error("Map initialization error:", error);
      setMapError("Error initializing map. Please refresh the page.");
    }
  }, [selectedBus, busStops, userLocation, mapReady]);

  if (isLoading) {
    return (
      <Card className="w-full p-4">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {(locationError || mapError) && (
        <Alert className="bg-red-50 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            {locationError || mapError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-[1fr,2fr] gap-4">
        <BusStopList
          stops={busStops}
          userLocation={userLocation}
          onStopHover={setHoveredStop}
          className="lg:block hidden"
        />

        <div className="space-y-4">
          {tooManyStops && (
            <Alert className="bg-amber-50 border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700">
                Zoom in to see more stops. Showing maximum of 30 stops in this area.
              </AlertDescription>
            </Alert>
          )}

          <div className="h-[60vh] rounded-xl overflow-hidden border relative">
            <div id="map-container" ref={mapContainerRef} className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
