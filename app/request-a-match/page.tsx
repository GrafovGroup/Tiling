import { permanentRedirect } from "next/navigation";
import { legacyDestination, type RouteQuery } from "../legacy-redirects";

export default async function LegacyRequestPage({ searchParams }: { searchParams: Promise<RouteQuery> }) {
  permanentRedirect(legacyDestination("/request-a-match", await searchParams)!);
}
