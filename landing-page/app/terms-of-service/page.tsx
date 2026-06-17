import LegalPageTemplate from "@/components/common/legal/LegalPageTemplate";

const termsSections = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Trading Signals AI, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      "If you do not agree with these terms, you should discontinue use of the platform and related services immediately.",
      "We may update these terms periodically, and your continued use after changes are published indicates acceptance of the revised terms.",
    ],
  },
  {
    id: "service-usage",
    title: "Service Usage and Eligibility",
    content: [
      "You are responsible for ensuring that your use of the platform complies with local laws and exchange regulations in your jurisdiction.",
      "You agree not to misuse the service, including attempts to disrupt operations, scrape restricted data, bypass protections, or access unauthorized systems.",
      "Account credentials must be kept secure. You are responsible for activities performed through your account unless unauthorized use is reported promptly.",
    ],
  },
  {
    id: "risk-disclosure",
    title: "Risk Disclosure",
    content: [
      "Trading Signals AI provides informational signals and strategy insights only. Nothing on the platform constitutes financial, investment, tax, or legal advice.",
      "Crypto and financial markets carry significant risk, including the risk of loss. Past performance does not guarantee future results.",
      "You remain solely responsible for your trading decisions, risk management, and evaluation of market conditions before placing any trade.",
    ],
  },
  {
    id: "billing-and-termination",
    title: "Billing, Suspension, and Termination",
    content: [
      "Paid plans, renewal cycles, and cancellation terms are displayed at checkout or in your account settings.",
      "We may suspend or terminate access for violations of these terms, abuse of the service, fraudulent activity, or non-payment.",
      "Upon termination, your right to access premium features ends immediately, while sections related to liability, indemnity, and legal compliance remain in effect.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPageTemplate
      title="Terms of Service"
      subtitle="These terms govern your access to and use of Trading Signals AI, including account responsibilities, limitations, and important risk disclosures."
      lastUpdated="April 25, 2026"
      sections={termsSections}
    />
  );
}
