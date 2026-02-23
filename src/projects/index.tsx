import clsx from "clsx";
import {
  ArrowUpRight,
  Brush,
  CheckSquare,
  Clock3,
  Coins,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Type,
} from "lucide-react";
import { Link } from "react-router-dom";

export const ProjectsIndex = () => {
  const projects = [
    {
      name: "Color Picker",
      path: "/color-picker",
      description: "Explore and pick colors with instant visual feedback.",
      tags: ["UI", "State"],
      icon: Palette,
    },
    {
      name: "Currency Converter",
      path: "/currency-converter",
      description: "Convert values between currencies with a simple workflow.",
      tags: ["Forms", "Logic"],
      icon: Coins,
    },
    {
      name: "Fruit Search Bar",
      path: "/fruit-search-bar",
      description: "Filter and discover items in a responsive search experience.",
      tags: ["Search", "UX"],
      icon: Search,
    },
    {
      name: "Mood Board",
      path: "/mood-board",
      description: "Curate visual ideas into a clean and playful board layout.",
      tags: ["Layout", "Creativity"],
      icon: Brush,
    },
    {
      name: "OTP Generator",
      path: "/otp-generator",
      description: "Generate one-time passcodes with lightweight controls.",
      tags: ["Security", "Utility"],
      icon: ShieldCheck,
    },
    {
      name: "RSVP Event Form",
      path: "/rsvp-event-form",
      description: "Collect event responses through a structured form flow.",
      tags: ["Forms", "Validation"],
      icon: Type,
    },
    {
      name: "Shopping List",
      path: "/shopping-list",
      description: "Track items and stay organized with list interactions.",
      tags: ["CRUD", "Productivity"],
      icon: CheckSquare,
    },
    {
      name: "Tic Tac Toe",
      path: "/tic-tac-toe",
      description: "Classic two-player game with turn and win state handling.",
      tags: ["Game", "State"],
      icon: Sparkles,
    },
    {
      name: "Watch",
      path: "/watch",
      description: "A time-focused mini app built around live updates.",
      tags: ["Time", "Realtime"],
      icon: Clock3,
    },
  ];

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] text-[#c3c9ff]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="border-b border-[#2e3668] bg-[#ff1b8d] px-4 py-2 text-center font-mono text-xs text-[#1b0a22] sm:text-sm">
        Portfolio in progress: UI revamp across all mini projects
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[#2e3668] bg-[#0b1130cc] p-6 shadow-[0_30px_100px_rgba(2,6,23,0.8)] backdrop-blur sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <div className="rounded-2xl border border-[#283266] bg-[#0a0f2c] p-5">
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-[#6d7ad0]">Projects</p>
              <p className="mt-2 text-6xl font-semibold leading-none text-[#cc62ff]">{projects.length}</p>
              <p className="mt-5 font-mono text-sm uppercase tracking-[0.18em] text-[#6d7ad0]">Stack</p>
              <p className="mt-1 text-3xl font-semibold leading-none text-[#cc62ff]">React</p>
              <p className="mt-6 text-xs text-[#8993d6]">Single repo, multiple mini-app routes.</p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
                  React Mini Projects
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#ffffff] drop-shadow-[0_0_22px_rgba(148,163,255,0.28)] sm:text-5xl">
                  Portfolio Playground
                </h1>
                <p className="mt-3 max-w-3xl text-base text-[#99a4e6]">
                  A consolidated collection of hands-on React exercises, now organized as one portfolio-style
                  experience.
                </p>
              </div>

              <div className="rounded-2xl border border-[#273164] bg-[#0b1236] p-4">
                <div className="h-44 w-full overflow-hidden rounded-xl border border-[#2d3a75] bg-[linear-gradient(180deg,rgba(18,28,78,0.55),rgba(14,20,56,0.25))] p-3">
                  <div className="relative h-full w-full rounded-lg border border-[#2f3f85]">
                    <div className="absolute inset-0 opacity-40 [background:linear-gradient(rgba(75,95,192,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(75,95,192,0.28)_1px,transparent_1px)] [background-size:43px_35px]" />
                    <div className="absolute inset-x-0 top-[36%] h-[2px] bg-gradient-to-r from-transparent via-[#ff329d] to-transparent" />
                    <div className="absolute inset-x-0 top-[56%] h-[2px] bg-gradient-to-r from-transparent via-[#7f94ff] to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 h-10 rounded-full bg-[radial-gradient(circle,rgba(88,106,203,0.16),transparent_65%)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <Link
                key={project.path}
                to={project.path}
                className={clsx(
                  "group rounded-2xl border border-[#2e3668] bg-[#0b1130d4] p-5",
                  "shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-300",
                  "hover:-translate-y-1 hover:border-[#ff329d55] hover:bg-[#101944]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff329d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060816]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl border border-[#4ac5ff40] bg-[#4ac5ff1a] p-2.5 text-[#55cfff]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-[#7d89d5] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#ff5ab0]" />
                </div>

                <h2 className="mt-4 text-2xl font-medium text-[#ecf0ff]">{project.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#9aa6ea]">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#303a70] bg-[#141d48] px-2.5 py-1 text-xs font-medium text-[#a8b4f0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </section>

        <p className="mt-8 text-center font-mono text-xs tracking-wide text-[#7d89d5]">
          Pick a card to open the mini project.
        </p>
      </div>
    </main>
  );
};
