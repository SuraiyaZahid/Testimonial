import prisma from "@/lib/prisma";
import WallOfLoveCard from "@/components/widgets/WallOfLoveCard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string }>;
}

export default async function EmbedCarouselPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { theme = "dark" } = await searchParams;

  const space = await prisma.space.findUnique({
    where: { slug },
    include: {
      testimonials: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!space) {
    return <div className="p-8 text-center text-slate-400">Space not found</div>;
  }

  const isDark = theme === "dark" || space.theme === "dark";
  const items = space.testimonials;
  // Duplicate for seamless infinite loop marquee
  const marqueeItems = [...items, ...items];

  return (
    <div
      className={`min-h-[380px] overflow-hidden py-8 transition-colors ${
        isDark ? "bg-[#0B0F19] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="relative flex w-full overflow-hidden">
        <div className="flex animate-marquee-left gap-6 pause-marquee whitespace-nowrap pl-6">
          {marqueeItems.map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="inline-block w-[340px] sm:w-[380px] shrink-0 whitespace-normal"
            >
              <WallOfLoveCard
                testimonial={t as any}
                theme={isDark ? "dark" : "light"}
                primaryColor={space.primaryColor || "#5D5FEF"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

