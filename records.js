// 운동 기록 모듈 — localStorage(fitclipLogs) 기반 CRUD, 스트릭/캘린더/부위 밸런스, 백업/복원
const LOGS_KEY='fitclipLogs';
let logs=JSON.parse(localStorage.getItem(LOGS_KEY)||'[]');
if(!localStorage.getItem('fitclipSchema'))localStorage.setItem('fitclipSchema','1');
function saveLogs(){localStorage.setItem(LOGS_KEY,JSON.stringify(logs))}
function dstr(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function todayStr(){return dstr(new Date())}
function fmtDate(s){const[y,m,d]=s.split('-');const day=['일','월','화','수','목','금','토'][new Date(+y,m-1,+d).getDay()];return `${+m}월 ${+d}일 (${day})`}

// ── 기록 시트 상태 ──
let sheetVideo=null,editingLog=null,calMonth=(()=>{const d=new Date();d.setDate(1);return d})(),selectedDate=null;

function setsSummary(sets){
  const done=(sets||[]).filter(s=>s.reps);
  if(!done.length)return '체크만 완료';
  return `${done.length}세트 · `+done.map(s=>s.weight?`${s.weight}kg×${s.reps}`:`${s.reps}회`).join(' / ');
}
function lastRecordFor(name,excludeId){
  return logs.find(l=>l.exerciseName===name&&l.id!==excludeId)||null;
}

// ── 시트 열기/닫기 ──
function addSetRow(w,r){
  const row=document.createElement('div');row.className='set-row';
  const n=$('#setRows').children.length+1;
  row.innerHTML=`<span>${n}</span><input type="number" inputmode="decimal" min="0" step="0.5" placeholder="kg" value="${w??''}"><input type="number" inputmode="numeric" min="0" placeholder="회" value="${r??''}"><button class="set-del" aria-label="세트 삭제">×</button>`;
  row.querySelector('.set-del').onclick=()=>{row.remove();[...$('#setRows').children].forEach((el,i)=>el.querySelector('span').textContent=i+1)};
  $('#setRows').appendChild(row);
}
function openLogSheet(video,log){
  sheetVideo=video||null;editingLog=log||null;
  const direct=!video&&!(log&&log.videoId);
  $('#sheetTitle').textContent=log?'기록 수정':(video?video.exerciseName:'직접 기록 추가');
  $('#sheetNameRow').hidden=!direct;
  if(direct){
    const bodySel=$('#sheetBody'),moveSel=$('#sheetMove');
    bodySel.innerHTML=bodyCategories.map(c=>`<option>${c.name}</option>`).join('');
    moveSel.innerHTML=movementCategories.map(c=>`<option>${c.name}</option>`).join('');
    $('#sheetName').value=log?log.exerciseName:'';
    if(log){bodySel.value=log.bodyPart;moveSel.value=log.movementPattern}
  }
  const nameForLast=log?log.exerciseName:(video?video.exerciseName:null);
  const last=nameForLast?lastRecordFor(nameForLast,log?.id):null;
  $('#sheetLast').hidden=!last;
  if(last)$('#sheetLast').textContent=`지난 기록 (${fmtDate(last.date)}): ${setsSummary(last.sets)}`;
  $('#setRows').innerHTML='';
  const seedSets=log?log.sets:(last?last.sets:null);
  if(seedSets&&seedSets.length)seedSets.forEach(s=>addSetRow(s.weight,s.reps));else addSetRow();
  $('#sheetDuration').value=log?.durationMin??'';
  $('#sheetMemo').value=log?.memo??'';
  $('#sheetBackdrop').hidden=false;$('#logSheet').hidden=false;
}
function closeSheet(){$('#sheetBackdrop').hidden=true;$('#logSheet').hidden=true;sheetVideo=null;editingLog=null}
function saveSheet(){
  const direct=!$('#sheetNameRow').hidden;
  let name,body,move,vid=null;
  if(direct){
    name=$('#sheetName').value.trim();
    if(!name){alert('운동명을 입력해주세요.');return}
    body=$('#sheetBody').value;move=$('#sheetMove').value;
  }else{
    const src=editingLog||{exerciseName:sheetVideo.exerciseName,bodyPart:sheetVideo.bodyPart,movementPattern:sheetVideo.movementPattern,videoId:sheetVideo.id};
    name=src.exerciseName;body=src.bodyPart;move=src.movementPattern;vid=src.videoId??null;
  }
  const sets=[...$('#setRows').children].map(r=>{const[w,rep]=r.querySelectorAll('input');return{weight:parseFloat(w.value)||null,reps:parseInt(rep.value)||null}}).filter(s=>s.weight||s.reps);
  const dur=parseInt($('#sheetDuration').value)||null,memo=$('#sheetMemo').value.trim();
  if(editingLog){Object.assign(editingLog,{exerciseName:name,bodyPart:body,movementPattern:move,sets,durationMin:dur,memo})}
  else logs.unshift({id:Date.now(),date:todayStr(),videoId:vid,exerciseName:name,bodyPart:body,movementPattern:move,sets,durationMin:dur,memo});
  saveLogs();closeSheet();renderRecords();updateHomeSummary();if(currentVideo)updateDetailHint(currentVideo);
}

// ── 스트릭/캘린더/밸런스 ──
function calcStreak(){
  const ds=new Set(logs.map(l=>l.date));
  let week=0;for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);if(ds.has(dstr(d)))week++}
  let streak=0;const c=new Date();if(!ds.has(dstr(c)))c.setDate(c.getDate()-1);
  while(ds.has(dstr(c))){streak++;c.setDate(c.getDate()-1)}
  return{week,streak,today:logs.filter(l=>l.date===todayStr()).length,total:logs.length};
}
function renderStreak(){
  const s=calcStreak();
  $('#streakCard').innerHTML=s.total?`<div><b>${s.week}</b><span>최근 7일 운동일</span></div><div><b>${s.streak}</b><span>연속 운동일</span></div><div><b>${s.today}</b><span>오늘 기록</span></div>`:'<p class="empty-inline">아직 기록이 없습니다. 영상 상세에서 <b>✎ 운동 기록하기</b>를 눌러 시작해보세요!</p>';
}
function renderCalendar(){
  const y=calMonth.getFullYear(),m=calMonth.getMonth();
  $('#calTitle').textContent=`${y}년 ${m+1}월`;
  const ds=new Set(logs.map(l=>l.date)),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),today=todayStr();
  const g=$('#calendarGrid');g.innerHTML='';
  ['일','월','화','수','목','금','토'].forEach(w=>{const el=document.createElement('span');el.className='cal-week';el.textContent=w;g.appendChild(el)});
  for(let i=0;i<first;i++)g.appendChild(document.createElement('span'));
  for(let d=1;d<=days;d++){
    const date=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const b=document.createElement('button');
    b.className=`cal-day${ds.has(date)?' has-log':''}${date===today?' today':''}${date===selectedDate?' selected':''}`;
    b.textContent=d;
    b.onclick=()=>{selectedDate=selectedDate===date?null:date;renderRecords()};
    g.appendChild(b);
  }
}
function renderBalance(){
  const cut=new Date();cut.setDate(cut.getDate()-6);const cs=dstr(cut);
  const recent=logs.filter(l=>l.date>=cs);
  const wrap=$('#balanceBars');
  if(!recent.length){wrap.innerHTML='<p class="empty-inline">최근 7일 기록이 없습니다.</p>';return}
  const counts=bodyCategories.map(c=>[c.name,recent.filter(l=>l.bodyPart===c.name).length]);
  const max=Math.max(...counts.map(x=>x[1]),1);
  wrap.innerHTML=counts.map(([n,c])=>`<div class="bal-row"><span>${n}</span><div class="bal-track"><div class="bal-fill" style="width:${c/max*100}%"></div></div><b>${c}</b></div>`).join('');
}
function renderLogList(){
  const list=selectedDate?logs.filter(l=>l.date===selectedDate):logs;
  $('#logListTitle').textContent=selectedDate?`${fmtDate(selectedDate)} 기록`:'전체 기록';
  $('#logCount').textContent=`${list.length}개`;
  const wrap=$('#logList');wrap.innerHTML='';
  if(!list.length){wrap.innerHTML='<div class="empty">기록이 없습니다.</div>';return}
  let lastDate=null;
  list.forEach(l=>{
    if(l.date!==lastDate&&!selectedDate){const h=document.createElement('h4');h.className='log-date';h.textContent=fmtDate(l.date);wrap.appendChild(h);lastDate=l.date}
    const v=l.videoId?videos.find(x=>x.id===l.videoId):null;
    const el=document.createElement('article');el.className='log-card';
    el.innerHTML=`<button class="log-main"><b>${l.exerciseName}</b><p>${setsSummary(l.sets)}${l.durationMin?` · ${l.durationMin}분`:''}</p>${l.memo?`<p class="log-memo">${l.memo}</p>`:''}<span class="tag">${l.bodyPart}</span><span class="tag">${l.movementPattern}</span></button><div class="log-actions"><button class="text-btn edit">수정</button><button class="text-btn del">삭제</button></div>`;
    el.querySelector('.log-main').onclick=()=>{if(v)openDetail(v)};
    el.querySelector('.edit').onclick=()=>openLogSheet(v,l);
    el.querySelector('.del').onclick=()=>{if(confirm(`'${l.exerciseName}' 기록을 삭제할까요?`)){logs=logs.filter(x=>x.id!==l.id);saveLogs();renderRecords();updateHomeSummary()}};
    wrap.appendChild(el);
  });
}
function renderRecords(){renderStreak();renderCalendar();renderBalance();renderLogList()}

