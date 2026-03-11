import { Car, Smartphone, Home, Briefcase, Sofa, ShoppingBag, Monitor, Bike, MoreHorizontal } from "lucide-react";

const categories = [
  { icon: Car, label: "Cars" },
  { icon: Smartphone, label: "Mobiles" },
  { icon: Home, label: "Property" },
  { icon: Briefcase, label: "Jobs" },
  { icon: Sofa, label: "Furniture" },
  { icon: ShoppingBag, label: "Fashion" },
  { icon: Monitor, label: "Electronics" },
  { icon: Bike, label: "Bikes" },
  { icon: MoreHorizontal, label: "More" },
];

const CategoryBar = () => {
  return (
    <div className="border-b bg-surface">
      <div className="container">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors shrink-0 min-w-[72px]"
            >
              <cat.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
