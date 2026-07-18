import type { Metadata } from "next";
import Link from "next/link";
import { InterviewWorkbook } from "../../components/FounderWorksheets";
import { GuideProgress } from "../../components/GuideProgress";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { interviewGuide, pioneerGuide } from "../../data/knowledge";

export const metadata: Metadata = {
  title: "第一次用户访谈 — Pioneer 创业指南",
  description: "从招募、开场、追问到整理证据，完成一次不推销方案的用户访谈。",
  alternates: { canonical: "/knowledge/first-user-interview", languages: { "zh-CN": "/knowledge/first-user-interview", en: "/en/knowledge/first-user-interview" } },
};

const badQuestions = [
  { bad: "你觉得这个想法怎么样？", good: "最近一次遇到这个问题是什么时候？", why: "意见会照顾你的感受，经历包含可核验的事实。" },
  { bad: "如果有这个产品，你会用吗？", good: "你上一次是怎么处理的？", why: "未来承诺很便宜，过去行为已经付出成本。" },
  { bad: "你愿意每月付 99 元吗？", good: "现在为这个问题花多少钱、多少时间？", why: "假设价格无法代替真实预算和现有替代。" },
  { bad: "这个功能是不是很有用？", good: "哪一步最困难？为什么？", why: "先理解任务和阻力，不让功能引导答案。" },
  { bad: "你也觉得现在的工具很难用吧？", good: "带我看一下你现在怎么完成这件事。", why: "观察流程比要求对方同意你的判断更可靠。" },
  { bad: "你平时经常遇到这个问题吗？", good: "过去一个月发生过几次？最近一次是哪天？", why: "具体时间范围能减少模糊和夸张。" },
  { bad: "还有什么功能是你想要的？", good: "你尝试过其他办法吗？为什么放弃？", why: "功能愿望不等于问题优先级，放弃原因更接近阻力。" },
  { bad: "所以你的意思是我们应该做 X？", good: "我复述一下刚才的经历，有哪里理解错了？", why: "确认事实，而不是让用户替你设计产品。" },
];

const agenda = [
  { time: "0–3 分钟", title: "建立边界", action: "说明你不是销售，不会展示方案；征得记录或录音同意。", output: "对方知道可以坦率表达，也知道资料将如何使用。" },
  { time: "3–8 分钟", title: "理解背景", action: "了解角色、任务、环境和最近变化，不急着进入你的问题。", output: "判断这个人是否真的符合目标人群。" },
  { time: "8–20 分钟", title: "重建经历", action: "追问最近一次事件的触发、步骤、参与者、替代方法和成本。", output: "一条包含时间、行为和后果的完整事件链。" },
  { time: "20–25 分钟", title: "理解优先级", action: "询问尝试过什么、为什么没有解决、谁在意以及谁做决定。", output: "现有替代、改变阻力与购买关系。" },
  { time: "25–28 分钟", title: "寻找反证", action: "主动问什么时候不痛、为什么能忍受、什么会让方案不值得换。", output: "至少一条能够挑战创始人判断的证据。" },
  { time: "28–30 分钟", title: "确认下一步", action: "复述理解，询问是否愿意介绍类似的人或继续参与实验。", output: "一个明确承诺，或一个同样有价值的拒绝。" },
];

const recruitmentChannels = [
  { title: "现有关系的二度介绍", use: "适合 B2B、专业人群和高信任场景", script: "我正在理解［某类人］处理［某项任务］的真实过程，不推销产品。你是否认识最近经历过这件事的人？" },
  { title: "行业社群与线下场所", use: "适合角色清晰、存在聚集地的人群", script: "我想找 5 位在过去一个月处理过［具体事件］的人，交流 25 分钟。不会展示方案，结束后可分享整理结果。" },
  { title: "陌生定向联系", use: "适合 LinkedIn、邮件或公开职业目录", script: "看到你负责［职责］。我正在研究［具体工作场景］，希望了解实际流程而非推销工具。是否愿意用 20 分钟讲一次最近经历？" },
  { title: "行为现场拦访", use: "适合零售、出行、活动和物理场景", script: "我注意到你刚完成［可观察行为］，正在研究这个过程。可以用 8 分钟了解刚才发生了什么吗？" },
];

