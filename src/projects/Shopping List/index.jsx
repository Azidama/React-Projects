import { useCallback, useMemo, useState } from "react";

const items = [
  "Apples",
  "Bananas",
  "Strawberries",
  "Blueberries",
  "Mangoes",
  "Pineapple",
  "Lettuce",
  "Broccoli",
  "Paper Towels",
  "Dish Soap",
];

let prevToggleItem = null;

export const ShoppingList = () => {
  const [query, setQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const filteredItems = useMemo(() => {
    console.log("Filtering items...");
    return items.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const toggleItem = useCallback((item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }, [setSelectedItems]);

  if (prevToggleItem !== toggleItem) {
    console.log("New toggleItem function");
    prevToggleItem = toggleItem;
  } else {
    console.log("Current toggleItem function");
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] px-4 py-12 text-[#c3c9ff] sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[#2e3668] bg-[#0b1130d9] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur sm:p-8">
        <div className="text-center">
          <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
            Mini Project
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Shopping List</h1>
        </div>

        <form className="mt-8 rounded-2xl border border-[#2f3f85] bg-[#0f1843] p-5">
          <label htmlFor="search" className="block text-sm text-[#9fb0ff]">
            Search for an item
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search..."
            aria-describedby="search-description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
          />
          <p id="search-description" className="mt-2 text-xs text-[#9fb0ff]">
            Type to filter the list below:
          </p>

          <ul className="mt-4 grid gap-2">
            {filteredItems.map((item) => {
              const isChecked = selectedItems.includes(item);
              return (
                <li key={item} className="rounded-lg border border-[#2f3f85] bg-[#121d50] px-3 py-2 text-[#dbe3ff]">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={() => toggleItem(item)}
                      checked={isChecked}
                      className="h-4 w-4 rounded border-[#3b4f9f] bg-[#121d50]"
                    />
                    <span className={isChecked ? "line-through opacity-70" : ""}>{item}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </form>
      </section>
    </main>
  );
};
