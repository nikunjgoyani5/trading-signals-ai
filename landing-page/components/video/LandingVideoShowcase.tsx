"use client";

/**
 * Reference layout for two `AutoPlayVideo` instances. Wrap the app (or route subtree)
 * with `VideoAutoplayProvider` — see `app/layout.tsx`.
 *
 * Swap the sample URLs for files in `/public/videos/...` in production.
 */
import { AutoPlayVideo } from "./AutoPlayVideo";
import Container from "@/components/common/container/Container";

export function LandingVideoShowcase() {
  return (
    <>
      <section
        aria-label="Product demo video"
        className="relative w-full bg-[#010B24] py-16 md:py-24"
      >
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Hero video
            </h2>
            <p className="mt-3 text-sm text-white/70 md:text-base">
              Autoplays when roughly half of this block is visible, muted for
              browser policy compliance.
            </p>
            <AutoPlayVideo
              videoId="showcase-hero"
              className="mt-8 w-full rounded-2xl border border-white/10 bg-black/40 object-cover shadow-2xl shadow-cyan-500/10 aspect-video"
              containerClassName="mt-8"
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              poster=""
            />
          </div>
        </Container>
      </section>

      <section
        aria-label="Secondary demo video"
        className="relative w-full bg-[#020617] py-16 md:py-24"
      >
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Bottom section video
            </h2>
            <p className="mt-3 text-sm text-white/70 md:text-base">
              Scrolling here pauses the hero clip - only one video plays at a
              time.
            </p>
            <AutoPlayVideo
              videoId="showcase-bottom"
              className="mt-8 w-full rounded-2xl border border-white/10 bg-black/40 object-cover shadow-2xl shadow-indigo-500/10 aspect-video"
              containerClassName="mt-8"
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              poster=""
            />
          </div>
        </Container>
      </section>
    </>
  );
}