// ── 홈 요약 카드 / 상세 힌트 ──
function updateHomeSummary(){
  const el=$('#homeLogSummary');const s=calcStreak();
  el.hidden=false;
  el.innerHTML=`<button class="today-card"><div><h3>오늘의 운동</h3><p>${s.today?`오늘 ${s.today}개 기록 · ${s.streak}일 연속`:(s.total?`이번 주 ${s.week}일 운동 · 오늘은 아직 기록이 없어요`:'첫 운동을 기록해보세요!')}</p></div><span>▦</span></button>`;
  el.querySelector('.today-card').onclick=()=>go('recordsView');
}
function updateDetailHint(video){
  const last=lastRecordFor(video.exerciseName);
  const hint=$('#lastRecordHint');hint.hidden=!last;
  if(last)hint.textContent=`지난 기록 (${fmtDate(last.date)}): ${setsSummary(last.sets)}`;
}

// ── 앱 연동: go/openDetail 래핑 + 이벤트 바인딩 ──
const _go=go;go=function(v){_go(v);if(v==='recordsView')renderRecords();if(v==='homeView')updateHomeSummary()};
const _openDetail=openDetail;openDetail=function(v){_openDetail(v);updateDetailHint(v)};
$('#logButton').addEventListener('click',()=>{if(currentVideo)openLogSheet(currentVideo)});
$('#addRecordBtn').addEventListener('click',()=>openLogSheet(null));
$('#addSetBtn').addEventListener('click',()=>addSetRow());
$('#sheetCancel').addEventListener('click',closeSheet);
$('#sheetBackdrop').addEventListener('click',closeSheet);
$('#sheetSave').addEventListener('click',saveSheet);
$('#calPrev').addEventListener('click',()=>{calMonth.setMonth(calMonth.getMonth()-1);renderCalendar()});
$('#calNext').addEventListener('click',()=>{calMonth.setMonth(calMonth.getMonth()+1);renderCalendar()});
$('#exportBtn').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(logs,null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`fitclip-logs-${todayStr()}.json`;a.click();URL.revokeObjectURL(a.href);
});
$('#importBtn').addEventListener('click',()=>$('#importFile').click());
$('#importFile').addEventListener('change',(e)=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const arr=JSON.parse(r.result);
      if(!Array.isArray(arr))throw new Error('형식 오류');
      const add=arr.filter(x=>x&&x.id&&x.date&&x.exerciseName&&!logs.some(l=>l.id===x.id));
      logs=[...add,...logs].sort((a,b)=>b.id-a.id);saveLogs();renderRecords();updateHomeSummary();
      alert(`${add.length}개 기록을 가져왔습니다.`);
    }catch(err){alert('가져오기 실패: 올바른 기록 JSON 파일이 아닙니다.')}
    e.target.value='';
  };
  r.readAsText(f);
});
updateHomeSummary();
