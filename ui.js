/* ============ DOM ============ */

let lastTopSi=-1;
function applyTheme(c){
  document.documentElement.style.setProperty('--realm',c);
  document.documentElement.style.setProperty('--realm-15',hexToRgba(c,.15));
  document.documentElement.style.setProperty('--realm-30',hexToRgba(c,.3));
  document.documentElement.style.setProperty('--realm-50',hexToRgba(c,.5));
  
  // 新增：动态改变游戏主背景的光晕色调，让大境界突破后整个世界颜色跟着变
  const gameEl = document.getElementById('game');
  if(gameEl){
    const bg = `radial-gradient(ellipse at 50% 32%, ${hexToRgba(c, .25)} 0%, transparent 50%), linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-mid) 55%, var(--bg-light) 100%)`;
    gameEl.style.background = bg;
  }
}
function applyFontSize(){document.documentElement.style.setProperty('--fs-scale',String(FS_VALUE()))}
function renderSplashStory(){if(el.splashStory)el.splashStory.innerHTML=t('splash_story')}

/* ============ Modal 队列 ============ */
const ModalQueue={
  queue:[],current:null,
  push(fn,opts){
    opts=opts||{};
    if(opts.priority){this.queue.unshift(fn)}else{this.queue.push(fn)}
    this.process();
  },
  process(){
    if(this.current)return;
    if(this.queue.length===0)return;
    this.current=this.queue.shift();
    const done=()=>{this.current=null;setTimeout(()=>this.process(),400)};
    this.current(done);
  },
  clear(){this.queue=[];this.current=null}
};

let tipBannerTimer=null;
function showTipBanner(icon,text,ms){ms=ms||4200;el.tipBanner.innerHTML='<span class="tb-icon">'+icon+'</span>'+text;el.tipBanner.classList.add('show');AudioSys.tip();clearTimeout(tipBannerTimer);tipBannerTimer=setTimeout(()=>el.tipBanner.classList.remove('show'),ms)}
const TRIGGER_TIPS={
  dotsSeen:{icon:'💡',text:'底部头像代表你的弟子 · 点击看详情'},
  first1000Stone:{icon:'💰',text:'毛可以用来升级宗门建筑、派遣秘境'},
  firstMijingUnlock:{icon:'🗺️',text:'秘境已解锁 · 每次进入后需要冷却'},
  firstMenuOpen:{icon:'📁',text:'「副掌门」可自动批阅日常 · 但会抽成 10%'},
  firstInjury:{icon:'🩹',text:'弟子秘境受伤会修为减半'},
  firstGoal:{icon:'🎯',text:'终极目标：收齐 14 亿毛'},
  firstRelation:{icon:'💞',text:'弟子之间会生成关系 · 道侣、宿敌、同乡'},
  firstAge:{icon:'⏳',text:'弟子有寿元 · 修为越高活得越久'},
  firstRelic:{icon:'🕯️',text:'弟子化道后留下遗物 · 永久加成'},
  firstTianxiang:{icon:'✨',text:'天象会随机变化 · 下方横幅提示'},
  firstTianxia:{icon:'🌏',text:'左上角会飘过天下消息 · 只是氛围'},
  firstLoyalty:{icon:'❤️',text:'忠诚度会因日常相处缓慢提升 · 影响修为速度'},
  firstSignIn:{icon:'📅',text:'每日签到可领毛 · 断签不清零'},
  firstChain:{icon:'🔗',text:'弟子的事件会有后续 · 世界记得你的选择'},
  firstStoryArc:{icon:'📖',text:'弟子到了某个境界 · 会有自己的故事'},
  firstExpedition:{icon:'🧭',text:'外派弟子游历 · 回来带资源和见闻'},
  firstWeekly:{icon:'📊',text:'每周任务周一刷新 · 全完成有额外奖励'},
  firstWorldEvent:{icon:'🌏',text:'天下消息有时会成真 · 3 天内生效'},
  firstLegacy:{icon:'♻️',text:'转生后可点传承树 · 永久强化'},
  firstDefect:{icon:'🚨',text:'忠诚低于 30 的弟子可能叛逃'},
  firstItem:{icon:'🎁',text:'待生效道具会显示在底部状态条'}
};
function tryShowTip(id){if(!s.tipsSeen)s.tipsSeen={};if(s.tipsSeen[id])return false;s.tipsSeen[id]=true;const tt=TRIGGER_TIPS[id];if(tt)showTipBanner(tt.icon,tt.text);save();return true}
function checkTriggerTips(){
  if(!s.created||s.discipleList.length===0)return;
  const top=topDisciple();if(!top)return;
    if(s.discipleList.length>=2&&!s.tipsSeen.dotsSeen)tryShowTip('dotsSeen');
  if(s.discipleList.length>=1&&!s.tipsSeen.moonOrder){s.tipsSeen.moonOrder=true;showTipBanner('🌙','掌门月令可定宗门方针 · 点击主界面月令行切换');save()}
  if(top.level>=5&&!s.tipsSeen.firstMijingUnlock)tryShowTip('firstMijingUnlock');
  if(s.stones.gte(Dec.of(300))&&!s.tipsSeen.first1000Stone)tryShowTip('first1000Stone');
  if(s.discipleList.some(d=>isInjured(d))&&!s.tipsSeen.firstInjury)tryShowTip('firstInjury');
  if(s.stones.gte(Dec.of(1000))&&!s.tipsSeen.firstGoal)tryShowTip('firstGoal');
  if(s.discipleList.length>=3&&!s.tipsSeen.firstRelation)tryShowTip('firstRelation');
  if(s.discipleList.some(d=>agingWarn(d))&&!s.tipsSeen.firstAge)tryShowTip('firstAge');
  if(s.relics&&s.relics.length>0&&!s.tipsSeen.firstRelic)tryShowTip('firstRelic');
  if(s.tianxiangId!=='normal'&&!s.tipsSeen.firstTianxiang)tryShowTip('firstTianxiang');
  if(s.discipleList.length>=1&&!s.tipsSeen.firstLoyalty)tryShowTip('firstLoyalty');
  if(s.expeditions&&s.expeditions.length>0&&!s.tipsSeen.firstExpedition)tryShowTip('firstExpedition');
  if(s.discipleList.some(d=>(d.loyalty||50)<30)&&!s.tipsSeen.firstDefect)tryShowTip('firstDefect');
  const top2=topDisciple();
  if((top2&&top2.forceBreak)||s.nextTalent){if(!s.tipsSeen.firstItem)tryShowTip('firstItem')}
}

/* ============ 突破弹窗 ============ */
let breakFloatTimer=null;
function showBreakFloat(text,color){el.breakFloat.textContent=text;el.breakFloat.style.color=color||'var(--gold)';el.breakFloat.classList.remove('on');void el.breakFloat.offsetWidth;el.breakFloat.classList.add('on');clearTimeout(breakFloatTimer);breakFloatTimer=setTimeout(()=>el.breakFloat.classList.remove('on'),2400)}
function showBreakthroughModal(d,oldR,newR,done,usedForceBreak){
  el.bkRays.innerHTML='';
  for(let i=0;i<12;i++){const r=document.createElement('div');r.className='bk-ray';r.style.animationDelay=(i*0.15)+'s';r.style.transform='translate(-50%,-50%) rotate('+(i*30)+'deg)';el.bkRays.appendChild(r)}
  let extra='';
  if(usedForceBreak)extra='<div class="tip-box good" style="text-align:center;margin:10px 0 0;font-size:calc(12.5px * var(--fs-scale))">🧪 破障丹已生效 · 本次突破 +50%</div>';
  el.bkCard.innerHTML='<div class="bk-icon">⚡</div><div class="bk-title">突破</div><div class="bk-name">'+d.name+(d.chosen?' ✨':'')+'</div><div class="bk-realm">'+oldR.short+' '+CN[oldR.sub]+'重</div><div class="bk-to">↓</div><div class="bk-to" style="color:'+newR.c+'">'+newR.name+'</div><div class="bk-desc">「'+newR.d+'」</div>'+extra+'<button class="bk-btn" id="bkBtn">收 到</button><div class="bk-timer" id="bkTimer">3 秒后自动关闭</div>';
  el.breakthrough.classList.add('show');AudioSys.bigBreak();vibrate([80,40,120]);
  el.charSvg.classList.add('breakthrough');setTimeout(()=>el.charSvg.classList.remove('breakthrough'),1300);
  flash('gold');
  let cd=3;let bt=setInterval(()=>{cd--;const t2=$('bkTimer');if(t2)t2.textContent=cd+' 秒后自动关闭';if(cd<=0){clearInterval(bt);close()}},1000);
  function close(){el.breakthrough.classList.remove('show');if(bt){clearInterval(bt);bt=null}if(done)done()}
  $('bkBtn').onclick=(e)=>{e.stopPropagation();AudioSys.click();close()};
}

/* ============ 见面礼 ============ */
function greetingLine(d){const p=getP(d);const map={diligent:'greet_diligent',clever:'greet_clever',steady:'greet_steady',fated:'greet_fated',proud:'greet_proud',lazy:'greet_lazy',loyal:'greet_loyal',loner:'greet_loner',romantic:'greet_romantic'};return t(map[p.id]||'greet_diligent')}
function typeWriter(elem,text,speed,onDone){let i=0;elem.textContent='';const timer=setInterval(()=>{if(i>=text.length){clearInterval(timer);if(onDone)onDone();return}elem.textContent+=text.charAt(i);i++},speed);return timer}
function showDiscipleGreeting(d,isSecond,onDone){
  const p=getP(d);const replies=tp('master_replies');const reply=pick(replies);const line=greetingLine(d);
  const halo=d.chosen?'rgba(230,196,115,.5)':'rgba(122,184,196,.35)';
  let html='';if(d.chosen)html+='<div class="greet-chosen-glow"></div>';
  html+='<div class="greet-wrap"><div class="greet-avatar-wrap"><div class="greet-halo" style="background:radial-gradient(circle,'+halo+' 0%,transparent 70%)"></div><div class="greet-avatar'+(d.chosen?' chosen':'')+'">'+p.ic+'</div></div>';
  html+='<div class="greet-name">'+d.name+(d.chosen?' ✨':'')+'</div>';
  html+='<div class="greet-tag">'+p.n+' · '+getApt(d).n+'资质 · '+getRoot(d).n+'灵根</div>';
  html+='<div class="greet-dialogue"><div class="greet-line"><span class="cn">'+d.name+'：</span><span class="ct" id="gCtx1"></span></div><div class="greet-line master" id="gL2" style="opacity:0"><span class="cn">掌门：</span><span class="ct" id="gCtx2"></span></div></div></div>';
  html+='<button class="btn gold" id="greetOk" style="width:100%;padding:15px;opacity:0">好</button>';
  html+='<div class="watermark wm-modal">by '+GAME_AUTHOR+'</div>';
  showModal(html,{noClose:true});
  AudioSys.greet(d.chosen);
  if(d.chosen){flash('gold');vibrate([40,30,60])}
  const c1=$('gCtx1'),c2=$('gCtx2'),ok=$('greetOk');
  setTimeout(()=>{typeWriter(c1,line,35,()=>{setTimeout(()=>{$('gL2').style.opacity='1';typeWriter(c2,reply,45,()=>{ok.style.opacity='1'})},800)})},400);
  ok.onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();if(onDone)setTimeout(onDone,400)};
}

