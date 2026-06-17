import BlogDetailPage from "@/components/Blogs/BlogDetailPage";
import Container from "@/components/common/container/Container";
import NoiseOverlay from "@/components/NoiseOverlay";
import StartToday from "@/components/sections/starttoday/Starttoday";

const BlogDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  return (
    <div className="bg-[#010B24] lg:mt-24 mt-10 ">
      <NoiseOverlay />
      {/* We pass the slug to the BlogDetailPage component */}
      <Container className="max-w-3xl! xl:max-w-6xl!">

        <BlogDetailPage />
      </Container>
        <StartToday />
    </div>
  );
};

export default BlogDetails;
