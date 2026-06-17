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
        <div className="h-12 w-12 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-300 shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] text-blue-300 font-semibold">
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

export default function BitfinexHowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#020813] text-white font-hoves lg:mt-24 mt-10">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.10),transparent_20%),linear-gradient(180deg,#020813_0%,#06111f_55%,#01050b_100%)]" />

      {/* Hero */}
      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-blue-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for Bitfinex
          </h1>

          <p className="text-slate-400 text-lg leading-8 mt-5 max-w-3xl mx-auto">
            Securely connect your Bitfinex account to the platform in a few
            guided steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() =>
                window.open("https://www.bitfinex.com/trading", "_blank")
              }
              className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:scale-105 transition"
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
            title="Create API Key on Bitfinex"
            icon={<KeyRound size={20} />}
          >
            <p>
              To create an API key, you need an account on{" "}
              <a
                href="https://www.bitfinex.com/trading"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline"
              >
                https://www.bitfinex.com/trading
              </a>
              .
            </p>

            <p>If needed, use the Sign Up button to create an account.</p>

            <p>
              After logging in, open the Account menu and select API Keys.
            </p>

            <p>On the new page, choose Create a New Key.</p>

            <p>Enable the following permissions:</p>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5 space-y-3">
              {[
                "Get orders and statuses",
                "Create orders",
                "Cancel orders",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-blue-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>Add a name for the new key and click Generate API Key.</p>

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                Do not add Withdraw to the key parameters.
              </span>
            </div>
          </Step>

          <Step
            step="STEP 2"
            title="Complete Security Verification"
            icon={<ShieldCheck size={20} />}
          >
            <p>Pass verification with your 2FA code.</p>
            <p>Complete verification using your account email.</p>

            <p>
              After confirmation, your API key will be created automatically.
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

            <p>Select Bitfinex from the exchange list.</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              {[
                "API Key from Bitfinex",
                "Secret Key from Bitfinex",
                "Key Name or Description",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-blue-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>Click Add Key to complete setup.</p>

            <p>
              After the key is added, it will appear in the same window and you
              can start trading.
            </p>
          </Step>

          <Step
            step="IMPORTANT"
            title="Keep Balance in Exchange Wallet"
            icon={<Wallet size={20} />}
          >
            <p>
              When trading on the platform, you need to have available balance
              in your Bitfinex exchange wallet.
            </p>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-blue-200 flex gap-3">
              <ShieldCheck size={18} className="mt-1 shrink-0" />
              <span>
                Ensure funds are available in your wallet before trading.
              </span>
            </div>
          </Step>
        </Container>
      </section>

      {/* CTA */}
      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.12)]">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect Bitfinex?
            </h2>

            <p className="text-slate-400 text-lg mt-4">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  window.open("https://www.bitfinex.com/trading", "_blank")
                }
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:scale-105 transition"
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