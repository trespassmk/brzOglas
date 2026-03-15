import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface Props {
  title: string;
  listingId: string;
}

const ShareButtons = ({ title, listingId }: Props) => {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/listing/${listingId}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsapp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, "_blank");
  const facebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors">
          <Share2 className="h-5 w-5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <button onClick={whatsapp} className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">
            WhatsApp
          </button>
          <button onClick={facebook} className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">
            Facebook
          </button>
          <button onClick={copyLink} className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2">
            {copied ? <Check className="h-3.5 w-3.5 text-sell" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButtons;
