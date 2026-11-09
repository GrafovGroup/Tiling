import { permanentRedirect } from "next/navigation";
import { legacyDestination, type RouteQuery } from "../legacy-redirects";

export default async function LegacyReviewPage({ searchParams }: { searchParams: Promise<RouteQuery> }) {
  permanentRedirect(legacyDestination("/contractor-review-process", await searchParams)!);
}
