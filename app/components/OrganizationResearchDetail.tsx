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
        <a href="#institution-verdict"><span>01</span>快速判断</a>
        <a href="#institution-portrait"><span>02</span>机构画像</a>
        <a href="#institution-fit"><span>03</span>适合谁</a>
        <a href="#institution-resources"><span>04</span>资本与资源</a>
        <a href="#institution-access"><span>05</span>进入路径</a>
        <a href="#institution-proof"><span>06</span>证据与决策</a>
      </nav>

      <section className="institution-v2-hero" id="institution-verdict">
        <div className="institution-v2-kicker"><span>PIONEER INSTITUTION BRIEF</span><b>{organization.dna[0]?.value}</b></div>
        <h2>先判断它能为你解决什么。</h2>
        <p>{organization.thesis}</p>
        <div className="institution-v2-answer-grid">
          <div><small>它是什么</small><strong>{organization.dna[0]?.value}</strong><p>{organization.dna[1]?.note}</p></div>
          <div><small>主要给谁</small><strong>{organization.dna[2]?.value}</strong><p>{organization.dna[2]?.note}</p></div>
          <div><small>最重要入口</small><strong>{organization.dna[5]?.value}</strong><p>{organization.dna[5]?.note}</p></div>
          <div className="is-accent"><small>PIONEER 判断</small><strong>{primaryResources[0]?.label || "按具体项目判断"}</strong><p>{resource.editorialNote}</p></div>
        </div>
      </section>

      <section className="institution-v2-section" id="institution-portrait">
        <header className="institution-v2-heading"><span>02 / PORTRAIT</span><div><h2>机构画像</h2><p>机构身份与运作逻辑：先辨认它的原型，再判断它在创业生态里真正扮演什么角色。</p></div></header>
        <div className="institution-v2-portrait">
          <div className="institution-v2-identity">
            {organization.dna.map((item, index) => (
              <div key={item.label}><span>0{index + 1}</span><small>{item.label}</small><strong>{item.value}</strong><p>{item.note}</p></div>
            ))}
          </div>
          <aside className="institution-v2-position">
            <span>ECOSYSTEM POSITION</span>
            <h3>它通过哪些角色创造价值</h3>
            {organization.ecosystem.map((item) => (
              <div key={item.actor}><strong>{item.actor}</strong><p>{item.role}</p><small>创业者如何使用</small><p>{item.founderUse}</p></div>
            ))}
          </aside>
        </div>
        <div className="institution-v2-subhead"><span>PROGRAM MAP</span><h3>它不是一个入口，而是一组项目</h3><p>项目组合、生态角色与进入方式需要分别判断。</p></div>
        <div className="institution-v2-programs">
          {organization.portfolio.map((item, index) => (
            <article key={item.name}><span>0{index + 1}</span><small>{item.stage}</small><h3>{item.name}</h3><p>{item.mechanism}</p><div><b>更适合</b><p>{item.fit}</p></div></article>
          ))}
        </div>
      </section>

      <section className="institution-v2-section" id="institution-fit">
        <header className="institution-v2-heading"><span>03 / FIT</span><div><h2>它适合谁，也不适合谁</h2><p>先用阶段、目标和投入条件排除不匹配，再决定是否申请。</p></div></header>
        <div className="institution-v2-fit-columns">
          <div className="fit-positive"><span>高度适合</span><h3>优先投入时间</h3>{resource.bestFor.map((item) => <p key={item}>✓ {item}</p>)}{priorityStages.map((item) => <div key={item.stage}><strong>{item.stage}</strong><small>{item.reason}</small></div>)}</div>
          <div className="fit-conditional"><span>可以考虑</span><h3>先核对这些条件</h3>{conditionalStages.map((item) => <div key={item.stage}><strong>{item.stage}</strong><small>{item.reason}</small></div>)}{resource.considerations.slice(0, 2).map((item) => <p key={item}>△ {item}</p>)}</div>
          <div className="fit-negative"><span>不太适合</span><h3>出现这些情况先放弃</h3>{organization.redFlags.map((item) => <p key={item}>× {item}</p>)}</div>
        </div>
        <div className="institution-v2-subhead"><span>SELF CHECK</span><h3>申请匹配度自测</h3><p>不是预测录取概率，而是判断这个机构是否值得投入。</p></div>
        <OrganizationFitAssessment questions={organization.dossier.selfCheck} />
      </section>

      <section className="institution-v2-section" id="institution-resources">
        <header className="institution-v2-heading"><span>04 / VALUE EXCHANGE</span><div><h2>资本与资源：得到什么，交换什么</h2><p>资源结构：有资源，不等于你能获得。每项都同时说明提供什么、如何获得和主要边界。</p></div></header>
        <div className="institution-v2-resources">
          {organization.resources.map((item, index) => (
            <article key={item.label}>
              <header><span>0{index + 1}</span><b className={`capability-level strength-${item.strength}`}>{item.strength}</b></header>
              <h3>{item.label}</h3>
              <dl><div><dt>提供什么</dt><dd>{item.provides}</dd></div><div><dt>如何获得</dt><dd>{item.access}</dd></div><div><dt>主要边界</dt><dd>{item.boundary}</dd></div></dl>
            </article>
          ))}
        </div>
        <div className="institution-v2-economics">
          <div className="institution-v2-subhead"><span>COST</span><h3>费用、股权与真实成本</h3><p>直接成本、稀释、迁移、时间和机会成本要放在一起。</p></div>
          <div className="institution-v2-economics-list">
            {organization.dossier.economics.map((item) => <article key={item.label}><h3>{item.label}</h3><div><small>目前可确认</small><p>{item.known}</p></div><div><small>创业者含义</small><p>{item.implication}</p></div><div><small>行动前复核</small><p>{item.verification}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="institution-v2-section" id="institution-access">
        <header className="institution-v2-heading"><span>05 / ACCESS</span><div><h2>进入机构的真实路径</h2><p>申请与筛选机制：从你想获得的结果倒推入口、材料与成功标准，而不是先申请再想用途。</p></div></header>
        <div className="institution-v2-application">
          <div className="institution-v2-application-intro"><span>申请单位</span><h3>{organization.dossier.selection.applicationUnit}</h3><p>{organization.dossier.selection.commitment}</p></div>
          <ol>{organization.dossier.selection.process.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ol>
        </div>
        <div className="institution-v2-signal-grid">
          <div><span>机构优先寻找</span>{organization.dossier.selection.signals.map((item) => <p key={item}>+ {item}</p>)}</div>
          <div><span>常见拒绝风险</span>{organization.dossier.selection.rejectionRisks.map((item) => <p key={item}>− {item}</p>)}</div>
        </div>
        <div className="institution-v2-subhead"><span>ROUTES</span><h3>按你的需求选择入口</h3><p>每条路径都有第一步和可以衡量的成功标准。</p></div>
        <div className="institution-v2-routes">
          {organization.scenarios.map((item, index) => <article key={item.need}><span>ROUTE 0{index + 1}</span><h3>{item.need}</h3><div><small>建议路径</small><p>{item.route}</p></div><div><small>第一步</small><p>{item.firstMove}</p></div><div><small>成功标准</small><p>{item.success}</p></div></article>)}
        </div>
      </section>

      <section className="institution-v2-section" id="institution-proof">
        <header className="institution-v2-heading"><span>06 / PROOF &amp; DECISION</span><div><h2>证据、案例与最终判断</h2><p>把官方事实、Pioneer 判断与申请前待复核事项分开。</p></div></header>
        <div className="institution-v2-subhead"><span>EVIDENCE</span><h3>成果证据与代表案例</h3><p>成功案例能说明网络方向，但不能自动证明因果关系。</p></div>
        <div className="institution-v2-evidence">
          {organization.dossier.evidence.map((item) => <article key={item.label}><span className={`evidence-status evidence-${item.verification}`}>{item.verification}</span><small>{item.label}</small><h3>{item.value}</h3><p>{item.interpretation}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceLabel} ↗</a></article>)}
        </div>
        <div className="institution-v2-cases">
          {organization.dossier.cases.map((item) => <article key={item.name}><h3>{item.name}</h3><p>{item.signal}</p><div><small>不能证明</small><p>{item.caveat}</p></div></article>)}
        </div>

        <details className="institution-v2-deep-dive">
          <summary><span>DECISION SUPPORT</span><strong>展开替代机构与替代路径、90 天使用计划和尽调问题</strong><b>＋</b></summary>
          <div className="institution-v2-deep-body">
            <div className="institution-v2-subhead"><span>COMPARE</span><h3>四家机构横向比较</h3><p>比较机构原型，而不是只比较品牌大小；完整对照已收束为替代路径。</p></div>
            <div className="institution-v2-subhead"><span>ALTERNATIVES</span><h3>替代机构与替代路径</h3><p>不要孤立判断一个品牌。</p></div>
            <div className="organization-alternatives">{organization.dossier.alternatives.map((item) => <div key={item.need}><small>如果你需要</small><h3>{item.need}</h3><span>优先比较</span><strong>{item.option}</strong><p>{item.why}</p></div>)}</div>
            <div className="institution-v2-subhead"><span>90 DAYS</span><h3>进入后的 90 天使用计划</h3><p>机构不是结果，使用机构的方法才是结果。</p></div>
            <div className="organization-playbook">{profile.playbook.map((step, index) => <div key={step.title}><span>0{index + 1}</span><small>{step.phase}</small><h3>{step.title}</h3><p>{step.action}</p><strong>产出：{step.output}</strong></div>)}</div>
            <div className="institution-v2-subhead"><span>DILIGENCE</span><h3>行动前必须问清的问题</h3><p>公开介绍之外，真正决定回报的是这些边界。</p></div>
            <div className="organization-question-list">{profile.diligence.map((question, index) => <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>)}</div>
          </div>
        </details>

        <div className="institution-v2-final">
          <span>PIONEER FINAL VERDICT · 最后判断：是否值得进入</span><h2>{resource.name} 值得进入吗？</h2><p>{resource.editorialNote}</p>
          <div><small>优先选择，当</small><p>{profile.comparison.chooseWhen}</p></div><div><small>暂不选择，当</small><p>{profile.comparison.avoidWhen}</p></div>
        </div>
      </section>
    </article>
  );
}
