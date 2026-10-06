"use client";
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import world from '../data/globeCountries.json';
import { resources, type Resource } from '../data/resources';
import { globeCountries, globeCities, chinaRegions, globePlaces, matchesGlobePlace, type GlobePlace } from '../lib/globeDiscovery';
import { homeRegions, matchesHomeRegion } from '../lib/homeDiscovery';
const regionCenters: Record<string,[number,number]> = {'asia':[110,25],'north-america':[-100,35],'europe':[15,48],'latin-america':[-65,-20],'oceania':[140,-25]};
const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
export function InteractiveGlobe({lang,activeRegion,onRegion,entries=resources}:{lang:'zh'|'en';activeRegion:string;onRegion:(id:string)=>void;entries?:Resource[]}) {
 const en=lang==='en', uid=useId().replace(/:/g,''), svg=useRef<SVGSVGElement>(null);
 const [rotation,setRotation]=useState<[number,number]>([-105,-20]);
 const [zoom,setZoom]=useState(1),[hover,setHover]=useState('');
 const drag=useRef<{x:number;y:number;rotation:[number,number];moved:boolean;id:number}|null>(null);
 const pointers=useRef(new Map<number,{x:number;y:number}>());
 const pinch=useRef<{distance:number;zoom:number}|null>(null);
 const selected=globePlaces.find(p=>p.id===activeRegion);
 const country=selected?.parent?globeCountries.find(p=>p.id===selected.parent):selected;
 const count=useMemo(()=>Object.fromEntries(globePlaces.map(p=>[p.id,entries.filter(r=>matchesGlobePlace(r,p.id)).length])),[entries]);
 useEffect(()=>{if(selected){setRotation([-selected.lon,-selected.lat]);setZoom(selected.id==='country:CHN'?1.8:selected.id.startsWith('region:')?3.5:selected.parent?6:2.7);}else if(activeRegion==='all'){setZoom(1);}else if(regionCenters[activeRegion]) {const [lon,lat]=regionCenters[activeRegion];setRotation([-lon,-lat]);setZoom(1.15);}},[activeRegion,selected]);
 const adjustZoom=(delta:number)=>setZoom(z=>clamp(z*delta,1,7));
 useEffect(()=>{const el=svg.current;if(!el)return;const wheel=(e:WheelEvent)=>{e.preventDefault();adjustZoom(Math.exp(-e.deltaY*.0015));};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel);},[]);
 const projection=geoOrthographic().translate([360,230]).scale(190*zoom).rotate([rotation[0],rotation[1],0]).clipExtent([[0,0],[720,460]]);
 const path=geoPath(projection);
 const cities=country?globeCities.filter(p=>p.parent===country.id):[];
 const choices=country?.id==='country:CHN'?[...chinaRegions.slice(31),...chinaRegions.slice(0,31),...cities.filter(c=>!['Beijing','Shanghai','Hong Kong','Macao'].includes(c.en))]:country?cities:globeCountries.filter(p=>count[p.id]>0 || ['country:CHN','country:JPN','country:SGP'].includes(p.id));
 const dots=country?cities:globeCountries.filter(p=>count[p.id]>0 || p.id==='country:SGP');
 function choose(p:GlobePlace) {if(!drag.current?.moved)onRegion(p.id);}
 function reset(){setRotation([-105,-20]);setZoom(1);onRegion('all');}
 const hovered=globePlaces.find(p=>p.id===hover);
 return <aside className="signal-panel interactive-signal" aria-label={en?'Interactive global resource map':'全球创业资源交互地图'}>
  <div className="globe-heading"><div><strong>GLOBAL SIGNAL MAP</strong><span>{en?'Find your next opportunity on the globe':'转动地球，发现下一站机会'}</span></div><span className="signal-curated">EXPLORE</span></div>
  <nav className="globe-breadcrumb" aria-label={en?'Location path':'地点路径'}><button onClick={reset}>{en?'World':'全球'}</button>{country&&<><span>›</span><button onClick={()=>onRegion(country.id)}>{country[lang]}</button></>}{selected?.parent&&<><span>›</span><span>{selected[lang]}</span></>}</nav>
  <div className="globe-stage">
   <svg ref={svg} viewBox="0 0 720 460" tabIndex={0} role="group" aria-label={en?'Drag to rotate; scroll or pinch to zoom; arrow keys rotate, plus and minus zoom':'拖动旋转，滚轮或双指缩放；方向键旋转，加减键缩放'}
    onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home')reset();else if(['+','=','-'].includes(e.key))adjustZoom(e.key==='-'?.8:1.25);else setRotation(([x,y])=>[x+(e.key==='ArrowLeft'?-10:e.key==='ArrowRight'?10:0),clamp(y+(e.key==='ArrowUp'?10:e.key==='ArrowDown'?-10:0),-85,85)]);}}}
    onPointerDown={e=>{pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});drag.current={x:e.clientX,y:e.clientY,rotation,moved:false,id:e.pointerId};if(pointers.current.size===2){const [a,b]=[...pointers.current.values()];pinch.current={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom};drag.current.moved=true;}}}
    onPointerMove={e=>{if(!pointers.current.has(e.pointerId)||!drag.current)return;pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.current.size===2&&pinch.current){const [a,b]=[...pointers.current.values()];setZoom(clamp(pinch.current.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.current.distance,1,7));drag.current.moved=true;return;}const d=drag.current,dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>4){d.moved=true;svg.current?.setPointerCapture(e.pointerId);setRotation([d.rotation[0]+dx*.22/zoom,clamp(d.rotation[1]-dy*.22/zoom,-85,85)]);}}}
    onPointerUp={e=>{pointers.current.delete(e.pointerId);pinch.current=null;if(pointers.current.size){drag.current=null;}if(svg.current?.hasPointerCapture(e.pointerId))svg.current.releasePointerCapture(e.pointerId);}}
    onPointerCancel={()=>{pointers.current.clear();drag.current=null;pinch.current=null;}}>
    <defs><radialGradient id={`${uid}ocean`} cx="35%" cy="25%"><stop stopColor="#195c4d"/><stop offset=".65" stopColor="#073c31"/><stop offset="1" stopColor="#011b18"/></radialGradient><radialGradient id={`${uid}shade`} cx="32%" cy="28%"><stop offset=".5" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".65"/></radialGradient></defs>
    <path d={path({type:'Sphere'})??''} fill={`url(#${uid}ocean)`} stroke="#86ad79" strokeWidth="1.5"/>
    <path d={path(geoGraticule10())??''} fill="none" stroke="#72a880" strokeOpacity=".16" strokeWidth=".6"/>
    {world.features.map(f=>{const regionId='regionId' in f.properties?f.properties.regionId:null;const p=country?.id==='country:CHN'&&regionId?chinaRegions.find(c=>c.id===regionId):globeCountries.find(c=>c.id===f.properties.id);const mapId=p?.id??f.properties.id;return <path key={'key' in f.properties ? f.properties.key : f.properties.id} d={path(f as GeoPermissibleObjects)??''} className={`globe-country ${country?.id===f.properties.id?'is-selected':''} ${'maritime' in f.properties&&f.properties.maritime?'globe-maritime':''} ${count[f.properties.id]>0?'has-resources':''}`} onPointerEnter={()=>setHover(mapId)} onPointerLeave={()=>setHover('')} onClick={()=>p&&choose(p)}><title>{`${p?.[lang]} · ${count[mapId]??0} ${en?'resources':'条资源'}`}</title></path>;})}
    <path d={path({type:'Sphere'})??''} fill={`url(#${uid}shade)`} pointerEvents="none"/>
    {dots.map(p=>{if(geoDistance([p.lon,p.lat],[-rotation[0],-rotation[1]])>Math.PI/2)return null;const xy=projection([p.lon,p.lat]);if(!xy||xy[0]<18||xy[0]>702||xy[1]<18||xy[1]>442)return null;return <g key={p.id} transform={`translate(${xy[0]},${xy[1]})`} className="globe-marker" onClick={()=>choose(p)}><title>{`${p[lang]} · ${count[p.id]} ${en?'resources':'条资源'}`}</title><circle r="14" fill="transparent"/><circle r="7" fill="#f4d66b" fillOpacity=".2"/><circle r="3" fill="#ffe3a0"/>{(country||['country:CHN','country:JPN','country:SGP'].includes(p.id))&&<text x="10" y="5">{p[lang]}</text>}</g>;})}
   </svg>
   <div className="globe-controls"><button aria-label={en?'Zoom in':'放大'} onClick={()=>adjustZoom(1.3)} disabled={zoom>=7}>+</button><button aria-label={en?'Zoom out':'缩小'} onClick={()=>adjustZoom(1/1.3)} disabled={zoom<=1}>−</button><button aria-label={en?'Reset globe':'重置地球'} onClick={reset}>↺</button></div>
   <div className="globe-hint" role="status">{hovered?`${hovered[lang]} · ${count[hovered.id]??0} ${en?'resources':'条资源'}`:en?'Drag to rotate · Scroll / pinch to zoom':'拖动旋转 · 滚轮 / 双指缩放'}</div>
  </div>
  <div className="globe-browser"><div className="globe-selection"><strong>{selected?selected[lang]:en?'Explore the world':'探索全球'}</strong><span>{selected?`${count[selected.id]} ${en?'resources':'条资源'}`:`${entries.length} ${en?'curated briefs':'站内整理档案'}`}</span><button onClick={()=>document.getElementById('resources')?.scrollIntoView({behavior:'smooth'})}>{en?'View resources ↓':'查看资源 ↓'}</button></div>
   {!country&&<div className="globe-regions">{homeRegions.map(r=><button key={r.id} aria-pressed={activeRegion===r.id} onClick={()=>onRegion(r.id)}>{r[lang]} <small>{entries.filter(p=>matchesHomeRegion(p,r.id)).length}</small></button>)}</div>}
   <div className="globe-places" aria-label={country?(en?'Choose region or city':'选择地区或城市'):(en?'Choose country':'选择国家')}>{choices.map(p=><button key={p.id} aria-pressed={activeRegion===p.id} onClick={()=>onRegion(p.id)}>{p[lang]} <small>{count[p.id]}</small></button>)}</div>
   {country&&cities.length===0&&<p>{en?'City detail is not yet available for this country. View all its resources.':'该国家暂未细分城市，可查看全国资源。'}</p>}
   {selected&&count[selected.id]===0&&<p role="status">{en?'No resource briefs here yet. Try another location.':'这里暂未收录资源，可继续探索其他地点。'}</p>}
   <small className="globe-note">{en?'Counts include historical briefs · Resource locations, not eligibility':'数量含历史档案 · 按资源所在地统计，不代表申请资格'}</small>
  </div>
 </aside>;
}
