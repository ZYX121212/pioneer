import type { KnowledgeItem } from "../data/knowledge";

export function KnowledgeCard({ item }: { item: KnowledgeItem }) {
  return (
    <article className={`knowledge-card knowledge-${item.color}`}>
      <div className="knowledge-card-meta">
        <span>{item.kind}</span>
        <span>{item.scope}</span>
      </div>
      <div className="knowledge-card-number">{String(item.id).padStart(2, "0")}</div>
      <span className="knowledge-source">{item.source}</span>
      <h4>{item.title}</h4>
      <p>{item.description}</p>
      <div className="knowledge-tags">
        {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="knowledge-card-footer">
        <span>{item.level} · {item.duration}</span>
        <a href={item.url} target="_blank" rel="noreferrer" aria-label={`前往 ${item.title} 原始来源`}>
          查看原始来源 <b aria-hidden="true">↗</b>
        </a>
      </div>
    </article>
  );
}
