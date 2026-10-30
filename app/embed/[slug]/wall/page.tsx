import prisma from "@/lib/prisma";
import WallOfLoveCard from "@/components/widgets/WallOfLoveCard";
import Script from "next/script";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string; featured?: string }>;
}

export default async function EmbedWallPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { theme = "dark", featured = "false" } = await searchParams;

  const space = await prisma.space.findUnique({
    where: { slug },
    include: {
      testimonials: {
        where: {
          isApproved: true,
          ...(featured === "true" ? { isFeatured: true } : {}),
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!space) {
    return (
      <div className="p-8 text-center text-slate-400">
        Space "{slug}" not found.
      </div>
    );
  }

  const isDark = theme === "dark" || space.theme === "dark";

  return (
    <div
      id="testimonial-wall-container"
      className={`min-h-screen p-4 sm:p-6 transition-colors ${
        isDark ? "bg-[#0B0F19] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Dynamic postMessage script to auto-size parent iframe */}
      <Script id="auto-resize-iframe" strategy="afterInteractive">
        {`
          function sendHeight() {
            var h = document.getElementById('testimonial-wall-container')?.scrollHeight || document.body.scrollHeight;
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'TESTIMONIAL_RESIZE', height: h, space: '${space.slug}' }, '*');
            }
          }
          window.addEventListener('load', sendHeight);
          window.addEventListener('resize', sendHeight);
          setTimeout(sendHeight, 500);
          setTimeout(sendHeight, 1500);
        `}
      </Script>

      <div className="mx-auto max-w-7xl">
        {/* Testimonials Masonry Grid */}
        <div className="masonry-columns-1 sm:masonry-columns-2 lg:masonry-columns-3">
          {space.testimonials.map((t) => (
            <WallOfLoveCard
              key={t.id}
              testimonial={t as any}
              theme={isDark ? "dark" : "light"}
              primaryColor={space.primaryColor || "#5D5FEF"}
            />
          ))}
        </div>

        {space.testimonials.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            No testimonials published yet.
          </div>
        )}
      </div>
    </div>
  );
}
