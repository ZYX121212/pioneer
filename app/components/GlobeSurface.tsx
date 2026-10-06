"use client";
import { useEffect, useRef, useState } from 'react';
import {geoOrthographic} from 'd3-geo';
type Pixels={day:Uint8ClampedArray;night:Uint8ClampedArray;width:number;height:number};
let pixelsPromise:Promise<Pixels>|undefined;
function loadSurface(){
 if(!pixelsPromise)pixelsPromise=Promise.all(['/home/earth-surface.jpg','/home/earth-lights.png'].map(src=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;}))).then(([day,night])=>{
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const ctx=canvas.getContext('2d')!;ctx.drawImage(day,0,0,1024,512);const d=ctx.getImageData(0,0,1024,512).data;ctx.drawImage(night,0,0,1024,512);return {day:d,night:ctx.getImageData(0,0,1024,512).data,width:1024,height:512};});
 return pixelsPromise;
}
export function GlobeSurface({rotation,zoom}:{rotation:[number,number];zoom:number}){
 const canvas=useRef<HTMLCanvasElement>(null);const [ready,setReady]=useState(false);
 useEffect(()=>{let cancelled=false;void loadSurface().then(pixels=>{if(cancelled)return;const ctx=canvas.current?.getContext('2d');if(!ctx)return;
 const width=540,height=345,scale=.75,projection=geoOrthographic().translate([360*scale,230*scale]).scale(190*zoom*scale).rotate([rotation[0],rotation[1],0]);const image=ctx.createImageData(width,height);
 const radius=190*zoom*scale;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const dx=(x-width/2)/radius,dy=(y-height/2)/radius;if(dx*dx+dy*dy>1)continue;const pos=projection.invert?.([x,y]);if(!pos)continue;
 const sx=Math.floor((pos[0]+180)/360*pixels.width)%pixels.width,sy=Math.min(pixels.height-1,Math.floor((90-pos[1])/180*pixels.height)),source=(sy*pixels.width+sx)*4,dest=(y*width+x)*4;
 const gray=pixels.day[source]*.25+pixels.day[source+1]*.5+pixels.day[source+2]*.25;const light=Math.max(pixels.night[source],pixels.night[source+1],pixels.night[source+2])/255;const shade=.32+.68*Math.max(0,Math.sqrt(1-dx*dx-dy*dy)*.85-dx*.35-dy*.35);
 image.data[dest]=Math.min(255,(14+gray*.42)*shade+light*210);image.data[dest+1]=Math.min(255,(19+gray*.42)*shade+light*134);image.data[dest+2]=Math.min(255,(19+gray*.38)*shade+light*59);image.data[dest+3]=255;
 }
 ctx.putImageData(image,0,0);setReady(true);
 }).catch(()=>{});return()=>{cancelled=true;};},[rotation,zoom]);
 return <><div className="globe-surface-fallback" style={{width:`${380*zoom/720*100}%`,aspectRatio:"1",display:ready?"none":undefined}} aria-hidden="true"/><canvas className="globe-surface" width="540" height="345" ref={canvas} aria-hidden="true"/></>;
}
