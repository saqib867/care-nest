"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900">
            Contact <span className="text-secondary">Us</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Have questions about escrow payments, vetting criteria, or onboarding? Our support team is here to help.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-start">
          {/* LEFT: Contact Info (col-span-5) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Get in Touch</h3>
              
              <div className="space-y-4 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="size-4" />
                  </div>
                  <span>support@carenest.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Phone className="size-4" />
                  </div>
                  <span>+49 (0) 89 2345 6789</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <MapPin className="size-4" />
                  </div>
                  <span className="leading-tight">Maximilianstraße 12, 80539 Munich, Germany</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-xs text-slate-500 leading-relaxed">
              <strong>Support Hours:</strong> Monday – Friday, 09:00 – 18:00 (CET). We typically respond to support tickets within 2-4 business hours.
            </div>
          </div>

          {/* RIGHT: Form (col-span-7) */}
          <div className="md:col-span-7">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40">
              {submitted ? (
                <div className="text-center py-10 space-y-3 animate-in fade-in duration-300">
                  <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-gray-900">Message Received!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. A CareNest support representative will contact you at your email address shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 px-4 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Send us a Message</h3>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us how we can assist you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md gap-1.5 cursor-pointer"
                  >
                    <Send className="size-4" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
