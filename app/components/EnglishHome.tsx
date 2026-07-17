"use client";

import { FormEvent, useMemo, useState } from "react";
import { AudienceCount } from "./AudienceCounter";
import { ResourceCard } from "./ResourceCard";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { englishCategoryNotes, englishTypeConfig, getEnglishResource } from "../data/english";
import { resources, type ResourceType } from "../data/resources";

type PreviewMode = "featured" | ResourceType;

const categoryStyles: Record<ResourceType, string> = {
  program: "category-blue",
  organization: "category-mint",
  event: "category-orange",
  startup: "category-lilac",
};

export function EnglishHome() {
  const [query, setQuery] = useState("");
  const [activePreview, setActivePreview] = useState<PreviewMode>("featured");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      if (activePreview === "featured") return resources.filter((resource) => resource.featured);
      return resources.filter((resource) => resource.type === activePreview);
    }
    return resources.filter((resource) => {
      const english = getEnglishResource(resource.slug);
      const searchable = [
        resource.name,
        english?.location,
        english?.description,
        english?.kind,
        ...(english?.tags ?? []),
      ].join(" ").toLowerCase();
      return searchable.includes(normalized);
    });
  }, [activePreview, query]);

  const previewTitles: Record<PreviewMode, string> = {
    featured: "Editor&apos;s Picks",
    program: "Open Program Samples",
    organization: "Institution Samples",
    event: "Event Samples",
    startup: "Startup Project Samples",
  };

  const directoryTarget = activePreview === "featured"
    ? { href: "#categories", label: "Explore all directories" }
    : { href: englishTypeConfig[activePreview].path, label: `View all ${englishTypeConfig[activePreview].title}` };

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  function applyQuickSearch(term: string) {
    setActivePreview("featured");
    setQuery(term);
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <SiteHeader lang="en" />

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="kicker"><span className="pulse" /> GLOBAL STARTUP RESOURCE DIRECTORY</div>
          <h1><span>The world is large.</span><span><em>Opportunity</em> should be easier to read.</span></h1>
          <p className="hero-intro">
            Search startup events, incubators, accelerator programs, innovation institutions and new startup projects from around the world.
            No account required. Read the brief, compare the fit, then decide what to do.
          </p>

          <form className="search-box" onSubmit={handleSearch} role="search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="resource-search-en">Search startup resources</label>
            <input
              id="resource-search-en"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setActivePreview("featured"); }}
              placeholder="Search country, city, sector or institution..."
            />
            <button type="submit"><span className="search-full">Search briefs</span><span className="search-short">Search</span></button>
          </form>

          <div className="popular-searches" aria-label="Popular searches">
            <span>Popular:</span>
            {["AI", "Global teams", "Individual applicants", "Tech conference"].map((term) => (
              <button key={term} type="button" onClick={() => applyQuickSearch(term)}>{term}</button>
            ))}
          </div>
        </div>

        <aside className="atlas-card" aria-label="Global startup resource preview">
          <div className="atlas-topline"><span>GLOBAL SIGNAL MAP</span><span className="live-indicator">CURATED</span></div>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="atlas-scan" />
          <div className="globe" aria-hidden="true">
            <span className="globe-line globe-line-one" /><span className="globe-line globe-line-two" />
            <span className="landmass landmass-one" /><span className="landmass landmass-two" /><span className="landmass landmass-three" />
          </div>
          <div className="atlas-core"><strong>{resources.length}</strong><span>curated briefs</span></div>
          <div className="map-pin pin-singapore"><span>Singapore</span><strong>01</strong></div>
          <div className="map-pin pin-london"><span>London</span><strong>02</strong></div>
          <div className="map-pin pin-berlin"><span>Paris</span><strong>02</strong></div>
          <div className="map-pin pin-sf"><span>San Francisco</span><strong>05</strong></div>
          <div className="atlas-footer"><span>8 countries and regions</span><span>official sources linked</span></div>
        </aside>
      </section>

      <section className="metrics" aria-label="Platform metrics">
        <div className="visitor-metric"><strong><AudienceCount /></strong><span>unique visitors</span></div>
        <div><strong>{resources.length}</strong><span>curated briefs</span></div>
        <div><strong>4</strong><span>resource directories</span></div>
        <div><strong>6</strong><span>editor&apos;s picks</span></div>
        <p>The homepage helps you discover. The directories help you understand, compare and act.</p>
      </section>

      <section className="section categories-section" id="categories">
        <div className="section-heading">
          <div><span className="section-index">01 / EXPLORE</span><h2>Start With The Resource You Need</h2></div>
          <p>Not a pile of links. Each resource type is organized so founders can understand and compare it.</p>
        </div>
        <div className="category-grid">
          {(Object.keys(englishTypeConfig) as ResourceType[]).map((type) => {
            const category = englishTypeConfig[type];
            const count = resources.filter((resource) => resource.type === type).length;
            return (
              <a className={`category-card ${categoryStyles[type]}`} href={category.path} key={type}>
                <span className="category-eyebrow">{category.eyebrow}</span>
                <span className="category-count">{count}</span>
                <span className="category-title">{category.title} <i aria-hidden="true">→</i></span>
                <span className="category-note">{englishCategoryNotes[type]}</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="section resources-section" id="resources">
        <div className="section-heading resources-heading">
          <div>
            <span className="section-index">02 / EDITOR&apos;S PICKS</span>
            <h2>{query ? `Results for "${query}"` : previewTitles[activePreview]}</h2>
          </div>
          <span className="updated-note">
            <i /> {query ? `${searchResults.length} matching entries` : `${searchResults.length} homepage samples`}
          </span>
        </div>

        <div className="filter-row" aria-label="Homepage content switcher">
          <div className="filter-buttons">
            {([
              ["featured", "Featured"],
              ["program", "Programs"],
              ["organization", "Institutions"],
              ["event", "Events"],
              ["startup", "Startups"],
            ] as Array<[PreviewMode, string]>).map(([mode, label]) => (
              <button
                type="button"
                key={mode}
                className={activePreview === mode && !query ? "active" : ""}
                onClick={() => { setActivePreview(mode); setQuery(""); }}
              >
                {label}
              </button>
            ))}
          </div>
          <a className="result-directory-link" href={directoryTarget.href}>{directoryTarget.label} →</a>
        </div>

        {searchResults.length ? (
          <div className="resource-grid">
            {searchResults.map((resource) => <ResourceCard resource={resource} lang="en" key={resource.id} />)}
          </div>
        ) : (
          <div className="empty-state"><span>No matching resources found</span><button type="button" onClick={() => setQuery("")}>Clear search</button></div>
        )}

        <a className="all-resources" href={directoryTarget.href}>{directoryTarget.label} <span aria-hidden="true">→</span></a>
      </section>

      <section className="cities-section" id="cities">
        <div className="cities-copy">
          <span className="section-index light">03 / STARTUP ECOSYSTEMS</span>
          <h2>An institution is not just a name. It is a set of usable entry points.</h2>
          <p>Understand what an institution provides, who it serves and how founders actually enter before you invest time in applying.</p>
          <a className="cities-link" href="/en/organizations">Explore institutions →</a>
        </div>
        <div className="city-list" aria-label="Startup ecosystems">
          {["Singapore", "London", "Paris", "Berkeley", "San Francisco"].map((city, index) => (
            <a href="/en/organizations" key={city}>
              <span>0{index + 1}</span><strong>{city}</strong>
              <i>{city}</i><b>→</b>
            </a>
          ))}
        </div>
      </section>

      <section className="submit-section" id="submit">
        <span className="submit-kicker">KNOW A GREAT RESOURCE?</span>
        <h2>Help valuable startup opportunities become easier to understand.</h2>
          <p>Recommend a program, investor, institution, event or public resource. We review sources before publishing.</p>
        <button type="button">Recommend a source ↗</button>
      </section>

      <SiteFooter lang="en" />
    </main>
  );
}
