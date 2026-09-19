/* ============ Supabase 配置（懒加载 + 容错） ============ */
const SUPABASE_URL = 'https://shjitljmrlondnaiojlf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_405PL_a-5yXeq9k6Q9EZPg__JNIhStO';
let supabaseClient = null;

function initSupabase() {
  if (supabaseClient) return true;
  if (typeof window.supabase === 'undefined' || !window.supabase || !window.supabase.createClient) {
    console.warn('⚠️ Supabase SDK 未加载，云端存档不可用');
    return false;
  }
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase 已连接');
    return true;
  } catch(e) {
    console.warn('⚠️ Supabase 初始化失败:', e);
    return false;
  }
}

/* ============ 主循环 ============ */
let lastSaveT=Date.now(),lastUIT=0,lastCultivateT=Date.now();

function gameLoop(){
  const now=Date.now();
  tickCultivation(now);
  if(now-lastUIT>1000){renderUI();lastUIT=now}
  if(now-lastSaveT>10000){save();lastSaveT=now}
}

/* ============ 修炼 tick ============ */
function tickCultivation(now){
  if(!s.created)return;
  const dt=(now-lastCultivateT)/1000;
  lastCultivateT=now;
  if(dt<=0)return;
  const realDt=Math.min(dt,5);   // 防止切页面时爆量
  s.exp+=realDt*CULTIVATE_RATE_ONLINE;
  checkTianjishiDrop(now);
  refreshTianxiang(); checkGufengRefresh(now);
}

/* ============ 天机石掉落 ============ */
function checkTianjishiDrop(now){
  if(s.tianjishi>=TIANJISHI_CAP)return;
  if(!s.nextTianjishiAt){scheduleNextTianjishi(now);return}
  if(now>=s.nextTianjishiAt){
    s.tianjishi=Math.min(TIANJISHI_CAP,s.tianjishi+1);
    AudioSys.tip();
    toast('💎 获得天机石 ×1',2000);
    scheduleNextTianjishi(now);
  }
}
function checkGufengRefresh(now){
  if(!s.created)return;
  if(!s.gufengNextAt){ s.gufengNextAt = now + 2 * 3600 * 1000; return; }
  if(now >= s.gufengNextAt){
    if(s.gufengDate !== todayDateStr()){
      s.gufengCount = 0;
      s.gufengDate = todayDateStr();
    }
        if(s.gufengCount < 5){
      // 时间到了，什么都不做，让按钮保持亮起状态！
      // 绝对不要在这里修改 s.gufengNextAt
    } else {
      s.gufengNextAt = now + 2 * 3600 * 1000;
    }
  }
}

function scheduleNextTianjishi(now){
  const min=TIANJISHI_ONLINE_MIN,max=TIANJISHI_ONLINE_MAX;
  s.nextTianjishiAt=now+min+Math.random()*(max-min);
}




/* ============ 离线结算 ============ */
function settleOffline(hoursAway){
  if(!s.created)return null;
  const offlineHours=Math.min(hoursAway,OFFLINE_CAP_HOURS);
  const offlineSeconds=offlineHours*3600;
  // 修为
  const expGain=offlineSeconds*CULTIVATE_RATE_OFFLINE;
  s.exp+=expGain;
  // 天机石：期望 2 小时 1 颗，±50% 波动
  const expectedStones=offlineHours/2;
  let stones=Math.round(expectedStones);
  stones=Math.max(0,stones+Math.floor(Math.random()*2)-1);
  stones=Math.min(stones,TIANJISHI_CAP-s.tianjishi);
  s.tianjishi+=stones;
  // 判断是否足以突破
  const needed=getExpNeeded(s.realm,s.layer);
  const canBreak=s.exp>=needed;
  const overflowRatio=needed>0?(s.exp-needed)/needed:0;
  return {expGain,stones,offlineHours,canBreak,overflowRatio};
}

