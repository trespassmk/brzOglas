import { MessageCircle, Shield, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Seller {
  username: string;
  profile_image: string | null;
  created_at: string;
  rating_avg: number;
  verified_badge: boolean;
}

interface Props {
  seller: Seller;
  price: number | null;
  viewsCount: number;
}

const SellerCard = ({ seller, price, viewsCount }: Props) => {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4 sticky top-20">
      <p className="font-display text-2xl font-bold">
        {price?.toLocaleString() ?? "0"}{" "}
        <span className="text-sm font-medium text-muted-foreground">ден</span>
      </p>

      <Button variant="sell" className="w-full gap-2 min-h-[48px]">
        <MessageCircle className="h-5 w-5" /> Chat with Seller
      </Button>

      {/* Seller info */}
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
          {seller.rating_avg > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="h-3 w-3 fill-sell text-sell" />
              <span className="text-xs font-medium">{seller.rating_avg.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      <Button variant="outline" className="w-full text-sm min-h-[44px]">
        View Profile
      </Button>

      {/* Views */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2 border-t">
        <Eye className="h-3.5 w-3.5" />
        {viewsCount} views
      </div>
    </div>
  );
};

export default SellerCard;
