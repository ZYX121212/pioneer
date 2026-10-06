import type {Resource} from '../data/resources';
import {resourceCardSummary} from '../lib/resourceCardSummary';
import {CardFactIcon} from './CardFactIcon';

export function ResourceDecisionFooter({resource,lang='zh'}:{resource:Resource;lang?:'zh'|'en'}){
 const prefix=lang==='en'?'/en':'',href=resource.detailPath?`${prefix}${resource.detailPath}`:`${prefix}/resources/${resource.slug}`;
 const label=`${lang==='en'?'Research brief':'整理详情'}: ${resource.name}`;
 return <div className="resource-footer resource-decision-footer" aria-label={lang==='en'?'Decision facts':'决策信息'}>
 {resourceCardSummary(resource,lang).map((fact,index)=><div className="resource-decision-fact" key={index}><CardFactIcon kind={fact.icon}/><div><strong title={fact.label}>{fact.label}</strong><span title={fact.value}>{fact.value}</span></div></div>)}
 <a href={href} aria-label={label} title={label} data-audience-event="resource:open" data-audience-target={resource.slug}><span aria-hidden="true">→</span></a>
 </div>;
}
