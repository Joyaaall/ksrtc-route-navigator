
import React from "react";
import { busData } from "@/data/busData";
import { Button } from "@/components/ui/button";
import { Bus, Clock } from "lucide-react";

export interface BusType {
  id: number;
  name: string;
  from: string;
  to: string;
  departure: string;
  depot_location: [number, number];
}

interface BusListProps {
  from: string;
  to: string;
  onSelectBus: (bus: BusType) => void;
  selectedBusId: number | null;
}

const BusList: React.FC<BusListProps> = ({ from, to, onSelectBus, selectedBusId }) => {
  // Filter buses based on from and to
  const filteredBuses = busData.filter(
    (bus) => bus.from === from && bus.to === to
  );

  if (filteredBuses.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-md text-center">
        <p className="text-ksrtc-gray">No buses found for this route</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center text-ksrtc-dark-purple">
        Available Buses
      </h2>
      <div className="space-y-3">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            className={`p-3 rounded-lg border transition-all ${
              selectedBusId === bus.id
                ? "border-ksrtc-purple bg-ksrtc-soft-gray"
                : "border-gray-200 hover:border-ksrtc-purple hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Bus size={18} className="text-ksrtc-purple" />
                <h3 className="font-medium">{bus.name}</h3>
              </div>
              <div className="flex items-center gap-1 text-sm text-ksrtc-gray">
                <Clock size={14} />
                <span>{bus.departure}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-ksrtc-gray">
                {bus.from} to {bus.to}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectBus(bus as BusType)}
                className={`text-sm ${
                  selectedBusId === bus.id
                    ? "bg-ksrtc-purple text-white hover:bg-ksrtc-secondary-purple"
                    : "text-ksrtc-purple border-ksrtc-purple hover:bg-ksrtc-soft-gray"
                }`}
              >
                {selectedBusId === bus.id ? "Selected" : "View Route"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusList;
