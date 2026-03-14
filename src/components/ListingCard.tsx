import { Heart, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ListingCardProps {
  id?: string;
  title: string;
  price: string;
  location: string;
  date: string;
  images: string[];
  featured?: boolean;
  image?: string; // legacy single-image fallback
}

const ListingCard = ({ id, title, price, location, date, images, featured, image }: ListingCardProps) => {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const navigate = useNavigate();

  const allImages = images?.length ? images : image ? [image] : ["/placeholder.svg"];

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((i) => (i > 0 ? i - 1 : allImages.length - 1));
  };
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((i) => (i < allImages.length - 1 ? i + 1 : 0));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => id && navigate(`/listing/${id}`)}
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

      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <img
          src={allImages[imgIdx]}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {allImages.length > 1 && (
          <>
            <button onClick={prevImg} className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-surface/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={nextImg} className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-surface/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
              {allImages.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === imgIdx ? "bg-sell" : "bg-surface/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3">
        <p className="font-display text-lg font-bold text-foreground leading-tight">{price}</p>
        <p className="text-sm text-foreground/80 mt-1 line-clamp-2">{title}</p>
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
