"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  Briefcase,
  Coffee,
  Bed,
  CloudRain,
  Heart
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [mood, setMood] = useState(70);

  // 🔐 PASSWORD PROTECTION
  useEffect(() => {
    const saved = localStorage.getItem("admin-auth");

    if (saved === "true") {
      setAuthorized(true);
      return;
    }

    const input = prompt("Enter password");

    if (input === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("admin-auth", "true");
      setAuthorized(true);
    } else {
      router.push("/");
    }
  }, []);

  // 📡 FETCH
  const fetchMood = async () => {
    const { data } = await supabase.from("mood").select("*").single();
    if (data) setMood(data.score);
  };

  useEffect(() => {
    if (authorized) fetchMood();
  }, [authorized]);

  // ⚡ UPDATE
  const updateMood = async (value: number) => {
    const newVal = Math.max(0, Math.min(100, value));
    setMood(newVal);

    await supabase.from("mood").update({ score: newVal }).eq("id", 1);
  };

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12">

      {/* TITLE */}
      <h1 className="pixel text-3xl md:text-4xl mb-3 glow-text">
        MOOD CONTROL PANEL
      </h1>

      <p className="text-sm text-white/50 mb-10">
        Adjust your live mood status
      </p>

      {/* CURRENT MOOD CARD */}
      <div className="w-full max-w-2xl mb-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)] text-center">

          <p className="text-sm text-white/50 mb-2">
            CURRENT MOOD
          </p>

          <h2 className="text-6xl font-bold mb-6">
            {mood}%
          </h2>

          {/* BAR */}
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${mood}%`,
                background:
                  "linear-gradient(to right,#ef4444,#f59e0b,#22c55e)",
              }}
            />
          </div>

        </div>
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">

        <Card
          icon={<Dumbbell />}
          title="Gym"
          value="+10"
          onClick={() => updateMood(mood + 10)}
          color="green"
          glow="green"
        />

        <Card
          icon={<Briefcase />}
          title="Productive"
          value="+15"
          onClick={() => updateMood(mood + 15)}
          color="blue"
          glow="blue"
        />

        <Card
          icon={<Coffee />}
          title="Chill"
          value="+5"
          onClick={() => updateMood(mood + 5)}
          color="yellow"
          glow="yellow"
        />

        <Card
          icon={<Bed />}
          title="Tired"
          value="-10"
          onClick={() => updateMood(mood - 10)}
          color="orange"
          glow="orange"
        />

        <Card
          icon={<CloudRain />}
          title="Bad Day"
          value="-20"
          onClick={() => updateMood(mood - 20)}
          color="red"
          glow="red"
        />
        <Card
          icon={<Heart/>}
          title="Met Cutie"
          value="+100"
          onClick={() => updateMood(mood + 100)}
          color="pink"
          glow="pink"
        />

      </div>

      {/* SLIDER */}
      <div className="w-full max-w-xl mb-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

          <div className="flex justify-between text-sm text-white/50 mb-4">
            <span>Manual Adjustment</span>
            <span>{mood}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={mood}
            onChange={(e) => updateMood(Number(e.target.value))}
            className="w-full accent-blue-500"
          />

          <div className="flex justify-between text-xs text-white/30 mt-2">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>

        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => updateMood(0)}
          className="btn"
        >
          Reset to 0
        </button>

        <button
          onClick={() => updateMood(50)}
          className="btn"
        >
          Set to 50
        </button>

        <button
          onClick={() => updateMood(100)}
          className="btn"
        >
          Max to 100
        </button>
      </div>

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.removeItem("admin-auth");
          location.reload();
        }}
        className="btn"
      >
        Logout
      </button>

    </main>
  );
}

function Card({ icon, title, value, onClick, color, glow }: any) {
  const colorMap: any = {
    green: "bg-green-500/15 border-green-500/40 text-green-100",
    blue: "bg-blue-500/15 border-blue-500/40 text-blue-100",
    yellow: "bg-yellow-400/15 border-yellow-400/40 text-yellow-100",
    orange: "bg-orange-500/15 border-orange-500/40 text-orange-100",
    red: "bg-red-500/15 border-red-500/40 text-red-100",
    pink: "bg-pink-500/15 border-pink-500/40 text-pink-100",
  };

  const glowMap: any = {
    green: "hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]",
    blue: "hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]",
    yellow: "hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]",
    orange: "hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]",
    red: "hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]",
    pink: "hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]",
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center transition transform hover:scale-105 ${colorMap[color]} ${glowMap[glow]}`}
    >
      <div className="flex justify-center mb-3 text-white/80">
        {icon}
      </div>

      <p className="text-sm mb-1">{title}</p>

      <p className="text-xs text-white/40">{value}</p>
    </div>
  );
}