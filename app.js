const bodyCategories = [
  {name:'가슴', emoji:'🫀', subs:['전체','상부','중부','하부']},
  {name:'등', emoji:'🏋️', subs:['전체','광배근','승모근','등 중앙','척추기립근']},
  {name:'어깨', emoji:'🟠', subs:['전체','전면','측면','후면','회전근개']},
  {name:'팔', emoji:'💪', subs:['전체','이두','삼두','전완']},
  {name:'하체', emoji:'🦵', subs:['전체','대퇴사두','햄스트링','둔근','종아리','내전근']},
  {name:'복근·코어', emoji:'🧱', subs:['전체','상복부','하복부','복사근','코어 안정성']},
  {name:'전신', emoji:'🏃', subs:['전체','근력','유산소','복합운동','워밍업']},
  {name:'스트레칭', emoji:'🧘', subs:['전체','목·어깨','상체','허리','고관절','하체']}
];

const movementCategories = [
  {name:'밀기', emoji:'🏋️', details:['전체','수평 밀기','수직 밀기','팔꿈치 펴기']},
  {name:'당기기', emoji:'🪝', details:['전체','수평 당기기','수직 당기기','팔꿈치 굽히기']},
  {name:'스쿼트', emoji:'🏃', details:['전체','양발 스쿼트','머신 스쿼트','한발 스쿼트']},
  {name:'힙힌지', emoji:'🟣', details:['전체','데드리프트','엉덩이 펴기','햄스트링 중심']},
  {name:'런지', emoji:'🚶', details:['전체','전진·후진','측면','고정형']},
  {name:'코어', emoji:'🧘', details:['전체','굽힘','회전','회전 저항','신전 저항','측면 안정성']},
  {name:'회전', emoji:'🌀', details:['전체','상체 회전','고관절 회전','가동성']},
  {name:'이동·전신', emoji:'🏃‍♂️', details:['전체','걷기·달리기','점프','운반','복합 동작']}
];

// 첫 번째 영상만 사용자가 제공한 실제 DEMIC Shorts입니다.
// 나머지는 UI와 필터 동작을 점검하기 위한 등록 예정 샘플입니다.
const videos = [
  {
    id:1,
    title:'DEMIC 운동 Shorts',
    exerciseName:'운동 자세',
    bodyPart:'전신',
    subBodyPart:'전체',
    movementPattern:'이동·전신',
    movementDetail:'복합 동작',
    equipment:'기타',
    difficulty:'확인 필요',
    youtubeId:'BkhOFoTvNZM',
    description:'사용자가 제공한 DEMIC Shorts 영상입니다. 영상 제목과 정확한 운동 분류는 실제 내용을 확인한 뒤 수정할 수 있습니다.',
    real:true
  },
  {
    id:2,title:'벤치프레스 자세 교정',exerciseName:'벤치프레스',bodyPart:'가슴',subBodyPart:'중부',
    movementPattern:'밀기',movementDetail:'수평 밀기',equipment:'바벨',difficulty:'초급',
    youtubeId:null,description:'UI 테스트용 등록 예정 항목입니다.',real:false
  },
  {
    id:3,title:'인클라인 벤치프레스',exerciseName:'인클라인 벤치프레스',bodyPart:'가슴',subBodyPart:'상부',
    movementPattern:'밀기',movementDetail:'수평 밀기',equipment:'바벨',difficulty:'초급',
    youtubeId:null,description:'UI 테스트용 등록 예정 항목입니다.',real:false
  },
  {
    id:4,title:'랫풀다운 자세',exerciseName:'랫풀다운',bodyPart:'등',subBodyPart:'광배근',
    movementPattern:'당기기',movementDetail:'수직 당기기',equipment:'머신',difficulty:'초급',
    youtubeId:null,description:'UI 테스트용 등록 예정 항목입니다.',real:false
  },
  {
    id:5,title:'스쿼트 기본 자세',exerciseName:'스쿼트',bodyPart:'하체',subBodyPart:'대퇴사두',
    movementPattern:'스쿼트',movementDetail:'양발 스쿼트',equipment:'바벨',difficulty:'초급',
    youtubeId:null,description:'UI 테스트용 등록 예정 항목입니다.',real:false
  },
  {
    id:6,title:'루마니안 데드리프트',exerciseName:'루마니안 데드리프트',bodyPart:'하체',subBodyPart:'햄스트링',
    movementPattern:'힙힌지',movementDetail:'햄스트링 중심',equipment:'바벨',difficulty:'중급',
    youtubeId:null,description:'UI 테스트용 등록 예정 항목입니다.',real:false
  }
];

