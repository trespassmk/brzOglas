import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import StepBasicInfo from "@/components/create-listing/StepBasicInfo";
import StepLocation from "@/components/create-listing/StepLocation";
import StepImages from "@/components/create-listing/StepImages";
import StepDetails from "@/components/create-listing/StepDetails";
import StepReview from "@/components/create-listing/StepReview";

export interface ListingFormData {
  title: string;
  price: string;
  categoryId: string;
  categoryLabel: string;
  city: string;
  coordinates: { lat: number; lng: number } | null;
  images: { file: File; preview: string }[];
  description: string;
  condition: string;
  negotiable: boolean;
}

const STEPS = ["Basic Info", "Location", "Images", "Details", "Review"];
const FREE_LISTING_LIMIT = 5;

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState<number | null>(null);

  const [form, setForm] = useState<ListingFormData>({
    title: "",
    price: "",
    categoryId: "",
    categoryLabel: "",
    city: "",
    coordinates: null,
    images: [],
    description: "",
    condition: "used",
    negotiable: false,
  });

  const updateForm = (updates: Partial<ListingFormData>) =>
    setForm((prev) => ({ ...prev, ...updates }));

  const canProceed = () => {
    if (step === 0) return form.title.trim().length > 0 && form.price.trim().length > 0 && form.categoryId;
    if (step === 1) return form.city.trim().length > 0;
    return true;
  };

  const next = () => step < STEPS.length - 1 && canProceed() && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const publish = async () => {
    if (!user) return;
    setPublishing(true);
    try {
      // Check quota
      const { data: userData } = await supabase
        .from("users")
        .select("free_listings_used")
        .eq("id", user.id)
        .single();

      const used = userData?.free_listings_used ?? 0;
      setQuotaUsed(used);

      if (used >= FREE_LISTING_LIMIT) {
        toast({
          title: "Listing limit reached",
          description: `You've used ${used}/${FREE_LISTING_LIMIT} free listings. Upgrade coming soon!`,
          variant: "destructive",
        });
        setPublishing(false);
        return;
      }

      // Create listing
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          user_id: user.id,
          title: form.title.trim(),
          price: parseFloat(form.price.replace(/,/g, "")) || 0,
          category_id: form.categoryId || null,
          city: form.city,
          coordinates: form.coordinates as any,
          description: form.description.trim() || null,
          condition: form.condition,
          currency: "PKR",
          status: "active",
        })
        .select("id")
        .single();

      if (listingError) throw listingError;

      // Upload images
      for (let i = 0; i < form.images.length; i++) {
        const img = form.images[i];
        const ext = img.file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${listing.id}/${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, img.file, { contentType: img.file.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(path);

        await supabase.from("listing_images").insert({
          listing_id: listing.id,
          image_url: urlData.publicUrl,
          sort_order: i,
          is_primary: i === 0,
        });
      }

      // Increment quota
      await supabase
        .from("users")
        .update({ free_listings_used: used + 1 })
        .eq("id", user.id);

      toast({ title: "Listing published!", description: "Your ad is now live." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to publish", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 container max-w-2xl py-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-xl font-bold">Post Your Ad</h2>
            <span className="text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => i < step && setStep(i)}
                className={`text-[10px] font-medium transition-colors ${
                  i <= step ? "text-foreground" : "text-muted-foreground"
                } ${i < step ? "cursor-pointer hover:text-sell" : "cursor-default"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && <StepBasicInfo form={form} updateForm={updateForm} />}
            {step === 1 && <StepLocation form={form} updateForm={updateForm} />}
            {step === 2 && <StepImages form={form} updateForm={updateForm} />}
            {step === 3 && <StepDetails form={form} updateForm={updateForm} />}
            {step === 4 && <StepReview form={form} onEdit={setStep} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-background/90 backdrop-blur-sm border-t mt-6 -mx-4 px-4 py-4 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={prev} className="gap-1.5 min-h-[44px]">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          )}
          <div className="flex-1" />
          {step < STEPS.length - 1 ? (
            <Button
              variant="sell"
              onClick={next}
              disabled={!canProceed()}
              className="gap-1.5 min-h-[44px]"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="sell"
              onClick={publish}
              disabled={publishing}
              className="gap-1.5 min-h-[44px]"
            >
              {publishing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-sell-foreground/30 border-t-sell-foreground rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Publish
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
