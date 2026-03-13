const SkeletonCard = () => {
  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow animate-pulse">
      {/* Image box skeleton */}
      <div className="bg-gray-300 h-48 w-full rounded-md mb-4"></div>

      {/* Title skeleton */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

      {/* Category skeleton */}
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>

      {/* Price skeleton */}
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
    </div>
  );
};

export default SkeletonCard;