let favorites = JSON.parse(localStorage.getItem('fitclipFavorites') || '[]');
let recent = JSON.parse(localStorage.getItem('fitclipRecent') || '[]');
let currentBody = '전체', currentSubBody = '전체';
let currentMovement = '전체', currentMovementDetail = '전체';
let currentVideo = null, previousView = 'homeView';
let savedMode = 'favorites';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function saveLocal(){
  localStorage.setItem('fitclipFavorites', JSON.stringify(favorites));
  localStorage.setItem('fitclipRecent', JSON.stringify(recent));
}
function isFavorite(id){ return favorites.includes(id); }

function go(viewId){
  const current = $('.view.active')?.id;
  if(viewId === 'detailView' && current) previousView = current;
  $$('.view').forEach(v => v.classList.toggle('active', v.id === viewId));
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.go === viewId));
  if(viewId === 'savedView') renderSaved();
  window.scrollTo({top:0,behavior:'smooth'});
}

function categoryCard(item, type){
  const btn = document.createElement('button');
  btn.className = 'category-card';
  btn.innerHTML = `<span class="emoji">${item.emoji}</span><b>${item.name}</b>`;
  btn.addEventListener('click', ()=>{
    if(type === 'body'){
      currentBody = item.name; currentSubBody = '전체'; renderBody();
      go('bodyView');
    }else{
      currentMovement = item.name; currentMovementDetail = '전체'; renderMovement();
      go('movementView');
    }
  });
  return btn;
}

function createVideoCard(video){
  const el = document.createElement('article');
  el.className = 'video-card';
  const thumb = video.youtubeId
    ? `<img src="https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg" alt="${video.title}"><span class="play">▶</span>`
    : `<span class="play">＋</span>`;
  el.innerHTML = `
    <button class="card-main" aria-label="${video.title} 상세 보기">
      <div class="thumb">${thumb}</div>
      <div class="card-copy">
        <h3>${video.title}</h3>
        <p>${video.bodyPart} · ${video.subBodyPart}</p>
        <p>${video.movementPattern} · ${video.equipment}</p>
      </div>
    </button>
    <button class="favorite-btn ${isFavorite(video.id)?'active':''}" aria-label="즐겨찾기">${isFavorite(video.id)?'★':'☆'}</button>
  `;
  el.querySelector('.card-main').addEventListener('click',()=>openDetail(video));
  el.querySelector('.favorite-btn').addEventListener('click',(e)=>{
    e.stopPropagation(); toggleFavorite(video.id); refreshAll();
  });
  return el;
}

function renderList(container, list){
  container.innerHTML = '';
  if(!list.length){
    container.innerHTML = `<div class="empty">해당 조건에 등록된 영상이 없습니다.</div>`;
    return;
  }
  list.forEach(v=>container.appendChild(createVideoCard(v)));
}

function renderHome(){
  const bodyWrap = $('#homeBodyCategories'); bodyWrap.innerHTML='';
  bodyCategories.forEach(x=>bodyWrap.appendChild(categoryCard(x,'body')));
  const moveWrap = $('#homeMovementCategories'); moveWrap.innerHTML='';
  movementCategories.forEach(x=>moveWrap.appendChild(categoryCard(x,'movement')));
  const recentVideos = recent.map(id=>videos.find(v=>v.id===id)).filter(Boolean).slice(0,3);
  renderList($('#recentList'), recentVideos.length ? recentVideos : videos.slice(0,3));
}

function renderBody(){
  const tabs = $('#bodyTabs'); tabs.innerHTML='';
  ['전체',...bodyCategories.map(x=>x.name)].forEach(name=>{
    const b=document.createElement('button'); b.className=`chip ${currentBody===name?'active':''}`; b.textContent=name;
    b.onclick=()=>{currentBody=name;currentSubBody='전체';renderBody()}; tabs.appendChild(b);
  });
  const sub = $('#subBodyTabs'); sub.innerHTML='';
  const options = currentBody==='전체' ? ['전체'] : bodyCategories.find(x=>x.name===currentBody).subs;
  options.forEach(name=>{
    const b=document.createElement('button'); b.className=`chip ${currentSubBody===name?'active':''}`; b.textContent=name;
    b.onclick=()=>{currentSubBody=name;renderBody()}; sub.appendChild(b);
  });
  const list=videos.filter(v=>(currentBody==='전체'||v.bodyPart===currentBody)&&(currentSubBody==='전체'||v.subBodyPart===currentSubBody));
  $('#bodyResultTitle').textContent=currentBody==='전체'?'전체 운동':`${currentBody}${currentSubBody==='전체'?'':` · ${currentSubBody}`}`;
  $('#bodyCount').textContent=`${list.length}개`;
  renderList($('#bodyVideoList'),list);
}