/* ============ 首次仪式 ============ */
const RITE_CONTENT={
  first_break:{ic:'⚡',title:'初入道途',sub:'弟子第一次突破',body:'弟子终于迈出了第一步。\n从此，你不再只是一个名字。'},
  first_realm:{ic:'🔥',title:'大境界突破',sub:'弟子首次跨越大境界',body:'灵气冲霄，天地为之一震。'},
  first_event:{ic:'📜',title:'初掌宗门',sub:'第一次处理弟子事件',body:'一个决策，往往决定一个弟子的命运。'},
  first_build:{ic:'🏯',title:'大兴土木',sub:'第一次升级宗门建筑',body:'一砖一瓦，皆是底蕴。'},
  first_chosen:{ic:'✨',title:'天命之子',sub:'收下一位天命之子',body:'千年难遇的资质，落入你的门下。'},
  first_injury:{ic:'🩹',title:'浴血而归',sub:'弟子首次秘境受伤',body:'修行之路，哪有不流血的。'},
  first_betroth:{ic:'🪙',title:'一毛拜师',sub:'第一次收徒',body:'弟子只有一毛，双手奉上。\n这是你和「一毛」的第一次见面。\n往后还有 14 亿。'},
  first_relation:{ic:'💞',title:'宗门缘分',sub:'弟子之间出现关系',body:'从此，一人的修行，变成了众人的道。'},
  first_story:{ic:'📖',title:'弟子的故事',sub:'弟子到了某个境界',body:'每个弟子，都有自己要走的路。\n你只是引路人。'},
  first_defect:{ic:'🚨',title:'弟子叛逃',sub:'弟子忠诚跌破底线',body:'他走了，什么也没带走。\n忠诚，是要用真心换的。'}
};
function tryShowRite(id,onDone){
  if(s.ritesSeen[id])return false;
  const c=RITE_CONTENT[id];if(!c)return false;
  s.ritesSeen[id]=true;
  ModalQueue.push((next)=>{setTimeout(()=>{
    let html='<div class="bk-icon" style="font-size:44px">'+c.ic+'</div>';
    html+='<div class="modal-title" style="font-size:calc(22px * var(--fs-scale));letter-spacing:8px;padding-left:8px">'+c.title+'</div>';
    html+='<div class="modal-sub">'+c.sub+'</div>';
    html+='<div class="report-body" style="text-align:center;padding:14px 8px;font-size:calc(14.5px * var(--fs-scale));line-height:2.1;white-space:pre-line">'+c.body+'</div>';
    html+='<button class="btn gold" style="width:100%;padding:15px;margin-top:8px" id="riteOk">继 续</button>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});AudioSys.success();
    $('riteOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();next();if(onDone)onDone()};
  },300)});
  return true;
}

/* ============ 道具获取统一处理 ============ */
function calcLoveRate(a,b){
  let rate=0.30;
  const pa=getP(a),pb=getP(b);
  if(pa.id==='romantic'||pb.id==='romantic')rate+=0.20;
  if(pa.id==='fated'||pb.id==='fated')rate+=0.10;
  if((a.loyalty||50)>=70&&(b.loyalty||50)>=70)rate+=0.10;
  if((a.loyalty||50)>=90&&(b.loyalty||50)>=90)rate+=0.10;
  return Math.min(0.95,rate);
}
function applyItemReward(itemId){
  if(!s.discipleList.length){
    const v=1000;
    s.stones=s.stones.add(Dec.of(v));
    toast('无弟子 · 奖励转为 +'+fmtCoinVal(Dec.of(v))+' 毛',2600);
    return;
  }
  const top=topDisciple();
  if(itemId==='break_pill'){
    if(top.forceBreak){
      const v=Math.max(1000,Math.floor(discipleStoneRate(top).toNum()*60));
      s.stones=s.stones.add(Dec.of(v));
      toast('已有破障丹待生效 · 转为 +'+fmtCoinVal(Dec.of(v))+' 毛',2800);
    } else {
      top.forceBreak=true;
      showBreakFloat('🧪 破障丹已获得','var(--gold)');
      toast('🧪 破障丹已获得 · 首席下次突破 +50%',2800);
    }
  } else if(itemId==='talent_pill'){
    if(s.nextTalent){
      const v=Math.max(10000,Math.floor(discipleStoneRate(top).toNum()*300));
      s.stones=s.stones.add(Dec.of(v));
      toast('已有招贤令待生效 · 转为 +'+fmtCoinVal(Dec.of(v))+' 毛',2800);
    } else {
      s.nextTalent=true;
      showBreakFloat('📜 招贤令已获得','var(--gold)');
      toast('📜 招贤令已获得 · 下个弟子必为天才',2800);
    }
  } else if(itemId==='love_knot'){
    let bestPair=null,bestRate=-1;
    for(let i=0;i<s.discipleList.length;i++){
      for(let j=i+1;j<s.discipleList.length;j++){
        const a=s.discipleList[i],b=s.discipleList[j];
        if((a.relationships||[]).some(r=>r.type==='lover'))continue;
        if((b.relationships||[]).some(r=>r.type==='lover'))continue;
        const rate=calcLoveRate(a,b);
        if(rate>bestRate){bestRate=rate;bestPair=[a,b]}
      }
    }
    if(!bestPair){
      const v=5000;
      s.stones=s.stones.add(Dec.of(v));
      toast('暂无可撮合的一对 · 转为 +'+fmtCoinVal(Dec.of(v))+' 毛',2600);
      return;
    }
    const success=Math.random()<bestRate;
    const[a,b]=bestPair;
    if(success){
      addRelationship(a,b,'lover');
      addChronicle('story','💕 <span class="hl">'+a.name+'</span> 与 <span class="hl">'+b.name+'</span> 结为道侣');
      AudioSys.success();flash('gold');
      ModalQueue.push((next)=>{
        let html='<div class="modal-title green">道 侣 天 成</div><div class="modal-sub">同心结已生效</div>';
        html+='<div class="report-body" style="text-align:center;padding:14px 4px;line-height:2">';
        html+=getP(a).ic+' <span class="hl">'+a.name+'</span> 💕 <span class="hl">'+b.name+'</span> '+getP(b).ic;
        html+='<br><br>两人从此相伴修行，宗门多了一对道侣。';
        html+='</div><button class="btn gold" style="width:100%;padding:15px" id="loveOk">收 到</button>';
        html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
        showModal(html,{noClose:true});
        $('loveOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();next()};
      });
    } else {
      a.loyalty=Math.max(0,(a.loyalty||50)-10);
      b.loyalty=Math.max(0,(b.loyalty||50)-10);
      addChronicle('story','💔 <span class="hl">'+a.name+'</span> 与 <span class="hl">'+b.name+'</span> 有缘无分');
      AudioSys.fail();
      ModalQueue.push((next)=>{
        let html='<div class="modal-title red">有 缘 无 分</div><div class="modal-sub">同心结已使用</div>';
        html+='<div class="report-body" style="text-align:center;padding:14px 4px;line-height:2">';
        html+=getP(a).ic+' <span style="color:var(--red)">'+a.name+'</span> 💔 <span style="color:var(--red)">'+b.name+'</span> '+getP(b).ic;
        html+='<br><br>两人最终没能走到一起。双方忠诚度 -10。';
        html+='</div><button class="btn gold" style="width:100%;padding:15px" id="loveFailOk">收 到</button>';
        html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
        showModal(html,{noClose:true});
        $('loveFailOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();next()};
      });
    }
  } else if(itemId==='rebirth_pill'){
    const d=pick(s.discipleList);
    const g=['rootBone','comprehension','luck'][Math.floor(Math.random()*3)];
    d.rootBone=Math.floor(randRange(40,100));
    d.comprehension=Math.floor(randRange(40,100));
    d.luck=Math.floor(randRange(40,100));
    d[g]=Math.floor(randRange(75,100));
    addChronicle('item','💊 洗髓丹作用于 <span class="hl">'+d.name+'</span> · 根骨/悟性/福缘重掷');
    toast('💊 洗髓丹已作用于 '+d.name,2800);
    showBreakFloat('💊 '+d.name+' 洗髓','var(--purple)');
  } else if(itemId==='long_life_pill'){
    const d=pick(s.discipleList);
    d.age=Math.max(0,d.age-50);
    addChronicle('item','🌿 延寿丹作用于 <span class="hl">'+d.name+'</span> · 寿元 +50 年');
    toast('🌿 延寿丹已作用于 '+d.name+' · +50 年寿元',2800);
    showBreakFloat('🌿 '+d.name+' +50 年','var(--green)');
  }
}

/* ============ 成就 ============ */
let achCooldown=0,achQueue=[],achShowing=false;
function checkAchievements(){
  const now=Date.now();if(now-achCooldown<1500)return;achCooldown=now;
  for(const a of ACHIEVEMENTS){
    if(s.achievements[a.id])continue;
    let hit=false;try{hit=a.check(s)}catch(e){hit=false}
    if(hit){s.achievements[a.id]=now;achQueue.push(a);addChronicle('milestone','🏆 成就解锁：'+a.n);save()}
  }
  processAchQueue();
}
function processAchQueue(){
  if(achQueue.length===0)return;
  achShowing=false; 
  const a=achQueue.shift();
  
  let rewardText='';
  if(a.reward){
    if(a.reward.stone){s.stones=s.stones.add(Dec.of(a.reward.stone));rewardText+='+'+fmtCoin(Dec.of(a.reward.stone))+' 毛 '}
    if(a.reward.item){
      const it=SHOP_ITEMS.find(x=>x.id===a.reward.item);
      if(it){ rewardText+='获得「'+it.n+'」 '; setTimeout(()=>applyItemReward(a.reward.item),600); }
    }
    if(a.title&&!s.masterTitle){s.masterTitle=a.title;rewardText+='称号「'+a.title+'」'}
  }
  
  showTipBanner(a.ic, '成就解锁：'+a.n+(rewardText?(' · '+rewardText):''));
  if(a.challenge){AudioSys.achUnlock();flash('purple')}else{AudioSys.success();flash('gold')}
  
  setTimeout(processAchQueue, 800);
}
function showAchUnlock(a,onDone){
  const isC=!!a.challenge;
  let rewardText='';
  if(a.reward){
    if(a.reward.stone){s.stones=s.stones.add(Dec.of(a.reward.stone));rewardText+='+'+fmtCoin(Dec.of(a.reward.stone))+' 毛 '}
    if(a.reward.item){
      const it=SHOP_ITEMS.find(x=>x.id===a.reward.item);
      if(it){
        rewardText+='获得「'+it.n+'」 ';
        setTimeout(()=>applyItemReward(a.reward.item),600);
      }
    }
    if(a.title&&!s.masterTitle){s.masterTitle=a.title;rewardText+='称号「'+a.title+'」'}
  }
  let extra='';
  if(a.id==='first_ending')extra='<div class="report-body" style="text-align:center;padding:10px 4px;font-size:calc(13px * var(--fs-scale));line-height:2;color:var(--dim);font-style:italic">你达成了 14 亿毛。<br>我也是。<br>我做这个游戏的时候，<br>从没想过真能做完。</div>';
  el.achUnlockCard.innerHTML='<div class="ach-unlock-tag">'+(isC?'挑 战 成 就':'成 就 解 锁')+'</div><div class="ach-unlock-icon">'+a.ic+'</div><div class="ach-unlock-name">'+a.n+'</div><div class="ach-unlock-desc">'+a.d+'</div>'+(rewardText?'<div class="ach-unlock-reward">🎁 '+rewardText+'</div>':'')+extra+'<button class="ach-unlock-btn" id="achOk">收 下</button>';
  el.achUnlock.classList.add('show');
  if(isC){AudioSys.achUnlock();flash('purple');vibrate([60,30,60,30,120])}else{AudioSys.success();flash('gold');vibrate([40])}
  $('achOk').onclick=(e)=>{
    e.stopPropagation();
    AudioSys.click();
    el.achUnlock.classList.remove('show');
    if(onDone)setTimeout(onDone,250);
  };
}


/* ============ 个人剧情 ============ */
function checkStoryArcs(){
  if(!s.created||s.discipleList.length===0)return;
  for(const d of s.discipleList){
    if(!d.storyArcs||!Array.isArray(d.storyArcs))continue;
    for(let i=0;i<d.storyArcs.length;i++){
      const arc=d.storyArcs[i];
      if(arc.done)continue;
      const stage=arc.stage||1;
      if(d.level>=arc.lv){
        let prevDone=true;
        for(let j=0;j<i;j++){if(!d.storyArcs[j].done){prevDone=false;break}}
        if(!prevDone)continue;
        arc.done=true;arc.doneAt=Date.now();
        queueStoryArc(d,arc);
        if(!s.ritesSeen.first_story)tryShowRite('first_story');
        break;
      }
    }
  }
}
let storyQueue=[],storyShowing=false;
function queueStoryArc(d,arc){storyQueue.push({d,arc});processStoryQueue()}
function processStoryQueue(){
  if(storyShowing||storyQueue.length===0)return;
  storyShowing=true;
  const{d,arc}=storyQueue.shift();
  ModalQueue.push((next)=>{
    const stage=arc.stage||1;
    let html='<div class="modal-title realm" style="font-size:calc(16px * var(--fs-scale));letter-spacing:4px">'+(stage>1?'个人剧情 · 第'+stage+'段':'个人剧情')+'</div>';
    html+='<div class="report-from"><div class="report-avatar">'+getP(d).ic+'</div><div class="report-meta"><div class="rm-name">'+d.name+'</div><div class="rm-title">'+realmOf(d.level).name+' · '+getP(d).n+'</div></div></div>';
    html+='<div class="report-body" style="text-align:center;padding:10px 4px;font-size:calc(14px * var(--fs-scale));line-height:2"><span class="hl">「'+arc.title+'」</span><br>'+arc.text+'</div>';
    html+='<div class="gift-choice" style="margin-top:12px">';
    arc.choices.forEach((c,i)=>{
      const cant=c.cost&&c.cost>s.stones.toNum();
      html+='<button class="gift-opt'+(cant?' locked':'')+'" data-sc="'+i+'"><span class="go-icon">▸</span><span class="go-info"><span class="go-name">'+c.n+'</span></span><span class="go-cost">'+(c.cost?('-'+c.cost+' 毛'):'免费')+'</span></button>';
    });
    html+='</div><div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});
    AudioSys.storyArc();
    el.modalCard.querySelectorAll('[data-sc]').forEach(btn=>{
      btn.onclick=(ev)=>{
        ev.stopPropagation();
        if(btn.classList.contains('locked')){toast('毛不足');return}
        const c=arc.choices[+btn.dataset.sc];AudioSys.click();
        if(c.cost)s.stones=s.stones.sub(Dec.of(c.cost));
        const e=c.effect||{};
        if(e.exp)d.exp=d.exp.add(Dec.of(e.exp));
        if(e.stone)s.stones=s.stones.add(Dec.of(e.stone));
        if(e.loyalty)changeLoyalty(d,e.loyalty);
        if(e.allExpMul)s.allExpMul=(s.allExpMul||0)+e.allExpMul;
        addChronicle('story','「'+d.name+' · '+arc.title+'」'+c.text);
        addYearEvent('story',d.name+' · '+arc.title);
        let rewardHtml='';
        if(arc.reward&&stage>=3){
          if(!s.relics)s.relics=[];
          const relic={type:arc.reward.type,value:arc.reward.value,icon:arc.reward.icon,name:arc.reward.name,desc:arc.reward.desc,fromName:d.name,arc:true};
          if(!s.relics.some(r=>r.name===arc.reward.name)){
            s.relics.push(relic);
            rewardHtml='<div class="tip-box good" style="text-align:center;margin-top:12px"><span class="hl">🎁 获得遗物「'+arc.reward.name+'」</span><br>'+arc.reward.desc+'</div>';
            addChronicle('relic','📖 '+d.name+' 的弧光完成 · 获得遗物「'+arc.reward.name+'」');
            addYearEvent('relic',d.name+' 完成弧光');
            AudioSys.milestone();flash('gold');
          }
        }
        let h2='<div class="modal-title">'+(arc.title)+'</div>';
        h2+='<div class="report-body" style="text-align:center;padding:14px 4px;font-size:calc(14px * var(--fs-scale));line-height:2">'+c.text+'</div>';
        h2+=rewardHtml;
        h2+='<button class="btn gold" style="width:100%;padding:15px;margin-top:14px" id="storyOk">收 到</button>';
        h2+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
        showModal(h2,{noClose:true});AudioSys.success();
        $('storyOk').onclick=(e2)=>{e2.stopPropagation();AudioSys.click();hideModal();storyShowing=false;setTimeout(processStoryQueue,200);next()};
      };
    });
  });
}



   


/* ============ Modal ============ */
let _modalScrollSave=0;
function showModal(html,opts){
  opts=opts||{};
  if(opts.preserveScroll){_modalScrollSave=el.modalCard.scrollTop||0}
  el.modalCard.innerHTML=html;
  el.modalCard.scrollTop=opts.preserveScroll?_modalScrollSave:0;
  el.modal.classList.add('show');
  el.modal.dataset.noClose=opts.noClose?'1':'0';
  el.tianxiaBox.classList.add('dimmed');
  if(!opts.noClose){const b=document.createElement('button');b.className='modal-x';b.textContent='✕';b.onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal()};el.modalCard.appendChild(b)}
}
function hideModal(){el.modal.classList.remove('show');el.tianxiaBox.classList.remove('dimmed')}
el.modal.onclick=(e)=>{if(e.target!==el.modal)return;if(el.modal.dataset.noClose==='1')return;AudioSys.click();hideModal()};
function flash(c){el.flash.className='flash';void el.flash.offsetWidth;if(c)el.flash.classList.add(c);el.flash.classList.add('on')}
let toastTimer=null;
function toast(msg,ms){el.toast.textContent=msg;el.toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.toast.classList.remove('show'),ms||2000)}
function resourceBar(){return'<div class="modal-resource"><span class="mr-icon">🪙</span><span class="mr-val">'+fmtCoinVal(s.stones)+'</span><span class="mr-lbl">毛</span></div>'}
function getVoice(d){return getVoiceFn(d)}
function getVoiceFn(d){const pool=(s.dialect==='sc'?VOICES_SC:VOICES)[d.personality]||VOICES[d.personality];return pool}
const VOICES={
  diligent:['弟子会继续苦修，不负掌门期望。','今日又多修了两个时辰。','掌门放心，弟子一刻不敢懈怠。'],
  clever:['掌门，弟子还打听到些别的。','嘿嘿，弟子这次可是赚到了。','弟子最近在坊市混得开。'],
  steady:['一切安好，掌门放心。','弟子会稳扎稳打，不冒进。','宗门一切如常。'],
  fated:['弟子总觉得最近有什么机缘在等着。','掌门，弟子昨晚做了个奇怪的梦。','弟子这两天运气不错。'],
  proud:['弟子定要成为宗门最强！','弟子这次一定不会输。','弟子不想落后于人。'],
  lazy:['掌门，今天能多休息会儿吗……','弟子已经很努力了……真的。','弟子打坐的时候不小心睡着了。'],
  loyal:['掌门放心，弟子一定守好宗门。','弟子永远忠于掌门。','弟子会护着师弟师妹们。'],
  loner:['……弟子先去修炼了。','弟子一个人修炼更自在。','……嗯。'],
  romantic:['掌门，弟子最近认识了一位道友……','弟子心里有个人。','掌门，弟子能请假一天吗？就一天。']
};
const VOICES_SC={
  diligent:['弟子会继续苦修，不给掌门丢脸。','今天又多修了两个时辰。','弟子愚钝，只能靠勤快补。'],
  clever:['掌门，弟子还打听到别个的事。','嘿嘿，弟子这次赚到咯。','弟子最近在坊市混得开。'],
  steady:['一切都好，掌门放心。','弟子稳扎稳打，不冒进。','宗门一切正常。'],
  fated:['弟子总觉得最近有啥子机缘在等到。','掌门，弟子昨晚做了个怪梦。','弟子这两天运气好。'],
  proud:['弟子一定要当宗门最强！','弟子这次不得输。','弟子不想落后于别个。'],
  lazy:['掌门，今天能多歇会儿不……','弟子已经很努力咯……真的。','弟子打坐的时候不小心睡戳咯。'],
  loyal:['掌门放心，弟子一定守好宗门。','弟子永远忠于掌门。','弟子会护到师弟师妹些。'],
  loner:['……弟子先去修炼咯。','弟子一个人修炼更安逸。','……嗯。'],
  romantic:['掌门，弟子最近认到一个道友……','掌门，弟子心头有个人。','掌门，弟子能请一天假不？']
};
const GREETINGS={
  diligent:['掌门，弟子来汇报了。'],clever:['掌门，弟子有情况汇报。'],steady:['掌门，宗门一切正常。'],
  fated:['掌门，弟子最近运气怪好的。'],proud:['掌门，弟子要汇报好消息。'],lazy:['掌门，弟子……勉强汇报一下。'],
  loyal:['掌门，宗门一切安好。'],loner:['……汇报。'],romantic:['掌门，弟子有好多话想说。']
};
const BREAK_TEXTS={small:['顺利突破至','水到渠成，突破','闭关数日，一举突破'],big:['引来天雷，成功突破','大境界突破，宗门灵气为之一振！','终于迈入']};
const FAIL_TEXTS=['突破失败，但积累了感悟。','冲击瓶颈未果，弟子有些沮丧。','差了一点，弟子会再试。'];
const GAIN_TEXTS=['全体弟子共获得修为','这一轮下来，宗门进账修为','弟子们勤修不辍，合计修为'];
const CHATTER_TITLES=['后山偶遇','傍晚闲谈','晨间对话','月下夜话','茶余饭后','演武场旁'];
const CHATTER_LIB=[
  ['diligent','lazy','师兄，你怎么又在打盹？','我这不是打盹，我这是在参悟「无为」之道。'],
  ['diligent','clever','师兄，你又在偷懒。','我这叫劳逸结合，你懂什么。'],
  ['proud','steady','我今天一定能超过你。','嗯，你先超过昨天那个自己吧。'],
  ['proud','loner','喂，你怎么不说话？','……'],
  ['lazy','diligent','掌门要是问起，就说我在闭关。','我会说实话的。'],
  ['clever','loyal','我发现后山有条小路，能绕过去。','掌门说了不让走后门。'],
  ['fated','diligent','我昨晚梦到一颗星星掉下来。','梦是虚幻，修炼才是真的。'],
  ['romantic','loner','你有没有喜欢的人？','……没有。'],
  ['loyal','lazy','该修炼了。','再睡一会儿……就一会儿……'],
  ['diligent','loyal','一起修炼？','好。']
];
function getDailyDesc(){return s.dialect==='sc'?pick(TX.daily.sc):pick(TX.daily.std)}
function getBreakText(isBig){const p=s.dialect==='sc'?tp(isBig?'break_big':'break_small'):(isBig?BREAK_TEXTS.big:BREAK_TEXTS.small);return pick(p)}
function getFailText(){return s.dialect==='sc'?pick(TX.fail.sc):pick(FAIL_TEXTS)}
function getGainText(){return s.dialect==='sc'?pick(TX.gain.sc):pick(GAIN_TEXTS)}
function pickChatter(){
  if(s.discipleList.length<2)return null;
  if(Math.random()>0.4)return null;
  const lib=CHATTER_LIB.filter(c=>s.discipleList.some(d=>d.personality===c[0])&&s.discipleList.some(d=>d.personality===c[1]));
  if(lib.length===0)return null;
  const e=pick(lib);
  const c1=s.discipleList.filter(d=>d.personality===e[0]);
  const c2=s.discipleList.filter(d=>d.personality===e[1]);
  if(c1.length===0||c2.length===0)return null;
  const d1=pick(c1);const c2f=c2.filter(d=>d.id!==d1.id);if(c2f.length===0)return null;
  const d2=pick(c2f);
  s.stats.chatterSeen=(s.stats.chatterSeen||0)+1;
  return{title:pick(CHATTER_TITLES),lines:[{name:d1.name,text:e[2]},{name:d2.name,text:e[3]}]};
}

/* ============ 签到系统 ============ */
function signInBaseStone(){
  if(s.discipleList.length===0)return new Dec(50,0);
  let total=new Dec(0,0);
  for(const d of s.discipleList){
    if(isOnExpedition(d))continue;
    total=total.add(discipleStoneRate(d));
  }
  const hourly=total.mul(3600*4);
  if(hourly.lt(Dec.of(50)))return new Dec(50,0);
  return hourly;
}
function needsSignIn(){
  if(!s.created)return false;
  const today=todayStr();
  return s.signIn.lastDate!==today;
}
function signInPreviewText(r){
  if(r.type==='stone'){
    const base=signInBaseStone();
    const v=base.mul(r.mul);
    return '+'+fmtCoin(v)+' 毛';
  }
  if(r.type==='exp'){
    const top=topDisciple();
    if(!top)return '修为奖励';
    const need=expNeed(top.level);
    const v=need.mul(r.mul);
    return '+'+fmtExp(v)+' 修为';
  }
  if(r.type==='item')return '随机道具';
  return '';
}
function showSignInModal(done){
  const cycleDay=s.signIn.cycleDay||0;
  const totalDays=s.signIn.totalDays||0;
  const canSignIn=needsSignIn();
  let html='<div class="modal-title">每 日 签 到</div>';
  html+='<div class="modal-sub">累计签到 '+totalDays+' 天 · 本轮第 '+(canSignIn?(cycleDay+1):cycleDay)+'/7 天</div>';
  html+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:16px 0">';
  SIGN_IN_REWARDS.forEach((r,i)=>{
    const signed=i<cycleDay;
    const isToday=i===cycleDay&&canSignIn;
    const border=signed?'rgba(125,217,157,.4)':(isToday?'var(--gold)':'rgba(255,255,255,.1)');
    const bg=signed?'rgba(125,217,157,.08)':(isToday?'rgba(230,196,115,.15)':'rgba(255,255,255,.03)');
    const nameColor=signed?'var(--green)':(isToday?'var(--gold)':'var(--dim)');
    const preview=signInPreviewText(r);
    html+='<div style="padding:12px 10px;border-radius:12px;text-align:left;background:'+bg+';border:1px solid '+border+';opacity:'+(signed?.7:1)+'">';
    html+='<div style="display:flex;align-items:center;gap:6px">';
    html+='<span style="font-size:20px;line-height:1">'+r.icon+'</span>';
    html+='<span style="color:var(--dim);font-size:calc(10.5px * var(--fs-scale))">第'+r.day+'天 · '+r.name+'</span>';
    html+='</div>';
    html+='<div style="color:'+nameColor+';font-weight:700;font-size:calc(12px * var(--fs-scale));margin-top:5px">'+(signed?'✓ 已领取':preview)+'</div>';
    html+='</div>';
  });
  html+='</div>';
  html+='<div class="tip-box"><span class="hl">断签不清零</span>：只重置连续天数，累计天数保留。<br><span class="hl">毛奖励</span>随全宗门产出自动缩放，越到后期越多。</div>';  if(canSignIn){
    html+='<button class="btn gold" style="width:100%;padding:15px" id="signInBtn">签 到 领 取</button>';
    html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="signInLater">稍 后</button>';
  }else{
    html+='<div class="tip-box good" style="text-align:center"><span class="hl">今日已签到</span> · 明天再来</div>';
    html+='<button class="btn" style="width:100%;padding:15px" id="signInLater">关 闭</button>';
  }
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  if(canSignIn){
    $('signInBtn').onclick=(e)=>{
      e.stopPropagation();
      doSignIn();
    };
  }
  $('signInLater').onclick=(e)=>{
    e.stopPropagation();
    AudioSys.click();
    hideModal();
    if(done)done();
  };
}
function autoClaimAll(){
  let claimed=[];
  if(needsSignIn()){
    const idx=s.signIn.cycleDay||0;
    const reward=SIGN_IN_REWARDS[idx];
    const top=topDisciple();
    const baseStone=signInBaseStone();
    if(reward.type==='stone'){
      const v=baseStone.mul(reward.mul);
      s.stones=s.stones.add(v);
      claimed.push('签到 +'+fmtCoin(v)+' 毛');
    }else if(reward.type==='exp'){
      if(top){
        const need=expNeed(top.level);
        const v=need.mul(reward.mul);
        top.exp=top.exp.add(v);
        claimed.push('签到 +'+v.format()+' 修为');
      }
    }else if(reward.type==='item'){
      const itemId=pick(reward.pool);
      const it=SHOP_ITEMS.find(x=>x.id===itemId);
      claimed.push('签到 '+(it?it.n:itemId));
      setTimeout(()=>applyItemReward(itemId),400);
    }
    const today=todayStr();
    s.signIn.lastDate=today;
    s.signIn.cycleDay=(s.signIn.cycleDay+1)%7;
    s.signIn.totalDays=(s.signIn.totalDays||0)+1;
    if(!s.stats)s.stats={};
    s.stats.todaySignIn=1;
    addWeekStat('signIns');
    AudioSys.signIn();
    flash('gold');
    addChronicle('signin','📅 一键签到 · '+claimed.join(' · '));
  }
  checkDailyTasks();
  checkWeeklyTasks();
  if(claimed.length===0){
    toast('今日暂无可领取的奖励',2400);
  } else {
    toast('🎁 一键领取 · '+claimed.join(' · '),3200);
  }
  renderUI();
  save();
  checkAchievements();
}
function doSignIn(){
  const idx=s.signIn.cycleDay||0;
  const reward=SIGN_IN_REWARDS[idx];
  const top=topDisciple();
  const baseStone=signInBaseStone();
  let granted=[];
  if(reward.type==='stone'){
    const v=baseStone.mul(reward.mul);
    s.stones=s.stones.add(v);
    granted.push('+'+fmtCoin(v)+' 毛');
  }else if(reward.type==='exp'){
    if(top){
      const need=expNeed(top.level);
      const v=need.mul(reward.mul);
      top.exp=top.exp.add(v);
      granted.push('+'+v.format()+' 修为');
    }
  }else if(reward.type==='item'){
    const itemId=pick(reward.pool);
    const it=SHOP_ITEMS.find(x=>x.id===itemId);
    granted.push(it?it.n:itemId);
    setTimeout(()=>applyItemReward(itemId),700);
  }
  const today=todayStr();
  s.signIn.lastDate=today;
  s.signIn.cycleDay=(s.signIn.cycleDay+1)%7;
  s.signIn.totalDays=(s.signIn.totalDays||0)+1;
  if(!s.stats)s.stats={};
  s.stats.todaySignIn=1;
  addWeekStat('signIns');
  AudioSys.signIn();
  flash('gold');
  toast('📅 签到成功 · '+granted.join(' · '),3000);
  addChronicle('signin','📅 签到成功 · '+granted.join(' · '));
  checkDailyTasks();
  checkWeeklyTasks();
  renderUI();
  save();
  setTimeout(()=>{
    showSignInModal(null);
  },300);
}


/* ============ UI 渲染 ============ */
function renderItemStatus(){
  const row=el.itemStatusRow;
  if(!row)return;
  const top=topDisciple();
  let any=false;
  if(top&&top.forceBreak){
    if(el.isrBreakPill)el.isrBreakPill.style.display='inline-block';
    any=true;
  }else{
    if(el.isrBreakPill)el.isrBreakPill.style.display='none';
  }
  if(s.nextTalent){
    if(el.isrTalentPill)el.isrTalentPill.style.display='inline-block';
    any=true;
  }else{
    if(el.isrTalentPill)el.isrTalentPill.style.display='none';
  }
  row.style.display=any?'flex':'none';
}
function renderUI(){
  el.playerName.textContent=s.masterName||'无名掌门';
  if(el.masterTitle){
    if(s.masterTitle){el.masterTitle.textContent='「'+s.masterTitle+'」';el.masterTitle.style.display='inline-block'}
    else el.masterTitle.style.display='none';
  }
  el.sectName.textContent=s.sectName;
  el.discipleCount.textContent=s.discipleList.length;
  el.eraNum.textContent=s.eras+1;
  if(el.playDays)el.playDays.textContent=playDays();
  if(el.soundQuickBtn){el.soundQuickBtn.classList.remove('off','idle');if(!AudioSys.ctx){el.soundQuickBtn.textContent='🔈';el.soundQuickBtn.classList.add('idle')}else if(AudioSys.enabled){el.soundQuickBtn.textContent='🔊'}else{el.soundQuickBtn.textContent='🔇';el.soundQuickBtn.classList.add('off')}}
  renderStatusRows();
  renderMoonOrderRow();
  const top=topDisciple();
  if(top){
    const r=realmOf(top.level),root=getRoot(top);
    if(r.si!==lastTopSi){applyTheme(r.c);lastTopSi=r.si}
    el.topDiscipleName.textContent=top.name;
    el.topDiscipleRealm.textContent='· '+r.name;
    el.topDiscipleRoot.style.display='inline-block';
    el.topDiscipleRoot.textContent=root.ic+' '+root.n;
    el.topDiscipleRoot.style.background=hexToRgba(root.color,.18);
    el.topDiscipleRoot.style.color=root.color;
    el.topDiscipleChosen.style.display=top.chosen?'inline-block':'none';
    if(el.topDiscipleInjured)el.topDiscipleInjured.style.display=isInjured(top)?'inline-block':'none';
    if(el.topDiscipleAging)el.topDiscipleAging.style.display=agingWarn(top)?'inline-block':'none';
    if(el.topDiscipleAway)el.topDiscipleAway.style.display=isOnExpedition(top)?'inline-block':'none';
      const subInRealm=top.level%9;
      el.barSubLeft.textContent=r.short+' '+CN[subInRealm]+'重';
      
      // 新增：缓存倒计时文本
      const estSec=estimateTimeTo(top,top.level+1);
      const newEstText = '距突破 约 '+fmtDur(estSec);
      if (el.barSubRight.textContent !== newEstText) {
          el.barSubRight.textContent = newEstText;
      }
  }else{
    el.topDiscipleName.textContent='—';el.topDiscipleRealm.textContent='';
    el.topDiscipleRoot.style.display='none';el.topDiscipleChosen.style.display='none';
    if(el.topDiscipleInjured)el.topDiscipleInjured.style.display='none';
    if(el.topDiscipleAging)el.topDiscipleAging.style.display='none';
    if(el.topDiscipleAway)el.topDiscipleAway.style.display='none';
    el.sectExpFill.style.width='0%';el.sectExpText.textContent='0 / 100';
    el.barSubLeft.textContent='—';el.barSubRight.textContent='';
  }
  renderDots();renderLastBreak();renderItemStatus();
    if(el.goalFill&&el.goalText){
    const n=s.stones.toNum();const pct=Math.min(100,n/TARGET_MAO*100);
    el.goalFill.style.width=pct+'%';
    let pctText;
    if(pct<0.0001)pctText='0.000%';
    else if(pct<1)pctText=pct.toFixed(3)+'%';
    else pctText=pct.toFixed(2)+'%';
    // 估算距目标还需多久
    let estText='';
    if(s.discipleList.length>0&&n<TARGET_MAO){
      let totalRate=0;
      for(const d of s.discipleList){
        if(isOnExpedition(d))continue;
        const up=Math.max(0,Math.min(CONFIG.discipleUpkeepMax,d.upkeep||CONFIG.discipleUpkeepDefault));
        totalRate+=discipleStoneRate(d).toNum()*(1-up);
      }
      if(totalRate>0){
        const secs=(TARGET_MAO-n)/totalRate;
        if(isFinite(secs)&&secs>0){
          const days=secs/86400;
          if(days<1)estText=' · 按当前速度约 '+Math.ceil(secs/3600)+' 小时';
          else if(days<365)estText=' · 按当前速度约 '+Math.ceil(days)+' 天';
          else estText=' · 按当前速度约 '+(days/365).toFixed(1)+' 年';
        }
      }
    }
    el.goalText.textContent=pctText+estText;if(el.topGoalText)el.topGoalText.textContent=pctText;
  }
  const canRecruit=s.discipleList.length<maxDisciples();
  el.btnRecruit.disabled=!canRecruit;
  if(!canRecruit){
    el.btnRecruit.textContent='弟子已满';
  } else {
    const cd=recruitCooldownRemain();
    if(cd>0&&s.flags.firstRecruitDone){
      el.btnRecruit.textContent='冷却 '+fmtDur(cd/1000);
    } else {
      el.btnRecruit.textContent='收 徒';
    }
  }
  const unread=s.memos.filter(m=>!m.read).length;
  const autoP=(s.autoBank&&s.autoBank.count>0)?1:0;
  const tb=unread+autoP;
  if(tb>0){el.memoBadge.style.display='block';el.memoBadge.textContent=tb>99?'99+':tb;el.btnReport.classList.add('ready')}
  else{el.memoBadge.style.display='none';el.btnReport.classList.remove('ready')}
  if(s.memos.length>=MAX_MEMOS){el.memoBadge.style.display='block';el.memoBadge.textContent='满';el.memoBadge.classList.add('full')}
  else el.memoBadge.classList.remove('full');
  renderPhaseGoal();updateDailyBadges();updateSignInBadge();updateWeeklyBadge();
}
function renderStatusRows(){
  const hasExpedition=s.expeditions&&s.expeditions.some(e=>!e.done);
  const hasWorldBuff=activeWorldBuffs().length>0;
  const hasDailyBuff=dailyBuffActive();
  el.tianxiangRow.style.display='none';
  el.dailyBuffRow.style.display='none';
  el.expeditionRow.style.display='none';
  el.worldBuffRow.style.display='none';
  if(hasExpedition){el.expeditionRow.style.display='flex';renderExpeditionRow();return}
  if(hasWorldBuff){el.worldBuffRow.style.display='flex';renderWorldBuffRow();return}
  if(hasDailyBuff){el.dailyBuffRow.style.display='flex';renderDailyBuffRow();return}
  el.tianxiangRow.style.display='flex';renderTianxiangRow();
}
function renderTianxiangRow(){
  if(!el.tianxiangRow)return;
  const tx=getTianxiang();
  const remainMs=s.tianxiangUntil-Date.now();
  const remainSec=Math.max(0,Math.floor(remainMs/1000));
  el.tianxiangRow.classList.remove('normal','silent');
  if(tx.id==='normal')el.tianxiangRow.classList.add('normal');
  else if(tx.id==='silent_night')el.tianxiangRow.classList.add('silent');
  el.tianxiangRow.innerHTML='<span class="tx-ic">'+tx.icon+'</span><span class="tx-name">'+tx.name+'</span><span class="tx-desc">'+tx.desc+'</span><span class="tx-time">剩 '+fmtDur(remainSec)+'</span>';
}
function renderDailyBuffRow(){
  if(!el.dailyBuffRow)return;
  if(dailyBuffActive()){
    const remainSec=Math.max(0,Math.floor((s.dailyBuff.until-Date.now())/1000));
    el.dailyBuffRow.style.display='flex';
    if(el.dailyBuffTime)el.dailyBuffTime.textContent='剩 '+fmtDur(remainSec);
  }else{
    el.dailyBuffRow.style.display='none';
  }
}
function renderExpeditionRow(){
  if(!el.expeditionRow)return;
  if(!s.expeditions)return;
  const active=s.expeditions.filter(e=>!e.done);
  if(active.length===0){el.expeditionRow.style.display='none';return}
  const e=active[0];
  const d=s.discipleList.find(x=>x.id===e.discipleId);
  const loc=EXPEDITION_LOCATIONS.find(l=>l.id===e.locationId);
  if(!d||!loc){el.expeditionRow.style.display='none';return}
  const remainSec=Math.max(0,Math.ceil((e.endAt-Date.now())/1000));
  el.expeditionRow.style.display='flex';
  if(el.expName)el.expName.textContent=d.name+' · '+loc.ic+' '+loc.n;
  if(el.expDesc)el.expDesc.textContent=loc.desc;
  if(el.expTime)el.expTime.textContent='剩 '+fmtDur(remainSec);
}
function renderWorldBuffRow(){
  if(!el.worldBuffRow)return;
  const buffs=activeWorldBuffs();
  if(buffs.length===0){el.worldBuffRow.style.display='none';return}
  const b=buffs[0];
  const t=WORLD_EVENT_TYPES.find(x=>x.id===b.type);
  if(!t){el.worldBuffRow.style.display='none';return}
  const remainSec=Math.max(0,Math.floor((b.buffEnd-Date.now())/1000));
  el.worldBuffRow.style.display='flex';
  if(el.worldBuffIcon)el.worldBuffIcon.textContent=t.ic;
  if(el.worldBuffName)el.worldBuffName.textContent='天下 · '+t.n;
  if(el.worldBuffDesc)el.worldBuffDesc.textContent=t.desc;
  if(el.worldBuffTime)el.worldBuffTime.textContent='剩 '+fmtDur(remainSec);
}
function renderMoonOrderRow(){
  if(!el.moonOrderRow)return;
  const m=moonOrder();
  const remain=moonOrderCooldownRemain();
  if(el.moonOrderIcon)el.moonOrderIcon.textContent=m.ic;
  if(el.moonOrderName)el.moonOrderName.textContent=m.n;
  if(el.moonOrderDesc)el.moonOrderDesc.textContent=m.desc;
  const timeEl=el.moonOrderRow.querySelector('.tx-time');
  if(timeEl)timeEl.textContent=remain>0?('冷却 '+fmtDur(remain/1000)):'点击切换';
}
let _lastDotsSig='';
function renderDots(){
  if(!el.dotsBox)return;
  const max=maxDisciples();
  const list=s.discipleList.slice().sort((a,b)=>b.level-a.level);
  const chief=topDisciple();
  // 签名：只要有变化才重绘
  const sig=list.map(d=>d.id+'|'+d.level+'|'+Math.floor((d.loyalty||0))+'|'+(isInjured(d)?1:0)+'|'+(isOnExpedition(d)?1:0)+'|'+Math.floor(expProgress(d)*20)).join(',')+'#'+max+'#'+(chief?chief.id:'');
  if(sig===_lastDotsSig)return;
  _lastDotsSig=sig;
  let html='';
  for(let i=0;i<max;i++){
    const d=list[i];
    if(!d)html+='<div class="dot empty">空</div>';
    else{
      const p=getP(d);const prog=expProgress(d);const injured=isInjured(d);const aging=agingWarn(d);
      const unhappy=(d.loyalty||50)<30;
      const away=isOnExpedition(d);
      let cls='dot';
      if(d.chosen)cls+=' chosen';
      if(injured)cls+=' injured';
      if(aging)cls+=' aging';
      if(unhappy)cls+=' loyalty-low';
      if(prog>=1&&!away)cls+=' break-ready';
      if(chief&&chief.id===d.id)cls+=' chief';
      if(away)cls+=' away';
      html+='<div class="'+cls+'" data-did="'+d.id+'" title="'+d.name+'">'+p.ic+'</div>';
    }
  }
  for(let i=max;i<6;i++)html+='<div class="dot empty" style="opacity:.3"></div>';
  el.dotsBox.innerHTML=html;
  const nxt=nextDiscipleThreshold();
  let countText=s.discipleList.length+' / '+max;
  if(nxt){countText+=' <span class="hl">· 还需 '+nxt.remain+' 次突破</span>'}
  el.dotsCount.innerHTML=countText;
  el.dotsBox.querySelectorAll('[data-did]').forEach(dot=>{
    let longPressTimer=null;
    const did=dot.dataset.did;
    const start=()=>{dot._lp=false;longPressTimer=setTimeout(()=>{dot._lp=true;AudioSys.click();openDisciples()},600)};
    const cancel=()=>clearTimeout(longPressTimer);
    dot.addEventListener('touchstart',start);
    dot.addEventListener('touchend',cancel);
    dot.addEventListener('touchcancel',cancel);
    dot.addEventListener('mousedown',start);
    dot.addEventListener('mouseup',cancel);
    dot.addEventListener('mouseleave',cancel);
    dot.onclick=(e)=>{
      e.stopPropagation();
      if(dot._lp)return;
      const d=s.discipleList.find(x=>x.id===did);if(!d)return;
      handleDotClick(did);
      setTimeout(()=>{if(!dot._lp)openDiscipleDetail(d)},180);
    };
  });
}
function renderLastBreak(){
  if(!el.lastBreakRow)return;
  if(!s.lastBreak){el.lastBreakRow.style.display='none';return}
  el.lastBreakRow.style.display='flex';
  el.lastBreakName.textContent=s.lastBreak.name;
  el.lastBreakRealm.textContent=s.lastBreak.realm;
  el.lastBreakTime.textContent=fmtRelative(s.lastBreak.time);
  if(Date.now()-s.lastBreak.time>600000)el.lastBreakRow.style.display='none';
}
const PHASE_GOALS=[
  {text:'首席突破至 <span class="hl">筑基</span>',target:18},
  {text:'首席突破至 <span class="hl">金丹</span>',target:27},
  {text:'首席突破至 <span class="hl">元婴</span>',target:36},
  {text:'首席突破至 <span class="hl">化神</span>',target:45},
  {text:'首席突破至 <span class="hl">炼虚</span>',target:54},
  {text:'首席突破至 <span class="hl">合体</span>',target:63},
  {text:'首席突破至 <span class="hl">大乘</span>',target:72}
];
function renderPhaseGoal(){
  if(s.discipleList.length===0){el.phaseGoal.style.display='none';return}
  const top=topDisciple();if(!top){el.phaseGoal.style.display='none';return}
  for(const g of PHASE_GOALS){
    if(top.level<g.target){
      el.phaseGoal.style.display='flex';      if (el.phaseGoalText.innerHTML !== g.text) el.phaseGoalText.innerHTML = g.text;
      el.phaseGoalProgress.textContent=top.level+' / '+g.target+' 级';
      const est=estimateTimeTo(top,g.target);
      el.phaseGoalTime.textContent='· 约 '+fmtDur(est);
      return;
    }
  }
  el.phaseGoal.style.display='flex';el.phaseGoalText.innerHTML='继续修行，向 <span class="hl">仙人</span> 迈进';
  el.phaseGoalProgress.textContent='Lv.'+top.level;el.phaseGoalTime.textContent='';
}
function spawnParticles(){
  const c=el.particles;if(!c)return;
  c.innerHTML='';
  const n=Math.min(20,8+s.discipleList.length*2);
  for(let i=0;i<n;i++){
    const p=document.createElement('div');p.className='pt';
    p.style.left=(20+Math.random()*60)+'%';p.style.bottom=(10+Math.random()*40)+'%';
    p.style.animationDuration=(6+Math.random()*8)+'s';p.style.animationDelay=(Math.random()*6)+'s';
    p.style.opacity=0.3+Math.random()*0.5;c.appendChild(p);
  }
  spawnStars();   // ← 加这一行，两个一起生成
}
function spawnStars(){
  const c=document.getElementById('stars');
  if(!c)return;
  c.innerHTML='';
  const n=32;
  for(let i=0;i<n;i++){
    const s=document.createElement('div');
    s.className='star';
    s.style.left=(Math.random()*100)+'%';
    s.style.top=(Math.random()*55)+'%';
    s.style.animationDuration=(2+Math.random()*4)+'s';
    s.style.animationDelay=(Math.random()*6)+'s';
    const sz=(1+Math.random()*2)+'px';
    s.style.width=sz;s.style.height=sz;
    c.appendChild(s);
  }
}

/* ============ 今日修行 ============ */
function ensureDailyTasks(){
  const today=todayStr();
  if(!s.daily||s.daily.date!==today||!Array.isArray(s.daily.tasks)||s.daily.tasks.length===0){
    const pool=shuffle(DAILY_TASK_POOL).slice(0,3);
    s.daily={date:today,tasks:pool.map(t=>({id:t.id,done:false,progress:0})),allDoneTriggered:false};
    if(!s.stats)s.stats={};
    s.stats.todayMemosRead=0;s.stats.todayBreaks=0;s.stats.todayEvents=0;
    s.stats.todayEventGood=0;s.stats.todayRecruits=0;s.stats.todayMijing=0;
  }
  if(typeof s.daily.allDoneTriggered!=='boolean')s.daily.allDoneTriggered=false;
}
function dailyProgress(taskId){
  const def=DAILY_TASK_POOL.find(x=>x.id===taskId);
  if(!def)return 0;
  if(def.special==='signIn')return(s.signIn&&s.signIn.lastDate===todayStr())?1:0;
  if(def.special==='loyal80')return s.discipleList.some(d=>(d.loyalty||0)>=80)?1:0;
  if(!s.stats)return 0;
  switch(def.stat){
    case'todayMemosRead':return s.stats.todayMemosRead||0;
    case'todayBreaks':return s.stats.todayBreaks||0;
    case'todayEvents':return s.stats.todayEvents||0;
    case'todayEventGood':return s.stats.todayEventGood||0;
    case'todayRecruits':return s.stats.todayRecruits||0;
    case'todayMijing':return s.stats.todayMijing||0;
  }
  return 0;
}
function dailyRewardScale(){
  const top=topDisciple();
  if(!top)return 1;
  return 1+Math.floor(top.level/9)*0.8;
}
function checkDailyTasks(){
  ensureDailyTasks();
  if(!s.daily.tasks||s.daily.tasks.length===0)return;
  const allDoneBefore=s.daily.tasks.every(t=>t.done)||s.daily.allDoneTriggered;
  const top=topDisciple();
  const rewardScale=dailyRewardScale();
  for(const t of s.daily.tasks){
    if(t.done)continue;
    const def=DAILY_TASK_POOL.find(x=>x.id===t.id);if(!def)continue;
    const p=dailyProgress(t.id);t.progress=p;
    if(p>=def.target){
      t.done=true;s.stats.dailyDone=(s.stats.dailyDone||0)+1;
      if(def.reward.stone){
        const v=Math.floor(def.reward.stone*rewardScale);
        s.stones=s.stones.add(Dec.of(v));
      }
      if(def.reward.exp&&top){top.exp=top.exp.add(Dec.of(def.reward.exp*rewardScale))}
      toast('✅ 每日任务完成：'+def.n,2600);AudioSys.success();
      addChronicle('daily','完成每日任务「'+def.n+'」');
    }
  }
  const allDone=s.daily.tasks.length>0&&s.daily.tasks.every(t=>t.done);
  if(allDone&&!allDoneBefore&&!s.daily.allDoneTriggered){
    s.daily.allDoneTriggered=true;
    triggerDailyBuff();
  }
}
function triggerDailyBuff(){
  s.dailyBuff={until:Date.now()+5*60*1000};
  save();
  ModalQueue.push((next)=>{
    let html='<div class="bk-icon" style="font-size:44px">🔥</div>';
    html+='<div class="modal-title green" style="letter-spacing:6px">今 日 已 毕</div>';
    html+='<div class="modal-sub">今日修行全部完成</div>';
    html+='<div class="report-body" style="text-align:center;padding:14px 4px;font-size:calc(14px * var(--fs-scale));line-height:2">获得 <span class="hl">5 分钟全宗门修为 ×2</span> 加成</div>';
    html+='<button class="btn gold" style="width:100%;padding:15px" id="dailyDoneOk">收 到</button>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});
    AudioSys.success();flash('gold');vibrate([40,30,60]);
    $('dailyDoneOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();next()};
  });
}
function updateDailyBadges(){
  ensureDailyTasks();
  if(!s.daily.tasks||s.daily.tasks.length===0){if(el.menuDailyBadge)el.menuDailyBadge.style.display='none';if(el.menuBtnDot)el.menuBtnDot.style.display='none';return}
  const undone=s.daily.tasks.filter(t=>!t.done).length;const allDone=undone===0;
  const b=el.menuDailyBadge;
  if(b){if(allDone){b.style.display='inline-block';b.textContent='✓';b.classList.add('done')}else{b.style.display='inline-block';b.textContent=undone;b.classList.remove('done')}}
  const needsSI=needsSignIn();
  const needsW=needsWeekly();
  if(el.menuBtnDot)el.menuBtnDot.style.display=(allDone&&!needsSI&&!needsW)?'none':'block';
}
function updateSignInBadge(){
  if(!el.menuSignInBadge)return;
  if(needsSignIn()){
    el.menuSignInBadge.style.display='inline-block';
    el.menuSignInBadge.textContent='✓';
    el.menuSignInBadge.classList.remove('done');
  }else{
    el.menuSignInBadge.style.display='inline-block';
    el.menuSignInBadge.textContent='✓';
    el.menuSignInBadge.classList.add('done');
  }
}
function needsWeekly(){
  if(!s.created)return false;
  ensureWeekly();
  return s.weekly.tasks.length>0&&!s.weekly.tasks.every(t=>t.done);
}
function updateWeeklyBadge(){
  if(!el.menuWeeklyBadge)return;
  ensureWeekly();
  if(!s.weekly.tasks||s.weekly.tasks.length===0){el.menuWeeklyBadge.style.display='none';return}
  const undone=s.weekly.tasks.filter(t=>!t.done).length;
  const allDone=undone===0;
  if(allDone){el.menuWeeklyBadge.style.display='inline-block';el.menuWeeklyBadge.textContent='✓';el.menuWeeklyBadge.classList.add('done')}
  else{el.menuWeeklyBadge.style.display='inline-block';el.menuWeeklyBadge.textContent=undone;el.menuWeeklyBadge.classList.remove('done')}
}
function openDaily(){
  ensureDailyTasks();
  let html='<div class="modal-title">今 日 修 行</div><div class="modal-sub">凌晨 4 点刷新 · 完成后自动发放</div>';
  if(!s.daily.tasks||s.daily.tasks.length===0){html+='<div class="tip-box" style="text-align:center">任务加载中</div>';showModal(html);return}
  const allDone=s.daily.tasks.every(t=>t.done);
  if(allDone)html+='<div class="tip-box good" style="text-align:center;margin-bottom:14px">✅ <span class="hl">今日任务已全部完成</span><br>修为 ×2 加成已生效</div>';
  const rewardScale=dailyRewardScale();
  s.daily.tasks.forEach(t=>{
    const def=DAILY_TASK_POOL.find(x=>x.id===t.id);if(!def)return;
    const p=Math.min(t.progress||0,def.target);
    let rt='';
    if(def.reward.stone){const v=Math.floor(def.reward.stone*rewardScale);rt='+'+v+' 毛'}
    else if(def.reward.exp)rt='+'+Math.floor(def.reward.exp*rewardScale)+' 修为';
    html+='<div class="daily-item'+(t.done?' done':'')+'"><div class="di-check">'+(t.done?'✓':'')+'</div><div class="di-text">'+def.n+'</div><div class="di-prog">'+p+'/'+def.target+'</div><div class="di-reward">'+rt+'</div></div>';
  });
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
}
function openWeekly(){
  ensureWeekly();
  let html='<div class="modal-title">宗 门 月 旦 评</div><div class="modal-sub">每周一凌晨 4 点刷新 · 完成全部得周限定奖励</div>';
  if(!s.weekly.tasks||s.weekly.tasks.length===0){html+='<div class="tip-box" style="text-align:center">任务加载中</div>';showModal(html);return}
  const allDone=s.weekly.tasks.every(t=>t.done);
  if(allDone)html+='<div class="tip-box good" style="text-align:center;margin-bottom:14px">✅ <span class="hl">本周目标已全部完成</span></div>';
  const rewardScale=weeklyRewardScale();
  s.weekly.tasks.forEach(t=>{
    const def=WEEKLY_TASK_POOL.find(x=>x.id===t.id);if(!def)return;
    const p=Math.min(t.progress||0,def.target);
    let rt=def.reward.stone?('+'+Math.floor(def.reward.stone*rewardScale)+' 毛'):'';
    html+='<div class="daily-item'+(t.done?' done':'')+'"><div class="di-check">'+(t.done?'✓':'')+'</div><div class="di-text">'+def.n+'</div><div class="di-prog">'+p+'/'+def.target+'</div><div class="di-reward">'+rt+'</div></div>';
  });
  html+='<div class="tip-box purple"><span class="hl">周限定奖励</span>：完成全部 3 个任务后，额外获得一件稀有道具（破障丹 / 招贤令 / 同心结 / 洗髓丹 / 延寿丹之一）。</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
}

/* ============ 外派 UI ============ */
function openExpedition(){
  let html='<div class="modal-title">外 派 游 历</div><div class="modal-sub">派弟子出门，回来带资源和见闻</div>';
  if(s.discipleList.length===0){html+='<div class="tip-box" style="text-align:center">还没有弟子</div>';showModal(html);return}
  html+=resourceBar();
  const active=(s.expeditions||[]).filter(e=>!e.done);
  if(active.length>0){
    active.forEach(e=>{
      const d=s.discipleList.find(x=>x.id===e.discipleId);
      const loc=EXPEDITION_LOCATIONS.find(l=>l.id===e.locationId);
      if(!d||!loc)return;
      const prog=getExpeditionProgress(e);
      const remainSec=Math.max(0,Math.ceil((e.endAt-Date.now())/1000));
      html+='<div class="exp-active-card"><div class="ea-head"><div class="ea-avatar">'+getP(d).ic+'</div><div class="ea-info"><div class="ea-name">'+d.name+'</div><div class="ea-loc">'+loc.ic+' '+loc.n+'</div></div><div class="ea-time">剩 '+fmtDur(remainSec)+'</div></div><div class="ea-bar"><div class="ea-bar-fill" style="width:'+(prog*100).toFixed(1)+'%"></div></div></div>';
    });
  }
  const top=topDisciple();
  const busy=active.length>0;
  EXPEDITION_LOCATIONS.forEach(loc=>{
    const locked=!top||top.level<loc.minLevel;
    let cls='exp-location';
    let meta='';
    if(locked){cls+=' locked';meta='需首席 Lv.'+loc.minLevel}
    else{meta=fmtDur(loc.duration/1000)+' · 毛×'+loc.stoneMul+' · 修为×'+loc.expMul}
    html+='<div class="'+cls+'" data-loc="'+loc.id+'"><div class="el-icon">'+loc.ic+'</div><div class="el-info"><div class="el-name">'+loc.n+'</div><div class="el-desc">'+loc.desc+'</div><div class="el-meta">'+meta+'</div></div><div class="el-cost">'+(locked?'🔒':'派首席')+'</div></div>';
  });
  html+='<div class="tip-box"><span class="hl">外派期间</span>弟子不在宗门，不产出修为和毛。<br>回来时一次性结算，并带回一段见闻。<br>同时只能外派 1 名（默认派首席）。</div>';
  if(busy)html+='<div class="tip-box warn" style="text-align:center"><span class="hl">已有弟子在外</span> · 等他回来再派新的</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-loc]').forEach(c=>{
    c.onclick=(e)=>{
      e.stopPropagation();
      if(c.classList.contains('locked')){toast('首席等级不足');return}
      if(busy){toast('已有弟子在外');return}
      if(!top){toast('没有弟子');return}
      const loc=EXPEDITION_LOCATIONS.find(l=>l.id===c.dataset.loc);
      if(!loc)return;
      startExpedition(loc.id,top.id);
      hideModal();
      renderUI();
    };
  });
}

/* ============ 传承树 UI ============ */
function usedLegacyPoints(){
  if(!s.legacyTree)return 0;
  let n=0;
  for(const k in s.legacyTree)n+=s.legacyTree[k]||0;
  return n;
}
function totalLegacyPoints(){return (s.eras||0)*5}
function availableLegacyPoints(){return Math.max(0,totalLegacyPoints()-usedLegacyPoints())}
function openLegacy(){
  const total=totalLegacyPoints();
  const used=usedLegacyPoints();
  const avail=availableLegacyPoints();
  let html='<div class="modal-title">传 承 树</div>';
  html+='<div class="modal-sub">每转生一次获得 5 点传承点 · 可分配 '+avail+' / '+total+'</div>';
  if(total===0){
    html+='<div class="tip-box warn" style="text-align:center"><span class="hl">尚未转生</span><br>首席达到大乘后可在设置中转生<br>每次转生 +5 传承点</div>';
  }
  LEGACY_NODES.forEach(n=>{
    const lv=legacyTreeLv(n.id);
    const maxed=lv>=n.maxLv;
    const canUp=!maxed&&avail>=1;
    let cls='legacy-node';
    if(maxed)cls+=' maxed';
    else if(!canUp)cls+=' locked';
    html+='<div class="'+cls+'" data-node="'+n.id+'"><div class="ln-icon">'+n.ic+'</div><div class="ln-info"><div class="ln-name">'+n.n+'</div><div class="ln-desc">'+n.desc+'</div><div class="ln-level">Lv.'+lv+' / '+n.maxLv+'</div></div><div class="ln-cost">'+(maxed?'MAX':(canUp?'1 点':'—'))+'</div></div>';
  });
  html+='<div class="tip-box purple"><span class="hl">传承</span>跨纪元保留。<br>遗物、称号、成就也跨纪元保留。<br>传承点每纪元重新计算。</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-node]').forEach(c=>{
    c.onclick=(e)=>{
      e.stopPropagation();
      if(c.classList.contains('locked')){toast('传承点不足');return}
      if(c.classList.contains('maxed')){toast('已满级');return}
      const id=c.dataset.node;
      const node=LEGACY_NODES.find(x=>x.id===id);
      if(!node)return;
      const lv=legacyTreeLv(id);
      if(lv>=node.maxLv){toast('已满级');return}
      if(availableLegacyPoints()<1){toast('传承点不足');return}
      if(!s.legacyTree)s.legacyTree={};
      s.legacyTree[id]=(s.legacyTree[id]||0)+1;
      AudioSys.legacyUp();flash('purple');
      toast('✨ '+node.n+' 升级至 Lv.'+(s.legacyTree[id]),2600);
      addChronicle('legacy','♻️ 传承「'+node.n+'」升级至 Lv.'+s.legacyTree[id]);
      if(!s.tipsSeen.firstLegacy)tryShowTip('firstLegacy');
      save();
      openLegacy();
      renderUI();
    };
  });
}

