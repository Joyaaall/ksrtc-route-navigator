
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LocationAlertProps {
  error: string | null;
}

const LocationAlert = ({ error }: LocationAlertProps) => {
  if (!error) return null;

  return (
    <Alert className="bg-red-50 border border-red-200">
      <AlertCircle className="h-4 w-4 text-red-500" />
      <AlertDescription className="text-red-700">
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default LocationAlert;
