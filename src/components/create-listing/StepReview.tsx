import { MapPin, Pencil, ImageIcon, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ListingFormData } from "@/pages/CreateListing";

interface Props {
  form: ListingFormData;
  onEdit: (step: number) => void;
}

const Section = ({
  title,
  step,
  onEdit,
  icon: Icon,
  children,
}: {
  title: string;
  step: number;
  onEdit: (s: number) => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <button onClick={() => onEdit(step)} className="text-xs text-sell font-medium hover:underline flex items-center gap-1">
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
      {children}
    </div>
  </div>
);

const StepReview = ({ form, onEdit }: Props) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-muted-foreground mb-2">Review your listing</p>

      {/* Preview card */}
      {form.images.length > 0 && (
        <div className="rounded-lg overflow-hidden border bg-card">
          <div className="aspect-[4/3] bg-muted">
            <img src={form.images[0].preview} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="p-3">
            <p className="font-display text-lg font-bold">Rs {form.price || "0"}</p>
            <p className="text-sm text-foreground/80 mt-1 line-clamp-1">{form.title}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {form.city || "No location"}
            </div>
          </div>
        </div>
      )}

      <Section title="Basic Info" step={0} onEdit={onEdit} icon={Tag}>
        <p className="text-sm font-medium line-clamp-1">{form.title}</p>
        <p className="text-sm text-muted-foreground">Rs {form.price} · {form.categoryLabel || "No category"}</p>
      </Section>

      <Section title="Location" step={1} onEdit={onEdit} icon={MapPin}>
        <p className="text-sm font-medium">{form.city || "Not set"}</p>
      </Section>

      <Section title="Photos" step={2} onEdit={onEdit} icon={ImageIcon}>
        <p className="text-sm font-medium">{form.images.length} image{form.images.length !== 1 ? "s" : ""}</p>
      </Section>

      <Section title="Details" step={3} onEdit={onEdit} icon={FileText}>
        <p className="text-sm font-medium capitalize">{form.condition} · {form.negotiable ? "Negotiable" : "Fixed price"}</p>
        {form.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{form.description}</p>
        )}
      </Section>
    </div>
  );
};

export default StepReview;