/* ============ 年鉴 UI ============ */
function openYearbook(){
  let html='<div class="modal-title">宗 门 年 鉴</div>';
  html+='<div class="modal-sub">每 30 天生成一份</div>';
  if(!s.yearbooks||s.yearbooks.length===0){
    const elapsed=Date.now()-(s.currentYear?s.currentYear.startAt:Date.now());
    const remainMs=YEAR_DURATION-elapsed;
    const remainDays=Math.max(0,Math.ceil(remainMs/86400000));
    html+='<div class="tip-box" style="text-align:center">还没有年鉴<br>第一份将在 <span class="hl">'+remainDays+' 天</span> 后生成</div>';
    if(s.currentYear){
      const st=s.currentYear.stats||{};
      html+='<div class="settings-group"><div class="settings-group-h">今 年 进 度</div>';
      html+='<div class="row"><span class="row-label">突破</span><span class="row-value">'+(st.breaks||0)+' 次</span></div>';
      html+='<div class="row"><span class="row-label">化道</span><span class="row-value">'+(st.deaths||0)+' 人</span></div>';
      html+='<div class="row"><span class="row-label">收徒</span><span class="row-value">'+(st.recruits||0)+' 人</span></div>';
      html+='<div class="row"><span class="row-label">外派</span><span class="row-value">'+(st.expeditions||0)+' 次</span></div>';
      html+='</div>';
    }
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html);return;
  }
  s.yearbooks.forEach((yb,idx)=>{
    const st=yb.stats||{};
    const days=Math.max(1,Math.round((yb.endAt-yb.startAt)/86400000));
    html+='<div class="yearbook-card" data-yb="'+idx+'"><div class="yb-year">第 '+yb.year+' 年</div><div class="yb-range">'+fmtDateFull(yb.startAt)+' — '+fmtDateFull(yb.endAt)+' · '+days+' 天</div><div class="yb-summary">突破 <span class="hl">'+(st.breaks||0)+'</span> 次 · 化道 <span class="hl">'+(st.deaths||0)+'</span> 人 · 收徒 <span class="hl">'+(st.recruits||0)+'</span> 人</div></div>';
  });
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-yb]').forEach(c=>{
    c.onclick=(e)=>{e.stopPropagation();AudioSys.click();openYearbookDetail(+c.dataset.yb)};
  });
}
function openYearbookDetail(idx){
  const yb=s.yearbooks[idx];
  if(!yb)return;
  const st=yb.stats||{};
  let html='<div class="modal-title">第 '+yb.year+' 年 · 年鉴</div>';
  html+='<div class="modal-sub">'+fmtDateFull(yb.startAt)+' — '+fmtDateFull(yb.endAt)+'</div>';
  html+='<div class="settings-group"><div class="settings-group-h">大 事 记</div>';
  html+='<div class="row"><span class="row-label">突破</span><span class="row-value gold">'+(st.breaks||0)+' 次</span></div>';
  html+='<div class="row"><span class="row-label">化道</span><span class="row-value red">'+(st.deaths||0)+' 人</span></div>';
  html+='<div class="row"><span class="row-label">收徒</span><span class="row-value">'+(st.recruits||0)+' 人</span></div>';
  html+='<div class="row"><span class="row-label">外派</span><span class="row-value">'+(st.expeditions||0)+' 次</span></div>';
  if(st.greatEvents)html+='<div class="row"><span class="row-label">事件大成功</span><span class="row-value green">'+(st.greatEvents||0)+' 次</span></div>';
  if(st.awfulEvents)html+='<div class="row"><span class="row-label">事件大失败</span><span class="row-value red">'+(st.awfulEvents||0)+' 次</span></div>';
  html+='</div>';
  if(yb.events&&yb.events.length>0){
    html+='<div class="settings-group"><div class="settings-group-h">当 年 大 事</div>';
    yb.events.slice(0,20).forEach(ev=>{
      html+='<div class="chronicle-item"><span class="ci-time">'+fmtDay(ev.time)+'</span><span class="ci-text">'+ev.text+'</span></div>';
    });
    html+='</div>';
  } else {
    html+='<div class="tip-box" style="text-align:center">这一年，平安无事</div>';
  }
  html+='<button class="btn" style="width:100%;margin-top:12px;padding:14px" id="ybBack">‹ 返 回 年 鉴 列 表</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('ybBack').onclick=(e)=>{e.stopPropagation();AudioSys.click();openYearbook()};
}

