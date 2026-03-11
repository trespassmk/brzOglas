import { Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ListingCardProps {
  title: string;
  price: string;
  location: string;
  date: string;
  image: string;
  featured?: boolean;
}

const ListingCard = ({ title, price, location, date, image, featured }: ListingCardProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {featured && (
        <span className="absolute top-2 left-2 z-10 bg-sell text-sell-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded">
          Featured
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center hover:bg-surface transition-colors"
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
      </button>
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <p className="font-display text-lg font-bold text-foreground leading-tight">{price}</p>
        <p className="text-sm text-foreground/80 mt-1 line-clamp-1">{title}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </span>
          <span>{date}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
