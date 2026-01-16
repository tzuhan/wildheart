import { useTranslations } from "next-intl";

interface InvoiceDonationCodeBadgeProps {
    code: string;
}

export function InvoiceDonationCodeBadge({ code }: InvoiceDonationCodeBadgeProps) {
    const t = useTranslations("organization");

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
            <span>🧾</span>
            <span>{t("invoiceDonationCode")}: {code}</span>
        </span>
    );
}
