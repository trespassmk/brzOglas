import { Car, Smartphone, Home, Briefcase, Sofa, ShoppingBag, Monitor, Bike, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ListingFormData } from "@/pages/CreateListing";

const CATEGORIES = [
  { icon: Car, label: "Cars", slug: "cars" },
  { icon: Smartphone, label: "Mobiles", slug: "mobiles" },
  { icon: Home, label: "Property", slug: "property" },
  { icon: Briefcase, label: "Jobs", slug: "jobs" },
  { icon: Sofa, label: "Furniture", slug: "furniture" },
  { icon: ShoppingBag, label: "Fashion", slug: "fashion" },
  { icon: Monitor, label: "Electronics", slug: "electronics" },
  { icon: Bike, label: "Bikes", slug: "bikes" },
  { icon: MoreHorizontal, label: "More", slug: "more" },
];

interface Props {
  form: ListingFormData;
  updateForm: (u: Partial<ListingFormData>) => void;
}

const StepBasicInfo = ({ form, updateForm }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold">
          Ad Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="What are you selling?"
          maxLength={80}
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          className="text-lg h-12"
        />
        <p className="text-xs text-muted-foreground text-right">{form.title.length}/80</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-semibold">
          Price (MKD) <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
            ден
          </span>
          <Input
            id="price"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={form.price}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9,]/g, "");
              updateForm({ price: v });
            }}
            className="pl-12 text-lg h-12 font-display font-bold"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Category <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => updateForm({ categoryId: cat.slug, categoryLabel: cat.label })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all min-h-[44px] ${
                form.categoryId === cat.slug
                  ? "border-sell bg-sell/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
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

export default StepBasicInfo;
