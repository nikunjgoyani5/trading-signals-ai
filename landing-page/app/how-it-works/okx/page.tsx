"use client";

import { motion } from "framer-motion";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Wallet,
} from "lucide-react";
import Container from "@/components/common/container/Container";

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
        <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] text-amber-300 font-semibold">
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

export default function OkxHowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#020813] text-white font-hoves lg:mt-24 mt-10">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.10),transparent_20%),linear-gradient(180deg,#020813_0%,#06111f_55%,#01050b_100%)]" />

      {/* Hero */}
      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-amber-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for OKX
          </h1>

          <p className="text-slate-400 text-lg leading-8 mt-5 max-w-3xl mx-auto">
            Securely connect your OKX account to the platform in a few guided
            steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => window.open("https://www.okx.com", "_blank")}
              className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:scale-105 transition"
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
            title="Open API Keys Section"
            icon={<ShieldCheck size={20} />}
          >
            <p>
              Go to the official OKX website at{" "}
              <a
                href="https://www.okx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline"
              >
                https://www.okx.com
              </a>
              .
            </p>

            <p>Log in to your account.</p>
            <p>
              Click your profile icon in the upper-right corner and choose API
              Keys.
            </p>
          </Step>

          <Step
            step="STEP 2"
            title="Create New API Key"
            icon={<KeyRound size={20} />}
          >
            <p>Click the Create APIs button.</p>
            <p>A form window will open for configuration.</p>
          </Step>

          <Step
            step="STEP 3"
            title="Fill API Key Details"
            icon={<Lock size={20} />}
          >
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 space-y-3">
              {[
                "API Name - Enter any name for the key",
                "Purpose - Select API Trading",
                "Permissions - Enable Trade",
                "Passphrase - Create a 6 to 32 character passphrase",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-amber-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>After completing all fields, click Submit.</p>
          </Step>

          <Step
            step="STEP 4"
            title="Complete Security Verification"
            icon={<ShieldCheck size={20} />}
          >
            <p>
              Confirm the operation using the authentication methods connected
              to your account.
            </p>
          </Step>

          <Step
            step="STEP 5"
            title="Save API Information"
            icon={<Lock size={20} />}
          >
            <p>
              Copy the API information and save it in a secure place, then
              confirm the creation in the open window.
            </p>

            <p>
              The key will also appear in the table below. Click View to access
              all required integration details.
            </p>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                Save your Secret Key and Passphrase carefully. They are required
                for integration.
              </span>
            </div>
          </Step>

          <Step
            step="STEP 6"
            title="Connect API Key to the Platform"
            icon={<ArrowRight size={20} />}
          >
            <p>Open the platform and go to Account - Exchange Accounts.</p>
            <p>Click ADD NEW KEY.</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              {[
                "Choose OKX exchange",
                "Enter API Key",
                "Enter Secret Key",
                "Enter Passphrase",
                "Enter Key Name",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-amber-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>Click Add New Key to complete setup.</p>

            <p>
              After a few seconds, the key will be added and visible in the same
              section.
            </p>
          </Step>

          <Step
            step="STEP 7"
            title="Transfer Funds for Trading"
            icon={<Wallet size={20} />}
          >
            <p>
              After you transfer funds to OKX, they will first appear in your
              Funding Account.
            </p>

            <p>
              To begin trading, transfer the funds from Funding Account to
              Trading Account.
            </p>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200 flex gap-3">
              <ShieldCheck size={18} className="mt-1 shrink-0" />
              <span>
                Once funds are moved to Trading Account, you can start trading.
              </span>
            </div>
          </Step>
        </Container>
      </section>

      {/* CTA */}
      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-amber-500/20 shadow-[0_0_60px_rgba(245,158,11,0.12)]">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect OKX?
            </h2>

            <p className="text-slate-400 text-lg mt-4">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => window.open("https://www.okx.com", "_blank")}
                className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:scale-105 transition"
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