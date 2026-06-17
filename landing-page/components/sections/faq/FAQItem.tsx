"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen((p) => !p)}
      className={`group w-full transition-all duration-300 cursor-pointer rounded-2xl border ${isOpen
        ? "bg-white/10 border-white/20 p-6"
        : "bg-white/5 border-white/10 px-6 py-3 hover:bg-white/[0.08] hover:border-white/20"
        }`}
    >
      {/* Question row */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="desc-size text-white! m-0 font-normal text-left flex-1 min-w-0">
          {question}
        </h3>

        {/* +/× icon */}
        {/* + / × icon */}
        <div
          className={`w-8 h-8 rounded-full bg-white border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"
            }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="7"
              y1="1"
              x2="7"
              y2="13"
              stroke="black"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <line
              x1="1"
              y1="7"
              x2="13"
              y2="7"
              stroke="black"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Answer content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <p className="font-hoves font-light text-base text-[#c7ccd2] leading-relaxed pb-2">
          {answer}
        </p>
      </div>
    </div>
  );
}
