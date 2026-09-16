/* ============ 弟子生成 ============ */
function buildStory(d){return[pick(STORY_TEMPLATES.origin).replace(/\{name\}/g,d.name),pick(STORY_TEMPLATES.reason),pick(STORY_TEMPLATES.wish)]}
function rollGift(aptId,chosen){const range=GIFT_BASE[aptId]||[2,6];let v=Math.floor(randRange(range[0],range[1]));if(chosen)v+=20;return v}
function assignRelationships(newD){
  newD.relationships=[];
  if(s.discipleList.length===0)return;
  const others=s.discipleList.slice();
  const eldest=others.reduce((a,b)=>a.joinedAt<b.joinedAt?a:b);
  if(eldest&&eldest.id!==newD.id&&Math.random()<0.35)addRelationship(newD,eldest,'senior');
  const sh=shuffle(others);let count=(newD.relationships||[]).length;
  for(const other of sh){
    if(count>=3)break;
    if(newD.relationships.some(r=>r.targetId===other.id))continue;
    if(!other.relationships)other.relationships=[];
    if(other.relationships.some(r=>r.targetId===newD.id))continue;
    const roll=Math.random();const p1=getP(newD),p2=getP(other);
    if(roll<0.20){addRelationship(newD,other,'fellow');count++}
    else if(roll<0.28){if((p1.id==='romantic'||p1.id==='fated')&&(p2.id==='romantic'||p2.id==='fated')){addRelationship(newD,other,'lover');count++}}
    else if(roll<0.40){if(p1.id==='proud'||p1.id==='loner'||p2.id==='proud'||p2.id==='loner'){addRelationship(newD,other,'rival');count++}}
  }
}
function addRelationship(d1,d2,type){
  if(!d1||!d2||d1.id===d2.id)return;
  if(!d1.relationships)d1.relationships=[];
  if(!d2.relationships)d2.relationships=[];
  if(d1.relationships.some(r=>r.targetId===d2.id&&r.type===type))return;
  d1.relationships.push({type,targetId:d2.id});
  d2.relationships.push({type:reverseRelType(type),targetId:d1.id});
}
function generateDisciple(forceChosen,isFirst){
  const p=PERSONALITIES[Math.floor(Math.random()*PERSONALITIES.length)];
  let apt=weightedPick(APTITUDES);
  if(s.discipleList.length===0&&apt.id==='low')apt=APTITUDES[1];
  if(isFirst)apt=APTITUDES[1];
  if(s.nextTalent){apt=APTITUDES[3];s.nextTalent=false}
   const root=weightedPick(ROOT_WEIGHTS,'w').r;
  const specialty=SPECIALTIES[Math.floor(Math.random()*SPECIALTIES.length)].id;
  const isChosen=isFirst?false:(forceChosen||(Math.random()<CONFIG.chosenChance));
  if(isChosen)apt=APTITUDES[4];
  const g=['rootBone','comprehension','luck'][Math.floor(Math.random()*3)];
  const d={
    id:'d'+Date.now()+Math.floor(Math.random()*10000),
        name:uniqueName(),personality:p.id,aptitude:apt.id,root:root,specialty:specialty,
    rootBone:isChosen?95:(g==='rootBone'?Math.floor(randRange(75,100)):Math.floor(randRange(40,100))),
    comprehension:isChosen?95:(g==='comprehension'?Math.floor(randRange(75,100)):Math.floor(randRange(40,100))),
    luck:isChosen?95:(g==='luck'?Math.floor(randRange(75,100)):Math.floor(randRange(40,100))),
    level:0,exp:new Dec(0,0),joinedAt:Date.now(),
    totalBreaks:0,totalFails:0,failStreak:0,bigBreaksSinceTianjie:0,
    chosen:isChosen,story:null,injuryUntil:0,
    loyalty:Math.min(100,50+legacyLoyaltyBonus()),giftGiven:isFirst?1:rollGift(apt.id,isChosen),
    catchphrase:rollCatchphrase(p.id),
    relationships:[],age:Math.floor(randRange(14,22)),
    storyArcs:[],forceBreak:false,
    upkeep:0.15,
    legacyQuote:null,legacyChecked:false
  };
  d.story=buildStory(d);
  const arcs=STORY_ARCS[p.id]||STORY_ARCS.steady;
  d.storyArcs=arcs.map(a=>({...a,done:false}));
  return d;
}
function addChronicle(type,text){if(!s.chronicle)s.chronicle=[];s.chronicle.unshift({time:Date.now(),era:s.eras,type,text});if(s.chronicle.length>MAX_CHRONICLE)s.chronicle.length=MAX_CHRONICLE}

function addYearEvent(type,text){
  if(!s.currentYear)s.currentYear={startAt:Date.now(),stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]};
  s.currentYear.events.push({time:Date.now(),type,text});
  if(s.currentYear.events.length>80)s.currentYear.events.shift();
}
function addYearStat(k,delta){
  if(!s.currentYear)s.currentYear={startAt:Date.now(),stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]};
  if(!s.currentYear.stats)s.currentYear.stats={breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0};
  s.currentYear.stats[k]=(s.currentYear.stats[k]||0)+(delta||1);
}

