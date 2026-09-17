/* ============ 主循环 ============ */
let lastSaveT=Date.now(),lastUIT=0,lastReportCheck=Date.now(),lastTickT=Date.now(),lastQuickUIT=0;
let lastSlowCheckT=0;
function renderQuickStats() {
  if (!s.created) return;
  
  // 1. 更新毛的数字（并处理闪烁特效）
  try { 
    // 防御性检查：如果 s.stones 不存在或格式不对，立刻重置为 0
    if (!s.stones || typeof s.stones.toNum !== 'function') {
      s.stones = new Dec(0, 0);
    }
    const txt = fmtCoinVal(s.stones);
    el.stoneText.textContent = (txt === undefined || txt === null || txt === '') ? '0' : txt;
    
    // 新增：数字弹跳动画
    if (!el.stoneText.classList.contains('bump')) {
      el.stoneText.classList.add('bump');
      setTimeout(() => el.stoneText.classList.remove('bump'), 200);
    }

    if (s.stoneFlashFlag) {
      el.stoneText.classList.remove('flash');
      void el.stoneText.offsetWidth; // 触发重绘
      el.stoneText.classList.add('flash');
      s.stoneFlashFlag = false;
    }
  } catch(e) {
    // 如果出错，把错误打印在控制台，并且强制显示为 0
    console.error('毛数值渲染失败:', e);
    if (el.stoneText) el.stoneText.textContent = '0';
  }
  
  // 2. 更新修为进度条
  const top = topDisciple();
  if (top) {
    const need = expNeed(top.level);
    const ratio = top.exp.div(need).toNum();
      // 新增：缓存进度条更新，只有文本变化时才重绘
      const newExpText = fmtExp(top.exp) + ' / ' + fmtExp(need);
      if (el.sectExpText.textContent !== newExpText) {
          el.sectExpText.textContent = newExpText;
          el.sectExpFill.style.width = Math.max(0, Math.min(100, ratio * 100)) + '%';
      }
  }
  
  // 3. 更新下次汇报倒计时
  const interval = getReportInterval();
  const nextTime = Math.max(0, (s.lastReport + interval - Date.now()) / 1000);
  if (el.rtText) el.rtText.textContent = fmtTime(nextTime);
  if (el.rtFill) el.rtFill.style.width = Math.max(0, Math.min(100, (Date.now() - s.lastReport) / interval * 100)) + '%';
}
function gameLoop(){
  const now=Date.now();
  if(now-lastTickT>=1000){
    const dt=Math.min((now-lastTickT)/1000,5);
    if(s.created&&s.discipleList.length>0){s.online=true;tickDiscipleGains(dt,false)}
    s.lastTick=now;lastTickT=now;
    tickAge();tickLoyalty();tickEnergy();
  }
  if(now-lastUIT>1000){renderUI();lastUIT=now}
  if(now-lastQuickUIT>200){renderQuickStats();lastQuickUIT=now}
  if(now-lastSaveT>8000){save();lastSaveT=now}
  if(now-lastReportCheck>1000&&s.created&&s.discipleList.length>0){
    lastReportCheck=now;
    const interval=getReportInterval();
    if(now-s.lastReport>=interval){
      s.lastReport=now;
      const memo=generateMemo();
      if(memo&&memo.event&&!el.modal.classList.contains('show')){
        AudioSys.report();
        const un=s.memos.filter(m=>!m.read).length;
        if(un>0)toast('新奏章已送达 · 待批 '+un+' 份');
      }
    }
  }
  if(now-lastSlowCheckT>2500){
    lastSlowCheckT=now;
    checkDailyTasks();checkWeeklyTasks();checkAchievements();checkTriggerTips();checkStoryArcs();
    checkTianxiang();checkTianxia();checkLegacy();checkEndings();
    checkMilestones(false);
    checkGrandTournament();
    processExpeditions();
    processWorldEvents();
    checkYearbook();
    checkDefection();
  }
}function ensureAudioInit(){
  const h = () => {
    AudioSys.init();
    AudioSys.resume();
    
    // 检查 BGM 并在用户交互后播放
    const bgm = document.getElementById('bgm');
    if (bgm) {
      // 首次交互：如果有音乐，开始播放
      if (s.musicEnabled && bgm.paused) {
        updateBgm();
      }
      // 监听播放结束，随机歇 30 秒到 2 分钟后再播
      bgm.addEventListener('ended', () => {
        if (!s.musicEnabled) return;
        const delay = 30000 + Math.random() * 90000; // 30秒 ~ 120秒
        console.log(`🎵 BGM 播放结束，将在 ${Math.round(delay/1000)} 秒后重新播放`);
        setTimeout(() => {
          if (s.musicEnabled && _userHasInteracted) {
            bgm.currentTime = 0;
            bgm.play().catch(e => {});
          }
        }, delay);
      }, { once: false });
    }
    
    setTimeout(() => {
      if (AudioSys.ctx && AudioSys.ctx.state === 'running') {
        if (AudioSys.enabled) AudioSys.audioReady();
      }
    }, 150);
  };
  
  document.addEventListener('click', h);
  document.addEventListener('touchstart', h);
}

