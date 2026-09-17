/* ============ 大数 ============ */
class Dec{
  constructor(m=0,e=0){this.m=m;this.e=e;this._n()}
  _n(){if(this.m===0||!isFinite(this.m)){this.m=0;this.e=0;return}while(Math.abs(this.m)>=10){this.m/=10;this.e++}while(Math.abs(this.m)<1){this.m*=10;this.e--}}
  clone(){return new Dec(this.m,this.e)}
  static of(x){if(x instanceof Dec)return x;if(!isFinite(x)||x===0)return new Dec(0,0);const e=Math.floor(Math.log10(Math.abs(x)));return new Dec(x/Math.pow(10,e),e)}
  add(o){if(!(o instanceof Dec))o=Dec.of(o);if(this.m===0)return o.clone();if(o.m===0)return this.clone();const big=this.e>=o.e?this:o,small=this.e>=o.e?o:this,d=big.e-small.e;if(d>17)return big.clone();return new Dec(big.m+small.m*Math.pow(10,-d),big.e)}
  sub(o){if(!(o instanceof Dec))o=Dec.of(o);return this.add(new Dec(-o.m,o.e))}
  mul(o){if(!(o instanceof Dec))o=Dec.of(o);return new Dec(this.m*o.m,this.e+o.e)}
  div(o){if(!(o instanceof Dec))o=Dec.of(o);if(o.m===0)return new Dec(0,0);return new Dec(this.m/o.m,this.e-o.e)}
  cmp(o){if(!(o instanceof Dec))o=Dec.of(o);if(this.m===0&&o.m===0)return 0;if(this.m===0)return o.m>0?-1:1;if(o.m===0)return this.m>0?1:-1;const sa=this.m>0?1:-1,sb=o.m>0?1:-1;if(sa!==sb)return sa>sb?1:-1;if(this.e!==o.e)return(this.e>o.e?1:-1)*sa;return this.m>o.m?1:this.m<o.m?-1:0}
  gt(o){return this.cmp(o)>0}gte(o){return this.cmp(o)>=0}lt(o){return this.cmp(o)<0}lte(o){return this.cmp(o)<=0}
  toNum(){if(this.e>308)return Infinity;if(this.e<-308)return 0;return this.m*Math.pow(10,this.e)}
  log10(){return Math.log10(Math.abs(this.m))+this.e}
  pow(p){const lg=this.log10()*p;const e=Math.floor(lg);return new Dec(Math.pow(10,lg-e),e)}
  format(){if(DEC_LONG_FORMAT){if(this.m===0)return'0';const e=this.e;if(e<21){const v=this.toNum();if(v<1e21)return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}return this.m.toFixed(2)+'e'+this.e}
    if(this.m===0)return'0';
    const e=this.e;
    if(e<3){const v=this.toNum();if(v===0)return'0';if(v<10)return v.toFixed(2);if(v<100)return v.toFixed(1);return Math.floor(v).toString()}
    const u=['','万','亿','兆','京','垓','秭','穰','沟','涧'];
    const g=Math.floor(e/4);
    if(g<u.length){return(this.m*Math.pow(10,e-g*4)).toFixed(2)+u[g]}
    return this.m.toFixed(2)+'e'+this.e;
  }
}
function fmtCoinVal(dec){
  try{
    if(!(dec instanceof Dec))dec=Dec.of(dec);
    if(DEC_LONG_FORMAT)return dec.format();
    const n=dec.toNum();
    if(!isFinite(n)||isNaN(n))return '∞';
    if(n<=0)return'0';
    if(n<1000){if(n<10)return n.toFixed(2);if(n<100)return n.toFixed(1);return Math.floor(n).toString()}
    if(n<10000)return(n/1000).toFixed(2)+' 千';
    if(n<100000)return(n/10000).toFixed(2)+' 万';
    if(n<1000000)return(n/100000).toFixed(2)+' 十万';
    if(n<10000000)return(n/1000000).toFixed(2)+' 百万';
    if(n<100000000)return(n/10000000).toFixed(2)+' 千万';
    if(n<1000000000)return(n/100000000).toFixed(2)+' 亿';
    if(n<10000000000)return(n/1000000000).toFixed(2)+' 十亿';
    if(n<100000000000)return(n/10000000000).toFixed(2)+' 百亿';
    if(n<1000000000000)return(n/100000000000).toFixed(2)+' 千亿';
    return(n/1000000000000).toFixed(2)+' 万亿';
  }catch(e){
    return '0';
  }
}
function fmtCoin(dec){return fmtCoinVal(dec)}
function fmtExp(d){return d.format()}

