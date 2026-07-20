import type { OrganizationIntelligenceProfile } from "../data/organizationProfiles";
import type { ResourceResearchProfile } from "../data/resourceProfiles";
import type { Resource } from "../data/resources";

type Props = {
  resource: Resource;
  profile: ResourceResearchProfile;
  organization: OrganizationIntelligenceProfile;
};

export function OrganizationResearchDetail({ resource, profile, organization }: Props) {
  return (
    <article className="detail-main organization-intelligence institution-sheet">
      <nav className="institution-sheet-nav" aria-label="机构资料目录">
        <a href="#institution-basic">基本信息</a>
        <a href="#institution-programs">旗下项目</a>
        <a href="#institution-support">支持内容</a>
        <a href="#institution-application">申请条件</a>
        <a href="#institution-cost">费用与股权</a>
        <a href="#institution-evidence">数据与案例</a>
      </nav>

      <section className="institution-sheet-section institution-sheet-overview" id="institution-basic">
        <header className="institution-sheet-heading">
          <span>01</span>
          <div><small>机构资料</small><h2>基本信息</h2></div>
        </header>
        <p className="institution-sheet-lead">{resource.overview}</p>
        <div className="institution-basic-grid">
          {organization.dna.map((item) => (
            <div key={item.label}>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
        <div className="institution-sheet-note">
          <strong>机构说明</strong>
          <p>{organization.thesis}</p>
        </div>
      </section>

      <section className="institution-sheet-section" id="institution-programs">
        <header className="institution-sheet-heading">
          <span>02</span>
          <div><small>{organization.portfolio.length} 项已整理</small><h2>旗下项目</h2><p>不同项目的服务阶段和提供内容不同，申请前应查看具体项目的最新要求。</p></div>
        </header>
        <div className="institution-data-table institution-program-table">
          <div className="institution-data-head"><span>项目名称</span><span>适合阶段</span><span>提供内容</span><span>适合人群</span></div>
          {organization.portfolio.map((item) => (
            <article key={item.name}>
              <h3 data-label="项目名称">{item.name}</h3>
              <p data-label="适合阶段">{item.stage}</p>
              <p data-label="提供内容">{item.mechanism}</p>
              <p data-label="适合人群">{item.fit}</p>
            </article>
          ))}
        </div>

        <h3 className="institution-minor-title">按需求选择项目</h3>
        <div className="institution-data-table institution-route-table">
          <div className="institution-data-head"><span>当前需求</span><span>建议选择</span><span>申请前先做</span><span>预期结果</span></div>
          {organization.scenarios.map((item) => (
            <article key={item.need}>
              <h3 data-label="当前需求">{item.need}</h3>
              <p data-label="建议选择">{item.route}</p>
              <p data-label="申请前先做">{item.firstMove}</p>
              <p data-label="预期结果">{item.success}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="institution-sheet-section" id="institution-support">
        <header className="institution-sheet-heading">
          <span>03</span>
          <div><small>{organization.resources.length} 类支持</small><h2>支持内容</h2><p>“提供内容”说明机构可能提供的帮助，“获得方式”和“注意事项”说明实际使用条件。</p></div>
        </header>
        <div className="institution-data-table institution-support-table">
          <div className="institution-data-head"><span>支持类型</span><span>提供内容</span><span>获得方式</span><span>注意事项</span></div>
          {organization.resources.map((item) => (
            <article key={item.label}>
              <h3 data-label="支持类型">{item.label}<b className={`capability-level strength-${item.strength}`}>{item.strength}</b></h3>
              <p data-label="提供内容">{item.provides}</p>
              <p data-label="获得方式">{item.access}</p>
              <p data-label="注意事项">{item.boundary}</p>
            </article>
          ))}
        </div>

        <h3 className="institution-minor-title">相关资源方</h3>
        <div className="institution-related-grid">
          {organization.ecosystem.map((item) => (
            <article key={item.actor}><h3>{item.actor}</h3><p>{item.role}</p><div><small>创业者可以怎样使用</small><p>{item.founderUse}</p></div></article>
          ))}
        </div>
      </section>

      <section className="institution-sheet-section" id="institution-application">
        <header className="institution-sheet-heading">
          <span>04</span>
          <div><small>申请资料</small><h2>申请条件与流程</h2></div>
        </header>
        <div className="institution-application-summary">
          <div><small>申请主体</small><strong>{organization.dossier.selection.applicationUnit}</strong></div>
          <div><small>参与要求</small><strong>{organization.dossier.selection.commitment}</strong></div>
        </div>

        <h3 className="institution-minor-title">申请流程</h3>
        <ol className="institution-process-list">
          {organization.dossier.selection.process.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}
        </ol>

        <div className="institution-condition-grid">
          <div><h3>更符合要求的情况</h3>{organization.dossier.selection.signals.map((item) => <p key={item}>✓ {item}</p>)}</div>
          <div><h3>可能不适合的情况</h3>{organization.dossier.selection.rejectionRisks.map((item) => <p key={item}>× {item}</p>)}</div>
        </div>

        <h3 className="institution-minor-title">阶段匹配</h3>
        <div className="institution-stage-list">
          {profile.stageFit.map((item) => <div key={item.stage}><strong>{item.stage}</strong><span>{item.fit}</span><p>{item.reason}</p></div>)}
        </div>
      </section>

      <section className="institution-sheet-section" id="institution-cost">
        <header className="institution-sheet-heading">
          <span>05</span>
          <div><small>申请前确认</small><h2>费用、投资与股权</h2><p>条款可能随批次和项目变化，签署前应以机构提供的正式文件为准。</p></div>
        </header>
        <div className="institution-data-table institution-cost-table">
          <div className="institution-data-head"><span>项目</span><span>已知信息</span><span>对创业者的影响</span><span>申请前确认</span></div>
          {organization.dossier.economics.map((item) => (
            <article key={item.label}>
              <h3 data-label="项目">{item.label}</h3>
              <p data-label="已知信息">{item.known}</p>
              <p data-label="对创业者的影响">{item.implication}</p>
              <p data-label="申请前确认">{item.verification}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="institution-sheet-section" id="institution-evidence">
        <header className="institution-sheet-heading">
          <span>06</span>
          <div><small>来源与核验</small><h2>数据与案例</h2><p>数据用于说明机构规模和资源方向，案例不代表所有参加者都能获得相同结果。</p></div>
        </header>
        <div className="institution-evidence-grid">
          {organization.dossier.evidence.map((item) => (
            <article key={item.label}><span className={`evidence-status evidence-${item.verification}`}>{item.verification}</span><small>{item.label}</small><h3>{item.value}</h3><p>{item.interpretation}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceLabel} ↗</a></article>
          ))}
        </div>

        <h3 className="institution-minor-title">代表案例</h3>
        <div className="institution-case-grid">
          {organization.dossier.cases.map((item) => <article key={item.name}><h3>{item.name}</h3><p>{item.signal}</p><div><small>阅读案例时需要注意</small><p>{item.caveat}</p></div></article>)}
        </div>

        <details className="institution-more-info">
          <summary><strong>其他可选机构、参加后的行动计划与申请前问题</strong><span>展开 ＋</span></summary>
          <div className="institution-more-body">
            <h3 className="institution-minor-title">其他可选机构</h3>
            <div className="organization-alternatives">{organization.dossier.alternatives.map((item) => <div key={item.need}><small>需要</small><h3>{item.need}</h3><span>可以比较</span><strong>{item.option}</strong><p>{item.why}</p></div>)}</div>
            <h3 className="institution-minor-title">参加后的 90 天行动计划</h3>
            <div className="organization-playbook">{profile.playbook.map((step, index) => <div key={step.title}><span>0{index + 1}</span><small>{step.phase}</small><h3>{step.title}</h3><p>{step.action}</p><strong>产出：{step.output}</strong></div>)}</div>
            <h3 className="institution-minor-title">申请前需要确认的问题</h3>
            <div className="organization-question-list">{profile.diligence.map((question, index) => <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>)}</div>
          </div>
        </details>

        <div className="institution-editor-summary">
          <span>编辑总结</span>
          <p>{resource.editorialNote}</p>
          <div><strong>更适合</strong><p>{profile.comparison.chooseWhen}</p></div>
          <div><strong>暂不建议</strong><p>{profile.comparison.avoidWhen}</p></div>
        </div>
      </section>
    </article>
  );
}
