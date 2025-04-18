
import { useState, useEffect } from 'react';
import { defaultUserLocation } from '@/data/busData';

export interface LocationState {
  coordinates: [number, number];
  error: string | null;
  isLoading: boolean;
}

export function useUserLocation() {
  const [state, setState] = useState<LocationState>({
    coordinates: defaultUserLocation,
    error: null,
    isLoading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        isLoading: false
      }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          coordinates: [position.coords.latitude, position.coords.longitude],
          error: null,
          isLoading: false
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setState({
          coordinates: defaultUserLocation,
          error: "Could not access your location. Using default location.",
          isLoading: false
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
