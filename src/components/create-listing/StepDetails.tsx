import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ListingFormData } from "@/pages/CreateListing";

interface Props {
  form: ListingFormData;
  updateForm: (u: Partial<ListingFormData>) => void;
}

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
];

const StepDetails = ({ form, updateForm }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="desc" className="text-sm font-semibold">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="desc"
          placeholder="Describe your item, include details buyers would want to know..."
          rows={4}
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
          className="resize-none"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          Condition <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={form.condition}
          onValueChange={(v) => updateForm({ condition: v })}
          className="flex gap-3"
        >
          {CONDITIONS.map((c) => (
            <label
              key={c.value}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
                form.condition === c.value
                  ? "border-sell bg-sell/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <RadioGroupItem value={c.value} />
              <span className="text-sm font-medium">{c.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default StepDetails;