/* ============ 突破成功率计算 ============ */
function calcRate(tianjishiUsed){
  tianjishiUsed=tianjishiUsed||0;
  let rate=getBaseRate(s.realm,s.layer);
  // 失败道韵
  rate+=Math.min(s.daoyun,DAOYUN_CAP);
  // 蓄势溢出
  const needed=getExpNeeded(s.realm,s.layer);
  if(s.exp>needed){
    const overflowRatio=Math.min((s.exp-needed)/needed,5);
    rate+=overflowRatio*XUSHI_BONUS_PER;
  }
  // 每日仙缘
  if(s.xianyuanDate!==todayDateStr())rate+=XIANYUAN_BONUS;
  // 连续突破
  const lianpoTiers=[9,7,5,3];
  for(const n of lianpoTiers){
    if(s.lianpo>=n){rate+=LIANPO_BONUS[n];break}
  }
  // 天机石（玩家主动选择的数量）
  rate+=Math.min(tianjishiUsed,TIANJISHI_CAP)*TIANJISHI_BONUS_PER;
  // 天象
  if(isTianxiangDay())rate+=TIANXIANG_BONUS;
  // 上限
  const cap=(s.layer===9)?RATE_CAP_BIG:RATE_CAP_NORMAL;
  return Math.min(rate,cap);
}

function todayDateStr(){
  const d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

/* ============ 突破执行 ============ */
function tryBreakthrough(tianjishiUsed){
  tianjishiUsed=tianjishiUsed||0;
  const needed=getExpNeeded(s.realm,s.layer);
  if(s.exp<needed){toast('修为不足');return}
  const rate=calcRate(tianjishiUsed);
  // 消耗天机石
  if(tianjishiUsed>0)s.tianjishi=Math.max(0,s.tianjishi-tianjishiUsed);
  // 消耗每日仙缘
  if(s.xianyuanDate!==todayDateStr())s.xianyuanDate=todayDateStr();
  // 判定
  const success=Math.random()<rate;
  if(success)onBreakthroughSuccess();
  else onBreakthroughFail();
  save();
  renderUI();
}
function onBreakthroughSuccess(){
  if(!s.firstBreakthroughDone){
    s.firstBreakthroughDone=true;
  }
  const needed=getExpNeeded(s.realm,s.layer);
  s.exp-=needed;
  s.daoyun=0;
  s.lianpo++;
  const oldRealm=s.realm;
  s.layer++;
  let isBig=false;
  if(s.layer>9){
    s.layer=1;
    s.realm++;
    isBig=true;
    if(s.realm>=REALMS.length){
      s.realm=REALMS.length-1;
      s.layer=9;
      s.exp=0;
    }
  }
  // 日记
  s.chronicle.push({
    time:Date.now(),
    text:'突破至 '+getRealmName(s.realm,s.layer),
    type:'breakthrough'
  });
  if(s.chronicle.length>200)s.chronicle=s.chronicle.slice(-200);
  // 演出
  if(isBig)playBigBreakthrough(s.realm);
  else playSmallBreakthrough();
}

function onBreakthroughFail(){
  s.exp=Math.floor(s.exp*0.5);
  s.daoyun=Math.min(DAOYUN_CAP,s.daoyun+DAOYUN_PER_FAIL);
  s.lianpo=0;
  playBreakthroughFail();
}

/* ============ 离线结算弹窗 ============ */
function showOfflineReport(result){
  const h = Math.floor(result.offlineHours);
  const m = Math.floor((result.offlineHours - h) * 60);
  const timeText = h > 0 ? (h + ' 小时 ' + (m > 0 ? m + ' 分' : '') ) : (m + ' 分钟');
  
  let html = '<div class="modal-title">闭 关 归 来</div>';
  
  // 时长
  html += '<div class="offline-time">';
  html += '<div class="ot-icon">🌙</div>';
  html += '<div class="ot-text">'+timeText+'</div>';
  html += '</div>';
  
  // 收益
  html += '<div class="offline-gains">';
  
  // 修为
  html += '<div class="og-item">';
  html += '<div class="og-label">修为</div>';
  html += '<div class="og-value up">+'+fmtNum(result.expGain)+'</div>';
  html += '</div>';
  
  // 天机石
  if(result.stones > 0){
    html += '<div class="og-item">';
    html += '<div class="og-label">天机石</div>';
    html += '<div class="og-value gold">💎 +'+result.stones+'</div>';
    html += '</div>';
  }
  
  html += '</div>';
  
  // 突破提示
  if(result.canBreak){
    const over = Math.round(result.overflowRatio * 100);
    html += '<div class="offline-tip">';
    html += '<div class="ot-tag">✨ 修为已满</div>';
    html += '<div class="ot-desc">弟子已蓄势待发，可以突破</div>';
if(over > 0){
  const xushiPct = Math.min(15, Math.round(over * XUSHI_BONUS_PER));
  html += '<div class="ot-sub">溢出 '+over+'% · 蓄势 +'+xushiPct+'%</div>';
}
    html += '</div>';
  }
  
  html += '<button class="btn gold" style="width:100%;padding:16px;margin-top:14px" id="offlineOk">继 续 修 行</button>';
  html += '<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html, {noClose:true});
  
  AudioSys.tip();
  document.getElementById('offlineOk').onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    hideModal();
    renderUI();
  };
}