function renderMovement(){
  const tabs=$('#movementTabs');tabs.innerHTML='';
  ['전체',...movementCategories.map(x=>x.name)].forEach(name=>{
    const b=document.createElement('button');b.className=`chip ${currentMovement===name?'active':''}`;b.textContent=name;
    b.onclick=()=>{currentMovement=name;currentMovementDetail='전체';renderMovement()};tabs.appendChild(b);
  });
  const details=$('#movementDetailTabs');details.innerHTML='';
  const options=currentMovement==='전체'?['전체']:movementCategories.find(x=>x.name===currentMovement).details;
  options.forEach(name=>{
    const b=document.createElement('button');b.className=`chip ${currentMovementDetail===name?'active':''}`;b.textContent=name;
    b.onclick=()=>{currentMovementDetail=name;renderMovement()};details.appendChild(b);
  });
  const list=videos.filter(v=>(currentMovement==='전체'||v.movementPattern===currentMovement)&&(currentMovementDetail==='전체'||v.movementDetail===currentMovementDetail));
  $('#movementResultTitle').textContent=currentMovement==='전체'?'전체 동작':`${currentMovement}${currentMovementDetail==='전체'?'':` · ${currentMovementDetail}`}`;
  $('#movementCount').textContent=`${list.length}개`;
  renderList($('#movementVideoList'),list);
}

function openDetail(video){
  currentVideo=video;
  recent=[video.id,...recent.filter(id=>id!==video.id)].slice(0,20);saveLocal();
  $('#detailHeader').textContent=video.exerciseName;
  $('#detailTitle').textContent=video.title;
  $('#detailDescription').textContent=video.description;
  const tags=[video.bodyPart,video.subBodyPart,video.movementPattern,video.movementDetail,video.equipment,video.difficulty];
  $('#detailTags').innerHTML=tags.map((t,i)=>`<span class="tag ${i===0?'brand':''}">${t}</span>`).join('');
  const wrap=$('#playerWrap');
  if(video.youtubeId){
    wrap.innerHTML=`<iframe src="https://www.youtube.com/embed/${video.youtubeId}" title="${video.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    $('#youtubeLink').href=`https://youtube.com/shorts/${video.youtubeId}`;
    $('#youtubeLink').style.display='block';
  }else{
    wrap.innerHTML=`<div class="placeholder-player"><div class="play-circle">＋</div><p>실제 DEMIC 영상 등록 예정</p></div>`;
    $('#youtubeLink').removeAttribute('href');
    $('#youtubeLink').style.display='none';
  }
  updateDetailFavorite(); go('detailView');
}
function updateDetailFavorite(){
  const b=$('#detailFavorite');
  b.textContent=currentVideo&&isFavorite(currentVideo.id)?'★':'☆';
  b.classList.toggle('active',currentVideo&&isFavorite(currentVideo.id));
}
function toggleFavorite(id){
  favorites=isFavorite(id)?favorites.filter(x=>x!==id):[id,...favorites];saveLocal();updateDetailFavorite();
}
function renderSaved(){
  const ids=savedMode==='favorites'?favorites:recent;
  renderList($('#savedList'),ids.map(id=>videos.find(v=>v.id===id)).filter(Boolean));
}
function refreshAll(){renderHome();renderBody();renderMovement();renderSaved()}

$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$('#detailBack').addEventListener('click',()=>go(previousView));
$('#detailFavorite').addEventListener('click',()=>{if(currentVideo){toggleFavorite(currentVideo.id);refreshAll()}});
$$('.saved-tab').forEach(b=>b.addEventListener('click',()=>{
  savedMode=b.dataset.saved;$$('.saved-tab').forEach(x=>x.classList.toggle('active',x===b));renderSaved();
}));
$('#homeSearch').addEventListener('input',(e)=>{
  const q=e.target.value.trim().toLowerCase();
  if(!q){renderHome();return}
  const list=videos.filter(v=>Object.values(v).join(' ').toLowerCase().includes(q));
  renderList($('#recentList'),list);
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault();deferredPrompt=e;$('#installBtn').hidden=false});
$('#installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').hidden=true});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js'))}

refreshAll();
