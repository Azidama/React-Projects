import { useState, type ChangeEvent } from "react";

export const ColorPicker = () => {
  const [pickColor, setPickColor] = useState<string>("#ffffff");
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPickColor(e.target.value);
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] px-4 py-12 text-[#c3c9ff] sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[#2e3668] bg-[#0b1130d9] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur sm:p-8">
        <div className="text-center">
          <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
            Mini Project
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Color Picker</h1>
          <p className="mt-3 text-[#99a4e6]">Select a color to preview it live.</p>
        </div>

        <div className="mt-8 space-y-5 rounded-2xl border border-[#2f3f85] bg-[#0f1843] p-6">
          <div className="mx-auto h-48 w-full max-w-md rounded-2xl border border-[#3b4f9f] shadow-inner" style={{ backgroundColor: pickColor }} />
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <label htmlFor="color-input" className="text-sm font-medium text-[#9fb0ff]">
              Pick Color
            </label>
            <input
              type="color"
              id="color-input"
              value={pickColor}
              onChange={handleColorChange}
              className="h-12 w-20 cursor-pointer rounded-lg border border-[#3b4f9f] bg-transparent p-1"
            />
            <code className="rounded-lg border border-[#3b4f9f] bg-[#141d48] px-3 py-2 text-sm text-[#dbe3ff]">{pickColor}</code>
          </div>
        </div>
      </section>
    </main>
  );
};
