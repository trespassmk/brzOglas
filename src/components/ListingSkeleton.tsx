import { Skeleton } from "@/components/ui/skeleton";

const ListingSkeleton = () => (
  <div className="rounded-lg border bg-card overflow-hidden">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

export default ListingSkeleton;