/* ============ 音效初始化 ============ */
function ensureAudioInit(){
  const bgm=document.getElementById('bgm');
  if(bgm){
    bgm.addEventListener('ended',()=>{if(s.musicEnabled&&_userHasInteracted)playRandomBgm()});
    bgm.addEventListener('error',()=>{if(s.musicEnabled&&_userHasInteracted)setTimeout(()=>playRandomBgm(),1000)});
  }
  const h=()=>{AudioSys.init();AudioSys.resume();if(bgm&&s.musicEnabled&&bgm.paused&&_userHasInteracted)updateBgm()};
  document.addEventListener('click',h);
  document.addEventListener('touchstart',h);
}

function leaveSomething(){
  if(!s.created||s.discipleList.length===0)return;
  const d=pick(s.discipleList);
  const thing=pick(LEFT_THINGS);
  addDiary(d,thing.icon,thing.text);
  save();
}
const LEFT_THINGS=[
  {icon:'🪨',text:'门口多了一块石头。'},
  {icon:'📜',text:'墙上多了一行字：「今日无事，心却安。」'},
  {icon:'🍵',text:'桌上多了一碗茶，还温着。'},
  {icon:'🌾',text:'窗台上多了一束晒干的草。'},
  {icon:'🪙',text:'案头多了一枚擦得发亮的铜钱。'},
  {icon:'🍂',text:'台阶上多了一片红色的叶子。'}
];

/* ============ 事件绑定 ============ */
el.startBtn.onclick=(e)=>{
  e.stopPropagation();
  AudioSys.init();AudioSys.resume();AudioSys.click();
  updateBgm();
  el.splash.classList.add('hide');
  setTimeout(()=>{
    el.splash.style.display='none';
    el.create.classList.remove('hide');
    el.nameInput.focus();
  },600);
};
el.randomNameBtn.onclick=(e)=>{e.stopPropagation();AudioSys.click();el.nameInput.value=pick(['无名掌门','青云子','玄机子','太虚道人','问天真人','忘尘道人','拂尘子','守拙道人','静虚子','抱朴子']);updateCreate()};
el.nameInput.addEventListener('input',updateCreate);
function updateCreate(){el.createConfirm.disabled=!el.nameInput.value.trim()}
el.importFromCreate.onclick=(e)=>{e.stopPropagation();AudioSys.click();openImport()};
el.createConfirm.onclick=(e)=>{
  e.stopPropagation();
  AudioSys.click();
  s.masterName=el.nameInput.value.trim()||'无名掌门';
  s.created=true;
  s.createdAt=Date.now();
  s.lastVisit=Date.now();
  s.realm=0;
  s.layer=1;
  s.exp=0;
  scheduleNextTianjishi(Date.now());
  save();
  el.create.classList.add('hide');
  setTimeout(()=>{
    el.create.style.display='none';
    el.game.classList.add('show');
    renderUI();spawnParticles();
    lastSaveT=Date.now();lastUIT=Date.now();lastCultivateT=Date.now();
  },600);
};


