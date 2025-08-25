import React from "react"

type P = { size?: number; className?: string }
const base = "stroke-current"

export function IconSearch({ size=20, className="" }: P){ return (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${base} ${className}`}>
    <circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)}
export function IconHeart({ size=20, className="" }: P){ return (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${base} ${className}`}>
    <path d="M20.8 7.6a5 5 0 0 0-7.1 0L12 9.2l-1.7-1.6a5 5 0 1 0-7.1 7.1L12 22l8.8-7.3a5 5 0 0 0 0-7.1Z" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)}
export function IconCart({ size=20, className="" }: P){ return (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${base} ${className}`}>
    <circle cx="9" cy="20" r="1.5" strokeWidth="2"/><circle cx="18" cy="20" r="1.5" strokeWidth="2"/>
    <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)}
export function IconUser({ size=20, className="" }: P){ return (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${base} ${className}`}>
    <circle cx="12" cy="8" r="4" strokeWidth="2"/><path d="M4 20a8 8 0 0 1 16 0" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)}
export function IconStar({ size=16, className="" }: P){ return (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="m12 17.3-5.16 3.03 1.38-5.93L3 9.97l6.03-.52L12 3.9l2.97 5.55 6.03.52-5.22 4.43 1.38 5.93z"/>
  </svg>
)}
