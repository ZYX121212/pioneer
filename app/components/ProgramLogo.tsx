"use client";
/* eslint-disable @next/next/no-img-element -- Original local vector and small brand assets, displayed without cropping. */
import { useState } from "react";
import { programLogos } from "../lib/programLogos";
import { CardFactIcon } from "./CardFactIcon";
export function ProgramLogo({ slug, name }: { slug: string; name: string }) {
  const logo = programLogos[slug];
  const [failed, setFailed] = useState(false);
  return <div className={`program-logo official-program-logo ${logo?.treatment ?? "unavailable"}`}>
    {logo && !failed ? <img key={logo.file} src={`/programs/logos/${logo.file}`} alt={`${logo.brand} logo`} width={80} height={64} loading="lazy" decoding="async" onError={() => setFailed(true)}/> : <span role="img" aria-label={`${name} — Logo unavailable`}><CardFactIcon kind="building"/></span>}
  </div>;
}
