
import React, { useEffect } from 'react';
import L from 'leaflet';
import { BusStop } from '@/utils/mapUtils';

interface StopMarkersProps {
  map: L.Map;
  stops: BusStop[];
  onStopHover: (stop: BusStop | null) => void;
}

const StopMarkers = ({ map, stops, onStopHover }: StopMarkersProps) => {
  useEffect(() => {
    const markers = stops.map(stop => {
      if (stop.coordinates && stop.coordinates.length === 2) {
        const marker = L.marker(stop.coordinates, {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        });

        marker
          .addTo(map)
          .bindPopup(stop.name || 'Bus Stop')
          .on('mouseover', () => onStopHover(stop))
          .on('mouseout', () => onStopHover(null));

        return marker;
      }
    });

    return () => {
      markers.forEach(marker => marker?.remove());
    };
  }, [map, stops, onStopHover]);

  return null;
};

export default StopMarkers;
