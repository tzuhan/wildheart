import { getOrganizationById, getAllFundraisingByOrgId, getDonationsByOrgId } from "@/data/organizations";
import { getHighlightsByOrganizationId } from "@/data/highlights";
import { notFound } from "next/navigation";
import OrganizationDetailClient from "./OrganizationDetailClient";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function OrganizationDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [organization, allFundraising, donations, highlights] = await Promise.all([
    getOrganizationById(id),
    getAllFundraisingByOrgId(id),
    getDonationsByOrgId(id),
    getHighlightsByOrganizationId(id),
  ]);

  if (!organization) {
    notFound();
  }
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
