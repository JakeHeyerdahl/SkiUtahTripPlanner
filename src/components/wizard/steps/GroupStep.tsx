"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Backpack, ShoppingBag, ChevronLeft, ArrowRight, Package, MountainSnow, Snowflake, Coffee } from "lucide-react";
import { useTripContext, GroupMember, SkillLevel, ActivityMode } from "@/context/TripContext";
import { cn } from "@/lib/utils";

const SKILL_LEVELS: { value: SkillLevel; label: string; color: string }[] = [
  { value: "beginner",     label: "Beginner",     color: "bg-green-50 border-green-500 text-green-900"   },
  { value: "intermediate", label: "Intermediate", color: "bg-blue-50 border-blue-600 text-blue-900"      },
  { value: "advanced",     label: "Advanced",     color: "bg-gray-900/5 border-gray-800 text-gray-900"   },
  { value: "expert",       label: "Expert",       color: "bg-gray-900/5 border-gray-900 text-gray-900"   },
];

function SkiSymbol({ level, active }: { level: SkillLevel; active: boolean }) {
  const grey = "bg-gray-200";
  if (level === "beginner") {
    return <span className={cn("w-3 h-3 rounded-full flex-shrink-0 inline-block", active ? "bg-[#1A6B1A]" : grey)} />;
  }
  if (level === "intermediate") {
    return <span className={cn("w-3 h-3 flex-shrink-0 inline-block", active ? "bg-[#1B4FB0]" : grey)} />;
  }
  if (level === "advanced") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0 inline-block">
        <polygon points="6,0 12,6 6,12 0,6" fill={active ? "#111111" : "#CCCCCC"} />
      </svg>
    );
  }
  // expert — double black diamond
  return (
    <span className="flex gap-0.5 flex-shrink-0 items-center">
      <svg width="10" height="10" viewBox="0 0 12 12">
        <polygon points="6,0 12,6 6,12 0,6" fill={active ? "#111111" : "#CCCCCC"} />
      </svg>
      <svg width="10" height="10" viewBox="0 0 12 12">
        <polygon points="6,0 12,6 6,12 0,6" fill={active ? "#111111" : "#CCCCCC"} />
      </svg>
    </span>
  );
}

const ACTIVITIES: { value: ActivityMode; label: string; icon: React.ElementType }[] = [
  { value: "skiing",       label: "Skiing",       icon: MountainSnow },
  { value: "snowboarding", label: "Snowboarding", icon: Snowflake  },
  { value: "chilling",     label: "Just Chillin", icon: Coffee     },
];

function newMember(id: string): GroupMember {
  return { id, skillLevel: "intermediate", activity: "skiing", needsRental: false };
}

export default function GroupStep() {
  const { tripData, updateTrip, goNext, goBack } = useTripContext();
  const members = tripData.groupMembers;

  function setCount(n: number) {
    if (n < 1 || n > 12) return;
    const current = members.slice(0, n);
    while (current.length < n) current.push(newMember(String(Date.now() + current.length)));
    updateTrip({ groupMembers: current });
  }

  function updateMember(id: string, updates: Partial<GroupMember>) {
    updateTrip({ groupMembers: members.map((m) => (m.id === id ? { ...m, ...updates } : m)) });
  }

  const onSnowCount = members.filter((m) => m.activity !== "chilling").length;
  const rentalCount = members.filter((m) => m.needsRental && m.activity !== "chilling").length;

  return (
    <motion.div
      className="flex flex-col items-center px-6 py-12"
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
          <p className="text-[#3D5066] text-base mb-8">
            Tell us about everyone so we can find the perfect resort match.
          </p>
        </motion.div>

        {/* Group size */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between bg-[#F4F6F8] rounded-2xl p-5 mb-6"
        >
          <div>
            <p className="font-bold text-[#0D2240] text-lg">Group Size</p>
            <p className="text-[#3D5066] text-sm">
              {onSnowCount} on snow · {members.length - onSnowCount} just chillin
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCount(members.length - 1)}
              className="w-10 h-10 rounded-full bg-white shadow-sm text-[#0D2240] font-bold text-xl flex items-center justify-center hover:shadow-md transition-shadow">−</button>
            <span className="text-3xl font-black text-[#0D2240] w-8 text-center">{members.length}</span>
            <button onClick={() => setCount(members.length + 1)}
              className="w-10 h-10 rounded-full bg-[#0D2240] text-white font-bold text-xl flex items-center justify-center hover:bg-[#1B6BB0] transition-colors">+</button>
          </div>
        </motion.div>

        {/* Member cards */}
        <div className="space-y-3 mb-6">
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
                <p className="font-bold text-[#0D2240] text-sm mb-3">Person {i + 1}</p>

                {/* Activity — 3-option segmented control */}
                <div className="flex rounded-xl border-2 border-gray-100 overflow-hidden bg-white mb-3">
                  {ACTIVITIES.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => updateMember(member.id, {
                        activity: value,
                        needsRental: value === "chilling" ? false : member.needsRental,
                      })}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-semibold transition-all",
                        member.activity === value
                          ? value === "chilling"
                            ? "bg-[#8A9BB0] text-white"
                            : "bg-[#0D2240] text-white"
                          : "text-[#3D5066] hover:text-[#0D2240]"
                      )}
                    >
                      <Icon size={13} strokeWidth={2} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Skill level + gear — only for on-snow members */}
                <AnimatePresence>
                  {member.activity !== "chilling" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Skill level */}
                      <div className="flex gap-1.5 flex-wrap mb-3">
                        {SKILL_LEVELS.map((sl) => (
                          <button
                            key={sl.value}
                            onClick={() => updateMember(member.id, { skillLevel: sl.value })}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all",
                              member.skillLevel === sl.value ? sl.color : "bg-white border-gray-100 text-[#3D5066]"
                            )}
                          >
                            <SkiSymbol level={sl.value} active={member.skillLevel === sl.value} />
                            {sl.label}
                          </button>
                        ))}
                      </div>

                      {/* Gear — either/or segmented control */}
                      <div className="flex rounded-xl border-2 border-gray-100 overflow-hidden bg-white">
                        <button
                          onClick={() => updateMember(member.id, { needsRental: false })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-all",
                            !member.needsRental ? "bg-[#0D2240] text-white" : "text-[#3D5066] hover:text-[#0D2240]"
                          )}
                        >
                          <Backpack size={13} strokeWidth={2} />
                          Own gear
                        </button>
                        <button
                          onClick={() => updateMember(member.id, { needsRental: true })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-all",
                            member.needsRental ? "bg-[#1B6BB0] text-white" : "text-[#3D5066] hover:text-[#0D2240]"
                          )}
                        >
                          <ShoppingBag size={13} strokeWidth={2} />
                          Needs rental
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Rental chip */}
        {rentalCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 flex-wrap mb-5">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5BB8F5]/10 text-[#0D2240] text-xs font-semibold border border-[#5BB8F5]/30">
              <Package size={12} strokeWidth={2} className="text-[#1B6BB0]" />
              {rentalCount} rental{rentalCount !== 1 ? "s" : ""} needed
            </span>
          </motion.div>
        )}

        {/* Nav */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex gap-3">
          <button onClick={goBack} className="flex items-center gap-1.5 px-6 py-4 rounded-2xl font-semibold text-[#3D5066] bg-[#F4F6F8] hover:bg-gray-200 transition-colors">
            <ChevronLeft size={16} strokeWidth={2.5} />
            Back
          </button>
          <button onClick={goNext} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-[#0D2240] text-white hover:bg-[#1B6BB0] shadow-lg active:scale-[0.98] transition-all">
            Choose your pass
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
