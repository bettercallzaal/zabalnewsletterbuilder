export type IssueStatus = "next" | "queued" | "draft" | "shipped";

export interface Issue {
  n: number;
  theme: string;
  status: IssueStatus;
  wins: string[];
  need: string;
}

// The daily-3 sequence. Source: Doc 930 (daily newsletter loop),
// wins from Doc 928 (Q2 big wins) + Doc 929 (full limb map).
export const issues: Issue[] = [
  {
    n: 1,
    theme: "The Machine",
    status: "next",
    wins: [
      "ZOE became the autonomous loop that runs The ZAO",
      "The agent fleet came online (Pi + VPS + self-improving site)",
      "10 bots folded into 1 orchestrator (rated 16/60 to delete)",
    ],
    need: "a screenshot of the fleet dashboard or ZOE opening a PR",
  },
  {
    n: 2,
    theme: "Music Everywhere",
    status: "draft",
    wins: [
      "WaveWarZ went multi-chain: 1,156 battles, Base contracts, mobile, tracker",
      "The clean-water borehole: ~$600 with PolyRaiders + COC",
      "ZOL went live on Farcaster, casting for free",
    ],
    need: "best battle clip + the wavewarz.info dashboard",
  },
  {
    n: 3,
    theme: "Builders",
    status: "draft",
    wins: [
      "ZABAL Games launched as a 3-month program",
      "Won FarHack with zlank (Snaps track)",
      "12 mentors said yes",
    ],
    need: "zlank.online + the FarHack result + the ZABAL Games magnet link",
  },
  {
    n: 4,
    theme: "Money and Culture",
    status: "draft",
    wins: [
      "ZAO Fund closed #2 of all Artizen funds (~$192k, 32 projects)",
      "Empire Builder V3 live integration",
      "Impact Concerts + the fund's grantees",
    ],
    need: "the Artizen fund page + a screenshot of the #2 rank",
  },
  {
    n: 5,
    theme: "The Room",
    status: "draft",
    wins: [
      "ZAOstock venue locked under $1k for Oct 3",
      "DevCon India housing for 160",
      "Zaoville set for July",
    ],
    need: "the ZAOstock event/venue page or flyer",
  },
  {
    n: 6,
    theme: "The Lab",
    status: "draft",
    wins: [
      "15 repos spun out of the lab",
      "spacetovideo: the recap-video engine",
      "channelz, built same-day by an autonomous agent",
    ],
    need: "live URLs: zlank.online, channelz, wwtracker",
  },
  {
    n: 7,
    theme: "IRL",
    status: "draft",
    wins: [
      "The Rochester trip",
      "A music video with GodclouD (COC Concertz 5)",
      "DJed a set for COC Concertz 6",
    ],
    need: "Rochester photos + the COC music video link",
  },
  {
    n: 8,
    theme: "The People",
    status: "draft",
    wins: [
      "Joseph Goats, Chikodi, attabotty joined",
      "Partnerships got real (Wide, Bonfires, MPC, Fellenz)",
      "The relationship ledger grew 40+",
    ],
    need: "handles to tag for each person credited",
  },
  {
    n: 9,
    theme: "The Foundation",
    status: "draft",
    wins: [
      "Fractal Mondays hit 100 weeks",
      "Bonfire became our memory graph",
      "Research went daily + the code got hardened",
    ],
    need: "nothing, this one is all internal",
  },
];
