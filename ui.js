/* ============ DOM ============ */
function applyTheme(c){
  document.documentElement.style.setProperty('--realm',c);
  document.documentElement.style.setProperty('--realm-15',hexToRgba(c,.15));
  document.documentElement.style.setProperty('--realm-30',hexToRgba(c,.3));
  document.documentElement.style.setProperty('--realm-50',hexToRgba(c,.5));
}
function applyFontSize(){document.documentElement.style.setProperty('--fs-scale',String(FS_VALUE()))}
function renderSplashStory(){if(el.splashStory)el.splashStory.innerHTML=t('splash_story')}

/* ============ Modal 队列 ============ */
const ModalQueue={
  queue:[],current:null,MAX:5,
  push(fn,opts){
    opts=opts||{};
    if(this.queue.length>=this.MAX)return;
    if(opts.priority){this.queue.unshift(fn)}else{this.queue.push(fn)}
    if(this.queue.length>this.MAX)this.queue.length=this.MAX;
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

function flash(c){el.flash.className='flash';void el.flash.offsetWidth;if(c)el.flash.classList.add(c);el.flash.classList.add('on')}
let toastTimer=null;
function toast(msg,ms){el.toast.textContent=msg;el.toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.toast.classList.remove('show'),ms||2000)}


/* ============ 主渲染 ============ */
function renderUI(){
  if(!s.created)return;
  // 掌门名
  if(el.playerName)el.playerName.textContent=s.masterName||'无名掌门';
  // 声音按钮
  if(el.soundQuickBtn){
    const on = s.musicEnabled || AudioSys.enabled;
    el.soundQuickBtn.innerHTML = on
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--realm)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 010 7"/><path d="M18.5 5.5a9 9 0 010 13"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--dimmer)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4z"/><path d="M22 9l-5 6"/><path d="M17 9l5 6"/></svg>';
    el.soundQuickBtn.classList.toggle('off', !on);
  }
  // 境界
  if(el.realmName){
    el.realmName.textContent = getRealmName(s.realm, s.layer);
    el.realmName.style.color = getRealmColor(s.realm);
  }
  // 修为条
  const needed = getExpNeeded(s.realm, s.layer);
  const pct = Math.min(100, (s.exp / needed) * 100);
  if(el.expBarFill)el.expBarFill.style.width = pct + '%';
  if(el.expBarText)el.expBarText.textContent = fmtNum(Math.floor(s.exp)) + ' / ' + fmtNum(needed);
  if(el.expRate){
    const rate = CULTIVATE_RATE_ONLINE;
    el.expRate.textContent = '+' + rate.toFixed(1) + ' 修为/秒';
  }
  // 天机石数量
  if(el.tianjishiCount){
    el.tianjishiCount.textContent = s.tianjishi;
  }
  if(el.tianjishiDisplay){
    el.tianjishiDisplay.classList.toggle('full', s.tianjishi >= TIANJISHI_CAP);
  }
    // 突破按钮 + 新手引导
  const isReady = s.exp >= needed;
  if(el.breakthroughBtn && el.btMain && el.btSub){
    if(isReady){
      el.breakthroughBtn.classList.add('ready');
      el.btMain.textContent = '突 破';
      const rate = calcRate(0);
      el.btSub.textContent = '成功率 ' + Math.round(rate * 100) + '%';
      if(el.rateDetailWrap)el.rateDetailWrap.style.display = 'block';
      renderRateDetail();
    } else {
      el.breakthroughBtn.classList.remove('ready');
      el.btMain.textContent = '修 炼 中';
      const remaining = Math.max(0, needed - s.exp);
      const sec = remaining / CULTIVATE_RATE_ONLINE;
      el.btSub.textContent = '还需 ' + fmtDur(sec);
      if(el.rateDetailWrap)el.rateDetailWrap.style.display = 'none';
    }
  }
  // 新手引导提示（isReady 现在在作用域内）
  if(el.tutHint){
    if(isReady && !s.firstBreakthroughDone){
      el.tutHint.style.display = 'flex';
    } else {
      el.tutHint.style.display = 'none';
    }
  }

  // 天象横幅
  if(typeof updateTianxiangBanner === 'function') updateTianxiangBanner();
  
  // 红尘炼心按钮状态
  if(el.gufengFab){
    if(s.gufengCount < 5 && Date.now() >= s.gufengNextAt){
      el.gufengFab.classList.add('ready');
    } else {
      el.gufengFab.classList.remove('ready');
    }
  }
}

