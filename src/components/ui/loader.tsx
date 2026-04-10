
export function Loader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-secondary" />
      </div>
    </div>
  );
}