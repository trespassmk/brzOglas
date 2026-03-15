import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, MessageCircle, Heart } from "lucide-react";
import { timeAgo } from "@/lib/date-utils";

import ImageGallery from "@/components/listing-detail/ImageGallery";
import SellerCard from "@/components/listing-detail/SellerCard";
import SafetyTips from "@/components/listing-detail/SafetyTips";
import ReportModal from "@/components/listing-detail/ReportModal";
import ShareButtons from "@/components/listing-detail/ShareButtons";
import RelatedListings from "@/components/listing-detail/RelatedListings";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const viewIncremented = useRef(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          listing_images ( id, image_url, sort_order, is_primary ),
          users!listings_user_id_fkey ( username, profile_image, created_at, rating_avg, verified_badge )
        `)
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Increment view count (debounced, once per visit)
  useEffect(() => {
    if (!id || viewIncremented.current) return;
    viewIncremented.current = true;
    const timer = setTimeout(() => {
      supabase.rpc("increment_view_count" as any, { listing_id: id } as any).then(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container max-w-5xl py-6 space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Listing not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const images = (listing.listing_images as any[])
    ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((img: any) => img.image_url) ?? [];
  const seller = listing.users as any;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="container max-w-5xl py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-4">
            <ImageGallery images={images} title={listing.title} />

            {/* Details */}
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">{listing.title}</h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {listing.city || "Unknown"} · {timeAgo(listing.created_at)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                  </button>
                  <ShareButtons title={listing.title} listingId={listing.id} />
                </div>
              </div>

              <p className="font-display text-3xl font-bold text-foreground">
                {listing.price?.toLocaleString() ?? "0"}{" "}
                <span className="text-lg font-medium text-muted-foreground">ден</span>
              </p>

              {listing.condition && (
                <div className="flex gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium capitalize">
                    {listing.condition}
                  </span>
                </div>
              )}

              {listing.description && (
                <div>
                  <h3 className="font-display font-semibold text-sm mb-2">Description</h3>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}

              <div className="pt-3 border-t">
                <ReportModal listingId={listing.id} />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {seller && (
              <SellerCard seller={seller} price={listing.price} viewsCount={listing.views_count} />
            )}
            <SafetyTips />
          </div>
        </div>

        {/* Related listings */}
        <RelatedListings
          listingId={listing.id}
          categoryId={listing.category_id}
          city={listing.city}
        />
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t p-3 z-40">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-display text-lg font-bold">
              {listing.price?.toLocaleString() ?? "0"} <span className="text-sm text-muted-foreground">ден</span>
            </p>
          </div>
          <Button variant="sell" className="gap-2 min-h-[48px] px-6">
            <MessageCircle className="h-5 w-5" /> Chat
          </Button>
        </div>
      </div>

      <div className="lg:hidden h-20" /> {/* Spacer for sticky CTA */}

      <Footer />
    </div>
  );
};

export default ListingDetail;