/* ============ 成功率明细渲染 ============ */
function renderRateDetail(){
  const needed = getExpNeeded(s.realm, s.layer);
  const base = getBaseRate(s.realm, s.layer);
  if(el.rdBase)el.rdBase.textContent = Math.round(base * 100) + '%';
  
  // 失败道韵
  const daoyun = Math.min(s.daoyun, DAOYUN_CAP);
  if(el.rdDaoyun)el.rdDaoyun.textContent = '+' + Math.round(daoyun * 100) + '%';
  if(el.rdDaoyunRow)el.rdDaoyunRow.style.display = daoyun > 0 ? 'flex' : 'none';
  
  // 蓄势
  let xushi = 0;
  if(s.exp > needed){
    const ratio = Math.min((s.exp - needed) / needed, 5);
    xushi = ratio * XUSHI_BONUS_PER;
  }
  if(el.rdXushi)el.rdXushi.textContent = '+' + Math.round(xushi * 100) + '%';
  if(el.rdXushiRow)el.rdXushiRow.style.display = xushi > 0 ? 'flex' : 'none';
  
  // 每日仙缘
  const xianyuan = (s.xianyuanDate !== todayDateStr()) ? XIANYUAN_BONUS : 0;
  if(el.rdXianyuan)el.rdXianyuan.textContent = '+' + Math.round(xianyuan * 100) + '%';
  if(el.rdXianyuanRow)el.rdXianyuanRow.style.display = xianyuan > 0 ? 'flex' : 'none';
  
  // 连续突破
  let lianpoBonus = 0;
  const tiers = [9,7,5,3];
  for(const n of tiers){
    if(s.lianpo >= n){ lianpoBonus = LIANPO_BONUS[n]; break; }
  }
  if(el.rdLianpo)el.rdLianpo.textContent = '+' + Math.round(lianpoBonus * 100) + '%';
  if(el.rdLianpoRow)el.rdLianpoRow.style.display = lianpoBonus > 0 ? 'flex' : 'none';
  
  // 天象
  const tianxiang = isTianxiangDay() ? TIANXIANG_BONUS : 0;
  if(el.rdTianxiang)el.rdTianxiang.textContent = '+' + Math.round(tianxiang * 100) + '%';
  if(el.rdTianxiangRow)el.rdTianxiangRow.style.display = tianxiang > 0 ? 'flex' : 'none';
  
  // 合计
  const total = calcRate(0);
  if(el.rdTotal)el.rdTotal.textContent = Math.round(total * 100) + '%';
}

