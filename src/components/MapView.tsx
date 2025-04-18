
import React, { useState, useCallback } from "react";
import { useUserLocation } from "@/hooks/useUserLocation";
import { fetchNearbyBusStops, BusStop } from "@/utils/mapUtils";
import { BusType } from "@/components/BusList";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LocationAlert from "./map/LocationAlert";
import MapContainer from "./map/MapContainer";
import StopMarkers from "./map/StopMarkers";
import MapControls from "./map/MapControls";
import type { Map as LeafletMap } from 'leaflet';

interface MapViewProps {
  selectedBus: BusType | null;
}

const MapView: React.FC<MapViewProps> = ({ selectedBus }) => {
  const { coordinates: userLocation, error: locationError, isLoading } = useUserLocation();
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [tooManyStops, setTooManyStops] = useState(false);
  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);

  const handleMapReady = useCallback((newMap: LeafletMap) => {
    setMap(newMap);
  }, []);

  React.useEffect(() => {
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

  if (isLoading) {
    return (
      <Card className="w-full p-4">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </Card>
    );
  }

  if (!userLocation) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <LocationAlert error={locationError || mapError} />
      
      <div className="grid lg:grid-cols-[1fr,2fr] gap-4">
        <BusStopList
          stops={busStops}
          userLocation={userLocation}
          onStopHover={setHoveredStop}
          className="lg:block hidden"
        />

        <div className="space-y-4">
          <MapControls tooManyStops={tooManyStops} />
          
          <MapContainer
            selectedBus={selectedBus}
            userLocation={userLocation}
            busStops={busStops}
            onMapReady={handleMapReady}
            onStopHover={setHoveredStop}
          />
          
          {map && (
            <StopMarkers
              map={map}
              stops={busStops}
              onStopHover={setHoveredStop}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
