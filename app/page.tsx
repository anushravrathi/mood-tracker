"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mood, setMood] = useState(65);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState("just now");

  const router = useRouter();

  // 🧠 Mood logic
  const getMoodData = (value: number) => {
    if (value < 20) return { label: "ROCK BOTTOM", emoji: "😭" };
    if (value < 40) return { label: "DOWN BAD", emoji: "😔" };
    if (value < 60) return { label: "HANGING IN THERE", emoji: "😐" };
    if (value < 90) return { label: "CHILLIN", emoji: "😎" };
    return { label: "GOD MODE", emoji: "🚀" };
  };

  const moodData = getMoodData(mood);

  // 📡 Fetch initial
  const fetchMood = async () => {
    const { data } = await supabase.from("mood").select("*").single();
    if (data) {
      setMood(data.score);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchMood();

    // ⚡ realtime
    const channel = supabase
      .channel("realtime:mood")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "mood" },
        (payload) => {
          setMood(payload.new.score);
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ⏱️ timer
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - lastUpdated.getTime()) / 1000
      );

      if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600)
        setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">

      {/* Header */}
      <div className="flex justify-between px-6 py-4 border-b border-white/10">
        <p className="pixel text-xs tracking-widest">
          how am i doing today?
        </p>

        <button onClick={() => router.push("/control7x9k")}>
          <Settings className="w-5 h-5 text-white/60 hover:text-white hover:rotate-90 transition" />
        </button>
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl text-center px-6">

          <p className="pixel text-xs opacity-50 mb-10 tracking-widest">
            ANUSHRAV . LIVE
          </p>

          {/* Emoji */}
          <div className="text-[100px] mb-10 animate-pulse">
            {moodData.emoji}
          </div>

          {/* Bar */}
          <div className="w-full mb-10">
            <div className="relative h-14 rounded-full overflow-hidden bg-white/5 border border-white/10">

              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-20 blur-sm" />

              <div
                className="h-full transition-all duration-700 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                style={{
                  width: `${mood}%`,
                  background:
                    "linear-gradient(to right,#ef4444,#eab308,#22c55e)",
                }}
              />
            </div>
          </div>

          {/* % */}
          <h1 className="text-6xl font-bold glow-text mb-3">
            {mood}%
          </h1>

          {/* Label */}
          <p className="pixel text-sm mb-2 tracking-widest">
            {moodData.label}
          </p>

          {/* Time */}
          <p className="text-xs opacity-40">
            last updated {timeAgo}
          </p>

        </div>
      </div>
    </main>
  );
}