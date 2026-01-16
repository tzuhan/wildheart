import { getOrganizationById, getAllFundraisingByOrgId, getDonationsByOrgId } from "@/data/organizations";
import { getHighlightsByOrgId } from "@/data/highlights";
import { notFound } from "next/navigation";
import OrganizationDetailClient from "./OrganizationDetailClient";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function OrganizationDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [organization, allFundraising, donations] = await Promise.all([
    getOrganizationById(id),
    getAllFundraisingByOrgId(id),
    getDonationsByOrgId(id),
  ]);

  if (!organization) {
    notFound();
  }

  const highlights = getHighlightsByOrgId(id);
  // Get the most recent donation (first one since getDonationsByOrgId returns filtered list)
  const donation = donations.length > 0 ? donations[0] : undefined;

  return (
    <OrganizationDetailClient
      organization={organization}
      allFundraising={allFundraising}
      donation={donation}
      highlights={highlights}
    />
  );
}
