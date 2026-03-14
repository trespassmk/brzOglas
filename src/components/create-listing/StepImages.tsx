import { useCallback, useRef, useState } from "react";
import { ImagePlus, X, GripVertical } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { compressImage, createPreviewUrl } from "@/lib/image-utils";
import type { ListingFormData } from "@/pages/CreateListing";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  form: ListingFormData;
  updateForm: (u: Partial<ListingFormData>) => void;
}

const StepImages = ({ form, updateForm }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const remaining = MAX_IMAGES - form.images.length;
      if (remaining <= 0) {
        toast({ title: "Maximum 5 images", variant: "destructive" });
        return;
      }

      const validFiles = Array.from(files)
        .filter((f) => {
          if (!ALLOWED_TYPES.includes(f.type)) {
            toast({ title: `${f.name}: Invalid format`, variant: "destructive" });
            return false;
          }
          if (f.size > MAX_SIZE_MB * 1024 * 1024) {
            toast({ title: `${f.name}: Too large (max ${MAX_SIZE_MB}MB)`, variant: "destructive" });
            return false;
          }
          return true;
        })
        .slice(0, remaining);

      if (!validFiles.length) return;

      setUploading(true);
      const newImages: { file: File; preview: string }[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        setUploadProgress(((i + 1) / validFiles.length) * 100);
        const compressed = await compressImage(validFiles[i]);
        const preview = await createPreviewUrl(compressed);
        newImages.push({ file: compressed, preview });
      }

      updateForm({ images: [...form.images, ...newImages] });
      setUploading(false);
      setUploadProgress(0);
    },
    [form.images, updateForm]
  );

  const removeImage = (index: number) => {
    updateForm({ images: form.images.filter((_, i) => i !== index) });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Photos</p>
        <span className="text-xs text-muted-foreground font-medium">
          {form.images.length}/{MAX_IMAGES} images
        </span>
      </div>

      {/* Drop zone */}
      {form.images.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-2 transition-colors min-h-[44px] ${
            dragOver
              ? "border-sell bg-sell/5"
              : "border-border hover:border-primary/50 bg-card"
          }`}
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop or <span className="text-sell font-medium">browse</span>
          </p>
          <p className="text-[10px] text-muted-foreground">JPG, PNG, WebP · Max 5MB each</p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />

      {uploading && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="h-1.5" />
          <p className="text-xs text-muted-foreground">Compressing images...</p>
        </div>
      )}

      {/* Thumbnails */}
      {form.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {form.images.map((img, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
              <img src={img.preview} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-sell text-sell-foreground px-1.5 py-0.5 rounded font-bold uppercase">
                  Cover
                </span>
              )}
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity">
                <GripVertical className="h-4 w-4 text-background" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepImages;