/* ============ 工具 ============ */
const $=id=>document.getElementById(id);
const el={
  splash:$('splash'),create:$('create'),game:$('game'),
  nameInput:$('nameInput'),randomNameBtn:$('randomNameBtn'),
  createConfirm:$('createConfirm'),startBtn:$('startBtn'),importFromCreate:$('importFromCreate'),
  splashVersion:$('splashVersion'),splashStory:$('splashStory'),
  playerName:$('playerName'),masterTitle:$('masterTitle'),sectName:$('sectName'),discipleCount:$('discipleCount'),eraNum:$('eraNum'),playDays:$('playDays'),
  topDiscipleName:$('topDiscipleName'),topDiscipleRealm:$('topDiscipleRealm'),topDiscipleRoot:$('topDiscipleRoot'),
  topDiscipleChosen:$('topDiscipleChosen'),topDiscipleInjured:$('topDiscipleInjured'),topDiscipleAging:$('topDiscipleAging'),topDiscipleAway:$('topDiscipleAway'),
  dotsRow:$('dotsRow'),dotsBox:$('dotsBox'),dotsCount:$('dotsCount'),
  lastBreakRow:$('lastBreakRow'),lastBreakName:$('lastBreakName'),lastBreakRealm:$('lastBreakRealm'),lastBreakTime:$('lastBreakTime'),
  itemStatusRow:$('itemStatusRow'),isrBreakPill:$('isrBreakPill'),isrTalentPill:$('isrTalentPill'),
  charSvg:$('charSvg'),charArea:$('charArea'),particles:$('particles'),charBubble:$('charBubble'),
  sectExpFill:$('sectExpFill'),sectExpText:$('sectExpText'),barSubLeft:$('barSubLeft'),barSubRight:$('barSubRight'),
  stoneText:$('stoneText'),nextReportEl:$('nextReportEl'),rtFill:$('rtFill'),rtText:$('rtText'),
  goalFill:$('goalFill'),goalText:$('goalText'),
  btnReport:$('btnReport'),btnRecruit:$('btnRecruit'),btnLijian:$('btnLijian'),memoBadge:$('memoBadge'),
  modal:$('modal'),modalCard:$('modalCard'),flash:$('flash'),toast:$('toast'),tipBanner:$('tipBanner'),
  tutMask:$('tutMask'),tutTip:$('tutTip'),
  menuBtn:$('menuBtn'),menuBtnDot:$('menuBtnDot'),menuPop:$('menuPop'),
  signInQuickBtn:$('signInQuickBtn'),signInQuickDot:$('signInQuickDot'),
  soundQuickBtn:$('soundQuickBtn'),donateQuickBtn:$('donateQuickBtn'),helpQuickBtn:$('helpQuickBtn'),
  menuSave:$('menuSave'),menuSettings:$('menuSettings'),
  menuHelp:$('menuHelp'),menuDonate:$('menuDonate'),
  importFileInput:$('importFileInput'),
  phaseGoal:$('phaseGoal'),phaseGoalText:$('phaseGoalText'),phaseGoalProgress:$('phaseGoalProgress'),phaseGoalTime:$('phaseGoalTime'),
  breakthrough:$('breakthrough'),bkCard:$('bkCard'),bkRays:$('bkRays'),
  breakFloat:$('breakFloat'),achUnlock:$('achUnlock'),achUnlockCard:$('achUnlockCard'),
  tianxiaBox:$('tianxiaBox'),tianxiangBanner:$('tianxiangBanner'),
  tianxiangRow:$('tianxiangRow'),
  dailyBuffRow:$('dailyBuffRow'),dailyBuffTime:$('dailyBuffTime'),
  expeditionRow:$('expeditionRow'),expName:$('expName'),expDesc:$('expDesc'),expTime:$('expTime'),
    worldBuffRow:$('worldBuffRow'),worldBuffIcon:$('worldBuffIcon'),worldBuffName:$('worldBuffName'),worldBuffDesc:$('worldBuffDesc'),worldBuffTime:$('worldBuffTime'),
  moonOrderRow:$('moonOrderRow'),moonOrderIcon:$('moonOrderIcon'),moonOrderName:$('moonOrderName'),moonOrderDesc:$('moonOrderDesc'),
  taskProgressRow:$('taskProgressRow'),taskTodayText:$('taskTodayText'),taskWeekText:$('taskWeekText'),
  menuMoonOrder:$('menuMoonOrder'),
  ending:$('ending'),endingCard:$('endingCard'),
  donateFab:$('donateFab'),
  firstRecruit:$('firstRecruit'),frSkip:$('frSkip')
};
function hexToRgba(h,a){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgba(${r},${g},${b},${a})`}
function fmtDur(sec){if(!isFinite(sec))return'—';if(sec<60)return Math.floor(sec)+'秒';if(sec<3600)return Math.floor(sec/60)+'分钟';if(sec<86400){const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60);return h+'小时'+m+'分'}const d=Math.floor(sec/86400),h=Math.floor((sec%86400)/3600);return d+'天'+h+'小时'}
function fmtTime(sec){const m=Math.floor(sec/60),ss=Math.floor(sec%60);return(m<10?'0':'')+m+':'+(ss<10?'0':'')+ss}
function fmtClock(ts){const d=new Date(ts);const h=d.getHours(),m=d.getMinutes();return(h<10?'0':'')+h+':'+(m<10?'0':'')+m}
function fmtDay(ts){const d=new Date(ts);return(d.getMonth()+1)+'月'+d.getDate()+'日'}
function fmtDateFull(ts){const d=new Date(ts);return d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日'}
function fmtRelative(ts){const d=Date.now()-ts;if(d<60000)return'刚刚';if(d<3600000)return Math.floor(d/60000)+' 分钟前';if(d<86400000)return Math.floor(d/3600000)+' 小时前';return Math.floor(d/86400000)+' 天前'}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function randRange(a,b){return a+Math.random()*(b-a)}
function weightedPick(arr,key){key=key||'w';let total=0;for(const a of arr)total+=a[key];let r=Math.random()*total;for(const a of arr){r-=a[key];if(r<=0)return a}return arr[0]}
function shuffle(a){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function utf8ToB64(str){const bytes=new TextEncoder().encode(str);let bin='';for(let i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);return btoa(bin)}
function b64ToUtf8(b64){const bin=atob(b64);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}
async function copyText(text){if(navigator.clipboard&&location.protocol==='https:'){try{await navigator.clipboard.writeText(text);return true}catch(e){}}try{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;top:0;left:0;opacity:0;pointer-events:none';document.body.appendChild(ta);ta.focus();ta.select();const ok=document.execCommand('copy');document.body.removeChild(ta);return ok}catch(e){return false}}
function makeName(){const s1=SURNAMES[Math.floor(Math.random()*SURNAMES.length)];const g=GIVEN_NAMES[Math.floor(Math.random()*GIVEN_NAMES.length)];if(Math.random()<0.5)return s1+g;return s1+g+GIVEN_NAMES[Math.floor(Math.random()*GIVEN_NAMES.length)]}
function uniqueName(){let n=makeName(),tries=0;while(s.discipleList.some(d=>d.name===n)&&tries++<30)n=makeName();return n}
let _userHasInteracted=false;
document.addEventListener('touchstart',()=>{_userHasInteracted=true},{once:true,passive:true});
document.addEventListener('click',()=>{_userHasInteracted=true},{once:true,passive:true});
document.addEventListener('keydown',()=>{_userHasInteracted=true},{once:true,passive:true});
function vibrate(p){
  if(!s.vibrationEnabled)return;
  if(!_userHasInteracted)return;
  if(navigator.vibrate)try{navigator.vibrate(p)}catch(e){}
}
function isInjured(d){return d.injuryUntil&&Date.now()<d.injuryUntil}
function injuryRemain(d){if(!isInjured(d))return 0;return Math.ceil((d.injuryUntil-Date.now())/1000)}
function loyaltyHearts(v){v=v||0;const n=Math.round(v/20);return'❤️'.repeat(Math.max(1,n))+'🖤'.repeat(Math.max(0,5-n))}
function lifespan(d){const sp=getSpecialty(d);return 80+d.level*5+(sp.lifespanBonus||0)}
function agingWarn(d){const life=lifespan(d);const remain=life-d.age;return remain<=10&&remain>0}
function lifeRemain(d){return Math.max(0,lifespan(d)-d.age)}
function isOnExpedition(d){
  if(!s.expeditions||!Array.isArray(s.expeditions))return false;
  return s.expeditions.some(e=>e.discipleId===d.id&&!e.done);
}
function getExpeditionFor(d){
  if(!s.expeditions||!Array.isArray(s.expeditions))return null;
  return s.expeditions.find(e=>e.discipleId===d.id&&!e.done)||null;
}
function isInMijing(d){
  return currentMijing&&currentMijing.discipleId===d.id;
}

/* ============ 状态 ============ */
function createDefaultState(){
  return{
    saveVersion:CURRENT_SAVE_VERSION,
    masterName:'',sectName:'一毛宗',masterTitle:'',discipleList:[],
    stones:new Dec(100,0),cave:0,eras:0,
    totalReports:0,reportsSinceEvent:0,memos:[],
    lastSave:Date.now(),lastReport:Date.now(),lastTick:Date.now(),
    tutorialDone:false,created:false,
    buildings:{scripture:0,alchemy:0,arena:0,array:0},
    achievements:{},chronicle:[],
    flags:{handledEvent:false,eventGreat:false,eventAwful:false,survivedTianjie:false,lostDisciple:false,mijingPerfect:false,mijingInjured:false,firstDeath:false,endingReached:false,endingShown:false,tianxiangSpirit:false,tianxiangGrand:false,firstRecruitCinematic:false,firstRecruitRerolled:false,firstRecruitDone:false},
    ritesSeen:{},loginDays:1,lastLoginDay:todayStr(),
    daily:{date:todayStr(),tasks:[]},
    stats:{dailyDone:0,chatterSeen:0,todayMemosRead:0,todayBreaks:0,todayEvents:0,todayEventGood:0,todayRecruits:0,todayMijing:0,mijingDone:0,todaySignIn:0,expeditionsDone:0,weeklyFullCount:0,worldEventsSeen:0},
    allExpMul:0,lastSnapshot:null,
    firstEraTime:0,createdAt:Date.now(),
    unreadLog:{exp:new Dec(0,0),stone:new Dec(0,0),breaks:[],fails:[]},
    autoBank:{exp:new Dec(0,0),stone:new Dec(0,0),breaks:[],count:0},
    recentEvents:[],
    numFormat:'short',audioEnabled:true,musicEnabled:true,masterEnergy:5,lastEnergyRecover:Date.now(),dailyPendingRewards:{exp:new Dec(0,0),stone:new Dec(0,0)},vibrationEnabled:true,fontSize:'normal',dialect:'sc',
    viceEnabled:false,lastBreak:null,tipsSeen:{},openingTutorialDone:false,stoneFlashFlag:false,
    mijingCooldowns:{low:0,mid:0,high:0,top:0},clickEggCount:0,
    nextTalent:false,relics:[],lastCheckAge:0,
    tianxiangId:'normal',tianxiangUntil:0,lastTianxiangWarn:0,
    lastTianxia:0,
    ancestralDisciple:null,
    endingDismissed:[],
    estCache:{},
    lastLoyaltyTick:0,
    showTianxia:true,
    moonOrder:'cultivate',
    moonOrderChangedAt:0,
    lastRecruitAt:0,
    signIn:{lastDate:'',cycleDay:0,totalDays:0,dailyQuiz:{date:'',questions:[],answers:[],answeredAt:0,rewardGranted:false}},
    quizStats:{total:0,correct:0,days:0,streak:0,bestStreak:0,history:[]},
    dailyBuff:{until:0},
    milestones:{},
    eventChain:{},
    lastOfflineFlavor:'',
    expeditions:[],
    weekly:{weekId:0,tasks:[],allDoneRewarded:false},
    weekStats:{breaks:0,mijing:0,events:0,recruits:0,signIns:0,expeditions:0,tianxiang:0},
    legacyTree:{scripture2:0,event:0,loyalty:0,offline:0,mijing:0,break:0},
    yearbooks:[],
    currentYear:{startAt:Date.now(),stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]},
    worldEvents:[],
    lastYearCheck:0,
    lastDefectCheck:0,
    eventChainDepth:{}
  };
}
let s=createDefaultState();
let _saveTimer = null;
function FS_VALUE(){return s.fontSize==='small'?0.9:(s.fontSize==='large'?1.15:1)}

/* ============ 派生 ============ */
function eraMul(){return Math.pow(ERA_BONUS,s.eras)}
function caveExpMul(){return 1+s.cave*0.20}
function caveStoneMul(){return 1+s.cave*0.12}
function legacyTreeLv(id){return (s.legacyTree&&s.legacyTree[id])||0}
function scriptureMul(){return 1+s.buildings.scripture*0.10+legacyTreeLv('scripture2')*0.05}
function arenaBonus(){return s.buildings.arena*0.015}
function alchemyBonus(){return s.buildings.alchemy*0.02}
function arrayReduction(){return 1-Math.min(0.5,s.buildings.array*0.05)}
function legacyEventBonus(){return legacyTreeLv('event')*0.03}
function legacyBreakBonus(){return legacyTreeLv('break')*0.01}
function legacyLoyaltyBonus(){return legacyTreeLv('loyalty')*5}
function legacyOfflineMul(){return 1+legacyTreeLv('offline')*0.10}
function legacyMijingCdMul(){return 1-Math.min(0.5,legacyTreeLv('mijing')*0.10)}
function expNeed(lv){return Dec.of(1.10).pow(lv).mul(200)}
function getRoot(d){return ROOTS.find(r=>r.id===d.root)||ROOTS[5]}
function getP(d){return PERSONALITIES.find(x=>x.id===d.personality)||PERSONALITIES[0]}
function getSpecialty(d){return SPECIALTIES.find(x=>x.id===d.specialty)||SPECIALTIES[0]}
function getApt(d){return APTITUDES.find(x=>x.id===d.aptitude)||APTITUDES[1]}
function loyaltyMul(d){return loyaltyExpMul(d)}
function boneMul(d){return 0.7+(d.rootBone||50)/100*0.6}
function luckStoneMul(d){return 0.7+(d.luck||50)/100*0.6}
function comprehensionBonus(d){return((d.comprehension||50)-50)/100*0.15}
function relationExpMul(d){let m=1;if(!d.relationships)return m;for(const r of d.relationships){const rt=relType(r.type);if(rt.expBonus)m+=rt.expBonus}return m}
function relationBreakBonus(d){let b=0;if(!d.relationships)return b;for(const r of d.relationships){const rt=relType(r.type);if(rt.breakMalus)b+=rt.breakMalus}return b}
function relicExpMul(){let m=1;if(!s.relics)return m;for(const r of s.relics){if(r.type==='exp')m+=r.value}return m}
function relicStoneMul(){let m=1;if(!s.relics)return m;for(const r of s.relics){if(r.type==='stone')m+=r.value}return m}
function relicBreakBonus(){let b=0;if(!s.relics)return b;for(const r of s.relics){if(r.type==='break')b+=r.value}return b}
function tianxiangExpMul(){return getTianxiang().expMul}
function tianxiangStoneMul(){return getTianxiang().stoneMul}
function tianxiangBreakBonus(){return getTianxiang().breakBonus}
function dailyBuffActive(){return s.dailyBuff&&s.dailyBuff.until>Date.now()}
function dailyBuffMul(){return dailyBuffActive()?2:1}
function worldBuffMul(type){
  if(!s.worldEvents)return 1;
  const now=Date.now();
  for(const e of s.worldEvents){
    if(e.type===type&&!e.done&&e.startAt<=now&&now<e.buffEnd)return e.buffMul||1;
  }
  return 1;
}
function activeWorldBuffs(){
  if(!s.worldEvents)return[];
  const now=Date.now();
  return s.worldEvents.filter(e=>!e.done&&e.buff&&e.startAt<=now&&now<e.buffEnd);
}
/* ============ 弟子状态工具 ============ */
function getActiveStates(d){
  if(!d||!Array.isArray(d.states))return [];
  const now=Date.now();
  return d.states.filter(st=>st&&st.id&&st.until>now);
}
function addState(d,typeId,durationMs){
  if(!d)return;
  const t=STATE_TYPES[typeId];
  if(!t)return;
  if(!Array.isArray(d.states))d.states=[];
  const dur=durationMs||t.duration;
  const until=Date.now()+dur;
  const existing=d.states.find(x=>x&&x.id===typeId);
  if(existing){ if(until>existing.until)existing.until=until; }
  else{ d.states.push({id:typeId,until,startedAt:Date.now()}); }
}
function stateExpMul(d){
  let m=1;
  for(const st of getActiveStates(d)){
    const t=STATE_TYPES[st.id];
    if(t&&t.expMul)m*=t.expMul;
  }
  return m;
}
function stateBreakAdd(d){
  let a=0;
  for(const st of getActiveStates(d)){
    const t=STATE_TYPES[st.id];
    if(t&&t.breakAdd)a+=t.breakAdd;
  }
  return a;
}
function stateBreakMul(d){
  let m=1;
  for(const st of getActiveStates(d)){
    const t=STATE_TYPES[st.id];
    if(t&&t.breakMul)m*=t.breakMul;
  }
  return m;
}

/* 修为产出底数 1.06 → 1.04 */
function discipleExpRate(d){
  const p=getP(d),apt=getApt(d),root=getRoot(d);
  let base=Dec.of(CONFIG.expBase).mul(Dec.of(CONFIG.expLevelGrowth).pow(d.level)).mul(Dec.of(CONFIG.expRealmJump).pow(Math.floor(d.level/CONFIG.expRealmJumpInterval)));
  base=base.mul(apt.mul).mul(p.expMul).mul(caveExpMul()).mul(eraMul()).mul(scriptureMul());
  if(root.expMul)base=base.mul(root.expMul);
  if(s.allExpMul)base=base.mul(1+s.allExpMul);
  if(d.chosen)base=base.mul(CONFIG.chosenExpMul);
  if(isInjured(d))base=base.mul(0.5);
  base=base.mul(loyaltyMul(d)).mul(boneMul(d)).mul(relationExpMul(d)).mul(relicExpMul()).mul(tianxiangExpMul()).mul(dailyBuffMul());
      base=base.mul(worldBuffMul('sermon'));
  base=base.mul(moonExpMul());
  {const sp=getSpecialty(d);if(sp.expMul)base=base.mul(sp.expMul);}
  base=base.mul(stateExpMul(d));
  return base;
}
function discipleStoneRate(d){
  const p=getP(d),root=getRoot(d);
  let base=Dec.of(CONFIG.stoneBase).mul(Dec.of(CONFIG.stoneLevelGrowth).pow(d.level)).mul(Dec.of(CONFIG.stoneRealmJump).pow(Math.floor(d.level/CONFIG.expRealmJumpInterval)));
  base=base.mul(p.stoneMul).mul(caveStoneMul()).mul(eraMul()).mul(luckStoneMul(d)).mul(relicStoneMul()).mul(tianxiangStoneMul());
  if(root.stoneMul)base=base.mul(root.stoneMul);
    if(d.chosen)base=base.mul(CONFIG.chosenStoneMul);
    if(isInjured(d))base=base.mul(0.7);
  base=base.mul(moonStoneMul());
  {const sp=getSpecialty(d);if(sp.stoneMul)base=base.mul(sp.stoneMul);}
  return base;
}
function discipleBreakRate(d){
  const p=getP(d),root=getRoot(d);
  let base=(d.level%9===8)?CONFIG.breakBaseBig:CONFIG.breakBaseSmall;
  base+=arenaBonus();base+=comprehensionBonus(d);
  if(root.breakBonus)base+=root.breakBonus;
  if(d.chosen)base+=CONFIG.breakChosenBonus;
  if(p.riskBonus>0)base+=p.riskBonus;
  if((d.failStreak||0)>=1)base+=Math.min(CONFIG.breakFailStreakMax,CONFIG.breakFailStreakBonus*(d.failStreak||0));
  base+=relationBreakBonus(d);base+=relicBreakBonus();base+=tianxiangBreakBonus();
  base+=legacyBreakBonus();
    if(d.forceBreak)base+=CONFIG.breakForceBreakBonus;
  {const sp=getSpecialty(d);if(sp.breakBonus)base+=sp.breakBonus;}
  base+=stateBreakAdd(d);
  base*=stateBreakMul(d);
  // 硬保底：大境界连续失败 8 次，突破率直接拉到 90%
  if((d.level%9===8)&&(d.failStreak||0)>=8)base=Math.max(base,0.90);
  return Math.max(CONFIG.breakMinRate,Math.min(CONFIG.breakMaxRate,base));
}
function expProgress(d){return d.exp.div(expNeed(d.level)).toNum()}
function caveCost(){return Dec.of(1.6).pow(s.cave).mul(100)}
function buildingCost(key){return Dec.of(1.8).pow(s.buildings[key]).mul(200)}
function realmOf(lv){const si=Math.floor(lv/9);const b=REALMS[si%REALMS.length];const era=Math.floor(si/REALMS.length);const sub=lv%9;const pre=era>0?'第'+(era+1)+'纪·':'';return{si,era,sub,name:pre+b.n+CN[sub]+'重',short:pre+b.n,c:b.c,d:b.d}}
function topDisciple(){if(s.discipleList.length===0)return null;return s.discipleList.reduce((a,b)=>b.level>a.level?b:a)}

function totalBreaksAll(){return s.discipleList.reduce((a,d)=>a+(d.totalBreaks||0),0)}
function maxDisciples(){
  const total=totalBreaksAll();
  let allowed=1;
  for(const t of DISCIPLE_THRESHOLDS){if(total>=t)allowed++;else break}
  allowed+=legacyTreeLv('discipleSlot');
  const cur=s.discipleList.length;
  return Math.max(allowed,cur>0?cur:1);
}
function nextDiscipleThreshold(){
  const total=totalBreaksAll();
  let baseAllowed=1;
  for(const t of DISCIPLE_THRESHOLDS){if(total>=t)baseAllowed++;else break}
  if(baseAllowed>=6)return null;
  const need=DISCIPLE_THRESHOLDS[baseAllowed-1];
  if(need===undefined)return null;
  return{need,have:total,remain:Math.max(0,need-total)};
}

function playDays(){return Math.max(1,Math.floor((Date.now()-(s.createdAt||Date.now()))/86400000)+1)}
function estimateTimeTo(d,targetLevel){
  if(!d||d.level>=targetLevel)return 0;
  const now=Date.now();
  if(!s.estCache)s.estCache={};
  const k=d.id+'_'+targetLevel+'_'+d.level;
  if(s.estCache[k]&&now-s.estCache[k].ts<15000)return s.estCache[k].val;
  let totalSec=0;
  for(let lv=d.level;lv<targetLevel;lv++){
    const need=expNeed(lv);const have=(lv===d.level)?d.exp:new Dec(0,0);
    const remain=need.sub(have);
    const rate=discipleExpRate({...d,level:lv,exp:new Dec(0,0)});
    const rn=rate.toNum();
    if(rn<=0)return Infinity;
    totalSec+=remain.toNum()/rn;
  }
  s.estCache[k]={val:totalSec,ts:now};
  return totalSec;
}

/* ============ 音效 ============ */
const AudioSys={ctx:null,enabled:true,
  init(){if(this.ctx)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){this.enabled=false}},
  resume(){if(!this.ctx)return;if(this.ctx.state==='suspended'){try{this.ctx.resume()}catch(e){}}},
  tone(f,d,t,v,dl){if(!this.ctx||!this.enabled)return;if(this.ctx.state!=='running')return;t=t||'sine';v=v||0.06;dl=dl||0;try{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=t;o.frequency.value=f;const t0=this.ctx.currentTime+dl;g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(0.001,t0+d);o.connect(g);g.connect(this.ctx.destination);o.start(t0);o.stop(t0+d)}catch(e){}},
  click(){this.tone(800,0.05,'sine',0.04)},
  success(){this.tone(523,0.13);this.tone(659,0.13,'sine',0.06,0.08);this.tone(784,0.25,'sine',0.06,0.17)},
  fail(){this.tone(300,0.28,'sawtooth',0.06);this.tone(200,0.32,'sawtooth',0.05,0.11)},
  report(){this.tone(660,0.14);this.tone(880,0.18,'sine',0.06,0.11)},
  recruit(){this.tone(587,0.15);this.tone(880,0.25,'sine',0.06,0.12)},
  coin(){this.tone(1200,0.06,'square',0.03);this.tone(1600,0.08,'square',0.02,0.04)},
  greet(chosen){this.tone(587,0.35,'sine',0.06);this.tone(784,0.35,'sine',0.055,0.16);this.tone(988,0.5,'sine',0.05,0.32);if(chosen){this.tone(1318,0.4,'sine',0.06,0.55);this.tone(1568,0.7,'sine',0.05,0.72)}},
  breakthrough(){this.tone(523,0.18,'sine',0.08);this.tone(659,0.18,'sine',0.08,0.1);this.tone(784,0.22,'sine',0.08,0.2);this.tone(1047,0.5,'sine',0.08,0.32)},
  bigBreak(){this.tone(392,0.4,'sine',0.09);this.tone(523,0.4,'sine',0.09,0.08);this.tone(659,0.5,'sine',0.09,0.16);this.tone(784,0.6,'sine',0.1,0.24);this.tone(1047,0.9,'sine',0.1,0.32);this.tone(1568,1.2,'sine',0.07,0.5)},
  tianjie(){this.tone(100,0.6,'sawtooth',0.12);this.tone(200,0.4,'sawtooth',0.08,0.2)},
  achUnlock(){this.tone(659,0.15,'sine',0.08);this.tone(784,0.15,'sine',0.08,0.1);this.tone(1047,0.4,'sine',0.09,0.2);this.tone(1318,0.5,'sine',0.08,0.4)},
  death(){this.tone(200,1.2,'sine',0.08);this.tone(150,1.5,'sine',0.06,0.4);this.tone(100,2.0,'sine',0.05,0.8)},
  mijingRoom(){this.tone(880,0.1,'sine',0.05);this.tone(659,0.15,'sine',0.05,0.08)},
  mijingReward(){this.tone(659,0.15,'sine',0.07);this.tone(880,0.2,'sine',0.07,0.1);this.tone(1047,0.3,'sine',0.07,0.22)},
  audioReady(){this.tone(587,0.1,'sine',0.05);this.tone(784,0.2,'sine',0.05,0.08)},
  tip(){this.tone(880,0.1,'sine',0.05);this.tone(1047,0.15,'sine',0.05,0.09)},
  ending(){this.tone(523,0.5,'sine',0.08);this.tone(659,0.5,'sine',0.08,0.2);this.tone(784,0.5,'sine',0.08,0.4);this.tone(1047,1.0,'sine',0.1,0.6);this.tone(1318,1.5,'sine',0.08,0.9)},
  signIn(){this.tone(659,0.15,'sine',0.07);this.tone(880,0.2,'sine',0.07,0.1);this.tone(1175,0.3,'sine',0.07,0.22)},
  milestone(){this.tone(523,0.2,'sine',0.08);this.tone(784,0.25,'sine',0.08,0.15);this.tone(1047,0.4,'sine',0.08,0.32)},
  storyArc(){this.tone(659,0.2,'sine',0.08);this.tone(880,0.25,'sine',0.08,0.15);this.tone(988,0.35,'sine',0.08,0.3);this.tone(1318,0.5,'sine',0.08,0.5)},
  expedition(){this.tone(587,0.2,'sine',0.07);this.tone(784,0.25,'sine',0.07,0.15);this.tone(880,0.35,'sine',0.07,0.3)},
  expeditionReturn(){this.tone(659,0.2,'sine',0.08);this.tone(880,0.25,'sine',0.08,0.15);this.tone(1047,0.4,'sine',0.08,0.3)},
  worldEvent(){this.tone(440,0.3,'sine',0.08);this.tone(659,0.35,'sine',0.08,0.15);this.tone(880,0.5,'sine',0.08,0.35);this.tone(1175,0.7,'sine',0.08,0.6)},
  legacyUp(){this.tone(523,0.2,'sine',0.08);this.tone(784,0.25,'sine',0.08,0.15);this.tone(1047,0.3,'sine',0.08,0.3);this.tone(1318,0.5,'sine',0.08,0.5)}
};

/* ============ 背景音乐控制 ============ */
function updateBgm() {
  const bgm = document.getElementById('bgm');
  if (!bgm) return;
  if (s.musicEnabled && _userHasInteracted) {
    bgm.volume = 0.2; // 音量大小，可自行调整
    bgm.play().catch(e => console.log('BGM 播放等待用户交互:', e));
  } else {
    bgm.pause();
  }
}

/* ============ 存档 ============ */
function serializeState(){
  return{
    saveVersion:CURRENT_SAVE_VERSION,
    masterName:s.masterName,sectName:s.sectName,masterTitle:s.masterTitle||'',
    discipleList:s.discipleList.map(serializeDisciple),
    stones:{m:s.stones.m,e:s.stones.e},cave:s.cave,eras:s.eras,
    totalReports:s.totalReports,reportsSinceEvent:s.reportsSinceEvent,
    memos:s.memos.map(serializeMemo),
    lastSave:s.lastSave,lastReport:s.lastReport,lastTick:s.lastTick,
    tutorialDone:s.tutorialDone,created:s.created,
    buildings:s.buildings,achievements:s.achievements,chronicle:s.chronicle,
    flags:s.flags,ritesSeen:s.ritesSeen,loginDays:s.loginDays,lastLoginDay:s.lastLoginDay,
    daily:s.daily,stats:s.stats,allExpMul:s.allExpMul,
    lastSnapshot:s.lastSnapshot,
    firstEraTime:s.firstEraTime,createdAt:s.createdAt,
    recentEvents:s.recentEvents||[],
    numFormat:s.numFormat||'short',audioEnabled:AudioSys.enabled,musicEnabled:s.musicEnabled!==false,masterEnergy:s.masterEnergy,masterEnergyRecover:s.lastEnergyRecover,dailyPendingRewards:{exp:{m:(s.dailyPendingRewards&&s.dailyPendingRewards.exp.m)||0,e:(s.dailyPendingRewards&&s.dailyPendingRewards.exp.e)||0},stone:{m:(s.dailyPendingRewards&&s.dailyPendingRewards.stone.m)||0,e:(s.dailyPendingRewards&&s.dailyPendingRewards.stone.e)||0}},
    vibrationEnabled:s.vibrationEnabled!==false,fontSize:s.fontSize||'normal',dialect:s.dialect||'sc',
    viceEnabled:!!s.viceEnabled,lastBreak:s.lastBreak||null,
    tipsSeen:s.tipsSeen||{},openingTutorialDone:!!s.openingTutorialDone,
    mijingCooldowns:s.mijingCooldowns||{low:0,mid:0,high:0,top:0},
    autoBank:{exp:{m:s.autoBank.exp.m,e:s.autoBank.exp.e},stone:{m:s.autoBank.stone.m,e:s.autoBank.stone.e},breaks:s.autoBank.breaks,count:s.autoBank.count},
    unreadLog:{exp:{m:s.unreadLog.exp.m,e:s.unreadLog.exp.e},stone:{m:s.unreadLog.stone.m,e:s.unreadLog.stone.e},breaks:s.unreadLog.breaks,fails:s.unreadLog.fails},
    clickEggCount:s.clickEggCount||0,nextTalent:!!s.nextTalent,
    relics:s.relics||[],lastCheckAge:s.lastCheckAge||0,
    tianxiangId:s.tianxiangId||'normal',tianxiangUntil:s.tianxiangUntil||0,
    lastTianxia:s.lastTianxia||0,
    ancestralDisciple:s.ancestralDisciple||null,
    endingDismissed:s.endingDismissed||[],
    lastLoyaltyTick:s.lastLoyaltyTick||0,
    viceCutTotal:{m:(s.viceCutTotal||new Dec(0,0)).m,e:(s.viceCutTotal||new Dec(0,0)).e},
    viceUpkeepPool:{m:(s.viceUpkeepPool||new Dec(0,0)).m,e:(s.viceUpkeepPool||new Dec(0,0)).e},
    showTianxia:s.showTianxia!==false,
    moonOrder:s.moonOrder||'cultivate',
    moonOrderChangedAt:s.moonOrderChangedAt||0,
    lastRecruitAt:s.lastRecruitAt||0,
    signIn:s.signIn||{lastDate:'',cycleDay:0,totalDays:0,dailyQuiz:{date:'',questions:[],answers:[],answeredAt:0,rewardGranted:false}},
    quizStats:s.quizStats||{total:0,correct:0,days:0,streak:0,bestStreak:0,history:[]},
    dailyBuff:s.dailyBuff||{until:0},
    milestones:s.milestones||{},
    eventChain:s.eventChain||{},
    lastOfflineFlavor:s.lastOfflineFlavor||'',
    expeditions:(s.expeditions||[]).map(e=>({id:e.id,discipleId:e.discipleId,locationId:e.locationId,startAt:e.startAt,endAt:e.endAt,done:!!e.done,result:e.result||null})),
    weekly:{weekId:s.weekly.weekId,tasks:s.weekly.tasks,allDoneRewarded:!!s.weekly.allDoneRewarded},
    weekStats:s.weekStats||{breaks:0,mijing:0,events:0,recruits:0,signIns:0,expeditions:0,tianxiang:0},
    legacyTree:s.legacyTree||{scripture2:0,event:0,loyalty:0,offline:0,mijing:0,break:0},
    yearbooks:s.yearbooks||[],
    currentYear:s.currentYear||{startAt:Date.now(),stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]},
    worldEvents:(s.worldEvents||[]).map(e=>({id:e.id,type:e.type,title:e.title,text:e.text,fromName:e.fromName,startAt:e.startAt,triggerAt:e.triggerAt,buff:!!e.buff,buffMul:e.buffMul||1,buffEnd:e.buffEnd||0,done:!!e.done,triggered:!!e.triggered})),
    lastDefectCheck:s.lastDefectCheck||0,
    gameVersion:GAME_VERSION
  };
}
function serializeDisciple(d){
    return{id:d.id,name:d.name,personality:d.personality,aptitude:d.aptitude,root:d.root,specialty:d.specialty||null,
    rootBone:d.rootBone,comprehension:d.comprehension,luck:d.luck,
    level:d.level,exp:{m:d.exp.m,e:d.exp.e},joinedAt:d.joinedAt,
    totalBreaks:d.totalBreaks,totalFails:d.totalFails,failStreak:d.failStreak||0,
    bigBreaksSinceTianjie:d.bigBreaksSinceTianjie||0,
    chosen:!!d.chosen,story:d.story||null,injuryUntil:d.injuryUntil||0,
    loyalty:d.loyalty||50,giftGiven:d.giftGiven||0,pampered:!!d.pampered,
    upkeep:typeof d.upkeep==='number'?d.upkeep:0.15,
    catchphrase:d.catchphrase||'',
    relationships:d.relationships||[],age:d.age||18,
    storyArcs:(d.storyArcs||[]).map(a=>({stage:a.stage||1,done:!!a.done,doneAt:a.doneAt||0})),
    forceBreak:!!d.forceBreak,
    legacyQuote:d.legacyQuote||null,legacyChecked:!!d.legacyChecked,
    states:(d.states||[]).filter(x=>x&&x.id&&x.until)};
}
function deserializeDisciple(d){
  const p=d.personality||'steady';
  const templateArcs=STORY_ARCS[p]||STORY_ARCS.steady;
  let arcs;
  if(Array.isArray(d.storyArcs)&&d.storyArcs.length>0){
    arcs=templateArcs.map((ta,i)=>{
      const old=d.storyArcs[i];
      if(old&&old.done!==undefined){
        return{...ta,done:!!old.done,doneAt:old.doneAt||0};
      }
      return{...ta,done:false};
    });
  }else{
    arcs=templateArcs.map(ta=>({...ta,done:false}));
  }
    return{id:d.id,name:d.name,personality:d.personality,aptitude:d.aptitude,root:d.root||'none',
    specialty:d.specialty||SPECIALTIES[Math.floor(Math.random()*SPECIALTIES.length)].id,
    rootBone:d.rootBone,comprehension:d.comprehension,luck:d.luck,
    level:d.level,exp:new Dec((d.exp&&d.exp.m)||0,(d.exp&&d.exp.e)||0),
    joinedAt:d.joinedAt||Date.now(),
    totalBreaks:d.totalBreaks||0,totalFails:d.totalFails||0,failStreak:d.failStreak||0,
    bigBreaksSinceTianjie:d.bigBreaksSinceTianjie||0,
    chosen:!!d.chosen,story:d.story||null,injuryUntil:d.injuryUntil||0,
    loyalty:typeof d.loyalty==='number'?d.loyalty:50,giftGiven:d.giftGiven||0,
    pampered:(typeof d.pampered==='boolean')?d.pampered:(typeof d.upkeep==='number'&&d.upkeep<=0.02),
    upkeep:typeof d.upkeep==='number'?Math.max(0,Math.min(0.5,d.upkeep)):0.15,
    catchphrase:d.catchphrase||rollCatchphrase(p),
    relationships:Array.isArray(d.relationships)?d.relationships:[],
    age:typeof d.age==='number'?d.age:18,
    storyArcs:arcs,
    forceBreak:!!d.forceBreak,
    legacyQuote:d.legacyQuote||null,legacyChecked:!!d.legacyChecked,
    states:Array.isArray(d.states)?d.states.filter(x=>x&&x.id&&x.until):[]};
}
function serializeMemo(m){return{id:m.id,time:m.time,interval:m.interval,read:m.read,isOffline:!!m.isOffline,isAutoBank:!!m.isAutoBank,autoCount:m.autoCount||0,totalExp:{m:m.totalExp.m,e:m.totalExp.e},totalStone:{m:m.totalStone.m,e:m.totalStone.e},breaks:m.breaks,fails:m.fails,voice:m.voice,greeting:m.greeting,daily:m.daily,chatter:m.chatter,bigBreaks:m.bigBreaks,event:m.event}}
function deserializeMemo(m){return{id:m.id,time:m.time,interval:m.interval,read:!!m.read,isOffline:!!m.isOffline,isAutoBank:!!m.isAutoBank,autoCount:m.autoCount||0,totalExp:new Dec((m.totalExp&&m.totalExp.m)||0,(m.totalExp&&m.totalExp.e)||0),totalStone:new Dec((m.totalStone&&m.totalStone.m)||0,(m.totalStone&&m.totalStone.e)||0),breaks:m.breaks||[],fails:m.fails||[],voice:m.voice||'',greeting:m.greeting||'',daily:m.daily||'',chatter:m.chatter||null,bigBreaks:m.bigBreaks||[],event:m.event||null}}
function exportSaveCode(){return utf8ToB64(JSON.stringify({v:EXPORT_VERSION,gv:GAME_VERSION,ts:Date.now(),save:serializeState()}))}
function downloadSaveFile(){
  const code=exportSaveCode();
  const header='# 一毛修仙 · 存档文件\n# 版本 '+GAME_VERSION+'\n# 作者 '+GAME_AUTHOR+'\n\n';
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
function migrateSave(data){
  if(!data)return data;
  const v=data.saveVersion||1;
  if(v<2){
    if(!data.signIn)data.signIn={lastDate:'',cycleDay:0,totalDays:0};
    if(!data.dailyBuff)data.dailyBuff={until:0};
    if(!data.milestones)data.milestones={};
    if(!data.stats)data.stats={};
    if(typeof data.stats.todaySignIn!=='number')data.stats.todaySignIn=0;
    data.saveVersion=2;
  }
  if(v<3){
    if(!data.eventChain)data.eventChain={};
    if(!data.lastOfflineFlavor)data.lastOfflineFlavor='';
    data.saveVersion=3;
  }
  if(v<4){
    if(!Array.isArray(data.expeditions))data.expeditions=[];
    if(!data.weekly||typeof data.weekly!=='object')data.weekly={weekId:0,tasks:[],allDoneRewarded:false};
    if(!data.weekStats||typeof data.weekStats!=='object')data.weekStats={breaks:0,mijing:0,events:0,recruits:0,signIns:0,expeditions:0,tianxiang:0};
    if(!data.legacyTree||typeof data.legacyTree!=='object')data.legacyTree={scripture2:0,event:0,loyalty:0,offline:0,mijing:0,break:0};
    if(!Array.isArray(data.yearbooks))data.yearbooks=[];
    if(!data.currentYear||typeof data.currentYear!=='object')data.currentYear={startAt:Date.now(),stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]};
    if(!Array.isArray(data.worldEvents))data.worldEvents=[];
    if(!data.stats)data.stats={};
    if(typeof data.stats.expeditionsDone!=='number')data.stats.expeditionsDone=0;
    if(typeof data.stats.weeklyFullCount!=='number')data.stats.weeklyFullCount=0;
    if(typeof data.stats.worldEventsSeen!=='number')data.stats.worldEventsSeen=0;
    data.saveVersion=4;
  }
  return data;
}
function applySaveData(rawData){
  const data=migrateSave(rawData);
  s.masterName=data.masterName||'无名掌门';
  s.sectName=data.sectName||'一毛宗';
  s.masterTitle=data.masterTitle||'';
  s.discipleList=(data.discipleList||[]).map(deserializeDisciple);
  if (data.stones && isFinite(data.stones.m) && isFinite(data.stones.e)) {
      s.stones = new Dec(data.stones.m, data.stones.e);
  } else {
      s.stones = new Dec(100, 0);
  }
  s.cave=data.cave||0;s.eras=data.eras||0;
  s.totalReports=data.totalReports||0;s.reportsSinceEvent=data.reportsSinceEvent||0;
  s.memos=(data.memos||[]).map(deserializeMemo);
  s.lastSave=data.lastSave||Date.now();s.lastReport=data.lastReport||Date.now();s.lastTick=data.lastTick||Date.now();
  s.tutorialDone=!!data.tutorialDone;s.created=!!data.created;
  s.buildings=Object.assign({scripture:0,alchemy:0,arena:0,array:0},data.buildings||{});
  s.achievements=data.achievements||{};s.chronicle=data.chronicle||[];
  s.flags=Object.assign({handledEvent:false,eventGreat:false,eventAwful:false,survivedTianjie:false,lostDisciple:false,mijingPerfect:false,mijingInjured:false,firstDeath:false,endingReached:false,endingShown:false,tianxiangSpirit:false,tianxiangGrand:false,firstRecruitCinematic:false,firstRecruitRerolled:false,firstRecruitDone:false},data.flags||{});
  s.ritesSeen=data.ritesSeen||{};
  s.loginDays=data.loginDays||1;s.lastLoginDay=data.lastLoginDay||todayStr();
  s.daily=data.daily||{date:todayStr(),tasks:[]};
  s.stats=Object.assign({dailyDone:0,chatterSeen:0,todayMemosRead:0,todayBreaks:0,todayEvents:0,todayEventGood:0,todayRecruits:0,todayMijing:0,mijingDone:0,todaySignIn:0,expeditionsDone:0,weeklyFullCount:0,worldEventsSeen:0},data.stats||{});
  s.allExpMul=data.allExpMul||0;s.lastSnapshot=data.lastSnapshot||null;
  s.firstEraTime=data.firstEraTime||0;s.createdAt=data.createdAt||Date.now();
  s.recentEvents=Array.isArray(data.recentEvents)?data.recentEvents:[];
  s.numFormat=data.numFormat||'short';DEC_LONG_FORMAT=(s.numFormat==='long');
  if(typeof data.audioEnabled==='boolean')AudioSys.enabled=data.audioEnabled;
  if(typeof data.musicEnabled==='boolean')s.musicEnabled=data.musicEnabled;else s.musicEnabled=true;
  s.masterEnergy = typeof data.masterEnergy === 'number' ? data.masterEnergy : 5;
  s.lastEnergyRecover = data.masterEnergyRecover || Date.now();
  if(data.dailyPendingRewards && typeof data.dailyPendingRewards.exp.m === 'number') {
    s.dailyPendingRewards = { exp: new Dec(data.dailyPendingRewards.exp.m, data.dailyPendingRewards.exp.e), stone: new Dec(data.dailyPendingRewards.stone.m, data.dailyPendingRewards.stone.e) };
  } else {
    s.dailyPendingRewards = { exp: new Dec(0,0), stone: new Dec(0,0) };
  }
  s.vibrationEnabled=data.vibrationEnabled!==false;s.fontSize=data.fontSize||'normal';s.dialect=data.dialect||'sc';
  s.viceEnabled=!!data.viceEnabled;s.lastBreak=data.lastBreak||null;
  s.tipsSeen=Object.assign({},data.tipsSeen||{});
  s.openingTutorialDone=!!data.openingTutorialDone;
  s.mijingCooldowns=Object.assign({low:0,mid:0,high:0,top:0},data.mijingCooldowns||{});
  s.clickEggCount=data.clickEggCount||0;s.nextTalent=!!data.nextTalent;
  s.relics=Array.isArray(data.relics)?data.relics:[];
  s.lastCheckAge=data.lastCheckAge||Date.now();
  s.tianxiangId=data.tianxiangId||'normal';
  s.tianxiangUntil=data.tianxiangUntil||0;
  s.lastTianxia=data.lastTianxia||0;
  s.ancestralDisciple=data.ancestralDisciple||null;
  s.endingDismissed=Array.isArray(data.endingDismissed)?data.endingDismissed:[];
  s.lastLoyaltyTick=data.lastLoyaltyTick||Date.now();
  s.viceCutTotal=data.viceCutTotal?new Dec(data.viceCutTotal.m,data.viceCutTotal.e):new Dec(0,0);
  s.viceUpkeepPool=data.viceUpkeepPool?new Dec(data.viceUpkeepPool.m,data.viceUpkeepPool.e):new Dec(0,0);
  s.showTianxia=data.showTianxia!==false;
  s.moonOrder=data.moonOrder||'cultivate';
  s.moonOrderChangedAt=data.moonOrderChangedAt||0;
  s.lastRecruitAt=data.lastRecruitAt||0;
  s.signIn=data.signIn||{lastDate:'',cycleDay:0,totalDays:0};
  s.quizStats=Object.assign({total:0,correct:0,days:0,streak:0,bestStreak:0,history:[]},data.quizStats||{});
  if(!Array.isArray(s.quizStats.history))s.quizStats.history=[];
  if(!s.signIn.dailyQuiz||typeof s.signIn.dailyQuiz!=='object'){
    s.signIn.dailyQuiz={date:'',questions:[],answers:[],answeredAt:0,rewardGranted:false};
  }
  // 兼容旧存档：确保 dailyQuiz 各字段存在
  if(!s.signIn.dailyQuiz.questions)s.signIn.dailyQuiz.questions=[];
  if(!s.signIn.dailyQuiz.answers)s.signIn.dailyQuiz.answers=[];
  if(typeof s.signIn.dailyQuiz.answeredAt!=='number')s.signIn.dailyQuiz.answeredAt=0;
  if(typeof s.signIn.dailyQuiz.rewardGranted!=='boolean')s.signIn.dailyQuiz.rewardGranted=false;
  if(typeof s.signIn.dailyQuiz.date!=='string')s.signIn.dailyQuiz.date='';
  s.dailyBuff=data.dailyBuff||{until:0};
  s.milestones=data.milestones||{};
  s.eventChain=data.eventChain||{};
  s.lastOfflineFlavor=data.lastOfflineFlavor||'';
  s.expeditions=Array.isArray(data.expeditions)?data.expeditions:[];
  s.weekly=data.weekly&&typeof data.weekly==='object'?data.weekly:{weekId:0,tasks:[],allDoneRewarded:false};
  s.weekStats=data.weekStats||{breaks:0,mijing:0,events:0,recruits:0,signIns:0,expeditions:0,tianxiang:0};
  s.legacyTree=data.legacyTree||{scripture2:0,event:0,loyalty:0,offline:0,mijing:0,break:0};
  s.yearbooks=Array.isArray(data.yearbooks)?data.yearbooks:[];
  s.currentYear=data.currentYear||{startAt:Date.now(),stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]};
  s.worldEvents=Array.isArray(data.worldEvents)?data.worldEvents:[];
  s.lastDefectCheck=data.lastDefectCheck||Date.now();
  if(data.autoBank)s.autoBank={exp:new Dec((data.autoBank.exp&&data.autoBank.exp.m)||0,(data.autoBank.exp&&data.autoBank.exp.e)||0),stone:new Dec((data.autoBank.stone&&data.autoBank.stone.m)||0,(data.autoBank.stone&&data.autoBank.stone.e)||0),breaks:data.autoBank.breaks||[],count:data.autoBank.count||0};
  if(data.unreadLog)s.unreadLog={exp:new Dec((data.unreadLog.exp&&data.unreadLog.exp.m)||0,(data.unreadLog.exp&&data.unreadLog.exp.e)||0),stone:new Dec((data.unreadLog.stone&&data.unreadLog.stone.m)||0,(data.unreadLog.stone&&data.unreadLog.stone.e)||0),breaks:data.unreadLog.breaks||[],fails:data.unreadLog.fails||[]};
  if(s.discipleList.length>0)s.flags.firstRecruitDone=true;
  applyFontSize();renderSplashStory();lastTopSi=-1;save();
}
function doImport(rawCode){
  const parsed=parseSaveCode(rawCode);
  if(!parsed.ok){toast(parsed.msg,2800);return false}
  if(!confirm('导入后将覆盖当前进度，确定继续吗？'))return false;
  applySaveData(parsed.data);AudioSys.success();flash('gold');
  toast('存档导入成功',2600);hideModal();
  if(s.created&&s.discipleList.length>0){el.splash.style.display='none';el.create.style.display='none';el.game.classList.add('show')}
  renderUI();spawnParticles();return true;
}
function openSaveManage(){
  let html='<div class="modal-title">存 档 管 理</div><div class="modal-sub">分享 / 备份 / 恢复</div>';
  html+='<div class="gacha-box">';
  html+='<div class="gacha-slot" id="smShare"><div class="gs-icon">🔗</div><div class="gs-info"><div class="gs-name">分享给朋友</div><div class="gs-desc">生成二维码或复制链接</div></div></div>';
  html+='<div class="gacha-slot" id="smExport"><div class="gs-icon">📤</div><div class="gs-info"><div class="gs-name">导出存档</div><div class="gs-desc">复制存档码，或下载文件</div></div></div>';
  html+='<div class="gacha-slot" id="smImport"><div class="gs-icon">📥</div><div class="gs-info"><div class="gs-name">导入存档</div><div class="gs-desc">从存档码或文件恢复</div></div></div>';
  html+='</div><div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('smShare').onclick=(e)=>{e.stopPropagation();AudioSys.click();openShare()};
  $('smExport').onclick=(e)=>{e.stopPropagation();AudioSys.click();openExport()};
  $('smImport').onclick=(e)=>{e.stopPropagation();AudioSys.click();openImport()};
}
function openShare(){
  let html='<div class="modal-title">分 享 游 戏</div>';
  if(!SHARE_URL){html+='<div class="tip-box warn" style="text-align:center">当前本地打开，无法生成分享链接</div>';showModal(html);return}
  const qr=getQRUrl(SHARE_URL,220);
  html+='<div class="qr-box"><img src="'+qr+'" alt="扫码一起玩" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div class="qr-fallback"><div style="font-size:32px">📱</div><div>扫码一起玩</div></div></div>';
  html+='<div class="url-display">'+SHARE_URL+'</div>';
  html+='<button class="btn gold" style="width:100%;padding:14px" id="genPoster">生 成 分 享 图</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="copyUrl">复 制 链 接</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="backSaveM">返 回</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('genPoster').onclick=(e)=>{e.stopPropagation();AudioSys.click();generateSharePoster()};
  $('copyUrl').onclick=async(e)=>{e.stopPropagation();AudioSys.click();const ok=await copyText(SHARE_URL);toast(ok?'已复制':'复制失败')};
  $('backSaveM').onclick=(e)=>{e.stopPropagation();AudioSys.click();openSaveManage()};
}
function generateSharePoster(){
  const W=750,H=1334;
  const canvas=document.createElement('canvas');
  canvas.width=W;canvas.height=H;
  const ctx=canvas.getContext('2d');
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#172a24');bg.addColorStop(0.6,'#1f3a32');bg.addColorStop(1,'#2b4c42');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const glow=ctx.createRadialGradient(W/2,300,0,W/2,300,400);
  glow.addColorStop(0,'rgba(230,196,115,.25)');glow.addColorStop(1,'rgba(230,196,115,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  ctx.fillStyle='#e6c473';
  ctx.font='bold 64px "Songti SC",serif';
  ctx.fillText('一 毛 修 仙',W/2,160);
  ctx.fillStyle='rgba(232,238,240,.5)';
  ctx.font='24px sans-serif';
  ctx.fillText('ALL FOR ONE MAO',W/2,210);
  ctx.fillStyle='#e8eef0';
  ctx.font='32px sans-serif';
  ctx.fillText('掌门 · '+(s.masterName||'无名掌门'),W/2,340);
  ctx.font='26px sans-serif';
  ctx.fillStyle='rgba(232,238,240,.7)';
  ctx.fillText(s.sectName+' · 第 '+(s.eras+1)+' 纪 · 立派 '+playDays()+' 天',W/2,390);
  const top=topDisciple();
  if(top){
    const r=realmOf(top.level);
    ctx.fillStyle='#e8eef0';
    ctx.font='bold 36px sans-serif';
    ctx.fillText('首席 · '+top.name,W/2,500);
    ctx.font='28px sans-serif';
    ctx.fillStyle=r.c;
    ctx.fillText(r.name+' · '+getRoot(top).n+'灵根',W/2,550);
  }
  const pct=Math.min(1,s.stones.toNum()/TARGET_MAO);
  const barW=520,barH=24,barX=(W-barW)/2,barY=660;
  ctx.fillStyle='rgba(0,0,0,.35)';
  roundRect(ctx,barX,barY,barW,barH,12);ctx.fill();
  ctx.fillStyle='#e6c473';
  roundRect(ctx,barX,barY,Math.max(12,barW*pct),barH,12);ctx.fill();
  ctx.fillStyle='#e8eef0';
  ctx.font='28px sans-serif';
  let pctLabel;
  if(pct<0.000001)pctLabel='起步中';
  else if(pct<0.0001)pctLabel='万里长征第一步';
  else if(pct<0.01)pctLabel=(pct*100).toFixed(4)+'%';
  else if(pct<1)pctLabel=(pct*100).toFixed(2)+'%';
  else pctLabel=(pct*100).toFixed(1)+'%';
  ctx.fillText('距 14 亿毛 · '+pctLabel,W/2,barY+70);
  let quote='弟子只有一毛，请掌门收下。';
  if(top&&top.catchphrase)quote=top.catchphrase;
  ctx.fillStyle='rgba(230,196,115,.9)';
  ctx.font='italic 30px "Songti SC",serif';
  ctx.fillText('「'+quote+'」',W/2,820);
  const qrImg=new Image();
  qrImg.onload=()=>{
    ctx.drawImage(qrImg,W/2-110,H-440,220,220);
    ctx.strokeStyle='rgba(230,196,115,.15)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(W/2-180,H-200);
    ctx.lineTo(W/2+180,H-200);
    ctx.stroke();
    ctx.fillStyle='rgba(232,238,240,.6)';
    ctx.font='24px sans-serif';
    ctx.fillText('扫码一起玩',W/2,H-160);
    ctx.fillStyle='rgba(230,196,115,.75)';
    ctx.font='22px sans-serif';
    ctx.fillText('by '+GAME_AUTHOR+' · 一级注册结构工程师',W/2,H-105);
    ctx.fillStyle='rgba(232,238,240,.45)';
    ctx.font='18px sans-serif';
    ctx.fillText('纯 AI 制作 · 完全不懂代码',W/2,H-70);
    ctx.fillStyle='rgba(232,238,240,.35)';
    ctx.font='16px sans-serif';
    ctx.fillText('有 BUG 不用告诉我，我也不会改',W/2,H-42);
    const dataUrl=canvas.toDataURL('image/png');
    showPosterModal(dataUrl);
  };
  qrImg.onerror=()=>{toast('二维码加载失败，请确认 qr.png 已放在同目录',3000)};
  qrImg.src='qr.png';
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function showPosterModal(dataUrl){
  let html='<div class="modal-title">分 享 图</div>';
  html+='<div class="modal-sub">长按图片保存到相册</div>';
  html+='<img src="'+dataUrl+'" style="width:100%;border-radius:12px;display:block;margin-bottom:12px">';
  html+='<button class="btn gold" style="width:100%;padding:14px" id="saveTipBtn">我 知 道 了</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('saveTipBtn').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal()};
}
function openExport(){
  const code=exportSaveCode();
  let html='<div class="modal-title">导 出 存 档</div><div class="modal-sub">换设备 / 备份</div>';
  html+='<textarea class="import-box" id="exportCode" readonly>'+code+'</textarea>';
  html+='<button class="btn gold" style="width:100%;margin-top:12px;padding:15px" id="copySave">复 制 存 档 码</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="downloadSave">下 载 存 档 文 件</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="backSaveE">返 回</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('copySave').onclick=async(e)=>{e.stopPropagation();AudioSys.click();const ok=await copyText(code);toast(ok?'已复制':'复制失败')};
  $('downloadSave').onclick=(e)=>{e.stopPropagation();AudioSys.click();downloadSaveFile();toast('已下载')};
  $('backSaveE').onclick=(e)=>{e.stopPropagation();AudioSys.click();openSaveManage()};
}
function openImport(){
  let html='<div class="modal-title">导 入 存 档</div><div class="modal-sub">从存档码或文件恢复</div>';
  html+='<div class="tip-box warn">导入会<span class="hl">覆盖当前进度</span></div>';
  html+='<textarea class="import-box" id="importCode" placeholder="粘贴存档码..."></textarea>';
  html+='<button class="btn gold" style="width:100%;margin-top:12px;padding:15px" id="doImportBtn">导 入 存 档 码</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="pickFile">选 择 存 档 文 件</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="backSaveI">返 回</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('doImportBtn').onclick=(e)=>{e.stopPropagation();AudioSys.click();const c=$('importCode').value;if(!c.trim()){toast('请先粘贴');return}doImport(c)};
  $('pickFile').onclick=(e)=>{e.stopPropagation();AudioSys.click();el.importFileInput.value='';el.importFileInput.click()};
  $('backSaveI').onclick=(e)=>{e.stopPropagation();AudioSys.click();openSaveManage()};
}
el.importFileInput.addEventListener('change',(e)=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{doImport(ev.target.result)};r.onerror=()=>toast('文件读取失败');r.readAsText(f)});
function save() {
  s.lastSave = Date.now();
  if (_saveTimer) clearTimeout(_saveTimer);
  // 延迟 1 秒执行保存，如果 1 秒内再次触发 save，则重新计时（防抖）
  _saveTimer = setTimeout(() => { executeSave(); }, 1000);
}

function load(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw){
      const bk=localStorage.getItem(SAVE_KEY+'_backup');
      if(!bk)return false;
      const d=JSON.parse(bk);
      applySaveData(d);
      return true;
    }
    const d=JSON.parse(raw);
    applySaveData(d);
    return true;
  }catch(e){
    try{
      const bk=localStorage.getItem(SAVE_KEY+'_backup');
      if(!bk)return false;
      const d=JSON.parse(bk);
      applySaveData(d);
      toast('主存档损坏，已从备份恢复');
      return true;
    }catch(e2){return false}
  }
}

function executeSave() {
  try {
    const data = JSON.stringify(serializeState());
    localStorage.setItem(SAVE_KEY + '_backup', data);
    localStorage.setItem(SAVE_KEY, data);
  } catch(e) {
    console.error('存档写入失败', e);
  } finally {
    _saveTimer = null;
  }
}

function tickEnergy(){
  if(!s.created) return;
  const now = Date.now();
  if(!s.lastEnergyRecover) s.lastEnergyRecover = now;
  const elapsed = now - s.lastEnergyRecover;
  const interval = CONFIG.energyRecoverInterval;
  const maxEnergy = CONFIG.maxEnergy;
  if(elapsed >= interval && s.masterEnergy < maxEnergy){
    const recovered = Math.floor(elapsed / interval);
    s.masterEnergy = Math.min(maxEnergy, s.masterEnergy + recovered);
    s.lastEnergyRecover += recovered * interval;
  }
}
function consumeEnergy(amount){
  amount = amount || 1;
  if(s.masterEnergy < amount) return false;
  s.masterEnergy -= amount;
  save();
  renderUI();
  return true;
}

function flushSave() {
  if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
  executeSave();
}