import LegalPageTemplate from "@/components/common/legal/LegalPageTemplate";

const privacySections = [
  {
    id: "information-collected",
    title: "Information We Collect",
    content: [
      "We collect account information such as your email address, profile details, and selected preferences to provide and personalize your Trading Signals AI experience.",
      "We may collect usage data like pages visited, feature interactions, and device/browser details to improve performance, reliability, and product quality.",
      "Payment and billing details are processed securely through trusted third-party providers and are not stored directly on our servers unless required for invoicing.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "How We Use Your Data",
    content: [
      "Your information is used to operate the platform, deliver alerts, manage subscriptions, and provide customer support.",
      "We analyze aggregate usage trends to improve strategies, user flows, and educational content, while applying safeguards to avoid unnecessary exposure of personal information.",
      "We may send service-related communications, legal notices, and optional product updates in line with your communication preferences.",
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing and Security",
    content: [
      "We do not sell your personal information. Data may be shared only with vetted service providers that help us operate infrastructure, analytics, communication, and billing systems.",
      "We apply technical and organizational security measures designed to protect your information against unauthorized access, misuse, or disclosure.",
      "In the event of legal obligations, we may disclose specific information when required by law or to protect users, rights, and platform integrity.",
    ],
  },
  {
    id: "rights-and-retention",
    title: "Your Rights and Data Retention",
    content: [
      "You can request access, correction, or deletion of eligible personal data by contacting our support team.",
      "We retain information only as long as needed for legitimate business and legal purposes, then securely remove or anonymize it.",
      "If you close your account, certain records may be retained for compliance, fraud prevention, dispute resolution, and tax reporting requirements.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageTemplate
      title="Privacy Policy"
      subtitle="This policy explains how Trading Signals AI collects, uses, protects, and processes your information while you use our products and services."
      lastUpdated="April 25, 2026"
      sections={privacySections}
    />
  );
}