/* ============ 一键声音 ============ */
if (el.soundQuickBtn) {
  el.soundQuickBtn.onclick = (e) => {
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
    toast(newState ? '🔊 声音已开启' : '🔇 声音已关闭');
  };
}

if(el.helpQuickBtn){el.helpQuickBtn.onclick=(e)=>{e.stopPropagation();AudioSys.click();openHelp()}}

/* ============ 菜单 ============ */
(function(){
  const btn=el.menuBtn;
  btn.onclick=(e)=>{
    e.stopPropagation();
    AudioSys.click();
    el.menuPop.classList.toggle('show');
  };
})();
document.addEventListener('click',(e)=>{if(!el.menuPop.contains(e.target)&&e.target!==el.menuBtn)el.menuPop.classList.remove('show')});
el.menuSave.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openSaveManage()};
el.menuCloud.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openCloudSave()};
el.menuSettings.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openSettings()};
const _mips=$('menuPowerSave');
if(_mips)_mips.onclick=()=>{
  el.menuPop.classList.remove('show');
  AudioSys.click();
  s.powerSave=!s.powerSave;
  document.body.classList.toggle('power-save',!!s.powerSave);
  save();
  toast(s.powerSave?'⚡ 省电模式已开启':'省电模式已关闭');
  const b=$('powerSaveBadge');
  if(b){b.style.display=s.powerSave?'inline-block':'none'}
};

el.importFileInput.addEventListener('change',(e)=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{doImport(ev.target.result)};r.onerror=()=>toast('文件读取失败');r.readAsText(f)});

document.addEventListener('visibilitychange',()=>{
  if(document.hidden){flushSave();return}
  if(!s.created)return;
  lastCultivateT=Date.now();
  checkTianjishiDrop(Date.now());
});
window.addEventListener('beforeunload',flushSave);

/* ============ 初始化 ============ */
function init(){
  const loaded=load();
  applyFontSize();renderSplashStory();
  if(el.splashVersion)el.splashVersion.textContent=GAME_VERSION+' · '+GAME_AUTHOR;
  ensureAudioInit();
  initSupabase();
  if(loaded&&s.created){
    const now=Date.now();
    // 离线结算
    const hoursAway=(now-(s.lastVisit||now))/3600000;
    let offlineShown=false;
    if(hoursAway>0.01){
      const result=settleOffline(hoursAway);
      if(result&&hoursAway>=0.5){
        setTimeout(()=>showOfflineReport(result),900);
        offlineShown=true;
      }
    }
    s.lastVisit=now;
    scheduleNextTianjishi(now);
    el.splash.style.display='none';el.create.style.display='none';el.game.classList.add('show');
    renderUI();spawnParticles();
    lastSaveT=Date.now();lastUIT=Date.now();lastCultivateT=Date.now();
    setTimeout(() => checkCloudUpdate(), 3500);
    // 每日仙缘提示（如果今天还没用过、也没提示过）
    if(s.xianyuanDate!==todayDateStr() && s.xianyuanNotified!==todayDateStr()){
      s.xianyuanNotified=todayDateStr();
      save();
      const delay=offlineShown?2600:900;
      setTimeout(()=>showXianyuanTip(),delay);
    }
  }
}
setInterval(gameLoop,500);
init();



// ===== 右上角菜单点击绑定 =====
// 关闭菜单函数
function hideMenu() {
  el.menuPop.classList.remove('show');
}