/* ============ 事件绑定 ============ */
el.startBtn.onclick=(e)=>{
  e.stopPropagation();
  AudioSys.init();
  AudioSys.resume();
  AudioSys.click();
  
  // 新增：提前预加载 BGM，让浏览器在用户输入名字时就开始缓冲
  const bgm = document.getElementById('bgm');
  if (bgm) {
    bgm.load(); // 强制触发下载
    console.log('📻 开始预加载 BGM');
  }
  
  // 原有的代码：关闭启动页，显示起名界面
  el.splash.classList.add('hide');
  setTimeout(()=>{
    el.splash.style.display='none';
    el.create.classList.remove('hide');
    el.nameInput.focus();
  },600);
};
  
  // ... 原有的代码继续el.splash.classList.add('hide');setTimeout(()=>{el.splash.style.display='none';el.create.classList.remove('hide');el.nameInput.focus()},600)};
el.randomNameBtn.onclick=(e)=>{e.stopPropagation();AudioSys.click();el.nameInput.value=pick(['无名掌门','青云子','玄机子','太虚道人','问天真人','忘尘道人','拂尘子','守拙道人','静虚子','抱朴子']);updateCreate()};
el.nameInput.addEventListener('input',updateCreate);
function updateCreate(){el.createConfirm.disabled=!el.nameInput.value.trim()}
el.importFromCreate.onclick=(e)=>{e.stopPropagation();AudioSys.click();openImport()};
el.createConfirm.onclick=(e)=>{
  e.stopPropagation();
  AudioSys.click();
  s.masterName=el.nameInput.value.trim()||'无名掌门';
  s.created=true;s.createdAt=Date.now();
  s.lastReport=Date.now();s.lastTick=Date.now();s.recentEvents=[];s.lastCheckAge=Date.now();s.lastLoyaltyTick=Date.now();
  s.currentYear={startAt:Date.now(),stats:{breaks:0,deaths:0,recruits:0,greatEvents:0,awfulEvents:0,expeditions:0},events:[]};
  const tx=rollTianxiang();
  s.tianxiangId=tx.id;s.tianxiangUntil=Date.now()+tx.duration;
  ensureDailyTasks();ensureWeekly();save();
  el.create.classList.add('hide');
  setTimeout(()=>{
    el.create.style.display='none';el.game.classList.add('show');
    renderUI();spawnParticles();
    el.charSvg.classList.add('meditate');setTimeout(()=>el.charSvg.classList.remove('meditate'),4000);
    if(!s.openingTutorialDone)setTimeout(()=>runOpeningTut(),800);
    else{
      if(!s.flags.firstRecruitDone&&!s.flags.firstRecruitCinematic){
        s.flags.firstRecruitCinematic=true;save();
        showFirstRecruitCinematic(()=>openRecruit(true));
      } else if(!s.flags.firstRecruitDone){
        openRecruit(true);
      } else {
        openRecruit();
      }
    }
  },600);
};
// 新增：折叠底部UI
let hudCollapsed = false;
const toggleBtn = $('toggleHudBtn');
if(toggleBtn) {
  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    hudCollapsed = !hudCollapsed;
    const rows = document.querySelectorAll('.tianxiang-row, .top-disciple-row, .dots-row, .bar-row, .bar-sub, .info-bottom, .last-break-row, .item-status-row, .phase-goal, .goal-bar');
    rows.forEach(r => r.style.display = hudCollapsed ? 'none' : '');
    toggleBtn.textContent = hudCollapsed ? '▲ 展开详情' : '▼ 收起详情';
  };
}

