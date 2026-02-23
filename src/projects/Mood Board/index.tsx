type MoodBoardItemProps = {
  color: string;
  image: string;
  description: string;
};

export const MoodBoardItem = ({ color, image, description }: MoodBoardItemProps) => {
  return (
    <div className="rounded-2xl border border-[#2f3f85] bg-[#0f1843] p-3">
      <div className="rounded-xl p-3" style={{ backgroundColor: color }}>
        <img src={image} className="h-36 w-full rounded-lg object-cover" alt={description} />
      </div>
      <h3 className="mt-3 text-center text-sm font-medium uppercase tracking-wide text-[#dbe3ff]">{description}</h3>
    </div>
  );
};

export const MoodBoard = () => {
  const bgColor = "#f9b86b";
  const objects: MoodBoardItemProps[] = [
    {
      image: "https://cdn.freecodecamp.org/curriculum/labs/pathway.jpg",
      color: bgColor,
      description: "tree",
    },
    {
      image: "https://cdn.freecodecamp.org/curriculum/labs/shore.jpg",
      color: bgColor,
      description: "rock",
    },
    {
      image: "https://cdn.freecodecamp.org/curriculum/labs/grass.jpg",
      color: bgColor,
      description: "wotah n gras",
    },
    {
      image: "https://cdn.freecodecamp.org/curriculum/labs/ship.jpg",
      color: bgColor,
      description: "ship",
    },
    {
      image: "https://cdn.freecodecamp.org/curriculum/labs/santorini.jpg",
      color: bgColor,
      description: "ting",
    },
    {
      image: "https://cdn.freecodecamp.org/curriculum/labs/pigeon.jpg",
      color: bgColor,
      description: "birb",
    },
  ];

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] px-4 py-12 text-[#c3c9ff] sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-[#2e3668] bg-[#0b1130d9] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur sm:p-8">
        <div className="text-center">
          <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
            Mini Project
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Destination Mood Board</h1>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {objects.map(item => (
            <MoodBoardItem key={item.image} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
};