const evidenceSignals = [
  { signal: "具体时间", example: "“上周三下午……”", meaning: "回答来自一段真实记忆，而不是概括性态度。" },
  { signal: "可描述步骤", example: "“我先打开表格，再去群里问……”", meaning: "可以重建工作流并找到阻力出现的位置。" },
  { signal: "已经付出", example: "购买工具、加班、雇人、放弃机会", meaning: "问题已经推动用户做出行为，而不只是抱怨。" },
  { signal: "情绪变化", example: "停顿、反复强调、主动展示材料", meaning: "可能提示痛点，但必须与事实结合，不能单独下结论。" },
  { signal: "角色关系", example: "“我使用，但经理批准，财务付款。”", meaning: "帮助区分使用者、影响者、决策者和付款者。" },
  { signal: "主动推进", example: "介绍同事、发送资料、约下一次测试", meaning: "对方愿意承担一点真实成本，信号强于口头兴趣。" },
  { signal: "反向证据", example: "“其实一个月才发生一次。”", meaning: "防止团队只保存支持原想法的内容。" },
];

export default function FirstUserInterviewGuide() {
  return (
    <main>
      <SiteHeader languageHref="/en/knowledge/first-user-interview" />
      <header className="guide-hero guide-hero-blue">
        <div className="guide-breadcrumbs">
          <Link href="/">首页</Link><span>/</span><Link href="/knowledge">创业指南</Link><span>/</span><b>第一次用户访谈</b>
        </div>
        <div className="guide-hero-grid">
          <div>
            <span className="guide-kicker">PIONEER GUIDE 02 · {interviewGuide.stage}</span>
            <h1>{interviewGuide.title}</h1>
            <p>{interviewGuide.description}</p>
          </div>
          <aside className="guide-output-card">
            <span>完成这篇指南后</span>
            <strong>从“聊得不错”，<br />变成一份可判断的证据。</strong>
            <ol>{interviewGuide.outcome.map((item) => <li key={item}>{item}</li>)}</ol>
            <small>{interviewGuide.duration} · 更新于 {interviewGuide.updated}</small>
          </aside>
        </div>
      </header>

      <GuideProgress
        guide={interviewGuide}
        judgment="访谈不是确认用户喜欢你的想法，而是重建一次近期事件：触发、步骤、替代、成本、角色关系和反向证据。"
        mistakes={["展示方案后询问是否会用", "只记录支持想法的金句", "找方便接触的人而不筛选真实经历"]}
        action="定义一个学习目标和一个能推翻想法的答案，找到一位最近经历过目标场景的人。"
      />

      <div className="guide-reading-layout" id="deep-guide">
        <aside className="guide-toc" aria-label="本篇目录">
          <span>本篇目录</span>
          <a href="#before">01 · 访谈前先决定学什么</a>
          <a href="#recruit">02 · 找到正确的人</a>
          <a href="#agenda">03 · 30 分钟流程</a>
          <a href="#questions">04 · 错误问题改写</a>
          <a href="#conversation">05 · 完整对话示范</a>
          <a href="#evidence">06 · 怎样记录证据</a>
          <a href="#workbook">07 · 填写访谈记录</a>
          <a href="#synthesis">08 · 五次访谈后怎么判断</a>
          <a href="#sources">参考来源</a>
        </aside>

        <article className="guide-article">
          <section className="guide-entry" id="before">
            <div><span className="guide-label">进入信号</span><h2>如果你准备展示产品，请先暂停。</h2></div>
            <ul><li>你希望确认大家喜欢这个想法</li><li>你准备从头讲一遍产品功能</li><li>你没有明确今天要学习什么</li><li>你打算只采访朋友和支持者</li></ul>
            <p>问题访谈的工作不是获得鼓励，也不是让用户替你设计产品。它只负责减少一个明确的不确定性：<strong>谁在什么情况下遇到什么问题，以及这件事是否足够重要。</strong></p>
          </section>

          <section className="guide-section">
            <div className="guide-section-heading"><span>01</span><div><small>LEARNING GOAL</small><h2>一次访谈，只解决一个主要学习目标。</h2></div></div>
            <p className="guide-lead">“了解用户需求”太宽，容易让谈话变成随意聊天。开始前必须写清楚：这次交流结束时，哪个决定应该更容易做？</p>
            <div className="learning-goal-examples">
              <div><span>太宽</span><p>了解小型餐饮店的排班需求。</p></div>
              <div><span>可学习</span><p>确认临时请假是否每周发生、店长如何补岗，以及空岗造成什么具体损失。</p></div>
              <div><span>可决定</span><p>如果临时空岗频率低且没有营业损失，就暂停这个方向；否则进入手工协调实验。</p></div>
            </div>
            <div className="pioneer-judgment"><span>PIONEER 判断</span><p>访谈开始前写下“什么答案会推翻我的想法”。如果你想不出来，这次访谈很可能只是寻找认可。</p></div>
          </section>

          <section className="guide-section" id="recruit">
            <div className="guide-section-heading"><span>02</span><div><small>RECRUIT THE RIGHT PEOPLE</small><h2>不要找“愿意聊天的人”，要找最近经历过目标场景的人。</h2></div></div>
            <p className="guide-lead">一个好的筛选条件应该包含角色、场景和时间范围。例如：过去 30 天内至少处理过两次临时换班的餐饮店经理。</p>
            <div className="screening-card">
              <span>三层筛选</span>
              <div><strong>角色</strong><p>这个人亲自经历、处理或为结果负责吗？</p></div>
              <div><strong>行为</strong><p>他最近真的做过目标任务，而不是“可能会做”吗？</p></div>
              <div><strong>时间</strong><p>经历是否足够近期，能够回忆具体细节？</p></div>
            </div>
            <h3>四种常见招募方式与邀请模板</h3>
            <div className="recruitment-list">
              {recruitmentChannels.map((item) => <article key={item.title}><span>{item.use}</span><h4>{item.title}</h4><p>{item.script}</p></article>)}
            </div>
            <div className="guide-caution"><strong>找不到人，也是一条证据。</strong><p>如果目标人群无法清楚定义、没有聚集渠道，或者没有人愿意花 20 分钟回忆这件事，你可能需要重新缩小人群或重新判断问题的优先级。</p></div>
          </section>

          <section className="guide-section" id="agenda">
            <div className="guide-section-heading"><span>03</span><div><small>30-MINUTE FLOW</small><h2>一场有效访谈，是逐步重建经历，不是照着问卷审问。</h2></div></div>
            <div className="interview-agenda">
              {agenda.map((item) => (
                <div key={item.time}><span>{item.time}</span><strong>{item.title}</strong><p>{item.action}</p><small>产出：{item.output}</small></div>
              ))}
            </div>
            <div className="opening-script"><span>开场示范</span><p>“谢谢你愿意交流。我今天不是来推销产品，也没有标准答案。我想理解你最近一次处理［具体任务］的过程。大约 25 分钟；如果你同意，我会做文字记录，内容只用于整理问题，不公开个人信息。任何不方便回答的内容都可以跳过。”</p></div>
          </section>

          <section className="guide-section" id="questions">
            <div className="guide-section-heading"><span>04</span><div><small>BETTER QUESTIONS</small><h2>把意见题、未来题和诱导题，改成过去发生的事实。</h2></div></div>
            <div className="question-rewrite-table">
              <div className="question-rewrite-head"><span>不要这样问</span><span>改成这样问</span><span>为什么</span></div>
              {badQuestions.map((item) => <div key={item.bad}><q>{item.bad}</q><q>{item.good}</q><p>{item.why}</p></div>)}
            </div>
            <h3>真正有用的是追问</h3>
            <div className="followup-chips">
              {[
                "能带我回到最近一次吗？", "当时为什么这样做？", "然后发生了什么？", "谁也参与了？", "你能给我看一下吗？", "这花了多久？", "为什么没有换一种方法？", "什么时候这件事其实不重要？",
              ].map((item) => <span key={item}>{item}</span>)}
            </div>
          </section>

          <section className="guide-section" id="conversation">
            <div className="guide-section-heading"><span>05</span><div><small>CONVERSATION EXAMPLE</small><h2>同一个问题，怎样从恭维走到可判断的事实。</h2></div></div>
            <div className="conversation-example">
              <div className="conversation-bad">
                <span>无效版本</span>
                <p><b>创始人：</b>我们准备做一个 AI 排班工具，你觉得有用吗？</p>
                <p><b>店长：</b>挺好的，现在 AI 很火，应该有帮助。</p>
                <p><b>创始人：</b>如果每月 199 元，你会买吗？</p>
                <p><b>店长：</b>做得好用的话可以考虑。</p>
                <small>结果：得到喜欢、考虑和功能建议，但没有任何真实行为。</small>
              </div>
              <div className="conversation-good">
                <span>有效版本</span>
                <p><b>创始人：</b>最近一次有人临时请假是什么时候？</p>
                <p><b>店长：</b>上周五下午，晚班员工说发烧来不了。</p>
                <p><b>创始人：</b>你当时做了什么？可以按顺序讲一下吗？</p>
                <p><b>店长：</b>先在两个群里问，再给三个人打电话，最后我自己顶了两小时。</p>
                <p><b>创始人：</b>这种情况过去一个月发生过几次？有什么损失？</p>
                <p><b>店长：</b>大概四次。最麻烦的不是排班，是一直等别人回复；有一次少开了一个档口。</p>
                <small>结果：获得时间、步骤、频率、替代方法和营业影响，可以设计下一步实验。</small>
              </div>
            </div>
          </section>

          <section className="guide-section" id="evidence">
            <div className="guide-section-heading"><span>06</span><div><small>CAPTURE EVIDENCE</small><h2>不要只记金句，要记录事件链和反向证据。</h2></div></div>
            <div className="evidence-signal-grid">
              {evidenceSignals.map((item) => <article key={item.signal}><span>{item.signal}</span><q>{item.example}</q><p>{item.meaning}</p></article>)}
            </div>
            <div className="note-separation">
              <div><span>受访者事实</span><p>“上周五我给三个人打电话，最后自己顶班两小时。”</p></div>
              <div><span>创始人解释</span><p>“店长可能愿意为更快确认候选人付费。”</p></div>
              <div><span>待验证假设</span><p>“减少等待回复能否避免空岗，以及老板是否为此负责预算。”</p></div>
            </div>
            <p className="guide-lead">把事实、解释和假设分开记录，避免团队几天后把自己的推测误记成“用户说过”。</p>
          </section>

          <section className="guide-section" id="workbook">
            <div className="guide-section-heading"><span>07</span><div><small>DO THE WORK</small><h2>用一张表完成本次访谈的准备和记录。</h2></div></div>
            <p className="guide-lead">访谈过程中不必逐字填写全部字段，先保持交流。结束后十分钟内补全，记忆会迅速丢失。</p>
            <InterviewWorkbook />
          </section>

          <section className="guide-section" id="synthesis">
            <div className="guide-section-heading"><span>08</span><div><small>SYNTHESIZE</small><h2>五次访谈后，不数“喜欢”，只比较重复出现的行为。</h2></div></div>
            <div className="synthesis-steps">
              <div><span>01</span><strong>逐人整理</strong><p>每位受访者保留独立记录，不要过早合并成“典型用户”。</p></div>
              <div><span>02</span><strong>标记重复</strong><p>比较触发场景、替代方法、成本、角色关系和拒绝原因。</p></div>
              <div><span>03</span><strong>寻找分群</strong><p>谁的痛感明显更强？他们是否共享角色、规模、时机或工作方式？</p></div>
              <div><span>04</span><strong>保存反例</strong><p>把不痛、低频、无预算和不愿改变的回答放在同一张决策表里。</p></div>
              <div><span>05</span><strong>做阶段决定</strong><p>继续研究一个更窄人群、改写问题，或停止，不把“再访谈一些”当默认答案。</p></div>
            </div>
            <div className="decision-note"><span>PIONEER 提醒</span><p>五次访谈不是市场验证，也没有神奇样本量。它只是第一轮定性学习，用于发现模式、暴露错误假设并决定下一种更强的实验。</p><small>如果购买周期长、风险高或人群高度多样，需要更多轮次和不同证据；重要决策不应仅依赖访谈。</small></div>
          </section>

          <section className="guide-sources" id="sources">
            <div className="guide-section-heading"><span>09</span><div><small>SOURCES &amp; SCOPE</small><h2>参考来源与 Pioneer 的使用方式</h2></div></div>
            <p>本文由 Pioneer 根据创业问题访谈场景重新组织。它不是用户研究专业训练的替代，也不适用于未经调整的医疗、未成年人或其他高敏感研究。</p>
            <div className="source-list">
              {interviewGuide.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><span>{source.publisher} · {source.language}</span><strong>{source.title}</strong><p>{source.use}</p></div><b aria-hidden="true">↗</b></a>)}
            </div>
            <div className="guide-editorial-meta">
              <div><span>作者</span><strong>Pioneer 编辑部</strong></div><div><span>最近核验</span><strong>{interviewGuide.updated}</strong></div>
              <div><span>适用范围</span><strong>早期问题访谈 · 通用原则</strong></div><div><span>隐私边界</span><strong>先征得同意，减少敏感信息</strong></div>
            </div>
          </section>
        </article>

        <aside className="guide-sidecard">
          <span>访谈完成标准</span>
          <strong>你带回来的不是评价，而是：</strong>
          <ul><li>一个近期具体事件</li><li>一条完整行为路径</li><li>一个现有替代</li><li>一种已经付出的成本</li><li>至少一条反向证据</li></ul>
          <Link href="#workbook">打开记录工具 →</Link>
        </aside>
      </div>

      <section className="guide-next">
        <span>PREVIOUS GUIDE · 问题发现</span>
        <h2>{pioneerGuide.title}</h2>
        <p>{pioneerGuide.description}</p>
        <Link href={`/knowledge/${pioneerGuide.slug}`}>回到第一篇指南 <span aria-hidden="true">←</span></Link>
      </section>
      <SiteFooter />
    </main>
  );
}
