import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, BadgeCheck, BarChart3,
  BrainCircuit, BriefcaseBusiness, Clock3, Cloud, Code2, Cpu,
  Cctv, DatabaseBackup, Gauge, Headset, Network, Play, ShieldCheck, Sparkles,
  Trophy, type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, BadgeCheck, BarChart3,
  BrainCircuit, BriefcaseBusiness, Clock3, Cloud, Code2, Cpu,
  Cctv, DatabaseBackup, Gauge, Headset, Network, Play, ShieldCheck, Sparkles, Trophy,
};

export function SiteIcon({ name, size = 18, strokeWidth = 2, className }: {
  name: keyof typeof icons; size?: number; strokeWidth?: number; className?: string;
}) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={strokeWidth} />;
}

export function ContentIcon({ icon, title, size = 24 }: { icon?: string; title?: string; size?: number }) {
  const key = `${icon ?? ""} ${title ?? ""}`.toLowerCase();
  const directName = Object.keys(icons).find(item => item.toLowerCase() === (icon ?? "").trim().toLowerCase()) as keyof typeof icons | undefined;
  let name: keyof typeof icons = directName ?? "Cpu";
  if (!directName) {
    if (/brain|experience/.test(key)) name = "BrainCircuit";
    else if (/cloud/.test(key)) name = "Cloud";
    else if (/backup|disaster|recovery/.test(key)) name = "DatabaseBackup";
    else if (/analytics|business intelligence/.test(key)) name = "BarChart3";
    else if (/cyber|security|compliance/.test(key)) name = "ShieldCheck";
    else if (/software|development|code/.test(key)) name = "Code2";
    else if (/consult|support|helpdesk/.test(key)) name = "Headset";
    else if (/network|infrastructure/.test(key)) name = "Network";
    else if (/managed|monitor/.test(key)) name = "Gauge";
    else if (/availability|24.?\/?.?7/.test(key)) name = "Clock3";
    else if (/case|solved/.test(key)) name = "BadgeCheck";
    else if (/optimis|optimiz|performance/.test(key)) name = "Gauge";
    else if (/award|winning/.test(key)) name = "Trophy";
  }
  return <SiteIcon name={name} size={size} strokeWidth={1.8} />;
}