/* ============ 奏章 ============ */
let memoTab='all';
function openMemos(){
  flushAutoBank();
  if(s.memos.length===0){
    let html='<div class="modal-title">奏 章</div><div class="modal-sub">待批 0 份</div><div class="memo-empty"><span class="me-icon">📭</span>暂无待批奏章</div><div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html);return;
  }
  const unread=s.memos.filter(m=>!m.read).length;
  let html='<div class="modal-title">奏 章 堆 积</div>';
  html+='<div class="modal-sub">共 '+s.memos.length+' 份 · 未批 '+unread+' 份'+(s.memos.length>=MAX_MEMOS?' · <span style="color:var(--gold)">已满</span>':'')+'</div>';
  html+='<div class="memo-tabs"><button class="memo-tab'+(memoTab==='all'?' active':'')+'" data-tab="all">全部</button><button class="memo-tab'+(memoTab==='event'?' active':'')+'" data-tab="event">事件</button><button class="memo-tab'+(memoTab==='break'?' active':'')+'" data-tab="break">突破</button></div>';
  html+='<div class="memo-list">';
  let shown=0;
  s.memos.forEach((m,idx)=>{
    if(memoTab==='event'&&!m.event)return;
    if(memoTab==='break'&&m.breaks.length===0)return;
    shown++;
    const isChain=m.event&&m.event.chainId;
    const isWorld=m.event&&m.event.worldChallenge;
    let hasE='';
    if(m.event){
      if(isWorld)hasE=' world-item';
      else if(isChain)hasE=' chain-item';
      else hasE=' event-item';
    }
    const isU=m.read?'':' unread';
    let title='日常奏报';
    if(m.breaks.length>0)title='突破奏报';
    if(m.event)title='急报 · '+m.event.title;
    if(m.chatter&&m.breaks.length===0&&!m.event)title='弟子闲聊';
    if(m.isOffline)title='🔒 闭关总结';
    if(m.isAutoBank)title='📦 副掌门汇总';
    let sc='',st='奏';
    if(m.isAutoBank){sc=' autobank';st='副'}
    else if(m.isOffline){sc=' offline';st='关'}
    else if(m.event){sc=isWorld?' world':(isChain?' chain':' event');st=isWorld?'天':(isChain?'链':'急')}
    else if(m.chatter){sc=' chatter';st='聊'}
    html+='<div class="memo-item'+hasE+isU+'" data-memo="'+idx+'">';
    html+='<div class="memo-seal'+sc+'">'+st+'</div>';
    html+='<div class="memo-info"><div class="memo-title">'+(m.read?'':'<span class="dot"></span>')+title+'</div>';
    html+='<div class="memo-meta">'+fmtClock(m.time)+' · 修为 +'+fmtExp(m.totalExp)+' · 毛 +'+fmtCoin(m.totalStone)+'</div>';
    html+='</div><div class="memo-arrow">›</div></div>';
  });
  if(shown===0)html+='<div class="memo-empty" style="padding:20px"><span class="me-icon">🔍</span>暂无</div>';
  html+='</div>';
  if(memoTab==='all'&&unread>0)html+='<button class="btn gold" style="width:100%;margin-top:12px;padding:14px" id="batchApprove">一 键 批 阅（无事件）</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-tab]').forEach(tab=>{tab.onclick=(e)=>{e.stopPropagation();AudioSys.click();memoTab=tab.dataset.tab;openMemos()}});
  el.modalCard.querySelectorAll('[data-memo]').forEach(item=>{item.onclick=(e)=>{e.stopPropagation();AudioSys.click();openMemoDetail(+item.dataset.memo)}});
  const bb=$('batchApprove');if(bb)bb.onclick=(e)=>{e.stopPropagation();AudioSys.click();batchApprove()};
}
function batchApprove(){
  let count=0,tE=new Dec(0,0),tS=new Dec(0,0),bn=[];
  const toRemove=[];
  for(let i=0;i<s.memos.length;i++){
    const m=s.memos[i];if(m.read||m.event)continue;
    count++;tE=tE.add(m.totalExp);tS=tS.add(m.totalStone);
    m.breaks.forEach(b=>bn.push(b.name));
    s.stats.todayMemosRead=(s.stats.todayMemosRead||0)+1;
    toRemove.push(m);
  }
  if(count===0){toast('没有可一键批阅的奏章');return}
  toRemove.forEach(m=>{const i=s.memos.indexOf(m);if(i>=0)s.memos.splice(i,1)});
  checkDailyTasks();AudioSys.success();
  let html='<div class="modal-title green">一 键 批 阅</div><div class="modal-sub">共批阅 '+count+' 份奏章</div>';
  html+='<div class="report-gain"><div class="rg-item"><div class="rg-val">+'+fmtExp(tE)+'</div><div class="rg-lbl">修为</div></div><div class="rg-item"><div class="rg-val">+'+fmtCoin(tS)+'</div><div class="rg-lbl">毛</div></div><div class="rg-item"><div class="rg-val">'+fmtCoin(s.stones)+'</div><div class="rg-lbl">毛总</div></div></div>';
  if(bn.length>0)html+='<div class="tip-box good" style="text-align:center"><span class="hl">突破</span>：'+bn.slice(0,4).join('、')+(bn.length>4?' 等'+bn.length+'人':'')+'</div>';
  html+='<button class="btn gold" style="width:100%;padding:15px" id="batchOk">收 到</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('batchOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();renderUI();openMemos()};
  renderUI();
}
function openMemoDetail(idx){
  const m=s.memos[idx];if(!m)return;
  if(!m.read)s.stats.todayMemosRead=(s.stats.todayMemosRead||0)+1;
  m.read=true;checkDailyTasks();renderUI();
  const top=topDisciple();
  let title='奏 章';if(m.isOffline)title='闭 关 总 结';if(m.isAutoBank)title='副 掌 门 汇 总';
  let html='<div class="modal-title">'+title+'</div>';
  html+='<div class="modal-sub">'+fmtClock(m.time)+(m.isAutoBank?(' · 共 '+m.autoCount+' 份 · 已扣 '+VICE_CUT*100+'% 抽成'):(' · 间隔 '+fmtDur(m.interval/1000)))+'</div>';
  if(top){const p=getP(top),r=realmOf(top.level),apt=getApt(top),root=getRoot(top),sp=getSpecialty(top);
    html+='<div class="report-from"><div class="report-avatar">'+p.ic+'</div><div class="report-meta"><div class="rm-name">'+top.name+(top.chosen?' ✨':'')+'</div><div class="rm-title">'+r.name+' · '+p.n+' · '+apt.n+'资质 · '+root.ic+root.n+'灵根 · '+sp.ic+sp.n+' · '+top.age+'岁<br><span style="color:var(--dimmer);font-size:calc(11px * var(--fs-scale))">'+p.desc+'</span></div></div></div>';
  }
  let body='';
  if(m.isOffline)body+='<span class="rl">掌门闭关期间，弟子们勤修不辍。</span>';
  else if(m.isAutoBank)body+='<span class="rl">副掌门已将 '+m.autoCount+' 份日常奏章整理成汇总（抽成 '+VICE_CUT*100+'%）。</span>';
  else body+='<span class="rl">'+m.greeting+'</span>';
  if(m.breaks.length===0&&m.fails.length===0)body+='<span class="rl dim">'+(m.daily||'弟子们都在安静修炼。')+'</span>';
  else{
    for(const b of m.breaks){const r=realmOf(b.level);const txt=getBreakText(b.isBig);body+='<span class="rl">⚡ <span class="hl">'+b.name+'</span> '+txt+' <span class="up">'+r.name+'</span>！</span>'}
    for(const f of m.fails)body+='<span class="rl dim">'+f.name+' '+getFailText()+'</span>';
  }
  body+='<span class="rl dim">'+getGainText()+' <span class="up">+'+fmtExp(m.totalExp)+'</span>，毛 <span class="up">+'+fmtCoin(m.totalStone)+'</span>。</span>';
  if(!m.isOffline&&!m.isAutoBank)body+='<span class="rl dim">'+m.voice+'</span>';
  html+='<div class="report-body">'+body+'</div>';
  if(m.chatter){
    html+='<div class="chatter-box"><div class="chatter-line"><span class="cn" style="color:var(--dim)">📖 '+m.chatter.title+'</span></div>';
    m.chatter.lines.forEach(l=>{html+='<div class="chatter-line"><span class="cn">'+l.name+'：</span><span class="ct">'+l.text+'</span></div>'});
    html+='</div>';
  }
  html+='<div class="report-gain"><div class="rg-item"><div class="rg-val">'+fmtExp(m.totalExp)+'</div><div class="rg-lbl">修为</div></div><div class="rg-item"><div class="rg-val">'+fmtCoin(m.totalStone)+'</div><div class="rg-lbl">毛</div></div><div class="rg-item"><div class="rg-val">'+fmtCoin(s.stones)+'</div><div class="rg-lbl">毛总</div></div></div>';
  if(m.event){
    const ev=m.event;const sn=s.stones.toNum();
    const isChain=!!ev.chainId;
    const isWorld=!!ev.worldChallenge;
    html+=resourceBar();
    html+='<div class="event-box'+(ev.tianjie?' tianjie':(isWorld?' world':(isChain?' chain':'')))+'">';
    html+='<div class="event-ask">';
    html+='<span class="hl">▸ '+ev.title+'</span>';
    if(isWorld)html+='<span class="world-tag">🌏 天下</span>';
    else if(isChain)html+='<span class="chain-tag">🔗 事件链 · 第'+ev.chainStep+'段</span>';
    html+='<br>'+ev.ask+'</div>';
    ev.choices.forEach((c,i)=>{
      const cant=c.cost&&c.cost>sn;
      const ch=estimateOutcomeChance(c,topDisciple());
      const successPct=Math.round(ch.success*100);
      const riskPct=Math.round(ch.risk*100);
      let probColor='var(--dim)';
      if(successPct>=65)probColor='var(--green)';
      else if(successPct>=45)probColor='var(--realm)';
      else if(successPct>=30)probColor='var(--orange)';
      else probColor='var(--red)';
      const probLine='<div style="margin-top:6px;font-size:calc(11.5px * var(--fs-scale));color:var(--dim)">成功率约 <span style="color:'+probColor+';font-weight:700">'+successPct+'%</span>'+(riskPct>0?' · 大失败约 '+riskPct+'%':'')+'</div>';
      html+='<button class="choice-btn'+(cant?' locked':'')+'" data-choice="'+i+'"><div class="choice-name"><span>'+c.n+'</span><span class="tag '+(cant?'locked':(isWorld?'world':c.tag))+'">'+(cant?'毛不足':c.tagText)+'</span></div><div class="choice-desc">'+c.desc+'</div>'+probLine+'</button>';
    });
    html+='</div>';
    html+='<div class="report-sign">—— 弟子 '+s.discipleList.map(d=>d.name).join('、')+' 敬上</div>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});
    el.modalCard.querySelectorAll('[data-choice]').forEach(btn=>{
      btn.onclick=(e)=>{
        e.stopPropagation();
        if(btn.classList.contains('locked')){toast('毛不足');return}
        AudioSys.click();
        const c=ev.choices[+btn.dataset.choice];
        const outcome=rollOutcome(c,topDisciple());
        handleMemoChoice(c,outcome,m,idx);
      };
    });
  }else{
    html+='<div class="report-sign">—— 弟子 '+s.discipleList.map(d=>d.name).join('、')+' 敬上</div>';
    html+='<button class="btn" style="width:100%;margin-top:16px;padding:15px" id="backToList">返 回 奏 章</button>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html);
    $('backToList').onclick=(e)=>{e.stopPropagation();AudioSys.click();const i2=s.memos.indexOf(m);if(i2>=0)s.memos.splice(i2,1);renderUI();openMemos()};
  }
}
function handleMemoChoice(choice,outcome,memo,idx){
  applyChoiceOutcome(choice,outcome);
  s.flags.handledEvent=true;
  s.stats.todayEvents=(s.stats.todayEvents||0)+1;
  addWeekStat('events');
  if(outcome==='great')s.flags.eventGreat=true;
  if(outcome==='good'||outcome==='great')s.stats.todayEventGood=(s.stats.todayEventGood||0)+1;
  if(outcome==='awful')s.flags.eventAwful=true;
  if(outcome==='great')addYearStat('greatEvents');
  if(outcome==='awful')addYearStat('awfulEvents');
  addYearEvent('event',memo.event.title+' · '+({great:'大成功',good:'成功',ok:'平平',bad:'失利',awful:'大失败'})[outcome]);
  if(memo.event&&memo.event.chainId){
    if(!s.eventChain)s.eventChain={};
    const cur=s.eventChain[memo.event.chainId]||0;
    if(memo.event.chainStep>cur){
      s.eventChain[memo.event.chainId]=memo.event.chainStep;
      if(!s.tipsSeen.firstChain)tryShowTip('firstChain');
    }
  }
  tryShowRite('first_event');
  const d=topDisciple();
  if(d){
    if(outcome==='great')changeLoyalty(d,3);
    else if(outcome==='good')changeLoyalty(d,1);
    else if(outcome==='bad')changeLoyalty(d,-1);
    else if(outcome==='awful')changeLoyalty(d,-3);
  }
  if(memo.event.tianjie&&(outcome==='great'||outcome==='good'))s.flags.survivedTianjie=true;
  if(memo.event.id==='disciple_leave'&&(outcome==='bad'||outcome==='awful')){
    if(s.discipleList.length>1){
      const top=topDisciple();
      const cands=s.discipleList.filter(x=>x.id!==top.id);
      if(cands.length>0){
        const leave=pick(cands);
        if(s.expeditions)s.expeditions=s.expeditions.filter(e=>e.discipleId!==leave.id);
        s.discipleList=s.discipleList.filter(x=>x.id!==leave.id);
        s.discipleList.forEach(x=>{if(x.relationships)x.relationships=x.relationships.filter(r=>r.targetId!==leave.id)});
        s.flags.lostDisciple=true;
        addChronicle('leave','🍂 弟子 <span class="hl">'+leave.name+'</span> 离开了宗门');
      }
    }
  }
  addChronicle('event','事件「'+memo.event.title+'」 · 结果：'+({great:'大成功',good:'成功',ok:'平平',bad:'失利',awful:'大失败'})[outcome]);
  const o=choice.outcomes[outcome];
  checkDailyTasks();checkWeeklyTasks();
    // 直接在当前弹窗内展示结果，不再弹新窗
  showMemoOutcomeInline(o, outcome, memo);
}

function showMemoOutcomeInline(o, outcome, memo){
  const labels={great:'大成功',good:'成功',ok:'平平',bad:'失利',awful:'大失败'};
  const cls=outcome==='great'||outcome==='good'?'green':outcome==='bad'||outcome==='awful'?'red':'realm';
  if(outcome==='great'||outcome==='good')AudioSys.success();
  else if(outcome==='bad'||outcome==='awful')AudioSys.fail();
  else AudioSys.click();
  
  let html='<div class="modal-title '+cls+'">'+labels[outcome]+'</div><div class="modal-sub">'+memo.event.title+'</div>';
  html+='<div class="report-body" style="text-align:center;padding:12px 4px"><span class="rl">'+o.text+'</span></div>';
  html+='<div class="report-gain">';
  if(o.exp!==undefined)html+='<div class="rg-item"><div class="rg-val" style="color:'+(o.exp>=0?'var(--green)':'var(--red)')+'">'+(o.exp>=0?'+':'')+Dec.of(o.exp).format()+'</div><div class="rg-lbl">修为</div></div>';
  if(o.stone!==undefined)html+='<div class="rg-item"><div class="rg-val" style="color:'+(o.stone>=0?'var(--green)':'var(--red)')+'">'+(o.stone>=0?'+':'')+fmtCoin(Dec.of(o.stone))+'</div><div class="rg-lbl">毛</div></div>';
  if(o.loyalty!==undefined)html+='<div class="rg-item"><div class="rg-val" style="color:'+(o.loyalty>=0?'var(--green)':'var(--red)')+'">'+(o.loyalty>=0?'+':'')+o.loyalty+'</div><div class="rg-lbl">忠诚</div></div>';
  html+='</div>';
  
  let pz='';
  if(outcome==='great'||outcome==='good')pz=pick(tp('pz_good'));
  else if(outcome==='bad'||outcome==='awful')pz=pick(tp('pz_bad'));
  else pz=pick(tp('pz_ok'));
  html+='<div class="pz-box"><div class="pz-lbl">📝 掌 门 批 注</div><div class="pz-text">「'+pz+'」</div></div>';
  html+='<div class="tip-box" style="text-align:center;font-size:calc(12px * var(--fs-scale))" id="autoCloseTip">1.5 秒后自动返回奏章列表…</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  
  showModal(html, {noClose:true});
  
  const i=s.memos.indexOf(memo);if(i>=0)s.memos.splice(i,1);
  checkAchievements();renderUI();
  
  setTimeout(()=>{
    hideModal();
    openMemos();
  }, 1500);
}

function showMemoOutcome(o,outcome,memo,idx){
  const labels={great:'大成功',good:'成功',ok:'平平',bad:'失利',awful:'大失败'};
  const cls=outcome==='great'||outcome==='good'?'green':outcome==='bad'||outcome==='awful'?'red':'realm';
  if(outcome==='great'||outcome==='good')AudioSys.success();
  else if(outcome==='bad'||outcome==='awful')AudioSys.fail();
  else AudioSys.click();
  let html='<div class="modal-title '+cls+'">'+labels[outcome]+'</div><div class="modal-sub">'+memo.event.title+'</div>';
  html+='<div class="report-body" style="text-align:center;padding:12px 4px"><span class="rl">'+o.text+'</span></div>';
  html+='<div class="report-gain">';
  if(o.exp!==undefined)html+='<div class="rg-item"><div class="rg-val" style="color:'+(o.exp>=0?'var(--green)':'var(--red)')+'">'+(o.exp>=0?'+':'')+Dec.of(o.exp).format()+'</div><div class="rg-lbl">修为</div></div>';
  if(o.stone!==undefined)html+='<div class="rg-item"><div class="rg-val" style="color:'+(o.stone>=0?'var(--green)':'var(--red)')+'">'+(o.stone>=0?'+':'')+fmtCoin(Dec.of(o.stone))+'</div><div class="rg-lbl">毛</div></div>';
  if(o.loyalty!==undefined)html+='<div class="rg-item"><div class="rg-val" style="color:'+(o.loyalty>=0?'var(--green)':'var(--red)')+'">'+(o.loyalty>=0?'+':'')+o.loyalty+'</div><div class="rg-lbl">忠诚</div></div>';
  html+='</div>';
  if(memo.event&&memo.event.chainId){
    html+='<div class="tip-box purple" style="text-align:center;font-size:calc(11.5px * var(--fs-scale))">🔗 你做了一个选择 · 也许以后还会再遇到相关的事</div>';
  }
  if(memo.event&&memo.event.worldChallenge){
    html+='<div class="tip-box" style="text-align:center;font-size:calc(11.5px * var(--fs-scale))">🌏 天下之事 · 传开之后又是一段故事</div>';
  }
  let pz='';
  if(outcome==='great'||outcome==='good')pz=pick(tp('pz_good'));
  else if(outcome==='bad'||outcome==='awful')pz=pick(tp('pz_bad'));
  else pz=pick(tp('pz_ok'));
  html+='<div class="pz-box"><div class="pz-lbl">📝 掌 门 批 注</div><div class="pz-text">「'+pz+'」</div></div>';
  html+='<button class="btn" style="width:100%;margin-top:16px;padding:15px" id="afterOutcome">收 到</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html,{noClose:true});
  $('afterOutcome').onclick=(e)=>{e.stopPropagation();AudioSys.click();const i=s.memos.indexOf(memo);if(i>=0)s.memos.splice(i,1);checkAchievements();renderUI();openMemos()};
}

/* ============ 收徒 ============ */
function recruitCooldownRemain(){
  if(!s.lastRecruitAt)return 0;
  const passed=Date.now()-s.lastRecruitAt;
  return Math.max(0,CONFIG.discipleRecruitCooldown-passed);
}
const GIFT_OPTIONS=[
  {id:'none',icon:'✋',name:'分文不取',desc:'忠诚 30 · 弟子留 30% 毛',loyalty:30,upkeep:0.30},
  {id:'half',icon:'🤝',name:'回赠一半',desc:'忠诚 55 · 弟子留 15% 毛',loyalty:55,upkeep:0.15},
  {id:'equal',icon:'💛',name:'等额回赠',desc:'忠诚 75 · 弟子留 5% 毛',loyalty:75,upkeep:0.05},
  {id:'double',icon:'💖',name:'双倍回赠',desc:'忠诚 95 · 全数上缴 · 骄纵 · 扣总毛一半',loyalty:95,upkeep:0.0,pampered:true}
];
function getGiftValue(opt,base){
  if(opt.id==='none')return 0;
  if(opt.id==='half')return Math.max(1,Math.floor(base*0.5));
  if(opt.id==='equal')return base;
  if(opt.id==='double'){
    const pct=Math.floor(s.stones.toNum()*0.5);
    const min=Math.floor(base*5);
    return Math.max(pct,min);
  }
  return 0;
}
function getGiftExp(opt,base){
  if(opt.id==='none')return 0;
  if(opt.id==='half')return base*3;
  if(opt.id==='equal')return base*8;
  if(opt.id==='double')return base*20;
  return 0;
}
function openRecruit(isFirst){
  if(!isFirst&&s.discipleList.length>=maxDisciples()){
    const nxt=nextDiscipleThreshold();
    if(nxt)toast('弟子已满 · 还需 '+nxt.remain+' 次突破解锁下一位',2800);
    else toast('弟子已满',2800);
    return;
  }
  if(!isFirst){
    const remain=recruitCooldownRemain();
    if(remain>0){
      toast('刚收过弟子 · 还需等 '+fmtDur(remain/1000),2800);
      return;
    }
  }
  const hadTalentNext=!!s.nextTalent;
  const d=generateDisciple(false,isFirst);
  const p=getP(d),apt=getApt(d),root=getRoot(d);
  let selectedOpt='half';
  function renderContent(){
    const opt=GIFT_OPTIONS.find(o=>o.id===selectedOpt);
    const gift=Math.round(getGiftValue(opt,d.giftGiven));
    const iexp=Math.round(getGiftExp(opt,d.giftGiven));
    const canPay=s.stones.gte(Dec.of(gift));
    const net=d.giftGiven-gift;
    const canReroll=isFirst&&!s.flags.firstRecruitRerolled;
    let html='<div class="modal-title">'+(isFirst?'开 山 弟 子':'收 徒')+'</div>';
    html+='<div class="modal-sub">'+(d.chosen?'✨ 一位天命之子前来拜师 ✨':(isFirst?'一毛拜师':'一位年轻人前来拜师'))+'</div>';
    html+=resourceBar();
    if(hadTalentNext)html+='<div class="tip-box good" style="text-align:center"><span class="hl">📜 招贤令已生效</span> · 本弟子资质锁定为天才</div>';
    html+='<div class="betroth-box"><div class="bb-title">🪙 拜 师 礼 🪙</div><div class="bb-gift" id="bbGiftVal">+'+d.giftGiven+' 毛</div><div class="bb-sub">'+(isFirst?'弟子只有一毛，一片诚心':t('betroth_gift_sub'))+'</div></div>';
        const sp=getSpecialty(d);
    html+='<div class="report-from"><div class="report-avatar">'+p.ic+'</div><div class="report-meta"><div class="rm-name">'+d.name+(d.chosen?' ✨':'')+'</div><div class="rm-title">'+p.n+' · '+apt.n+'资质 · '+root.ic+root.n+'灵根 · '+sp.ic+sp.n+' · '+d.age+'岁<br><span style="color:var(--gold);font-size:calc(11.5px * var(--fs-scale))">'+p.ic+' '+p.n+'：'+p.desc+'</span></div></div></div>';
    if(d.chosen)html+='<div class="tip-box purple" style="text-align:center"><span class="hl">✨ 天命之子</span><br>所有属性 +50%</div>';
    html+='<div class="row"><span class="row-label">口头禅</span><span class="row-value" style="color:var(--realm);font-style:italic;font-weight:500">「'+d.catchphrase+'」</span></div>';
    html+='<div class="row"><span class="row-label">根骨</span><span class="row-value">'+d.rootBone+'</span></div>';
    html+='<div class="row"><span class="row-label">悟性</span><span class="row-value">'+d.comprehension+'</span></div>';
    html+='<div class="row"><span class="row-label">福缘</span><span class="row-value">'+d.luck+'</span></div>';
    html+='<div class="report-body" style="text-align:center;margin:12px 0;font-style:italic;color:var(--gold)">「'+t('betroth_first')+'」</div>';
    html+='<div class="field-label" style="margin-top:18px;text-align:left">'+t('betroth_choice_title')+'</div>';
    html+='<div class="gift-choice">';
    GIFT_OPTIONS.forEach(o=>{
      const cost=Math.round(getGiftValue(o,d.giftGiven));
      const cant=!s.stones.gte(Dec.of(cost));
      const cls='gift-opt'+(selectedOpt===o.id?' selected':'')+(cant?' locked':'');
      const costTxt=cost===0?'免费':('-'+fmtCoinVal(Dec.of(cost))+' 毛');
      html+='<button class="'+cls+'" data-opt="'+o.id+'"><span class="go-icon">'+o.icon+'</span><span class="go-info"><span class="go-name">'+o.name+'</span><span class="go-desc">'+o.desc+'</span></span><span class="go-cost">'+costTxt+'</span></button>';
    });
    html+='</div>';
    html+='<div class="tip-box" style="font-size:calc(12px * var(--fs-scale));margin-top:10px" id="giftSummary"></div>';
    html+='<button class="btn gold" style="width:100%;margin-top:12px;padding:15px" id="acceptRecruit" '+(canPay?'':'disabled')+'>收 下 此 徒</button>';
    if(canReroll){
      html+='<button class="btn" style="width:100%;margin-top:8px" id="rejectRecruit">换 一 个</button>';
    } else if(!isFirst){
      html+='<button class="btn" style="width:100%;margin-top:8px" id="rejectRecruit">婉 拒</button>';
    } else {
      html+='<div class="tip-box warn" style="text-align:center;margin-top:8px">开山弟子必须收下 · 无可再换</div>';
    }
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});
    updateGiftSummary();
    el.modalCard.querySelectorAll('[data-opt]').forEach(btn=>{
      btn.onclick=(e)=>{
        e.stopPropagation();
        if(btn.classList.contains('locked')){toast('毛不足');return}
        AudioSys.click();
        selectedOpt=btn.dataset.opt;
        el.modalCard.querySelectorAll('.gift-opt').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        updateGiftSummary();
      };
    });
    $('acceptRecruit').onclick=(e)=>{
      e.stopPropagation();
      const opt2=GIFT_OPTIONS.find(o=>o.id===selectedOpt);
      const gift=Math.round(getGiftValue(opt2,d.giftGiven));
      const iexp=Math.round(getGiftExp(opt2,d.giftGiven));
      if(!s.stones.gte(Dec.of(gift))){toast('毛不足');return}
      s.stones=s.stones.add(Dec.of(d.giftGiven));s.stones=s.stones.sub(Dec.of(gift));
      if(iexp>0)d.exp=d.exp.add(Dec.of(iexp));
      d.loyalty=opt2.loyalty;
      d.upkeep=Math.max(0,Math.min(0.5,opt2.upkeep));
      d.pampered=!!opt2.pampered;
      assignRelationships(d);
      s.discipleList.push(d);
      s.lastRecruitAt=Date.now();
      s.flags.firstRecruitDone=true;
      s.stats.todayRecruits=(s.stats.todayRecruits||0)+1;
      addWeekStat('recruits');
      addYearStat('recruits');
      addYearEvent('recruit','收下弟子 '+d.name);
      addChronicle('recruit','收下弟子 <span class="hl">'+d.name+'</span>（'+apt.n+' · '+root.n+'灵根 · '+p.n+'）'+(d.chosen?' ✨天命之子':'')+' · 拜师礼 '+d.giftGiven+' 毛 · 回赠 '+gift+' 毛');
      AudioSys.recruit();if(d.giftGiven>0){setTimeout(()=>AudioSys.coin(),200)}
      flash(d.chosen?'purple':'gold');
      toast('收下弟子 · '+d.name+' · 忠诚 '+opt2.loyalty,2600);
      if(isFirst){addChronicle('milestone','<span class="hl">'+s.masterName+'</span> 立下大志：培养弟子收齐 14 亿毛');tryShowRite('first_betroth')}
      if(d.relationships&&d.relationships.length>0&&!s.ritesSeen.first_relation)tryShowRite('first_relation');
      checkDailyTasks();checkWeeklyTasks();hideModal();spawnParticles();renderUI();checkAchievements();
      if(isFirst){
        setTimeout(()=>{
          s.lastReport=Date.now();
          setTimeout(()=>{if(s.memos.length===0){generateMemo();openMemos()}},600);
        },400);
      } else {
        setTimeout(()=>{showDiscipleGreeting(d,false,()=>{})},400);
      }
    };
    const rejectBtn=$('rejectRecruit');
    if(rejectBtn){
      rejectBtn.onclick=(e)=>{
        e.stopPropagation();
        AudioSys.click();
        if(isFirst&&!s.flags.firstRecruitRerolled){
          s.flags.firstRecruitRerolled=true;
          save();
          hideModal();
          setTimeout(()=>openRecruit(true),300);
        } else {
          hideModal();
        }
      };
    }
    function updateGiftSummary(){
      const opt2=GIFT_OPTIONS.find(o=>o.id===selectedOpt);
      const gift=Math.round(getGiftValue(opt2,d.giftGiven));
      const iexp=Math.round(getGiftExp(opt2,d.giftGiven));
      const net=d.giftGiven-gift;
      let sum='当前选择：<span class="hl">'+opt2.name+'</span> · 忠诚度初始 <span class="hl">'+opt2.loyalty+'</span>';
      sum+=' · 产出抽成 <span class="hl">'+Math.round(opt2.upkeep*100)+'%</span>（你拿 <span class="hl">'+(100-Math.round(opt2.upkeep*100))+'%</span>）';
      if(iexp>0)sum+=' · 修为 <span class="hl">+'+iexp+'</span>';
      if(net>=0)sum+='<br>净收入：<span style="color:var(--green);font-weight:700">+'+fmtCoinVal(Dec.of(net))+' 毛</span>';
      else sum+='<br>净支出：<span style="color:var(--red);font-weight:700">-'+fmtCoinVal(Dec.of(Math.abs(net)))+' 毛</span>';
      // 扣除后剩余 + 占比
      const _curMao=s.stones.toNum();
      const _remain=_curMao+d.giftGiven-gift;
      if(_curMao>0){
        const _costPct=(gift-d.giftGiven)/_curMao*100;
        if(_costPct>0){
          sum+='<br><span style="color:var(--dim)">扣除后你还剩 <span class="hl">'+fmtCoinVal(Dec.of(Math.max(0,_remain)))+'</span> 毛（本次消耗约 <span style="color:'+(_costPct>=30?'var(--red)':'var(--orange)')+';font-weight:700">'+_costPct.toFixed(1)+'%</span> 的总毛）</span>';
        }
      }
      if(opt2.pampered)sum+='<br><span style="color:var(--orange)">⚠ 骄纵弟子：忠诚会自然回落，叛逃概率 ×1.5</span>';
      const elx=$('giftSummary');if(elx)elx.innerHTML=sum;
      const acceptBtn=$('acceptRecruit');if(acceptBtn)acceptBtn.disabled=!s.stones.gte(Dec.of(gift));
    }
  }
  renderContent();
}

