import { Skeleton } from "@/components/ui/skeleton";

const DogProfileSkeleton = () => (
  <div className="h-full overflow-y-auto overflow-x-hidden bg-[#F9FAFB]">
    <div className="bg-[#3D3B39] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-6 h-6 rounded bg-white/20" />
        <Skeleton className="w-48 h-6 rounded bg-white/20" />
      </div>
      <div className="flex items-start gap-6">
        <Skeleton className="w-24 h-24 rounded-full bg-white/20" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-48 h-8 rounded bg-white/20" />
          <Skeleton className="w-64 h-4 rounded bg-white/20" />
          <div className="flex gap-6">
            <Skeleton className="w-16 h-12 rounded bg-white/20" />
            <Skeleton className="w-16 h-12 rounded bg-white/20" />
            <Skeleton className="w-16 h-12 rounded bg-white/20" />
            <Skeleton className="w-24 h-12 rounded bg-white/20" />
          </div>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Skeleton className="w-full h-64 rounded-xl" />
          <Skeleton className="w-full h-48 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="w-full h-64 rounded-xl" />
          <Skeleton className="w-full h-48 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default DogProfileSkeleton;

