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
  Settings,
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
        <div className="h-12 w-12 rounded-2xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-300 shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] text-orange-300 font-semibold">
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

export default function ExmoHowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#020813] text-white font-hoves lg:mt-24 mt-10">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.10),transparent_20%),linear-gradient(180deg,#020813_0%,#06111f_55%,#01050b_100%)]" />

      {/* Hero */}
      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-orange-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for Exmo
          </h1>

          <p className="text-slate-400 text-lg leading-8 mt-5 max-w-3xl mx-auto">
            Securely connect your EXMO account to the platform in a few guided
            steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => window.open("https://exmo.me/en/", "_blank")}
              className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:scale-105 transition"
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
            title="Open Settings and API Section"
            icon={<Settings size={20} />}
          >
            <p>
              To create an API key, you need an account on{" "}
              <a
                href="https://exmo.me/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-300 underline"
              >
                https://exmo.me/en/
              </a>
              .
            </p>

            <p>If needed, use the Sign Up button to create an account.</p>

            <p>
              After logging in, open your account menu and click Settings.
            </p>

            <p>Select the API tab in the menu that opens.</p>
          </Step>

          <Step
            step="STEP 2"
            title="Create New API Key"
            icon={<KeyRound size={20} />}
          >
            <p>Click the Create API Key button.</p>

            <p>
              In the opened window, create a Name for the key, enable Trades
              permission, and click Create.
            </p>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5 space-y-3">
              {["Create Key Name", "Enable Trades Permission", "Click Create"].map(
                (item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <CheckCircle2
                      size={18}
                      className="text-orange-300 mt-1 shrink-0"
                    />
                    <p>{item}</p>
                  </div>
                )
              )}
            </div>
          </Step>

          <Step
            step="STEP 3"
            title="Save Public and Secret Keys"
            icon={<Lock size={20} />}
          >
            <p>Copy the Public Key and Secret Key, then click Ok.</p>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                The Secret Key is shown only once. Copy and store it in a safe
                place.
              </span>
            </div>
          </Step>

          <Step
            step="STEP 4"
            title="Activate the API Key"
            icon={<ShieldCheck size={20} />}
          >
            <p>
              Activate the API key by following the verification link sent to
              your email.
            </p>
          </Step>

          <Step
            step="STEP 5"
            title="Add the Key to Your Platform Account"
            icon={<ArrowRight size={20} />}
          >
            <p>
              Use the + ADD NEW KEY button in Account &gt; Exchange Accounts.
            </p>

            <p>Select EXMO from the exchange list.</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              {[
                "Public Key from EXMO",
                "Secret Key from EXMO",
                "Key Name or Description",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-orange-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>Click Add Key to complete setup.</p>

            <p>
              Once the key is added, it will appear in Exchange Accounts and you
              will be able to start trading.
            </p>
          </Step>

          <Step
            step="IMPORTANT"
            title="Keep Balance in Fiat and Crypto Wallets"
            icon={<Wallet size={20} />}
          >
            <p>
              You need to maintain cryptocurrency balance in the Fiat and Crypto
              wallets on EXMO in order to trade on the platform.
            </p>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-orange-200 flex gap-3">
              <ShieldCheck size={18} className="mt-1 shrink-0" />
              <span>
                Ensure wallet balances are available before starting trades.
              </span>
            </div>
          </Step>
        </Container>
      </section>

      {/* CTA */}
      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-orange-500/20 shadow-[0_0_60px_rgba(249,115,22,0.12)]">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect EXMO?
            </h2>

            <p className="text-slate-400 text-lg mt-4">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => window.open("https://exmo.me/en/", "_blank")}
                className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:scale-105 transition"
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