import type { Resource } from "../data/resources";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-card">
      <div className="resource-card-top">
        <span className={`resource-logo logo-${resource.color}`}>{resource.monogram}</span>
        <div className="resource-status-group">
          <span className="resource-status"><i />{resource.status}</span>
          <span className="resource-kind">{resource.kind}</span>
        </div>
      </div>
      <div className="resource-location">{resource.location}</div>
      <h3>{resource.name}</h3>
      <p>{resource.description}</p>
      <div className="tag-list">
        {resource.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="resource-footer">
        <div className="resource-source">
          <strong>{resource.timing}</strong>
          <span>{resource.verified} · Pioneer 已整理</span>
        </div>
        <a href={`/resources/${resource.slug}`} aria-label={`查看 ${resource.name} 的整理详情`}>
          整理详情 <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