/* ============ 粒子/星星 ============ */
function spawnParticles(){
  const c=el.particles;if(!c)return;
  c.innerHTML='';
  const n=14;
  for(let i=0;i<n;i++){
    const p=document.createElement('div');p.className='pt';
    p.style.left=(20+Math.random()*60)+'%';p.style.bottom=(10+Math.random()*40)+'%';
    p.style.animationDuration=(6+Math.random()*8)+'s';p.style.animationDelay=(Math.random()*6)+'s';
    p.style.opacity=0.3+Math.random()*0.5;c.appendChild(p);
  }
  spawnStars();
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

/* ============ 设置 ============ */
function openSettings(){
  let html='<div class="modal-title">设 置</div>';
  html+='<div class="settings-group"><div class="settings-group-h">修 炼 档 案</div>';
  html+='<div class="row"><span class="row-label">掌门</span><span class="row-value">'+s.masterName+'</span></div>';
  html+='<div class="row"><span class="row-label">当前境界</span><span class="row-value">'+getRealmName(s.realm,s.layer)+'</span></div>';
  html+='<div class="row"><span class="row-label">累计修为</span><span class="row-value">'+fmtNum(Math.floor(s.exp))+'</span></div>';
  html+='<div class="row"><span class="row-label">失败道韵</span><span class="row-value">+'+Math.round(Math.min(s.daoyun,DAOYUN_CAP)*100)+'%</span></div>';
  html+='<div class="row"><span class="row-label">连续突破</span><span class="row-value">'+s.lianpo+' 次</span></div>';
  html+='<div class="row"><span class="row-label">天机石</span><span class="row-value">💎 '+s.tianjishi+'</span></div>';
  html+='<div class="row"><span class="row-label">立派天数</span><span class="row-value">'+playDays()+' 天</span></div></div>';
  html+='<div class="settings-group"><div class="settings-group-h">偏 好 设 置</div>';
  html+='<div class="row"><span class="row-label">音效</span><span class="row-value" id="soundToggle" style="cursor:pointer">'+(AudioSys.enabled?'开启':'关闭')+'</span></div>';
  html+='<div class="row"><span class="row-label">背景音乐</span><span class="row-value" id="musicToggle" style="cursor:pointer">'+(s.musicEnabled?'开启':'关闭')+'</span></div>';
  html+='<div class="row"><span class="row-label">震动</span><span class="row-value" id="vibToggle" style="cursor:pointer">'+(s.vibrationEnabled?'开启':'关闭')+'</span></div>';
  html+='<div class="row"><span class="row-label">方言模式</span><span class="row-value" id="dialectToggle" style="cursor:pointer;color:var(--gold)">'+(s.dialect==='sc'?'四川话':'普通话')+'</span></div>';
  html+='<div class="row"><span class="row-label">字体大小</span><span class="row-value" id="fontToggle" style="cursor:pointer">'+(s.fontSize==='small'?'紧凑':(s.fontSize==='large'?'舒适':'标准'))+'</span></div></div>';
  html+='<div class="settings-group"><div class="settings-group-h">危 险 操 作</div>';
  html+='<button class="btn" style="width:100%;border-color:var(--red);color:var(--red)" id="restart">重 新 开 始</button></div>';
  html+='<div class="settings-version" id="settingsVersion" style="cursor:default">一 毛 修 仙 · '+GAME_VERSION+'<br>Author: '+GAME_AUTHOR+'</div>';
  html+='<div class="watermark wm-modal">by '+GAME_AUTHOR+'</div>';
  showModal(html);
  $('soundToggle').onclick=(e)=>{e.stopPropagation();AudioSys.enabled=!AudioSys.enabled;$('soundToggle').textContent=AudioSys.enabled?'开启':'关闭';save()};
  $('musicToggle').onclick=(e)=>{e.stopPropagation();s.musicEnabled=!s.musicEnabled;$('musicToggle').textContent=s.musicEnabled?'开启':'关闭';updateBgm();save()};
  $('vibToggle').onclick=(e)=>{e.stopPropagation();s.vibrationEnabled=!s.vibrationEnabled;$('vibToggle').textContent=s.vibrationEnabled?'开启':'关闭';save()};
  $('dialectToggle').onclick=(e)=>{e.stopPropagation();s.dialect=(s.dialect==='sc')?'std':'sc';$('dialectToggle').textContent=s.dialect==='sc'?'四川话':'普通话';renderSplashStory();save()};
  $('fontToggle').onclick=(e)=>{e.stopPropagation();const order=['small','normal','large'];const labels={small:'紧凑',normal:'标准',large:'舒适'};const i=(order.indexOf(s.fontSize)+1)%3;s.fontSize=order[i];applyFontSize();$('fontToggle').textContent=labels[s.fontSize];save()};
  $('restart').onclick=(e)=>{e.stopPropagation();if(!confirm('确定重新开始吗？'))return;restartGame()};
}
function restartGame(){
  try{localStorage.removeItem(SAVE_KEY)}catch(e){}
  const pa=s.audioEnabled!==false,pv=s.vibrationEnabled!==false,pf=s.fontSize||'normal',pd=s.dialect||'sc';
  s=createDefaultState();
  s.audioEnabled=pa;s.vibrationEnabled=pv;s.fontSize=pf;s.dialect=pd;
  applyFontSize();renderSplashStory();
  ModalQueue.clear();
  el.modal.classList.remove('show');el.menuPop.classList.remove('show');
  el.game.classList.remove('show');
  el.splash.style.display='none';el.create.style.display='';
  el.create.classList.remove('hide');el.nameInput.value='';
  updateCreate();renderUI();toast('已重新开始',2600);
}
function openDonate(){
  let html='<div class="modal-title">赏 我 一 毛</div>';
  html+='<div class="help-p" style="text-align:center;margin-bottom:14px">兄弟，我就是那个从小做梦的少年。<br>小时候我算过，14亿人每人给我一毛，我就有 <span class="hl">14 亿毛</span>。<br>现在我做了一个游戏，想看看能不能实现这个梦。<br><br><span class="hl">如果你觉得这游戏还不错，可以扫下面的码，赏我一毛。</span><br><br>一毛就够了，真的。</div>';
  html+='<div class="donate-qr">';
  html+='<img src="m.jpg">';
  html+='</div>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
}

function openHelp(){
  let html='<div class="modal-title">玩 法 说 明</div>';
  
  html+='<div class="help-section"><div class="help-h">🧘 核心玩法</div><div class="help-p">挂机积累修为。<br>修为满了，点底部的「突破」按钮。<br>突破了，继续挂机。<br><br><span class="hl">在线挂机 ×1.0，离线挂机 ×0.4，离线结算上限 12 小时。</span></div></div>';
  
  html+='<div class="help-section"><div class="help-h">💎 天机石</div><div class="help-p">挂机随机掉落：<br>· 在线每 <span class="hl">15-45 分钟</span> 掉 1 颗<br>· 离线每 <span class="hl">1-3 小时</span> 掉 1 颗<br>· 持有上限 <span class="hl">10 颗</span><br><br>突破时可以消耗：<br>· 每颗 <span class="hl">+5% 成功率</span><br>· 最多用 10 颗 <span class="hl">+50%</span></div></div>';
  
  html+='<div class="help-section"><div class="help-h">⚡ 突破成功率</div><div class="help-p">基础成功率随境界递减。<br>但可以通过以下方式提高：<br><span class="hl">失败道韵</span>：每次失败 +2%，上限 +20%<br><span class="hl">蓄势溢出</span>：修为满后继续挂机，每溢出 1 倍 +3%，上限 +15%<br><span class="hl">每日仙缘</span>：每天首次突破 +15%<br><span class="hl">连续突破</span>：连破 3/5/7/9 次分别 +5/10/15/20%<br><span class="hl">天机石</span>：每颗 +5%，最多用 10 颗<br><span class="hl">天象吉日</span>：每月随机 1-3 天 +20%<br><br>成功率上限 <span class="hl">95%</span>，大境界突破上限 <span class="hl">80%</span>。<br>失败返还 50% 修为，并累积道韵。</div></div>';
  
html+='<div class="help-section"><div class="help-h">📜 红尘炼心</div><div class="help-p">在线每 <span class="hl">2 小时</span> 刷新一次见闻，每天最多 <span class="hl">5 次</span>。<br>面对内心的抉择，选择你的态度。<br>答完一题即可获得 <span class="hl">当前升级所需修为的 20%</span> 作为奖励。<br>题库会优先按主线顺序出现，随后随机抽取日常见闻。</div></div>';

  html+='<div class="help-section"><div class="help-h">🎯 长线目标</div><div class="help-p">练气 → 筑基 → 金丹 → 元婴 → 化神<br>→ 炼虚 → 合体 → 大乘 → 渡劫 → 仙人<br><br>每境 9 层，共 <span class="hl">90 层</span>。<br>慢慢来，不急。</div></div>';
  
  html+='<div class="watermark wm-modal">by '+GAME_AUTHOR+' · '+GAME_VERSION+'</div>';
  showModal(html);
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
  if(!opts.noClose){const b=document.createElement('button');b.className='modal-x';b.textContent='‹';b.onclick=(e)=>{e.stopPropagation();AudioSys.click();hideModal()};el.modalCard.appendChild(b)}
}
function hideModal(){el.modal.classList.remove('show')}
el.modal.onclick=(e)=>{
  if(e.target!==el.modal)return;
  if(el.modal.dataset.noClose==='1')return;
  AudioSys.click();hideModal();
};


async function uploadCloudSave() {
  if (!supabaseClient) { toast('云端未连接'); return false; }
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) { toast('请先登录'); return false; }
  
  const saveData = serializeState();
  const { error } = await supabaseClient
    .from('saves')
    .upsert({ id: user.id, save_data: saveData, updated_at: new Date().toISOString() });
  
  if (error) { console.error('上传失败:', error); toast('上传失败：' + error.message, 3000); return false; }
  return true;
}

