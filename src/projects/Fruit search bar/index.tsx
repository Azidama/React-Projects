import { useEffect, useState, type FormEvent } from "react";

export function FruitSearchBar() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://fruit-search.freecodecamp.rocks/api/fruits?q=${query}`);
        const data = (await response.json()) as Array<{ name: string }>;
        setResults(data.map(fruit => fruit.name));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] px-4 py-12 text-[#c3c9ff] sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[#2e3668] bg-[#0b1130d9] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur sm:p-8">
        <div className="text-center">
          <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
            Mini Project
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Fruit Search Bar</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <label htmlFor="search-input" className="mb-2 block text-sm text-[#9fb0ff]">
            Search for fruits
          </label>
          <input
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
          />
        </form>

        <div className="mt-5 max-h-64 overflow-y-auto rounded-xl border border-[#2f3f85] bg-[#0f1843] p-3">
          {loading && <p className="text-sm text-[#9fb0ff]">Searching...</p>}
          {!loading && results.length > 0 && (
            <div className="grid gap-2">
              {results.map(item => (
                <p key={item} className="rounded-lg border border-[#2f3f85] bg-[#121d50] px-3 py-2 text-[#dbe3ff]">
                  {item}
                </p>
              ))}
            </div>
          )}
          {!loading && query.trim() !== "" && results.length === 0 && <p className="text-sm text-[#9fb0ff]">No results found</p>}
          {!loading && query.trim() === "" && <p className="text-sm text-[#9fb0ff]">Start typing to search.</p>}
        </div>
      </section>
    </main>
  );
}
