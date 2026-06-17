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
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] text-emerald-300 font-semibold">
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

export default function BitgetFuturesHowItWorksPage() {
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
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.10),transparent_20%),linear-gradient(180deg,#020813_0%,#06111f_55%,#01050b_100%)]" />

      {/* Hero */}
      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-emerald-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for Bitget Futures Exchange
          </h1>

          <p className="text-slate-400 text-lg leading-8 mt-5 max-w-3xl mx-auto">
            Securely connect your Bitget Futures account to the platform in a few
            guided steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => window.open("https://www.bitget.com", "_blank")}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:scale-105 transition"
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
            title="Login to Your Bitget Account"
            icon={<ShieldCheck size={20} />}
          >
            <p>
              Go to the official Bitget website at{" "}
              <a
                href="https://www.bitget.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline"
              >
                https://www.bitget.com
              </a>
              .
            </p>

            <p>
              Log in to your existing account or register if you do not have one
              yet.
            </p>
          </Step>

          <Step
            step="STEP 2"
            title="Open API Management"
            icon={<KeyRound size={20} />}
          >
            <p>Click on your profile icon in the top-right corner.</p>
            <p>Select the API Keys option from the menu.</p>
          </Step>

          <Step
            step="STEP 3"
            title="Create a New API Key"
            icon={<Lock size={20} />}
          >
            <p>Click on Create API Key.</p>
            <p>Select System-Generated API Key as the key type.</p>
            <p>Enter a Note to identify the key.</p>
            <p>Input your passphrase for extra security.</p>
            <p>
              Under Permission Settings, choose the Read & Trade option.
            </p>
          </Step>

          <Step
            step="STEP 4"
            title="Configure Permissions and Bind IP"
            icon={<Network size={20} />}
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 space-y-3">
              {[
                "Enable Spot Trading",
                "Enable Futures Orders and Holdings",
                "Use Read & Trade access only",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                Never enable Withdrawal permission to protect your account.
              </span>
            </div>

            <div className="rounded-2xl bg-[#020817] border border-emerald-500/10 p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-white font-semibold">
                  Bind Trusted IP Addresses
                </h3>

                <button
                  onClick={copyIps}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:scale-105 transition"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>

              <div className="font-mono text-emerald-300 space-y-2">
                {trustedIps.map((ip) => (
                  <p key={ip}>{ip}</p>
                ))}
              </div>
            </div>
          </Step>

          <Step
            step="STEP 5"
            title="Complete 2FA Verification"
            icon={<ShieldCheck size={20} />}
          >
            <p>Enter verification codes from Google Authenticator.</p>
            <p>Enter the SMS or Email verification code.</p>
            <p>Click Confirm to finalize the API key creation.</p>
          </Step>

          <Step
            step="STEP 6"
            title="Save Your API Credentials"
            icon={<Lock size={20} />}
          >
            <p>After creation, you will receive your API Key and Secret Key.</p>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                Critical. Save these credentials immediately. The Secret Key is
                shown only once and cannot be recovered.
              </span>
            </div>
          </Step>

          <Step
            step="STEP 7"
            title="Connect API Key to the Platform"
            icon={<ArrowRight size={20} />}
          >
            <p>Log in to your account on the platform.</p>
            <p>Go to the Exchange Accounts section.</p>
            <p>Click Add New Key.</p>
            <p>Select Bitget Futures from the supported exchanges list.</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              {[
                "Your API Key",
                "Your Secret Key",
                "API Passphrase",
                "Description",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>Click Add New Key to complete the setup.</p>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200 flex gap-3">
              <ShieldCheck size={18} className="mt-1 shrink-0" />
              <span>
                Done. Your Bitget API is now connected and ready for use.
              </span>
            </div>
          </Step>
        </Container>
      </section>

      {/* CTA */}
      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect Bitget Futures?
            </h2>

            <p className="text-slate-400 text-lg mt-4">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => window.open("https://www.bitget.com", "_blank")}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:scale-105 transition"
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