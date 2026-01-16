import { getOrganizations, getFundraisingData, getDonationData } from "@/data/organizations";
import { getFeaturedHighlights } from "@/data/highlights";
import { rankOrganizations } from "@/lib/ranking";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const [organizations, fundraisingData, donationData] = await Promise.all([
    getOrganizations(),
    getFundraisingData(),
    getDonationData(),
  ]);

  const rankedOrganizations = rankOrganizations(organizations, fundraisingData, donationData);
  const featuredHighlights = getFeaturedHighlights();

  return (
    <HomePageClient
      rankedOrganizations={rankedOrganizations}
      featuredHighlights={featuredHighlights}
    />
  );
}
