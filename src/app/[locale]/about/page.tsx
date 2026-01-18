import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "About - WildHeart Bulletin",
  description:
    "Learn about WildHeart Bulletin and our mission to connect donors with wildlife organizations in need.",
};

export default function AboutPage() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");
  const tCategory = useTranslations("category");
  const tTransparency = useTranslations("transparency");
  const tStatus = useTranslations("status");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t("title")}
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Creator Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("creatorTitle")}
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src="/profile.jpg"
                    alt="Han"
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("creatorName")}
                  </h3>
                  <div className="text-gray-700 leading-relaxed mb-4 space-y-3">
                    {t("creatorIntro").split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.instagram.com/han960691"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("followMe")}
                    </a>
                    <a
                      href="https://www.threads.com/@han960691"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.85-.706 2.005-1.108 3.245-1.137l.018-.002c.638-.012 1.232.03 1.79.13.41-.891.615-1.9.615-2.986 0-.674-.08-1.318-.233-1.917l2.007-.479c.2.79.297 1.615.297 2.396 0 1.404-.29 2.747-.866 3.968.976.457 1.81 1.102 2.464 1.917.977 1.214 1.423 2.728 1.254 4.262-.224 2.036-1.2 3.636-2.902 4.756-1.605 1.056-3.678 1.59-6.161 1.589h-.01zM11.11 11.76c-.749.025-1.408.2-1.854.496-.527.35-.754.816-.716 1.468.024.439.222.823.556 1.089.385.306.914.462 1.572.463.014 0 .028 0 .043-.002 1.009-.057 1.78-.378 2.29-.957.376-.426.608-.997.713-1.698-.853-.235-1.721-.38-2.604-.86z" />
                      </svg>
                      {t("followThreads")}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <hr className="my-12 border-gray-200" />

            {/* Purpose Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("purposeTitle")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("purposeText")}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-3">
                <li>
                  <strong>{t("noMiddleman")}</strong> {t("noMiddlemanText")}
                </li>
                <li>
                  <strong>{t("urgencyFocused")}</strong> {t("urgencyFocusedText")}
                </li>
                <li>
                  <strong>{t("transparentData")}</strong> {t("transparentDataText")}
                </li>
                <li>
                  <strong>{t("privacyFirst")}</strong> {t("privacyFirstText")}
                </li>
              </ul>
            </section>



            <hr className="my-12 border-gray-200" id="transparency" />

            {/* Transparency Section Merged */}
            <section className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {tTransparency("title")}
              </h1>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {tTransparency("dataSources")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {tTransparency("dataSourcesText")}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{tTransparency("dataSourceMOHW")}</li>
                <li>{tTransparency("dataSourceAssoc")}</li>
                <li>{tTransparency("dataSourceAnnual")}</li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-amber-800 text-sm">
                  {tTransparency("dataWarning")}
                </p>
              </div>
            </section>

            {
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {tTransparency("howTag")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {tTransparency("howTagText")}
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    {tStatus("redDesc")}
                  </li>
                  <li>
                    <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    {tStatus("orangeDesc")}
                  </li>
                  <li>
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    {tStatus("yellowDesc")}
                  </li>
                  <li>
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    {tStatus("greenDesc")}
                  </li>
                  <li>
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    {tStatus("blueDesc")}
                  </li>
                  <li>
                    <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    {tStatus("purpleDesc")}
                  </li>
                  <li>
                    <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                    {tStatus("grayDesc")}
                  </li>
                </ul>
              </section>
            }

            <section className="mb-8 hidden">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {tTransparency("selfReported")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {tTransparency("selfReportedText")}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{tTransparency("cannotVerify")}</li>
                <li>{tTransparency("doNotKnow")}</li>
                <li>{tTransparency("storeLocally")}</li>
                <li>{tTransparency("useSolely")}</li>
              </ul>
            </section>

            <section className="mb-8 hidden">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {tTransparency("gamification")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {tTransparency("gamificationText")}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>{tTransparency("basedOnActions")}</li>
                <li>{tTransparency("optionalNonCompetitive")}</li>
                <li>{tTransparency("storedLocally")}</li>
                <li>{tTransparency("neverRanked")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {tTransparency("advertisingPolicy")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {tTransparency("advertisingPolicyText")}
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>{tTransparency("adsNeverNear")}</li>
                <li>{tTransparency("adsDistinguishable")}</li>
              </ul>
            </section>

            <section className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                {tTransparency("questionsTitle")}
              </h2>
              <p className="text-blue-800 mb-4">
                {tTransparency("questionsText")}
              </p>
              <a
                href={tTransparency("questionsFormLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {tTransparency("questionsFormText")}
              </a>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
