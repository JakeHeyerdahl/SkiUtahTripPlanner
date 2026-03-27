// TODO: Generic badge/pill component
// variants: default (navy), blue, sky, green, gray
// sizes: sm, md
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "blue" | "sky" | "green" | "gray";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center font-semibold rounded-full", className)}>
      {children}
    </span>
  );
}