/* ============ 天劫 ============ */
function checkTianjie(d,isBig){
  if(!isBig)return false;
  d.bigBreaksSinceTianjie=(d.bigBreaksSinceTianjie||0)+1;
  const force=d.bigBreaksSinceTianjie>=CONFIG.tianjieForceInterval;
  const roll=Math.random()<CONFIG.tianjieChance;
  if(!force&&!roll)return false;
  d.bigBreaksSinceTianjie=0;
  const cost=Math.max(30,Math.floor(s.stones.toNum()*CONFIG.tianjieCostRatio));
  s.memos.push({id:'tj_'+Date.now(),time:Date.now(),read:false,totalExp:new Dec(0,0),totalStone:new Dec(0,0),breaks:[],fails:[],voice:'',greeting:'',daily:'',chatter:null,bigBreaks:[],
    event:{id:'tianjie',title:'天劫降临',ask:'弟子突破引来天劫！',tianjie:true,choices:[
      {n:'硬抗天劫',tag:'risky',tagText:'激进',desc:'全力硬抗',outcomes:{great:{w:3,exp:Math.floor(expNeed(d.level).toNum()*0.5),text:'以肉身硬抗！修为暴涨。'},good:{w:5,exp:Math.floor(expNeed(d.level).toNum()*0.2),text:'硬抗，修为大进。'},ok:{w:2,exp:0,text:'勉强撑过。'},bad:{w:3,exp:-Math.floor(expNeed(d.level).toNum()*0.3),text:'受了重伤。'},awful:{w:2,exp:-Math.floor(expNeed(d.level).toNum()*0.6),text:'修为倒退。'}}},
      {n:'以宝挡劫',tag:'cost',tagText:'花费',desc:'花 '+cost+' 毛挡劫',cost:cost,outcomes:{great:{w:2,exp:Math.floor(expNeed(d.level).toNum()*0.3),text:'毛化作光罩。'},good:{w:4,exp:Math.floor(expNeed(d.level).toNum()*0.1),text:'挡下大半。'},ok:{w:3,exp:0,text:'天劫散去。'},bad:{w:2,exp:-Math.floor(expNeed(d.level).toNum()*0.15),text:'仍受了伤。'},awful:{w:1,exp:-Math.floor(expNeed(d.level).toNum()*0.3),text:'重伤。'}}},
      {n:'逃入洞府',tag:'safe',tagText:'保守',desc:'暂停突破',outcomes:{great:{w:1,exp:Math.floor(expNeed(d.level).toNum()*0.05),text:'护住了弟子。'},good:{w:4,exp:0,text:'安然无恙。'},ok:{w:3,exp:0,text:'散去。'},bad:{w:2,exp:-Math.floor(expNeed(d.level).toNum()*0.1),text:'受了波及。'},awful:{w:1,exp:-Math.floor(expNeed(d.level).toNum()*0.2),text:'洞府被劈开。'}}}
    ]}});
  return true;
}

