import { useEffect, useState } from "react";

export const OTPGenerator = () => {
  const [otp, setOtp] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const hasTime = timer > 0;
  const otpGenerated = otp > 0;

  const handleClick = () => {
    setOtp(() => Math.floor(100000 + Math.random() * 900000));
    setTimer(5);
  };

  useEffect(() => {
    if (!hasTime) return;

    const timerId = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [hasTime]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] px-4 py-12 text-[#c3c9ff] sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[#2e3668] bg-[#0b1130d9] p-6 text-center shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur sm:p-8">
        <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
          Mini Project
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">OTP Generator</h1>

        <div className="mt-8 rounded-2xl border border-[#2f3f85] bg-[#0f1843] p-6">
          <h2 className="font-mono text-3xl font-semibold tracking-[0.18em] text-[#ecf0ff] sm:text-4xl">
            {otpGenerated ? otp : "------"}
          </h2>
          <p className="mt-3 text-sm text-[#9fb0ff]" aria-live="polite">
            {otpGenerated
              ? timer > 0
                ? `Expires in: ${timer} seconds`
                : "OTP expired. Click the button to generate a new OTP."
              : "Click Generate OTP to get a code"}
          </p>
        </div>

        <button
          disabled={hasTime}
          onClick={handleClick}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-[#ff329d66] bg-[#ff329d22] px-5 font-medium text-[#ffd5eb] transition-colors hover:bg-[#ff329d33] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Generate OTP
        </button>
      </section>
    </main>
  );
};
