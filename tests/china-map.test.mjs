import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {geoArea,geoContains,geoOrthographic,geoPath} from 'd3-geo';
const world=JSON.parse(await readFile(new URL('../app/data/globeCountries.json',import.meta.url)));
const metadata=JSON.parse(await readFile(new URL('../app/data/chinaMapSource.json',import.meta.url)));
const china=world.features.filter(f=>f.properties.id==='country:CHN');
test('China geometry covers every provincial-level area and the maritime layer',()=>{
 assert.equal(china.length,35);
 const codes=china.map(f=>f.properties.regionId).filter(Boolean);
 assert.equal(new Set(codes).size,34);
 assert.deepEqual(codes.sort(),metadata.provinceCodes.map(c=>`region:CHN:${c}`).sort());
 assert.ok(china.some(f=>f.properties.maritime));
 assert.ok(!world.features.some(f=>['country:TWN','country:HKG','country:MAC'].includes(f.properties.id)));
 assert.equal(china.reduce((n,f)=>n+(f.geometry.type==='Polygon'?1:f.geometry.coordinates.length),0),339);
});
test('Taiwan, Hong Kong, Macao and Hainan have real land polygons and valid spherical winding',()=>{
 for(const [code,point] of [[710000,[121,24]],[810000,[114.15,22.4]],[820000,[113.55,22.2]],[460000,[109.5,19.2]]]) {
  const feature=china.find(f=>f.properties.regionId===`region:CHN:${code}`);
  assert.ok(geoArea(feature)>0&&geoArea(feature)<Math.PI,`winding ${code}`);
  assert.equal(geoContains(feature,point),true,`land ${code}`);
 }
});
test('China default focus keeps its complete source extent inside the viewport',()=>{
 const projection=geoOrthographic().translate([360,230]).scale(190*1.2).rotate([-104.5,-27,0]);
 const bounds=geoPath(projection).bounds({type:'FeatureCollection',features:china});
 assert.ok(bounds[0][0]>=0&&bounds[1][0]<=720,JSON.stringify(bounds));
 assert.ok(bounds[0][1]>=0&&bounds[1][1]<=460,JSON.stringify(bounds));
 for(const f of china) assert.ok(geoPath(projection)(f));
});

test('no China polygon vertices are dropped from the pinned source dataset',async()=>{
 const {createHash}=await import('node:crypto');const points=[];
 function visit(x){if(typeof x[0]==='number'){points.push(x.join(','));return;}x.forEach(visit);}
 china.forEach(f=>visit(f.geometry.coordinates));
 assert.equal(points.length,metadata.sourceCoordinateCount);
 assert.equal(createHash('sha256').update(points.sort().join('\n')).digest('hex'),metadata.sourceCoordinateHash);
});