// 菜单按钮：展开/收起
if (el.menuBtn) {
  el.menuBtn.onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    el.menuPop.classList.toggle('show');
  };
}
// 点击页面其他地方自动关闭菜单
document.addEventListener('click', () => {
  el.menuPop.classList.remove('show');
});

// 存档管理
if (el.menuSave) {
  el.menuSave.onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    hideMenu();
    openSaveManage();
  };
}

// 云端存档
if (el.menuCloud) {
  el.menuCloud.onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    hideMenu();
    openCloudSave();
  };
}

// 设置
if (el.menuSettings) {
  el.menuSettings.onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    hideMenu();
    openSettings();
  };
}

// ===== 添加到桌面（PWA安装逻辑）=====
let deferredInstallPrompt = null;
// 监听浏览器安装提示事件
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

if (el.menuInstall) {
  el.menuInstall.onclick = async (e) => {
    e.stopPropagation();
    AudioSys.click();
    hideMenu();
    
    if (!deferredInstallPrompt) {
      toast('已添加到桌面，或当前浏览器不支持');
      return;
    }
    // 调出浏览器安装弹窗
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      toast('已成功添加到桌面');
    }
    deferredInstallPrompt = null;
  };
}

/* ============ 云端自动上传 ============ */
let _lastCloudUpload = 0;
let _cloudUploading = false;
const CLOUD_UPLOAD_INTERVAL = 30 * 1000;

async function tryAutoCloudUpload() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  if (_cloudUploading) return;
  const now = Date.now();
  if (now - _lastCloudUpload < CLOUD_UPLOAD_INTERVAL) return;

  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;
    _cloudUploading = true;
    _lastCloudUpload = now;

    const saveData = serializeState();
    const { error } = await supabaseClient
      .from('saves')
      .upsert({ id: user.id, save_data: saveData, updated_at: new Date().toISOString() });

    if (error) {
      console.warn('☁️ 自动上传失败:', error.message);
      _lastCloudUpload = 0;
    } else {
      console.log('☁️ 存档已自动同步到云端');
    }
  } catch(e) {
    console.warn('☁️ 自动上传异常:', e);
  } finally {
    _cloudUploading = false;
  }
}

/* ============ 突破演出 ============ */
function playSmallBreakthrough(){
  // 震动
  document.body.classList.add('shake-screen');
  setTimeout(()=>document.body.classList.remove('shake-screen'),600);
  // 金色 flash
  flash('gold');
  // 光柱
  spawnLightPillar(700);
  // 圆环
  spawnRings(2,'gold');
  // 粒子
  burstParticles(40);
  // 屏幕外发光
  spawnScreenGlow(900,'gold');
  // 大字
  showBigWord('突 破');
  // 音效
  AudioSys.tone(523,0.12);
  AudioSys.tone(659,0.12,'sine',0.06,0.10);
  AudioSys.tone(784,0.20,'sine',0.06,0.20);
  vibrate(40);
}

function playBigBreakthrough(realmIdx){
  const realmName=(REALMS[realmIdx]||REALMS[0]).n;
  // 强震动
  document.body.classList.add('shake-screen');
  setTimeout(()=>document.body.classList.remove('shake-screen'),900);
  // 全屏白闪（比金色更强）
  flash('');
  setTimeout(()=>flash('gold'),120);
  // 光柱
  spawnLightPillar(1100);
  // 圆环
  spawnRings(4,'gold');
  // 粒子
  burstParticles(120);
  // 屏幕外发光
  spawnScreenGlow(1400,'gold');
  // 大字
  showBigWord(realmName);
  // 音效
  AudioSys.tone(523,0.12);
  AudioSys.tone(659,0.12,'sine',0.06,0.10);
  AudioSys.tone(784,0.12,'sine',0.06,0.20);
  AudioSys.tone(1047,0.20,'sine',0.08,0.30);
  AudioSys.tone(1318,0.30,'sine',0.08,0.45);
  AudioSys.tone(1568,0.40,'sine',0.06,0.60);
  vibrate(120);
}
function playBreakthroughFail(){
  // 红色闪
  flash('red');
  // 轻微震动
  document.body.classList.add('shake-screen');
  setTimeout(()=>document.body.classList.remove('shake-screen'),400);
  // 暗色屏幕外发光
  spawnScreenGlow(700,'red');
  // 失败大字
  showFailWord('突 破 失 败');
  // 音效
  AudioSys.tone(300,0.20,'sawtooth',0.06);
  AudioSys.tone(200,0.28,'sawtooth',0.05,0.12);
  vibrate(80);
}

