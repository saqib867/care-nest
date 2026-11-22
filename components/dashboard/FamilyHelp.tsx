"use client";

export default function FamilyHelp() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Support Center</h1>
        <p className="text-xs text-gray-500 mt-1">Answers to frequently asked questions and client feedback support forms.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40 space-y-3">
          <h3 className="font-extrabold text-sm text-gray-900">Frequently Asked Questions</h3>
          <div className="space-y-2 leading-relaxed text-xs text-gray-500">
            <p className="font-bold text-gray-950">How does the 15% platform fee work?</p>
            <p className="mb-2">We process holds securely using Stripe escrow. The matching fee covers background checks, liability insurance, and client support.</p>
            <p className="font-bold text-gray-950">Are caregivers background-checked?</p>
            <p>Yes. Every independent companion undergoes criminal record checking and credentials vetting before activation.</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40 space-y-3">
          <h3 className="font-extrabold text-sm text-gray-900">Contact Support Desk</h3>
          <textarea rows={4} placeholder="Type your support request details here..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary" />
          <button onClick={() => alert("Support ticket opened!")} className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold cursor-pointer">Submit Ticket</button>
        </div>
      </div>
    </div>
  );
}
