import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, MessageCircle, Heart, ChevronLeft, ChevronRight, Share2, Shield } from "lucide-react";
import { useState } from "react";
import { timeAgo } from "@/lib/date-utils";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container max-w-4xl py-6 space-y-4">
          <Skeleton className="aspect-[16/9] w-full rounded-lg" />
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

      <div className="container max-w-4xl py-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image gallery */}
            {images.length > 0 ? (
              <div className="relative rounded-lg overflow-hidden bg-muted aspect-[4/3]">
                <img src={images[imgIdx]} alt={listing.title} className="h-full w-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i > 0 ? i - 1 : images.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center hover:bg-surface"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i < images.length - 1 ? i + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center hover:bg-surface"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_: string, i: number) => (
                        <button key={i} onClick={() => setImgIdx(i)} className={`h-2 w-2 rounded-full transition-colors ${i === imgIdx ? "bg-sell" : "bg-surface/60"}`} />
                      ))}
                    </div>
                  </>
                )}
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2 flex gap-1.5 justify-center">
                    {images.map((url: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`h-12 w-12 rounded border-2 overflow-hidden shrink-0 ${i === imgIdx ? "border-sell" : "border-transparent opacity-70"}`}
                      >
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-muted aspect-[4/3] flex items-center justify-center text-muted-foreground">
                No images
              </div>
            )}

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
                  <button onClick={() => setLiked(!liked)} className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors">
                    <Heart className={`h-5 w-5 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                  </button>
                  <button className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <p className="font-display text-3xl font-bold text-foreground">
                {listing.price?.toLocaleString() ?? "0"} <span className="text-lg font-medium text-muted-foreground">ден</span>
              </p>

              {listing.condition && (
                <div className="flex gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium capitalize">{listing.condition}</span>
                </div>
              )}

              {listing.description && (
                <div>
                  <h3 className="font-display font-semibold text-sm mb-2">Description</h3>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Seller card + CTA */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4 space-y-4 sticky top-20">
              <p className="font-display text-2xl font-bold">
                {listing.price?.toLocaleString() ?? "0"} <span className="text-sm font-medium text-muted-foreground">ден</span>
              </p>

              <Button variant="sell" className="w-full gap-2 min-h-[48px]">
                <MessageCircle className="h-5 w-5" /> Chat with Seller
              </Button>

              {/* Seller info */}
              {seller && (
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground overflow-hidden">
                    {seller.profile_image ? (
                      <img src={seller.profile_image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      seller.username?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm flex items-center gap-1">
                      {seller.username}
                      {seller.verified_badge && <Shield className="h-3.5 w-3.5 text-sell" />}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Member since {new Date(seller.created_at).getFullYear()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetail;