el.btnReport.onclick=(e)=>{e.stopPropagation();AudioSys.click();if(s.discipleList.length===0){toast('还没有弟子，先收徒');return}openMemos()};
el.btnLijian.onclick=(e)=>{e.stopPropagation();AudioSys.click();openSectHome()};
const dailyBtn = document.getElementById('btnDailySummary');
if(dailyBtn) dailyBtn.onclick = (e) => { e.stopPropagation(); AudioSys.click(); openDailySummary(); };
el.btnRecruit.onclick=(e)=>{
  e.stopPropagation();
  AudioSys.click();
  if(!s.flags.firstRecruitDone&&s.discipleList.length===0){
    openRecruit(true);
  } else {
    openRecruit();
  }
};
el.soundQuickBtn.onclick=(e)=>{
  e.stopPropagation();
  AudioSys.init();
  AudioSys.resume();
  const anyOn = s.musicEnabled || AudioSys.enabled;
  const newState = !anyOn;
  s.musicEnabled = newState;
  AudioSys.enabled = newState;
  updateBgm();
  renderUI();
  save();
  toast(newState ? '声音已开启' : '声音已关闭');
};
el.signInQuickBtn.onclick=(e)=>{
  e.stopPropagation();
  AudioSys.click();
  showSignInModal();
};
if(el.helpQuickBtn){
  el.helpQuickBtn.onclick=(e)=>{
    e.stopPropagation();
    AudioSys.click();
    openHelp();
  };
}
el.menuHelp.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openHelp()};
el.menuDonate.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openDonate()};
(function(){
  const btn=el.menuBtn;
  btn.onclick=(e)=>{
    e.stopPropagation();
    AudioSys.click();
    const w=!el.menuPop.classList.contains('show');
    el.menuPop.classList.toggle('show');
    if(w){tryShowTip('firstMenuOpen')}
  };
})();
document.addEventListener('click',(e)=>{if(!el.menuPop.contains(e.target)&&e.target!==el.menuBtn&&e.target!==el.menuBtnDot)el.menuPop.classList.remove('show')});
el.menuSave.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openSaveManage()};
el.menuSettings.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openSettings()};
if(el.donateFab){
  el.donateFab.onclick=(e)=>{
    e.stopPropagation();
    AudioSys.click();
    openDonate();
  };
  // 5 秒无操作自动淡到 35% 透明度
  let _donateFadeTimer=null;
  function _donateWake(){
    el.donateFab.classList.remove('idle');
    clearTimeout(_donateFadeTimer);
    _donateFadeTimer=setTimeout(()=>el.donateFab.classList.add('idle'),5000);
  }
  el.donateFab.addEventListener('touchstart',_donateWake,{passive:true});
  el.donateFab.addEventListener('mousedown',_donateWake);
  el.donateFab.addEventListener('mouseenter',_donateWake);
  _donateWake();
}
if(el.charArea)el.charArea.addEventListener('click',(e)=>{e.stopPropagation();handleCharClick()});
if(el.moonOrderRow)el.moonOrderRow.addEventListener('click',(e)=>{e.stopPropagation();AudioSys.click();openMoonOrder()});
if(el.taskProgressRow)el.taskProgressRow.addEventListener('click',(e)=>{
  e.stopPropagation();
  AudioSys.click();
  // 优先看未完成的：今日有未完成 → 打开今日；否则打开周任务
  ensureDailyTasks();ensureWeekly();
  const dt=s.daily.tasks||[];
  const wt=s.weekly.tasks||[];
  const dAll=dt.length>0&&dt.every(t=>t.done);
  if(!dAll)openDaily();
  else openWeekly();
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){flushSave();return}
  if(!s.created||s.discipleList.length===0)return;
  const info=processOfflineTime();
  processExpeditions();
  processWorldEvents();
  if(info){
    if(info.generated>0&&!el.modal.classList.contains('show')){AudioSys.report();toast('你离开期间，弟子呈上 '+info.generated+' 份闭关总结',2600)}
    if(info.duration>60*1000){
      ModalQueue.push((next)=>{setTimeout(()=>{showOfflineSummary(info,()=>{
        if(info.offlineBreaks&&info.offlineBreaks.length>0){
          const top=topDisciple();
          if(top){const nr=realmOf(top.level);const or=realmOf(Math.max(0,top.level-1));if(nr.si!==or.si){showBreakthroughModal(top,or,nr,next,false);return}}
        }
        next();
      })},300)});
    }
  }
});
/* Ctrl+Shift+D / Cmd+Shift+D 唤起开发者面板 */
document.addEventListener('keydown',(e)=>{
  const isMod=e.ctrlKey||e.metaKey;
  if(isMod&&e.shiftKey&&(e.key==='D'||e.key==='d')){
    e.preventDefault();
    e.stopPropagation();
    if(!s.created)return;
    openDevPanel();
  }
});
window.addEventListener('beforeunload',flushSave);

