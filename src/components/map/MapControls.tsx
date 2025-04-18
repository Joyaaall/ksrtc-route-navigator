
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MapControlsProps {
  tooManyStops: boolean;
}

const MapControls = ({ tooManyStops }: MapControlsProps) => {
  if (!tooManyStops) return null;

  return (
    <Alert className="bg-amber-50 border border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-amber-700">
        Zoom in to see more stops. Showing maximum of 30 stops in this area.
      </AlertDescription>
    </Alert>
  );
};

export default MapControls;