/* ============ 第一次收徒全屏仪式 ============ */
function showFirstRecruitCinematic(done){
  const fr=el.firstRecruit;
  fr.classList.add('show');
  AudioSys.recruit();
  let closed=false;
  const close=()=>{
    if(closed)return;closed=true;
    fr.classList.remove('show');
    clearTimeout(autoCloseTimer);
    el.frSkip.onclick=null;
    if(done)setTimeout(done,300);
  };
  const autoCloseTimer=setTimeout(close,5000);
  el.frSkip.onclick=(e)=>{e.stopPropagation();AudioSys.click();close()};
}

/* ============ 弟子列表 ============ */
let discSortMode='level';
let discScrollPos=0;
function openDisciples(restore){
  let html='<div class="modal-title">弟 子 列 表</div><div class="modal-sub">共 '+s.discipleList.length+' / '+maxDisciples()+' 人</div>';
  if(s.discipleList.length===0){html+='<div class="tip-box">还没有弟子。</div><div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';showModal(html);return}
  html+='<div class="disc-tabs"><button class="disc-tab'+(discSortMode==='level'?' active':'')+'" data-sort="level">按境界</button><button class="disc-tab'+(discSortMode==='break'?' active':'')+'" data-sort="break">按突破</button><button class="disc-tab'+(discSortMode==='loyalty'?' active':'')+'" data-sort="loyalty">按忠诚</button><button class="disc-tab'+(discSortMode==='default'?' active':'')+'" data-sort="default">默认</button></div>';
  let list=s.discipleList.slice();
  if(discSortMode==='default'){}
  else if(discSortMode==='level')list.sort((a,b)=>b.level-a.level);
  else if(discSortMode==='break')list.sort((a,b)=>discipleBreakRate(b)-discipleBreakRate(a));
  else list.sort((a,b)=>(b.loyalty||0)-(a.loyalty||0));
  const chief=topDisciple();
  list.forEach(d=>{
    const p=getP(d),r=realmOf(d.level),apt=getApt(d),root=getRoot(d);
    const isChief=chief&&chief.id===d.id;const injured=isInjured(d);const aging=agingWarn(d);
    const unhappy=(d.loyalty||50)<30;
    const away=isOnExpedition(d);
    let tag='normal';
    if(apt.id==='monster'||apt.id==='genius')tag='great';else if(apt.id==='high')tag='rare';else if(apt.id==='mid')tag='good';
    let cls='disciple-card';
    if(d.chosen)cls+=' chosen';
    if(isChief)cls+=' chief';
    if(injured)cls+=' injured';
    if(aging)cls+=' aging';
    if(unhappy)cls+=' unhappy';
    if(away)cls+=' away';
    html+='<div class="'+cls+'" data-did="'+d.id+'">';
    html+='<div class="d-avatar'+(d.chosen?' chosen':'')+'">';
    if(isChief)html+='<span class="d-crown">👑</span>';
    if(injured)html+='<span class="d-hurt">🩹</span>';
    if(away)html+='<span class="d-away">🧭</span>';
    html+=p.ic+'<span class="d-lv">'+d.level+'</span></div>';
    html+='<div class="d-info">';
        const sp=getSpecialty(d);
    html+='<div class="d-name">'+d.name+(isChief?'<span class="d-tag chief-tag">首席</span>':'')+(d.chosen?'<span class="d-tag chosen-tag">✨天命</span>':'')+'<span class="d-tag '+tag+'">'+apt.n+'</span><span class="d-tag" style="background:'+hexToRgba(root.color,.18)+';color:'+root.color+'">'+root.ic+root.n+'</span><span class="d-tag normal">'+sp.ic+' '+sp.n+'</span>'+'<span class="d-tag normal">'+p.ic+p.n+'</span>'+(injured?'<span class="d-tag injured-tag">🩹受伤</span>':'')+(aging?'<span class="d-tag aging-tag">⏳寿元将尽</span>':'')+(unhappy?'<span class="d-tag unhappy-tag">⚠️不满</span>':'')+(away?'<span class="d-tag away-tag">🧭外派中</span>':'')+'</div>';
    html+='<div class="d-realm">'+r.name+' · 突破率 '+(discipleBreakRate(d)*100).toFixed(0)+'%</div>';
    html+='<div class="d-catchphrase">「'+d.catchphrase+'」</div>';
    html+='<div class="loyalty-row'+(unhappy?' unhappy':'')+'">忠诚 '+loyaltyIcon(d.loyalty)+' <span class="loyalty-hearts">'+loyaltyHearts(d.loyalty)+'</span> '+Math.round(d.loyalty||0)+'/100</div>';
    const remain=lifeRemain(d);const ageCls=remain<=10?'danger':(remain<=30?'warn':'');
    html+='<div class="age-row '+ageCls+'">'+d.age+'岁 / 寿元 '+lifespan(d)+' · 剩 '+remain+' 年</div>';
    if(d.relationships&&d.relationships.length>0){
      html+='<div class="d-rel-row">';
      d.relationships.slice(0,4).forEach(rel=>{
        const rt=relType(rel.type);const target=s.discipleList.find(x=>x.id===rel.targetId);
        if(!target)return;
        html+='<span class="d-rel-chip" style="background:'+hexToRgba(rt.color,.18)+';color:'+rt.color+'">'+rt.ic+' '+target.name+'</span>';
      });
      html+='</div>';
    }
    html+='</div></div>';
  });
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-sort]').forEach(tab=>{tab.onclick=(e)=>{e.stopPropagation();AudioSys.click();discSortMode=tab.dataset.sort;openDisciples()}});
  el.modalCard.querySelectorAll('[data-did]').forEach(card=>{
    card.onclick=(e)=>{e.stopPropagation();AudioSys.click();discScrollPos=el.modalCard.scrollTop;const d=s.discipleList.find(x=>x.id===card.dataset.did);if(d)openDiscipleDetail(d)};
  });
  if(restore&&discScrollPos>0)setTimeout(()=>{el.modalCard.scrollTop=discScrollPos},50);
}
function openDiscipleDetail(d){
  const p=getP(d),r=realmOf(d.level),apt=getApt(d),root=getRoot(d),need=expNeed(d.level);
  const story=d.story||buildStory(d);
  const days=Math.max(1,Math.floor((Date.now()-(d.joinedAt||Date.now()))/86400000)+1);
  const chief=topDisciple();const isChief=chief&&chief.id===d.id;const injured=isInjured(d);
  const remain=lifeRemain(d);
  const lTier=loyaltyTier(d.loyalty||50);
  const estSec=estimateTimeTo(d,d.level+1);
  const away=isOnExpedition(d);
  const exp=getExpeditionFor(d);
  let html='<div class="modal-title realm">'+d.name+(d.chosen?' ✨':'')+(isChief?' 👑':'')+'</div>';
  html+='<div class="modal-sub">'+r.name+' · '+p.n+' · '+apt.n+'资质</div>';
  html+='<div class="row"><span class="row-label">口头禅</span><span class="row-value" style="color:var(--realm);font-style:italic;font-weight:500">「'+d.catchphrase+'」</span></div>';
  html+='<div class="row"><span class="row-label">年龄</span><span class="row-value" style="color:'+(remain<=10?'var(--red)':remain<=30?'var(--orange)':'#fff')+'">'+d.age+' 岁 / 寿元 '+lifespan(d)+' 岁<br><span style="font-size:calc(11px * var(--fs-scale));color:var(--dim)">剩余 '+remain+' 年</span></span></div>';
  html+='<div class="row"><span class="row-label">入门时间</span><span class="row-value">第 '+days+' 天</span></div>';
  // 计算忠诚趋势
  const _cur=d.loyalty||50;
  const _moonBonus=moonLoyaltyDaily();
  const _spLoy=getSpecialty(d);
  const _spMul=_spLoy.loyaltyMul||1;
  let _trendHtml='';
  if(_cur>50){
    const _drift=-CONFIG.loyaltyDailyGain;
    const _moon=_moonBonus*_spMul;
    const _net=_drift+_moon;
    if(_net<0)_trendHtml='<span style="color:var(--orange)">↓ 每天约 '+_net.toFixed(2)+'（无月令休养，自然回落）</span>';
    else if(_net>0)_trendHtml='<span style="color:var(--green)">↑ 每天约 +'+_net.toFixed(2)+'（月令加成）</span>';
    else _trendHtml='<span style="color:var(--dim)">— 保持稳定</span>';
  } else if(_cur<50){
    const _drift=CONFIG.loyaltyDailyGain;
    const _moon=_moonBonus*_spMul;
    const _net=_drift+_moon;
    _trendHtml='<span style="color:var(--green)">↑ 每天约 +'+_net.toFixed(2)+'（自然回升'+(moonLoyaltyDaily()>0?' + 月令加成':'')+'）</span>';
  } else {
    _trendHtml='<span style="color:var(--dim)">— 稳定在 50</span>';
  }
  html+='<div class="row"><span class="row-label">忠诚度</span><span class="row-value" style="color:'+((d.loyalty||0)>=70?'var(--green)':(d.loyalty||0)>=50?'#fff':(d.loyalty||0)>=30?'var(--orange)':'var(--red)')+'">'+loyaltyIcon(d.loyalty)+' '+lTier.n+' '+Math.round(d.loyalty||0)+'/100<br><span style="font-size:calc(11px * var(--fs-scale));color:var(--dim)">'+lTier.desc+'</span><br>'+_trendHtml+'</span></div>';
    const _up=Math.max(0,Math.min(0.5,d.upkeep||0.15));
  const _upPct=Math.round(_up*100);
  const _keepPct=100-_upPct;
  html+='<div class="row"><span class="row-label">产出抽成</span><span class="row-value">弟子留 '+_upPct+'% · 你拿 <span style="color:var(--green);font-weight:700">'+_keepPct+'%</span><br><span style="font-size:calc(11px * var(--fs-scale));color:var(--dim)">弟子持续产出毛，按此比例分成</span></span></div>';
  if(d.forceBreak)html+='<div class="row"><span class="row-label">待生效</span><span class="row-value gold">🧪 破障丹（下次突破 +50%）</span></div>';
  if(injured)html+='<div class="row"><span class="row-label">伤势</span><span class="row-value red">🩹 修为速度 -50% · 剩余 '+fmtDur(injuryRemain(d))+'</span></div>';
  if(away&&exp){
    const loc=EXPEDITION_LOCATIONS.find(l=>l.id===exp.locationId);
    const remainSec=Math.max(0,Math.ceil((exp.endAt-Date.now())/1000));
    if(loc)html+='<div class="row"><span class="row-label">外派</span><span class="row-value">🧭 '+loc.n+' · 剩 '+fmtDur(remainSec)+'</span></div>';
  }
      const _p=getP(d);
  const _pDesc=[];
  if(_p.expMul&&_p.expMul!==1)_pDesc.push('修为 ×'+_p.expMul.toFixed(2));
  if(_p.stoneMul&&_p.stoneMul!==1)_pDesc.push('毛 ×'+_p.stoneMul.toFixed(2));
  if(_p.riskBonus>0)_pDesc.push('事件/突破 +'+(Math.round(_p.riskBonus*100))+'%');
  if(_p.riskBonus<0)_pDesc.push('事件 -'+(Math.round(Math.abs(_p.riskBonus)*100))+'%');
    html+='<div class="row"><span class="row-label">性格</span><span class="row-value">'+_p.ic+' '+_p.n+'<br><span style="font-size:calc(11px * var(--fs-scale));color:var(--dim)">'+_pDesc.join(' · ')+'</span></span></div>';
    html+='<div class="row"><span class="row-label">灵根</span><span class="row-value" style="color:'+root.color+'">'+root.ic+' '+root.n+'（'+root.tag+'）</span></div>';
  const sp=getSpecialty(d);
  html+='<div class="row"><span class="row-label">专精</span><span class="row-value gold">'+sp.ic+' '+sp.n+'<br><span style="font-size:calc(11px * var(--fs-scale));color:var(--dim)">'+sp.desc+'</span></span></div>';
  html+='<div class="row"><span class="row-label">修为进度</span><span class="row-value">'+fmtExp(d.exp)+' / '+fmtExp(need)+'</span></div>';
  html+='<div class="row"><span class="row-label">距下一级</span><span class="row-value gold">约 '+fmtDur(estSec)+'</span></div>';
  html+='<div class="row"><span class="row-label">突破率</span><span class="row-value">'+(discipleBreakRate(d)*100).toFixed(0)+'%</span></div>';
  // ---- 折叠区：次要属性 ----
  html+='<button class="btn" style="width:100%;margin-top:10px;padding:12px;font-size:calc(13px * var(--fs-scale))" id="toggleDetail">▼ 查看详细属性</button>';
  html+='<div id="detailExtra" style="display:none">';
  // 属性换算
  const _boneV=(0.7+(d.rootBone||50)/100*0.6).toFixed(3);
  const _luckV=(0.7+(d.luck||50)/100*0.6).toFixed(3);
  const _compV=(((d.comprehension||50)-50)/100*0.15*100).toFixed(1);
  html+='<div class="row"><span class="row-label">根骨</span><span class="row-value">'+d.rootBone+'<br><span style="font-size:calc(11px * var(--fs-scale));color:var(--dim)">修为 ×'+_boneV+'</span></span></div>';
  html+='<div class="row"><span class="row-label">悟性</span><span class="row-value">'+d.comprehension+'<br><span style="font-size:calc(11px * var(--fs-scale));color:var(--dim)">突破 '+(_compV>=0?'+':'')+_compV+'%</span></span></div>';
  html+='<div class="row"><span class="row-label">福缘</span><span class="row-value">'+d.luck+'<br><span style="font-size:calc(11px * var(--fs-scale));color:var(--dim)">毛 ×'+_luckV+' · 事件 +'+(d.luck/10).toFixed(1)+'%</span></span></div>';
  html+='<div class="row"><span class="row-label">累计突破 / 失败</span><span class="row-value">'+d.totalBreaks+' / '+d.totalFails+'</span></div>';
  if(d.storyArcs&&d.storyArcs.length>0){
    const done=d.storyArcs.filter(a=>a.done).length;
    const total=d.storyArcs.length;
    html+='<div class="row"><span class="row-label">个人弧光</span><span class="row-value gold">'+done+' / '+total+' 段</span></div>';
  }
  html+='</div>';
  if(d.relationships&&d.relationships.length>0){
    html+='<div class="tip-box"><div style="font-size:calc(11.5px * var(--fs-scale));letter-spacing:2px;color:var(--gold);margin-bottom:8px">💞 宗 门 关 系</div><div class="rel-list">';
    d.relationships.forEach(rel=>{
      const rt=relType(rel.type);const target=s.discipleList.find(x=>x.id===rel.targetId);
      if(!target)return;
      html+='<div class="rel-item"><span class="ri-icon">'+rt.ic+'</span><span class="ri-name">'+target.name+'</span><span class="ri-type" style="color:'+rt.color+'">'+rt.name+'</span></div>';
    });
    html+='</div></div>';
  }
  html+='<div class="tip-box"><div style="font-size:calc(11.5px * var(--fs-scale));letter-spacing:2px;color:var(--gold);margin-bottom:8px">📖 '+d.name+' 的故事</div><div style="font-size:calc(13px * var(--fs-scale));line-height:2;color:var(--text)">';
  story.forEach(l=>{html+='<div style="margin-bottom:4px">'+l+'</div>'});
  html+='</div></div>';
  html+='<button class="btn" style="width:100%;margin-top:12px;padding:14px" id="backToDiscList">‹ 返 回 弟 子 列 表</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('backToDiscList').onclick=(e)=>{e.stopPropagation();AudioSys.click();openDisciples(true)};
  const _tgl=$('toggleDetail');if(_tgl){_tgl.onclick=(e)=>{e.stopPropagation();AudioSys.click();const ex=$('detailExtra');if(!ex)return;const show=ex.style.display==='none';ex.style.display=show?'block':'none';_tgl.textContent=show?'▲ 收起详细属性':'▼ 查看详细属性'}}
}

/* ============ 宗门关系 ============ */
function openRelations(){
  let html='<div class="modal-title">宗 门 关 系</div>';
  const total=s.discipleList.reduce((a,d)=>a+((d.relationships||[]).length),0);
  html+='<div class="modal-sub">共 '+total+' 条关系</div>';
  html+='<div class="tip-box" style="font-size:calc(11.5px * var(--fs-scale));line-height:1.9"><span class="hl">关系加成</span>（弟子突破时，关系人也获得修为）：<br>· 💕 道侣：+30%<br>· 🎓🌱 师兄/师弟：+10%<br>· 🏘️ 同乡：+8%<br>· ⚔️ 宿敌：+5%</div>';
  if(s.discipleList.length<2){html+='<div class="tip-box" style="text-align:center">弟子不足 2 人</div><div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';showModal(html);return}
  const seen=new Set();const groups={};
  s.discipleList.forEach(d=>{
    (d.relationships||[]).forEach(r=>{
      const k=[d.id,r.targetId].sort().join('_')+'_'+r.type;
      const rk=[d.id,r.targetId].sort().join('_')+'_'+reverseRelType(r.type);
      if(seen.has(k)||seen.has(rk))return;
      seen.add(k);
      if(!groups[r.type])groups[r.type]=[];
      const t=s.discipleList.find(x=>x.id===r.targetId);
      if(t)groups[r.type].push({from:d,to:t});
    });
  });
  Object.keys(groups).forEach(type=>{
    const rt=relType(type);
    html+='<div class="settings-group"><div class="settings-group-h" style="color:'+rt.color+'">'+rt.ic+' '+rt.name+' ('+groups[type].length+')</div>';
    groups[type].forEach(g=>{html+='<div class="rel-item"><span class="ri-icon">'+rt.ic+'</span><span class="ri-name">'+g.from.name+' ↔ '+g.to.name+'</span><span class="ri-type" style="color:'+rt.color+'">'+rt.desc+'</span></div>'});
    html+='</div>';
  });
  if(total===0)html+='<div class="tip-box" style="text-align:center">暂时没有弟子之间的关系</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
}

/* ============ 副掌门 ============ */
function openVice(){
  const cutTot=s.viceCutTotal||new Dec(0,0);
  let html='<div class="modal-title">副 掌 门</div><div class="modal-sub">宗门日常事务总管</div>';
  html+='<div class="tip-box purple"><span class="hl">副掌门</span>是宗门的管家，可代掌门处理无事件的日常奏章。</div>';
  html+='<div class="row"><span class="row-label">副掌门状态</span><span class="row-value '+(s.viceEnabled?'up':'')+'">'+(s.viceEnabled?'已聘用':'未聘用')+'</span></div>';
  html+='<div class="row"><span class="row-label">抽成比例</span><span class="row-value gold">'+(VICE_CUT*100)+'%（每份奏章的毛）</span></div>';
  if(cutTot.gt(0))html+='<div class="row"><span class="row-label">累计抽成</span><span class="row-value red">'+fmtCoin(cutTot)+'</span></div>';
  html+='<button class="btn gold" style="width:100%;padding:15px;margin-top:14px" id="viceToggle">'+(s.viceEnabled?'解 聘 副 掌 门':'聘 请 副 掌 门')+'</button>';
  html+='<div class="tip-box" style="font-size:calc(12px * var(--fs-scale))"><span class="hl">效果</span>：<br>· 无事件的日常奏章将自动合并<br>· 每份奏章副掌门抽取 <span class="hl">10% 的毛</span> 作为报酬<br>· 修为不抽成</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('viceToggle').onclick=(e)=>{e.stopPropagation();s.viceEnabled=!s.viceEnabled;AudioSys.click();toast(s.viceEnabled?'已聘请副掌门（抽成 10%）':'已解聘副掌门');save();openVice()};
}

/* ============ 掌门月令弹窗 ============ */
function moonOrderCooldownRemain(){
  if(!s.moonOrderChangedAt)return 0;
  const passed=Date.now()-s.moonOrderChangedAt;
  return Math.max(0,CONFIG.moonOrderCooldown-passed);
}
function openMoonOrder(){
  const cur=moonOrder();
  const remain=moonOrderCooldownRemain();
  const cooling=remain>0;
  let html='<div class="modal-title">掌 门 月 令</div>';
    html+='<div class="modal-sub">定宗门当前方针 · 每 '+Math.round(CONFIG.moonOrderCooldown/3600000)+' 小时可切换一次</div>';
  html+='<div class="tip-box"><span class="hl">月令</span>影响全宗门产出、忠诚恢复、外派与秘境收益。<br>当前：<span class="hl">'+cur.ic+' '+cur.n+'</span>';
  if(cooling)html+='<br>切换冷却：<span class="hl">剩 '+fmtDur(remain/1000)+'</span>';
  html+='</div>';
  html+='<div class="gift-choice">';
  MOON_ORDERS.forEach(m=>{
    const sel=m.id===s.moonOrder;
    const locked=!sel&&cooling;
    html+='<button class="gift-opt'+(sel?' selected':'')+(locked?' locked':'')+'" data-moon="'+m.id+'"><span class="go-icon">'+m.ic+'</span><span class="go-info"><span class="go-name">'+m.n+'</span><span class="go-desc">'+m.desc+'</span></span><span class="go-cost">'+(sel?'当前':(locked?'⏳ 冷却':'选 择'))+'</span></button>';
  });
  html+='</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-moon]').forEach(btn=>{
    btn.onclick=(e)=>{
      e.stopPropagation();
      if(btn.classList.contains('locked')){toast('冷却中 · 剩 '+fmtDur(moonOrderCooldownRemain()/1000));return}
      const id=btn.dataset.moon;
      if(id===s.moonOrder){toast('已经是当前月令');return}
      s.moonOrder=id;
      s.moonOrderChangedAt=Date.now();
      const m=MOON_ORDERS.find(x=>x.id===id);
      AudioSys.success();
      toast('掌门月令 · '+m.ic+' '+m.n,2600);
      addChronicle('moonOrder','🌙 掌门月令变更为「'+m.n+'」');
      save();renderUI();openMoonOrder();
    };
  });
}

