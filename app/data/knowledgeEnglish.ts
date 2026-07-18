import { additionalEnglishGuides } from "./additionalGuides";

export type EnglishGuideSection = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  points: { title: string; body: string }[];
};

export type EnglishGuide = {
  slug: string;
  number: string;
  stage: string;
  title: string;
  description: string;
  duration: string;
  updated: string;
  outcome: string[];
  sections: EnglishGuideSection[];
  worksheet: string[];
  decision: { continue: string; adjust: string; stop: string };
  sources: { publisher: string; title: string; use: string; url: string }[];
};

export const englishGuides: EnglishGuide[] = [
  {
    slug: "find-the-real-problem", number: "01", stage: "Idea validation",
    title: "Is this a real problem—or simply a solution you like?",
    description: "Pause product work and use observed behavior to decide whether a problem deserves more investment.", duration: "About 35 minutes", updated: "2026.07.16",
    outcome: ["A precise problem statement", "A core-assumption card", "A three-day validation plan"],
    sections: [
      { id: "signal", eyebrow: "STARTING SIGNAL", title: "First decide whether this is the right guide for you", lead: "Use this guide when the idea sounds exciting but the evidence is still mostly opinions, compliments or market-size slides.", points: [
        { title: "You know the product, not the problem", body: "You can describe features in detail but cannot reconstruct the last time a user experienced the problem." },
        { title: "Interest is not commitment", body: "‘I would use this’ is weak evidence. Time, money, data, an introduction or a scheduled trial are stronger signals." },
        { title: "Write down what would prove you wrong", body: "A useful test can invalidate the idea. If every answer counts as success, the test is only reassurance." },
      ]},
      { id: "principle", eyebrow: "EVIDENCE LADDER", title: "A real problem leaves behavioral traces", lead: "Move from attitudes to past behavior, existing workarounds and real commitments.", points: [
        { title: "Past behavior", body: "Ask when it last happened, what triggered it, who was involved and what the consequence was." },
        { title: "Existing alternatives", body: "Spreadsheets, manual work, agencies, internal tools and doing nothing all reveal the current trade-off." },
        { title: "Cost and ownership", body: "Find the person who loses time, money, opportunity, safety or trust—and the person responsible for the result." },
      ]},
      { id: "worthiness", eyebrow: "PROBLEM QUALITY", title: "Decide whether it is worth building a company around", lead: "Pain alone is not enough. A startup problem also needs frequency or severity, reachability, a responsible buyer and a reason the window is open now.", points: [
        { title: "Pain × frequency", body: "Frequent moderate pain and rare catastrophic pain can both matter. Vague inconvenience usually does not." },
        { title: "Reachability", body: "You need a narrow group with recognizable roles, channels or gathering places—not a broad demographic label." },
        { title: "Timing", body: "A technology, regulation, cost or behavior shift should explain why a previously tolerated problem can be solved now." },
      ]},
      { id: "observe", eyebrow: "FROM IDEA TO OBSERVATION", title: "Rewrite the pitch as something you can observe", lead: "Replace ‘people need…’ with a specific person, event, current response and measurable consequence.", points: [
        { title: "Person", body: "Who experiences the problem and in what role?" }, { title: "Event", body: "What concrete moment triggers it?" }, { title: "Consequence", body: "What happens if nothing changes?" },
      ]},
      { id: "interview", eyebrow: "EVIDENCE, NOT COMPLIMENTS", title: "Reconstruct a real incident", lead: "Do not present your solution. Ask for the most recent event and follow the sequence until you understand the workaround and cost.", points: [
        { title: "Ask for specifics", body: "‘Tell me about the last time’ is stronger than ‘Would you use…?’" }, { title: "Look for contradiction", body: "Ask when the problem does not matter and why the current method is sometimes good enough." }, { title: "Record facts separately", body: "Separate direct observations, participant interpretations and your own assumptions." },
      ]},
      { id: "experiment", eyebrow: "THREE-DAY TEST", title: "Choose the smallest test close to real behavior", lead: "Interviews are not always the answer. A concierge service, landing-page commitment, manual prototype or paid pilot may reveal more.", points: [
        { title: "Day 1 · Recruit", body: "Find five people who recently experienced the event." }, { title: "Day 2 · Test", body: "Run one behavior-based experiment with a threshold defined in advance." }, { title: "Day 3 · Decide", body: "Compare evidence with the threshold and document the strongest counter-evidence." },
      ]},
    ],
    worksheet: ["Target person and triggering event", "Current workaround and cost", "Most dangerous assumption", "Test method and success threshold", "Evidence that would make us stop"],
    decision: { continue: "Repeated behavior, meaningful cost and a reachable owner are visible.", adjust: "The pain is real, but the segment, timing or buyer is different from your first assumption.", stop: "People do not experience the event, accept the status quo or will not make any commitment." },
    sources: [
      { publisher: "Y Combinator", title: "How to Talk to Users", use: "Past behavior and concrete user incidents.", url: "https://www.ycombinator.com/library/6g-how-to-talk-to-users" },
      { publisher: "Strategyzer", title: "Validate Your Ideas with the Test Card", use: "Assumptions, experiments, measures and thresholds.", url: "https://www.strategyzer.com/library/validate-your-ideas-with-the-test-card" },
      { publisher: "Harvard Business Review", title: "Know Your Customers’ Jobs to Be Done", use: "Understanding the situation behind a choice.", url: "https://hbr.org/2016/09/know-your-customers-jobs-to-be-done" },
    ],
  },
  {
    slug: "first-user-interview", number: "02", stage: "User validation", title: "What should you ask in your first user interview?",
    description: "Recruit the right participant, run a non-leading conversation and turn stories into usable evidence.", duration: "About 25 minutes", updated: "2026.07.16",
    outcome: ["A recruiting plan", "A 30-minute interview guide", "An evidence record"],
    sections: [
      { id: "before", eyebrow: "BEFORE THE CALL", title: "Decide what you need to learn", lead: "One interview should answer one uncertain decision, not collect general inspiration.", points: [{ title: "Learning goal", body: "Name the decision this conversation will inform." }, { title: "Target participant", body: "Recruit people who recently performed the behavior, not friends who like the idea." }, { title: "No demo first", body: "A product demo changes the conversation from discovery to evaluation." }]},
      { id: "recruit", eyebrow: "RECRUITING", title: "Find people close to the behavior", lead: "Use second-degree introductions, professional communities, targeted outreach or the physical context where the behavior occurs.", points: [{ title: "Be specific", body: "Ask for people who experienced a defined event in a recent time window." }, { title: "Set expectations", body: "Explain that this is research, how long it takes and how notes or recordings will be used." }, { title: "Respect refusal", body: "Avoid repeated contact and follow platform, privacy and consent rules." }]},
      { id: "agenda", eyebrow: "30-MINUTE FLOW", title: "Move from context to a real event", lead: "Build context, reconstruct the incident, understand priority, search for counter-evidence and agree a next step.", points: [{ title: "0–8 min", body: "Set boundaries and understand the participant’s role and environment." }, { title: "8–20 min", body: "Rebuild the latest event step by step, including people, tools, time and cost." }, { title: "20–30 min", body: "Explore alternatives, decision ownership, counterexamples and a possible follow-up." }]},
      { id: "questions", eyebrow: "BETTER QUESTIONS", title: "Replace forecasts with facts", lead: "Questions about the future invite imagination. Questions about the past reveal actual priorities.", points: [{ title: "Instead of ‘Would you use it?’", body: "Ask: ‘How did you handle this the last time?’" }, { title: "Instead of ‘How much would you pay?’", body: "Ask what the current method costs and who approves that spend." }, { title: "Instead of ‘Do you like this feature?’", body: "Ask what part of the existing workflow fails and what they do next." }]},
      { id: "conversation", eyebrow: "FOLLOW THE THREAD", title: "Use their nouns and verbs", lead: "Ask short follow-ups, tolerate silence and return to the sequence when the discussion becomes abstract.", points: [{ title: "Clarify", body: "‘What do you mean by difficult?’" }, { title: "Quantify", body: "‘How often, how long and how many people?’" }, { title: "Challenge gently", body: "‘When is the current method good enough?’" }]},
      { id: "evidence", eyebrow: "CAPTURE EVIDENCE", title: "Record the event chain, not only quotes", lead: "A memorable quote can still be weak evidence. Preserve context and opposing signals.", points: [{ title: "Fact", body: "What happened, when, where and with which tool?" }, { title: "Meaning", body: "How did the participant interpret the event?" }, { title: "Counter-evidence", body: "What suggests the problem is less urgent or the proposed segment is wrong?" }]},
      { id: "synthesis", eyebrow: "AFTER FIVE INTERVIEWS", title: "Look for repeated mechanisms", lead: "Do not vote on feature requests. Compare triggers, workarounds, costs, owners and commitments across participants.", points: [{ title: "Continue", body: "The same event and cost repeat across the intended segment." }, { title: "Recruit again", body: "Participants were too broad or too far from the behavior." }, { title: "Change the hypothesis", body: "A different role, moment or consequence consistently appears." }]},
    ],
    worksheet: ["Learning goal", "Participant and recent event", "Event timeline", "Current workaround and cost", "Counter-evidence", "Agreed next step"],
    decision: { continue: "Repeated events, costs and ownership are visible.", adjust: "The event is real but belongs to another segment or workflow.", stop: "Answers remain hypothetical and no relevant behavior can be found." },
    sources: [{ publisher: "Y Combinator", title: "How to Talk to Users", use: "Concrete past behavior instead of feature pitching.", url: "https://www.ycombinator.com/library/6g-how-to-talk-to-users" }, { publisher: "Nielsen Norman Group", title: "User Interviews", use: "Interview structure and qualitative-research boundaries.", url: "https://www.nngroup.com/articles/user-interviews/" }, { publisher: "Rob Fitzpatrick", title: "The Mom Test", use: "Avoiding compliments and hypothetical feedback.", url: "https://www.momtestbook.com/" }],
  },
  {
    slug: "define-your-mvp", number: "03", stage: "Product validation", title: "What exactly belongs in your MVP?",
    description: "Start from the riskiest assumption, deliver one complete outcome and run a two-week validation sprint.", duration: "About 30 minutes", updated: "2026.07.16",
    outcome: ["One riskiest assumption", "A strict MVP boundary", "A two-week test plan"],
    sections: [
      { id: "signal", eyebrow: "BEFORE BUILDING", title: "An MVP is useful only when a decision is blocked", lead: "Do not build because interviews feel finished. Build when a specific product assumption can no longer be tested credibly without an experience.", points: [{ title: "Problem evidence exists", body: "You can show repeated events, workarounds and consequences." }, { title: "The remaining risk is product behavior", body: "You need to learn whether users can obtain or value an outcome." }, { title: "A threshold is defined", body: "You know what behavior will justify continuing." }]},
      { id: "risk", eyebrow: "RISK FIRST", title: "Choose the assumption most likely to kill the idea", lead: "The MVP should test the weakest load-bearing assumption, not showcase the easiest features.", points: [{ title: "Value risk", body: "Will the user care enough to change behavior?" }, { title: "Usability risk", body: "Can they reach the result without continuous explanation?" }, { title: "Feasibility risk", body: "Can the critical result be delivered safely and reliably?" }]},
      { id: "boundary", eyebrow: "ONE COMPLETE OUTCOME", title: "Make the scope narrow, not the result incomplete", lead: "Serve one user, one moment and one result. Remove breadth, automation and polish before removing the core outcome.", points: [{ title: "Include", body: "Everything required for the user to complete the target outcome." }, { title: "Manual is allowed", body: "Back-office work can be manual when the boundary and privacy implications are clear." }, { title: "Exclude", body: "Secondary personas, edge cases, dashboards, integrations and premature scale." }]},
      { id: "types", eyebrow: "DIFFERENT MVP SHAPES", title: "Minimum means different things by business type", lead: "Software, hardware, marketplaces and regulated products place risk in different parts of the system.", points: [{ title: "B2B software", body: "A concierge workflow may test value before full integration." }, { title: "Hardware", body: "Prototype the critical physical interaction and safety constraint before manufacturing breadth." }, { title: "Regulated products", body: "Never use ‘MVP’ to bypass safety, evidence or compliance requirements." }]},
      { id: "sprint", eyebrow: "TWO-WEEK SPRINT", title: "Build around a learning deadline", lead: "The sprint ends with a decision, not a feature-complete product.", points: [{ title: "Days 1–2", body: "Lock the user, event, outcome, risk and success threshold." }, { title: "Days 3–8", body: "Build only the path required for the test." }, { title: "Days 9–14", body: "Observe real use, collect counter-evidence and decide." }]},
      { id: "decision", eyebrow: "SHIP OR STOP", title: "Judge behavior, not effort", lead: "Hours spent building do not make weak evidence stronger.", points: [{ title: "Continue", body: "Users complete the outcome and make a meaningful commitment." }, { title: "Adjust", body: "The outcome matters but the workflow or segment is wrong." }, { title: "Stop", body: "Users avoid the experience or the critical result cannot be delivered responsibly." }]},
    ],
    worksheet: ["Target user and moment", "Riskiest assumption", "Complete outcome", "Included / manual / excluded", "Two-week threshold", "Decision date"],
    decision: { continue: "Target users complete the outcome and move forward.", adjust: "Value exists, but scope, workflow or segment needs changing.", stop: "The outcome creates no meaningful behavior or cannot be delivered safely." },
    sources: [{ publisher: "Eric Ries", title: "The Lean Startup", use: "MVP as a learning mechanism, not a small product checklist.", url: "http://theleanstartup.com/" }, { publisher: "Strategyzer", title: "Testing Business Ideas", use: "Assumption prioritization and experiment design.", url: "https://www.strategyzer.com/books/testing-business-ideas-david-j-bland" }],
  },
  {
    slug: "find-your-first-ten-users", number: "04", stage: "Early acquisition", title: "Where do your first ten users come from?",
    description: "Define a narrow segment, build a 30-name list and personally move the first users through the product.", duration: "About 25 minutes", updated: "2026.07.16",
    outcome: ["A narrow first-user definition", "A 30-name prospect list", "A seven-day outreach pipeline"],
    sections: [
      { id: "signal", eyebrow: "DIAGNOSE THE BLOCK", title: "Do not ask for growth before you can recruit manually", lead: "At the beginning, distribution is a founder learning loop.", points: [{ title: "No conversations", body: "The segment may be too broad or the channel too passive." }, { title: "Replies but no trials", body: "The problem statement or call to action may be weak." }, { title: "Trials but no return", body: "The product outcome or onboarding needs investigation." }]},
      { id: "segment", eyebrow: "NARROW FIRST", title: "Choose a group you can name", lead: "A useful first segment shares a role, triggering event, current workaround and reachable channel.", points: [{ title: "Role", body: "Describe what the person is responsible for." }, { title: "Trigger", body: "Name the event that makes action timely." }, { title: "Channel", body: "Identify where these people already gather or can be introduced." }]},
      { id: "list", eyebrow: "30 REAL NAMES", title: "Build a list before building a funnel", lead: "Use existing relationships, second-degree introductions, professional directories, communities and physical contexts.", points: [{ title: "Ten warm", body: "People you or a trusted contact can reach." }, { title: "Ten contextual", body: "People visible in relevant communities or events." }, { title: "Ten targeted", body: "Carefully researched cold prospects with a specific reason to contact." }]},
      { id: "outreach", eyebrow: "PERSONAL OUTREACH", title: "Lead with relevance, not a pitch", lead: "Show why this person fits, what you are learning and the smallest honest next step.", points: [{ title: "Context", body: "Reference a role, event or visible workflow." }, { title: "Reason", body: "Explain the narrow problem you are studying." }, { title: "Ask", body: "Request a short conversation or specific trial, not vague feedback." }]},
      { id: "pipeline", eyebrow: "TRACK MOVEMENT", title: "Measure progress between stages", lead: "Exposure is not progress. Track names, contacts, replies, conversations, trials, returns and commitments.", points: [{ title: "Record reasons", body: "A rejection with a reason can improve the segment." }, { title: "Follow up with context", body: "Each message should add information or clarify a decision." }, { title: "Review weekly", body: "Change one variable at a time: segment, message, channel or experience." }]},
      { id: "concierge", eyebrow: "DO THINGS THAT DO NOT SCALE", title: "Personally deliver the first result", lead: "Manual onboarding and direct support reveal the hidden workflow before automation.", points: [{ title: "Observe", body: "Watch where the user pauses, improvises or asks for help." }, { title: "Deliver", body: "Ensure the promised result is real even if operations are manual." }, { title: "Document", body: "Turn repeated manual steps into future product requirements." }]},
    ],
    worksheet: ["First-user definition", "30 names and source channel", "Personal outreach message", "Pipeline stage", "Reason for reply or rejection", "Seven-day target"],
    decision: { continue: "Relevant people reply, try and move to a clear next step.", adjust: "Interest exists but another segment, channel or ask performs better.", stop: "Repeated targeted outreach produces neither problem recognition nor action." },
    sources: [{ publisher: "Y Combinator", title: "Do Things That Don’t Scale", use: "Founder-led recruiting and manual delivery.", url: "https://paulgraham.com/ds.html" }, { publisher: "First Round Review", title: "Early Customer Development", use: "Building a repeatable learning pipeline from direct outreach.", url: "https://review.firstround.com/" }],
  },
  {
    slug: "test-your-cofounder", number: "07", stage: "Team formation", title: "How should you test a potential cofounder?",
    description: "Decide whether you need a cofounder, work together on a real four-week project and document the hard agreements.", duration: "About 35 minutes", updated: "2026.07.16",
    outcome: ["A cofounder-need decision", "A four-week working test", "A written alignment record"],
    sections: [
      { id: "need", eyebrow: "START WITH NEED", title: "Do you need a cofounder—or another kind of collaborator?", lead: "A cofounder accepts long-term company risk and responsibility. Skills alone can often be supplied by an employee, advisor, contractor or partner.", points: [{ title: "Long-term ownership", body: "The missing role will shape core decisions for years." }, { title: "Full commitment", body: "The person is able and willing to make the company a primary responsibility." }, { title: "Shared downside", body: "Both people accept uncertainty, reduced cash and difficult decisions." }]},
      { id: "fit", eyebrow: "FOUR FITS", title: "Test more than personality", lead: "Evaluate mission, capability, operating style and risk alignment.", points: [{ title: "Mission", body: "Do you agree on what company should exist and what not to build?" }, { title: "Execution", body: "Are responsibilities complementary and individually owned?" }, { title: "Risk", body: "Align on time, cash, location, family constraints and acceptable outcomes." }]},
      { id: "trial", eyebrow: "WORK BEFORE COMMITMENT", title: "Run a four-week project with real consequences", lead: "A fictional case reveals presentation skill. Real users, deadlines, sales promises and technical failure reveal working behavior.", points: [{ title: "Week 1 · Define", body: "Choose one measurable company task and divide ownership." }, { title: "Weeks 2–3 · Execute", body: "Ship, talk to users and make trade-offs under time pressure." }, { title: "Week 4 · Review", body: "Examine reliability, conflict, transparency, speed and recovery." }]},
      { id: "equity", eyebrow: "EQUITY FOLLOWS COMMITMENT", title: "Discuss the future, not only who had the idea", lead: "Roles, full-time dates, future contribution, cash, vesting and departure scenarios belong in the same conversation.", points: [{ title: "Near-equal", body: "Often sensible when commitment, responsibility and risk are genuinely similar." }, { title: "Unequal", body: "Needs a clear explanation based on material differences in future contribution or risk." }, { title: "Not a founder yet", body: "Limited service or unresolved commitment may fit another relationship." }]},
      { id: "agreement", eyebrow: "WRITE IT DOWN", title: "Document what happens when things change", lead: "A clear agreement protects the relationship by making assumptions discussable.", points: [{ title: "Roles and decisions", body: "Who owns which decisions and how are deadlocks resolved?" }, { title: "Vesting and departure", body: "What happens if someone leaves, underperforms or changes commitment?" }, { title: "IP and confidentiality", body: "Confirm ownership of prior and future work with local professional advice." }]},
      { id: "decision", eyebrow: "TEAM DECISION", title: "Make an explicit decision after the trial", lead: "Do not let an ambiguous collaboration drift into an implied founding relationship.", points: [{ title: "Commit", body: "Responsibilities, trust and risk are aligned and documented." }, { title: "Extend the test", body: "A specific uncertainty remains and another real task can resolve it." }, { title: "Choose another form", body: "The person adds value but does not fit founder-level commitment." }]},
    ],
    worksheet: ["Why a cofounder is necessary", "Four-week real task", "Role and decision ownership", "Conflict observations", "Commitment and cash expectations", "Equity, vesting and departure topics"],
    decision: { continue: "Real work shows reliability, candor, complementary ownership and aligned risk.", adjust: "The collaboration has value but needs a longer test or different role.", stop: "Commitment, integrity, conflict behavior or responsibility is persistently misaligned." },
    sources: [{ publisher: "Y Combinator", title: "How to Split Equity Among Co-Founders", use: "Future contribution, commitment and vesting principles.", url: "https://www.ycombinator.com/library/5x-how-to-split-equity-among-co-founders" }, { publisher: "Cooley GO", title: "Founder Basics", use: "Professional context for formation, IP and equity documentation.", url: "https://www.cooleygo.com/" }],
  },
  {
    slug: "decide-whether-to-fundraise", number: "09", stage: "Funding", title: "Should you raise money now?",
    description: "Work backward from the next company milestone, compare funding routes and decide what capital must accomplish.", duration: "About 30 minutes", updated: "2026.07.16",
    outcome: ["A funding-need diagnosis", "A milestone-based amount", "A raise / wait decision"],
    sections: [
      { id: "need", eyebrow: "NEED, NOT FASHION", title: "Capital is useful when it buys a necessary milestone", lead: "Fundraising is not a default stage of company building. It adds dilution, governance, expectations and a new operating process.", points: [{ title: "Timing advantage", body: "Capital can capture a window that organic growth cannot reach in time." }, { title: "Necessary upfront cost", body: "Hardware, regulation, research or infrastructure may require investment before revenue." }, { title: "Repeatable engine", body: "Funding can scale something already showing evidence; it rarely repairs a missing market." }]},
      { id: "milestone", eyebrow: "DEFINE THE MILESTONE", title: "Say what becomes true after the money is spent", lead: "A funding milestone should reduce a major company risk and be observable by a specific date.", points: [{ title: "Product", body: "A critical technical or safety result is demonstrated." }, { title: "Market", body: "A repeatable sales, retention or usage signal is established." }, { title: "Company", body: "The team reaches a position that unlocks sustainability or the next financing choice." }]},
      { id: "amount", eyebrow: "BUILD THE AMOUNT", title: "Calculate from work, time and contingency", lead: "Do not begin with a round label. Build a monthly operating plan from the milestone.", points: [{ title: "People and operations", body: "List the capabilities and operating costs truly required." }, { title: "Time to milestone", body: "Include recruiting, procurement, sales and regulatory lead times." }, { title: "Contingency", body: "Account for delay without turning uncertainty into an unlimited budget." }]},
      { id: "routes", eyebrow: "COMPARE CAPITAL", title: "Equity is one route, not the only route", lead: "Revenue, grants, debt, strategic partnerships, angels and venture capital create different constraints.", points: [{ title: "Revenue", body: "Strongest validation and no dilution, but may limit speed or product exploration." }, { title: "Grant / strategic", body: "Useful for research or market access, with eligibility and partnership constraints." }, { title: "Equity", body: "Accepts high uncertainty and speed, while changing ownership and governance." }]},
      { id: "ready", eyebrow: "FUNDRAISING READINESS", title: "Evidence and process must support the story", lead: "Investors will test the problem, market, team, traction, economics and use of funds.", points: [{ title: "Evidence", body: "Show customer behavior, technical results or a credible unique advantage." }, { title: "Narrative", body: "Connect the problem, timing, team and milestone without hiding uncertainty." }, { title: "Process", body: "Prepare a target list, materials, data room, references and a fallback plan." }]},
      { id: "decision", eyebrow: "RAISE OR WAIT", title: "Choose the option that preserves the company’s ability to learn", lead: "A successful raise is not the goal; reaching the next valuable state is.", points: [{ title: "Raise now", body: "The milestone matters, timing is real and evidence supports the cost." }, { title: "Wait", body: "A short period of product or customer evidence can materially improve the decision." }, { title: "Use another route", body: "Revenue, grant, debt or partnership fits the risk better than venture equity." }]},
    ],
    worksheet: ["Next milestone and risk removed", "Work required", "Monthly cost and duration", "Compared funding routes", "Evidence already available", "Fallback if the raise fails"],
    decision: { continue: "Capital has a clear job, the milestone is credible and the company is ready for the process.", adjust: "The milestone is valid but another amount, timing or capital source fits better.", stop: "The raise mainly funds unresolved demand or has no measurable destination." },
    sources: [{ publisher: "Y Combinator", title: "A Guide to Seed Fundraising", use: "Fundraising process, milestones and investor preparation.", url: "https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising" }, { publisher: "U.S. SEC", title: "Small Business Capital Raising", use: "Regulatory context; local professional advice remains necessary.", url: "https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks" }],
  },
  ...additionalEnglishGuides,
].sort((a, b) => Number(a.number) - Number(b.number));

export const getEnglishGuide = (slug: string) => englishGuides.find((guide) => guide.slug === slug);
