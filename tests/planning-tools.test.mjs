import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuantity, convertMeasurement, floorBudget, planningContext, setPlanningParams, parseAmount, SQ_FT_PER_SQ_M } from '../app/planning-calculations.ts';
import { attachmentError, MAX_ATTACHMENT_BYTES, MAX_ATTACHMENT_TOTAL_BYTES } from '../app/quote-attachments.ts';
const base={mode:'dimensions',unit:'ft',surfaces:[{length:'20',width:'10'}],area:'',waste:'10',boxCoverage:'11'};
test('quantity sums surfaces, adds purchasing allowance and rounds full cartons without charging labour on waste',()=>{
 const q=calculateQuantity(base);assert.equal(q.area,200);assert.ok(Math.abs(q.orderArea-220)<1e-10);assert.equal(q.cartons,20);
 assert.deepEqual(floorBudget(q.areaSqFt,'zelta'),{low:2600,high:6800});
 const more=calculateQuantity({...base,surfaces:[...base.surfaces,{length:'5',width:'3'}]});assert.equal(more.area,215);assert.equal(more.cartons,22);
 assert.deepEqual(floorBudget(200,'prime'),{low:1600,high:3000});assert.equal(floorBudget(200,'unknown'),null);
});
test('metric conversion and decimal commas retain physical area',()=>{
 const q=calculateQuantity({...base,unit:'m',surfaces:[{length:'3,048',width:'6,096'}]});assert.ok(Math.abs(q.areaSqFt-200)<1e-9);
 assert.equal(convertMeasurement('10','ft','m'),'3.048');assert.equal(convertMeasurement('200','ft','m',true),'18.580608');
 assert.ok(Math.abs(Number(convertMeasurement('18.580608','m','ft',true))-200)<1e-9);
 assert.equal(parseAmount('1,5'),1.5);for(const value of ['','-1','Infinity','1e3','1,2,3','<script>','NaN'])assert.equal(parseAmount(value),null);
});
test('invalid quantity inputs cannot produce misleading results',()=>{
 for(const input of [{...base,waste:'31'},{...base,waste:'-1'},{...base,boxCoverage:'0'},{...base,mode:'area',area:'0'},{...base,mode:'area',area:'1000001'},{...base,surfaces:[{length:'12',width:''}]}])assert.ok(calculateQuantity(input).error);
 const q=calculateQuantity({...base,mode:'area',area:'30',waste:'0',boxCoverage:''});assert.equal(q.orderArea,30);assert.equal(q.cartons,null);
});
test('calculator handoff accepts only bounded numerical measurements and recognized units',()=>{
 const q={calc_area:'200',calc_waste:'10',calc_unit:'ft'};assert.match(planningContext(q,'en').summary,/200 sq. ft./);assert.match(planningContext(q,'fr').summary,/200 pi²/);
 for(const change of [{calc_area:['200']},{calc_unit:['ft']},{calc_waste:'999'},{calc_area:'<script>'},{calc_unit:'yards'}])assert.equal(planningContext({...q,...change},'en'),null);
 assert.ok(SQ_FT_PER_SQ_M>10.76);
});
const photo={name:'test.jpg',type:'image/jpeg',size:1024};
test('optional attachments accept supported images and PDFs and reject size, type and count problems',()=>{
 assert.equal(attachmentError([]),'');assert.equal(attachmentError([photo]),'');assert.equal(attachmentError([{name:'plan.pdf',type:'application/pdf',size:10}]),'');assert.equal(attachmentError([{name:'phone.heic',type:'',size:10}]),'');
 for(const files of [Array(6).fill(photo),[{...photo,size:0}],[{...photo,size:MAX_ATTACHMENT_BYTES+1}],Array(3).fill({...photo,size:MAX_ATTACHMENT_TOTAL_BYTES/3+1}),[{...photo,name:'test.exe'}],[{...photo,type:'text/html'}]])assert.ok(attachmentError(files));
 assert.match(attachmentError([{...photo,size:0}],'fr'),/vide/);
});
test('switching units keeps exact-carton quantities stable',()=>{
 const metric={...base,unit:'m',surfaces:base.surfaces.map(s=>({length:convertMeasurement(s.length,'ft','m'),width:convertMeasurement(s.width,'ft','m')})),boxCoverage:convertMeasurement(base.boxCoverage,'ft','m',true)};
 assert.equal(calculateQuantity(metric).cartons,20);
 const back={...metric,unit:'ft',surfaces:metric.surfaces.map(s=>({length:convertMeasurement(s.length,'m','ft'),width:convertMeasurement(s.width,'m','ft')})),boxCoverage:convertMeasurement(metric.boxCoverage,'m','ft',true)};
 assert.equal(calculateQuantity(back).cartons,20);
});


test('calculator handoff reproduces carton counts from coverage in the selected unit', () => {
 const cases = [
  { unit: 'ft', area: '120', waste: '10', coverage: '20', cartons: 7 },
  { unit: 'm', area: '6,25', waste: '0', coverage: '1,25', cartons: 5 },
  { unit: 'm', area: '1', waste: '0', coverage: '0.1', cartons: 10 },
  { unit: 'ft', area: '0.0000002', waste: '0', coverage: '0.0000001', cartons: 2 },
 ];
 for (const item of cases) {
  const result = calculateQuantity({...base,mode:'area',unit:item.unit,area:item.area,waste:item.waste,boxCoverage:item.coverage});
  assert.equal(result.cartons,item.cartons);
  const params = new URLSearchParams({ service:'tile-supply-delivery' });
  setPlanningParams(params,result);
  assert.equal(params.get('service'),'tile-supply-delivery');
  const plan = planningContext(Object.fromEntries(params),'en');
  assert.equal(plan.cartons,result.cartons);
  assert.equal(plan.boxCoverage,result.boxCoverage);
  assert.equal(plan.unit,item.unit);
  assert.equal(plan.areaSqFt,result.areaSqFt);
 }
});

test('old, repeated or invalid carton parameters do not replace valid measurements or invent box counts', () => {
 const measurement = {calc_area:'120',calc_waste:'10',calc_unit:'ft'};
 const legacy = planningContext(measurement,'en');
 assert.equal(legacy.cartons,null);
 for (const invalid of [['20','40'],'0','-2','10001','1e4','nope','0.00000000000000000001']) {
  const plan = planningContext({...measurement,calc_box_coverage:invalid,calc_cartons:'99'},'en');
  assert.equal(plan.summary,legacy.summary);
  const params = new URLSearchParams({calc_box_coverage:'99'});
  setPlanningParams(params,plan);
  assert.equal(params.has('calc_box_coverage'),false);
 }
 const french = planningContext({calc_area:'10',calc_waste:'0',calc_unit:'ft',calc_box_coverage:'15',calc_cartons:'5000'},'fr');
 assert.match(french.summary,/15 pi² par boîte, prévoir 1 boîte entière\./);
});
