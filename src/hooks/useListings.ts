import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 20;

export interface ListingFilters {
  search?: string;
  category?: string;
  city?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  datePosted?: "today" | "week" | "month";
  sort?: "newest" | "price_asc" | "price_desc";
}

function getDateCutoff(period: string) {
  const d = new Date();
  if (period === "today") d.setHours(0, 0, 0, 0);
  else if (period === "week") d.setDate(d.getDate() - 7);
  else if (period === "month") d.setMonth(d.getMonth() - 1);
  return d.toISOString();
}

export function useListings(filters: ListingFilters) {
  return useInfiniteQuery({
    queryKey: ["listings", filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from("listings")
        .select(`
          id, title, price, city, condition, is_featured, created_at, currency, status, user_id,
          listing_images ( id, image_url, sort_order, is_primary ),
          users!listings_user_id_fkey ( username, profile_image )
        `)
        .eq("status", "active")
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      // Sort
      if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
      else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      // Filters
      if (filters.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      if (filters.category) {
        // Look up category UUID by slug first
        const { data: catData } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filters.category)
          .single();
        if (catData) query = query.eq("category_id", catData.id);
      }
      if (filters.city) query = query.eq("city", filters.city);
      if (filters.condition) query = query.eq("condition", filters.condition);
      if (filters.priceMin != null) query = query.gte("price", filters.priceMin);
      if (filters.priceMax != null) query = query.lte("price", filters.priceMax);
      if (filters.datePosted) query = query.gte("created_at", getDateCutoff(filters.datePosted));

      const { data, error } = await query;
      if (error) throw error;
      return { items: data ?? [], nextOffset: (data?.length ?? 0) < PAGE_SIZE ? undefined : pageParam + PAGE_SIZE };
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });
}
