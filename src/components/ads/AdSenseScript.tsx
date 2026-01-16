import Script from "next/script";

interface AdSenseScriptProps {
  adClient: string;
}

export function AdSenseScript({ adClient }: AdSenseScriptProps) {
  if (!adClient) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
