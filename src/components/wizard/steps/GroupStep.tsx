"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTripContext, GroupMember, SkillLevel } from "@/context/TripContext";
import { cn } from "@/lib/utils";

const SKILL_LEVELS: { value: SkillLevel; label: string; color: string; dot: string }[] = [
  { value: "beginner",     label: "Beginner",     color: "bg-green-50 border-green-400 text-green-800",   dot: "bg-green-500" },
  { value: "intermediate", label: "Intermediate", color: "bg-blue-50 border-blue-400 text-blue-800",      dot: "bg-blue-600" },
  { value: "advanced",     label: "Advanced",     color: "bg-slate-50 border-slate-500 text-slate-800",   dot: "bg-slate-700" },
  { value: "expert",       label: "Expert",       color: "bg-purple-50 border-purple-500 text-purple-900",dot: "bg-purple-700" },
];

function newMember(id: string): GroupMember {
  return { id, skillLevel: "intermediate", isSkiing: true, needsRental: false };
}

export default function GroupStep() {
  const { tripData, updateTrip, goNext, goBack } = useTripContext();
  const members = tripData.groupMembers;

  function setCount(n: number) {
    if (n < 1 || n > 12) return;
    const current = members.slice(0, n);
    while (current.length < n) {
      current.push(newMember(String(Date.now() + current.length)));
    }
    updateTrip({ groupMembers: current });
  }

  function updateMember(id: string, updates: Partial<GroupMember>) {
    updateTrip({
      groupMembers: members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    });
  }

  const skiingCount = members.filter((m) => m.isSkiing).length;
  const rentalCount = members.filter((m) => m.needsRental).length;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 py-12"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-[#1B6BB0] font-semibold text-sm tracking-widest uppercase mb-3">Step 3 of 5</p>
          <h1 className="text-4xl font-black text-[#0D2240] leading-tight mb-2">
            Who&apos;s making<br />the trip?
          </h1>
          <p className="text-[#8A9BB0] text-base mb-8">
            Tell us about everyone in your group so we can find the perfect resort match.
          </p>
        </motion.div>

        {/* Group size counter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between bg-[#F4F6F8] rounded-2xl p-5 mb-6"
        >
          <div>
            <p className="font-bold text-[#0D2240] text-lg">Group Size</p>
            <p className="text-[#8A9BB0] text-sm">{skiingCount} skiing · {members.length - skiingCount} not skiing</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCount(members.length - 1)}
              className="w-10 h-10 rounded-full bg-white shadow-sm text-[#0D2240] font-bold text-xl flex items-center justify-center hover:shadow-md transition-shadow"
            >−</button>
            <span className="text-3xl font-black text-[#0D2240] w-8 text-center">{members.length}</span>
            <button
              onClick={() => setCount(members.length + 1)}
              className="w-10 h-10 rounded-full bg-[#0D2240] text-white font-bold text-xl flex items-center justify-center hover:bg-[#1B6BB0] transition-colors"
            >+</button>
          </div>
        </motion.div>

        {/* Member cards */}
        <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-1">
          <AnimatePresence>
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="bg-[#F4F6F8] rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-[#0D2240] text-sm">
                    Person {i + 1}
                  </span>
                  {/* Skiing toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8A9BB0]">Not skiing</span>
                    <button
                      onClick={() => updateMember(member.id, { isSkiing: !member.isSkiing })}
                      className={cn(
                        "relative w-10 h-5 rounded-full transition-colors",
                        member.isSkiing ? "bg-[#1B6BB0]" : "bg-gray-200"
                      )}
                    >
                      <motion.div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        animate={{ x: member.isSkiing ? 21 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                    <span className="text-xs text-[#8A9BB0]">Skiing</span>
                  </div>
                </div>

                {member.isSkiing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {/* Skill level */}
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {SKILL_LEVELS.map((sl) => (
                        <button
                          key={sl.value}
                          onClick={() => updateMember(member.id, { skillLevel: sl.value })}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all",
                            member.skillLevel === sl.value ? sl.color : "bg-white border-gray-100 text-gray-400"
                          )}
                        >
                          <span className={cn("w-2 h-2 rounded-full", member.skillLevel === sl.value ? sl.dot : "bg-gray-200")} />
                          {sl.label}
                        </button>
                      ))}
                    </div>

                    {/* Rental toggle */}
                    <button
                      onClick={() => updateMember(member.id, { needsRental: !member.needsRental })}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all",
                        member.needsRental
                          ? "border-[#5BB8F5] bg-[#5BB8F5]/10 text-[#0D2240]"
                          : "border-gray-100 bg-white text-gray-400"
                      )}
                    >
                      <span>🎿</span>
                      {member.needsRental ? "Needs equipment rental" : "Bringing own gear"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary chips */}
        {rentalCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 flex-wrap mb-5"
          >
            <span className="px-3 py-1.5 rounded-full bg-[#5BB8F5]/10 text-[#0D2240] text-xs font-semibold border border-[#5BB8F5]/30">
              🎿 {rentalCount} rental{rentalCount !== 1 ? "s" : ""} needed
            </span>
          </motion.div>
        )}

        {/* Nav */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex gap-3"
        >
          <button onClick={goBack} className="px-6 py-4 rounded-2xl font-semibold text-[#3D5066] bg-[#F4F6F8] hover:bg-gray-200 transition-colors">
            ← Back
          </button>
          <button
            onClick={goNext}
            className="flex-1 py-4 rounded-2xl font-bold text-lg bg-[#0D2240] text-white hover:bg-[#1B6BB0] shadow-lg active:scale-[0.98] transition-all"
          >
            Choose your pass →
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
