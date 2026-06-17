// app/blog/page.tsx  (or pages/blog.tsx if using Pages Router)

import BlogListing from "@/components/Blogs/Bloglisting";
import Container from "@/components/common/container/Container";
import NoiseOverlay from "@/components/NoiseOverlay";
import StartToday from "@/components/sections/starttoday/Starttoday";

export const metadata = {
  title: "Blog",
  description: "Everything you've ever wanted to know about AI-powered trading.",
};



export default function BlogPage() {
  return (
    <main className="bg-[#010B24] min-h-screen flex flex-col lg:mt-24 mt-10 mx-auto font-hoves"
    >
      <NoiseOverlay/>
      <Container className=""
     
      >
        <BlogListing />
      </Container>
      <StartToday />
    </main>
  );
}