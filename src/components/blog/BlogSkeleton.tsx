export default function BlogSkeleton() {
  return (
    <div className="border rounded-xl p-5 space-y-4 animate-pulse">
      
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>

      <div className="h-5 w-2/3 bg-muted rounded" />

      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-4/5 bg-muted rounded" />
      </div>

    </div>
  );
}