/* ============ 宗门建设 ============ */
function renderBuildingCardHTML(key){
  const b=BUILDINGS.find(x=>x.key===key);if(!b)return'';
  if(key==='cave'){
    const cost=caveCost(),max=s.cave>=b.max;const cant=!max&&!s.stones.gte(cost);
    return'<div class="building-card'+(cant?' locked':'')+'" data-bkey="cave"><div class="b-icon">'+b.ic+'</div><div class="b-info"><div class="b-name">'+b.n+'</div><div class="b-desc">'+b.desc+'</div><div class="b-desc" data-eff="cave" style="color:var(--gold);margin-top:4px">当前：'+b.effect(s.cave)+'</div></div><div class="b-level" data-lv="cave">'+(max?'MAX':(cant?'毛不足':('Lv.'+s.cave+' · '+fmtCoinVal(cost)+' 毛')))+'</div></div>';
  }
  const lv=s.buildings[key],cost=buildingCost(key),max=lv>=b.max;const cant=!max&&!s.stones.gte(cost);
  return'<div class="building-card'+(cant?' locked':'')+'" data-bkey="'+key+'"><div class="b-icon">'+b.ic+'</div><div class="b-info"><div class="b-name">'+b.n+'</div><div class="b-desc">'+b.desc+'</div><div class="b-desc" data-eff="'+key+'" style="color:var(--gold);margin-top:4px">当前：'+b.effect(lv)+'</div></div><div class="b-level" data-lv="'+key+'">'+(max?'MAX':(cant?'毛不足':('Lv.'+lv+' · '+fmtCoinVal(cost)+' 毛')))+'</div></div>';
}
function updateBuildingCard(card,key){
  const b=BUILDINGS.find(x=>x.key===key);if(!b)return;
  let lv,cost,max,cant;
  if(key==='cave'){lv=s.cave;cost=caveCost();max=lv>=b.max;cant=!max&&!s.stones.gte(cost)}
  else{lv=s.buildings[key];cost=buildingCost(key);max=lv>=b.max;cant=!max&&!s.stones.gte(cost)}
  card.classList.toggle('locked',cant);
  const lvEl=card.querySelector('[data-lv="'+key+'"]');if(lvEl)lvEl.textContent=max?'MAX':(cant?'毛不足':('Lv.'+lv+' · '+fmtCoinVal(cost)+' 毛'));
  const effEl=card.querySelector('[data-eff="'+key+'"]');if(effEl)effEl.textContent='当前：'+b.effect(lv);
}
function openSect(){
  let html='<div class="modal-title">宗 门 建 设</div><div class="modal-sub">用毛升级宗门建筑</div>';
  html+=resourceBar();
  BUILDINGS.forEach(b=>{html+=renderBuildingCardHTML(b.key)});
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-bkey]').forEach(card=>{
    card.onclick=(e)=>{
      e.stopPropagation();
      const key=card.dataset.bkey;
      if(card.classList.contains('locked')){toast('毛不足');return}
      if(key==='cave'){
        if(s.cave>=100){toast('洞府已满级');return}
        const cost=caveCost();if(!s.stones.gte(cost)){toast('毛不足');return}
        s.stones=s.stones.sub(cost);s.cave++;s.stoneFlashFlag=true;
        addChronicle('build','洞府升级至 <span class="hl">Lv.'+s.cave+'</span>');
        tryShowRite('first_build');AudioSys.success();
        toast('洞府升级 · Lv.'+s.cave,2600);
        el.modalCard.querySelectorAll('[data-bkey]').forEach(c=>{updateBuildingCard(c,c.dataset.bkey)});
        const mv=el.modalCard.querySelector('.mr-val');if(mv)mv.textContent=fmtCoinVal(s.stones);
        renderUI();checkAchievements();
      }else{
        const b=BUILDINGS.find(x=>x.key===key);
        if(s.buildings[key]>=b.max){toast('已满级');return}
        const cost=buildingCost(key);if(!s.stones.gte(cost)){toast('毛不足');return}
        s.stones=s.stones.sub(cost);s.buildings[key]++;s.stoneFlashFlag=true;
        addChronicle('build',b.n+'升级至 <span class="hl">Lv.'+s.buildings[key]+'</span>');
        tryShowRite('first_build');AudioSys.success();
        toast(b.n+'升级 · Lv.'+s.buildings[key],2600);
        el.modalCard.querySelectorAll('[data-bkey]').forEach(c=>{updateBuildingCard(c,c.dataset.bkey)});
        const mv=el.modalCard.querySelector('.mr-val');if(mv)mv.textContent=fmtCoinVal(s.stones);
        renderUI();checkAchievements();
      }
    };
  });
}

/* ============ 遗物 ============ */
function openRelics(){
  let html='<div class="modal-title">英 魂 遗 物</div><div class="modal-sub">化道弟子与完成弧光留下的永久加成</div>';
  if(!s.relics||s.relics.length===0){
    html+='<div class="tip-box" style="text-align:center">还没有遗物<br>弟子化道或完成个人弧光后会留下遗物</div>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html);return;
  }
  s.relics.forEach(r=>{html+='<div class="relic-item'+(r.arc?' arc-relic':'')+'"><span class="ri-icon">'+r.icon+'</span><span class="ri-info"><div class="ri-name">'+r.name+(r.arc?' · 弟子弧光':'')+'</div><div class="ri-desc">'+r.desc+'</div></span></div>'});
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
}

/* ============ 秘境（成本底数 1.10 → 1.05） ============ */
let currentMijing=null;
function getMijingCooldownRemain(id){const u=(s.mijingCooldowns&&s.mijingCooldowns[id])||0;return Math.max(0,Math.ceil((u-Date.now())/1000))}
const SECRET_REALMS=[
  {id:'low',name:'低阶秘境 · 幽谷',ic:'🌿',minLevel:5,baseCost:40,rooms:3,rewardMul:1,cooldown:60*60*1000,desc:'灵气稀薄 · 弟子可能遇险'},
  {id:'mid',name:'中阶秘境 · 剑冢',ic:'⚔️',minLevel:20,baseCost:1000,rooms:4,rewardMul:3,cooldown:3*60*60*1000,desc:'剑气纵横 · 需实力'},
  {id:'high',name:'高阶秘境 · 虚空',ic:'🌌',minLevel:45,baseCost:10000,rooms:5,rewardMul:10,cooldown:6*60*60*1000,desc:'虚空之中 · 唯有大机缘'},
  {id:'top',name:'传说秘境 · 上古战场',ic:'👑',minLevel:63,baseCost:100000,rooms:5,rewardMul:30,cooldown:12*60*60*1000,desc:'仙人陨落之地'}
];
function mijingCost(realm){
  const top=topDisciple();
  const lv=top?top.level:0;
  return Math.round(realm.baseCost*Math.pow(CONFIG.mijingCostGrowth,lv));
}
const MIJING_ROOM_TYPES=[{id:'battle',w:25},{id:'treasure',w:20},{id:'trap',w:15},{id:'herb',w:15},{id:'fork',w:15},{id:'altar',w:10}];
const INJURY_DURATIONS=[{min:80,ms:10*60*1000},{min:50,ms:5*60*1000},{min:30,ms:3*60*1000}];
function mijingPreview(realm){
  const top=topDisciple();if(!top)return null;
  const mul=realm.rewardMul;
  const avgExp=Math.floor((1.5*mul*top.level+15)*realm.rooms);
  const avgStone=Math.floor((20*mul)*realm.rooms);
  return{exp:avgExp,stone:avgStone};
}
function openMijingSelect(){
  let html='<div class="modal-title">秘 境 试 炼</div><div class="modal-sub">派遣弟子进入秘境 · 每阶独立冷却</div>';
  html+=resourceBar();
  const wb=worldBuffMul('treasure');
  if(wb>1)html+='<div class="tip-box good">💎 天下「秘宝」生效中 · 秘境收益 <span class="hl">×'+wb+'</span></div>';
  SECRET_REALMS.forEach(r=>{
    const top=topDisciple();const locked=!top||top.level<r.minLevel;
    const cost=mijingCost(r);
    const cant=!locked&&!s.stones.gte(Dec.of(cost));
    const cdr=getMijingCooldownRemain(r.id);const cooling=cdr>0;
    let cls='mijing-card';
    if(locked)cls+=' locked';else if(cooling)cls+=' cooling';else if(cant)cls+=' cant-afford';
    const pv=mijingPreview(r);
    html+='<div class="'+cls+'" data-realm="'+r.id+'"><div class="mj-name">'+r.ic+' '+r.name+'</div><div class="mj-desc">'+r.desc+'</div>';
    if(pv&&!locked)html+='<div class="mj-preview">约 +'+pv.exp+' 修为 / +'+pv.stone+' 毛'+(wb>1?' （×'+wb+'）':'')+'</div>';
    let ml;
    if(locked)ml='需境界 Lv.'+r.minLevel;
    else if(cooling)ml='⏳ 冷却 '+fmtDur(cdr);
    else if(cant)ml='毛不足';
    else ml='可进入';
    html+='<div class="mj-meta"><span>'+ml+'</span><span>'+fmtCoinVal(Dec.of(cost))+' 毛 · '+r.rooms+' 层 · 冷却 '+fmtDur(r.cooldown/1000)+'</span></div></div>';
  });
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-realm]').forEach(card=>{
    card.onclick=(e)=>{
      e.stopPropagation();
      const realm=SECRET_REALMS.find(x=>x.id===card.dataset.realm);if(!realm)return;
      if(card.classList.contains('locked')){toast('需首席境界 Lv.'+realm.minLevel,2400);return}
      if(card.classList.contains('cooling')){toast('冷却中 · 剩余 '+fmtDur(getMijingCooldownRemain(realm.id)),2400);return}
      const cost=mijingCost(realm);
      if(!s.stones.gte(Dec.of(cost))){toast('毛不足');return}
      const top=topDisciple();
      if(!top){toast('没有弟子');return}
      if(isOnExpedition(top)){toast('首席正在外派中');return}
      AudioSys.click();startMijing(realm);
    };
  });
}
function startMijing(realm){
  const top=topDisciple();if(!top){toast('没有弟子');return}
  const cost=mijingCost(realm);
  s.stones=s.stones.sub(Dec.of(cost));s.stoneFlashFlag=true;
  currentMijing={realm,discipleId:top.id,roomIndex:0,totalRooms:realm.rooms,totalExp:new Dec(0,0),totalStone:new Dec(0,0),damage:0,log:[{text:'▸ 进入 '+realm.name,cls:''}],finished:false,currentRoom:null};
  runMijingRoom();
}
function runMijingRoom(){
  const mj=currentMijing;if(!mj||mj.finished)return;
  if(mj.roomIndex>=mj.totalRooms){finishMijing(false);return}
  const d=s.discipleList.find(x=>x.id===mj.discipleId)||topDisciple();if(!d){finishMijing(true);return}
  const room=rollMijingRoom(d,mj.realm.rewardMul);mj.currentRoom=room;
  if(room.type==='fork'){mj.log.push({text:'【第'+(mj.roomIndex+1)+'层】岔路口……',cls:''});AudioSys.mijingRoom();renderMijingRoom();return}
  if(room.reward){if(room.reward.exp)mj.totalExp=mj.totalExp.add(Dec.of(room.reward.exp));if(room.reward.stone)mj.totalStone=mj.totalStone.add(Dec.of(room.reward.stone))}
  if(room.damage)mj.damage+=room.damage;
  if(room.heal)mj.damage=Math.max(0,mj.damage-room.heal);
  let ll=room.text;
  if(room.reward&&room.reward.exp)ll+='（修为 +'+Dec.of(room.reward.exp).format()+'）';
  if(room.reward&&room.reward.stone)ll+='（毛 +'+fmtCoin(Dec.of(room.reward.stone))+'）';
  if(room.damage)ll+='（受伤 +'+room.damage+'）';
  if(room.heal)ll+='（恢复 '+room.heal+'）';
  mj.log.push({text:'【第'+(mj.roomIndex+1)+'层】'+ll,cls:room.result==='great'?'up':(room.result==='bad'||room.result==='awful')?'down':''});
  mj.roomIndex++;AudioSys.mijingRoom();
  if(mj.damage>=100){mj.log.push({text:'⚠ 伤势过重，退出……',cls:'down'});finishMijing(true);return}
  renderMijingRoom();
}
function resolveForkChoice(path){
  const mj=currentMijing;if(!mj||mj.finished)return;
  const d=s.discipleList.find(x=>x.id===mj.discipleId)||topDisciple();if(!d)return;
  const mul=mj.realm.rewardMul;let o;let pt='';
  if(path==='left'){pt='弟子选择了左边幽暗的洞穴。';o=mijingRoomBattle(d,mul)}
  else if(path==='right'){pt='弟子选择了右边灵光的小径。';o=Math.random()<0.6?mijingRoomTreasure(d,mul):mijingRoomHerb(d,mul)}
  else{pt='弟子选择了中间的路。';const lr=weightedPick([{t:'treasure',w:30},{t:'herb',w:25},{t:'battle',w:20},{t:'altar',w:15},{t:'trap',w:10}]);
    switch(lr.t){case'battle':o=mijingRoomBattle(d,mul);break;case'treasure':o=mijingRoomTreasure(d,mul);break;case'herb':o=mijingRoomHerb(d,mul);break;case'altar':o=mijingRoomAltar(d,mul);break;default:o=mijingRoomTrap(d,mul)}
  }
  if(o.reward){if(o.reward.exp)mj.totalExp=mj.totalExp.add(Dec.of(o.reward.exp));if(o.reward.stone)mj.totalStone=mj.totalStone.add(Dec.of(o.reward.stone))}
  if(o.damage)mj.damage+=o.damage;
  if(o.heal)mj.damage=Math.max(0,mj.damage-o.heal);
  mj.log.push({text:'【第'+(mj.roomIndex+1)+'层】'+pt+o.text,cls:o.result==='great'?'up':(o.result==='bad'||o.result==='awful')?'down':''});
  mj.roomIndex++;mj.currentRoom=o;AudioSys.mijingRoom();
  if(mj.damage>=100){mj.log.push({text:'⚠ 退出秘境……',cls:'down'});finishMijing(true);return}
  renderMijingRoom();
}
function renderMijingRoom(){
  const mj=currentMijing;if(!mj)return;
  const d=s.discipleList.find(x=>x.id===mj.discipleId)||topDisciple();
  const isFork=mj.currentRoom&&mj.currentRoom.type==='fork';
  let html='<div class="modal-title realm">'+mj.realm.ic+' '+mj.realm.name+'</div>';
  html+='<div class="modal-sub">弟子 '+d.name+' · 第 '+(isFork?mj.roomIndex+1:mj.roomIndex)+' / '+mj.totalRooms+' 层</div>';
  html+='<div class="mijing-log">';mj.log.slice(-6).forEach(l=>{html+='<div class="'+(l.cls||'')+'">'+l.text+'</div>'});html+='</div>';
  html+='<div class="report-gain"><div class="rg-item"><div class="rg-val" style="color:'+(mj.damage>=50?'var(--red)':mj.damage>=20?'var(--orange)':'var(--green)')+'">'+mj.damage+'%</div><div class="rg-lbl">伤势</div></div><div class="rg-item"><div class="rg-val">'+fmtExp(mj.totalExp)+'</div><div class="rg-lbl">修为</div></div><div class="rg-item"><div class="rg-val">'+fmtCoin(mj.totalStone)+'</div><div class="rg-lbl">毛</div></div></div>';
  if(isFork){
    html+='<div class="event-box"><div class="event-ask"><span class="hl">▸ 岔 路 三 选 一</span></div>';
    html+='<button class="choice-btn" data-path="left"><div class="choice-name"><span>🌑 左路（幽暗）</span><span class="tag risky">高风险</span></div><div class="choice-desc">大概率战斗</div></button>';
    html+='<button class="choice-btn" data-path="right"><div class="choice-name"><span>✨ 右路（灵光）</span><span class="tag safe">稳妥</span></div><div class="choice-desc">宝物或灵药</div></button>';
    html+='<button class="choice-btn" data-path="center"><div class="choice-name"><span>❓ 中路（未知）</span><span class="tag info">随机</span></div><div class="choice-desc">完全随机</div></button></div>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});
    el.modalCard.querySelectorAll('[data-path]').forEach(b=>{b.onclick=(e)=>{e.stopPropagation();AudioSys.click();resolveForkChoice(b.dataset.path)}});
    return;
  }
  if(mj.roomIndex>=mj.totalRooms)html+='<button class="btn gold" style="width:100%;padding:15px" id="mijingFinish">完 成 秘 境</button>';
  else{
    html+='<button class="btn realm" style="width:100%;padding:15px" id="mijingNext">继 续 深 入</button>';
    html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="mijingRetreat">就 此 退 出</button>';
  }
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html,{noClose:true});
  const nb=$('mijingNext');if(nb)nb.onclick=(e)=>{e.stopPropagation();AudioSys.click();runMijingRoom()};
  const rb=$('mijingRetreat');if(rb)rb.onclick=(e)=>{e.stopPropagation();AudioSys.click();finishMijing(true)};
  const fb=$('mijingFinish');if(fb)fb.onclick=(e)=>{e.stopPropagation();AudioSys.click();finishMijing(false)};
}
function applyInjuryFromMijing(dmg){if(dmg<30)return null;let inj=INJURY_DURATIONS[0];for(const x of INJURY_DURATIONS){if(dmg>=x.min)inj=x}return inj}
function finishMijing(early){
  const mj=currentMijing;if(!mj||mj.finished)return;mj.finished=true;
    const d=s.discipleList.find(x=>x.id===mj.discipleId)||topDisciple();
  const mul=worldBuffMul('treasure');
  if(mul>1){
    mj.totalExp=mj.totalExp.mul(mul);
    mj.totalStone=mj.totalStone.mul(mul);
  }
  const moonMul=moonMijingMul();
  if(moonMul>1){
    mj.totalExp=mj.totalExp.mul(moonMul);
    mj.totalStone=mj.totalStone.mul(moonMul);
  }
  s.stones=s.stones.add(mj.totalStone);
  if(d){
    d.exp=d.exp.add(mj.totalExp);
    const inj=applyInjuryFromMijing(mj.damage);
    if(inj){
      const _sp=getSpecialty(d);
      const spMul=_sp.injuryMul||1;
      const u=Date.now()+inj.ms*spMul;
      if(!d.injuryUntil||d.injuryUntil<u)d.injuryUntil=u;
      s.flags.mijingInjured=true;
      changeLoyalty(d,-3);
      tryShowRite('first_injury');
    } else if(!early){
      changeLoyalty(d,3);
    }
  }
  const cd=Math.round(mj.realm.cooldown*legacyMijingCdMul());
  if(s.mijingCooldowns)s.mijingCooldowns[mj.realm.id]=Date.now()+cd;
  s.stats.mijingDone=(s.stats.mijingDone||0)+1;
  s.stats.todayMijing=(s.stats.todayMijing||0)+1;
  addWeekStat('mijing');
  addYearStat('greatEvents');
  if(mj.damage===0&&!early)s.flags.mijingPerfect=true;
  checkDailyTasks();checkWeeklyTasks();
  let html='<div class="modal-title '+(early?'red':'green')+'">'+(early?'秘 境 归 来':'秘 境 完 成')+'</div>';
  html+='<div class="modal-sub">'+mj.realm.name+' · '+(early?'提前退出':'通关 '+mj.totalRooms+' 层')+' · 冷却 '+fmtDur(cd/1000)+'</div>';
  html+='<div class="mijing-log" style="max-height:26vh">';mj.log.slice(-10).forEach(l=>{html+='<div>'+l.text+'</div>'});html+='</div>';
  html+='<div class="report-gain"><div class="rg-item"><div class="rg-val">+'+fmtExp(mj.totalExp)+'</div><div class="rg-lbl">修为</div></div><div class="rg-item"><div class="rg-val">+'+fmtCoin(mj.totalStone)+'</div><div class="rg-lbl">毛</div></div><div class="rg-item"><div class="rg-val">'+(mj.damage>0?mj.damage+'%':'无伤')+'</div><div class="rg-lbl">伤势</div></div></div>';
  if(mul>1)html+='<div class="tip-box good" style="text-align:center">💎 天下「秘宝」加成 ×'+mul+' 已生效</div>';
  if(d&&isInjured(d))html+='<div class="tip-box warn" style="text-align:center">🩹 弟子受伤 · 修为速度 -50% · 忠诚 -3</div>';
  if(mj.damage===0&&!early)html+='<div class="tip-box good" style="text-align:center">🛡️ 无伤通关！忠诚 +3</div>';
  html+='<button class="btn gold" style="width:100%;padding:15px" id="mijingDone">收 到</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html,{noClose:true});
  addChronicle('mijing','秘境「'+mj.realm.name+'」 · '+(early?'提前退出':'通关'));
  AudioSys.mijingReward();flash(early?'red':'gold');
  $('mijingDone').onclick=(e)=>{e.stopPropagation();AudioSys.click();currentMijing=null;checkAchievements();renderUI();openMijingSelect()};
  save();
}
function mijingRoomBattle(d,mul){
  const _sp=getSpecialty(d);
  const spMul=_sp.mijingBattleMul||1;
  const roll=Math.random();
  const ep=d.level*1.6+mul*10+15;
  const mp=d.level*1.0+d.comprehension/30+d.luck/50;
  const r=mp/ep;
  if(r>1.6||roll<0.10)return{result:'great',text:'轻松击败对手。',reward:{exp:Math.floor((2*mul*d.level+10)*spMul)}};
  if(r>1.1||roll<0.45)return{result:'good',text:'苦战后击败对手。',reward:{exp:Math.floor((1*mul*d.level+5)*spMul)}};
  if(r>0.8||roll<0.75)return{result:'ok',text:'勉强击退，受了些伤。',reward:{exp:Math.floor((0.5*mul*d.level)*spMul)},damage:15};
  return{result:'bad',text:'不敌对手，仓皇逃出。',reward:{},damage:30};
}
function mijingRoomTreasure(d,mul){const luck=d.luck/100,r=Math.random();if(r<luck*0.35)return{result:'great',text:'发现宝箱！',reward:{stone:Math.floor(50*mul)}};if(r<luck*0.7)return{result:'good',text:'找到些毛。',reward:{stone:Math.floor(20*mul)}};if(r<0.9)return{result:'ok',text:'零散毛。',reward:{stone:Math.floor(5*mul)}};return{result:'bad',text:'假宝箱。',reward:{}}}
function mijingRoomTrap(d,mul){const luck=d.luck/100,r=Math.random();if(r<luck*0.5)return{result:'great',text:'躲过陷阱，发现暗格。',reward:{stone:Math.floor(30*mul)}};if(r<luck*0.8)return{result:'good',text:'仅受轻伤。',damage:10};if(r<0.85)return{result:'ok',text:'受了点伤。',damage:20};return{result:'bad',text:'身受重伤。',damage:40}}
function mijingRoomHerb(d,mul){const r=Math.random();if(r<0.3)return{result:'great',text:'千年灵药！',reward:{exp:Math.floor((3*mul*d.level+20)),stone:Math.floor(8*mul)}};if(r<0.7)return{result:'good',text:'采到几株灵草。',reward:{exp:Math.floor((1*mul*d.level+5)),stone:Math.floor(3*mul)}};if(r<0.9)return{result:'ok',text:'普通草药。',reward:{stone:Math.floor(mul)}};return{result:'bad',text:'灵兽守护。',reward:{}}}
function mijingRoomAltar(d,mul){const r=Math.random();if(r<0.15)return{result:'great',text:'顿悟！',reward:{exp:Math.floor((5*mul*d.level+50))},heal:30};if(r<0.4)return{result:'good',text:'灵气让弟子受益。',reward:{exp:Math.floor((1.5*mul*d.level+10))},heal:20};if(r<0.7)return{result:'ok',text:'静坐片刻。',heal:15};if(r<0.9)return{result:'bad',text:'受了些惊。',damage:10};return{result:'awful',text:'黑暗能量！',damage:35}}
function mijingRoomFork(){return{type:'fork',result:'info',text:'岔路口。',reward:{}}}
function rollMijingRoom(d,mul){const t=weightedPick(MIJING_ROOM_TYPES,'w').id;
  switch(t){case'battle':return Object.assign({type:'battle'},mijingRoomBattle(d,mul));case'treasure':return Object.assign({type:'treasure'},mijingRoomTreasure(d,mul));case'trap':return Object.assign({type:'trap'},mijingRoomTrap(d,mul));case'herb':return Object.assign({type:'herb'},mijingRoomHerb(d,mul));case'altar':return Object.assign({type:'altar'},mijingRoomAltar(d,mul));case'fork':return Object.assign({},mijingRoomFork())}
  return{type:'fork',result:'info',text:'岔路。',reward:{}};
}