function showBigWord(text){
  const el2 = document.createElement('div');
  el2.textContent = text;
  el2.style.cssText = 'position:fixed;left:50%;top:42%;' +
    'transform:translate(-50%,-50%) scale(0.3);' +
    'z-index:9999;pointer-events:none;' +
    'font-family:"Songti SC","STSong",Georgia,serif;' +
    'font-size:72px;font-weight:900;letter-spacing:16px;' +
    'color:#fff5d0;' +
    'text-shadow:0 0 20px rgba(230,196,115,1),0 0 60px rgba(230,196,115,.9),0 0 120px rgba(230,196,115,.6),0 0 200px rgba(230,196,115,.4);' +
    'padding-left:16px;' +
    'opacity:0;' +
    'transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s ease-out;' +
    'white-space:nowrap;';
  document.body.appendChild(el2);
  requestAnimationFrame(()=>{
    el2.style.opacity = '1';
    el2.style.transform = 'translate(-50%,-50%) scale(1.15)';
  });
  setTimeout(()=>{
    el2.style.transform = 'translate(-50%,-50%) scale(1)';
  }, 500);
  setTimeout(()=>{
    el2.style.transition = 'transform 0.8s ease-in, opacity 0.8s ease-in';
    el2.style.opacity = '0';
    el2.style.transform = 'translate(-50%,-140%) scale(1.3)';
  }, 1600);
  setTimeout(()=>el2.remove(), 2600);
}

function showFailWord(text){
  const el2=document.createElement('div');
  el2.textContent=text;
  el2.style.cssText='position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:9999;pointer-events:none;font-size:28px;font-weight:900;letter-spacing:8px;color:#e58a8a;text-shadow:0 0 20px rgba(229,138,138,.8);opacity:1;transition:opacity 1s';
  document.body.appendChild(el2);
  setTimeout(()=>{el2.style.opacity='0'},600);
  setTimeout(()=>el2.remove(),1700);
}

function burstParticles(count){
  const cx=window.innerWidth/2,cy=window.innerHeight*0.4;
  for(let i=0;i<count;i++){
    const p=document.createElement('div');
    const angle=Math.random()*Math.PI*2;
    const speed=100+Math.random()*250;
    const size=4+Math.random()*6;
    p.style.cssText='position:fixed;left:'+cx+'px;top:'+cy+'px;width:'+size+'px;height:'+size+'px;border-radius:50%;background:radial-gradient(circle,#fff,#e6c473);box-shadow:0 0 10px #e6c473;z-index:9998;pointer-events:none;transition:transform 1.2s cubic-bezier(0,0.9,0.5,1),opacity 1.2s';
    document.body.appendChild(p);
    requestAnimationFrame(()=>{
      p.style.transform='translate('+(Math.cos(angle)*speed)+'px,'+(Math.sin(angle)*speed)+'px) scale(0)';
      p.style.opacity='0';
    });
    setTimeout(()=>p.remove(),1400);
  }
}

