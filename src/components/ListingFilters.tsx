import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ListingFilters as Filters } from "@/hooks/useListings";

const CATEGORIES = [
  { slug: "cars", label: "Cars" },
  { slug: "mobiles", label: "Mobiles" },
  { slug: "property", label: "Property" },
  { slug: "jobs", label: "Jobs" },
  { slug: "furniture", label: "Furniture" },
  { slug: "fashion", label: "Fashion" },
  { slug: "electronics", label: "Electronics" },
  { slug: "bikes", label: "Bikes" },
];

const CITIES = [
  "Skopje", "Kumanovo", "Bitola", "Ohrid", "Prilep", "Tetovo",
  "Veles", "Štip", "Strumica", "Gostivar", "Kavadarci", "Kočani",
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "excellent", label: "Excellent" },
];

const DATE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const FilterBody = ({ filters, onChange, onClose }: Props & { onClose?: () => void }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin ?? 0,
    filters.priceMax ?? 500000,
  ]);

  const clearAll = () => {
    onChange({ sort: filters.sort });
    onClose?.();
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Category</Label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => onChange({ ...filters, category: filters.category === c.slug ? undefined : c.slug })}
              className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors min-h-[44px] ${
                filters.category === c.slug ? "border-sell bg-sell/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Price Range (MKD)</Label>
        <Slider
          min={0}
          max={500000}
          step={1000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          onValueCommit={(v) => onChange({ ...filters, priceMin: v[0] || undefined, priceMax: v[1] < 500000 ? v[1] : undefined })}
          className="mt-2"
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString()} ден</span>
          <span className="flex-1 text-center">—</span>
          <span>{priceRange[1] >= 500000 ? "500,000+ ден" : `${priceRange[1].toLocaleString()} ден`}</span>
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">City</Label>
        <Select value={filters.city || ""} onValueChange={(v) => onChange({ ...filters, city: v || undefined })}>
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All cities</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Condition</Label>
        <RadioGroup
          value={filters.condition || ""}
          onValueChange={(v) => onChange({ ...filters, condition: v || undefined })}
          className="flex gap-2"
        >
          {CONDITIONS.map((c) => (
            <label
              key={c.value}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm min-h-[44px] transition-colors ${
                filters.condition === c.value ? "border-sell bg-sell/10" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <RadioGroupItem value={c.value} />
              {c.label}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Date posted */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Date Posted</Label>
        <div className="flex gap-2">
          {DATE_OPTIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => onChange({ ...filters, datePosted: filters.datePosted === d.value ? undefined : d.value as any })}
              className={`text-sm px-3 py-2 rounded-lg border min-h-[44px] transition-colors ${
                filters.datePosted === d.value ? "border-sell bg-sell/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={clearAll} className="w-full gap-2">
        <X className="h-4 w-4" /> Clear All Filters
      </Button>
    </div>
  );
};

const ListingFilters = ({ filters, onChange }: Props) => {
  const activeCount = [filters.category, filters.city, filters.condition, filters.datePosted, filters.priceMin, filters.priceMax].filter(Boolean).length;

  return (
    <>
      {/* Mobile: Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 min-h-[44px]">
              <Filter className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-sell text-sell-foreground text-[10px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterBody filters={filters} onChange={onChange} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sidebar */}
      <div className="hidden lg:block w-[280px] shrink-0">
        <div className="sticky top-20 space-y-4 p-4 rounded-lg border bg-card">
          <h3 className="font-display font-bold text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
            {activeCount > 0 && (
              <span className="h-5 w-5 rounded-full bg-sell text-sell-foreground text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </h3>
          <FilterBody filters={filters} onChange={onChange} />
        </div>
      </div>
    </>
  );
};

export default ListingFilters;
