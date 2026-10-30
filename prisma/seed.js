const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  await prisma.caseStudy.deleteMany();
  await prisma.npsResponse.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.space.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  // Create User
  const user = await prisma.user.create({
    data: {
      id: "usr_alex_rivera",
      email: "alex@techvanguard.io",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Create Workspaces
  const workspace = await prisma.workspace.create({
    data: {
      id: "ws_techvanguard",
      name: "TechVanguard Studio",
      slug: "techvanguard",
      ownerId: user.id,
    },
  });

  // Create Space 1: SupaFlow
  const supaflowSpace = await prisma.space.create({
    data: {
      id: "spc_supaflow",
      name: "SupaFlow - Visual Workflow Builder",
      slug: "supaflow",
      workspaceId: workspace.id,
      customHeader: "SupaFlow Customer Love",
      headerTitle: "Give a shoutout for SupaFlow! 🚀",
      customMessage: "Share how SupaFlow has helped streamline your team's automated workflows. Your story helps others discover what's possible!",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      questions: JSON.stringify([
        "Who are you and what does your team build?",
        "What was your workflow bottleneck before using SupaFlow?",
        "What specific metric or time savings did you achieve?",
        "What would you tell someone considering SupaFlow?"
      ]),
      collectionType: "ALL",
      collectStarRating: true,
      theme: "dark",
      primaryColor: "#5D5FEF",
      thankYouTitle: "You are awesome! 🎉",
      thankYouMessage: "Thank you so much for taking the time to share your experience. Your story inspires our entire team!",
      redirectUrl: "",
      maxVideoDuration: 180,
    },
  });

  // Create Space 2: PulseMetrics
  const pulseMetricsSpace = await prisma.space.create({
    data: {
      id: "spc_pulsemetrics",
      name: "PulseMetrics - Product Analytics",
      slug: "pulsemetrics",
      workspaceId: workspace.id,
      customHeader: "PulseMetrics Reviews",
      headerTitle: "Loved by fast-moving product teams",
      customMessage: "Tell us how real-time behavioral insights have changed the way you build and ship.",
      logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80",
      questions: JSON.stringify([
        "What is your role?",
        "How has PulseMetrics impacted your product roadmap?",
        "What is your favorite dashboard view?"
      ]),
      collectionType: "ALL",
      collectStarRating: true,
      theme: "light",
      primaryColor: "#0284C7",
      thankYouTitle: "Much appreciated! 💙",
      thankYouMessage: "Your review is now stored and will be reviewed shortly.",
      maxVideoDuration: 180,
    },
  });

  // Seed Testimonials for SupaFlow
  const testimonialsData = [
    {
      id: "test_vid_1",
      spaceId: supaflowSpace.id,
      type: "VIDEO",
      rating: 5,
      content: "Before SupaFlow, our growth engineering squad was spending 25+ hours every sprint writing manual cron automations. Within 3 weeks of deploying SupaFlow, we slashed pipeline development time by 70%. It's completely transformed how quickly we can launch growth experiments.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoDuration: 45,
      transcript: "Hey everyone, Sarah Jenkins here, VP of Growth at ScaleLogic. Before SupaFlow, our growth engineering squad was spending 25+ hours every sprint writing manual cron automations. Within 3 weeks of deploying SupaFlow, we slashed pipeline development time by 70%. It's completely transformed how quickly we can launch growth experiments. If you're on the fence, jump in now.",
      authorName: "Sarah Jenkins",
      authorEmail: "sarah@scalelogic.io",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      authorTitle: "VP of Growth @ ScaleLogic",
      authorSocial: "@sarah_scalelogic",
      source: "FORM",
      sentiment: "POSITIVE",
      tags: "Growth, Automation, High ROI",
      isFeatured: true,
      isApproved: true,
    },
    {
      id: "test_vid_2",
      spaceId: supaflowSpace.id,
      type: "VIDEO",
      rating: 5,
      content: "The visual node editor is buttery smooth. We replaced three disparate Zapier subscriptions with one unified SupaFlow workspace. Our entire client onboarding runs hands-free now.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      videoDuration: 38,
      transcript: "Hi, Michael Chen here, founder at DevFlow. The visual node editor is buttery smooth. We replaced three disparate Zapier subscriptions with one unified SupaFlow workspace. Our entire client onboarding runs hands-free now. Customer retention jumped 18% in our first quarter using it.",
      authorName: "Michael Chen",
      authorEmail: "michael@devflow.co",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      authorTitle: "Founder & CEO @ DevFlow",
      authorSocial: "@mchen_dev",
      source: "FORM",
      sentiment: "POSITIVE",
      tags: "Agency, Onboarding, Zapier Alternative",
      isFeatured: true,
      isApproved: true,
    },
    {
      id: "test_text_1",
      spaceId: supaflowSpace.id,
      type: "TEXT",
      rating: 5,
      content: "I've tested virtually every workflow engine on the market over the last 8 years. SupaFlow is the only one that strikes the holy grail of dead-simple UI for non-technical teammates while giving developers robust webhooks and type-safe payloads. Pure engineering craft.",
      videoUrl: null,
      videoDuration: null,
      transcript: null,
      authorName: "David Kim",
      authorEmail: "david@fintechstack.com",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      authorTitle: "CTO @ FinTechStack",
      authorSocial: "@davidkim_tech",
      source: "FORM",
      sentiment: "POSITIVE",
      tags: "Enterprise, Engineering, Webhooks",
      isFeatured: true,
      isApproved: true,
    },
    {
      id: "test_text_2",
      spaceId: supaflowSpace.id,
      type: "TEXT",
      rating: 5,
      content: "Embedding the social proof widgets and combining our event triggers boosted our checkout conversion rate from 3.2% to 4.9%. The ROI was realized on day 4. Can't imagine running campaigns without it.",
      videoUrl: null,
      videoDuration: null,
      transcript: null,
      authorName: "Sophia Martinez",
      authorEmail: "sophia@hypergrowth.agency",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      authorTitle: "Head of Product Marketing @ HyperGrowth",
      authorSocial: "@sophia_growth",
      source: "FORM",
      sentiment: "POSITIVE",
      tags: "Conversion, Marketing, ROI",
      isFeatured: true,
      isApproved: true,
    },
    {
      id: "test_vid_3",
      spaceId: supaflowSpace.id,
      type: "VIDEO",
      rating: 5,
      content: "Customer support is top-tier. When we needed a custom webhook transformation at 11 PM on a Sunday before our ProductHunt launch, their engineering lead replied within 12 minutes.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      videoDuration: 52,
      transcript: "Hey this is Elena Rostova, Lead Architect at CloudMatrix. Customer support is top-tier. When we needed a custom webhook transformation at 11 PM on a Sunday before our ProductHunt launch, their engineering lead replied within 12 minutes. You simply don't get that dedication with legacy enterprise tools.",
      authorName: "Elena Rostova",
      authorEmail: "elena@cloudmatrix.dev",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      authorTitle: "Lead Systems Architect @ CloudMatrix",
      authorSocial: "@elena_cloud",
      source: "FORM",
      sentiment: "POSITIVE",
      tags: "Support, Reliability, Scale",
      isFeatured: true,
      isApproved: true,
    },
    {
      id: "test_social_1",
      spaceId: supaflowSpace.id,
      type: "TEXT",
      rating: 5,
      content: "Switched our entire multi-tenant data sync to @supaflow last week. What used to take our junior engineers 4 days of Python scripts now happens in a 10-minute drag-and-drop canvas. Absolutely game-changing product. ⚡️",
      videoUrl: null,
      videoDuration: null,
      transcript: null,
      authorName: "Liam O'Connor",
      authorEmail: "liam@buildermind.com",
      authorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      authorTitle: "Solo Founder & Indie Hacker",
      authorSocial: "@liam_builds",
      source: "TWITTER",
      sourceUrl: "https://twitter.com/liam_builds/status/1789429482",
      sentiment: "POSITIVE",
      tags: "Twitter, Social Mention, IndieHacker",
      isFeatured: true,
      isApproved: true,
    },
    {
      id: "test_social_2",
      spaceId: supaflowSpace.id,
      type: "TEXT",
      rating: 5,
      content: "Rarely do I make unsolicited SaaS endorsements on LinkedIn, but SupaFlow's reliability has saved our operations team over 15 hours every single week. If your company moves fast, you owe it to yourself to check them out.",
      videoUrl: null,
      videoDuration: null,
      transcript: null,
      authorName: "Amara Okafor",
      authorEmail: "amara@apexglobal.org",
      authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      authorTitle: "Director of Digital Strategy @ Apex Global",
      authorSocial: "linkedin.com/in/amara-okafor",
      source: "LINKEDIN",
      sourceUrl: "https://linkedin.com/feed/update/urn:li:activity:7123984",
      sentiment: "POSITIVE",
      tags: "LinkedIn, Enterprise, Productivity",
      isFeatured: true,
      isApproved: true,
    },
    {
      id: "test_text_3",
      spaceId: supaflowSpace.id,
      type: "TEXT",
      rating: 4,
      content: "Great flexibility, rock-solid uptime. We run over 2 million events per day through our pipelines without a single dropped packet. Would love even more pre-built templates for HubSpot, but the custom HTTP block does the job cleanly.",
      videoUrl: null,
      videoDuration: null,
      transcript: null,
      authorName: "Marcus Vance",
      authorEmail: "marcus@nextwaveops.io",
      authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      authorTitle: "VP of Engineering @ NextWave",
      authorSocial: "@marcus_vance",
      source: "FORM",
      sentiment: "POSITIVE",
      tags: "High Scale, Uptime, API",
      isFeatured: false,
      isApproved: true,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  // Seed NPS Responses (PRD 4.2 NPS Engine)
  const npsData = [
    { spaceId: supaflowSpace.id, score: 10, category: "PROMOTER", feedback: "Best software investment we made this fiscal year.", authorName: "Sarah J.", authorEmail: "sarah@scalelogic.io" },
    { spaceId: supaflowSpace.id, score: 10, category: "PROMOTER", feedback: "Incredible developer UX and zero downtime.", authorName: "Michael C.", authorEmail: "michael@devflow.co" },
    { spaceId: supaflowSpace.id, score: 9, category: "PROMOTER", feedback: "Support response speed is unheard of.", authorName: "David K.", authorEmail: "david@fintechstack.com" },
    { spaceId: supaflowSpace.id, score: 10, category: "PROMOTER", feedback: "Our conversions skyrocketed.", authorName: "Sophia M.", authorEmail: "sophia@hypergrowth.agency" },
    { spaceId: supaflowSpace.id, score: 8, category: "PASSIVE", feedback: "Solid tool, would love more Salesforce triggers.", authorName: "Alex B.", authorEmail: "alex@cloudcorp.com" },
    { spaceId: supaflowSpace.id, score: 7, category: "PASSIVE", feedback: "Works nicely for standard flows.", authorName: "Rachel W.", authorEmail: "rachel@nexora.io" },
    { spaceId: supaflowSpace.id, score: 6, category: "DETRACTOR", feedback: "Steep learning curve on nested conditionals.", authorName: "Ken S.", authorEmail: "ken@legacycode.net" },
  ];

  for (const n of npsData) {
    await prisma.npsResponse.create({ data: n });
  }

  // Seed AI Case Study (PRD 4.4 AI Case Study Generator)
  await prisma.caseStudy.create({
    data: {
      spaceId: supaflowSpace.id,
      title: "How ScaleLogic Reduced Pipeline Delivery Time by 70%",
      summary: "ScaleLogic replaced brittle manual cron scripts with SupaFlow's visual workflow engine, saving 25+ hours per sprint and tripling deployment velocity.",
      clientName: "ScaleLogic (Sarah Jenkins, VP of Growth)",
      metricsHighlight: "70% faster delivery • 25 hrs/sprint saved • 100% test coverage",
      challenge: "ScaleLogic's growth team was burdened with maintaining fragile custom integration scripts. Every new marketing hook required engineer intervention, causing massive backlogs.",
      solution: "Adopted SupaFlow across 8 production growth pipelines, enabling non-technical marketers and developers to collaborate in a single visual canvas with real-time payload debugging.",
      results: "Freed up 25+ engineering hours per sprint, cut turnaround for new growth experiments from 2 weeks to 36 hours, and eliminated manual data sync errors entirely.",
      testimonialIds: "test_vid_1,test_text_2",
    },
  });

  console.log("✅ Seed completed successfully! Workspaces, Spaces, Video & Text Testimonials, NPS, and Case Studies created.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