/* ============ 宗门数据总览 ============ */
function openSectStats(){
  if(s.discipleList.length===0){
    let h='<div class="modal-title">宗 门 数 据</div><div class="tip-box" style="text-align:center">还没有弟子</div><div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(h);return;
  }

  // ---- 计算全宗门产出 ----
  let totalExpRate=new Dec(0,0);
  let totalStoneRate=new Dec(0,0);
  const perDisciple=[];
  for(const d of s.discipleList){
    if(isOnExpedition(d)){perDisciple.push({d,exp:null,stone:null});continue}
    const er=discipleExpRate(d);
    const sr=discipleStoneRate(d);
    const up=Math.max(0,Math.min(CONFIG.discipleUpkeepMax,d.upkeep||CONFIG.discipleUpkeepDefault));
    const srNet=sr.mul(1-up);
    totalExpRate=totalExpRate.add(er);
    totalStoneRate=totalStoneRate.add(srNet);
    perDisciple.push({d,exp:er,stone:srNet});
  }
  perDisciple.sort((a,b)=>{
    if(!a.stone)return 1;if(!b.stone)return -1;
    return b.stone.cmp(a.stone);
  });

  let html='<div class="modal-title">宗 门 数 据 总 览</div>';
  html+='<div class="modal-sub">实 时 全 宗 门 产 出</div>';

  // ---- 总产出 ----
  const stoneHour=totalStoneRate.mul(3600);
  const stoneDay=totalStoneRate.mul(86400);
  html+='<div class="settings-group"><div class="settings-group-h">总 产 出</div>';
  html+='<div class="row"><span class="row-label">修为 / 秒</span><span class="row-value gold">'+fmtExp(totalExpRate)+'</span></div>';
  html+='<div class="row"><span class="row-label">修为 / 小时</span><span class="row-value">'+fmtExp(totalExpRate.mul(3600))+'</span></div>';
  html+='<div class="row"><span class="row-label">毛 / 秒（净）</span><span class="row-value gold">'+fmtCoin(totalStoneRate)+'</span></div>';
  html+='<div class="row"><span class="row-label">毛 / 小时</span><span class="row-value">'+fmtCoin(stoneHour)+'</span></div>';
  html+='<div class="row"><span class="row-label">毛 / 天</span><span class="row-value">'+fmtCoin(stoneDay)+'</span></div>';
  html+='</div>';

  // ---- 弟子贡献 ----
  html+='<div class="settings-group"><div class="settings-group-h">弟 子 贡 献</div>';
  perDisciple.forEach(({d,exp,stone})=>{
    const p=getP(d);
    if(!stone){
      html+='<div class="row"><span class="row-label">'+p.ic+' '+d.name+'</span><span class="row-value" style="color:var(--dim)">外派中</span></div>';
      return;
    }
    const expPct=totalExpRate.mul(0).add(exp).div(totalExpRate).toNum()*100;
    const stonePct=stone.div(totalStoneRate).toNum()*100;
    html+='<div class="row"><span class="row-label">'+p.ic+' '+d.name+'</span><span class="row-value" style="font-size:calc(12.5px * var(--fs-scale))">修为 '+fmtExp(exp)+'/s（'+expPct.toFixed(1)+'%）<br>毛 '+fmtCoin(stone)+'/s（'+stonePct.toFixed(1)+'%）</span></div>';
  });
  html+='</div>';

  // ---- 当前加成 ----
  html+='<div class="settings-group"><div class="settings-group-h">当 前 生 效 加 成</div>';
  const mo=moonOrder();
  html+='<div class="row"><span class="row-label">月令</span><span class="row-value gold">'+mo.ic+' '+mo.n+'</span></div>';
  const tx=getTianxiang();
  html+='<div class="row"><span class="row-label">天象</span><span class="row-value" style="color:var(--purple)">'+tx.icon+' '+tx.name+'</span></div>';
  const wbs=activeWorldBuffs();
  if(wbs.length>0){
    wbs.forEach(w=>{
      const wt=WORLD_EVENT_TYPES.find(x=>x.id===w.type);
      if(wt)html+='<div class="row"><span class="row-label">天下 · '+wt.n+'</span><span class="row-value">×'+w.buffMul+'</span></div>';
    });
  }
  if(dailyBuffActive())html+='<div class="row"><span class="row-label">今日已毕</span><span class="row-value green">修为 ×2</span></div>';
  html+='<div class="row"><span class="row-label">洞府</span><span class="row-value">Lv.'+s.cave+'（修为 +'+(s.cave*20)+'%，毛 +'+(s.cave*12)+'%）</span></div>';
  html+='<div class="row"><span class="row-label">藏经阁</span><span class="row-value">Lv.'+s.buildings.scripture+'（修为 +'+(s.buildings.scripture*10)+'%）</span></div>';
  html+='<div class="row"><span class="row-label">演武场</span><span class="row-value">Lv.'+s.buildings.arena+'（突破 +'+(s.buildings.arena*1.5).toFixed(1)+'%）</span></div>';
  html+='<div class="row"><span class="row-label">炼丹房</span><span class="row-value">Lv.'+s.buildings.alchemy+'（事件 +'+(s.buildings.alchemy*2)+'%）</span></div>';
  html+='<div class="row"><span class="row-label">护山大阵</span><span class="row-value">Lv.'+s.buildings.array+'（负面 -'+(s.buildings.array*5)+'%）</span></div>';
  const totalLegacy=Object.values(s.legacyTree||{}).reduce((a,b)=>a+b,0);
  html+='<div class="row"><span class="row-label">传承树</span><span class="row-value purple">'+totalLegacy+' 点</span></div>';
  html+='<div class="row"><span class="row-label">遗物</span><span class="row-value">'+(s.relics||[]).length+' 件</span></div>';
  html+='<div class="row"><span class="row-label">纪元</span><span class="row-value gold">第 '+(s.eras+1)+' 纪（永久 ×'+Math.pow(ERA_BONUS,s.eras)+'）</span></div>';
  html+='</div>';

  // ---- 累计数据 ----
  html+='<div class="settings-group"><div class="settings-group-h">累 计 数 据</div>';
  html+='<div class="row"><span class="row-label">累计突破</span><span class="row-value">'+totalBreaksAll()+' 次</span></div>';
  html+='<div class="row"><span class="row-label">累计收徒</span><span class="row-value">'+s.discipleList.length+' 人（在册）</span></div>';
  html+='<div class="row"><span class="row-label">累计外派</span><span class="row-value">'+(s.stats.expeditionsDone||0)+' 次</span></div>';
  html+='<div class="row"><span class="row-label">累计秘境</span><span class="row-value">'+(s.stats.mijingDone||0)+' 次</span></div>';
  html+='<div class="row"><span class="row-label">累计奏章</span><span class="row-value">'+s.totalReports+' 份</span></div>';
  html+='<div class="row"><span class="row-label">立派天数</span><span class="row-value">'+playDays()+' 天</span></div>';
  html+='</div>';

  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
}

/* ============ 帮助（分 tab） ============ */
function _helpTabs(active){
  const tabs=[
    {id:'core',n:'核心玩法',ic:'🎯'},
    {id:'disciple',n:'弟子系统',ic:'👥'},
    {id:'world',n:'世界系统',ic:'🌏'}
  ];
  let html='<div style="display:flex;gap:6px;margin-bottom:14px">';
  tabs.forEach(t=>{
    const sel=t.id===active;
    html+='<button class="disc-tab'+(sel?' active':'')+'" data-help-tab="'+t.id+'" style="flex:1">'+t.ic+' '+t.n+'</button>';
  });
  html+='</div>';
  return html;
}
function _helpCoreContent(){
  let html='';
  html+='<div class="help-section"><div class="help-h">📖 你是掌门</div><div class="help-p">你是掌门。弟子在你门下修行。<br>你只需<span class="hl">批阅奏章、定方向、批资源</span>。</div></div>';
  html+='<div class="help-section"><div class="help-h">📅 每日签到</div><div class="help-p">每天首次打开游戏弹签到。<span class="hl">7 天一轮</span>：<br>· 第 1/2/4/6 天给毛<br>· 第 3 天给修为<br>· 第 5 天给道具（破障丹 / 招贤令 / 洗髓丹 / 延寿丹）<br>· 第 7 天给大额毛<br><span class="hl">断签不清零</span>，只重置连续天数。累计天数保留。<br><span class="hl">毛奖励</span>随全宗门产出自动缩放，越到后期越多。</div></div>';
  html+='<div class="help-section"><div class="help-h">📊 宗门月旦评</div><div class="help-p">每周一凌晨 4 点刷新 <span class="hl">3 个周目标</span>。<br>完成 1 个给毛，全部完成额外给一件稀有道具。<br>周目标包括：突破、秘境、事件、签到、收徒、外派、天象等。</div></div>';
  const _moonCdH=Math.round(CONFIG.moonOrderCooldown/3600000);
  html+='<div class="help-section"><div class="help-h">🌙 掌门月令</div><div class="help-p">宗门当前方针，随时可切换，<span class="hl">每 '+_moonCdH+' 小时只能切换一次</span>。<br>五种月令：<br>· <span class="hl">🧘 潜修</span>：修为 +25%，毛 -15%<br>· <span class="hl">💰 敛财</span>：毛 +30%，修为 -10%<br>· <span class="hl">⚔️ 历练</span>：外派与秘境收益 +20%<br>· <span class="hl">🤝 外交</span>：忠诚 +0.2/天，天下事件收益 +30%<br>· <span class="hl">🌿 休养</span>：忠诚 +0.5/天，产出 -15%<br>主界面月令行显示当前方针与冷却倒计时，点击可切换。</div></div>';
  html+='<div class="help-section"><div class="help-h">🪙 一毛拜师</div><div class="help-p">弟子入门时带一份<span class="hl">拜师礼</span>。你可以选择<span class="hl">回赠见面礼</span>。<br>回赠越多，弟子忠诚度越高，<span class="hl">弟子留的毛越少</span>：<br>· 分文不取：忠诚 30，弟子留 30% 毛（你拿 70%），花费 0<br>· 回赠一半：忠诚 55，弟子留 15% 毛（你拿 85%），花费 0.5 倍拜师礼<br>· 等额回赠：忠诚 75，弟子留 5% 毛（你拿 95%），花费 1 倍拜师礼<br>· 双倍回赠：忠诚 95，弟子全数上缴（你拿 100%），花费 <span class="hl">总毛 50%</span>（至少 5 倍拜师礼）<br><span class="hl">双倍回赠的弟子骄纵</span>：忠诚会自然回落，叛逃概率 ×1.5。</div></div>';
  html+='<div class="help-section"><div class="help-h">👥 弟子上限</div><div class="help-p">基础弟子上限由<span class="hl">累计突破次数</span>决定：<br>· 第 2 名：15 次突破<br>· 第 3 名：45 次<br>· 第 4 名：100 次<br>· 第 5 名：170 次<br>· 第 6 名：250 次<br>另外每次收徒后有 <span class="hl">2 小时冷却</span>。<br><span class="hl">传承树「广收门徒」</span>每级额外 +1 弟子位，最多 +2。</div></div>';
  html+='<div class="help-section"><div class="help-h">🏆 14 亿里程碑</div><div class="help-p">毛每跨过一个大关，会给称号或遗物：<br>· 1 万：称号「略有家资」<br>· 10 万：遗物「第一桶金」（毛 +3%）<br>· 100 万：称号「富甲一方」<br>· 1000 万：遗物「钱庄印记」（毛 +5%）<br>· 1 亿：称号「富可敌国」<br>· 10 亿：遗物「金山之影」（毛 +10%）</div></div>';
  html+='<div class="help-section"><div class="help-h">❤️ 忠诚度</div><div class="help-p">忠诚度 0-100，会因日常相处缓慢变化。<br><span class="hl">高于 50 会自然向 50 回落</span>，需要月令「休养」或丹修维持。<br>提升来源：每日相处、突破成功、事件成功、无伤秘境<br>下降来源：受伤、突破失败、事件失利<br><span class="hl">忠诚低于 30 的弟子可能叛逃</span>（每 4 小时检查一次，概率上限 20%）。<br><span class="hl">等级效果：</span></div>';
  html+='<div class="help-p loyalty-table">';
  LOYALTY_TIERS.forEach(t=>{html+='<div class="loyalty-row2"><span class="lvl">'+t.ic+' '+t.n+'（'+t.min+'+）</span><span class="eff">'+t.desc+'</span></div>'});
  html+='</div></div>';
  html+='<div class="help-section"><div class="help-h">⏳ 寿元与化道</div><div class="help-p">弟子有年龄。修为越高，寿元越长（<span class="hl">80 + 等级×5</span>）。寿元剩下 10 年以内会显示 ⏳ 提醒。寿元尽了会<span class="hl">化道</span>，留下<span class="hl">遗物</span>永久加成。</div></div>';
  html+='<div class="help-section"><div class="help-h">🧙 副掌门</div><div class="help-p">聘用副掌门后，<span class="hl">无事件的日常奏章会自动合并</span>成一份「副掌门汇总」。<br>报酬：每份奏章抽取 <span class="hl">10% 的毛</span>。<br>你只需要处理带事件的奏章。</div></div>';
  html+='<div class="help-section"><div class="help-h">📋 今日修行</div><div class="help-p">每日任务凌晨 <span class="hl">4 点</span>刷新。有未完成任务时，菜单按钮上会有红点。<br><span class="hl">全部完成</span>时，额外获得 5 分钟全宗门修为 ×2 加成。</div></div>';
  html+='<div class="help-section"><div class="help-h">📜 奏章堆积</div><div class="help-p">弟子定期上奏，最多攒 <span class="hl">20 份</span>。满了会暂停生成，但修为和毛仍在累积。离线回来会生成 <span class="hl">1 份闭关总结</span>，超过 2 小时会附带一段<span class="hl">离线小叙事</span>。</div></div>';
  html+='<div class="help-section"><div class="help-h">🎁 待生效道具</div><div class="help-p">道具通过 <span class="hl">签到 / 周常 / 成就</span>获得。<br>· <span class="hl">破障丹</span>：首席下次突破 +50%<br>· <span class="hl">招贤令</span>：下个弟子必为天才<br>· <span class="hl">同心结</span>：自动撮合一对弟子为道侣<br>· <span class="hl">洗髓丹</span>：随机弟子属性重掷<br>· <span class="hl">延寿丹</span>：随机弟子 +50 年寿元<br>重复获取同一种待生效道具时，奖励转为毛。</div></div>';
  html+='<div class="help-section"><div class="help-h">🗣️ 方言模式</div><div class="help-p">游戏默认使用<span class="hl">四川方言</span>。可在设置里切换为普通话。</div></div>';
  html+='<div class="help-section"><div class="help-h">👤 关于作者</div><div class="help-p">我是 <span class="hl">Zhao | Struct. E.</span>，一名一级注册结构工程师。<br>完全不懂编程，这个游戏是用 AI 做出来的。<br>如果你发现了 bug，不用告诉我，因为我也不会改。</div></div>';
  return html;
}
function _helpDiscipleContent(){
  let html='';  
  html+='<div class="help-section"><div class="help-h">🎭 弟子性格</div><div class="help-p">每名弟子入门时自带一种性格，<span class="hl">影响修炼方向</span>：<br>· <span class="hl">📚 勤奋</span>：修得快，不擅找毛<br>· <span class="hl">🦊 机灵</span>：毛多，偶尔捡漏<br>· <span class="hl">🛡️ 稳重</span>：收益均衡，事件稳<br>· <span class="hl">🍀 福缘</span>：奇遇多，易结道侣<br>· <span class="hl">⚔️ 好胜</span>：修得快，易结宿敌<br>· <span class="hl">💤 懒散</span>：修得慢，但偶有顿悟<br>· <span class="hl">🤝 忠厚</span>：各项中等，忠诚稳<br>· <span class="hl">🌙 孤僻</span>：修得极快，孤身一人<br>· <span class="hl">🌸 痴情</span>：易结道侣，情之所钟<br><br><span class="hl">每种性格都有 3 段专属剧情</span>，在特定境界触发。走完全部 3 段，会给宗门一件<span class="hl">专属遗物</span>。9 种性格 = 9 套故事 = 9 件遗物。</div></div>';
  html+='<div class="help-section"><div class="help-h">⚔️ 弟子专精</div><div class="help-p">每名弟子入门时随机获得一项专精：<br>· <span class="hl">⚔️ 剑修</span>：突破 +3%，秘境战斗收益 +20%<br>· <span class="hl">⚗️ 丹修</span>：忠诚恢复 +20%，寿元 +20 年<br>· <span class="hl">🔨 器修</span>：外派收益 +15%<br>· <span class="hl">📜 符修</span>：事件成功率 +5%<br>· <span class="hl">💰 商修</span>：毛产出 +12%<br>· <span class="hl">🛡️ 体修</span>：受伤时间 -50%，修为 +5%</div></div>';
  html+='<div class="help-section"><div class="help-h">💞 宗门关系</div><div class="help-p">弟子入门时会自动生成关系：<br>· <span class="hl">同乡</span>：一起修炼 +5%<br>· <span class="hl">师兄/师弟</span>：互相照顾 +3%<br>· <span class="hl">道侣</span>：双方 +20%<br>· <span class="hl">宿敌</span>：突破率 -5%，事件收益 +50%<br>关系会在弟子列表中显示。</div></div>';
  html+='<div class="help-section"><div class="help-h">📖 弟子个人弧光</div><div class="help-p">每个弟子有<span class="hl">3 段个人剧情</span>，在到达特定境界时触发。<br>完成第 3 段会给宗门一件<span class="hl">专属遗物</span>（永久加成 + 称号）。<br>弟子详情页可以看到弧光进度。</div></div>';
  html+='<div class="help-section"><div class="help-h">🔗 事件链</div><div class="help-p">弟子的事件会有<span class="hl">后续</span>。<br>你上一次的选择，会在若干天后带来新的消息。<br>村中求援、邻宗求和——世界记得你做过的事。</div></div>';
  html+='<div class="help-section"><div class="help-h">🎲 事件概率</div><div class="help-p">每个事件选项下方会显示<span class="hl">成功率</span>和<span class="hl">大失败率</span>的估算。<br>成功率 = 大成功 + 成功 的总概率。<br>估算基于：弟子悟性、福缘、忠诚、专精、性格、灵根、建筑、传承。<br><span class="hl">颜色含义</span>：<br>· <span style="color:var(--green)">绿色 ≥65%</span>：稳<br>· <span style="color:var(--realm)">青色 45-64%</span>：正常<br>· <span style="color:var(--orange)">橙色 30-44%</span>：冒险<br>· <span style="color:var(--red)">红色 &lt;30%</span>：赌<br>注意：估算不是精确值，实际仍受随机影响。</div></div>';
  html+='<div class="help-section"><div class="help-h">💪 突破保底</div><div class="help-p">弟子每次突破失败会累积 <span class="hl">+8% 突破率</span>，最多 +40%。成功后清零。<br>大境界失败只损失 25% 经验（小境界 30%）。</div></div>';
  html+='<div class="help-section"><div class="help-h">✨ 天命之子</div><div class="help-p">收徒时 <span class="hl">0.8%</span> 概率遇到天命之子：资质必为妖孽，所有属性 +50%。</div></div>';
  html+='<div class="help-section"><div class="help-h">⚡ 天劫</div><div class="help-p">弟子大境界突破时，<span class="hl">5% 概率</span>引来天劫（每 5 次大境界突破保底触发一次）。三选一事件：硬抗 / 以宝挡劫 / 逃入洞府。</div></div>';
  return html;
}
function _helpWorldContent(){
  let html='';
  html+='<div class="help-section"><div class="help-h">🧭 外派游历</div><div class="help-p">派 1 名弟子前往某地，<span class="hl">2~4 小时</span>后归来。<br>· <span class="hl">山下集镇</span>（Lv.0）：毛为主<br>· <span class="hl">邻宗坊市</span>（Lv.18）：毛 + 概率道具<br>· <span class="hl">古战场遗迹</span>（Lv.36）：修为为主<br>· <span class="hl">海外仙山</span>（Lv.54）：稀有之地<br>回来时一次性结算，并带回一段见闻。<br>外派期间弟子不产出修为和毛。</div></div>';
  html+='<div class="help-section"><div class="help-h">🌏 天下真实事件</div><div class="help-p">天下消息偶尔（<span class="hl">5% 概率</span>）成真：<br>· <span class="hl">挑战</span>：3 天后某宗派弟子来挑衅<br>· <span class="hl">秘宝</span>：3 天内秘境收益 +50%<br>· <span class="hl">论道</span>：3 天内弟子修为 +15%<br>生效时主界面顶部显示 buff 倒计时。</div></div>';
  html+='<div class="help-section"><div class="help-h">♻️ 传承树</div><div class="help-p">每次纪元转生给 <span class="hl">5 点传承点</span>。<br>7 个永久节点：<br>· 藏经阁精进：藏经阁 +5%/级<br>· 趋吉避凶：事件成功率 +3%/级<br>· 以德服人：新弟子初始忠诚 +5/级<br>· 闭关妙法：离线收益 +10%/级<br>· 秘境通途：秘境冷却 -10%/级<br>· 天命所归：全体突破率 +1%/级<br>· 广收门徒：弟子上限 +1/级（最多 +2）</div></div>';
  html+='<div class="help-section"><div class="help-h">📖 宗门年鉴</div><div class="help-p">每 <span class="hl">30 天</span> 自动生成一份年鉴，记录当年大事：突破、化道、收徒、外派等。<br>可在「年鉴」入口翻阅历史年份。</div></div>';
  html+='<div class="help-section"><div class="help-h">🗺️ 秘境试炼</div><div class="help-p">派弟子进入秘境，走 3-5 层房间。<br>· 低阶冷却 <span class="hl">1 小时</span><br>· 中阶冷却 <span class="hl">3 小时</span><br>· 高阶冷却 <span class="hl">6 小时</span><br>· 传说冷却 <span class="hl">12 小时</span><br>途中会遇到<span class="hl">三选一岔路</span>。受伤会修为减半，且忠诚 -3。<br>成本随首席境界 <span class="hl">×1.05^等级</span> 动态调整。</div></div>';
  html+='<div class="help-section"><div class="help-h">✨ 天象</div><div class="help-p">每 1-3 天，天象会变化一次：<br>· 🌊 灵气潮汐：修为 +30%<br>· 🌑 静默之夜：修为 -20%<br>· 💫 星辰坠世：修为 +15%<br>· ✨ 万法归一：突破率 +5%<br>· 🏆 天下大比：修为 +20%（3 天）<br>· ☁️ 平常日：无效果（最常见）</div></div>';
  html+='<div class="help-section"><div class="help-h">🌏 天下</div><div class="help-p">左上角会飘过天下消息，滚动一遍后自动消失。可在设置里隐藏。<br>其中 <span class="hl">5%</span> 的天下消息会成真，3 天内生效。</div></div>';
  html+='<div class="help-section"><div class="help-h">♻️ 纪元转生</div><div class="help-p">首席达到<span class="hl">大乘</span>后，可在设置中转生。所有弟子转世重修，境界、毛、建筑重置，获得永久 <span class="hl">×3</span> 倍加成。遗物、称号、成就、传承树跨纪元保留。<br><span class="hl">转生时月令冷却与收徒冷却会一并清空</span>，可以立即重新选择方针。</div></div>';
  html+='<div class="help-section"><div class="help-h">📜 全部境界（21 个大境界）</div>';
  html+='<div class="realm-list">';
  REALMS.forEach((r,i)=>{html+='<div class="realm-item"><span class="ri-name" style="color:'+r.c+'">'+r.n+'</span><span class="ri-idx">第'+(i+1)+'阶</span></div>'});
  html+='</div>';
  html+='<div class="help-p" style="margin-top:10px">每个大境界 9 重。走完 21 个大境界 = 189 级 = 第 1 纪结束。</div></div>';
  return html;
}
function openHelp(tab){
  tab=tab||'core';
  let html='<div class="modal-title">玩 法 说 明</div>';
  html+=_helpTabs(tab);
  if(tab==='disciple')html+=_helpDiscipleContent();
  else if(tab==='world')html+=_helpWorldContent();
  else html+=_helpCoreContent();
  html+='<div class="watermark wm-modal">by '+GAME_AUTHOR+' · '+GAME_VERSION+'</div>';
  showModal(html);
  el.modalCard.querySelectorAll('[data-help-tab]').forEach(btn=>{
    btn.onclick=(e)=>{e.stopPropagation();AudioSys.click();openHelp(btn.dataset.helpTab)};
  });
}/* ============ 设置 ============ */
function openSettings(){
  const top=topDisciple();const canReset=top&&top.level>=ERA_RESET_LEVEL;
  let html='<div class="modal-title">设 置</div>';
  html+='<div class="settings-group"><div class="settings-group-h">宗 门 档 案</div>';
  html+='<div class="row"><span class="row-label">掌门</span><span class="row-value">'+s.masterName+(s.masterTitle?(' · '+s.masterTitle):'')+'</span></div>';
  html+='<div class="row"><span class="row-label">弟子</span><span class="row-value">'+s.discipleList.length+' 人</span></div>';
  html+='<div class="row"><span class="row-label">纪元</span><span class="row-value gold">第 '+(s.eras+1)+' 纪</span></div>';
  html+='<div class="row"><span class="row-label">立派天数</span><span class="row-value">'+playDays()+' 天</span></div>';
  html+='<div class="row"><span class="row-label">成就</span><span class="row-value">'+Object.keys(s.achievements).length+' / '+ACHIEVEMENTS.length+'</span></div>';
  html+='<div class="row"><span class="row-label">遗物</span><span class="row-value">'+(s.relics||[]).length+' 件</span></div>';
  html+='<div class="row"><span class="row-label">累计签到</span><span class="row-value">'+(s.signIn.totalDays||0)+' 天</span></div>';
  html+='<div class="row"><span class="row-label">累计登录</span><span class="row-value">'+s.loginDays+' 天</span></div>';
  html+='<div class="row"><span class="row-label">传承点</span><span class="row-value purple">'+availableLegacyPoints()+' / '+totalLegacyPoints()+'</span></div>';
  html+='<div class="row"><span class="row-label">年鉴</span><span class="row-value">'+(s.yearbooks||[]).length+' 份</span></div></div>';
  html+='<div class="settings-group"><div class="settings-group-h">偏 好 设 置</div>';
  html+='<div class="row"><span class="row-label">音效</span><span class="row-value" id="soundToggle" style="cursor:pointer">'+(AudioSys.enabled?'开启':'关闭')+'</span></div>';
  html+='<div class="row"><span class="row-label">震动</span><span class="row-value" id="vibToggle" style="cursor:pointer">'+(s.vibrationEnabled?'开启':'关闭')+'</span></div>';
  html+='<div class="row"><span class="row-label">天下消息</span><span class="row-value" id="tianxiaToggle" style="cursor:pointer;color:var(--gold)">'+(s.showTianxia!==false?'显示':'隐藏')+'</span></div>';
  html+='<div class="row"><span class="row-label">方言模式</span><span class="row-value" id="dialectToggle" style="cursor:pointer;color:var(--gold)">'+(s.dialect==='sc'?'四川话':'普通话')+'</span></div>';
  html+='<div class="row"><span class="row-label">数字格式</span><span class="row-value" id="numFormatToggle" style="cursor:pointer">'+(s.numFormat==='long'?'完整':'紧凑')+'</span></div>';
  html+='<div class="row"><span class="row-label">字体大小</span><span class="row-value" id="fontToggle" style="cursor:pointer">'+(s.fontSize==='small'?'紧凑':(s.fontSize==='large'?'舒适':'标准'))+'</span></div></div>';
  html+='<div class="settings-group"><div class="settings-group-h">帮 助 与 其 他</div>';
  html+='<div class="row" style="cursor:pointer" id="statsBtn"><span class="row-label">📊 宗门数据总览</span><span class="row-value">→</span></div>';
  html+='<div class="row" style="cursor:pointer" id="helpBtn"><span class="row-label">玩法说明</span><span class="row-value">→</span></div></div>';
  html+='<div class="settings-group"><div class="settings-group-h">危 险 操 作</div>';
  if(canReset){
    html+='<div class="tip-box warn"><span class="hl">纪元转生</span>：所有弟子转世重修，境界、毛、建筑重置，获得永久 ×'+ERA_BONUS+' 倍加成。遗物、称号、成就、传承树跨纪元保留。</div>';
    html+='<button class="btn" style="width:100%;margin-bottom:8px;border-color:var(--gold);color:var(--gold);padding:15px" id="eraReset">转 生 进 入 第 '+(s.eras+2)+' 纪</button>';
  }else{
    html+='<div class="tip-box">首席弟子达到<span class="hl">大乘</span>后解锁纪元转生。</div>';
  }
  html+='<button class="btn" style="width:100%;margin-top:8px;border-color:var(--red);color:var(--red)" id="restart">重 新 开 始</button></div>';
  html+='<div class="settings-version">一 毛 修 仙 · '+GAME_VERSION+'<br>Author: '+GAME_AUTHOR+'</div>';
  html+='<div class="watermark wm-modal">by '+GAME_AUTHOR+'</div>';
  showModal(html);
  $('soundToggle').onclick=(e)=>{e.stopPropagation();AudioSys.enabled=!AudioSys.enabled;if(AudioSys.enabled)AudioSys.click();$('soundToggle').textContent=AudioSys.enabled?'开启':'关闭';renderUI();save()};
  $('vibToggle').onclick=(e)=>{e.stopPropagation();s.vibrationEnabled=!s.vibrationEnabled;$('vibToggle').textContent=s.vibrationEnabled?'开启':'关闭';if(s.vibrationEnabled)vibrate([30]);save()};
  $('tianxiaToggle').onclick=(e)=>{e.stopPropagation();s.showTianxia=!s.showTianxia;$('tianxiaToggle').textContent=s.showTianxia?'显示':'隐藏';save();toast(s.showTianxia?'天下消息已显示':'天下消息已隐藏')};
  $('dialectToggle').onclick=(e)=>{e.stopPropagation();s.dialect=(s.dialect==='sc')?'std':'sc';$('dialectToggle').textContent=s.dialect==='sc'?'四川话':'普通话';renderSplashStory();save();toast(s.dialect==='sc'?'已切换为四川话':'已切换为普通话')};
  $('numFormatToggle').onclick=(e)=>{e.stopPropagation();s.numFormat=(s.numFormat==='long')?'short':'long';DEC_LONG_FORMAT=(s.numFormat==='long');$('numFormatToggle').textContent=s.numFormat==='long'?'完整':'紧凑';save();renderUI();toast('已切换')};
  $('fontToggle').onclick=(e)=>{e.stopPropagation();const order=['small','normal','large'];const labels={small:'紧凑',normal:'标准',large:'舒适'};const i=(order.indexOf(s.fontSize)+1)%3;s.fontSize=order[i];applyFontSize();$('fontToggle').textContent=labels[s.fontSize];save();toast('字体：'+labels[s.fontSize])};
  $('statsBtn').onclick=(e)=>{e.stopPropagation();AudioSys.click();openSectStats()};
  $('helpBtn').onclick=(e)=>{e.stopPropagation();AudioSys.click();openHelp()};
  $('restart').onclick=(e)=>{e.stopPropagation();if(!confirm('确定重新开始吗？'))return;restartGame()};
  if(canReset){
    $('eraReset').onclick=(e)=>{
      e.stopPropagation();
      if(!confirm('确定转生进入第 '+(s.eras+2)+' 纪吗？'))return;
      if(!s.firstEraTime)s.firstEraTime=Date.now();
      s.eras++;s.stones=new Dec(100,0);s.cave=0;s.memos=[];
      s.totalReports=0;  // 转生重置报告间隔
      s.buildings={scripture:0,alchemy:0,arena:0,array:0};
      const top=topDisciple();
      if(top){s.ancestralDisciple={name:top.name,personality:top.personality,catchphrase:top.catchphrase};}
      s.discipleList.forEach(d=>{
        d.level=0;d.exp=new Dec(0,0);d.totalBreaks=0;d.totalFails=0;d.failStreak=0;
        d.injuryUntil=0;d.age=Math.floor(randRange(14,22));
        d.legacyChecked=false;d.legacyQuote=null;
        const p=d.personality||'steady';
        const templateArcs=STORY_ARCS[p]||STORY_ARCS.steady;
        d.storyArcs=templateArcs.map(a=>({...a,done:false}));
      });
      s.unreadLog={exp:new Dec(0,0),stone:new Dec(0,0),breaks:[],fails:[]};
      s.autoBank={exp:new Dec(0,0),stone:new Dec(0,0),breaks:[],count:0};
      s.mijingCooldowns={low:0,mid:0,high:0,top:0};
      s.eventChain={};
      s.expeditions=[];
      s.moonOrderChangedAt=0;
      s.lastRecruitAt=0;
      const tx=rollTianxiang();
      s.tianxiangId=tx.id;s.tianxiangUntil=Date.now()+tx.duration;
      s.lastLoyaltyTick=Date.now();
      addChronicle('era','♻️ 转生进入 <span class="hl">第 '+(s.eras+1)+' 纪</span>'+(s.ancestralDisciple?(' · 祖师 <span class="hl">'+s.ancestralDisciple.name+'</span>'):''));
      addYearEvent('era','转生进入第 '+(s.eras+1)+' 纪');
      save();hideModal();renderUI();flash('gold');
      toast('纪元转生 · 第 '+(s.eras+1)+' 纪 · 永久 ×'+Math.pow(ERA_BONUS,s.eras));
      checkAchievements();
      if(!s.tipsSeen.firstLegacy)tryShowTip('firstLegacy');
    };
  }
}
/* ============ 开发者面板（Ctrl+Shift+D 唤起） ============ */
function openDevPanel(){
  if(!s.created){toast('先开档再来');return}
  const top=topDisciple();
  let html='<div class="modal-title purple">🛠 开 发 者 面 板</div>';
  html+='<div class="modal-sub">本地调试用 · 正式版本请勿暴露</div>';
  html+=resourceBar();

  html+='<div class="settings-group"><div class="settings-group-h">资 源</div>';
  html+='<div class="row" style="cursor:pointer" data-dev="stone1"><span class="row-label">+1 万毛</span><span class="row-value gold">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="stone2"><span class="row-label">+100 万毛</span><span class="row-value gold">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="stone3"><span class="row-label">+1 亿毛</span><span class="row-value gold">→</span></div>';
  html+='</div>';

  html+='<div class="settings-group"><div class="settings-group-h">弟 子</div>';
  html+='<div class="row" style="cursor:pointer" data-dev="lvUp"><span class="row-label">首席 +1 级</span><span class="row-value">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="lvUp10"><span class="row-label">首席 +10 级</span><span class="row-value">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="loyalFull"><span class="row-label">全员忠诚拉满</span><span class="row-value green">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="loyalLow"><span class="row-label">全员忠诚清零</span><span class="row-value red">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="injure"><span class="row-label">首席受伤 10 分钟</span><span class="row-value">→</span></div>';
  html+='</div>';

  html+='<div class="settings-group"><div class="settings-group-h">事 件 与 奏 章</div>';
  html+='<div class="row" style="cursor:pointer" data-dev="rollEvent"><span class="row-label">立刻生成一份随机事件</span><span class="row-value">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="spawnMemo"><span class="row-label">立刻生成一份日常奏章</span><span class="row-value">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="clearMemo"><span class="row-label">清空所有未批奏章</span><span class="row-value red">→</span></div>';
  html+='</div>';

  html+='<div class="settings-group"><div class="settings-group-h">冷 却 与 天 象</div>';
  html+='<div class="row" style="cursor:pointer" data-dev="clearCd"><span class="row-label">清空全部冷却</span><span class="row-value">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="rollTx"><span class="row-label">立刻更换天象</span><span class="row-value">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="triggerTj"><span class="row-label">给首席触发一次天劫</span><span class="row-value">→</span></div>';
  html+='</div>';

  html+='<div class="settings-group"><div class="settings-group-h">调 试 输 出</div>';
  html+='<div class="row" style="cursor:pointer" data-dev="logState"><span class="row-label">打印完整状态到控制台</span><span class="row-value">→</span></div>';
  html+='<div class="row" style="cursor:pointer" data-dev="logDisciple"><span class="row-label">打印首席数据到控制台</span><span class="row-value">→</span></div>';
  html+='</div>';

  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+' · DEV</div>';
  showModal(html);

  el.modalCard.querySelectorAll('[data-dev]').forEach(row=>{
    row.onclick=(e)=>{
      e.stopPropagation();
      AudioSys.click();
      const cmd=row.dataset.dev;
      const t=topDisciple();

      if(cmd==='stone1'){s.stones=s.stones.add(Dec.of(10000));toast('+1 万毛')}
      else if(cmd==='stone2'){s.stones=s.stones.add(Dec.of(1000000));toast('+100 万毛')}
      else if(cmd==='stone3'){s.stones=s.stones.add(Dec.of(100000000));toast('+1 亿毛')}
      else if(cmd==='lvUp'){if(t){t.level++;toast('首席 +1 级')}}
      else if(cmd==='lvUp10'){if(t){t.level+=10;toast('首席 +10 级')}}
      else if(cmd==='loyalFull'){s.discipleList.forEach(d=>d.loyalty=100);toast('忠诚拉满')}
      else if(cmd==='loyalLow'){s.discipleList.forEach(d=>d.loyalty=0);toast('忠诚清零')}
      else if(cmd==='injure'){if(t){t.injuryUntil=Date.now()+10*60*1000;toast('首席受伤 10 分钟')}}
      else if(cmd==='rollEvent'){
        const ev=pickEvent();
        if(ev){
          s.memos.push({
            id:'dev_'+Date.now(),time:Date.now(),interval:60000,
            read:false,event:ev,isOffline:false,isAutoBank:false,
            totalExp:new Dec(0,0),totalStone:new Dec(0,0),
            breaks:[],fails:[],voice:'',greeting:'',daily:'',
            chatter:null,bigBreaks:[]
          });
          toast('事件已生成：'+ev.title,2600);
        } else toast('暂无可生成事件');
      }
      else if(cmd==='spawnMemo'){
        const m=generateMemo();
        toast(m?'奏章已生成':'奏章已满');
      }
      else if(cmd==='clearMemo'){
        const n=s.memos.length;
        s.memos=[];
        toast('已清空 '+n+' 份奏章');
      }
      else if(cmd==='clearCd'){
        s.mijingCooldowns={low:0,mid:0,high:0,top:0};
        s.moonOrderChangedAt=0;
        s.lastRecruitAt=0;
        s.lastReport=Date.now();
        toast('冷却已清空');
      }
      else if(cmd==='rollTx'){
        const tx=rollTianxiang();
        s.tianxiangId=tx.id;
        s.tianxiangUntil=Date.now()+tx.duration;
        showTianxiangBanner(tx);
        toast('天象：'+tx.name);
      }
      else if(cmd==='triggerTj'){
        if(t){
          const ok=checkTianjie(t,true);
          toast(ok?'天劫事件已加入奏章':'触发失败（未到大境界？）');
        }
      }
      else if(cmd==='logState'){
        console.log('=== GAME STATE (s) ===');
        console.log(s);
        console.log('纪元：',s.eras,'| 弟子：',s.discipleList.length,'| 毛：',s.stones.format());
        toast('已打印到 F12 控制台');
      }
      else if(cmd==='logDisciple'){
        if(t){
          console.log('=== 首席数据 ===');
          console.log(t);
          console.log('修为产出/秒：',discipleExpRate(t).format());
          console.log('毛产出/秒：',discipleStoneRate(t).format());
          console.log('突破率：',(discipleBreakRate(t)*100).toFixed(1)+'%');
          console.log('忠诚：',t.loyalty,'| 年龄：',t.age,'/ 寿元',lifespan(t));
          toast('已打印到 F12 控制台');
        } else toast('还没有弟子');
      }

      renderUI();
      save();
    };
  });
}
function restartGame(){
  try{localStorage.removeItem(SAVE_KEY)}catch(e){}
  const pa=s.audioEnabled!==false,pv=s.vibrationEnabled!==false,pf=s.fontSize||'normal',pn=s.numFormat||'short',pd=s.dialect||'sc';
  s=createDefaultState();
  s.audioEnabled=pa;s.vibrationEnabled=pv;s.fontSize=pf;s.numFormat=pn;s.dialect=pd;
  DEC_LONG_FORMAT=(s.numFormat==='long');
  applyFontSize();renderSplashStory();
  currentMijing=null;achQueue=[];achShowing=false;lastTopSi=-1;
  ModalQueue.clear();
  el.modal.classList.remove('show');el.menuPop.classList.remove('show');
  el.breakthrough.classList.remove('show');el.achUnlock.classList.remove('show');
  el.ending.classList.remove('show');el.ending.style.pointerEvents='none';
  el.firstRecruit.classList.remove('show');
  el.tutMask.classList.remove('show');el.tutTip.classList.remove('show');
  el.tipBanner.classList.remove('show');el.game.classList.remove('show');
  el.tianxiaBox.classList.remove('dimmed');el.tianxiaBox.innerHTML='';
  el.splash.style.display='none';el.create.style.display='';
  el.create.classList.remove('hide');el.nameInput.value='';
  updateCreate();renderUI();toast('已重新开始',2600);flash('gold');
}
function openDonate(){
  let html='<div class="modal-title">赏 我 一 毛</div>';
  html+='<div class="help-p" style="text-align:center;margin-bottom:14px">兄弟，我就是那个从小做梦的少年。<br>小时候我算过，14亿人每人给我一毛，我就有 <span class="hl">14 亿毛</span>。<br>现在我做了一个游戏，想看看能不能实现这个梦。<br><br><span class="hl">如果你觉得这游戏还不错，可以扫下面的码，赏我一毛。</span><br><br>一毛就够了，真的。<br><br>如果真有 14 亿人每人给我一毛，<br>我就……我就给我老婆一半，剩下的一半自己花。</div>';
  html+='<div class="donate-qr">';
  if(DONATE_QR_IMG)html+='<img src="'+DONATE_QR_IMG+'">';
  else html+='<div style="font-size:44px;opacity:.4">📱</div><div>收款码位置</div>';
  html+='</div>';
  html+='<div style="text-align:center;font-size:calc(11px * var(--fs-scale));color:var(--dimmer);letter-spacing:2px;margin-top:6px">by '+GAME_AUTHOR+'</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
}