/* ============ 光柱 ============ */
function spawnLightPillar(duration){
  const pillar = document.createElement('div');
  pillar.style.cssText = 'position:fixed;left:50%;top:0;width:120px;height:100vh;' +
    'transform:translateX(-50%) scaleX(0.1);' +
    'background:linear-gradient(to bottom,rgba(255,240,200,0) 0%,rgba(255,235,170,.95) 30%,rgba(230,196,115,.7) 70%,rgba(230,196,115,0) 100%);' +
    'filter:blur(8px);' +
    'opacity:0;z-index:9997;pointer-events:none;' +
    'transition:transform '+duration+'ms cubic-bezier(0.16,1,0.3,1),opacity '+duration+'ms ease-out;';
  document.body.appendChild(pillar);
  requestAnimationFrame(()=>{
    pillar.style.transform = 'translateX(-50%) scaleX(1.8)';
    pillar.style.opacity = '1';
  });
  setTimeout(()=>{
    pillar.style.opacity = '0';
    pillar.style.transform = 'translateX(-50%) scaleX(3)';
  }, duration - 200);
  setTimeout(()=>pillar.remove(), duration + 200);
}

/* ============ 圆环扩散 ============ */
function spawnRings(count, color){
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.42;
  for(let i=0; i<count; i++){
    const ring = document.createElement('div');
    const size = 60;
    const delay = i * 130;
    ring.style.cssText = 'position:fixed;left:'+cx+'px;top:'+cy+'px;' +
      'width:'+size+'px;height:'+size+'px;' +
      'margin-left:'+(-size/2)+'px;margin-top:'+(-size/2)+'px;' +
      'border-radius:50%;' +
      'border:3px solid rgba(230,196,115,.9);' +
      'box-shadow:0 0 30px rgba(230,196,115,.9),inset 0 0 20px rgba(230,196,115,.5);' +
      'opacity:0;z-index:9997;pointer-events:none;' +
      'transform:scale(0.3);' +
      'transition:transform 1.1s cubic-bezier(0.16,1,0.3,1),opacity 1.1s ease-out;';
    document.body.appendChild(ring);
    setTimeout(()=>{
      ring.style.opacity = '1';
      ring.style.transform = 'scale(1)';
      requestAnimationFrame(()=>{
        setTimeout(()=>{
          ring.style.opacity = '0';
          ring.style.transform = 'scale(9)';
        }, 60);
      });
    }, delay);
    setTimeout(()=>ring.remove(), delay + 1300);
  }
}

/* ============ 屏幕外发光 ============ */
function spawnScreenGlow(duration, color){
  const glow = document.createElement('div');
  let glowColor = 'rgba(255,255,255,.7)';
  if(color === 'gold') glowColor = 'rgba(230,196,115,.55)';
  else if(color === 'red') glowColor = 'rgba(229,138,138,.5)';
  glow.style.cssText = 'position:fixed;inset:0;z-index:9996;pointer-events:none;' +
    'box-shadow:inset 0 0 200px 80px '+glowColor+',inset 0 0 400px 160px '+glowColor.replace(',.55',',.25')+';' +
    'opacity:0;' +
    'transition:opacity '+duration+'ms ease-out;';
  document.body.appendChild(glow);
  requestAnimationFrame(()=>{
    glow.style.opacity = '1';
  });
  setTimeout(()=>{
    glow.style.opacity = '0';
  }, duration - 300);
  setTimeout(()=>glow.remove(), duration + 200);
}

/* ============ 每日仙缘提示 ============ */
function showXianyuanTip(){
  let html = '<div class="modal-title">🌅 今 日 仙 缘</div>';
  html += '<div class="modal-sub">天地灵气格外浓郁</div>';
  html += '<div class="profile-block" style="border-left-color:var(--gold)">';
  html += '<div class="profile-block-content" style="text-align:center;padding:18px 8px;font-size:calc(15px * var(--fs-scale));line-height:2">';
  html += '今日首次突破<br><span class="hl" style="font-size:calc(22px * var(--fs-scale))">+15%</span><br>成功率';
  html += '</div></div>';
  html += '<button class="btn gold" style="width:100%;padding:15px" id="xianyuanOk">好</button>';
  html += '<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html, {noClose:true});
  document.getElementById('xianyuanOk').onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    hideModal();
  };
  AudioSys.tip();
}