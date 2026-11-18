// The Learning projects: the index lists them like Agent Pill conversations, and each one
// has its own page. Copy is written from Alejandro's own answers
// (.claude/prototypes/learning-answers.md); keep it in his voice when editing.

export type State = "running" | "done";

export type Shot = { src: string; alt: string; caption: string };
export type Step = { label: string; sub: string };
/** Something a person can do with the project; `chapter` jumps the showcase tour to it. */
export type Feature = { title: string; body: string; chapter?: string };

export type Project = {
  slug: string;
  title: string;
  line: string; // one sentence for the index row
  state: State;
  status?: string; // shown next to the state dot
  when: string;
  stack: string[];
  role?: string;
  award?: string;
  intro: string[]; // what it is
  features?: Feature[];
  why?: string[];
  flow?: Step[]; // how it works, left to right
  flowNote?: string;
  hard?: { title: string; body: string[] };
  extra?: { title: string; body: string[] }[];
  shots?: Shot[];
  phoneShots?: boolean; // the shots are portrait phone screens
  demo?: "showcase" | "bionic";
  links?: { label: string; href: string }[];
  credit?: string;
  org?: string; // Work: the job it belongs to, shown as a group on the Work index
};

export const PROJECTS: Project[] = [
  {
    slug: "agent-pill",
    title: "Agent Pill",
    line: "A pill that floats over every window and shows what Claude Code is doing",
    state: "running",
    status: "in use every day",
    when: "Nov 2026",
    stack: ["Rust", "Tauri 2", "Svelte 5", "TypeScript", "xterm.js"],
    role: "Solo",
    intro: [
      "Every Claude Code conversation gets a small pill that sits on top of every window. It shows whether Claude is thinking, running a tool, waiting for me, or done. Click a pill and that conversation's terminal opens. Click anywhere else and it shrinks back.",
      "It's the real Claude Code inside, so every tool, slash command and prompt works like it does in a normal terminal.",
    ],
    features: [
      { chapter: "states", title: "See every conversation at a glance", body: "Each conversation is a pill that shows what it's doing: thinking, running a tool, waiting for you, or done." },
      { chapter: "panel", title: "Open a terminal with one click", body: "Click a pill and its terminal opens. Click anywhere else and it shrinks back into the pill." },
      { chapter: "permission", title: "Answer Claude without hunting for the window", body: "When Claude needs an answer, its pill pulses instead of popping open, so it never pulls you out of what you're doing." },
      { chapter: "groups", title: "Group pills by project", body: "Drag a pill onto a group and it merges in. Most people group their terminals by project anyway, and here it's one drag." },
      { chapter: "dock", title: "Dock them to the edge", body: "Drop a group on the edge of any screen and its pills shrink into blobs. They still show their state by how they move." },
      { chapter: "themes", title: "Pick a theme", body: "Graphite, Paper, Midnight, Nord, Rosé, Solarized, Candy or High contrast, for the pills, the panel and the terminal." },
      { title: "Keep projects and sessions", body: "Start conversations or plain terminals per project folder, rename them, give them a colour, and resume Claude Code sessions you started somewhere else, with their history." },
      { title: "Work underneath it", body: "It's one see-through window over your screens. Clicks outside the pills go straight through to whatever's under them, and you can hide everything to the notification area." },
    ],
    why: [
      "I kept alt-tabbing out of my terminal or IDE and losing track of what Claude was doing. I wanted something that stays on top of everything but is small enough that it never gets in the way.",
      "Now it's what I work in, instead of my usual terminal and IDE. I keep a group of pills for each project, and I edit Agent Pill's own code from inside an Agent Pill, which is kind of fun.",
    ],
    flow: [
      { label: "Claude Code", sub: "runs in a real terminal, one per conversation" },
      { label: "Hooks", sub: "Claude Code reports each step as it happens" },
      { label: "Rust core", sub: "a small local server turns those into states" },
      { label: "The pill", sub: "Svelte draws the state, the panel and the terminal" },
    ],
    hard: {
      title: "The animations",
      body: [
        "Plain status dots would have worked, but I wanted something I'd actually play with when I'm bored. So pills can be dragged around, merged into groups, and docked to the edge of a screen, where they shrink into blobs that move differently depending on what Claude is doing.",
        "I also tried themes made from different materials with different weights. They were hard to maintain and test, and they didn't fit the style I was going for, so I cut them and kept plain colour themes.",
      ],
    },
    demo: "showcase",
  },
  {
    slug: "rouse",
    title: "Rouse",
    line: "An alarm you can't turn off until you've solved something.",
    state: "running",
    status: "being built",
    when: "since Aug 2026",
    stack: ["React Native", "Expo", "TypeScript", "Zustand"],
    role: "Solo",
    intro: [
      "Each alarm comes with a mission: a math problem, a memory grid, a phrase to type, or shaking the phone. The alarm keeps ringing until it's done. A few minutes later, an optional Wake Check makes sure I didn't just go back to sleep.",
      "It's my first mobile app, and I'm using it to learn React Native, Expo and how Android handles alarms. It's still early, so these are the main screens, not the finished app.",
    ],
    why: [
      "It was inspired by Alarmy. I liked the idea, but I got annoyed by the paywall, so I'm making my own.",
    ],
    phoneShots: true,
    shots: [
      { src: "rouse-alarms", alt: "The alarm list: the next wake-up at 6:30 on a dark card, then three alarms with their missions and toggles", caption: "Alarms" },
      { src: "rouse-edit-alarm", alt: "Editing an alarm: a large 6:30 time picker, repeat days, and rows for label, sound, snooze, mission and Wake Check", caption: "Editing an alarm" },
      { src: "rouse-mission-picker", alt: "Choosing a mission: Math, Memory, Typing and Shake, with a difficulty switch", caption: "Picking a mission" },
      { src: "rouse-math", alt: "The math mission at 6:30: a sum to solve with an on-screen number pad", caption: "Math mission" },
      { src: "rouse-memory-memorise", alt: "The memory mission: five yellow squares lit on a 4 by 4 grid", caption: "Memory: remember the squares" },
      { src: "rouse-memory-recall", alt: "The memory mission: tapping back the squares, 3 of 5 found", caption: "Memory: tap them back" },
      { src: "rouse-wake-check", alt: "Wake Check: \"Still up?\" with a shake-to-confirm bar under a rising sun", caption: "Wake Check" },
    ],
  },
  {
    slug: "academic-performance-predictor",
    title: "Academic Performance Predictor",
    line: "My thesis: does procrastinating show up in your grades?",
    state: "done",
    status: "Best in Thesis",
    when: "Aug 2024 to May 2025",
    stack: ["Next.js", "Flask", "scikit-learn", "Firebase"],
    role: "Built the whole system, team of 3",
    award: "Best in Thesis",
    intro: [
      "There were three of us. We had good grades, and we procrastinated a lot, so we wanted to know if the two were connected.",
      "Students answer a survey about their study habits, mindset and surroundings. Models trained on about 200 of our schoolmates' answers and grades predict their midterm, final and semester grades, and rate how much they procrastinate. Students, professors, the guidance office and the dean each get their own view, with suggested habits for anyone who's struggling.",
      "I built the whole system. My groupmates handled the documentation.",
    ],
    flow: [
      { label: "Survey", sub: "31 questions on habits, mindset and surroundings" },
      { label: "Flask API", sub: "a midterm and a final model for each course" },
      { label: "Firebase", sub: "answers, predictions and suggested habits" },
      { label: "Dashboards", sub: "for students, professors, guidance and the dean" },
    ],
    hard: {
      title: "The models weren't very good, and I can say why",
      body: [
        "The predictions didn't beat guessing the class average by much. We had around 200 students split across five courses, most of them had good grades, and everything came from a self-reported survey, so there wasn't much signal to learn from. In one course, every prediction landed in the same grade band.",
        "If I did it again, I'd collect a few semesters of data, predict a grade band instead of an exact grade, and add things we can measure, like when assignments actually get submitted.",
      ],
    },
    shots: [
      { src: "thesis-student", alt: "A student's dashboard: predicted midterm, final and semester grades, procrastination level and suggested habits", caption: "What a student sees" },
      { src: "thesis-prof", alt: "A professor's dashboard: procrastination levels across their sections", caption: "A professor's sections" },
      { src: "thesis-dean-model", alt: "Model metrics for one course and a chart of actual against predicted grade counts", caption: "The model's real test results" },
    ],
  },
  {
    slug: "bionic-reading",
    title: "Bionic Reading",
    line: "A browser extension that bolds the start of every word",
    state: "done",
    status: "made for myself",
    when: "Jun 2025",
    stack: ["JavaScript", "Chrome extension"],
    role: "Solo",
    intro: [
      "I read an article about the benefits of bionic reading and thought it was interesting enough to test, so I made my own version. It bolds the first part of every word on a page, which is supposed to help your eyes move along faster.",
    ],
    demo: "bionic",
    links: [{ label: "Code on GitHub", href: "https://github.com/AlejandroP1028/Bionic-Reading" }],
  },
  {
    slug: "animation-sandbox",
    title: "Animation Sandbox",
    line: "Where I put animation ideas",
    state: "running",
    status: "keeps growing",
    when: "since May 2026",
    stack: ["Next.js", "GSAP", "Motion", "Tailwind"],
    role: "Solo",
    intro: [
      "It's where I put animation ideas. Each page is its own little playground, like the easing one for comparing curves side by side.",
    ],
    shots: [{ src: "anim-easing", alt: "The easing playground: a curve editor above a grid of shapes moving with the chosen easing", caption: "The easing playground" }],
    links: [
      { label: "Open it", href: "https://animation-projects-flame.vercel.app" },
      { label: "Code on GitHub", href: "https://github.com/AlejandroP1028/animation-projects" },
    ],
  },
];

