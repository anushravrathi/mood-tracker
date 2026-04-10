"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Admin() {
  const [score, setScore] = useState(50);

  useEffect(() => {
    fetchMood();
  }, []);

  const fetchMood = async () => {
    const { data } = await supabase.from("mood").select("*").single();
    if (data) setScore(data.score);
  };

  const updateScore = async (value: number) => {
    const newScore = Math.max(0, Math.min(100, value));
    setScore(newScore);

    await supabase
      .from("mood")
      .update({ score: newScore })
      .eq("id", 1)
      .select();
  };

  const actions = [
    { label: "Gym", value: 10 },
    { label: "Productive", value: 15 },
    { label: "Chill", value: 5 },
    { label: "Tired", value: -10 },
    { label: "Bad Day", value: -20 },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      <div className="w-full max-w-xl text-center">

        <p className="pixel-font text-xs mb-10 opacity-60">
          MOOD CONTROL PANEL
        </p>

        <h2 className="text-5xl font-bold mb-6">{score}%</h2>

        {/* Bar */}
        <div className="w-full h-4 rounded-full bg-neutral-800 mb-10 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${score}%`,
              background:
                "linear-gradient(90deg,#ff3b3b,#ffd93b,#00ff88)",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={() => updateScore(score + a.value)}
              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl px-5 py-4 transition hover:scale-105 active:scale-95"
            >
              <div className="text-sm">{a.label}</div>
              <div className="text-xs opacity-50">
                {a.value > 0 ? `+${a.value}` : a.value}
              </div>
            </button>
          ))}
        </div>

        {/* Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={score}
          onChange={(e) => updateScore(Number(e.target.value))}
          className="w-full"
        />

      </div>
    </main>
  );
}