async function checkCloudUpdate() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  if (!s.created) return;
  
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return; // 未登录，静默跳过
    
    const { data, error } = await supabaseClient
      .from('saves')
      .select('save_data, updated_at')
      .eq('id', user.id)
      .single();
    
    if (error || !data || !data.save_data || !data.updated_at) return;
    
    const localTime = s.lastSave || 0;
    const cloudTime = new Date(data.updated_at).getTime();
    
    // 云端比本地新超过 1 分钟才提示（避免和自动上传互相打架）
    if (cloudTime - localTime < 60 * 1000) return;
    
    const cloudAge = Math.round((Date.now() - cloudTime) / 1000);
    const cloudDate = new Date(cloudTime);
    const localDate = new Date(localTime);
    const fmt = (d) => d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' ' +
                      String(d.getHours()).padStart(2,'0') + ':' +
                      String(d.getMinutes()).padStart(2,'0');
    
    ModalQueue.push((next) => {
      let html = '<div class="modal-title gold">☁️ 云端有更新的存档</div>';
      html += '<div class="modal-sub">云端存档比本地新 ' + fmtDur(cloudAge) + '</div>';
      html += '<div class="tip-box" style="text-align:center;line-height:2">';
      html += '<span class="hl">云端</span>：' + fmt(cloudDate) + '<br>';
      html += '<span class="hl">本地</span>：' + fmt(localDate);
      html += '</div>';
      html += '<div class="tip-box warn" style="text-align:center;font-size:calc(12px * var(--fs-scale))">拉取后，本地存档将被云端覆盖。<br>如果你刚才在另一台设备上玩过，就选「拉取」。</div>';
      html += '<button class="btn gold" style="width:100%;padding:15px" id="cloudPullBtn">⬇ 拉 取 云 端 存 档</button>';
      html += '<button class="btn" style="width:100%;margin-top:8px;padding:15px" id="cloudKeepLocalBtn">保 持 本 地</button>';
      html += '<div class="watermark wm-modal">' + GAME_AUTHOR + '</div>';
      showModal(html, { noClose: true });
      
      $('cloudPullBtn').onclick = (e) => {
        e.stopPropagation();
        AudioSys.click();
        try {
          applySaveData(data.save_data);
          renderUI();
          spawnParticles();
          hideModal();
          toast('✅ 云端存档已恢复', 3000);
        } catch(err) {
          console.error('拉取失败:', err);
          toast('拉取失败：' + err.message, 3000);
          hideModal();
        }
        next();
      };
      
      $('cloudKeepLocalBtn').onclick = (e) => {
        e.stopPropagation();
        AudioSys.click();
        hideModal();
        next();
      };
    });
  } catch(e) {
    console.warn('云端检查失败:', e);
  }
}

async function downloadCloudSave() {
  if (!supabaseClient) { toast('云端未连接'); return false; }
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) { toast('请先登录'); return false; }

  const { data, error } = await supabaseClient
    .from('saves')
    .select('save_data')
    .eq('id', user.id)
    .single();

  if (error || !data) { toast('云端暂无存档', 3000); return false; }
  if (!data.save_data) { toast('云端存档为空', 3000); return false; }

  if (!confirm('下载云端存档会覆盖当前本地进度，确定吗？')) return false;

  applySaveData(data.save_data);
  renderUI();
  spawnParticles();
  return true;
}

