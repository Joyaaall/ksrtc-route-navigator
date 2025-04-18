
import React, { useState } from "react";
import { locations } from "@/data/busData";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (from: string, to: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const handleSearch = () => {
    if (from && to) {
      onSearch(from, to);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-center text-ksrtc-dark-purple">Find Your Bus</h2>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger className="w-full" id="from">
              <SelectValue placeholder="Select departure" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger className="w-full" id="to">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={handleSearch} 
        disabled={!from || !to || from === to || isLoading}
        className="w-full bg-ksrtc-purple hover:bg-ksrtc-secondary-purple text-white py-2 rounded-full h-12 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            <Search size={20} />
            Search Buses
          </>
        )}
      </Button>
    </div>
  );
};

export default SearchBar;
