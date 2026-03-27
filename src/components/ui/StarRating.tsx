// TODO: Star rating display component
// Props: rating (1-5), reviewCount?, size (sm/md)
// Shows filled/half/empty stars in brand blue
interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}

export default function StarRating({ rating, reviewCount, size = "sm" }: StarRatingProps) {
  return (
    <span>
      {rating}★ {reviewCount && `(${reviewCount})`}
    </span>
  );
}
