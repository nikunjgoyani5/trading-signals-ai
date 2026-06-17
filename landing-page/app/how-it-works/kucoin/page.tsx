"use client";

import { motion } from "framer-motion";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Lock,
  Network,
  Wallet,
} from "lucide-react";
import Container from "@/components/common/container/Container";

const trustedIps = [
  "185.141.195.71",
  "185.141.192.50",
  "185.141.195.244",
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
      className={`rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Step({
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
      <div className="flex items-start gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-300 shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] text-rose-300 font-semibold">
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

export default function KucoinHowItWorksPage() {
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
    <main className="min-h-screen bg-[#020813] text-white font-hoves lg:mt-24 mt-10">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.14),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(251,113,133,0.10),transparent_20%),linear-gradient(180deg,#020813_0%,#06111f_55%,#01050b_100%)]" />

      {/* Hero */}
      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-rose-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for KuCoin
          </h1>

          <p className="text-slate-400 text-lg leading-8 mt-5 max-w-3xl mx-auto">
            Securely connect your KuCoin account to the platform in a few guided
            steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => window.open("https://www.kucoin.com", "_blank")}
              className="px-6 py-3 rounded-xl bg-rose-500 text-white font-semibold hover:scale-105 transition"
            >
              Join Now
            </button>
          </div>
        </Container>
      </section>

      {/* Steps */}
      <section className="py-6 space-y-6">
        <Container className="space-y-10">
          <Step
            step="STEP 1"
            title="Create and Configure API Key"
            icon={<KeyRound size={20} />}
          >
            <p>
              To create API keys, you need an account on{" "}
              <a
                href="https://www.kucoin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-300 underline"
              >
                https://www.kucoin.com
              </a>
              .
            </p>

            <p>If needed, click the Sign Up button and create your account.</p>

            <p>
              After logging in, open your account menu and click API Management.
            </p>

            <p>On the new page, click Create API.</p>

            <p>Specify a name for the new API key and create an API passphrase.</p>

            <p>Enable permission for Spot Trading.</p>

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                Do not add Withdrawal to the key parameters.
              </span>
            </div>

            <p>
              Choose Restrict to Trusted IPs Only and add the following IP
              addresses.
            </p>

            <div className="rounded-2xl bg-[#020817] border border-rose-500/10 p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-white font-semibold">
                  Trusted IP Addresses
                </h3>

                <button
                  onClick={copyIps}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold hover:scale-105 transition"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>

              <div className="font-mono text-rose-300 space-y-2">
                {trustedIps.map((ip) => (
                  <p key={ip}>{ip}</p>
                ))}
              </div>
            </div>

            <p>Click the Add button after entering the IP addresses.</p>
          </Step>

          <Step
            step="STEP 2"
            title="Complete Verification"
            icon={<ShieldCheck size={20} />}
          >
            <p>Now complete the security verification process.</p>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 space-y-3">
              {[
                "Enter your trading password",
                "Enter your Google Authenticator code",
                "Click Confirm",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-rose-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>
              After confirmation, your API key will be generated automatically.
            </p>
          </Step>

          <Step
            step="STEP 3"
            title="Save API Credentials"
            icon={<Lock size={20} />}
          >
            <p>Copy your API Key and Secret Key.</p>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                The Secret Key is shown only once. Save it securely for future
                use.
              </span>
            </div>
          </Step>

          <Step
            step="STEP 4"
            title="Add the Key to Your Platform Account"
            icon={<ArrowRight size={20} />}
          >
            <p>
              Use the + ADD NEW KEY button in Account &gt; Exchange Accounts.
            </p>

            <p>Select KuCoin from the exchange list.</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              {[
                "API Key from KuCoin",
                "Secret Key from KuCoin",
                "API Passphrase",
                "Description",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-rose-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>Click Add New Key to finish setup.</p>

            <p>
              Once added, the key will appear in Exchange Accounts and you can
              start trading.
            </p>
          </Step>

          <Step
            step="IMPORTANT"
            title="Funds Must Be in Trading Account"
            icon={<Wallet size={20} />}
          >
            <p>
              To trade on the platform, your funds must be located in the
              Trading Account on KuCoin exchange.
            </p>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-200 flex gap-3">
              <ShieldCheck size={18} className="mt-1 shrink-0" />
              <span>
                Move funds to your Trading Account before starting live trades.
              </span>
            </div>
          </Step>
        </Container>
      </section>

      {/* CTA */}
      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-rose-500/20 shadow-[0_0_60px_rgba(244,63,94,0.12)]">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect KuCoin?
            </h2>

            <p className="text-slate-400 text-lg mt-4">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => window.open("https://www.kucoin.com", "_blank")}
                className="px-6 py-3 rounded-xl bg-rose-500 text-white font-semibold hover:scale-105 transition"
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