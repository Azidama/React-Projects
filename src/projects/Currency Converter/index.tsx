import { useMemo, useState } from "react";

export function CurrencyConverter() {
  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 156.7,
  } as const;
  type CurrencyCode = keyof typeof exchangeRates;
  const currencies = Object.keys(exchangeRates) as CurrencyCode[];
  const defaultCurrency: CurrencyCode = "USD";
  const [startCurrency, setStartCurrency] = useState<CurrencyCode>(currencies[0] ?? defaultCurrency);
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>(currencies[0] ?? defaultCurrency);
  const [convertFrom, setConvertFrom] = useState<number>(1);

  const converted = useMemo(() => {
    const from = exchangeRates[startCurrency];
    const amount = Number(convertFrom) || 0;
    const rateList = {} as Record<CurrencyCode, string>;

    for (const curr of currencies) {
      rateList[curr] = ((exchangeRates[curr] / from) * amount).toFixed(2);
    }
    return rateList;
  }, [startCurrency, convertFrom, currencies]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] px-4 py-12 text-[#c3c9ff] sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[#2e3668] bg-[#0b1130d9] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur sm:p-8">
        <div className="text-center">
          <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
            Mini Project
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Currency Converter</h1>
          <p className="mt-3 text-[#99a4e6]">
            {startCurrency} to {targetCurrency} conversion
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-[#2f3f85] bg-[#0f1843] p-5">
          <label className="grid gap-2 text-sm text-[#9fb0ff]">
            Amount
            <input
              type="number"
              value={convertFrom}
              onChange={(e) => setConvertFrom(Number(e.target.value) || 0)}
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
            />
          </label>

          <label className="grid gap-2 text-sm text-[#9fb0ff]">
            Convert From
            <select
              value={startCurrency}
              onChange={(prev) => setStartCurrency(prev.target.value as CurrencyCode)}
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
            >
              {currencies.map((curr) => (
                <option key={curr}>{curr}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-[#9fb0ff]">
            Convert To
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
            >
              {currencies.map((curr) => (
                <option key={curr}>{curr}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-5 rounded-xl border border-[#35d4ba55] bg-[#35d4ba1a] px-4 py-3 text-center text-lg font-medium text-[#4de8cb]">
          Converted Amount: {converted[targetCurrency]} {targetCurrency}
        </p>
      </section>
    </main>
  );
}
