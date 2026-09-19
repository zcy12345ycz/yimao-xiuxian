/* ============ 工具 ============ */
const $=id=>document.getElementById(id);
const el={
  splash:$('splash'),create:$('create'),game:$('game'),
  nameInput:$('nameInput'),randomNameBtn:$('randomNameBtn'),
  createConfirm:$('createConfirm'),startBtn:$('startBtn'),importFromCreate:$('importFromCreate'),
  splashVersion:$('splashVersion'),splashStory:$('splashStory'),
  playerName:$('playerName'),
  realmName:$('realmName'),expBarFill:$('expBarFill'),expBarText:$('expBarText'),expRate:$('expRate'),
  breakthroughBtn:$('breakthroughBtn'),btMain:$('btMain'),btSub:$('btSub'),
  tutHint:$('tutHint'),
  rateDetailWrap:$('rateDetailWrap'),rateDetailToggle:$('rateDetailToggle'),
  rateDetailArrow:$('rateDetailArrow'),rateDetailBody:$('rateDetailBody'),
  tianjishiDisplay:$('tianjishiDisplay'),tianjishiCount:$('tianjishiCount'),
  rdBase:$('rdBase'),rdDaoyun:$('rdDaoyun'),rdDaoyunRow:$('rdDaoyunRow'),
  rdBase:$('rdBase'),rdDaoyun:$('rdDaoyun'),rdDaoyunRow:$('rdDaoyunRow'),
  rdXushi:$('rdXushi'),rdXushiRow:$('rdXushiRow'),
  rdXianyuan:$('rdXianyuan'),rdXianyuanRow:$('rdXianyuanRow'),
  rdLianpo:$('rdLianpo'),rdLianpoRow:$('rdLianpoRow'),
  rdTianxiang:$('rdTianxiang'),rdTianxiangRow:$('rdTianxiangRow'),
  rdTotal:$('rdTotal'),
  tianxiangBanner:$('tianxiangBanner'),
  particles:$('particles'),
  gufengFab:$('gufengFab'),
  dongfuFab:$('dongfuFab'),
  dongfuBar:$('dongfuBar'),
  dongfuBarIcon:$('dongfuBarIcon'),
  dongfuBarName:$('dongfuBarName'),
  dongfuBarEffect:$('dongfuBarEffect'),
  dongfuBarTime:$('dongfuBarTime'),
  dongfuBarProgress:$('dongfuBarProgress'),
  soundQuickBtn:$('soundQuickBtn'),
  soundQuickBtn:$('soundQuickBtn'),
  modal:$('modal'),modalCard:$('modalCard'),flash:$('flash'),toast:$('toast'),
  menuBtn:$('menuBtn'),menuPop:$('menuPop'),
  menuSave:$('menuSave'),menuSettings:$('menuSettings'),
  menuCloud:$('menuCloud'),
  menuInstall:$('menuInstall'),
  importFileInput:$('importFileInput'),
  helpQuickBtn:$('helpQuickBtn'),
  donateFab:$('donateFab')
};

