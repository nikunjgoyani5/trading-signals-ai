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
  "Enable Trading permission for Spot.",
  "Enable Read access for secure syncing.",
  "Never enable Withdrawal permission for account safety.",
  "Bind only trusted IP addresses to restrict access.",
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
        <div className="h-12 w-12 rounded-2xl bg-violet-400/15 border border-violet-400/20 flex items-center justify-center text-violet-300">
          {icon}
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] text-violet-300 font-semibold">
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

export default function BitgetApiSetupPage() {
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
    <main className="min-h-screen bg-[#050312] text-white lg:mt-24 mt-10 font-hoves">
      {/* background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.14),transparent_20%),linear-gradient(180deg,#050312_0%,#0b0820_50%,#02010a_100%)]" />

      {/* hero */}
      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-violet-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for Bitget Spot Exchange
          </h1>

          <p className="text-slate-400 text-lg mt-5 max-w-2xl mx-auto leading-8">
            Securely connect your Bitget Spot account to the platform in a few
            guided steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() =>
                window.open("https://www.bitget.com", "_blank")
              }
              className="px-6 py-3 rounded-xl bg-violet-400 text-white font-semibold hover:scale-105 transition"
            >
              Join Now
            </button>
          </div>
        </Container>
      </section>

      {/* intro */}
      <section className="pb-6">
        <Container>
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-5">
              How to create API keys for Bitget Spot Exchange?
            </h2>

            <div className="space-y-4 text-slate-300 leading-8">
              <p>
                To create an API key on Bitget, you need an account on{" "}
                <a
                  href="https://www.bitget.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-300 underline hover:text-violet-200 transition"
                >
                  https://www.bitget.com
                </a>
                .
              </p>

              <p>
                Log in to your account or register if you don’t have one yet.
              </p>

              <p>
                Then follow the steps below to generate and connect your secure
                API key.
              </p>
            </div>
          </Card>
        </Container>
      </section>

      {/* steps */}
      <section className="py-6">
        <Container className="space-y-10">
          <Section
            step="STEP 1"
            title="Login to Your Bitget Account"
            icon={<ShieldCheck size={20} />}
          >
            <p>Open the Bitget website and sign in to your account.</p>
            <p>
              If you are a new user, complete the registration process first.
            </p>
          </Section>

          <Section
            step="STEP 2"
            title="Open API Management"
            icon={<KeyRound size={20} />}
          >
            <p>Click your profile icon in the top-right corner.</p>
            <p>Select “API Keys” from the dropdown menu.</p>
            <p>Click “Create API Key” to continue.</p>
          </Section>

          <Section
            step="STEP 3"
            title="Create New API Key"
            icon={<KeyRound size={20} />}
          >
            <p>Select “System-Generated API Key”.</p>
            <p>Enter a Note to identify this key later.</p>
            <p>Create your API Passphrase for additional security.</p>
            <p>Choose the “Read & Trade” permission option.</p>
          </Section>

          <Section
            step="SECURITY"
            title="Trusted IP + Permissions"
            icon={<Network size={20} />}
          >
            <div className="rounded-2xl bg-[#12081f] border border-violet-400/10 p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-white font-semibold">
                  Add Trusted IP Addresses
                </h3>

                <button
                  onClick={copyIps}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-400 text-white font-semibold hover:scale-105 transition"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>

              <div className="font-mono text-violet-300 space-y-2">
                {trustedIps.map((ip) => (
                  <p key={ip}>{ip}</p>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {permissions.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    className="text-violet-300 mt-1 shrink-0"
                    size={18}
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 text-violet-200">
              Enable Spot Trading and keep Read access enabled.
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                ATTENTION! Never enable Withdrawal permission.
              </span>
            </div>
          </Section>

          <Section
            step="STEP 4"
            title="2FA Verification"
            icon={<ShieldCheck size={20} />}
          >
            <p>Enter verification codes from Google Authenticator.</p>
            <p>Complete Email or SMS verification.</p>
            <p>Click Confirm to finalize API key creation.</p>
          </Section>

          <Section
            step="STEP 5"
            title="Connect Key to Platform"
            icon={<ArrowRight size={20} />}
          >
            <p>Go to Exchange Accounts inside your platform dashboard.</p>
            <p>Click Add New Key.</p>
            <p>Select Bitget from supported exchanges.</p>
            <p>Enter API Key, Secret Key, and API Passphrase.</p>
            <p>Add a label like “Bitget Spot”.</p>
            <p>Click Add New Key to complete setup.</p>
          </Section>
        </Container>
      </section>

      {/* footer cta */}
      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-violet-400/20 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect Bitget?
            </h2>

            <p className="text-slate-400 mt-4 text-lg">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  window.open("https://www.bitget.com", "_blank")
                }
                className="px-6 py-3 rounded-xl bg-violet-400 text-white font-semibold hover:scale-105 transition"
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