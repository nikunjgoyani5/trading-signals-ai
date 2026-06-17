// components/BlogContent.tsx
import type { BlogContentBlock } from "./blog";

interface Props {
  blocks: BlogContentBlock[];
}

export default function BlogContent({ blocks }: Props) {
  return (
    <div className="blog-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className="text-[#c8cdd8] text-[15px] md:text-[17px] xl:text-lg 2xl:text-xl mb-5 md:mb-6 leading-relaxed  text-justify"
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );

          case "heading":
            if (block.level === 2)
              return (
                <h2
                  key={i}
                  className="text-white text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-semibold mt-8 md:mt-10 mb-3 md:mb-4 leading-tight"
                >
                  {block.text}
                </h2>
              );
            if (block.level === 3)
              return (
                <h3
                  key={i}
                  className="text-white text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-semibold mt-6 md:mt-8 mb-2 md:mb-3 leading-tight"
                >
                  {block.text}
                </h3>
              );
            return (
               <h4
                key={i}
                className="text-white text-[17px] md:text-lg xl:text-xl 2xl:text-2xl font-semibold mt-5 md:mt-6 mb-2 leading-tight"
              >
                {block.text}
              </h4>
            );

          case "image":
            return (
              <figure key={i} className="my-6 md:my-8 rounded-xl overflow-hidden bg-[#111827]">
                <img
                  src={block.src}
                  alt={block.alt || "blog image"}
                  className="w-full h-auto max-h-[600px] object-contain md:object-cover"
                />
                {block.caption && (
                  <figcaption className="text-center text-gray-400 text-sm mt-3 mb-2 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "chart":
            return (
              <div
                key={i}
                className="my-8 rounded-xl overflow-hidden border border-white/10"
              >
                {block.component}
              </div>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="my-6 md:my-8 pl-4 md:pl-5 border-l-2 border-blue-500"
              >
                <p className="text-[#c8cdd8] text-[16px] md:text-lg xl:text-xl 2xl:text-2xl italic leading-relaxed mb-2 text-justify">
                  {block.text}
                </p>
                {block.author && (
                  <cite className="text-gray-500 text-sm not-italic">
                    - {block.author}
                  </cite>
                )}
              </blockquote>
            );

          case "list":
            if (block.ordered)
              return (
                <ol
                  key={i}
                  className="list-decimal list-inside text-[#c8cdd8] text-[15px] md:text-[17px] xl:text-lg 2xl:text-xl leading-relaxed md:leading-[1.85] mb-5 md:mb-6 space-y-1.5 md:space-y-2 pl-1 md:pl-2 text-justify"
                >
                  {block.items.map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              );
            return (
              <ul
                key={i}
                className="list-disc list-inside text-[#c8cdd8] text-[15px] md:text-[17px] xl:text-lg 2xl:text-xl leading-relaxed mb-5 md:mb-6 space-y-1.5 md:space-y-2 pl-1 md:pl-2 text-justify"
              >
                {block.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );

          case "divider":
            return (
              <hr
                key={i}
                className="my-10 border-none h-px bg-white/10"
              />
            );

          case "callout":
            const calloutStyles = {
              info: "bg-blue-500/10 border-blue-500/30 text-blue-300",
              warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
              success: "bg-green-500/10 border-green-500/30 text-green-300",
              tip: "bg-purple-500/10 border-purple-500/30 text-purple-300",
            };
            const calloutIcons = {
              info: "ℹ️",
              warning: "⚠️",
              success: "✅",
              tip: "💡",
            };
            return (
              <div
                key={i}
                className={`my-5 md:my-6 flex gap-3 items-start px-4 sm:px-5 py-3 sm:py-4 rounded-xl border ${calloutStyles[block.variant]}`}
              >
                <span className="text-base md:text-lg mt-0.5 shrink-0">
                  {calloutIcons[block.variant]}
                </span>
                <p
                  className="text-[14px] md:text-[15px] xl:text-lg 2xl:text-xl leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}