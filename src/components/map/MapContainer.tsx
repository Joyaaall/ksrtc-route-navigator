
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusType } from '@/components/BusList';
import { BusStop } from '@/utils/mapUtils';
import { calculateRoute } from '@/utils/mapUtils';

interface MapContainerProps {
  selectedBus: BusType | null;
  userLocation: [number, number];
  busStops: BusStop[];
  onMapReady: (map: L.Map) => void;
  onStopHover: (stop: BusStop | null) => void;
}

const MapContainer = ({ selectedBus, userLocation, busStops, onMapReady, onStopHover }: MapContainerProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerId = 'map-container';

  useEffect(() => {
    if (!userLocation || mapRef.current) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    // Initialize map
    const map = L.map(container).setView(userLocation, 13);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // User location marker
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

    // Notify parent component that map is ready
    onMapReady(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [userLocation, onMapReady]);

  useEffect(() => {
    if (!mapRef.current || !selectedBus) return;

    // Add depot marker
    const depotMarker = L.marker(selectedBus.depot_location, {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(mapRef.current).bindPopup(`${selectedBus.name} Depot`);

    // Add route polyline
    const route = calculateRoute(userLocation, selectedBus.depot_location);
    const routeLine = L.polyline(route, {
      color: 'blue',
      weight: 3,
      dashArray: '5, 10'
    }).addTo(mapRef.current);

    return () => {
      depotMarker.remove();
      routeLine.remove();
    };
  }, [selectedBus, userLocation]);

  return <div id={containerId} className="h-[60vh] w-full rounded-xl overflow-hidden border" />;
};

export default MapContainer;