function openCloudSave() {
  let html = '<div class="modal-title">云 端 存 档</div>';
  html += '<div class="modal-sub">登录后，存档将自动同步到云端</div>';
  html += '<div class="field-label">邮箱</div>';
  html += '<input class="name-input" id="cloudEmail" type="email" placeholder="you@example.com" style="width:100%;margin-bottom:10px">';
  html += '<div class="field-label">密码</div>';
  html += '<input class="name-input" id="cloudPassword" type="password" placeholder="至少 8 位，含大写、小写、数字" style="width:100%;margin-bottom:20px">';
  html += '<button class="btn gold" style="width:100%;padding:15px" id="cloudLoginBtn">登 录</button>';
  html += '<button class="btn" style="width:100%;margin-top:8px;padding:15px" id="cloudSignUpBtn">注 册 新 账 号</button>';
  html += '<button class="btn realm" style="width:100%;margin-top:8px;padding:15px" id="cloudDownloadBtn">⬇ 从云端下载存档</button>';
  html += '<div class="watermark wm-modal">' + GAME_AUTHOR + '</div>';
  
  showModal(html);
  
  $('cloudLoginBtn').onclick = async (e) => {
    e.stopPropagation();
    AudioSys.click();
    const email = $('cloudEmail').value.trim();
    const password = $('cloudPassword').value;
    if (!email || !password) { toast('请输入邮箱和密码'); return; }
    if (!supabaseClient) { toast('云端未连接，请检查配置'); return; }
    
    toast('正在登录...', 2000);
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) { toast('登录失败：' + error.message, 3000); return; }
    toast('登录成功！');
    const ok = await uploadCloudSave();
    if (ok) { toast('✅ 存档已上传云端！', 3000); }
    else { toast('登录成功，但存档上传失败', 3000); }
    hideModal();
  };
  
  $('cloudSignUpBtn').onclick = async (e) => {
    e.stopPropagation();
    AudioSys.click();
    const email = $('cloudEmail').value.trim();
    const password = $('cloudPassword').value;
    if (!email || !password) { toast('请输入邮箱和密码'); return; }
    if (!supabaseClient) { toast('云端未连接，请检查配置'); return; }
    
    toast('正在注册...', 2000);
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) { toast('注册失败：' + error.message, 3000); return; }
    toast('注册成功！请去邮箱收信验证，或直接登录。');
  };
  $('cloudDownloadBtn').onclick = async (e) => {
    e.stopPropagation();
    AudioSys.click();
    const ok = await downloadCloudSave();
    if (ok) { toast('✅ 云端存档已恢复！', 3000); hideModal(); }
  };
}

/* ============ 主界面点击吐槽逻辑 ============ */
(function initBgClick(){
  let clickCount = 0;
  let lastClickTime = 0;
  let lastBubbleTime = 0;
  let donateClickCount = 0;
  let lastDonateTime = 0;
  let lastDonateBubbleTime = 0;

  function spawnBubble(x, y, text) {
    const bubble = document.createElement('div');
    bubble.className = 'click-bubble';
    bubble.textContent = text;
    bubble.style.opacity = '0';
    document.body.appendChild(bubble);
    const bw = bubble.offsetWidth;
    bubble.style.left = Math.max(bw / 2 + 10, Math.min(window.innerWidth - bw / 2 - 10, x)) + 'px';
    bubble.style.top = Math.max(60, y - 40) + 'px';
    bubble.style.opacity = '';
    setTimeout(() => { if (bubble.parentNode) bubble.parentNode.removeChild(bubble); }, 3500);
  }

  function pickText(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.hud-top') || 
        e.target.closest('.hud-bottom') || 
        e.target.closest('.modal') || 
        e.target.closest('.recruit-fab') || 
        e.target.closest('.donate-fab') ||
        e.target.closest('.menu-wrap') ||
        e.target.closest('.dragon-wrap')) {
      return;
    }

    const now = Date.now();
    if (now - lastClickTime > 5000) clickCount = 0;
    clickCount++;
    lastClickTime = now;

    if (clickCount >= 15) {
      clickCount = 0;
      spawnBubble(e.clientX, e.clientY, BG_CLICK_TEXTS.ultimate);
      AudioSys.tone(100, 0.6, 'sawtooth', 0.12);
      vibrate(100);
      return;
    }

    if (now - lastBubbleTime < 1500) return;
    lastBubbleTime = now;

    let text = '';
    if (clickCount <= 2) {
      text = pickText(BG_CLICK_TEXTS.level1);
    } else if (clickCount <= 5) {
      text = pickText(BG_CLICK_TEXTS.level2);
    } else if (clickCount <= 9) {
      text = pickText(BG_CLICK_TEXTS.level3);
    } else {
      text = pickText(BG_CLICK_TEXTS.level4);
    }

    spawnBubble(e.clientX, e.clientY, text);
    AudioSys.tone(800, 0.05, 'sine', 0.04);
  });

  const donateBtn = document.getElementById('donateFab');
  if (donateBtn) {
    donateBtn.onclick = (e) => {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastDonateTime > 5000) donateClickCount = 0;
      donateClickCount++;
      lastDonateTime = now;

      if (now - lastDonateBubbleTime < 2000) return;
      lastDonateBubbleTime = now;
      
      const idx = Math.min(donateClickCount - 1, BG_CLICK_TEXTS.donate.length - 1);
      spawnBubble(e.clientX, e.clientY, BG_CLICK_TEXTS.donate[idx]);
      AudioSys.coin();
      
      if (typeof openDonate === 'function') {
        setTimeout(() => openDonate(), 300);
      }
    };
  }
})();

