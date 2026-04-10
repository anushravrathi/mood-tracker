"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function MoodTracker() {
  const [mood, setMood] = useState(62);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // 🎯 Fetch from DB
  const fetchMood = async () => {
    const { data } = await supabase.from("mood").select("*").single();
    if (data) {
      setMood(data.score);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchMood();

    // ⚡ Realtime
    const channel = supabase
      .channel("realtime:mood")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "mood",
        },
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

  // 🎨 Helpers
  const getMoodLabel = (value: number) => {
    if (value >= 80) return "GOD MODE";
    if (value >= 60) return "CHILLIN";
    if (value >= 40) return "HANGING IN THERE";
    if (value >= 20) return "DOWN BAD";
    return "ROCK BOTTOM";
  };

  const getEmoji = (value: number) => {
    if (value >= 80) return "🚀";
    if (value >= 60) return "😊";
    if (value >= 40) return "😐";
    if (value >= 20) return "😔";
    return "😭";
  };

  const getTimeAgo = () => {
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  const getColor = (value: number) => {
    if (value <= 50) return `hsl(${(value / 50) * 60},100%,50%)`;
    return `hsl(${60 + ((value - 50) / 50) * 60},100%,50%)`;
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between">
        <p className="pixel-font text-xs">how am i doing today?</p>
        <span>⚙️</span>
      </div>

      {/* Center */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">

        <p className="pixel-font text-xs opacity-50 mb-10 tracking-widest">
          ANUSHRAV . LIVE
        </p>

        {/* Emoji */}
        <div className="text-[100px] mb-10 animate-pulse">
          {getEmoji(mood)}
        </div>

        {/* Bar */}
        <div className="w-full max-w-xl mb-8">
          <div className="relative w-full h-14 bg-white/5 rounded-full overflow-hidden border border-white/10">

            {/* Background gradient */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />

            {/* Fill */}
            <div
              className="absolute left-0 top-0 h-full transition-all duration-700"
              style={{
                width: `${mood}%`,
                background: "linear-gradient(to right,#ef4444,#eab308,#22c55e)",
                boxShadow: `0 0 40px ${getColor(mood)}`,
              }}
            />
          </div>
        </div>

        {/* % */}
        <h1
          className="text-6xl font-bold mb-2"
          style={{ textShadow: `0 0 30px ${getColor(mood)}` }}
        >
          {mood}%
        </h1>

        {/* Label */}
        <p className="pixel-font text-sm tracking-widest mb-2">
          {getMoodLabel(mood)}
        </p>

        {/* Time */}
        <p className="text-xs opacity-40">
          last updated {getTimeAgo()}
        </p>

      </div>
    </main>
  );
}