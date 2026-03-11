import { Search, Plus, Heart, MessageCircle, Bell, User, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b bg-surface/80 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground shrink-0">
          market<span className="text-sell">place</span>
        </h1>

        {/* Location */}
        <button className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <MapPin className="h-4 w-4" />
          <span>All Pakistan</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Search */}
        <div className="flex-1 relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Find Cars, Mobile Phones and more..."
            className="pl-10 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><MessageCircle className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
          <Button variant="ghost" size="sm" className="gap-1.5 ml-1">
            <User className="h-4 w-4" />
            Login
          </Button>
        </div>

        <Button variant="sell" size="sm" className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Sell</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
