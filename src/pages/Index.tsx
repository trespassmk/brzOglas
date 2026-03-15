import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import ListingCard from "@/components/ListingCard";

import ListingSkeleton from "@/components/ListingSkeleton";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListings, type ListingFilters as Filters } from "@/hooks/useListings";
import { timeAgo } from "@/lib/date-utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const Index = () => {
  const [filters, setFilters] = useState<Filters>({ sort: "newest" });
  const [searchInput, setSearchInput] = useState("");

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, search: searchInput || undefined })), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListings(filters);

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerCb = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(observerCb, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [observerCb]);

  const allListings = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryBar />

      <main className="flex-1">
        <div className="container py-6">
          {/* Search + Sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                className="pl-10 h-11"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Select value={filters.sort || "newest"} onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as any }))}>
              <SelectTrigger className="w-full sm:w-[200px] h-11">
                <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div>
              <h2 className="font-display text-xl font-bold mb-4">
                {filters.search ? `Results for "${filters.search}"` : "Fresh Recommendations"}
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {Array.from({ length: 8 }).map((_, i) => <ListingSkeleton key={i} />)}
                </div>
              ) : allListings.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No listings found. Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {allListings.map((listing) => {
                    const images = (listing.listing_images as any[])
                      ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
                      .map((img: any) => img.image_url) ?? [];
                    return (
                      <ListingCard
                        key={listing.id}
                        id={listing.id}
                        title={listing.title}
                        price={`${listing.price?.toLocaleString() ?? "0"} ден`}
                        location={listing.city || "Unknown"}
                        date={timeAgo(listing.created_at)}
                        images={images}
                        featured={listing.is_featured}
                      />
                    );
                  })}
                </div>
              )}

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="h-1" />
              {isFetchingNextPage && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4">
                  {Array.from({ length: 4 }).map((_, i) => <ListingSkeleton key={i} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
