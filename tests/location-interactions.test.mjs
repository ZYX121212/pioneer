import assert from 'node:assert/strict';
import {register} from 'tsx/esm/api';
import test from 'node:test';
import {JSDOM} from 'jsdom';
import {act,createElement,StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {geoOrthographic,geoPath} from 'd3-geo';

register();
const {InteractiveGlobe}=await import('../app/components/InteractiveGlobe.tsx');
const {LocationPanel}=await import('../app/components/LocationPanel.tsx');
const {globePlaces}=await import('../app/lib/globeDiscovery.ts');

async function mount(t,Component,initialProps){
 const dom=new JSDOM('<button id="opener">Open</button><div id="root"></div>',{url:'http://localhost'});
 const globals={window:dom.window,document:dom.window.document,Image:dom.window.Image,IS_REACT_ACT_ENVIRONMENT:true};
 const previous=Object.fromEntries(Object.keys(globals).map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 for(const [key,value] of Object.entries(globals))Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
 const scrolls=[];let modalOpens=0;
 dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true;modalOpens++;};
 dom.window.HTMLDialogElement.prototype.scrollTo=function(options){this.scrollTop=options.top;scrolls.push(options);};
 document.querySelector('#opener').focus();
 const root=createRoot(document.querySelector('#root'));
 let mounted=true;
 const unmount=async()=>{if(mounted){await act(()=>root.unmount());mounted=false;}};
 let props=initialProps;
 const render=async patch=>{props={...props,...patch};await act(()=>root.render(createElement(StrictMode,null,createElement(Component,props))));};
 t.after(async()=>{
  await unmount();dom.window.close();
  for(const [key,descriptor] of Object.entries(previous)){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
 });
 await render({});
 return {render,unmount,scrolls,get modalOpens(){return modalOpens;},click:async el=>{await act(()=>el.click());},key:async(el,key)=>{await act(()=>el.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true})));},dom};
}
function assertView(rotation,zoom){
 const projection=geoOrthographic().translate([360,230]).scale(190*zoom).rotate([...rotation,0]).clipExtent([[0,0],[720,460]]);
 assert.equal(document.querySelector('.globe-stage svg > path').getAttribute('d'),geoPath(projection)({type:'Sphere'}));
 // Compare all country paths, including hidden ones, to verify rotation and scale.
 return import('../app/data/globeCountries.json',{with:{type:'json'}}).then(({default:world})=>{
  const countries=document.querySelectorAll('.globe-country');
  assert.equal(countries.length,world.features.length);
  world.features.forEach((feature,index)=>assert.equal(countries[index].getAttribute('d'),geoPath(projection)(feature)??''));
 });
}
const globeProps={lang:'en',activeRegion:'all',onRegion:()=>{},entries:[]};
test('globe follows external region/country/city changes and preserves user rotation when clearing the filter',async t=>{
 const ui=await mount(t,InteractiveGlobe,globeProps);
 await assertView([15,-15],1.2);
 for(const [id,center,zoom] of [['asia',[110,25],1.15],['europe',[15,48],1.15],['north-america',[-100,35],1.15],['latin-america',[-65,-20],1.15],['oceania',[140,-25],1.15],['country:CHN',null,1.2],['city:JPN:Tokyo',null,1.2]]){
  const place=globePlaces.find(p=>p.id===id);const [lon,lat]=center??[place.lon,place.lat];
  await ui.render({activeRegion:id});await assertView([-lon,-lat],zoom);
 }
 const tokyo=globePlaces.find(p=>p.id==='city:JPN:Tokyo');
 const svg=document.querySelector('.globe-stage svg');
 await ui.key(svg,'ArrowRight');await ui.click(document.querySelector('[aria-label="Zoom in"]'));
 await assertView([-tokyo.lon+10,-tokyo.lat],1.56);
 await act(()=>svg.dispatchEvent(new ui.dom.window.WheelEvent('wheel',{deltaY:-100,bubbles:true,cancelable:true})));
 const wheelZoom=1.56*Math.exp(.15);
 await assertView([-tokyo.lon+10,-tokyo.lat],wheelZoom);
 await ui.render({lang:'zh',entries:[]});await assertView([-tokyo.lon+10,-tokyo.lat],wheelZoom);
 await ui.render({activeRegion:'all'});await assertView([-tokyo.lon+10,-tokyo.lat],1.2);
 await ui.key(svg,'Home');await assertView([15,-15],1.2);
});
test('globe country picker drives focus, and reset restores the default view',async t=>{
 let ui;const onRegion=id=>{void ui.render({activeRegion:id});};
 ui=await mount(t,InteractiveGlobe,{...globeProps,onRegion,activeRegion:'europe'});
 await ui.click([...document.querySelectorAll('.globe-places button')].find(el=>el.textContent.startsWith('Japan')));
 const japan=globePlaces.find(p=>p.id==='country:JPN');await assertView([-japan.lon,-japan.lat],1.2);
 await ui.click(document.querySelector('[aria-label="Zoom in"]'));
 await ui.click(document.querySelector('[aria-label="Reset globe"]'));await assertView([15,-15],1.2);
 assert.equal(document.querySelector('.globe-selection strong').textContent,'Explore the world');
});
test('panel resets every tab and scroll on location changes while keeping the same open dialog and focus',async t=>{
 const ui=await mount(t,LocationPanel,{id:'country:CHN',lang:'en',entries:[],onClose:()=>{},onSelect:()=>{},onView:()=>{},loading:false,error:false});
 const dialog=document.querySelector('dialog');const opens=ui.modalOpens;
 for(const tab of ['resources','event','organization','guide']){
  await ui.click(document.querySelector(`#location-tab-${tab}`));
  assert.equal(document.querySelector(`#location-tab-${tab}`).getAttribute('aria-selected'),'true');
  dialog.scrollTop=240;document.querySelector(`#location-tab-${tab}`).focus();
  const focused=document.activeElement;const scrolls=ui.scrolls.length;
  await ui.render({id:tab==='resources'||tab==='organization'?'city:CHN:Beijing':'country:CHN'});
  assert.equal(document.querySelector('#location-tab-overview').getAttribute('aria-selected'),'true');
  assert.equal(dialog.scrollTop,0);assert.equal(ui.scrolls.length,scrolls+1);
  assert.equal(document.querySelector('dialog'),dialog);assert.equal(dialog.open,true);
  assert.equal(document.activeElement,focused);assert.equal(ui.modalOpens,opens);
  assert.equal(document.body.style.overflow,'hidden');
 }
 await ui.click(document.querySelector('#location-tab-guide'));dialog.scrollTop=150;
 const scrolls=ui.scrolls.length;
 await ui.render({loading:true,lang:'zh',entries:[]});
 assert.equal(document.querySelector('#location-tab-guide').getAttribute('aria-selected'),'true');
 assert.equal(dialog.scrollTop,150);assert.equal(ui.scrolls.length,scrolls);
});
test('panel city selection resets overview, supports empty resources, and restores focus on close',async t=>{
 let ui;const onSelect=id=>{void ui.render({id});};
 ui=await mount(t,LocationPanel,{id:'country:CHN',lang:'en',entries:[],onClose:()=>{},onSelect,onView:()=>{},loading:false,error:false});
 await ui.click(document.querySelector('#location-tab-resources'));document.querySelector('dialog').scrollTop=200;
 await ui.click([...document.querySelectorAll('.location-subplaces button')].find(el=>el.textContent.startsWith('Beijing')));
 assert.equal(document.querySelector('#location-panel-title').textContent,'Beijing');
 assert.equal(document.querySelector('#location-tab-overview').getAttribute('aria-selected'),'true');
 assert.equal(document.querySelector('dialog').scrollTop,0);
 assert.equal(document.querySelector('.location-empty strong').textContent,'No resources here yet');
 await ui.render({id:'country:SGP'});
 await ui.key(document.querySelector('#location-tab-overview'),'ArrowRight');
 assert.equal(document.querySelector('#location-tab-resources').getAttribute('aria-selected'),'true');
 await ui.unmount();
 assert.equal(document.body.style.overflow,'');
 assert.equal(document.activeElement.id,'opener');
});