/* ============ 年龄/化道 ============ */
function tickAge(){
  if(!s.created||s.discipleList.length===0)return;
  const now=Date.now();
  if(!s.lastCheckAge)s.lastCheckAge=now;
  const days=Math.floor((now-s.lastCheckAge)/86400000);
  if(days<=0)return;
  s.lastCheckAge=now;
  const toRemove=[];
  for(const d of s.discipleList){d.age+=days;if(d.age>=lifespan(d))toRemove.push(d)}
  for(const d of toRemove)handleDeath(d);
}
function handleDeath(d){
  const relicTypes=[
    {type:'exp',value:0.05,icon:'📖',name:d.name+'的笔记',desc:'修为 +5%（永久）'},
    {type:'stone',value:0.05,icon:'💰',name:d.name+'的玉佩',desc:'毛 +5%（永久）'},
    {type:'break',value:0.02,icon:'⚔️',name:d.name+'的剑',desc:'突破 +2%（永久）'}
  ];
  const relic=pick(relicTypes);relic.fromName=d.name;
  if(!s.relics)s.relics=[];
  s.relics.push(relic);
  if(s.expeditions)s.expeditions=s.expeditions.filter(e=>e.discipleId!==d.id);
  s.discipleList=s.discipleList.filter(x=>x.id!==d.id);
  s.discipleList.forEach(x=>{if(x.relationships)x.relationships=x.relationships.filter(r=>r.targetId!==d.id)});
  s.flags.firstDeath=true;
  addChronicle('death','🕯️ 弟子 <span class="hl">'+d.name+'</span> 化道 · 留下遗物「'+relic.name+'」');
  addYearEvent('death',d.name+' 化道');
  addYearStat('deaths');
  const p=getP(d),r=realmOf(d.level);
  ModalQueue.push((next)=>{
    let html='<div class="rip-box"><div class="rip-avatar">'+p.ic+'</div><div class="rip-name">'+d.name+' 化道</div>';
    html+='<div class="rip-desc">'+r.name+' · 享年 '+d.age+' 岁<br>「'+d.catchphrase+'」<br><br>弟子留下一件遗物：<br><span style="color:var(--purple);font-weight:700">'+relic.icon+' '+relic.name+'</span><br><span style="font-size:calc(12px * var(--fs-scale));color:var(--dim)">'+relic.desc+'</span></div></div>';
    html+='<button class="btn gold" style="width:100%;padding:15px;margin-top:14px" id="ripOk">送 别</button>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});
    AudioSys.death();flash('purple');vibrate([200,100,200]);
    $('ripOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();next()};
  });
  save();
}

/* ============ 忠诚度 ============ */
function changeLoyalty(d,delta,silent){
  const before=d.loyalty||50;
  d.loyalty=Math.max(0,Math.min(100,before+delta));
  const after=d.loyalty;
  if(silent)return;
  if(after-before>=8){
    showBreakFloat('❤️ '+d.name+' 忠诚 +'+Math.round(after-before),'var(--green)');
  }else if(before-after>=8){
    showBreakFloat('💔 '+d.name+' 忠诚 '+Math.round(after-before),'var(--red)');
  }
}
function tickLoyalty(){
  if(!s.created||s.discipleList.length===0)return;
  const now=Date.now();
  if(!s.lastLoyaltyTick)s.lastLoyaltyTick=now;
  const days=Math.floor((now-s.lastLoyaltyTick)/86400000);
  if(days<=0)return;
  s.lastLoyaltyTick=now;
  for(const d of s.discipleList){
    const cur=d.loyalty||50;
    const _sp=getSpecialty(d);
    const spMul=_sp.loyaltyMul||1;
    let drift=0;
    const driftAmt=CONFIG.loyaltyDailyGain*days;
    // 只让不满（<50）自然恢复；高忠诚不再凭空回落
    if(cur<50)drift=Math.min(driftAmt,50-cur);
    // 骄纵弟子仍会回落（1.5 倍速）
    if(d.pampered&&cur>50)drift=-Math.min(driftAmt*1.5,cur-50);
    const moonBonus=moonLoyaltyDaily()*days*spMul;
    d.loyalty=Math.max(0,Math.min(100,cur+drift+moonBonus));
  }
  save();
}

/* ============ 叛逃（4 小时检查一次，概率上限 0.20） ============ */
function checkDefection(){
  if(!s.created||s.discipleList.length<=1)return;
  const now=Date.now();
  if(!s.lastDefectCheck)s.lastDefectCheck=now;
  if(now-s.lastDefectCheck<CONFIG.defectCheckInterval)return;
  s.lastDefectCheck=now;
  for(const d of s.discipleList){
    if((d.loyalty||50)>=CONFIG.loyaltyDefectThreshold)continue;
    if(d.chosen)continue;
    if(isOnExpedition(d))continue;
    const pamperMul=d.pampered?1.5:1;
    const p=Math.min(CONFIG.defectMaxChance,CONFIG.defectBaseChance+(CONFIG.loyaltyDefectThreshold-(d.loyalty||0))*CONFIG.defectLoyaltyScale)*pamperMul;
    if(Math.random()<p){
      if(s.expeditions)s.expeditions=s.expeditions.filter(e=>e.discipleId!==d.id);
      s.discipleList=s.discipleList.filter(x=>x.id!==d.id);
      s.discipleList.forEach(x=>{if(x.relationships)x.relationships=x.relationships.filter(r=>r.targetId!==d.id)});
      addChronicle('leave','🚨 弟子 <span class="hl">'+d.name+'</span> 叛逃（忠诚 '+Math.round(d.loyalty)+'）');
      addYearEvent('leave',d.name+' 叛逃');
      tryShowRite('first_defect');
      ModalQueue.push((next)=>{
        let html='<div class="modal-title red">弟 子 叛 逃</div>';
        html+='<div class="modal-sub">'+d.name+' 离开了宗门</div>';
        html+='<div class="report-body" style="text-align:center;padding:14px 4px;font-size:calc(14px * var(--fs-scale));line-height:2">「'+d.catchphrase+'」<br><br>他没有回头。<br>忠诚，是要用真心换的。</div>';
        html+='<button class="btn gold" style="width:100%;padding:15px;margin-top:14px" id="defectOk">收 到</button>';
        html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
        showModal(html,{noClose:true});
        AudioSys.death();flash('red');vibrate([100,50,100]);
        $('defectOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();next()};
      });
      save();
      break;
    }
  }
}
/* ============ tick ============ */
function tickDiscipleGains(dt,isOffline){
  if(!s.created||s.discipleList.length===0)return;
  const now=Date.now();
  for(const d of s.discipleList){
    if(isOnExpedition(d))continue;
    const eg=discipleExpRate(d).mul(dt);
    d.exp=d.exp.add(eg);
    s.unreadLog.exp=s.unreadLog.exp.add(eg);
    let sg=discipleStoneRate(d).mul(dt);
    const upkeep=Math.max(0,Math.min(CONFIG.discipleUpkeepMax,d.upkeep||CONFIG.discipleUpkeepDefault));
    const myShare=sg.mul(1-upkeep);
    const upShare=sg.sub(myShare);
    s.stones=s.stones.add(myShare);
    s.unreadLog.stone=s.unreadLog.stone.add(myShare);
    s.viceUpkeepPool=(s.viceUpkeepPool||new Dec(0,0)).add(upShare);
    let bg=0;
    while(d.exp.gte(expNeed(d.level))&&bg++<100){
      const isBig=(d.level%9)===8;
      const rate=discipleBreakRate(d)*CONFIG.breakAttemptRate;
      if(Math.random()<rate){
        const usedForceBreak=!!d.forceBreak;
        d.exp=d.exp.sub(expNeed(d.level));
        d.level++;d.totalBreaks++;d.failStreak=0;
        if(d.forceBreak)d.forceBreak=false;
        s.stats.todayBreaks=(s.stats.todayBreaks||0)+1;
        addWeekStat('breaks');
        addYearStat('breaks');
        const newR=realmOf(d.level);
        s.unreadLog.breaks.push({name:d.name,personality:d.personality,level:d.level,isBig:(d.level%9)===0,discipleId:d.id});
        s.lastBreak={name:d.name,realm:newR.name,time:now};
        addChronicle('break','⚡ <span class="hl">'+d.name+'</span> 突破至 <span class="up">'+newR.name+'</span>');
        changeLoyalty(d,CONFIG.loyaltyBreakSuccess,isOffline);
        if(d.relationships&&d.relationships.length>0){
          for(const rel of d.relationships){
            const partner=s.discipleList.find(x=>x.id===rel.targetId);
            if(!partner)continue;
            if(isOnExpedition(partner))continue;
            let bonusPct=0;
            if(rel.type==='lover')bonusPct=0.30;
            else if(rel.type==='senior'||rel.type==='junior')bonusPct=0.10;
            else if(rel.type==='fellow')bonusPct=0.08;
            else if(rel.type==='rival')bonusPct=0.05;
            if(bonusPct>0){
              const bonus=expNeed(Math.max(0,d.level-1)).mul(bonusPct);
              partner.exp=partner.exp.add(bonus);
            }
          }
        }
        if(!isOffline){
          const isBigRealm=isBig||newR.sub===0;
          const isFirstBreak=!s.ritesSeen.first_break;
          if((isBigRealm||isFirstBreak) && ModalQueue.queue.length < 3){
            const oldR=realmOf(d.level-1);
            ModalQueue.push((next)=>{showBreakthroughModal(d,oldR,newR,next,usedForceBreak)});
            tryShowRite('first_break');
            if(isBig)tryShowRite('first_realm');
            if(d.chosen)tryShowRite('first_chosen');
          }else{
            showBreakFloat(d.name+' 突破 '+newR.short+' '+CN[newR.sub]+'重');
            AudioSys.breakthrough();
          }
        }
        if(isBig)checkTianjie(d,isBig);
      }else{
        d.exp=d.exp.sub(expNeed(d.level).mul(isBig?CONFIG.breakFailLossBig:CONFIG.breakFailLossSmall));
        if(d.exp.lt(0))d.exp=new Dec(0,0);
        d.totalFails++;d.failStreak=(d.failStreak||0)+1;
        s.unreadLog.fails.push({name:d.name,personality:d.personality});
        changeLoyalty(d,CONFIG.loyaltyBreakFail,isOffline);
        break;
      }
    }
  }
}

/* ============ 周目标统计 ============ */
function ensureWeekly(){
  const wid=getWeekId();
  if(!s.weekly||s.weekly.weekId!==wid||!Array.isArray(s.weekly.tasks)||s.weekly.tasks.length===0){
    const pool=shuffle(WEEKLY_TASK_POOL).slice(0,3);
    s.weekly={weekId:wid,tasks:pool.map(t=>({id:t.id,done:false,progress:0})),allDoneRewarded:false};
    s.weekStats={breaks:0,mijing:0,events:0,recruits:0,signIns:0,expeditions:0,tianxiang:0};
  }
}
function addWeekStat(k,delta){ensureWeekly();if(!s.weekStats)s.weekStats={breaks:0,mijing:0,events:0,recruits:0,signIns:0,expeditions:0,tianxiang:0};s.weekStats[k]=(s.weekStats[k]||0)+(delta||1)}
function weekProgress(taskId){
  const def=WEEKLY_TASK_POOL.find(x=>x.id===taskId);
  if(!def||!s.weekStats)return 0;
  return s.weekStats[def.stat]||0;
}
function weeklyRewardScale(){
  const top=topDisciple();
  if(!top)return 1;
  return 1+Math.floor(top.level/9)*0.8;
}
function checkWeeklyTasks(){
  ensureWeekly();
  if(!s.weekly.tasks||s.weekly.tasks.length===0)return;
  const allDoneBefore=s.weekly.tasks.every(t=>t.done)||s.weekly.allDoneRewarded;
  const rewardScale=weeklyRewardScale();
  for(const t of s.weekly.tasks){
    if(t.done)continue;
    const def=WEEKLY_TASK_POOL.find(x=>x.id===t.id);if(!def)continue;
    const p=weekProgress(t.id);t.progress=p;
    if(p>=def.target){
      t.done=true;
      if(def.reward.stone){s.stones=s.stones.add(Dec.of(Math.floor(def.reward.stone*rewardScale)))}
      toast('✅ 周目标完成：'+def.n,2600);AudioSys.success();
      addChronicle('weekly','完成周目标「'+def.n+'」');
    }
  }
  const allDone=s.weekly.tasks.length>0&&s.weekly.tasks.every(t=>t.done);
  if(allDone&&!allDoneBefore&&!s.weekly.allDoneRewarded){
    s.weekly.allDoneRewarded=true;
    const rewardId=pick(WEEKLY_BIG_REWARDS);
    const item=SHOP_ITEMS.find(x=>x.id===rewardId);
    s.stats.weeklyFullCount=(s.stats.weeklyFullCount||0)+1;
    addChronicle('weekly','📊 本周月旦评全部完成 · 获得「'+(item?item.n:'奖励')+'」');
    ModalQueue.push((next)=>{
      let html='<div class="bk-icon" style="font-size:44px">📊</div>';
      html+='<div class="modal-title green" style="letter-spacing:6px">月 旦 评 满</div>';
      html+='<div class="modal-sub">本周目标全部完成</div>';
      html+='<div class="report-body" style="text-align:center;padding:14px 4px;font-size:calc(14px * var(--fs-scale));line-height:2">获得周限定奖励<br><span class="hl">「'+(item?item.n:'奖励')+'」</span></div>';
      html+='<button class="btn gold" style="width:100%;padding:15px" id="weeklyOk">收 到</button>';
      html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
      showModal(html,{noClose:true});
      AudioSys.milestone();flash('gold');
      $('weeklyOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();if(item)setTimeout(()=>applyItemReward(rewardId),400);next()};
    });
  }
}

/* ============ 外派系统 ============ */
function getExpeditionProgress(e){
  const now=Date.now();
  const total=e.endAt-e.startAt;
  const done=now-e.startAt;
  return Math.max(0,Math.min(1,done/total));
}
function startExpedition(locationId,discipleId){
  if(!s.expeditions)s.expeditions=[];
  const loc=EXPEDITION_LOCATIONS.find(l=>l.id===locationId);
  if(!loc)return;
  const d=s.discipleList.find(x=>x.id===discipleId);
  if(!d)return;
  if(isOnExpedition(d)){toast('该弟子已在外面');return}
  if(isInMijing(d)){toast('该弟子正在秘境中');return}
  const now=Date.now();
  s.expeditions.push({
    id:'e'+now,
    discipleId,
    locationId,
    startAt:now,
    endAt:now+loc.duration,
    done:false
  });
  addChronicle('expedition','🧭 <span class="hl">'+d.name+'</span> 前往'+loc.n);
  addYearEvent('expedition',d.name+' 前往'+loc.n);
  AudioSys.expedition();
  flash('realm');
  toast('已派出 · '+d.name+' 前往'+loc.n,2600);
  if(!s.tipsSeen.firstExpedition)tryShowTip('firstExpedition');
  save();
}
function finishExpedition(e){
  const d=s.discipleList.find(x=>x.id===e.discipleId);
  if(!d){e.done=true;return null}
  const loc=EXPEDITION_LOCATIONS.find(l=>l.id===e.locationId)||EXPEDITION_LOCATIONS[0];
  const hours=loc.duration/3600000;
  const stoneRate=discipleStoneRate(d).toNum();
  const expRate=discipleExpRate(d).toNum();
  const moonMul=moonExpeditionMul();
  const _sp=getSpecialty(d);
  const spMul=_sp.expeditionMul||1;
  const finalMul=moonMul*spMul;
  const stoneGain=Math.floor(stoneRate*3600*hours*loc.stoneMul*finalMul*randRange(0.85,1.15));
  const expGain=Math.floor(expRate*3600*hours*loc.expMul*finalMul*randRange(0.85,1.15));
  const upkeep=Math.max(0,Math.min(CONFIG.discipleUpkeepMax,d.upkeep||CONFIG.discipleUpkeepDefault));
  const myStone=Math.floor(stoneGain*(1-upkeep));
  s.stones=s.stones.add(Dec.of(myStone));
  d.exp=d.exp.add(Dec.of(expGain));
  const story=pick(loc.stories);
  e.done=true;
  e.result={stone:myStone,exp:expGain,story:story,locName:loc.n};
  s.stats.expeditionsDone=(s.stats.expeditionsDone||0)+1;
  addWeekStat('expeditions');
  addYearStat('expeditions');
  addChronicle('expedition','🧭 <span class="hl">'+d.name+'</span> 从'+loc.n+'归来');
  addYearEvent('expedition',d.name+' 从'+loc.n+'归来');
  checkAchievements();
  save();
  return e.result;
}
function processExpeditions(){
  if(!s.expeditions||!s.expeditions.length)return;
  const now=Date.now();
  const newly=[];let changed=false;
  for(const e of s.expeditions){
    if(!e.done&&now>=e.endAt){
      const r=finishExpedition(e);
      if(r)newly.push({expedition:e,result:r});
      changed=true;
    }
  }
  const before=s.expeditions.length;
  s.expeditions=s.expeditions.filter(e=>!e.done||(now-e.endAt<86400000));
  if(s.expeditions.length!==before)changed=true;
  if(newly.length>0){
    for(const {expedition,result} of newly){
      const d=s.discipleList.find(x=>x.id===expedition.discipleId);
      if(!d)continue;
      ModalQueue.push((next)=>{
        let html='<div class="modal-title realm">🧭 归 来</div>';
        html+='<div class="modal-sub">'+d.name+' 从'+result.locName+'归来</div>';
        html+='<div class="report-from"><div class="report-avatar">'+getP(d).ic+'</div><div class="report-meta"><div class="rm-name">'+d.name+'</div><div class="rm-title">'+realmOf(d.level).name+' · '+getP(d).n+'</div></div></div>';
        html+='<div class="offline-flavor" style="margin:10px 0"><span class="of-icon">📖</span>'+result.story+'</div>';
        html+='<div class="report-gain"><div class="rg-item"><div class="rg-val">+'+fmtExp(Dec.of(result.exp))+'</div><div class="rg-lbl">修为</div></div><div class="rg-item"><div class="rg-val">+'+fmtCoin(Dec.of(result.stone))+'</div><div class="rg-lbl">毛</div></div></div>';
        html+='<button class="btn gold" style="width:100%;padding:15px" id="expOk">收 到</button>';
        html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
        showModal(html,{noClose:true});
        AudioSys.expeditionReturn();flash('gold');
        $('expOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();next()};
      });
    }
  }
  if(changed)save();
}

/* ============ 天下真实事件 ============ */
function rollWorldEvent(){
  const types=WORLD_EVENT_TYPES.filter(t=>t.weight);
  const t=weightedPick(types);
  return t;
}
function createWorldEvent(){
  if(!s.worldEvents)s.worldEvents=[];
  const now=Date.now();
  const t=rollWorldEvent();
  if(s.worldEvents.some(e=>e.type===t.id&&!e.done))return null;
  const names=['青云','玄机','太虚','问天','忘尘','拂尘','守拙','静虚','抱朴','清霄','紫霄','归元','了尘','无涯'];
  const fromName=pick(names)+pick(['宗','门','派','谷','教']);
  let text='';
  if(t.id==='challenge')text=pick(WORLD_CHALLENGE_TEXTS);
  else if(t.id==='treasure')text=pick(WORLD_TREASURE_TEXTS);
  else if(t.id==='sermon')text=pick(WORLD_SERMON_TEXTS);
  const event={
    id:'w'+now+Math.floor(Math.random()*1000),
    type:t.id,
    title:t.n,
    text:text,
    fromName:fromName,
    startAt:now,
    triggerAt:now+3*24*3600*1000,
    buff:t.buff||false,
    buffMul:t.buffMul||1,
    buffEnd:t.buff?now+t.buffDur:0,
    done:false,
    triggered:false
  };
  s.worldEvents.push(event);
  pushTianxia('<span class="t-hl">'+text+'</span>',true);
  s.stats.worldEventsSeen=(s.stats.worldEventsSeen||0)+1;
  addChronicle('world','🌏 '+text);
  addYearEvent('world',text);
  AudioSys.worldEvent();
  if(!s.tipsSeen.firstWorldEvent)tryShowTip('firstWorldEvent');
  return event;
}
function buildWorldChallengeMemo(event){
  const top=topDisciple();
  if(!top)return null;
  const cost=Math.max(50,Math.floor(s.stones.toNum()*0.15));
  return {
    id:'wc_'+Date.now(),
    time:Date.now(),
    interval:60*1000,
    read:false,
    isOffline:false,
    isAutoBank:false,
    totalExp:new Dec(0,0),
    totalStone:new Dec(0,0),
    breaks:[],fails:[],
    voice:'',greeting:'',daily:'',chatter:null,bigBreaks:[],
    event:{
      id:'world_challenge',
      title:'天下挑战 · '+event.fromName,
      ask:event.text,
      worldChallenge:true,
      choices:[
        {n:'应战',tag:'risky',tagText:'激进',desc:'花 '+cost+' 毛',cost:cost,outcomes:{
          great:{w:2,stone:Math.floor(cost*8),exp:Math.floor(expNeed(top.level).toNum()*0.3),text:'大胜！对方灰溜溜地走了。'},
          good:{w:5,stone:Math.floor(cost*3),exp:Math.floor(expNeed(top.level).toNum()*0.1),text:'胜出。'},
          ok:{w:3,stone:Math.floor(cost),text:'打平。'},
          bad:{w:2,stone:-Math.floor(cost*0.5),exp:-Math.floor(expNeed(top.level).toNum()*0.1),text:'输了。'},
          awful:{w:1,stone:-cost,exp:-Math.floor(expNeed(top.level).toNum()*0.2),text:'惨败。'}
        }},
        {n:'婉拒',tag:'safe',tagText:'保守',desc:'不接战',outcomes:{
          great:{w:1,exp:Math.floor(expNeed(top.level).toNum()*0.05),text:'专心修炼，不管闲事。'},
          good:{w:4,exp:0,text:'对方嘲笑几句就走了。'},
          ok:{w:3,exp:0,text:'天下消息淡了。'},
          bad:{w:2,exp:-Math.floor(expNeed(top.level).toNum()*0.02),text:'名声有点受损。'},
          awful:{w:1,exp:-Math.floor(expNeed(top.level).toNum()*0.05),text:'被议论纷纷。'}
        }}
      ]
    }
  };
}
function processWorldEvents(){
  if(!s.worldEvents||!s.worldEvents.length)return;
  const now=Date.now();
  let changed=false;
  for(const e of s.worldEvents){
    if(e.type==='challenge'&&!e.triggered&&!e.done&&now>=e.triggerAt){
      e.triggered=true;
      const memo=buildWorldChallengeMemo(e);
      if(memo&&s.memos.length<MAX_MEMOS){
        s.memos.push(memo);
        AudioSys.report();
        toast('⚔️ 天下挑战已送达',2600);
        e.done=true;
        changed=true;
      } else {
        e.done=true;
        changed=true;
      }
    }
    if(e.buff&&!e.done&&now>=e.buffEnd){
      e.done=true;
      changed=true;
    }
  }
  const before=s.worldEvents.length;
  s.worldEvents=s.worldEvents.filter(e=>!e.done||(now-(e.triggerAt||e.buffEnd||e.startAt)<86400000));
  if(s.worldEvents.length!==before)changed=true;
  if(changed)save();
}

/* ============ 年鉴 ============ */
function checkYearbook(){
  if(!s.created)return;
  if(!s.currentYear)s.currentYear={startAt:Date.now(),stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]};
  const now=Date.now();
  const elapsed=now-s.currentYear.startAt;
  if(elapsed<YEAR_DURATION)return;
  if(!s.yearbooks)s.yearbooks=[];
  const yearNum=s.yearbooks.length+1;
  s.yearbooks.unshift({
    year:yearNum,
    startAt:s.currentYear.startAt,
    endAt:now,
    stats:Object.assign({breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},s.currentYear.stats||{}),
    events:(s.currentYear.events||[]).slice(0,30)
  });
  s.currentYear={startAt:now,stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]};
  addChronicle('year','📖 第 '+yearNum+' 份宗门年鉴生成');
  checkAchievements();
  ModalQueue.push((next)=>{
    let html='<div class="bk-icon" style="font-size:44px">📖</div>';
    html+='<div class="modal-title" style="letter-spacing:8px">年 鉴 已 成</div>';
    html+='<div class="modal-sub">第 '+yearNum+' 份宗门年鉴</div>';
    html+='<div class="report-body" style="text-align:center;padding:14px 4px;font-size:calc(14px * var(--fs-scale));line-height:2">这 30 天，宗门发生了很多事。<br>它们都被记下来了。</div>';
    html+='<button class="btn gold" style="width:100%;padding:15px" id="ybOk">查 看</button>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});
    AudioSys.milestone();flash('gold');
    $('ybOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();openYearbook();next()};
  });
  save();
}

/* ============ 奏章 ============ */
function generateMemo(isOffline){
  if(s.memos.length>=MAX_MEMOS)return null;
  s.totalReports++;
  const interval=getReportInterval();
  const ul=s.unreadLog;
  const memo={id:'m'+Date.now()+Math.floor(Math.random()*1000),time:Date.now(),interval,read:false,event:null,isOffline:!!isOffline,isAutoBank:false,
    totalExp:ul.exp.clone(),totalStone:ul.stone.clone(),breaks:ul.breaks.slice(),fails:ul.fails.slice(),
    voice:'',greeting:'',daily:'',chatter:null,bigBreaks:[]};
  s.unreadLog={exp:new Dec(0,0),stone:new Dec(0,0),breaks:[],fails:[]};
  memo.breaks.forEach(b=>{if(b.isBig)memo.bigBreaks.push({name:b.name,level:b.level,discipleId:b.discipleId})});
  const top=topDisciple();
  if(top){const p=getP(top);memo.greeting=pick(GREETINGS[p.id]);memo.voice=pick(getVoice(top))}
  memo.daily=getDailyDesc();
  if(!isOffline)memo.chatter=pickChatter();
  memo.event=pickEvent();
  if(s.viceEnabled&&!memo.event&&!isOffline){
    const cut=memo.totalStone.mul(VICE_CUT);
    const kept=memo.totalStone.sub(cut);
    s.autoBank.exp=s.autoBank.exp.add(memo.totalExp);
    s.autoBank.stone=s.autoBank.stone.add(kept);
    s.autoBank.breaks.push(...memo.breaks);s.autoBank.count++;
    s.viceCutTotal=(s.viceCutTotal||new Dec(0,0)).add(cut);
    memo.totalStone=kept;
    return memo;
  }
  s.memos.push(memo);
  return memo;
}
function flushAutoBank(){
  if(!s.autoBank||s.autoBank.count===0)return;
  const memo={id:'ab_'+Date.now(),time:Date.now(),interval:60*1000,read:false,event:null,isOffline:false,isAutoBank:true,
    totalExp:s.autoBank.exp.clone(),totalStone:s.autoBank.stone.clone(),breaks:s.autoBank.breaks.slice(),fails:[],
    voice:'',greeting:'',daily:'',chatter:null,bigBreaks:[],autoCount:s.autoBank.count};
  s.memos.unshift(memo);
  s.autoBank={exp:new Dec(0,0),stone:new Dec(0,0),breaks:[],count:0};
}
function applyChoiceOutcome(choice,outcome){
  const o=choice.outcomes[outcome];
  if(choice.cost&&choice.cost>0){const c=Dec.of(choice.cost);if(s.stones.gte(c))s.stones=s.stones.sub(c)}
  if(o){
    let target=null;
    if(o.exp&&s.discipleList.length>1){
      const top=topDisciple();const others=s.discipleList.filter(d=>d.id!==top.id);
      target=(others.length>0&&Math.random()<0.5)?pick(others):top;
    }else if(o.exp)target=topDisciple();
    if(target&&o.exp!==undefined){
      target.exp=target.exp.add(Dec.of(o.exp));
      if(target.exp.lt(0))target.exp=new Dec(0,0);
    }
    if(o.stone){s.stones=s.stones.add(Dec.of(o.stone));if(s.stones.lt(0))s.stones=new Dec(0,0)}
    if(o.loyalty&&target)changeLoyalty(target,o.loyalty); // === 新增：选择会改变弟子 ===
    if(target){
      const tag=choice.tag||'';
      // 激进选择 → 弟子变好胜/孤僻
      if(tag==='risky'&&Math.random()<0.25){
        if(target.personality!=='proud'&&target.personality!=='loner'){
          target.personality='proud';
          target.catchphrase=rollCatchphrase('proud');
          showBreakFloat('⚔️ '+target.name+' 变得好胜','var(--orange)');
        }
      }
      // 保守选择 → 弟子变稳重
      else if(tag==='safe'&&Math.random()<0.15){
        if(target.personality!=='steady'&&target.personality!=='loyal'){
          target.personality='steady';
          target.catchphrase=rollCatchphrase('steady');
          showBreakFloat('🛡️ '+target.name+' 变得稳重','var(--realm)');
        }
      }
      // 事件大成功 → 弟子变福缘
      if(outcome==='great'&&Math.random()<0.20){
        if(target.personality!=='fated'){
          target.personality='fated';
          target.catchphrase=rollCatchphrase('fated');
          showBreakFloat('🍀 '+target.name+' 变得福缘','var(--gold)');
        }
      }
      // 事件大失败 → 弟子变孤僻
      if(outcome==='awful'&&Math.random()<0.25){
        if(target.personality!=='loner'){
          target.personality='loner';
          target.catchphrase=rollCatchphrase('loner');
          showBreakFloat('🌙 '+target.name+' 变得孤僻','var(--purple)');
        }
      }
    }
  }
}

/* ============ 离线 ============ */
function captureSnapshot(){const top=topDisciple();return{level:top?top.level:0,realmName:top?realmOf(top.level).name:'—',stones:s.stones.clone(),discipleCount:s.discipleList.length,totalBreaks:s.discipleList.reduce((a,d)=>a+d.totalBreaks,0),time:Date.now()}}
function processOfflineTime(){
  if(!s.created||s.discipleList.length===0)return null;
  const now=Date.now();const elapsed=Math.max(0,(now-s.lastTick)/1000);
  if(elapsed<1)return null;
  const capped=Math.min(elapsed,MAX_OFFLINE_TICK);
  const before=s.lastSnapshot||captureSnapshot();
  s.online=false;let remaining=capped;
  
  // === 核心优化：动态分块，最多循环 30 次 ===
  const MAX_LOOPS = 30;
  const CHUNK = Math.max(120, capped / MAX_LOOPS); 
  const offlineMul=legacyOfflineMul();
  const offBreaks=[];const bcounts={};
  s.discipleList.forEach(d=>{bcounts[d.id]=d.totalBreaks});
  
  // 记录循环次数，防止极端情况
  let loopCount = 0;
  while(remaining>0 && loopCount < MAX_LOOPS){
    const realDt=Math.min(CHUNK,remaining);
    const dt=realDt*offlineMul;
    tickDiscipleGains(dt,true);
    remaining-=realDt;
    loopCount++;
  }
  
  s.discipleList.forEach(d=>{const delta=d.totalBreaks-(bcounts[d.id]||0);if(delta>0)offBreaks.push({name:d.name,count:delta,level:d.level})});
  s.lastTick=now;s.online=true;
  const interval=getReportInterval();
  const missed=Math.floor(capped*1000/interval);
  const canGen=Math.max(0,MAX_MEMOS-s.memos.length);
  const toGen=Math.min(missed,canGen,5);
  const recent=(s.chronicle||[]).filter(c=>c.time>=now-capped*1000).slice(0,6);
  
  if(toGen>0){
    generateMemo(true);
    for(let i=1;i<toGen;i++){
      if(s.memos.length>=MAX_MEMOS)break;
      s.memos.push({
        id:'m'+Date.now()+'_off'+i+Math.floor(Math.random()*1000),
        time:now-((toGen-i)*interval),
        interval,
        read:false,event:null,isOffline:true,isAutoBank:false,
        totalExp:new Dec(0,0),totalStone:new Dec(0,0),
        breaks:[],fails:[],voice:'',
        greeting:'掌门闭关期间，弟子照常修行。',
        daily:pick(TX.daily.std),
        chatter:null,bigBreaks:[]
      });
    }
  }
  if(capped>=interval/1000)s.lastReport=now-(capped*1000%interval);
  s.lastSnapshot=captureSnapshot();
  // 离线期间最多弹一次突破弹窗，其余转为飘字
  if(s.unreadLog.breaks.length > 0){
    const bigBreaks = s.unreadLog.breaks.filter(b=>b.isBig);
    if(bigBreaks.length > 0){
      const topB = bigBreaks[0];
      const d = s.discipleList.find(x=>x.id===topB.discipleId);
      if(d){ showBreakFloat(d.name+' 离线期间突破至 '+realmOf(d.level).name); }
    }
    // 清空突破队列，避免 ModalQueue 堆积
    s.unreadLog.breaks = [];
  }
  checkAchievements();
  return{duration:capped*1000,missed,generated:toGen,before,after:s.lastSnapshot,keyEvents:recent,offlineBreaks:offBreaks};
}function pickOfflineFlavor(){
  if(!s.lastOfflineFlavor)s.lastOfflineFlavor='';
  const pool=OFFLINE_FLAVORS.filter(f=>f.text!==s.lastOfflineFlavor);
  const f=pick(pool.length>0?pool:OFFLINE_FLAVORS);
  s.lastOfflineFlavor=f.text;
  return f;
}
function showOfflineSummary(info,done){
  const hours=info.duration/3600000;let dt;
  if(hours<1)dt=Math.floor(info.duration/60000)+' 分钟';else if(hours<24)dt=hours.toFixed(1)+' 小时';else dt=Math.floor(hours/24)+' 天 '+Math.floor(hours%24)+' 小时';
  const b=info.before,a=info.after,lvD=a.level-b.level,stD=a.stones.sub(b.stones),bkD=a.totalBreaks-b.totalBreaks;
  let html='<div class="modal-title">闭 关 归 来</div><div class="modal-sub">你离开了 '+dt+'</div>';
  if(info.duration>=2*3600*1000){
    const flavor=pickOfflineFlavor();
    html+='<div class="offline-flavor"><span class="of-icon">'+flavor.icon+'</span>'+flavor.text+'</div>';
  }
  html+='<div class="compare-box">';
  html+='<div class="compare-row"><span class="cr-lbl">首席境界</span><span class="cr-val">'+a.realmName+(lvD>0?'<span class="cr-delta up">+'+lvD+'</span>':'')+'</span></div>';
  html+='<div class="compare-row"><span class="cr-lbl">毛</span><span class="cr-val">'+fmtCoin(a.stones)+(stD.gt(0)?'<span class="cr-delta up">+'+fmtCoin(stD)+'</span>':'')+'</span></div>';
  html+='<div class="compare-row"><span class="cr-lbl">累计突破</span><span class="cr-val">'+a.totalBreaks+(bkD>0?'<span class="cr-delta up">+'+bkD+'</span>':'')+'</span></div>';
  html+='<div class="compare-row"><span class="cr-lbl">弟子</span><span class="cr-val">'+a.discipleCount+' 人</span></div></div>';
  if(info.offlineBreaks&&info.offlineBreaks.length>0){
    html+='<div class="offline-highlights"><div class="oh-title">⚡ 突 破 记 录</div>';
    info.offlineBreaks.slice(0,5).forEach(b=>{html+='<div class="oh-line">· <span class="hl">'+b.name+'</span> 突破 <span class="up">'+b.count+'</span> 次，现 '+realmOf(b.level).name+'</div>'});
    html+='</div>';
  }
  html+='<button class="btn gold" style="width:100%;padding:15px" id="viewMemos">查 看 奏 章</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="dismissOffline">稍 后 再 说</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html,{noClose:true});
  function close(){hideModal();if(done)done()}
  $('viewMemos').onclick=(e)=>{e.stopPropagation();AudioSys.click();close();setTimeout(()=>openMemos(),200)};
  $('dismissOffline').onclick=(e)=>{e.stopPropagation();AudioSys.click();close()};
}

/* ============ 宗门大比（中期跳跃点） ============ */
function checkGrandTournament(){
  if(!s.created||s.discipleList.length===0)return;
  if(s.flags.grandTournamentDone)return;
  if(!s.stones.gte(Dec.of(CONFIG.grandTournamentMao)))return;
  s.flags.grandTournamentDone=true;
  const top=topDisciple();
  const rewardExp=top?expNeed(top.level).mul(3):new Dec(1000,0);
  const rewardStone=s.stones.mul(0.25);
  s.stones=s.stones.add(rewardStone);
  if(top)top.exp=top.exp.add(rewardExp);
  addChronicle('milestone','🏆 宗门大比！全宗门获得巨额奖励');
  addYearEvent('world','宗门大比');
  AudioSys.milestone();flash('gold');vibrate([100,50,100,50,200]);
  ModalQueue.push((next)=>{
    let html='<div class="bk-icon" style="font-size:56px">🏆</div>';
    html+='<div class="bk-title" style="font-size:34px;letter-spacing:10px;padding-left:10px">宗 门 大 比</div>';
    html+='<div class="modal-sub">毛首次突破 1000 万 · 天下震动</div>';
    html+='<div class="report-body" style="text-align:center;padding:14px 4px;font-size:calc(14px * var(--fs-scale));line-height:2">一毛宗之名，传遍天下。<br>各路散修、邻宗掌门，皆来观礼。<br><br><span class="hl">弟子们一战成名。</span></div>';
    html+='<div class="report-gain"><div class="rg-item"><div class="rg-val">+'+fmtExp(rewardExp)+'</div><div class="rg-lbl">首席修为</div></div><div class="rg-item"><div class="rg-val">+'+fmtCoin(rewardStone)+'</div><div class="rg-lbl">毛</div></div></div>';
    html+='<div class="tip-box good" style="text-align:center">🎁 宗门气运大涨 · 全宗门产出提升</div>';
    html+='<button class="btn gold" style="width:100%;padding:15px;margin-top:10px" id="gtOk">收 下</button>';
    html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
    showModal(html,{noClose:true});
    $('gtOk').onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal();next()};
  });
  save();
}

/* ============ 里程碑 ============ */
function checkMilestones(silent){
  if(!s.milestones)s.milestones={};
  let any=false;
  for(const m of MILESTONES){
    if(s.milestones[m.id])continue;
    if(s.stones.gte(Dec.of(m.amount))){
      s.milestones[m.id]=Date.now();
      grantMilestone(m,silent);
      any=true;
    }
  }
  return any;
}
function grantMilestone(m,silent){
  if(m.type==='title'){
    if(!s.masterTitle){s.masterTitle=m.title}
    addChronicle('milestone','🏆 里程碑：'+m.desc+' · 获得称号「'+m.title+'」');
    if(!silent){toast('🏆 '+m.desc+' · 称号「'+m.title+'」',3200);AudioSys.milestone();flash('gold')}
  }else if(m.type==='relic'){
    if(!s.relics)s.relics=[];
    if(!s.relics.some(r=>r.name===m.relic.name)){s.relics.push(m.relic)}
    addChronicle('milestone','🏆 里程碑：'+m.desc+' · 获得遗物「'+m.relic.name+'」');
    if(!silent){toast('🏆 '+m.desc+' · 遗物「'+m.relic.name+'」',3200);AudioSys.milestone();flash('gold')}
  }
  save();
}

/* ============ 传承 ============ */
function checkLegacy(){
  if(!s.ancestralDisciple)return;
  if(!s.discipleList.length)return;
  for(const d of s.discipleList){
    if(d.legacyChecked)continue;
    d.legacyChecked=true;
    if(Math.random()<0.15){
      const q=pick(LEGACY_QUOTES).replace(/\{surname\}/g,s.ancestralDisciple.name.charAt(0));
      d.legacyQuote=q;
      d.catchphrase=q;
      addChronicle('legacy','🕯️ 弟子 <span class="hl">'+d.name+'</span> 似乎带着前世的记忆……');
      showTipBanner('🕯️',d.name+'：「'+q+'」');
      save();
      break;
    }
  }
}
