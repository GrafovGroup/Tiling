import { permanentRedirect } from "next/navigation";
import { legacyDestination, type RouteQuery } from "../legacy-redirects";

export default async function LegacyContractorPage({ searchParams }: { searchParams: Promise<RouteQuery> }) {
  permanentRedirect(legacyDestination("/for-contractors", await searchParams)!);
}
