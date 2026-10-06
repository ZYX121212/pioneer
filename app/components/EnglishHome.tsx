"use client";

import { homeRegions, matchesHomeRegion } from "../lib/homeDiscovery";
import { HomeFeatures, HomeIcon, HomeMetrics, HomeSignalPanel } from "./HomeVisuals";

import { resourcePreview } from "../lib/resourceFreshness";
import { useCommunityResources } from "../lib/useCommunityResources";
import { WeeklySpotlight } from "./WeeklySpotlight";
import { FormEvent, useMemo, useState } from "react";
import { trackAudienceEvent } from "./AudienceCounter";
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
  const community = useCommunityResources("en");
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("all");
  const [activePreview, setActivePreview] = useState<PreviewMode>("featured");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized && activeRegion === "all") {
      return resourcePreview(resources, activePreview);
    }
    return [...resources, ...community.resources].filter((resource) => {
      const english = getEnglishResource(resource.slug);
      const searchable = [
        resource.name,
        english?.location ?? resource.location,
        english?.description ?? resource.description,
        english?.kind ?? resource.kind,
        ...(english?.tags ?? resource.tags),
      ].join(" ").toLowerCase();
      return searchable.includes(normalized) && matchesHomeRegion(resource, activeRegion);
    });
  }, [activePreview, query, activeRegion, community.resources]);

  const previewTitles: Record<PreviewMode, string> = {
    featured: "Editor's Picks",
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
    trackAudienceEvent("search:submit", query.trim() || "empty");
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  function applyQuickSearch(term: string) {
    setActivePreview("featured");
    setActiveRegion("all");
    setQuery(term);
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="pioneer-home">
      <SiteHeader lang="en" home />

      <section className="hero hero-en" id="top">
        <div className="hero-copy">
          <div className="kicker"><span className="pulse" /> GLOBAL STARTUP RESOURCE DIRECTORY</div>
          <h1 className="hero-title-en"><span>Global startup</span><span><em>resources</em></span><span>and guides.</span></h1>
          <p className="hero-intro">
            Search startup events, incubators, accelerator programs, innovation institutions and new startup projects from around the world.
            Public briefs need no account. Sign in to save resources and use your workspace.
          </p>

          <form className="search-box" onSubmit={handleSearch} role="search">
            <span className="search-icon"><HomeIcon kind="search" /></span>
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
              <button key={term} type="button" aria-pressed={query === term} onClick={() => applyQuickSearch(term)}>{term}</button>
            ))}
          </div>
          <HomeFeatures lang="en" />
        </div>

        <HomeSignalPanel lang="en" activeRegion={activeRegion} onRegion={(region) => { setActiveRegion(region); setQuery(""); setActivePreview("featured"); trackAudienceEvent("search:region", region); document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" }); }} />
      </section>

      <HomeMetrics lang="en" />

      <WeeklySpotlight lang="en" />

      <section className="section categories-section" id="categories">
        <div className="section-heading">
          <div><span className="section-index">01 / EXPLORE</span><h2>Start With The Resource You Need</h2></div>
          <p>Programs, institutions, events and projects, with eligibility, dates and official sources.</p>
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
            <i /> {query || activeRegion !== "all" ? `${searchResults.length} matching entries` : `${searchResults.length} homepage samples`}
          </span>
        </div>

        {activeRegion !== "all" && (<div className="home-region-filter" role="status">{homeRegions.find(region => region.id === activeRegion)?.en} · Documented resource locations<button type="button" onClick={() => setActiveRegion("all")}> Clear region filter</button></div>)}

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
                onClick={() => { setActivePreview(mode); setQuery(""); setActiveRegion("all"); }}
              >
                {label}
              </button>
            ))}
          </div>
          <a className="result-directory-link" href={directoryTarget.href}>{directoryTarget.label} →</a>
        </div>

        {(query.trim() || activeRegion !== "all") && community.state === "loading" && <p role="status">Loading community resources; curated matches are shown below.</p>}
        {(query.trim() || activeRegion !== "all") && community.state === "error" && <p role="alert">Community resources could not be loaded. These results cover curated briefs only. <button type="button" onClick={community.retry}>Retry community search</button></p>}
        {searchResults.length ? (
          <div className="resource-grid">
            {searchResults.map((resource) => <ResourceCard resource={resource} lang="en" key={resource.id} />)}
          </div>
        ) : (
          <div className="empty-state"><span>No matching resources found</span><button type="button" onClick={() => { setQuery(""); setActiveRegion("all"); }}>Clear search</button></div>
        )}

        <a className="all-resources" href={directoryTarget.href}>{directoryTarget.label} <span aria-hidden="true">→</span></a>
      </section>

      <section className="cities-section" id="cities">
        <div className="cities-copy">
          <span className="section-index light">03 / STARTUP ECOSYSTEMS</span>
          <h2>Institutions and application routes</h2>
          <p>Review services, eligibility, programs and official application links.</p>
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
        <h2>Submit a startup resource</h2>
          <p>Recommend a program, investor, institution, event or public resource. We review sources before publishing.</p>
        <a href="/en/submit" data-audience-event="submit-resource:intent" data-audience-target="home-submit-en">Recommend a source ↗</a>
      </section>

      <SiteFooter lang="en" />
    </main>
  );
}
