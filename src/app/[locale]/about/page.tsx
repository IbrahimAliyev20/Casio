import Container from "@/components/shared/container";
import { getAbout } from "@/services/about/api";
import Image from "next/image";

export default async function AboutPage() {
  const data = await getAbout();

  const aboutData = data?.data;

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Məlumat tapılmadı...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px]">
        {aboutData.image ? (
          <Image
            src={aboutData.image}
            alt="About page background"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      <Container className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: aboutData.description || "" }}
        />
      </Container>
    </div>
  );
}