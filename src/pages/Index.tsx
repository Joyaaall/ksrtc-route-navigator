import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import BusList from "@/components/BusList";
import MapView from "@/components/MapView";
import { BusType } from "@/components/BusList";
const Index = () => {
  const [searchParams, setSearchParams] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const handleSearch = (from: string, to: string) => {
    setIsSearching(true);
    setSelectedBus(null);

    // Simulate a search delay
    setTimeout(() => {
      setSearchParams({
        from,
        to
      });
      setIsSearching(false);
    }, 500);
  };
  const handleSelectBus = (bus: BusType) => {
    setSelectedBus(bus);
  };
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-ksrtc-dark-purple flex items-center gap-2">
            <span className="text-ksrtc-purple">ON</span>
            Route Navigator
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 space-y-6">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          
          {searchParams && !isSearching && <BusList from={searchParams.from} to={searchParams.to} onSelectBus={handleSelectBus} selectedBusId={selectedBus?.id || null} />}
        </div>
        
        <div className="w-full lg:w-2/3">
          <MapView selectedBus={selectedBus} />
        </div>
      </main>

      <footer className="bg-white border-t py-4 text-center text-sm text-ksrtc-gray">
        <div className="container mx-auto px-4">
          <p>© 2025 KSRTC Route Navigator | Powered by OpenStreetMap</p>
        </div>
      </footer>
    </div>;
};
export default Index;