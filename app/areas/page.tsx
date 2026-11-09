import { permanentRedirect } from "next/navigation";
import { legacyDestination, type RouteQuery } from "../legacy-redirects";

export default async function AreasPage({ searchParams }: { searchParams: Promise<RouteQuery> }) {
  permanentRedirect(legacyDestination("/areas", await searchParams)!);
}
