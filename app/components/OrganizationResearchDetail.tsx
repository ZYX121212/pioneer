import type { OrganizationIntelligenceProfile } from "../data/organizationProfiles";
import type { ResourceResearchProfile } from "../data/resourceProfiles";
import type { Resource } from "../data/resources";
import { OrganizationFitAssessment } from "./OrganizationFitAssessment";

type Props = {
  resource: Resource;
  profile: ResourceResearchProfile;
  organization: OrganizationIntelligenceProfile;
};

export function OrganizationResearchDetail({ resource, profile, organization }: Props) {
  const priorityStages = profile.stageFit.filter((item) => item.fit === "优先考虑");
  const conditionalStages = profile.stageFit.filter((item) => item.fit !== "优先考虑");
  const primaryResources = organization.resources.filter((item) => item.strength === "核心" || item.strength === "强");

  return (
    <article className="detail-main organization-intelligence institution-v2">
      <nav className="institution-v2-nav" aria-label="机构档案章节">
        <a href="#institution-verdict"><span>01</span>先看结论</a>
        <a href="#institution-portrait"><span>02</span>机构与项目</a>
        <a href="#institution-fit"><span>03</span>适不适合你</a>
        <a href="#institution-resources"><span>04</span>能得到什么</a>
        <a href="#institution-access"><span>05</span>怎么申请</a>
        <a href="#institution-proof"><span>06</span>依据与建议</a>
      </nav>

      <section className="institution-v2-hero" id="institution-verdict">
        <div className="institution-v2-kicker"><span>PIONEER INSTITUTION BRIEF</span><b>{organization.dna[0]?.value}</b></div>
        <h2>先用一分钟看懂这个机构。</h2>
        <p>{organization.thesis}</p>
        <div className="institution-v2-answer-grid">
          <div><small>它是什么</small><strong>{organization.dna[0]?.value}</strong><p>{organization.dna[1]?.note}</p></div>
          <div><small>主要给谁</small><strong>{organization.dna[2]?.value}</strong><p>{organization.dna[2]?.note}</p></div>
          <div><small>你要申请什么</small><strong>{organization.dna[5]?.value}</strong><p>{organization.dna[5]?.note}</p></div>
          <div className="is-accent"><small>最值得关注</small><strong>{primaryResources[0]?.label || "按具体项目判断"}</strong><p>{resource.editorialNote}</p></div>
        </div>
      </section>

      <section className="institution-v2-section" id="institution-portrait">
        <header className="institution-v2-heading"><span>02 / 机构与项目</span><div><h2>它到底是什么？</h2><p>先看清机构如何运作，再看它具体提供哪些创业项目。机构是组织方，项目才是创业者实际申请和参加的服务。</p></div></header>
        <div className="institution-v2-portrait">
          <div className="institution-v2-identity">
            {organization.dna.map((item, index) => (
              <div key={item.label}><span>0{index + 1}</span><small>{item.label}</small><strong>{item.value}</strong><p>{item.note}</p></div>
            ))}
          </div>
          <aside className="institution-v2-position">
            <span>谁在提供帮助</span>
            <h3>你会接触到哪些人和组织</h3>
            {organization.ecosystem.map((item) => (
              <div key={item.actor}><strong>{item.actor}</strong><p>{item.role}</p><small>你可以怎么利用</small><p>{item.founderUse}</p></div>
            ))}
          </aside>
        </div>
        <div className="institution-v2-program-intro">
          <span>{organization.portfolio.length} 类项目</span>
          <div><h3>这个机构具体提供哪些项目？</h3><p>你不是笼统地“申请这个机构”，而是从下面选择一个适合自己的项目，再按该项目的要求申请。不同项目服务的创业阶段、提供的帮助和申请条件都不一样。</p></div>
        </div>
        <div className="institution-v2-programs">
          {organization.portfolio.map((item, index) => (
            <article key={item.name}>
              <span>项目 0{index + 1}</span>
              <small>适用阶段：{item.stage}</small>
              <h3>{item.name}</h3>
              <div className="institution-v2-program-answer"><b>这是什么 / 你会得到什么</b><p>{item.mechanism}</p></div>
              <div className="institution-v2-program-answer"><b>适合哪些创业者</b><p>{item.fit}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="institution-v2-section" id="institution-fit">
        <header className="institution-v2-heading"><span>03 / 是否适合</span><div><h2>你适合申请吗？</h2><p>对照自己的创业阶段、当前目标和能够投入的时间，先排除不适合的情况。</p></div></header>
        <div className="institution-v2-fit-columns">
          <div className="fit-positive"><span>高度适合</span><h3>优先投入时间</h3>{resource.bestFor.map((item) => <p key={item}>✓ {item}</p>)}{priorityStages.map((item) => <div key={item.stage}><strong>{item.stage}</strong><small>{item.reason}</small></div>)}</div>
          <div className="fit-conditional"><span>可以考虑</span><h3>先核对这些条件</h3>{conditionalStages.map((item) => <div key={item.stage}><strong>{item.stage}</strong><small>{item.reason}</small></div>)}{resource.considerations.slice(0, 2).map((item) => <p key={item}>△ {item}</p>)}</div>
          <div className="fit-negative"><span>不太适合</span><h3>出现这些情况先放弃</h3>{organization.redFlags.map((item) => <p key={item}>× {item}</p>)}</div>
        </div>
        <div className="institution-v2-subhead"><span>自测</span><h3>回答几个问题，再决定是否申请</h3><p>这里不预测录取结果，只帮你判断是否值得投入时间。</p></div>
        <OrganizationFitAssessment questions={organization.dossier.selfCheck} />
      </section>

      <section className="institution-v2-section" id="institution-resources">
        <header className="institution-v2-heading"><span>04 / 能得到什么</span><div><h2>它能给你哪些实际帮助？</h2><p>每项帮助都写清楚：具体提供什么、怎样才能获得，以及它不能替你完成什么。</p></div></header>
        <div className="institution-v2-resources">
          {organization.resources.map((item, index) => (
            <article key={item.label}>
              <header><span>0{index + 1}</span><b className={`capability-level strength-${item.strength}`}>{item.strength}</b></header>
              <h3>{item.label}</h3>
              <dl><div><dt>你能得到</dt><dd>{item.provides}</dd></div><div><dt>怎样获得</dt><dd>{item.access}</dd></div><div><dt>它不能保证</dt><dd>{item.boundary}</dd></div></dl>
            </article>
          ))}
        </div>
        <div className="institution-v2-economics">
          <div className="institution-v2-subhead"><span>成本</span><h3>你需要付出什么？</h3><p>不只看报名费，还要看股权、搬迁、时间和放弃其他机会的成本。</p></div>
          <div className="institution-v2-economics-list">
            {organization.dossier.economics.map((item) => <article key={item.label}><h3>{item.label}</h3><div><small>已知信息</small><p>{item.known}</p></div><div><small>这对你意味着什么</small><p>{item.implication}</p></div><div><small>申请前再确认</small><p>{item.verification}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="institution-v2-section" id="institution-access">
        <header className="institution-v2-heading"><span>05 / 怎么申请</span><div><h2>从哪里开始，申请要经过什么？</h2><p>先确定要申请的具体项目，再准备材料。下面按顺序说明申请过程和机构重点关注的内容。</p></div></header>
        <div className="institution-v2-application">
          <div className="institution-v2-application-intro"><span>你应该以什么身份申请</span><h3>{organization.dossier.selection.applicationUnit}</h3><p>{organization.dossier.selection.commitment}</p></div>
          <ol>{organization.dossier.selection.process.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ol>
        </div>
        <div className="institution-v2-signal-grid">
          <div><span>这些条件更容易被看中</span>{organization.dossier.selection.signals.map((item) => <p key={item}>+ {item}</p>)}</div>
          <div><span>这些情况可能不被录取</span>{organization.dossier.selection.rejectionRisks.map((item) => <p key={item}>− {item}</p>)}</div>
        </div>
        <div className="institution-v2-subhead"><span>按目标选择</span><h3>你想解决什么问题？</h3><p>根据当前目标选择项目，并提前设定可以衡量的结果。</p></div>
        <div className="institution-v2-routes">
          {organization.scenarios.map((item, index) => <article key={item.need}><span>目标 0{index + 1}</span><h3>{item.need}</h3><div><small>应该选择</small><p>{item.route}</p></div><div><small>现在先做</small><p>{item.firstMove}</p></div><div><small>怎样算有效</small><p>{item.success}</p></div></article>)}
        </div>
      </section>

      <section className="institution-v2-section" id="institution-proof">
        <header className="institution-v2-heading"><span>06 / 依据与建议</span><div><h2>为什么值得考虑？</h2><p>这里分别列出官方公开数据、成功案例，以及申请前仍需确认的信息。</p></div></header>
        <div className="institution-v2-subhead"><span>依据</span><h3>官方数据与代表案例</h3><p>成功案例说明机构曾帮助过哪些公司，但不代表每个申请者都能得到同样结果。</p></div>
        <div className="institution-v2-evidence">
          {organization.dossier.evidence.map((item) => <article key={item.label}><span className={`evidence-status evidence-${item.verification}`}>{item.verification}</span><small>{item.label}</small><h3>{item.value}</h3><p>{item.interpretation}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceLabel} ↗</a></article>)}
        </div>
        <div className="institution-v2-cases">
          {organization.dossier.cases.map((item) => <article key={item.name}><h3>{item.name}</h3><p>{item.signal}</p><div><small>不能证明</small><p>{item.caveat}</p></div></article>)}
        </div>

        <details className="institution-v2-deep-dive">
          <summary><span>更多决策资料</span><strong>查看其他可选机构、参加后的 90 天计划和申请前问题</strong><b>＋</b></summary>
          <div className="institution-v2-deep-body">
            <div className="institution-v2-subhead"><span>比较</span><h3>把四家机构放在一起看</h3><p>不要只看名气，要比较它们分别适合哪类创业者。</p></div>
            <div className="institution-v2-subhead"><span>其他选择</span><h3>如果它不适合你，还有哪些选择？</h3><p>根据你真正需要的帮助，选择更合适的机构或方法。</p></div>
            <div className="organization-alternatives">{organization.dossier.alternatives.map((item) => <div key={item.need}><small>如果你需要</small><h3>{item.need}</h3><span>优先比较</span><strong>{item.option}</strong><p>{item.why}</p></div>)}</div>
            <div className="institution-v2-subhead"><span>参加后</span><h3>参加项目后的 90 天行动计划</h3><p>被录取只是开始，真正重要的是你如何使用这些资源。</p></div>
            <div className="organization-playbook">{profile.playbook.map((step, index) => <div key={step.title}><span>0{index + 1}</span><small>{step.phase}</small><h3>{step.title}</h3><p>{step.action}</p><strong>产出：{step.output}</strong></div>)}</div>
            <div className="institution-v2-subhead"><span>申请前</span><h3>必须向机构问清楚的问题</h3><p>这些问题会影响费用、权益和最终收获。</p></div>
            <div className="organization-question-list">{profile.diligence.map((question, index) => <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>)}</div>
          </div>
        </details>

        <div className="institution-v2-final">
          <span>最后建议</span><h2>{resource.name} 值得申请吗？</h2><p>{resource.editorialNote}</p>
          <div><small>适合申请，如果</small><p>{profile.comparison.chooseWhen}</p></div><div><small>暂时不要申请，如果</small><p>{profile.comparison.avoidWhen}</p></div>
        </div>
      </section>
    </article>
  );
}