function hexToRgba(h,a){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgba(${r},${g},${b},${a})`}
function fmtDur(sec){if(!isFinite(sec))return'—';if(sec<60)return Math.floor(sec)+'秒';if(sec<3600)return Math.floor(sec/60)+'分钟';if(sec<86400){const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60);return h+'小时'+m+'分'}const d=Math.floor(sec/86400),h=Math.floor((sec%86400)/3600);return d+'天'+h+'小时'}
function fmtTime(sec){const m=Math.floor(sec/60),ss=Math.floor(sec%60);return(m<10?'0':'')+m+':'+(ss<10?'0':'')+ss}
function fmtClock(ts){const d=new Date(ts);const h=d.getHours(),m=d.getMinutes();return(h<10?'0':'')+h+':'+(m<10?'0':'')+m}
function fmtDay(ts){const d=new Date(ts);return(d.getMonth()+1)+'月'+d.getDate()+'日'}
function fmtDateFull(ts){const d=new Date(ts);return d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日'}
function fmtRelative(ts){const d=Date.now()-ts;if(d<60000)return'刚刚';if(d<3600000)return Math.floor(d/60000)+' 分钟前';if(d<86400000)return Math.floor(d/3600000)+' 小时前';return Math.floor(d/86400000)+' 天前'}
function randRange(a,b){return a+Math.random()*(b-a)}
function utf8ToB64(str){const bytes=new TextEncoder().encode(str);let bin='';for(let i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);return btoa(bin)}
function b64ToUtf8(b64){const bin=atob(b64);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}
async function copyText(text){if(navigator.clipboard&&location.protocol==='https:'){try{await navigator.clipboard.writeText(text);return true}catch(e){}}try{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;top:0;left:0;opacity:0;pointer-events:none';document.body.appendChild(ta);ta.focus();ta.select();const ok=document.execCommand('copy');document.body.removeChild(ta);return ok}catch(e){return false}}

let _userHasInteracted=false;
document.addEventListener('touchstart',()=>{_userHasInteracted=true},{once:true,passive:true});
document.addEventListener('click',()=>{_userHasInteracted=true},{once:true,passive:true});
document.addEventListener('keydown',()=>{_userHasInteracted=true},{once:true,passive:true});
function vibrate(p){if(!s.vibrationEnabled)return;if(!_userHasInteracted)return;if(navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}

/* ============ 状态 ============ */
function createDefaultState(){
  return{
    saveVersion:CURRENT_SAVE_VERSION,
    masterName:'',
    created:false,createdAt:Date.now(),
    lastSave:Date.now(),lastTick:Date.now(),lastVisit:Date.now(),
    // 修炼
    realm:0,           // 大境界索引 0-9（对应 REALMS）
    layer:1,           // 层数 1-9
    exp:0,             // 当前修为
    // 突破加成
    daoyun:0,          // 失败道韵（+2%/次，上限 +20%）
    lianpo:0,          // 连续突破次数
    xianyuanDate:'',       // 每日仙缘的日期标记（YYYY-MM-DD 字符串）
    xianyuanNotified:'',   // 今日是否已弹过仙缘提示
    // 天机石
    tianjishi:0,           // 持有数量
    nextTianjishiAt:0,     // 下次掉落时间戳
    // 天象
    tianxiangMonth:'',     // 'YYYY-M'
    tianxiangDays:[],      // [5, 12, 23]
    // 设置
    numFormat:'short',audioEnabled:true,musicEnabled:true,
    vibrationEnabled:true,fontSize:'normal',dialect:'sc',
    powerSave:false,
    // 教程
    tutorialDone:false,
    firstBreakthroughDone:false,   // 是否完成过第一次突破
    // 历史
chronicle:[], gufengCount:0, gufengDate:'', gufengNextAt:Date.now(), toldTalkIds:[],
dongfuNextAt:0, dongfuChoice:'',
    dongfuEventSeen:[], dongfuEventChoices:{}, dongfuEventFirstAt:{}
  };
}

let s=createDefaultState();
let _saveTimer=null;
function FS_VALUE(){return s.fontSize==='small'?0.9:(s.fontSize==='large'?1.15:1)}

/* ============ 音效（精简） ============ */
const AudioSys={ctx:null,enabled:true,
  init(){if(this.ctx)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){this.enabled=false}},
  resume(){if(!this.ctx)return;if(this.ctx.state==='suspended'){try{this.ctx.resume()}catch(e){}}},
  tone(f,d,t,v,dl){if(!this.ctx||!this.enabled)return;if(this.ctx.state!=='running')return;t=t||'sine';v=v||0.06;dl=dl||0;
    try{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=t;o.frequency.value=f;const t0=this.ctx.currentTime+dl;g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(0.001,t0+d);o.connect(g);g.connect(this.ctx.destination);o.start(t0);o.stop(t0+d)}catch(e){}},
  click(){this.tone(800,0.05,'sine',0.04)},
  success(){this.tone(523,0.13);this.tone(659,0.13,'sine',0.06,0.08);this.tone(784,0.25,'sine',0.06,0.17)},
  fail(){this.tone(300,0.28,'sawtooth',0.06);this.tone(200,0.32,'sawtooth',0.05,0.11)},
  coin(){this.tone(1200,0.06,'square',0.03);this.tone(1600,0.08,'square',0.02,0.04)},
  tip(){this.tone(880,0.1,'sine',0.05);this.tone(1047,0.15,'sine',0.05,0.09)}
};

/* ============ 背景音乐 ============ */
let currentBgmIndex=-1;
function playRandomBgm(){const bgm=document.getElementById('bgm');if(!bgm||!s.musicEnabled||!_userHasInteracted)return;let nextIndex;do{nextIndex=Math.floor(Math.random()*BGM_TRACKS.length)}while(BGM_TRACKS.length>1&&nextIndex===currentBgmIndex);currentBgmIndex=nextIndex;bgm.src=BGM_TRACKS[currentBgmIndex];bgm.load();bgm.volume=0.2;bgm.play().catch(e=>{})}
function updateBgm(){const bgm=document.getElementById('bgm');if(!bgm)return;if(s.musicEnabled&&_userHasInteracted){if(bgm.paused)playRandomBgm()}else{if(!bgm.paused)bgm.pause()}}

/* ============ 存档 ============ */
function serializeState(){
  return{
    saveVersion:CURRENT_SAVE_VERSION,
    masterName:s.masterName,
    created:s.created,createdAt:s.createdAt,
    lastSave:s.lastSave,lastTick:s.lastTick,lastVisit:s.lastVisit,
    // 修炼
    realm:s.realm,layer:s.layer,exp:s.exp,
    daoyun:s.daoyun,lianpo:s.lianpo,xianyuanDate:s.xianyuanDate,xianyuanNotified:s.xianyuanNotified,
    tianjishi:s.tianjishi,nextTianjishiAt:s.nextTianjishiAt,
    tianxiangMonth:s.tianxiangMonth,tianxiangDays:s.tianxiangDays,
    // 设置
    numFormat:s.numFormat,audioEnabled:AudioSys.enabled,musicEnabled:s.musicEnabled,
    vibrationEnabled:s.vibrationEnabled,fontSize:s.fontSize,dialect:s.dialect,
    powerSave:s.powerSave,
    tutorialDone:s.tutorialDone,
    firstBreakthroughDone:s.firstBreakthroughDone,
chronicle:s.chronicle, gufengCount:s.gufengCount, gufengDate:s.gufengDate, gufengNextAt:s.gufengNextAt, toldTalkIds:s.toldTalkIds,
dongfuNextAt:s.dongfuNextAt, dongfuChoice:s.dongfuChoice,
    dongfuEventSeen:s.dongfuEventSeen, dongfuEventChoices:s.dongfuEventChoices,
    dongfuEventFirstAt:s.dongfuEventFirstAt,
  };
}

function exportSaveCode(){return utf8ToB64(JSON.stringify({v:EXPORT_VERSION,gv:GAME_VERSION,ts:Date.now(),save:serializeState()}))}
function downloadSaveFile(){
  const code=exportSaveCode();
  const header='# 一毛修仙 · 存档文件\n# 版本 '+GAME_VERSION+'\n\n';
  const blob=new Blob([header+code],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'),d=new Date();
  const ds=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  a.href=url;a.download='yimao-save-'+ds+'.txt';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
function parseSaveCode(raw){
  try{
    let code=String(raw||'');
    code=code.split('\n').filter(line=>!line.trim().startsWith('#')).join('');
    code=code.replace(/\s/g,'');
    if(!code)return{ok:false,msg:'存档码为空'};
    const data=JSON.parse(b64ToUtf8(code));
    if(!data||!data.v||!data.save)return{ok:false,msg:'存档码格式不正确'};
    if(data.v>EXPORT_VERSION)return{ok:false,msg:'存档来自更新版本'};
    return{ok:true,data:data.save,gv:data.gv};
  }catch(e){return{ok:false,msg:'存档码无效'}}
}
function applySaveData(data){
  try{
    if(!data)return;
    s.masterName=data.masterName||'无名掌门';
    s.created=!!data.created;
    s.createdAt=data.createdAt||Date.now();
    s.lastSave=data.lastSave||Date.now();
    s.lastTick=data.lastTick||Date.now();
    s.lastVisit=data.lastVisit||Date.now();
    // 修炼
    s.realm=typeof data.realm==='number'?data.realm:0;
    s.layer=typeof data.layer==='number'?data.layer:1;
    s.exp=typeof data.exp==='number'?data.exp:0;
    s.daoyun=typeof data.daoyun==='number'?data.daoyun:0;
    s.lianpo=typeof data.lianpo==='number'?data.lianpo:0;
    s.xianyuanDate=data.xianyuanDate||'';    s.xianyuanNotified=data.xianyuanNotified||'';
    s.tianjishi=typeof data.tianjishi==='number'?data.tianjishi:0;
    s.nextTianjishiAt=typeof data.nextTianjishiAt==='number'?data.nextTianjishiAt:0;
    s.tianxiangMonth=data.tianxiangMonth||'';
    s.tianxiangDays=Array.isArray(data.tianxiangDays)?data.tianxiangDays:[];
    // 设置
    s.numFormat=data.numFormat||'short';
    if(typeof data.audioEnabled==='boolean')AudioSys.enabled=data.audioEnabled;
    if(typeof data.musicEnabled==='boolean')s.musicEnabled=data.musicEnabled;
    s.vibrationEnabled=data.vibrationEnabled!==false;
    s.fontSize=data.fontSize||'normal';
    s.dialect=data.dialect||'sc';
    s.powerSave=!!data.powerSave;
    s.tutorialDone=!!data.tutorialDone;
    s.firstBreakthroughDone=!!data.firstBreakthroughDone;
    s.chronicle=Array.isArray(data.chronicle)?data.chronicle:[]; s.gufengCount=typeof data.gufengCount==='number'?data.gufengCount:0; s.gufengDate=data.gufengDate||''; s.gufengNextAt=typeof data.gufengNextAt==='number'?data.gufengNextAt:Date.now();s.toldTalkIds=Array.isArray(data.toldTalkIds)?data.toldTalkIds:[];
s.dongfuNextAt=typeof data.dongfuNextAt==='number'?data.dongfuNextAt:0;
s.dongfuChoice=data.dongfuChoice||'';
s.dongfuEventSeen=Array.isArray(data.dongfuEventSeen)?data.dongfuEventSeen:[];
s.dongfuEventChoices=(data.dongfuEventChoices&&typeof data.dongfuEventChoices==='object')?data.dongfuEventChoices:{};
s.dongfuEventFirstAt=(data.dongfuEventFirstAt&&typeof data.dongfuEventFirstAt==='object')?data.dongfuEventFirstAt:{};
    applyFontSize();renderSplashStory();save();
  }catch(e){console.error('存档导入失败',e)}
}

function doImport(rawCode){
  const parsed=parseSaveCode(rawCode);
  if(!parsed.ok){toast(parsed.msg,2800);return false}
  if(!confirm('导入后将覆盖当前进度，确定继续吗？'))return false;
  applySaveData(parsed.data);AudioSys.success();flash('gold');
  toast('存档导入成功',2600);hideModal();
  if(s.created){el.splash.style.display='none';el.create.style.display='none';el.game.classList.add('show')}
  renderUI();spawnParticles();return true;
}
function save(){s.lastSave=Date.now();if(_saveTimer)clearTimeout(_saveTimer);_saveTimer=setTimeout(()=>executeSave(),800)}
function executeSave(){try{const d=JSON.stringify(serializeState());localStorage.setItem(SAVE_KEY+'_backup',d);localStorage.setItem(SAVE_KEY,d)}catch(e){}finally{_saveTimer=null}
  tryAutoCloudUpload();
}
function flushSave(){if(_saveTimer){clearTimeout(_saveTimer);_saveTimer=null}executeSave()}
function load(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw){const bk=localStorage.getItem(SAVE_KEY+'_backup');if(!bk)return false;applySaveData(JSON.parse(bk));return true}
    applySaveData(JSON.parse(raw));return true;
  }catch(e){try{const bk=localStorage.getItem(SAVE_KEY+'_backup');if(!bk)return false;applySaveData(JSON.parse(bk));toast('主存档损坏，已从备份恢复');return true}catch(e2){return false}}
}