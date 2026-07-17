import type { Metadata } from "next";
import { ResourceSubmissionForm } from "../../components/ResourceSubmissionForm";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Submit a startup resource — Pioneer",
  description: "Recommend a useful startup program, institution, event, company or public knowledge source to Pioneer.",
  alternates: { canonical: "/en/submit", languages: { "zh-CN": "/submit" } },
};

export default function EnglishSubmitResourcePage() {
  return (
    <main>
      <SiteHeader lang="en" />
      <section className="submission-hero">
        <div>
          <span className="section-index light">CONTRIBUTE TO PIONEER</span>
          <h1>Help useful opportunities<br /><em>reach the right founders.</em></h1>
        </div>
        <aside>
          <strong>We prioritize resources that</strong>
          <ol>
            <li>Can be verified through an official source</li>
            <li>Help founders judge whether it fits them</li>
            <li>Offer a clear timeline, entry point or next action</li>
          </ol>
        </aside>
      </section>
      <section className="submission-shell">
        <header>
          <span>01 / RECOMMEND A RESOURCE</span>
          <h2>Tell us why founders should pay attention.</h2>
          <p>It takes about three minutes. Every submission is reviewed before it can appear on Pioneer.</p>
        </header>
        <ResourceSubmissionForm lang="en" />
      </section>
      <SiteFooter lang="en" />
    </main>
  );
}
