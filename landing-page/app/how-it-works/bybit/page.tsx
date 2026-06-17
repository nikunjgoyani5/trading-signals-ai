"use client";

import { motion } from "framer-motion";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Rocket,
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
        <div className="h-12 w-12 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-300 shrink-0">
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

export default function BybitUTAHowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#020813] text-white font-hoves lg:mt-24 mt-10">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.10),transparent_20%),linear-gradient(180deg,#020813_0%,#06111f_55%,#01050b_100%)]" />

      {/* Hero */}
      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="inline-flex px-4 py-1 font-mono rounded-full tracking-widest text-violet-300 text-sm mb-5">
            HOW IT WORKS
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            How to Create API Keys for Bybit UTA
          </h1>

          <p className="text-slate-400 text-lg leading-8 mt-5 max-w-3xl mx-auto">
            Securely connect your Bybit Unified Trading Account to the platform
            in a few guided steps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() =>
                window.open("https://www.bybit.com", "_blank")
              }
              className="px-6 py-3 rounded-xl bg-violet-500 text-white font-semibold hover:scale-105 transition"
            >
              Join Now
            </button>

            {/* <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
              Start Setup
            </button> */}
          </div>
        </Container>
      </section>

      {/* Steps */}
      <section className="py-6 space-y-6">
        <Container className="space-y-10">
          <Step
            step="STEP 1"
            title="Creating an API Key on the Bybit Exchange"
            icon={<KeyRound size={20} />}
          >
            <p>
              If you already have an API key for trading on Bybit UTA, you can
              use this key and proceed to Step 2.
            </p>

            <p>
              In order to create an API key for the exchange, you need to have
              an account at{" "}
              <a
                href="https://www.bybit.com"
                target="_blank"
                className="text-violet-300 underline"
              >
                https://www.bybit.com
              </a>
              .
            </p>

            <p>
              To create an account, click the <b>Sign Up</b> or{" "}
              <b>Create Account</b> button.
            </p>

            <p>
              After you are successfully logged in, find the button of{" "}
              <b>your account</b> and tap the <b>API</b> line.
            </p>

            <p>In the API management tab click the Create New Key button.</p>

            <p>
              In the new window you need to select the API Transaction option,
              then give the key an arbitrary name in the API Key Name field.
            </p>

            <p>
              In the API key permissions it is necessary to specify the Read and
              Write option, and also do not set IP restrictions.
            </p>

            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5 space-y-3">
              <div className="flex gap-3 items-start">
                <CheckCircle2
                  size={18}
                  className="text-violet-300 mt-1 shrink-0"
                />
                <p>Read</p>
              </div>

              <div className="flex gap-3 items-start">
                <CheckCircle2
                  size={18}
                  className="text-violet-300 mt-1 shrink-0"
                />
                <p>Write</p>
              </div>

              <div className="flex gap-3 items-start">
                <CheckCircle2
                  size={18}
                  className="text-violet-300 mt-1 shrink-0"
                />
                <p>Do not set IP restrictions</p>
              </div>
            </div>

            <p>
              In the API key settings, tick the Unified Trading option and make
              sure that the checkboxes for Orders, Positions, USDC Derivatives
              Trading and Trade are also ticked. After that click Submit.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              {[
                "Unified Trading",
                "Orders",
                "Positions",
                "USDC Derivatives Trading",
                "Trade",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={18}
                    className="text-violet-300 mt-1 shrink-0"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <p>
              Next, you will need to enter a security verification code from the
              Google Authenticator app.
            </p>

            <p>
              Then your API key will be successfully added. After copying the
              keys please press the Understood button.
            </p>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200 flex gap-3">
              <AlertTriangle size={18} className="mt-1 shrink-0" />
              <span>
                ATTENTION! The secret key will be shown only once. To use it
                further please save it in the safe folder.
              </span>
            </div>
          </Step>

          <Step
            step="STEP 2"
            title="Add the Key to Your Account"
            icon={<ArrowRight size={20} />}
          >
            <p>
              Use the ADD NEW KEY button in the Account &gt; Exchange Accounts
              section.
            </p>

            <p>
              In the list of available exchanges, select Bybit UTA (Unified
              Trading Account).
            </p>

            <p>
              Select Bybit UTA (Unified Trading Account) from the list of
              available exchanges.
            </p>

            <p>Next, enter the following items in the appropriate fields:</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              {["API key", "Secret key", "Description for the key"].map(
                (item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <CheckCircle2
                      size={18}
                      className="text-violet-300 mt-1 shrink-0"
                    />
                    <p>{item}</p>
                  </div>
                )
              )}
            </div>

            <p>
              After integrating the API key from Bybit UTA exchange, you will
              see two added accounts in the Exchange Accounts section: Bybit
              Spot (spot) and Bybit (futures).
            </p>

            <p>
              You will see a single UTA balance, but you will have 2 keys
              available to trade spot and futures.
            </p>

            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4 text-violet-200 flex gap-3">
              <ShieldCheck size={18} className="mt-1 shrink-0" />
              <span>
                Important! Please note that in order to trade on the platform,
                you need to have available balance on the Bybit exchange.
              </span>
            </div>
          </Step>
        </Container>
      </section>

      {/* CTA */}
      <section className="pt-6 pb-24">
        <Container>
          <Card className="p-8 md:p-12 text-center border-violet-500/20 shadow-[0_0_60px_rgba(139,92,246,0.12)]">
        

            <h2 className="text-3xl md:text-5xl font-semibold">
              Ready to Connect Bybit UTA?
            </h2>

            <p className="text-slate-400 text-lg mt-4">
              Complete your secure setup and start trading with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  window.open("https://www.bybit.com", "_blank")
                }
                className="px-6 py-3 rounded-xl bg-violet-500 text-white font-semibold hover:scale-105 transition"
              >
                Join Now
              </button>

              {/* <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                Go to Dashboard
              </button> */}
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}