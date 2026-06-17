"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  Network,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
} from "lucide-react";
import Container from "@/components/common/container/Container";

const trustedIps = [
  "185.141.195.71",
  "185.141.192.50",
  "185.141.195.244",
];



const permissions = [
  "Enable reading. This parameter allows third-party applications to read trade data.",
  "Enable Margin Loan, Repay & Transfer. This parameter allows you to take a margin loan on Binance via a third-party application.",
  "Enable spot and margin trading. This option allows you to conduct spot and margin trades on Binance through a third-party application.",
  "Enable Futures. This option allows you to execute Binance futures trades through a third-party application.",
  "Enable symbol whitelist. This option allows you to execute trades only on specific trading pairs on Binance through a third-party application.",
  "Enable withdrawals. This option allows you to withdraw funds from your Binance account via a third-party application.",
  "Enable universal transfers. This option allows you to transfer funds from your Binance account via a third-party application.",
];

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Section({
  step,
  title,
  icon,
  children,
}: {
  step: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
          {icon}
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] text-cyan-300 font-semibold">
            {step}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            {title}
          </h2>
        </div>
      </div>

      <div className="space-y-4 text-slate-300 leading-8">{children}</div>
    </Card>
  );
}

export default function BinanceApiSetupPage() {
const copyIps = async () => {
  try {
    await navigator.clipboard.writeText(trustedIps.join("\n"));
    alert("IP addresses copied successfully!");
  } catch (error) {
    console.error("Copy failed:", error);
    alert("Failed to copy IP addresses.");
  }
};
  return (
    <main className="min-h-screen bg-[#030b16] text-white lg:mt-24 mt-10 font-hoves">
      {/* background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_20%),linear-gradient(180deg,#030b16_0%,#06111f_50%,#02060d_100%)]" />


      <section className=" pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-cyan-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for Binance & Binance US
          </h1>

          <p className="text-slate-400 text-lg mt-5 max-w-2xl mx-auto leading-8">
            Securely connect your Binance account to the platform in a few guided
            steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() =>
                window.open(
                  "https://www.binance.com/en/",
                  "_blank"
                )
              }
              className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:scale-105 transition"
            >
              Join Now
            </button>
          </div>
        </Container>
      </section>

      <section className="pb-6">
        <Container>
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-5">
              How to create API keys for Binance and Binance US?
            </h2>

            <div className="space-y-4 text-slate-300 leading-8">
              <p>
                To create an API key on Binance you need to have an account on{" "}
                <a
                  href="https://www.binance.com/en/"
                  target="_blank"
                  className="text-cyan-300 underline"
                >
                  https://www.binance.com/en/
                </a>
                .
              </p>

              <p>
                To create an API key on Binance US you need to have an account on{" "}
                <a
                  href="https://www.binance.us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 underline hover:text-cyan-200 transition"
                >
                  Binance.US/
                </a>
                .
              </p>

              <p>
                To create an account please use the button Register and go through
                the registration.
              </p>
            </div>
          </Card>
        </Container>
      </section>

      {/* horizontal flow */}
      <section className="py-6 space-y-6">
        <Container className="space-y-10">
          <Section
            step="STEP 1"
            title="Complete Verification"
            icon={<ShieldCheck size={20} />}
          >
            <p>
              Before proceeding with the integration of the API key, you must pass
              verification on the exchange. If you have not previously passed
              verification on the exchange, go to the Identification tab.
            </p>

            <p>
              The title line contains a link to detailed instructions on how to
              pass through this procedure. You can watch the video or read the
              text instructions. There are several levels of verification, we need
              ‘Verified’ option or ‘Verified plus’.
            </p>

            <p>
              In order to pass the verification, you will need to upload a photo
              of the valid government issued document, a selfie, and also go
              through the step with face recognition. After uploading all this
              data, the exchange will take several days to verify your identity.
            </p>

            <p>
              Only after that you will be able to integrate your API key to the
              platform.
            </p>
          </Section>

          <Section
            step="STEP 2"
            title="Create API Key"
            icon={<KeyRound size={20} />}
          >
            <p>
              After you are successfully logged in find the button of Account and
              tap the line API management.
            </p>

            <p>
              In order to create an API key without a list of trusted addresses,
              you need to check the checkbox for managing account security in the
              API key settings.
            </p>

            <p>
              Then please add the name of a new key and then press the Create
              button.
            </p>

            <p>
              Now you need to pass verification by your account e-mail and 2FA.
            </p>

            <p>
              After you click the Submit button, your API key will be created
              automatically.
            </p>

            <p>
              Save the API key, secret key and / or QR code in a safe folder.
            </p>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200">
              ATTENTION! The secret key will be shown only once. To use it further
              please save it in the safe folder.
            </div>

            <p>
              Then change the parameters of the key. In order to do this, click
              “Edit restrictions”.
            </p>
          </Section>

          {/* merged horizontal content */}
          <Section
            step="SECURITY"
            title="Trusted IP + Permissions"
            icon={<Network size={20} />}
          >
            <div className="rounded-2xl bg-[#020817] border border-cyan-400/10 p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-white font-semibold">Add Trusted IP Addresses</h3>

                <button
                  onClick={copyIps}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:scale-105 transition"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>

              <div className="font-mono text-cyan-300 space-y-2">
                {trustedIps.map((ip) => (
                  <p key={ip}>{ip}</p>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {permissions.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    className="text-cyan-300 mt-1 shrink-0"
                    size={18}
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-cyan-200">
              We need to enable spot and margin trading options.
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                ATTENTION! Do not add withdrawal to the key parameters.
              </span>
            </div>

            <p>Click Save.</p>
            <p>To confirm changes you need to fill in the 2FA.</p>
          </Section>

          <Section
            step="STEP 3"
            title="Add the Key to Your Account"
            icon={<ArrowRight size={20} />}
          >
            <p>
              Use the + ADD NEW KEY button in the Account &gt; Exchange accounts
              section.
            </p>

            <p>Choose the exchange: Binance or Binance US.</p>

            <p>
              Add the keys from your account on Binance or Binance US to the tabs.
            </p>

            <p>Give the name to the key.</p>

            <p>Add the key.</p>

            <p>
              After the key is added, it will appear in the same window, you can
              start Trading.
            </p>
          </Section>
        </Container>
      </section>

      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-cyan-400/20 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect Binance?
            </h2>

            <p className="text-slate-400 mt-4 text-lg">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  window.open(
                    "https://www.binance.com/en/",
                    "_blank"
                  )
                }
                className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:scale-105 transition"
              >
                Join Now
              </button>

            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}