/* ============ 红尘炼心 ============ */
if(el.gufengFab){
  el.gufengFab.onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    if(s.gufengCount >= 5){
      toast('今日悟性已尽，明日再来咯');
      return;
    }
    if(Date.now() < s.gufengNextAt){
      const remain = Math.ceil((s.gufengNextAt - Date.now()) / 60000);
      toast('下一桩机缘还在路上，还需 ' + remain + ' 分钟');
      return;
    }
    openGufeng();
  };
}

function openGufeng(){
  const nextTalk = pickGufengTalk();
  
  let html = '<div class="modal-title">红 尘 炼 心</div>';
  html += '<div class="modal-sub">' + nextTalk.scene + '</div>';
  html += '<div class="tip-box" style="font-size:calc(14px * var(--fs-scale));line-height:1.8;text-align:center">' + nextTalk.line + '</div>';
  html += '<div class="gift-choice" style="margin-top:16px">';
  nextTalk.replies.forEach((r, i) => {
    html += '<button class="gift-opt" data-idx="' + i + '"><div class="go-icon">' + nextTalk.icon + '</div><div class="go-info"><div class="go-name">' + r.text + '</div></div></button>';
  });
  html += '</div>';
  html += '<div class="watermark wm-modal">' + GAME_AUTHOR + '</div>';
  
  showModal(html, {noClose:true});
  
  document.querySelectorAll('.gift-opt').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      AudioSys.success();
      if(!s.toldTalkIds.includes(nextTalk.id)) s.toldTalkIds.push(nextTalk.id);
      // 动态计算奖励：当前升级所需修为的 50%
const guFengReward = Math.floor(getExpNeeded(s.realm, s.layer) * 0.2);
      s.exp += guFengReward;
      s.gufengCount++;
      s.gufengNextAt = Date.now() + 2 * 3600 * 1000;
      save();
      hideModal();
      toast('心念通达，悟道修为 +' + fmtNum(guFengReward) + '！', 2500);
      renderUI();
    };
  });
}

/* ============ 突破按钮 ============ */
if(el.breakthroughBtn){
  el.breakthroughBtn.onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    if(s.exp < getExpNeeded(s.realm, s.layer)){
      toast('修为不足');
      return;
    }
    // 如果有天机石，弹出选择用几颗
    if(s.tianjishi > 0){
      openTianjishiPicker();
    } else {
      tryBreakthrough(0);
    }
  };
}

/* ============ 天机石选择弹窗 ============ */
function openTianjishiPicker(){
  let useCount = 0;
  const maxUse = Math.min(s.tianjishi, TIANJISHI_CAP);
  
  function render(){
    const baseRate = calcRate(0);
    const usedRate = calcRate(useCount);
    const cap = (s.layer === 9) ? RATE_CAP_BIG : RATE_CAP_NORMAL;
    const capped = Math.min(usedRate, cap);
    
    let html = '<div class="modal-title">使 用 天 机 石</div>';
    html += '<div class="modal-sub">持有 💎 ' + s.tianjishi + ' 颗</div>';
    
    html += '<div class="tj-picker">';
    html += '<div class="tj-picker-info">';
    html += '<div class="tj-row"><span>当前成功率</span><span class="hl">' + Math.round(baseRate * 100) + '%</span></div>';
    html += '<div class="tj-row"><span>使用后成功率</span><span class="hl" style="font-size:calc(18px * var(--fs-scale))">' + Math.round(capped * 100) + '%</span></div>';
    html += '<div class="tj-row"><span>消耗天机石</span><span class="hl">' + useCount + ' 颗</span></div>';
    html += '</div>';
    
    // 加减控制
    html += '<div class="tj-control">';
    html += '<button class="tj-btn" id="tjMinus" ' + (useCount <= 0 ? 'disabled' : '') + '>−</button>';
    html += '<div class="tj-display">' + useCount + '</div>';
    html += '<button class="tj-btn" id="tjPlus" ' + (useCount >= maxUse ? 'disabled' : '') + '>＋</button>';
    html += '</div>';
    html += '<div class="tj-quick">';
    html += '<button class="tj-quick-btn" id="tjAll">全部（' + maxUse + '）</button>';
    html += '<button class="tj-quick-btn" id="tjHalf">一半（' + Math.floor(maxUse / 2) + '）</button>';
    html += '<button class="tj-quick-btn" id="tjZero">不用</button>';
    html += '</div>';
    html += '</div>';
    
    html += '<button class="btn gold" style="width:100%;padding:15px;margin-top:14px" id="tjConfirm">' + (useCount > 0 ? '用 ' + useCount + ' 颗 · 突破' : '直 接 突 破') + '</button>';
    html += '<div class="watermark wm-modal">' + GAME_AUTHOR + '</div>';
    
    showModal(html, { noClose: true, preserveScroll: true });
    
    // 绑定
    const minus = document.getElementById('tjMinus');
    const plus = document.getElementById('tjPlus');
    const all = document.getElementById('tjAll');
    const half = document.getElementById('tjHalf');
    const zero = document.getElementById('tjZero');
    const confirm = document.getElementById('tjConfirm');
    const card = el.modalCard;
    
    if(minus) minus.onclick = (ev) => { ev.stopPropagation(); AudioSys.click(); useCount = Math.max(0, useCount - 1); render(); };
    if(plus) plus.onclick = (ev) => { ev.stopPropagation(); AudioSys.click(); useCount = Math.min(maxUse, useCount + 1); render(); };
    if(all) all.onclick = (ev) => { ev.stopPropagation(); AudioSys.click(); useCount = maxUse; render(); };
    if(half) half.onclick = (ev) => { ev.stopPropagation(); AudioSys.click(); useCount = Math.floor(maxUse / 2); render(); };
    if(zero) zero.onclick = (ev) => { ev.stopPropagation(); AudioSys.click(); useCount = 0; render(); };
    if(confirm) confirm.onclick = (ev) => {
      ev.stopPropagation();
      AudioSys.click();
      hideModal();
      setTimeout(() => tryBreakthrough(useCount), 200);
    };
  }
  
  render();
}