/* ============ 本纪史册 / 成就 ============ */
function openChronicle(){
  let html='<div class="modal-title">本 纪 史 册</div><div class="modal-sub">共 '+s.chronicle.length+' 条</div>';
  if(s.chronicle.length===0)html+='<div class="tip-box" style="text-align:center">尚无记录</div>';
  else{
    const g={};s.chronicle.forEach(c=>{const k=fmtDateFull(c.time);if(!g[k])g[k]=[];g[k].push(c)});
    for(const k in g){html+='<div class="chronicle-day">'+k+'</div>';for(const c of g[k])html+='<div class="chronicle-item"><span class="ci-time">'+fmtClock(c.time)+'</span><span class="ci-text">'+c.text+'</span></div>'}
  }
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
}
function openAchievements(){
  const un=Object.keys(s.achievements).length;const tot=ACHIEVEMENTS.length;
  const cTot=ACHIEVEMENTS.filter(a=>a.challenge).length;
  const cUn=ACHIEVEMENTS.filter(a=>a.challenge&&s.achievements[a.id]).length;
  let html='<div class="modal-title">成 就</div><div class="ach-progress">已解锁 '+un+' / '+tot+' · 挑战 '+cUn+' / '+cTot+'</div>';
  ACHIEVEMENTS.forEach(a=>{
    const got=!!s.achievements[a.id];
    const cls=(got?'unlocked':'locked')+(a.challenge?' challenge':'');
    let rs='';
    if(a.reward){
      if(a.reward.stone)rs='+'+fmtCoin(Dec.of(a.reward.stone));
      else if(a.reward.item){const it=SHOP_ITEMS.find(x=>x.id===a.reward.item);if(it)rs=it.n}
    }
    if(a.title)rs+=(rs?' · ':'')+'称号「'+a.title+'」';
    html+='<div class="achievement-item '+cls+'"><div class="ach-icon">'+(got?a.ic:'🔒')+'</div>';
    html+='<div class="ach-info"><div class="ach-name">'+a.n+(a.challenge?'<span class="ch-tag">挑战</span>':'')+'</div><div class="ach-desc">'+a.d+'</div>';
    if(rs)html+='<div class="ach-reward">🎁 '+rs+'</div>';
    html+='</div>';
    if(got)html+='<div class="ach-state">'+fmtDay(s.achievements[a.id])+'</div>';
    html+='</div>';
  });
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+' · '+GAME_VERSION+'</div>';
  showModal(html);
}

/* ============ 初始化 ============ */
function scheduleSignInCheck(delay){
  if(!s.created)return;
  if(!needsSignIn())return;
  setTimeout(()=>{
    ModalQueue.push((next)=>{
      showSignInModal(next);
    });
  },delay||1500);
}
function init(){
  const today=todayStr();
  if(s.lastLoginDay!==today){s.lastLoginDay=today;s.loginDays=(s.loginDays||1)+1}
  const loaded=load();
  ensureDailyTasks();ensureWeekly();applyFontSize();renderSplashStory();
  if(el.splashVersion)el.splashVersion.textContent=GAME_VERSION+' · '+GAME_AUTHOR;
  const _gw=$('gameWatermark');if(_gw)_gw.textContent=GAME_AUTHOR+' · '+GAME_VERSION;
  const _cv=$('createVersion');if(_cv)_cv.textContent='by '+GAME_AUTHOR+' · '+GAME_VERSION;
  ensureAudioInit();
  if(loaded&&s.created&&s.discipleList.length>0){
    el.splash.style.display='none';el.create.style.display='none';el.game.classList.add('show');
    if(!s.tianxiangUntil||Date.now()>=s.tianxiangUntil){
      const tx=rollTianxiang();
      s.tianxiangId=tx.id;s.tianxiangUntil=Date.now()+tx.duration;
    }
    checkMilestones(true);
    processExpeditions();
    processWorldEvents();
    checkYearbook();
    const info=processOfflineTime();
    renderUI();spawnParticles();checkAchievements();
    if(info&&info.duration>60*1000){
      setTimeout(()=>{
        ModalQueue.push((next)=>{setTimeout(()=>{showOfflineSummary(info,()=>{
          if(info.offlineBreaks&&info.offlineBreaks.length>0){
            const top=topDisciple();
            if(top){const nr=realmOf(top.level);const or=realmOf(Math.max(0,top.level-1));if(nr.si!==or.si){showBreakthroughModal(top,or,nr,next,false);return}}
          }
          next();
        })},300)});
      },900);
    }
    scheduleSignInCheck(1800);
    lastSaveT=Date.now();lastReportCheck=Date.now();lastTickT=Date.now();
  }
}
setInterval(gameLoop, 200);
init();