/** The Work side: projects from jobs, grouped by `org` on the Work index (newest job first). */
export const WORK: Project[] = [
  {
    slug: "seven-gen",
    org: "Seven-Gen",
    title: "Software at Seven-Gen",
    line: "Desktop apps, internal tools and dashboards people use all day",
    state: "running",
    when: "since Oct 2025",
    stack: ["React", "TypeScript", "Electron", "Node", "Python"],
    role: "Junior frontend developer",
    intro: [
      "I build software the company and its customers use every day: desktop apps that run on their own for long stretches, internal tools for staff, and dashboards for customers.",
      "My title is frontend, but the work goes past it: I've also written backend services, background workers and the packaging that ships the desktop apps.",
    ],
    features: [
      { title: "Desktop apps", body: "Apps that run all day without anyone watching them, mostly the screens people use" },
      { title: "Behind the screens", body: "Backend services and background workers, and building and releasing the desktop apps" },
      { title: "Internal tools", body: "Admin consoles and tools staff use to set things up and check work" },
      { title: "Customer dashboards", body: "Report pages with charts you can drill into, on live data" },
      { title: "Working with people", body: "Teams from two developers to a few dozen. On one product I ended up setting the direction for a team of four" },
    ],
  },
  {
    slug: "rtu-queueing-system",
    title: "RTU Queueing System",
    org: "RTU internship",
    line: "A paperless queue for the MIS office at RTU",
    state: "done",
    when: "Mar to Sep 2025",
    stack: ["Next.js", "Socket.IO", "Prisma", "MySQL", "Zustand"],
    role: "Project lead, team of 7",
    intro: [
      "The MIS office at RTU handles documents for everyone on campus: students, teachers, anyone with a request. Instead of standing in line, people take a queue number from their phone. Staff call them to a window, and a board on the wall shows who's being served.",
      "I led the project. I designed the architecture, worked with the office, talked to the people on all three sides (the public, the staff at the windows, and the supervisor) and ran it as the product manager. We were seven interns.",
    ],
    why: [
      "There were two Wi-Fi routers. The one people joined had no internet, only a route to the server with the queue form. We did that on purpose, so nobody could queue from home, and nobody would connect and just hang around the office on free Wi-Fi.",
    ],
    flow: [
      { label: "Phone", sub: "joins the office Wi-Fi, which has no internet" },
      { label: "Queue form", sub: "a short form, then a number" },
      { label: "Socket.IO server", sub: "pushes every change to every screen" },
      { label: "Windows and board", sub: "staff call the next person, the board updates" },
    ],
    hard: {
      title: "Making it make sense to the people using it",
      body: [
        "The hardest part was the interface. Things that seemed obvious to us didn't make sense to the people in line or at the windows. I talked to them, but I also just watched how they moved through the app, and we redesigned around what they actually did.",
      ],
    },
    extra: [
      {
        title: "Where it ended",
        body: [
          "We tested it in the office and it went well. The university didn't fund it, and since we were interns paying our own way, that's where it stopped.",
        ],
      },
    ],
    shots: [
      { src: "rtu-board", alt: "The board on the wall: windows 1 and 2 serving tickets 10 and 9, the waiting numbers listed down the side", caption: "The board on the wall" },
      { src: "rtu-form", alt: "The queue form: choose regular or priority, then who you are", caption: "Taking a number" },
      { src: "rtu-admin", alt: "A staff member's screen: the people waiting for their window", caption: "A window's queue" },
      { src: "rtu-sa-dashboard", alt: "The supervisor's dashboard: today's finished, waiting and cancelled tickets and every window's status", caption: "The supervisor's dashboard" },
    ],
  },
];

export const NOW = ["Rust", "automation pipelines", "backend stuff"];

export type Side = "learning" | "work";
export const listOf = (side: Side) => (side === "work" ? WORK : PROJECTS);
export const bySlug = (slug: string, side: Side = "learning") => listOf(side).find((p) => p.slug === slug);