/* ============ 成功率明细 · 折叠交互 ============ */
if(el.rateDetailToggle){
  el.rateDetailToggle.onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    const body = el.rateDetailBody;
    const arrow = el.rateDetailArrow;
    if(!body)return;
    const isOpen = body.classList.contains('open');
    if(isOpen){
      body.classList.remove('open');
      if(arrow)arrow.textContent = '▸';
    } else {
      body.classList.add('open');
      if(arrow)arrow.textContent = '▾';
    }
  };
}

/* ============ 天象吉日横幅 ============ */
function updateTianxiangBanner(){
  if(!el.tianxiangBanner)return;
  if(!s.created)return;
  if(isTianxiangDay()){
    el.tianxiangBanner.textContent = '🌅 今日紫气东来 · 突破成功率 +20%';
    el.tianxiangBanner.classList.add('show');
  } else {
    el.tianxiangBanner.classList.remove('show');
  }
}

  // 开发者模式：连点版本号 5 次
  let _verClicks = 0, _verTimer = null;
  const verEl = document.getElementById('settingsVersion');
  if(verEl){
    verEl.style.cursor = 'pointer';
    verEl.onclick = (e) => {
      e.stopPropagation();
      _verClicks++;
      clearTimeout(_verTimer);
      _verTimer = setTimeout(() => { _verClicks = 0; }, 1500);
      if(_verClicks >= 5){
        _verClicks = 0;
        AudioSys.success();
        openDevPanel();
      }
    };
  }

