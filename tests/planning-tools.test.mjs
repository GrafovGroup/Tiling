import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuantity, convertMeasurement, floorBudget, planningContext, parseAmount, SQ_FT_PER_SQ_M } from '../app/planning-calculations.ts';
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
