import React from "react";
import { Card } from "./ui/card";

interface BusTiming {
  id: number;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  type: string;
}

interface BusTimingsProps {
  buses: BusTiming[];
}

const BusTimings: React.FC<BusTimingsProps> = ({ buses }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {buses.map((bus) => (
        <Card key={bus.id} className="p-4 space-y-1 shadow">
          <h3 className="text-lg font-semibold text-blue-700">
            {bus.from} → {bus.to}
          </h3>
          <p className="text-sm text-gray-700">
            Departure: <span className="font-medium">{bus.departure}</span>
          </p>
          <p className="text-sm text-gray-700">
            Arrival: <span className="font-medium">{bus.arrival}</span>
          </p>
          <p className="text-sm text-gray-600 italic">{bus.type}</p>
        </Card>
      ))}
    </div>
  );
};

export default BusTimings;

