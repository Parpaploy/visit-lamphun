export default function NewHomepageSkeletonLoader() {
  return (
    <div className="flex flex-col items-center gap-4 w-full px-5">
      <div className="h-5 w-3/4 bg-[#E5D5C0] rounded-full animate-pulse mb-5" />
      <div className="w-full min-h-42 aspect-video bg-[#E5D5C0] rounded-xl animate-pulse" />
      <div className="w-full flex flex-col gap-2 mt-4">
        <div className="h-4 w-full bg-[#E5D5C0] rounded-full animate-pulse" />
        <div className="h-4 w-5/6 bg-[#E5D5C0] rounded-full animate-pulse" />
        <div className="h-4 w-4/6 bg-[#E5D5C0] rounded-full animate-pulse" />
        <div className="h-4 mx-auto w-2/6 bg-[#E5D5C0] rounded-full animate-pulse" />
      </div>
    </div>
  );
}
