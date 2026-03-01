const JsonLd = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fitbinary",
    url: "https://fitbinary.com",
    logo: "https://fitbinary.com/logo.png",
    sameAs: [
      "https://twitter.com/fitbinary",
      "https://linkedin.com/company/fitbinary",
    ],
  };

  const softwareApplicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fitbinary Accounts",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    description:
      "Centralized account and access control panel for Fitbinary apps. Manage subscriptions, users, and organizations.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationData),
        }}
      />
    </>
  );
};

export default JsonLd;
