
import React from 'react';
import { BusStop } from '@/utils/mapUtils';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';

interface BusStopListProps {
  stops: BusStop[];
  userLocation: [number, number];
  onStopHover: (stop: BusStop | null) => void;
  className?: string;
}

const BusStopList = ({ stops, userLocation, onStopHover, className }: BusStopListProps) => {
  if (!stops.length) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <p className="text-muted-foreground text-center">No bus stops found nearby</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <ScrollArea className="h-[60vh]">
          {stops.map(stop => (
            <div
              key={stop.id}
              className="p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer"
              onMouseEnter={() => onStopHover(stop)}
              onMouseLeave={() => onStopHover(null)}
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium leading-none mb-1">{stop.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(stop.routes?.length || 0) > 0 
                      ? `Routes: ${stop.routes?.join(', ')}`
                      : 'No route information available'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BusStopList;
