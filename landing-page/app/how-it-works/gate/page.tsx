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
  Wallet,
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
        <div className="h-12 w-12 rounded-2xl bg-lime-500/15 border border-lime-500/20 flex items-center justify-center text-lime-300 shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] text-lime-300 font-semibold">
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

export default function GateioHowItWorksPage() {
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
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.14),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(163,230,53,0.10),transparent_20%),linear-gradient(180deg,#020813_0%,#06111f_55%,#01050b_100%)]" />

      {/* Hero */}
      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-lime-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for Gateio
          </h1>

          <p className="text-slate-400 text-lg leading-8 mt-5 max-w-3xl mx-auto">
            Securely connect your Gate.io account to the platform in a few
            guided steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => window.open("https://www.gate.io/", "_blank")}
              className="px-6 py-3 rounded-xl bg-lime-500 text-slate-950 font-semibold hover:scale-105 transition"
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
            title="Open API Key Management"
            icon={<KeyRound size={20} />}
          >
            <p>
              To create an API key, you need an account on{" "}
              <a
                href="https://www.gate.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-300 underline"
              >
                https://www.gate.io/
              </a>
              .
            </p>

            <p>If needed, use the Sign Up button to register.</p>

            <p>
              After logging in, click your Account icon and open API Key
              Management.
            </p>
          </Step>

          <Step
            step="STEP 2"
            title="Create New API Key"
            icon={<ShieldCheck size={20} />}
          >
            <p>Click the Create API Key button.</p>
            <p>Select Trading Account as the account type.</p>
          </Step>

          <Step
            step="STEP 3"
            title="Configure Key and IP Permissions"
            icon={<Network size={20} />}
          >
            <p>Enter an API Key Remark.</p>

            <p>
              In the IP Permissions field, add the following trusted IP
              addresses.
            </p>

            <div className="rounded-2xl bg-[#020817] border border-lime-500/10 p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-white font-semibold">
                  Trusted IP Addresses
                </h3>

                <button
                  onClick={copyIps}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 text-slate-950 font-semibold hover:scale-105 transition"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>

              <div className="font-mono text-lime-300 space-y-2">
                {trustedIps.map((ip) => (
                  <p key={ip}>{ip}</p>
                ))}
              </div>
            </div>

            <p>Make sure these options are checked:</p>

            <div className="rounded-2xl border border-lime-500/20 bg-lime-500/10 p-5 space-y-3">
              {["Bind IP", "API v4 Key", "Trading Account"].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-lime-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Step>

          <Step
            step="STEP 4"
            title="Enable Trading Permissions"
            icon={<Lock size={20} />}
          >
            <p>
              Enable Read and Write permissions for the following options:
            </p>

            <div className="rounded-2xl border border-lime-500/20 bg-lime-500/10 p-5 space-y-3">
              {[
                "Spot Trade",
                "Wallet",
                "Margin Trading",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-lime-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>Click Submit after selecting permissions.</p>
          </Step>

          <Step
            step="STEP 5"
            title="Complete Verification"
            icon={<ShieldCheck size={20} />}
          >
            <p>Accept the terms of the Risk Reminder.</p>
            <p>Enter your fund password.</p>
            <p>Enter your 2FA authentication code.</p>
            <p>Click Confirm.</p>
          </Step>

          <Step
            step="STEP 6"
            title="Save API Credentials"
            icon={<Lock size={20} />}
          >
            <p>
              After confirmation, your API Key and Secret Key will be created
              automatically.
            </p>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                Save them securely. The Secret Key is displayed only once.
              </span>
            </div>
          </Step>

          <Step
            step="STEP 7"
            title="Connect Keys to the Platform"
            icon={<ArrowRight size={20} />}
          >
            <p>
              Use the + ADD NEW KEY button in Account &gt; Exchange Accounts.
            </p>

            <p>Select Gateio from the exchange list.</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              {[
                "API Key",
                "Secret Key",
                "Description",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-lime-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>Click Add New Key to finish setup.</p>

            <p>
              After the key is added, it will appear in the same window and you
              can start trading.
            </p>
          </Step>

          <Step
            step="IMPORTANT"
            title="Keep Balance in Spot Account"
            icon={<Wallet size={20} />}
          >
            <p>
              When trading on the platform, you need to have balance in the Spot
              Account of the Gate.io exchange.
            </p>

            <div className="rounded-2xl border border-lime-500/20 bg-lime-500/10 p-4 text-lime-200 flex gap-3">
              <ShieldCheck size={18} className="mt-1 shrink-0" />
              <span>
                Transfer funds to Spot Account before starting trades.
              </span>
            </div>
          </Step>
        </Container>
      </section>

      {/* CTA */}
      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-lime-500/20 shadow-[0_0_60px_rgba(132,204,22,0.12)]">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect Gateio?
            </h2>

            <p className="text-slate-400 text-lg mt-4">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => window.open("https://www.gate.io/", "_blank")}
                className="px-6 py-3 rounded-xl bg-lime-500 text-slate-950 font-semibold hover:scale-105 transition"
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