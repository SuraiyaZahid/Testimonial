import prisma from "@/lib/prisma";
import { Star } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string }>;
}

export default async function EmbedBadgePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { theme = "dark" } = await searchParams;

  const space = await prisma.space.findUnique({
    where: { slug },
    include: {
      testimonials: {
        where: { isApproved: true },
        take: 4,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!space) return null;

  const isDark = theme === "dark" || space.theme === "dark";

  return (
    <div className="flex items-center justify-center p-2">
      <div
        className={`inline-flex items-center gap-3 rounded-full py-1.5 px-4 shadow-lg border transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Avatars stack */}
        <div className="flex -space-x-2 overflow-hidden">
          {space.testimonials.map((t) => (
            <img
              key={t.id}
              src={
                t.authorAvatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  t.authorName
                )}&backgroundColor=5d5fef`
              }
              alt={t.authorName}
              className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
            />
          ))}
        </div>

        {/* Rating and Text */}
        <div className="flex flex-col">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold ml-1.5">5.0</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Loved by fast-growing teams
          </span>
        </div>
      </div>
    </div>
  );
}