/* ============ 开发者面板 ============ */
function openDevPanel(){
  let html = '<div class="modal-title" style="color:var(--red)">开 发 者 面 板</div>';
  html += '<div class="modal-sub">调试用，请勿滥用</div>';
  
  html += '<div class="settings-group"><div class="settings-group-h">资 源</div>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devTianjishi">+10 天机石</button>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devExp">修为填满</button>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devExpMax">修为溢出 5 倍</button>';
  html += '</div>';
  
  html += '<div class="settings-group"><div class="settings-group-h">境 界</div>';
  html += '<div class="row"><span class="row-label">跳到大境界</span><span class="row-value">';
  html += '<select id="devRealmSelect" style="background:transparent;color:var(--gold);border:1px solid rgba(230,196,115,.3);padding:4px 8px;border-radius:6px;font-family:inherit">';
  REALMS.forEach((r, i) => {
    html += '<option value="' + i + '"' + (i === s.realm ? ' selected' : '') + '>' + r.n + '</option>';
  });
  html += '</select></span></div>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devGoRealm">跳到所选大境界 · 1 层</button>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devNextLayer">当前层 +1</button>';
  html += '</div>';
  
  html += '<div class="settings-group"><div class="settings-group-h">加 成</div>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devResetDaoyun">道韵清零</button>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devMaxDaoyun">道韵拉满 (+20%)</button>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devMaxLianpo">连破拉满 (+20%)</button>';
  html += '</div>';
  
  html += '<div class="settings-group"><div class="settings-group-h">红 尘 炼 心</div>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devResetGufeng">重置冷却（立刻测试）</button>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devResetGufengCount">重置今日次数</button>';
  html += '</div>';

  html += '<div class="settings-group"><div class="settings-group-h">天 象</div>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devToggleTianxiang">今 日 吉 日（切换）</button>';
  html += '<button class="btn" style="width:100%;margin-bottom:6px" id="devRefreshTianxiang">重 新 随 机 本 月 吉 日</button>';
  html += '</div>';
  
  html += '<button class="btn" style="width:100%;margin-top:16px;padding:14px;border-color:var(--red);color:var(--red)" id="devClose">关 闭 面 板</button>';
  html += '<div class="watermark wm-modal">开发者面板</div>';
  
  showModal(html, { noClose: true });
  
  document.getElementById('devClose').onclick = (e) => {
    e.stopPropagation();
    AudioSys.click();
    hideModal();
  };
  
  // 绑定
  document.getElementById('devTianjishi').onclick = (e) => { e.stopPropagation(); s.tianjishi = Math.min(TIANJISHI_CAP, s.tianjishi + 10); save(); renderUI(); toast('天机石 = ' + s.tianjishi); };
  document.getElementById('devExp').onclick = (e) => { e.stopPropagation(); s.exp = getExpNeeded(s.realm, s.layer); save(); renderUI(); toast('修为已填满'); };
  document.getElementById('devExpMax').onclick = (e) => { e.stopPropagation(); s.exp = getExpNeeded(s.realm, s.layer) * 6; save(); renderUI(); toast('修为溢出 5 倍'); };
  document.getElementById('devGoRealm').onclick = (e) => { e.stopPropagation(); const idx = parseInt(document.getElementById('devRealmSelect').value); s.realm = idx; s.layer = 1; s.exp = 0; s.daoyun = 0; save(); renderUI(); toast('已跳到 ' + getRealmName(idx, 1)); };
  document.getElementById('devNextLayer').onclick = (e) => { e.stopPropagation(); s.layer = Math.min(9, s.layer + 1); save(); renderUI(); toast('当前 ' + getRealmName(s.realm, s.layer)); };
  document.getElementById('devResetDaoyun').onclick = (e) => { e.stopPropagation(); s.daoyun = 0; save(); renderUI(); toast('道韵已清零'); };
  document.getElementById('devMaxDaoyun').onclick = (e) => { e.stopPropagation(); s.daoyun = DAOYUN_CAP; save(); renderUI(); toast('道韵拉满'); };
  document.getElementById('devMaxLianpo').onclick = (e) => { e.stopPropagation(); s.lianpo = 9; save(); renderUI(); toast('连破拉满'); };
  document.getElementById('devResetGufeng').onclick = (e) => {
    e.stopPropagation();
    s.gufengNextAt = Date.now() - 1000;
    s.gufengCount = 0;
    save();
    renderUI();
    toast('红尘炼心冷却已重置，立刻可测！');
  };
  document.getElementById('devResetGufengCount').onclick = (e) => {
    e.stopPropagation();
    s.gufengCount = 0;
    save();
    renderUI();
    toast('红尘炼心今日次数已重置');
  };
  document.getElementById('devToggleTianxiang').onclick = (e) => {
    e.stopPropagation();
    const d = new Date();
    const curMonth = d.getFullYear() + '-' + (d.getMonth() + 1);
    s.tianxiangMonth = curMonth;
    const today = d.getDate();
    if(!s.tianxiangDays) s.tianxiangDays = [];
    if(s.tianxiangDays.includes(today)){
      s.tianxiangDays = s.tianxiangDays.filter(x => x !== today);
      toast('取消今日吉日');
    } else {
      s.tianxiangDays = [today];
      toast('设为今日吉日');
    }
    save(); renderUI();
    if(typeof updateTianxiangBanner === 'function') updateTianxiangBanner();
  };
  document.getElementById('devRefreshTianxiang').onclick = (e) => {
    e.stopPropagation();
    s.tianxiangMonth = '';
    refreshTianxiang();
    save(); renderUI();
    toast('本月吉日：' + s.tianxiangDays.join('、') + ' 号');
  };
}

/* ============ 开发者快捷键 ============ */
document.addEventListener('keydown', (e) => {
  if (e.key === '`' || e.key === '~' || e.code === 'Backquote') {
    e.preventDefault();
    // 如果面板已打开，按 ~ 关闭
    if (el.modal.classList.contains('show') && el.modal.dataset.noClose === '1') {
      hideModal();
      return;
    }
    if (typeof openDevPanel === 'function') {
      AudioSys.success();
      openDevPanel();
    } else {
      console.warn('[dev] openDevPanel 未定义');
    }
  }
  // 按 Esc 也能关
  if (e.key === 'Escape' && el.modal.classList.contains('show')) {
    hideModal();
  }
});

/* ============ 打赏按钮 · 自动变暗 ============ */
(function initDonateIdle(){
  const btn = document.getElementById('donateFab');
  if(!btn) return;
  
  let idleTimer = null;
  const IDLE_DELAY = 5000;  // 5 秒不点就变暗
  
  function setIdle(){
    btn.classList.add('idle');
  }
  function resetIdle(){
    btn.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(setIdle, IDLE_DELAY);
  }
  
  // 初始化：进入页面 5 秒后变暗
  resetIdle();
  
  // 触摸/点击按钮 → 恢复，再倒计时
  btn.addEventListener('touchstart', resetIdle, { passive: true });
  btn.addEventListener('click', resetIdle);
  
  // 鼠标悬停（电脑）→ 恢复
  btn.addEventListener('mouseenter', resetIdle);
})();