/* ============ 教程 ============ */
function runOpeningTut(){
  const steps=tp('tutorial');let i=0;
  function next(){
    if(i>=steps.length){
      s.tutorialDone=true;s.openingTutorialDone=true;save();
      el.tutMask.classList.remove('show');el.tutTip.classList.remove('show');el.tutTip.textContent='';
      setTimeout(()=>{
        if(!s.flags.firstRecruitCinematic){
          s.flags.firstRecruitCinematic=true;save();
          showFirstRecruitCinematic(()=>{openRecruit(true)});
        } else {
          openRecruit(true);
        }
      },500);
      return;
    }
    const step=steps[i];
    el.tutMask.classList.add('show');el.tutTip.textContent='';el.tutTip.classList.add('show');
    const txt=document.createElement('div');txt.textContent=step;el.tutTip.appendChild(txt);
    const btn=document.createElement('button');btn.className='tut-next';btn.textContent=(i===steps.length-1)?'弟 子 来 了':'下 一 步';
    btn.onclick=(e)=>{e.stopPropagation();AudioSys.click();i++;next()};
    el.tutTip.appendChild(btn);
    if(i===0){
      const skip=document.createElement('button');skip.className='tut-skip';skip.textContent='跳过教程';
      skip.onclick=(e)=>{e.stopPropagation();AudioSys.click();i=steps.length;next()};
      el.tutTip.appendChild(skip);
    }
  }
  next();
}

/* ============ 头像/首席点击 ============ */
const CLICK_LINES={
  diligent:['掌门，弟子在修炼。','掌门，弟子正在打坐。','掌门，稍等片刻。','掌门，您手痒了？','掌门请自重。','掌门，我要报警了。'],
  clever:['掌门，有事？','掌门，弟子正忙着数毛。','掌门，弟子在坊市。','掌门，您点我干嘛？','掌门，弟子卖艺不卖身。','掌门，弟子要叫人了。'],
  steady:['掌门。','掌门，弟子在。','掌门有事吩咐？','掌门，弟子听着。','掌门，您已经点了好几下了。','掌门，我报警了。'],
  fated:['掌门，弟子在等机缘。','掌门，您有感？','掌门，弟子刚做了个梦。','掌门，弟子好像在梦里见过这一幕。','掌门，有点玄。','掌门，我报警了。'],
  proud:['掌门，想比划？','掌门，弟子不弱于人。','掌门，您手痒了？','掌门，弟子可以打您吗？','掌门，弟子真的会打的。','掌门，我要叫人了。'],
  lazy:['掌门……弟子睡了……','掌门，弟子在梦游。','掌门，能不能不点……','掌门，弟子在参悟「无为」。','掌门，弟子麻了。','掌门，报警了。'],
  loyal:['掌门！弟子在！','掌门有什么吩咐？','掌门，弟子随时听命。','掌门，您今天心情好？','掌门，您已经点了很多下了。','掌门，弟子不敢说。'],
  loner:['……','……掌门。','……有事？','……嗯。','……','……'],
  romantic:['掌门，弟子在想一个人。','掌门，您是不是也想道侣了？','掌门，弟子害羞。','掌门，弟子心里有人了。','掌门请自重。','掌门，我要报警了。']
};
let lastCharClick=0,charClickCount=0,charBubbleTimer=null;
function showBubble(name,text){
  el.charBubble.innerHTML='<div class="cb-name">'+name+'</div><div class="cb-text">「'+text+'」</div>';
  el.charBubble.classList.add('show');
  const rect=el.charArea.getBoundingClientRect();
  const bw=240;
  el.charBubble.style.left=Math.max(10,Math.min(window.innerWidth-bw-10,rect.left+rect.width/2-bw/2))+'px';
  el.charBubble.style.top=Math.max(60,rect.top-10)+'px';
  el.charBubble.style.transform='translateY(-100%)';
  clearTimeout(charBubbleTimer);
  charBubbleTimer=setTimeout(()=>el.charBubble.classList.remove('show'),2600);
}
function handleCharClick(){
  if(!s.created)return;
  const top=topDisciple();
  if(!top){showTipBanner('👤','还没有弟子');return}
  const now=Date.now();
  if(now-lastCharClick>8000)charClickCount=0;
  lastCharClick=now;charClickCount++;
  const p=getP(top);const lines=CLICK_LINES[p.id]||CLICK_LINES.steady;
  const idx=Math.min(lines.length-1,Math.floor((charClickCount-1)/3));
  AudioSys.tip();
  vibrate(30);
  showBubble(top.name,lines[Math.max(0,idx)]);
}
function handleDotClick(discipleId){
  const d=s.discipleList.find(x=>x.id===discipleId);if(!d)return;
  const p=getP(d);const lines=CLICK_LINES[p.id]||CLICK_LINES.steady;
  AudioSys.tip();
  showBubble(d.name,pick(lines.slice(0,3)));
}
/* ============ 天象系统 ============ */
let tianxiangTimer=null;
function checkTianxiang(){
  if(!s.created)return;
  const now=Date.now();
  if(s.tianxiangUntil>0){
    const remain=s.tianxiangUntil-now;
    if(remain<3600*1000&&remain>0&&(!s.lastTianxiangWarn||now-s.lastTianxiangWarn>2*3600*1000)){
      s.lastTianxiangWarn=now;
      showTipBanner('🔮','天象将变 · 请留意');
      save();
    }
  }
  if(now>=s.tianxiangUntil){
    const tx=rollTianxiang();
    s.tianxiangId=tx.id;s.tianxiangUntil=now+tx.duration;
    addChronicle('tianxiang','☁️ 天象变为「'+tx.name+'」 · '+tx.desc);
    addWeekStat('tianxiang');
    if(tx.id!=='normal')showTianxiangBanner(tx);
    if(tx.id==='spirit_tide')s.flags.tianxiangSpirit=true;
    if(tx.id==='grand_tournament')s.flags.tianxiangGrand=true;
    save();
  }
}
function showTianxiangBanner(tx){
  el.tianxiangBanner.textContent=tx.icon+' 天象：'+tx.name+' · '+tx.desc;
  el.tianxiangBanner.classList.add('show');
  setTimeout(()=>el.tianxiangBanner.classList.remove('show'),4000);
}

/* ============ 天下系统 ============ */
let tianxiaQueue=[];
let tianxiaBusy=false;
let tianxiaTimer1=null,tianxiaTimer2=null;
function pushTianxia(html,isWorld){
  if(!s.showTianxia)return;
  if(!s.created)return;
  tianxiaQueue.push({html,isWorld:!!isWorld});
  if(tianxiaQueue.length>5)tianxiaQueue.shift();
  processTianxiaQueue();
}
function processTianxiaQueue(){
  if(tianxiaBusy)return;
  if(tianxiaQueue.length===0)return;
  tianxiaBusy=true;
  const item=tianxiaQueue.shift();
  el.tianxiaBox.innerHTML='<div class="tianxia-msg'+(item.isWorld?' world-msg':'')+'"><span style="opacity:.6;margin-right:6px">'+(item.isWorld?'【天下 · 真】':'【天下】')+'</span>'+item.html+'</div>';
  const msg=el.tianxiaBox.querySelector('.tianxia-msg');
  if(!msg){tianxiaBusy=false;return}
  requestAnimationFrame(()=>{msg.classList.add('show')});
  clearTimeout(tianxiaTimer1);clearTimeout(tianxiaTimer2);
  const dur=item.isWorld?6500:4200;
  tianxiaTimer1=setTimeout(()=>{
    msg.classList.remove('show');
    msg.classList.add('hide');
    tianxiaTimer2=setTimeout(()=>{
      el.tianxiaBox.innerHTML='';
      tianxiaBusy=false;
      processTianxiaQueue();
    },520);
  },dur);
}
function generateTianxia(){
  const names=['青云','玄机','太虚','问天','忘尘','拂尘','守拙','静虚','抱朴','清霄','紫霄','归元','了尘','无涯'];
  let name;
  if(s.masterName&&Math.random()<0.25){name=s.masterName}
  else{name=pick(names)+pick(['子','道人','真人','上人','老祖'])}
  const apts=['妖孽','天才','上等'];
  const realms=['金丹','元婴','化神','炼虚','合体','大乘'];
  const tpl=pick(TIANXIA_TEMPLATES);
  const html=tpl.replace(/\{name\}/g,name).replace(/\{apt\}/g,pick(apts)).replace(/\{realm\}/g,pick(realms));
  if(Math.random()<0.05&&s.created){
    const ev=createWorldEvent();
    if(ev)return;
  }
  pushTianxia(html,false);
}
function checkTianxia(){
  if(!s.created)return;
  if(!s.showTianxia)return;
  const now=Date.now();
  if(now-(s.lastTianxia||0)<45000)return;
  s.lastTianxia=now;
  if(Math.random()<0.55)generateTianxia();
}


/* ============ 结局 ============ */
function checkEndings(){
  if(!s.created)return;
  for(const e of ENDINGS){
    if(s.endingDismissed&&s.endingDismissed.includes(e.id))continue;
    let hit=false;
    try{hit=e.condition(s)}catch(err){hit=false}
    if(hit){
      if(!s.endingDismissed)s.endingDismissed=[];
      s.endingDismissed.push(e.id);
      if(e.id==='collected')s.flags.endingReached=true;
      addChronicle('milestone','🌟 达成结局：「'+e.title+'」');
      ModalQueue.push((next)=>{showEnding(e,next)});
      save();
      return;
    }
  }
}
function showEnding(e,next){
  el.endingCard.innerHTML='<div class="bk-icon" style="font-size:56px">'+e.icon+'</div><div class="bk-title" style="font-size:36px;letter-spacing:12px;padding-left:12px">'+e.title+'</div><div class="report-body" style="text-align:center;padding:14px 4px;font-size:calc(14px * var(--fs-scale));line-height:2;white-space:pre-line">'+e.text+'</div><button class="btn gold" style="width:100%;padding:15px;margin-top:14px" id="endingOk">继 续 修 行</button>';
  el.ending.style.opacity='1';
  el.ending.style.pointerEvents='auto';
  el.endingCard.style.transform='scale(1)';
  AudioSys.ending();flash('gold');vibrate([100,50,100,50,200]);
  $('endingOk').onclick=(e2)=>{
    e2.stopPropagation();
    AudioSys.click();
    el.ending.style.opacity='0';
    el.ending.style.pointerEvents='none';
    el.endingCard.style.transform='scale(.9)';
    if(next)next();
  };
}
