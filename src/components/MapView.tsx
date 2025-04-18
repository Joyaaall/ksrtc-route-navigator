
import React, { useEffect, useState, useRef } from "react";
import { calculateRoute, getBusStops, getDefaultLocation, validateMapContainer } from "@/utils/mapUtils";
import { defaultUserLocation } from "@/data/busData";
import { BusType } from "@/components/BusList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MapPin, Navigation } from "lucide-react";

interface MapViewProps {
  selectedBus: BusType | null;
}

const MapView: React.FC<MapViewProps> = ({ selectedBus }) => {
  const [userLocation, setUserLocation] = useState<[number, number]>(defaultUserLocation);
  const [busStops, setBusStops] = useState<any[]>([]);
  const [tooManyStops, setTooManyStops] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location obtained successfully");
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          setMapError("Could not access your location. Using default location.");
          // Use default location
          setUserLocation(getDefaultLocation());
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      setMapError("Your browser doesn't support geolocation. Using default location.");
      setUserLocation(getDefaultLocation());
    }
  }, []);

  // When a bus is selected, calculate routes and get bus stops
  useEffect(() => {
    if (!selectedBus) {
      setBusStops([]);
      return;
    }

    setLoading(true);
    setMapError(null);

    // Get bus stops near the depot
    getBusStops(selectedBus.depot_location[0], selectedBus.depot_location[1])
      .then((stops) => {
        setBusStops(stops);
        setTooManyStops(stops.length >= 30);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting bus stops:", error);
        setMapError("Failed to load bus stops. Please try again.");
        setBusStops([]);
        setLoading(false);
      });
  }, [selectedBus]);

  // Initialize leaflet map on the client side
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

  if (!selectedBus) {
    return (
      <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <MapPin size={32} className="text-gray-400" />
          <p>Select a bus to view the route</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-ksrtc-dark-purple flex items-center gap-2">
        <Navigation className="h-5 w-5 text-ksrtc-purple" />
        Route Map
      </h2>
      
      {mapError && (
        <Alert className="mb-4 bg-red-50 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            {mapError}
          </AlertDescription>
        </Alert>
      )}
      
      {tooManyStops && (
        <Alert className="mb-4 bg-amber-50 border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            Zoom in to see more stops. Showing maximum of 30 stops in this area.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin h-8 w-8 border-4 border-ksrtc-purple border-t-transparent rounded-full"></div>
          </div>
        )}
        
        <div id="map-container" ref={mapContainerRef} className="h-full w-full"></div>
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
