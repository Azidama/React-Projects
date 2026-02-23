import { useState } from "react";

export const Watch = () => {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  
  const incrementor = (n) => {
    if (n < 9) {
      n = n + 1;
      return `0${String(n)}`;
    }
    n = n + 1;
    return String(n);
  };

  const decrementor = (n) => {
    if (n < 9) {
      n = n - 1;
      return `0${String(n)}`;
    }
    n = n - 1;
    return String(n);
  };
  
  const getNumber = (num, crememtor, setter) => {
    const intNum = Number(num);
    setter(crememtor(intNum));
  };

  function handleHoursUpButtonClick() {
    if (hours === "23") {
      setHours("00");
      return;
    }
    getNumber(hours, incrementor, setHours);
  }

  function handleHoursDownButtonClick() {
    if (hours === "00") {
      setHours("23");
      return;
    }
    getNumber(hours, decrementor, setHours);
  }

  function handleMinutesUpButtonClick() {
    if (minutes === "59") {
      setMinutes("00");
      handleHoursUpButtonClick();
      return;
    }
    getNumber(minutes, incrementor, setMinutes);
  }

  function handleMinutesDownButtonClick() {
    if (minutes === "00") {
      setMinutes("59");
      handleHoursDownButtonClick();
      return;
    }
    getNumber(minutes, decrementor, setMinutes);
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] px-4 py-12 text-[#c3c9ff] sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="mx-auto w-full max-w-md rounded-3xl border border-[#2e3668] bg-[#0b1130d9] p-6 text-center shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur sm:p-8">
        <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
          Mini Project
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Watch</h1>

        <div className="mt-8 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              id="hours-up-button"
              onClick={handleHoursUpButtonClick}
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] text-xl text-[#dbe3ff] transition-colors hover:border-[#ff5ab0] hover:text-white"
            >
              &uarr;
            </button>

            <button
              id="minutes-up-button"
              onClick={handleMinutesUpButtonClick}
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] text-xl text-[#dbe3ff] transition-colors hover:border-[#ff5ab0] hover:text-white"
            >
              &uarr;
            </button>
          </div>

          <div
            id="clock"
            className="rounded-xl border border-[#35d4ba55] bg-[#35d4ba1a] px-4 py-4 font-mono text-4xl font-semibold tracking-wider text-[#4de8cb]"
          >
            {`${hours}:${minutes}`}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              id="hours-down-button"
              onClick={handleHoursDownButtonClick}
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] text-xl text-[#dbe3ff] transition-colors hover:border-[#ff5ab0] hover:text-white"
            >
              &darr;
            </button>

            <button
              id="minutes-down-button"
              onClick={handleMinutesDownButtonClick}
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] text-xl text-[#dbe3ff] transition-colors hover:border-[#ff5ab0] hover:text-white"
            >
              &darr;
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
