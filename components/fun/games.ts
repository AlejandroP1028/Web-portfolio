// The Fun page: games I play, each with its screenshots, plus games I've made.
// Excerpts are in Alejandro's words; `TODO` marks ones he hasn't written yet.

export type Game = {
  slug: string; // also the image prefix in public/fun: <slug>-1.webp, <slug>-2.webp…
  name: string;
  shots: number; // how many screenshots
  alt: string[]; // one per screenshot
  status: "playing" | "played";
  tag?: string; // a short fact, handwritten next to the name
  excerpt: string;
  link?: { label: string; href: string };
};

export const GAMES: Game[] = [
  {
    slug: "control",
    name: "Control Resonant",
    shots: 5,
    alt: [
      "A giant stone face pushing out of a wall of floating debris",
      "A figure in a long coat facing a glowing ring of light",
      "A creature hunched in a ruined street under a beam of light",
      "The same ring of light, closer",
      "A pixel-art fight: Dylan and Jesse against three rats",
    ],
    status: "playing",
    tag: "peak",
    excerpt:
      "Control Resonant is so peak. The combat, the story, THE MUSIC (oh gosh, the music) and THE WORLD. The traversal is so well done, and so is the way it plays with the beautiful world Remedy built. Kudos to the Remedy team. So good.",
  },
  {
    slug: "tft",
    name: "TFT",
    shots: 2,
    alt: ["A Teamfight Tactics board mid-fight", "A Teamfight Tactics board between rounds"],
    status: "playing",
    tag: "Masters",
    excerpt: "I've played TFT since Set 1. I came over from League, and TFT has been a good retirement from it.",
    link: { label: "My profile on tactics.tools", href: "https://tactics.tools/player/sg/KingGrim/KGrim" },
  },
  {
    slug: "crimson",
    name: "Crimson Desert",
    shots: 4,
    alt: [
      "Riding a horse down a grassy track toward a hilltop castle",
      "A rider on a wooden bridge looking out over a valley",
      "A red-armoured fighter above a village in the hills",
      "An armoured warrior with a spear",
    ],
    status: "played",
    excerpt: "Crimson Desert is everything I liked from other open-world action games in one. The graphics are insane, the gameplay is insane, the story is meh.",
  },
  {
    slug: "clair",
    name: "Clair Obscur: Expedition 33",
    shots: 1,
    alt: ["A man in a suit looking out over a city with broken towers"],
    status: "played",
    excerpt: "Clair Obscur is so good. The story, the gameplay, the graphics, the music and the worldbuilding. SO GOOOD.",
  },
  {
    slug: "wukong",
    name: "Black Myth: Wukong",
    shots: 2,
    alt: ["A lone figure under a twisted tree in a canyon", "A painted scene of a red-haired figure"],
    status: "played",
    excerpt: "Wukong is peak.",
  },
  {
    slug: "zero-company",
    name: "Star Wars Zero Company",
    shots: 2,
    alt: ["Walking through a purple alien forest", "Two officers talking in front of a holo map"],
    status: "played",
    excerpt:
      "I had high hopes for this one. As an XCOM veteran, a Star Wars XCOM-like is something I didn't expect, and damn is it welcome. I didn't expect the story to be this good, but it is. The characters and the team building are really good too, and they set it apart from XCOM 2 and games like it. The fantasy of playing as different characters from Star Wars is here and well done. Star Wars XCOM is peak.",
  },
  {
    slug: "fish",
    name: "How to Fish",
    shots: 1,
    alt: ["A cosy wooden shop with a fish on the counter"],
    status: "played",
    excerpt: "All in sa pula.",
  },
];

export const MADE = [
  {
    name: "Tic-tac-toe",
    img: "tic-tac-toe",
    alt: "Alejandro's Tic-Tac-Toe: pick a board size, start a game or join one with a room code",
    excerpt: "Any board size, and you can play a friend online with a room code. Built with Next.js and GSAP.",
    links: [
      { label: "Play it", href: "https://tic-tac-test.vercel.app" },
      { label: "Code on GitHub", href: "https://github.com/AlejandroP1028/Tic-tac-toe" },
    ],
  },
];
