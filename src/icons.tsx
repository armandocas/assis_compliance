const svgProps = { strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function iconCls(c?: string) {
  return c ?? 'w-5 h-5 flex-shrink-0';
}

export function IconLock({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function IconScale({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="m16 16 3-8 3 8" />
      <path d="m2 16 3-8 3 8" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

export function IconCheckCircle({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconStore({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="M3 9 5 3h14l2 6" />
      <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
    </svg>
  );
}

export function IconChart({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="M3 3v18h18" />
      <path d="M7 16v-5" />
      <path d="M12 16v-9" />
      <path d="M17 16v-2" />
    </svg>
  );
}

export function IconDocument({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

export function IconCookie({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconScaleBalance({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="m16 16 3-8 3 8" />
      <path d="m2 16 3-8 3 8" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

export function IconShield({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}

export function IconList({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

export function IconCart({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function IconArrowReturn({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="M3 10h10a4 4 0 0 1 4 4v2" />
      <path d="m7 6-4 4 4 4" />
      <path d="M7 10h13" />
    </svg>
  );
}

export function IconBuilding({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}

export function IconContract({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
      <path d="M12 3v4h4" />
    </svg>
  );
}

export function IconNodes({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <circle cx="12" cy="5" r="3" />
      <circle cx="6" cy="19" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M12 8v3" />
      <path d="m6 16 6-5" />
      <path d="m18 16-6-5" />
    </svg>
  );
}

export function IconLightbulb({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconCls(className)} {...svgProps}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

import type { ComponentType } from 'react';

export const categoriaIcons: Record<string, ComponentType<{ className?: string }>> = {
  document: IconDocument,
  cookie: IconCookie,
  scale: IconScaleBalance,
  shield: IconShield,
  list: IconList,
  cart: IconCart,
  arrowReturn: IconArrowReturn,
  checkCircle: IconCheckCircle,
  building: IconBuilding,
  contract: IconContract,
  nodes: IconNodes,
};

export function CategoriaIcon({ name, className }: { name: string; className?: string }) {
  const Icon = categoriaIcons[name] ?? IconDocument;
  return <Icon className={className} />;
}
