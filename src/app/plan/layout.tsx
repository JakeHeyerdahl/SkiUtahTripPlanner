import { TripProvider } from "@/context/TripContext";

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return <TripProvider>{children}</TripProvider>;
}
