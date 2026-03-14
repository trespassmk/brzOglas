import { useState } from "react";
import { MapPin, Navigation, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type { ListingFormData } from "@/pages/CreateListing";

const CITIES = [
  "Skopje", "Kumanovo", "Bitola", "Ohrid", "Prilep",
  "Tetovo", "Veles", "Štip", "Strumica", "Gostivar",
  "Kavadarci", "Kočani", "Kičevo", "Struga", "Gevgelija",
];

interface Props {
  form: ListingFormData;
  updateForm: (u: Partial<ListingFormData>) => void;
}

const StepLocation = ({ form, updateForm }: Props) => {
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);

  const filtered = query
    ? CITIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : CITIES;

  const selectCity = (city: string) => {
    updateForm({ city });
    setQuery("");
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateForm({
          coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          city: "Current Location",
        });
        setLocating(false);
      },
      () => {
        toast({ title: "Location access denied", variant: "destructive" });
        setLocating(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      {form.city ? (
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
          <MapPin className="h-5 w-5 text-sell shrink-0" />
          <span className="font-medium flex-1">{form.city}</span>
          <button
            onClick={() => updateForm({ city: "", coordinates: null })}
            className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Search City</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Type a city name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={useCurrentLocation}
            disabled={locating}
            className="w-full gap-2 min-h-[44px]"
          >
            <Navigation className="h-4 w-4" />
            {locating ? "Detecting..." : "Use Current Location"}
          </Button>

          <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto">
            {filtered.map((city) => (
              <button
                key={city}
                onClick={() => selectCity(city)}
                className="flex items-center gap-2 p-3 rounded-lg border bg-card text-sm hover:border-sell transition-colors text-left min-h-[44px]"
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {city}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StepLocation;
