import type { ReactNode } from "react";

/**
 * Real brand marks (official colours, self-hosted SVGs in /public/logos)
 * and custom thin-line icons for concept skills.
 */
export const BRAND: Record<string, { name: string; src: string; hex: string }> = {
  salesforce: { name: "Salesforce", src: "/logos/salesforce.svg", hex: "#00A1E0" },
  hubspot: { name: "HubSpot", src: "/logos/hubspot.svg", hex: "#FF7A59" },
  claude: { name: "Claude Code", src: "/logos/claude.svg", hex: "#D97757" },
  mcp: { name: "Model Context Protocol", src: "/logos/mcp.svg", hex: "#0d0d0d" },
  zapier: { name: "Zapier", src: "/logos/zapier.svg", hex: "#FF4F00" },
  nodejs: { name: "Node.js", src: "/logos/nodejs.svg", hex: "#5FA04E" },
  typescript: { name: "TypeScript", src: "/logos/typescript.svg", hex: "#3178C6" },
  javascript: { name: "JavaScript", src: "/logos/javascript.svg", hex: "#F7DF1E" },
  react: { name: "React", src: "/logos/react.svg", hex: "#61DAFB" },
  vercel: { name: "Vercel", src: "/logos/vercel.svg", hex: "#0d0d0d" },
  github: { name: "GitHub", src: "/logos/github.svg", hex: "#181717" },
  jwt: { name: "JSON Web Tokens", src: "/logos/jwt.svg", hex: "#0d0d0d" },
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CONCEPT: Record<string, { name: string; icon: ReactNode }> = {
  api: {
    name: "APIs",
    icon: (
      <g {...stroke}>
        <path d="M8 12H4M20 12h-4M12 8V4M12 20v-4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="4" cy="12" r="1" />
        <circle cx="20" cy="12" r="1" />
        <circle cx="12" cy="4" r="1" />
        <circle cx="12" cy="20" r="1" />
      </g>
    ),
  },
  admin: {
    name: "Org administration",
    icon: (
      <g {...stroke}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
      </g>
    ),
  },
  release: {
    name: "Release management",
    icon: (
      <g {...stroke}>
        <path d="M6 4v16M6 8c4-3 8 3 12 0v8c-4 3-8-3-12 0" />
      </g>
    ),
  },
  webhook: {
    name: "Webhooks",
    icon: (
      <g {...stroke}>
        <path d="M10 6a3 3 0 1 1 4.5 2.6L11 15" />
        <path d="M6.5 13a3 3 0 1 0 3 4.5h6.5" />
        <path d="M15.5 12.5a3 3 0 1 1 2 5.5" />
      </g>
    ),
  },
  quality: {
    name: "Data quality",
    icon: (
      <g {...stroke}>
        <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </g>
    ),
  },
  agent: {
    name: "LLM agents",
    icon: (
      <g {...stroke}>
        <rect x="5" y="8" width="14" height="10" rx="3" />
        <path d="M12 8V4M9 4h6" />
        <circle cx="9.5" cy="13" r="1" />
        <circle cx="14.5" cy="13" r="1" />
        <path d="M3 13h2M19 13h2" />
      </g>
    ),
  },
  browser: {
    name: "Browser automation",
    icon: (
      <g {...stroke}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3 9h18M6.5 7h.01M9 7h.01" />
        <path d="M11 13l2 2 4-4" />
      </g>
    ),
  },
  entra: {
    name: "Entra ID",
    icon: (
      <g {...stroke}>
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
        <path d="M17 4l1.5 1.5L21 3" />
      </g>
    ),
  },
  graph: {
    name: "Microsoft Graph",
    icon: (
      <g {...stroke}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="M8 6h8M7 7.5l4 8.5M17 7.5l-4 8.5" />
      </g>
    ),
  },
  sql: {
    name: "SQL",
    icon: (
      <g {...stroke}>
        <ellipse cx="12" cy="6" rx="7" ry="2.5" />
        <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
        <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
      </g>
    ),
  },
  backoff: {
    name: "Rate-limit backoff",
    icon: (
      <g {...stroke}>
        <path d="M3 18h18" />
        <path d="M4 15c3 0 3-5 6-5s3-7 6-7 3 4 5 4" />
      </g>
    ),
  },
  verify: {
    name: "Read-back verification",
    icon: (
      <g {...stroke}>
        <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
        <path d="M18 3v4h-4M6 21v-4h4" />
        <path d="M10 12l1.5 1.5L14.5 10" />
      </g>
    ),
  },
  migration: {
    name: "Data migration",
    icon: (
      <g {...stroke}>
        <rect x="3" y="6" width="6" height="12" rx="1.5" />
        <rect x="15" y="6" width="6" height="12" rx="1.5" />
        <path d="M9 10h6M12 8l2.5 2-2.5 2M15 14H9M12 12l-2.5 2 2.5 2" />
      </g>
    ),
  },
  dupes: {
    name: "Duplicate detection",
    icon: (
      <g {...stroke}>
        <rect x="4" y="4" width="11" height="11" rx="2" />
        <rect x="9" y="9" width="11" height="11" rx="2" />
      </g>
    ),
  },
  governance: {
    name: "Data governance",
    icon: (
      <g {...stroke}>
        <path d="M4 20h16M6 20V9M18 20V9M10 20v-7M14 20v-7" />
        <path d="M3 9l9-5 9 5" />
      </g>
    ),
  },
  runbook: {
    name: "Runbooks",
    icon: (
      <g {...stroke}>
        <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" />
        <path d="M5 17a2 2 0 0 1 2-2h11M9 8h6M9 11h4" />
      </g>
    ),
  },
};

export function isBrand(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(BRAND, key);
}

export function logoName(key: string): string {
  return BRAND[key]?.name ?? CONCEPT[key]?.name ?? key;
}

export default function TechLogo({
  name,
  size = 24,
  className = "",
  glow = false,
}: {
  name: string;
  size?: number;
  className?: string;
  /** Soft brand-tint glow behind a real brand logo. */
  glow?: boolean;
}) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <span
        className={`tl ${className}`}
        style={{ width: size, height: size, ...(glow ? { "--tint": brand.hex } as React.CSSProperties : {}) }}
        data-glow={glow ? "" : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.src} alt="" width={size} height={size} loading="lazy" decoding="async" />
        <style>{`
          .tl{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none}
          .tl img{width:100%;height:100%;object-fit:contain;position:relative}
          .tl[data-glow]::before{content:"";position:absolute;inset:-18%;border-radius:50%;background:var(--tint);opacity:.14;filter:blur(14px)}
        `}</style>
      </span>
    );
  }
  const concept = CONCEPT[name];
  return (
    <span className={`tl ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size} height={size} style={{ color: "var(--ink)" }}>
        {concept?.icon ?? <circle cx="12" cy="12" r="8" {...stroke} />}
      </svg>
    </span>
  );
}
