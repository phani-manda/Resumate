"use client"

import { motion } from "framer-motion"
import { TrendingUp, FileText, Eye, Download, Target, Award } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const viewsData = [
  { month: "Jan", views: 245 },
  { month: "Feb", views: 389 },
  { month: "Mar", views: 521 },
  { month: "Apr", views: 678 },
  { month: "May", views: 892 },
  { month: "Jun", views: 1034 },
]

const skillsData = [
  { name: "Technical Skills", value: 85 },
  { name: "Soft Skills", value: 75 },
  { name: "Leadership", value: 65 },
  { name: "Communication", value: 90 },
]

const optimizationData = [
  { category: "ATS Compatibility", score: 92 },
  { category: "Keyword Match", score: 78 },
  { category: "Format Quality", score: 95 },
  { category: "Content Depth", score: 88 },
  { category: "Achievement Focus", score: 82 },
]

const skillDistribution = [
  { name: "Technical", value: 40 },
  { name: "Management", value: 25 },
  { name: "Communication", value: 20 },
  { name: "Other", value: 15 },
]

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"]

function BentoCard({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("glass-panel rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative group border-white/5", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </motion.div>
  )
}

export function StatsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
      {/* Overview Stats - Top Row */}
      <BentoCard delay={0.1}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
            <Eye className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium bg-green-500/10 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +16%
          </span>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-white mb-1">1,034</h3>
          <p className="text-sm text-zinc-400">Total Profile Views</p>
        </div>
      </BentoCard>

      <BentoCard delay={0.2}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
            <Download className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium bg-green-500/10 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +23%
          </span>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-white mb-1">234</h3>
          <p className="text-sm text-zinc-400">Resume Downloads</p>
        </div>
      </BentoCard>

      <BentoCard delay={0.3}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400">
            <Target className="h-6 w-6" />
          </div>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-white mb-1">87<span className="text-lg text-zinc-500 font-normal">/100</span></h3>
          <p className="text-sm text-zinc-400">Avg. ATS Score</p>
        </div>
      </BentoCard>

      <BentoCard delay={0.4}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-white mb-1">4.8<span className="text-lg text-zinc-500 font-normal">/5.0</span></h3>
          <p className="text-sm text-zinc-400">AI Quality Rating</p>
        </div>
      </BentoCard>

      {/* Main Charts - Middle Section */}
      <BentoCard className="md:col-span-2 lg:col-span-3 min-h-[400px]" delay={0.5}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Views Overview</h3>
          <p className="text-sm text-zinc-400">Monthly traffic analysis</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="month" stroke="#71717a" tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#71717a" tickLine={false} axisLine={false} dx={-10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff"
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#8b5cf6"
                strokeWidth={4}
                dot={{ fill: "#18181b", stroke: "#8b5cf6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </BentoCard>

      <BentoCard className="md:col-span-1 min-h-[400px]" delay={0.6}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Skill Mix</h3>
          <p className="text-sm text-zinc-400">Distribution by category</p>
        </div>
        <div className="flex-1 w-full min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={skillDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {skillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="text-3xl font-bold text-white">4</span>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Types</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {skillDistribution.map((skill, i) => (
            <div key={skill.name} className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              {skill.name}
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Bottom Section */}
      <BentoCard className="md:col-span-2 min-h-[300px]" delay={0.7}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Optimization Details</h3>
            <p className="text-sm text-zinc-400">Category performance breakdown</p>
          </div>
          <Award className="text-yellow-500 h-6 w-6" />
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={optimizationData} layout="vertical" barSize={20}>
              <XAxis type="number" hide />
              <YAxis dataKey="category" type="category" width={100} tick={{ fill: '#d4d4d8', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff"
                }}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} background={{ fill: 'rgba(255,255,255,0.05)' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </BentoCard>

      <BentoCard className="md:col-span-2 min-h-[300px]" delay={0.8}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Skill Proficiency</h3>
          <p className="text-sm text-zinc-400">AI evaluated mastery levels</p>
        </div>
        <div className="space-y-6">
          {skillsData.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-white">{skill.name}</span>
                <span className="text-zinc-400">{skill.value}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </BentoCard>
    </div>
  )
}
