import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "@/components/ListingCard";
import { timeAgo } from "@/lib/date-utils";
import { Link } from "react-router-dom";

interface Props {
  listingId: string;
  categoryId: string | null;
  city: string | null;
}

const RelatedListings = ({ listingId, categoryId, city }: Props) => {
  const { data: listings } = useQuery({
    queryKey: ["related-listings", listingId, categoryId, city],
    queryFn: async () => {
      let query = supabase
        .from("listings")
        .select(`id, title, price, city, is_featured, created_at, listing_images ( id, image_url, sort_order )`)
        .eq("status", "active")
        .neq("id", listingId)
        .limit(6);

      if (categoryId) query = query.eq("category_id", categoryId);
      else if (city) query = query.eq("city", city);

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!(categoryId || city),
  });

  if (!listings?.length) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold">Similar Listings</h2>
        <Link to="/" className="text-sm text-sell hover:underline">
          See more →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {listings.map((l: any) => {
          const imgs = (l.listing_images as any[])
            ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((img: any) => img.image_url) ?? [];
          return (
            <ListingCard
              key={l.id}
              id={l.id}
              title={l.title}
              price={`${l.price?.toLocaleString() ?? "0"} ден`}
              location={l.city || "Unknown"}
              date={timeAgo(l.created_at)}
              images={imgs}
              featured={l.is_featured}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedListings;
