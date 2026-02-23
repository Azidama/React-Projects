import clsx from "clsx";
import { ArrowUpRight, Brush, CheckSquare, Clock3, Coins, Palette, Search, ShieldCheck, Sparkles, Type } from "lucide-react";
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
    <main className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_58%),radial-gradient(circle_at_30%_30%,_rgba(34,197,94,0.12),_transparent_55%)]" />

      <section className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur sm:p-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="max-w-3xl space-y-3">
            <p className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              React Mini Projects
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
              Portfolio Playground
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              A consolidated collection of hands-on React exercises, now organized as one portfolio-style experience.
            </p>
          </div>
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Projects</p>
              <p className="mt-1 text-2xl font-semibold">{projects.length}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Stack</p>
              <p className="mt-1 text-2xl font-semibold">React</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <Link
              key={project.path}
              to={project.path}
              className={clsx(
                "group rounded-2xl border border-border/70 bg-card p-5 shadow-sm",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2.5 text-sky-700 dark:text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-foreground">{project.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/70 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </section>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Click any card to open the mini project.
      </p>
    </main>
  );
};
