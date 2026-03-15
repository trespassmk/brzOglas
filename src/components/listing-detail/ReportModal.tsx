import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const REASONS = [
  "Spam or misleading",
  "Prohibited item",
  "Fraud or scam",
  "Duplicate listing",
  "Other",
];

interface Props {
  listingId: string;
}

const ReportModal = ({ listingId }: Props) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in to report a listing");
      return;
    }
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reports").insert({
      listing_id: listingId,
      reporter_id: user.id,
      reason,
      description: description || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit report");
    } else {
      toast.success("Report submitted. Thank you.");
      setOpen(false);
      setReason("");
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors">
          <Flag className="h-3.5 w-3.5" /> Report this Ad
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Report this Listing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
            {REASONS.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer text-sm min-h-[44px] transition-colors ${
                  reason === r ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/40"
                }`}
              >
                <RadioGroupItem value={r} />
                {r}
              </label>
            ))}
          </RadioGroup>
          <Textarea
            placeholder="Additional details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button
            variant="destructive"
            className="w-full min-h-[44px]"
            onClick={handleSubmit}
            disabled={submitting || !reason}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
