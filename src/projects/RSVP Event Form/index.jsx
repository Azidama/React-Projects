import { useState } from "react";

export function RSVPEventForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendees, setAttendees] = useState(1);
  const [preferences, setPreferences] = useState("");
  const [guests, setGuests] = useState(false);
  const [submittedData, setSubmittedData]= useState(null);
  
  const handleSubmit =(e)=>{
    setSubmittedData({ name, email, attendees, preferences, guests });
    e.preventDefault();
  };

  const handleAttendees = (e) => {
    if (e.target.value < 1) return;
    setAttendees(e.target.value);
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
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Event RSVP Form</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-2xl border border-[#2f3f85] bg-[#0f1843] p-5">
          <label className="grid gap-2 text-sm text-[#9fb0ff]">
            Name
            <input
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-sm text-[#9fb0ff]">
            Email
            <input
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-sm text-[#9fb0ff]">
            Number of Attendees
            <input
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
              type="number"
              value={attendees}
              onChange={handleAttendees}
              required
              min="1"
            />
          </label>
          <label className="grid gap-2 text-sm text-[#9fb0ff]">
            Dietary Preferences
            <input
              className="h-11 rounded-xl border border-[#3b4f9f] bg-[#121d50] px-3 text-[#ecf0ff] outline-none focus:border-[#ff5ab0]"
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-[#9fb0ff]">
            <input
              type="checkbox"
              checked={guests}
              onChange={(e) => setGuests(e.target.checked)}
              className="h-4 w-4 rounded border-[#3b4f9f] bg-[#121d50]"
            />
            Bringing additional guests?
          </label>
          <button
            type="submit"
            className="mt-2 inline-flex h-11 items-center justify-center rounded-xl border border-[#ff329d66] bg-[#ff329d22] px-5 font-medium text-[#ffd5eb] transition-colors hover:bg-[#ff329d33]"
          >
            Confirm RSVP
          </button>
        </form>

        {submittedData && (
          <div className="mt-5 rounded-xl border border-[#35d4ba55] bg-[#35d4ba1a] p-4 text-sm text-[#d6fff6]">
            <h3 className="mb-2 text-base font-semibold text-[#4de8cb]">Confirmation</h3>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Number of Attendees:</strong> {submittedData.attendees}</p>
            <p><strong>Dietary Preferences:</strong> {submittedData.preferences || "None"}</p>
            <p><strong>Bringing Additional Guests?:</strong> {submittedData.guests ? "Yes" : "No"}</p>
          </div>
        )}
      </section>
    </main>
  );
}
