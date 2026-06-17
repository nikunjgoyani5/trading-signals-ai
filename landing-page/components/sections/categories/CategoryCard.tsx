"use client";

interface CategoryCardProps {
  title: string;
  description: string;
  tags: string[];
  index: number;
}

export default function CategoryCard({ title, description, tags, index }: CategoryCardProps) {
  return (
    <div className="relative rounded-[10px] p-5 3xl:p-6 w-full h-full min-h-[170px] border border-tealish-blue/70 bg-gradient-to-br from-[#0b173699] to-[#0a112499] backdrop-blur-md overflow-hidden">
      
      {/* REMOVED: Glass Shine Sweep div 
          REMOVED: transition-colors and group-hover classes
      */}

      <div className="relative z-10 flex flex-col h-full gap-5 3xl:gap-6.25">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-base 3xl:text-xl text-white leading-tight font-hoves">
            {title}
          </h3>
          <p className="text-sm 3xl:text-base font-normal text-white/65 leading-tight font-hoves">
            {description}
          </p>
        </div>

        {/* <div className="flex-1" /> */}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 3xl:px-3.5 py-1 rounded-full text-[11px] 3xl:text-sm bg-white/12 text-white font-light tracking-wide font-hoves"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}