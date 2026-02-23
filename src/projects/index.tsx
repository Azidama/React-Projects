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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAppTheme } from "@/hooks/useAppTheme";

export const ProjectsIndex = () => {
  const { theme, setTheme } = useAppTheme();

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
    <main className="projects-home relative min-h-screen w-full overflow-x-hidden transition-colors">
      <div className="projects-home__bg-primary pointer-events-none absolute inset-0 -z-10 transition-colors" />
      <div className="projects-home__bg-grid pointer-events-none absolute inset-0 -z-10 opacity-35" />

      <div className="projects-home__banner border-b px-4 py-2 text-center font-mono text-xs sm:text-sm">
        Portfolio in progress: UI revamp across all mini projects
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <section className="projects-home__shell rounded-3xl border p-6 backdrop-blur sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <div className="projects-home__stats rounded-2xl border p-5">
              <p className="projects-home__stats-label font-mono text-sm uppercase tracking-[0.18em]">Projects</p>
              <p className="projects-home__stats-value mt-2 text-6xl font-semibold leading-none">{projects.length}</p>
              <p className="projects-home__stats-label mt-5 font-mono text-sm uppercase tracking-[0.18em]">Stack</p>
              <p className="projects-home__stats-value mt-1 text-3xl font-semibold leading-none">React</p>
              <p className="projects-home__stats-meta mt-6 text-xs">Single repo, multiple mini-app routes.</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="projects-home__pill inline-flex rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
                    React Mini Projects
                  </p>
                  <h1 className="projects-home__title mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                    Portfolio Playground
                  </h1>
                  <p className="projects-home__subtitle mt-3 max-w-3xl text-base">
                    A consolidated collection of hands-on React exercises, now organized as one portfolio-style
                    experience.
                  </p>
                </div>

                <ThemeToggle theme={theme} onChange={setTheme} />
              </div>

              <div className="projects-home__preview-shell rounded-2xl border p-4">
                <div className="projects-home__preview-frame h-44 w-full overflow-hidden rounded-xl border p-3">
                  <div className="projects-home__preview-grid relative h-full w-full rounded-lg border">
                    <div className="projects-home__preview-grid-lines absolute inset-0 opacity-40" />
                    <div className="projects-home__preview-line-1 absolute inset-x-0 top-[36%] h-[2px]" />
                    <div className="projects-home__preview-line-2 absolute inset-x-0 top-[56%] h-[2px]" />
                    <div className="projects-home__preview-glow absolute bottom-5 left-5 right-5 h-10 rounded-full" />
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
                className="projects-home__card group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="projects-home__icon rounded-xl border p-2.5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="projects-home__arrow h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>

                <h2 className="projects-home__card-title mt-4 text-2xl font-medium">{project.name}</h2>
                <p className="projects-home__card-text mt-3 text-sm leading-relaxed">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="projects-home__tag rounded-full border px-2.5 py-1 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </section>

        <p className="projects-home__footer mt-8 text-center font-mono text-xs tracking-wide">
          Pick a card to open the mini project.
        </p>
      </div>
    </main>
  );
};

