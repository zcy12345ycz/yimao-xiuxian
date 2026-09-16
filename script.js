/* ============================================================
 * 一毛修仙 · 代码导航
 * ============================================================
 * 【1】大数系统        —— 搜索：class Dec
 * 【2】配置中心        —— 搜索：const CONFIG
 * 【3】常量与数据表    —— 搜索：const REALMS
 * 【4】工具函数        —— 搜索：function pick
 * 【5】状态与存档      —— 搜索：createDefaultState
 * 【6】弟子生成        —— 搜索：function generateDisciple
 * 【7】突破与结算      —— 搜索：function tickDiscipleGains
 * 【8】突破率计算      —— 搜索：function discipleBreakRate
 * 【9】修为/毛产出     —— 搜索：function discipleExpRate
 * 【10】事件系统       —— 搜索：EVENT_TEMPLATES
 * 【11】奏章系统       —— 搜索：function generateMemo
 * 【12】外派系统       —— 搜索：function startExpedition
 * 【13】秘境系统       —— 搜索：SECRET_REALMS
 * 【14】传承树         —— 搜索：LEGACY_NODES
 * 【15】成就           —— 搜索：ACHIEVEMENTS
 * 【16】UI 渲染        —— 搜索：function renderUI
 * 【17】弹窗           —— 搜索：function showModal
 * 【18】存档序列化     —— 搜索：function serializeState
 * 【19】主循环         —— 搜索：function gameLoop
 * 【20】事件绑定       —— 搜索：el.startBtn.onclick
 * 
 * 数值调整优先改 CONFIG，不要直接改函数里的数字。
 * ============================================================ */

/* ============ 版本 ============ */
const GAME_VERSION='v0.4.4';
const GAME_AUTHOR='Zhao | Struct. E.';
const CURRENT_SAVE_VERSION=4;
let DEC_LONG_FORMAT=false;

/* ============================================================
 * 【2】配置中心 CONFIG
 * 所有关键数值集中在这里，方便调整平衡。
 * 改完只需刷新页面，无需改动其他代码。
 * ============================================================ */
const CONFIG = {
  // ---- 突破 ----
  breakBaseSmall: 0.65,        // 小境界基础突破率
  breakBaseBig: 0.30,          // 大境界基础突破率
  breakFailStreakBonus: 0.08,  // 每次失败累积 +8% 突破率
  breakFailStreakMax: 0.40,    // 保底加成上限
  breakMinRate: 0.05,          // 突破率下限
  breakMaxRate: 0.98,          // 突破率上限
  breakAttemptRate: 0.85,      // 达到经验后每次实际尝试的概率
  breakFailLossSmall: 0.30,    // 小境界失败损失经验比例
  breakFailLossBig: 0.25,      // 大境界失败损失经验比例
  breakChosenBonus: 0.08,      // 天命之子突破加成
  breakForceBreakBonus: 0.50,  // 破障丹加成

  // ---- 修为产出 ----
  expBase: 0.5,                // 修为基础值（0.1→0.5，开局提速 5 倍）
  expLevelGrowth: 1.04,        // 每级增长（1.05→1.04，平缓后期曲线）
  expRealmJump: 1.5,           // 每大境界跳跃倍率
  expRealmJumpInterval: 9,     // 几级一个大境界

  // ---- 毛产出 ----
  stoneBase: 0.05,             // 毛基础值
  stoneLevelGrowth: 1.02,      // 每级增长
  stoneRealmJump: 1.18,        // 每大境界跳跃倍率

  // ---- 忠诚 ----
  loyaltyDailyGain: 0.5,       // 每天自然恢复
  loyaltyBreakSuccess: 2,      // 突破成功
  loyaltyBreakFail: -1,        // 突破失败
  loyaltyDefectThreshold: 30,  // 低于此值可能叛逃

  // ---- 叛逃 ----
  defectCheckInterval: 4 * 3600 * 1000, // 检查间隔
  defectBaseChance: 0.05,               // 基础叛逃概率
  defectMaxChance: 0.20,                // 最大叛逃概率
  defectLoyaltyScale: 0.005,            // 每点忠诚差增加的概率

  // ---- 事件 ----
  eventForceInterval: 5,       // 至少几次奏章后强制出事件
  eventMinInterval: 3,         // 最少几次奏章后才可能出事件
  eventChance: 0.5,            // 满足条件后出事件的概率

  // ---- 天命之子 ----
  chosenChance: 0.008,         // 收徒时天命之子概率
  chosenExpMul: 1.5,           // 天命之子修为倍率
  chosenStoneMul: 1.3,         // 天命之子毛倍率

  // ---- 天劫 ----
  tianjieChance: 0.10,         // 大境界突破时天劫概率（0.05→0.10）
  tianjieForceInterval: 3,     // 每 3 次大境界突破保底触发（5→3）
  tianjieCostRatio: 0.20,      // 天劫挡劫花费比例（0.10→0.20）

  // ---- 弟子 ----
  discipleUpkeepDefault: 0.15, // 默认上缴比例
  discipleUpkeepMax: 0.50,     // 上缴比例上限

  // ---- 秘境 ----
  mijingCostGrowth: 1.05,      // 秘境成本增长

    // ---- 离线 ----
  offlineChunk: 120,           // 离线分块秒数

  // ---- 系统常量 ----
  saveKey: 'yimao_master_v20',      // 存档键名（改了会读不到旧存档）
  exportVersion: 1,                 // 导出格式版本
  donateQrImg: 'm.jpg',             // 收款码图片文件名
  maxMemos: 20,                     // 奏章最大堆积数
  maxChronicle: 200,                // 史册最大条数
  maxOfflineTick: 24 * 3600,        // 离线收益上限（秒）
  eraBonus: 3,                      // 每纪元永久倍率
  eraResetLevel: 72,                // 转生所需等级
  targetMao: 1400000000,            // 终极目标：14 亿毛
  grandTournamentMao: 10000000,     // 宗门大比触发阈值：1000 万毛
  refreshHour: 4,                   // 每日刷新时间（凌晨 4 点）
  viceCut: 0.10,                    // 副掌门抽成比例
    yearDuration: 30 * 86400000,      // 年鉴周期：30 天

      // ---- 掌门月令 ----
  moonOrderDefault: 'cultivate',    // 默认月令
  moonOrderCooldown: 12 * 3600 * 1000, // 月令切换冷却：12 小时

  // ---- 收徒 ----
  discipleRecruitCooldown: 30 * 60 * 1000 // 收徒冷却：30 分钟
};

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

/* ============ 常量 ============ */
const REALMS=[
  {n:'凡人',c:'#8a9ca6',d:'肉体凡胎'},{n:'炼气',c:'#7ab8c4',d:'引气入体'},
  {n:'筑基',c:'#6699cc',d:'道基初成'},{n:'金丹',c:'#e6c473',d:'金丹凝形'},
  {n:'元婴',c:'#c088dd',d:'元婴出窍'},{n:'化神',c:'#dd8877',d:'神识化域'},
  {n:'炼虚',c:'#e68aae',d:'炼化虚空'},{n:'合体',c:'#7ad4b8',d:'法相合体'},
  {n:'大乘',c:'#e6c473',d:'大乘圆满'},{n:'渡劫',c:'#9a7ad4',d:'雷劫加身'},
  {n:'仙人',c:'#8ac9dd',d:'飞升成仙'},{n:'真仙',c:'#b88ae6',d:'真仙不灭'},
  {n:'金仙',c:'#e6dd8a',d:'金仙不朽'},{n:'太乙',c:'#8aa6e6',d:'太乙长河'},
  {n:'大罗',c:'#c088dd',d:'大罗诸天'},{n:'道祖',c:'#dd88e6',d:'大道之祖'},
  {n:'混元',c:'#e6aad4',d:'混元一气'},{n:'无极',c:'#9ae6e6',d:'无极无穷'},
  {n:'鸿蒙',c:'#e6b877',d:'鸿蒙初开'},{n:'永恒',c:'#d8e6e6',d:'永恒不灭'},
  {n:'创世',c:'#f0f0f0',d:'开天辟地'}
];
const CN=['一','二','三','四','五','六','七','八','九'];
const SAVE_KEY=CONFIG.saveKey;
const EXPORT_VERSION=CONFIG.exportVersion;
const DONATE_QR_IMG=CONFIG.donateQrImg;
const MAX_MEMOS=CONFIG.maxMemos;
const MAX_CHRONICLE=CONFIG.maxChronicle;
const MAX_OFFLINE_TICK=CONFIG.maxOfflineTick;
const ERA_BONUS=CONFIG.eraBonus;
const ERA_RESET_LEVEL=CONFIG.eraResetLevel;
const TARGET_MAO=CONFIG.targetMao;
const REFRESH_HOUR=CONFIG.refreshHour;
const VICE_CUT=CONFIG.viceCut;
const YEAR_DURATION=CONFIG.yearDuration;
const NEWBIE_PHASES=[
  {reports:0,interval:30*1000},{reports:3,interval:60*1000},
  {reports:10,interval:3*60*1000},{reports:30,interval:8*60*1000},
  {reports:60,interval:20*60*1000}
];
const SHARE_URL=(()=>{try{if(location.protocol==='file:')return'';return location.origin+location.pathname}catch(e){return''}})();
function getQRUrl(d,s){s=s||220;return'https://api.qrserver.com/v1/create-qr-code/?size='+s+'x'+s+'&margin=8&data='+encodeURIComponent(d)}
function getReportInterval(){const n=s.totalReports;for(let i=NEWBIE_PHASES.length-1;i>=0;i--){if(n>=NEWBIE_PHASES[i].reports)return NEWBIE_PHASES[i].interval}return NEWBIE_PHASES[0].interval}
function todayStr(){const n=new Date();if(n.getHours()<REFRESH_HOUR)n.setDate(n.getDate()-1);return n.toDateString()}
function getWeekId(){const now=new Date();const year=now.getFullYear();const jan1=new Date(year,0,1,REFRESH_HOUR,0,0);const diff=now-jan1;return year*100+Math.floor(diff/(7*86400000))}

/* ============ 签到奖励表 ============ */
const SIGN_IN_REWARDS=[
  {day:1,icon:'🪙',name:'×1',type:'stone',mul:1},
  {day:2,icon:'🪙',name:'×2',type:'stone',mul:2},
  {day:3,icon:'📖',name:'修为',type:'exp',mul:0.2},
  {day:4,icon:'🪙',name:'×3',type:'stone',mul:3},
  {day:5,icon:'🎁',name:'道具',type:'item',pool:['break_pill','talent_pill','rebirth_pill','long_life_pill']},
  {day:6,icon:'🪙',name:'×5',type:'stone',mul:5},
  {day:7,icon:'💎',name:'×15',type:'stone',mul:15}
];

/* ============ 14 亿里程碑 ============ */
const MILESTONES=[
  {id:'m1w',    amount:10000,      type:'title', title:'略有家资', desc:'毛达到 1 万'},
  {id:'m10w',   amount:100000,     type:'relic', relic:{type:'stone',value:0.03,icon:'💰',name:'第一桶金',desc:'毛 +3%（永久）'}, desc:'毛达到 10 万'},
  {id:'m100w',  amount:1000000,    type:'title', title:'富甲一方', desc:'毛达到 100 万'},
  {id:'m1000w', amount:10000000,   type:'relic', relic:{type:'stone',value:0.05,icon:'💎',name:'钱庄印记',desc:'毛 +5%（永久）'}, desc:'毛达到 1000 万'},
  {id:'m1y',    amount:100000000,  type:'title', title:'富可敌国', desc:'毛达到 1 亿'},
  {id:'m10y',   amount:1000000000, type:'relic', relic:{type:'stone',value:0.10,icon:'⛰️',name:'金山之影',desc:'毛 +10%（永久）'}, desc:'毛达到 10 亿'}
];

/* ============ 弟子上限阈值 ============ */
const DISCIPLE_THRESHOLDS=[15,45,100,170,250];

/* ============ 离线惊喜 ============ */
const OFFLINE_FLAVORS=[
  {icon:'🌿',text:'后山的泉水，今天比昨天甜了一点。'},
  {icon:'💭',text:'有弟子说，他梦到祖师在藏经阁翻书。'},
  {icon:'🐾',text:'两只灵兽在演武场打了一架，谁也没赢。'},
  {icon:'🏮',text:'山下村里办了场庙会，弟子们偷偷去看了一眼。'},
  {icon:'🌸',text:'有人在洞府门口放了一束野花，不知道是谁。'},
  {icon:'🌙',text:'昨晚月圆，弟子们都说灵气比平时浓。'},
  {icon:'📜',text:'藏经阁最里面那本书，自己翻了一页。'},
  {icon:'🍵',text:'有弟子在后山支了口小炉，煮了壶茶。'},
  {icon:'🕊️',text:'一只白鹤在山门前绕了三圈，走了。'},
  {icon:'⭐',text:'昨晚有颗星划过，没人许愿——他们都忙着修炼。'}
];

/* ============ 外派地点 ============ */
const EXPEDITION_LOCATIONS=[
  {id:'town',   n:'山下集镇',   ic:'🏘️', minLevel:0,  duration:2*3600*1000, stoneMul:1.2, expMul:0.5,
   desc:'买点东西，见见世面',
   stories:['弟子在集市上碰到一个卖糖葫芦的，买了两串。','弟子说镇上的人都在议论山上的宗门。','弟子买回来几卷便宜的纸，说是练字用。','弟子差点被一匹受惊的马撞到。','弟子在茶馆听了一下午书。']},
  {id:'market', n:'邻宗坊市',   ic:'🏪', minLevel:18, duration:3*3600*1000, stoneMul:2.5, expMul:0.8,
   desc:'毛为主，可能有意外收获',
   stories:['弟子在坊市捡到一枚掉了漆的铜钱。','弟子和邻宗弟子起了争执，但没动手。','弟子买到一本便宜的手抄功法。','弟子说坊市比上次来热闹。','弟子遇到一个自称是散修的人，聊了很久。']},
  {id:'ruins',  n:'古战场遗迹', ic:'⚔️', minLevel:36, duration:4*3600*1000, stoneMul:1.5, expMul:2.5,
   desc:'修为为主，有风险',
   stories:['弟子在遗迹里看到一具穿着盔甲的枯骨。','弟子捡回一块锈蚀的剑尖。','弟子说遗迹里有一种说不清的味道。','弟子差点踩到陷阱。','弟子在废墟里发现一片刻字的瓦。']},
  {id:'island', n:'海外仙山',   ic:'🏝️', minLevel:54, duration:4*3600*1000, stoneMul:3.0, expMul:3.0,
   desc:'稀有之地，回报丰厚',
   stories:['弟子看到一棵三人合抱的老树。','弟子说仙山上的空气是甜的。','弟子遇到一只白色的鹿，鹿看了他一眼就走了。','弟子捡到一块会发光的石头。','弟子说仙山下雨了，雨是暖的。']}
];

/* ============ 周目标池 ============ */
const WEEKLY_TASK_POOL=[
  {id:'w_break8',  n:'本周累计突破 8 次',  target:8,  stat:'breaks',   reward:{stone:600}},
  {id:'w_break15', n:'本周累计突破 15 次', target:15, stat:'breaks',   reward:{stone:1500}},
  {id:'w_mijing2', n:'本周完成 2 次秘境',  target:2,  stat:'mijing',   reward:{stone:800}},
  {id:'w_mijing4', n:'本周完成 4 次秘境',  target:4,  stat:'mijing',   reward:{stone:2000}},
  {id:'w_event3',  n:'本周处理 3 次事件',  target:3,  stat:'events',   reward:{stone:500}},
  {id:'w_event5',  n:'本周处理 5 次事件',  target:5,  stat:'events',   reward:{stone:1200}},
  {id:'w_recruit1',n:'本周收下 1 名弟子',  target:1,  stat:'recruits', reward:{stone:800}},
  {id:'w_signin5', n:'本周签到满 5 天',    target:5,  stat:'signIns',  reward:{stone:1500}},
  {id:'w_exped1',  n:'本周完成 1 次外派',  target:1,  stat:'expeditions', reward:{stone:600}},
  {id:'w_exped2',  n:'本周完成 2 次外派',  target:2,  stat:'expeditions', reward:{stone:1500}},
  {id:'w_tianxiang1',n:'本周经历一次天象变化',target:1,stat:'tianxiang',reward:{stone:600}}
];
/* 周目标奖励池（三件全完成时给一件）；扩展为包含洗髓丹、延寿丹 */
const WEEKLY_BIG_REWARDS=['break_pill','talent_pill','love_knot','rebirth_pill','long_life_pill'];

/* ============ 传承树节点 ============ */
const LEGACY_NODES=[
  {id:'scripture2', n:'藏经阁精进', ic:'📜', maxLv:3, desc:'藏经阁效果 +5%/级'},
  {id:'event',      n:'趋吉避凶',   ic:'🔮', maxLv:3, desc:'事件成功率 +3%/级'},
  {id:'loyalty',    n:'以德服人',   ic:'🤝', maxLv:3, desc:'新弟子初始忠诚 +5/级'},
  {id:'offline',    n:'闭关妙法',   ic:'🌙', maxLv:5, desc:'离线收益 +10%/级'},
  {id:'mijing',     n:'秘境通途',   ic:'🗺️', maxLv:3, desc:'秘境冷却 -10%/级'},
  {id:'break',      n:'天命所归',   ic:'⚡', maxLv:5, desc:'全体突破率 +1%/级'},
  {id:'discipleSlot', n:'广收门徒', ic:'👥', maxLv:2, desc:'弟子上限 +1/级'}
];

/* ============ 天下真实事件类型 ============ */
const WORLD_EVENT_TYPES=[
  {id:'challenge', n:'挑战', ic:'⚔️', weight:40, buff:false, desc:'3 天后某宗派弟子前来挑战'},
  {id:'treasure',  n:'秘宝', ic:'💎', weight:30, buff:true,  buffMul:1.5, buffDur:3*24*3600*1000, desc:'3 天内秘境收益 +50%'},
  {id:'sermon',    n:'论道', ic:'📖', weight:30, buff:true,  buffMul:1.15, buffDur:3*24*3600*1000, desc:'3 天内弟子修为 +15%'}
];

/* ============ 文案 ============ */
const TX={
  splash_story:{std:'六岁那年，你算了一笔账：<br>中国有14亿人，如果每人给你一毛钱……<br><span class="hl">你就有14亿毛。</span><span class="pause"></span>你兴奋得一夜没睡。<span class="pause"></span>后来你长大了，发现没有人会给你一毛钱。<span class="pause"></span>于是你决定修仙，<br>并立下大志：<span class="hl">培养出能收齐14亿毛的弟子。</span>',sc:'六岁那年，你算了一笔账：<br>中国有14亿人，要是每人给你一毛钱……<br><span class="hl">你就成14亿毛咯。</span><span class="pause"></span>你兴奋得一夜没睡。<span class="pause"></span>后来你长大了，才晓得没得哪个会给你一毛钱。<span class="pause"></span>于是你决定修仙，<br>并立下大志：<span class="hl">培养出能收齐14亿毛的弟子。</span>'},
  pz_good:{std:['不错，再接再厉。','此子可教。','好好修行，他日必有成就。','嗯，有几分样子了。','为师很欣慰。','继续保持。'],sc:['不错，继续搞。','这个娃儿可以。','好生修行，早晚有出息。','嗯，有点像样咯。','为师很欣慰。','保持住。']},
  pz_ok:{std:['知道了。','嗯。','继续吧。','随你。','下不为例。','务必用心。'],sc:['晓得咯。','嗯。','继续吧。','随便你。','下回莫这样咯。','好生点。']},
  pz_bad:{std:['……罢了。','下次注意。','不必灰心。','修行路上，本就多舛。','此事你也有责任。','记住这个教训。'],sc:['……算咯。','下回注意到。','莫灰心。','修行路本来就不平。','这事你也有份。','把教训记到。']},
  break_small:{std:['顺利突破至','水到渠成，突破','闭关数日，一举突破'],sc:['顺顺当当突破到','水到渠成，突破','闭关几天，一下就突破咯']},
  break_big:{std:['引来天雷，成功突破','大境界突破，宗门灵气为之一振！','终于迈入'],sc:['引来天雷，成功突破咯','大境界突破，宗门灵气一振！','终于迈进去咯']},
  fail:{std:['突破失败，但积累了感悟。','冲击瓶颈未果，弟子有些沮丧。','差了一点，弟子会再试。','失败了，弟子不灰心。'],sc:['突破没成，但也攒了点感悟。','冲瓶颈失败咯，弟子有点蔫。','差一点点，弟子还要再试。','失败咯，弟子不得灰心。']},
  gain:{std:['全体弟子共获得修为','这一轮下来，宗门进账修为','弟子们勤修不辍，合计修为'],sc:['徒弟些一共得咯修为','这一轮下来，宗门进账修为','弟子们勤修不辍，合计修为']},
  daily:{std:['弟子们都在安静修炼，没什么大事。','宗门一切如常，灵气平稳。','山中无岁月，弟子们各自修行。','这几天风平浪静，弟子们都在闭关。','弟子们切磋了几次，各有进益。','最近山中灵气浮动，弟子们说是好兆头。'],sc:['徒弟些都安安生生修炼，没得啥子事。','宗门一切正常，灵气也稳。','山中无岁月，弟子各自修行。','这几天风平浪静，徒弟些都在闭关。','徒弟些切磋咯几盘，各有长进。','最近山中灵气浮动，徒弟些说是好兆头。']},
  greet_lazy:{std:'弟子拜见掌门。……那个，能问下修炼时间可以晚点开始吗？',sc:'弟子拜见掌门。……那个，修炼时间能晚点开始不？'},
  greet_diligent:{std:'弟子拜见掌门。弟子资质平庸，但愿以勤补拙。',sc:'弟子拜见掌门。弟子资质一般，但愿以勤补拙。'},
  greet_clever:{std:'弟子拜见掌门。嘿嘿，以后就跟着您混了。',sc:'弟子拜见掌门。嘿嘿，以后就跟到你混咯。'},
  greet_steady:{std:'弟子拜见掌门。请掌门放心，弟子一定踏实修行。',sc:'弟子拜见掌门。掌门放心，弟子一定踏实修行。'},
  greet_fated:{std:'弟子拜见掌门。弟子……说不清，但总觉得和宗门有缘。',sc:'弟子拜见掌门。弟子……说不清，就是觉得跟宗门有缘。'},
  greet_proud:{std:'弟子拜见掌门。我，一定会成为最强的那个。',sc:'弟子拜见掌门。我，一定要当最强的那个。'},
  greet_loyal:{std:'弟子拜见掌门。弟子的命是掌门的。',sc:'弟子拜见掌门。弟子的命就是掌门的。'},
  greet_loner:{std:'……拜见掌门。',sc:'……拜见掌门。'},
  greet_romantic:{std:'弟子拜见掌门。……掌门，宗门里可有什么有趣的人？',sc:'弟子拜见掌门。……掌门，宗门里头有没得好耍的人？'},
  master_replies:{std:['好好修行。','入我门来，便是一家人。','不必多礼。','从今日起，你便是一毛宗弟子。','嗯，以后莫要偷懒。','你且安心住下，缺什么跟为师说。'],sc:['好生修行。','进门就是一家人咯。','莫多礼。','从今天起，你就是一毛宗的人咯。','嗯，以后莫偷懒。','你安心住到，缺啥子跟为师说。']},
  betroth_first:{std:'弟子只有一毛，请掌门收下。',sc:'弟子只有一毛，请掌门收下。'},
  betroth_gift_sub:{std:'弟子倾其所有，一片诚心',sc:'弟子倾家荡产，一片诚心'},
  betroth_choice_title:{std:'回 赠 见 面 礼',sc:'回 赠 见 面 礼'},
  tutorial:{std:['你是掌门。\n弟子在你门下修行。\n你只需批阅奏章、定方向、批资源。','弟子会定期上奏，奏章堆在案头。\n点「批阅奏章」处理即可。','好了，掌门。\n开始你的修仙事业吧。'],sc:['你是掌门咯。\n徒弟些在你门下修行。\n你只管批奏章、定方向、批资源。','弟子些定期上奏，奏章堆在案头。\n点「批阅奏章」处理就行。','好咯，掌门。\n开始搞你的事业咯。']}
};
function t(k){const it=TX[k];if(!it)return'';const d=s.dialect||'sc';return it[d]||it.std||''}
function tp(k){const v=t(k);return Array.isArray(v)?v:v}

/* ============ 性格/资质/灵根 ============ */
const PERSONALITIES=[
  {id:'diligent',n:'勤奋',ic:'📚',expMul:1.25,stoneMul:0.85,riskBonus:0,desc:'修炼快，不擅找毛'},
  {id:'clever',n:'机灵',ic:'🦊',expMul:0.90,stoneMul:1.30,riskBonus:0.03,desc:'毛多，偶尔捡漏'},
  {id:'steady',n:'稳重',ic:'🛡️',expMul:1.05,stoneMul:1.05,riskBonus:-0.05,desc:'收益均衡'},
  {id:'fated',n:'福缘',ic:'🍀',expMul:1.0,stoneMul:1.0,riskBonus:0.06,desc:'奇遇多'},
  {id:'proud',n:'好胜',ic:'⚔️',expMul:1.20,stoneMul:0.90,riskBonus:0.04,desc:'修炼快，易冲突'},
  {id:'lazy',n:'懒散',ic:'💤',expMul:0.80,stoneMul:0.92,riskBonus:0.06,desc:'修炼慢，偶顿悟'},
  {id:'loyal',n:'忠厚',ic:'🤝',expMul:1.0,stoneMul:1.0,riskBonus:-0.03,desc:'各项中等'},
  {id:'loner',n:'孤僻',ic:'🌙',expMul:1.30,stoneMul:0.78,riskBonus:0,desc:'修炼极快'},
  {id:'romantic',n:'痴情',ic:'🌸',expMul:0.95,stoneMul:1.0,riskBonus:0.04,desc:'易结道侣'}
];
const SPECIALTIES=[
  {id:'sword',    n:'剑修', ic:'⚔️', desc:'突破 +3%，秘境战斗收益 +20%', breakBonus:0.03, mijingBattleMul:1.2},
  {id:'alchemy',  n:'丹修', ic:'⚗️', desc:'忠诚恢复 +20%，寿元 +20 年', loyaltyMul:1.2, lifespanBonus:20},
  {id:'artifact', n:'器修', ic:'🔨', desc:'外派收益 +15%', expeditionMul:1.15},
  {id:'talisman', n:'符修', ic:'📜', desc:'事件成功率 +5%', eventBonus:0.05},
  {id:'merchant', n:'商修', ic:'💰', desc:'毛产出 +12%', stoneMul:1.12},
  {id:'body',     n:'体修', ic:'🛡️', desc:'受伤时间 -50%，修为 +5%', injuryMul:0.5, expMul:1.05}
];
const APTITUDES=[
  {id:'low',n:'下等',mul:0.7,w:22,color:'#8a9ca6'},
  {id:'mid',n:'中等',mul:1.0,w:42,color:'#7ab8c4'},
  {id:'high',n:'上等',mul:1.4,w:24,color:'#7dd99d'},
  {id:'genius',n:'天才',mul:2.0,w:9,color:'#e6c473'},
  {id:'monster',n:'妖孽',mul:3.0,w:3,color:'#c088dd'}
];
const GIFT_BASE={low:[1,3],mid:[2,6],high:[5,15],genius:[10,25],monster:[20,50]};
const ROOTS=[
  {id:'metal',n:'金',ic:'⚔️',tag:'破竹',bonus:'突破 +5%',color:'#e6dd8a',breakBonus:0.05},
  {id:'wood',n:'木',ic:'🌿',tag:'长生',bonus:'修为 +10%',color:'#7dd99d',expMul:1.10},
  {id:'water',n:'水',ic:'💧',tag:'润物',bonus:'事件 +8%',color:'#7ab8c4',eventBonus:0.08},
  {id:'fire',n:'火',ic:'🔥',tag:'炽盛',bonus:'毛 +12%',color:'#e6a877',stoneMul:1.12},
  {id:'earth',n:'土',ic:'⛰️',tag:'厚重',bonus:'突破 +3%',color:'#c9a97a',breakBonus:0.03},
  {id:'none',n:'伪',ic:'⚪',tag:'平凡',bonus:'无特殊加成',color:'#8a9ca6',eventBonus:0}
];
const ROOT_WEIGHTS=[{r:'metal',w:18},{r:'wood',w:18},{r:'water',w:18},{r:'fire',w:18},{r:'earth',w:18},{r:'none',w:10}];
const SURNAMES=['张','李','王','赵','陈','刘','孙','周','吴','郑','林','韩','萧','叶','秦','苏','许','何','罗','唐'];
const GIVEN_NAMES=['云','风','雨','雪','霜','月','星','辰','阳','浩','天','行','飞','扬','逸','尘','清','明','志','远','宇','轩','子','墨','青','玄','机'];
const CATCHPHRASES={
  diligent:['多练一个时辰也是好的。','勤能补拙，弟子不怕慢。','今日再进一分。','修行如逆水行舟。','弟子不聪明，就多练。'],
  clever:['嘿嘿，弟子又打听到点好玩的。','掌门，弟子这眼光，绝了。','这波啊，这波是稳赚不赔。','弟子在坊市混得开。','掌门，弟子脑子好用得很。'],
  steady:['稳一点，慢一点，不怕。','弟子按部就班。','掌门放心，弟子心里有数。','一步一个脚印。','不急，慢慢来。'],
  fated:['弟子总觉得要出大事。','弟子昨晚又做了个怪梦。','冥冥中自有天意。','弟子有预感，最近有奇遇。','这缘分，说不清。'],
  proud:['弟子一定会成为最强的。','弟子这次一定不会输。','弟子不弱于人。','不服就干。','再给弟子点时间。'],
  lazy:['今天的太阳好舒服啊……','能不能再睡一会儿……','弟子这是劳逸结合。','哎呀，今天能不能不修炼……','弟子正在参悟「无为」。'],
  loyal:['掌门说啥就是啥。','弟子永远忠于掌门。','掌门放心，有弟子在。','弟子这条命，是掌门的。','为掌门办事，义不容辞。'],
  loner:['……','弟子一个人挺好。','弟子先走了。','嗯。','……弟子不懂说话。'],
  romantic:['掌门，弟子最近遇到个人……','弟子觉得情之一字，也是修行。','弟子能请一天假吗？','弟子心里有个人。','缘分这种事，急不来。']
};
function rollCatchphrase(pid){return pick(CATCHPHRASES[pid]||CATCHPHRASES.steady)}

/* ============ 关系 ============ */
const RELATION_TYPES={
  fellow:{name:'同乡',ic:'🏘️',color:'#7dd99d',expBonus:0.05,desc:'一起修炼时更投入'},
  senior:{name:'师兄',ic:'🎓',color:'#e6c473',expBonus:0.03,desc:'照顾师弟'},
  junior:{name:'师弟',ic:'🌱',color:'#7ab8c4',expBonus:0.03,desc:'受师兄照顾'},
  lover:{name:'道侣',ic:'💕',color:'#e68aae',expBonus:0.20,desc:'双修有成'},
  rival:{name:'宿敌',ic:'⚔️',color:'#e58a8a',expBonus:0,breakMalus:-0.05,eventBonus:0.5,desc:'既是对手，也是动力'}
};
function relType(id){return RELATION_TYPES[id]||RELATION_TYPES.fellow}
function reverseRelType(t){if(t==='senior')return'junior';if(t==='junior')return'senior';return t}

/* ============ 忠诚度等级 ============ */
const LOYALTY_TIERS=[
  {id:'devoted',min:90,n:'死忠',ic:'💖',expMul:1.15,desc:'修为 +15%，绝不叛逃'},
  {id:'loyal',min:70,n:'忠心',ic:'❤️',expMul:1.08,desc:'修为 +8%'},
  {id:'normal',min:50,n:'平常',ic:'🖤',expMul:1.0,desc:'无变化'},
  {id:'unhappy',min:30,n:'不满',ic:'⚠️',expMul:0.95,desc:'修为 -5%'},
  {id:'wantsleave',min:0,n:'想走',ic:'🚨',expMul:0.85,desc:'修为 -15%，可能叛逃'}
];
function loyaltyTier(v){v=v||0;for(const t of LOYALTY_TIERS){if(v>=t.min)return t}return LOYALTY_TIERS[LOYALTY_TIERS.length-1]}
function loyaltyExpMul(d){return loyaltyTier(d.loyalty||50).expMul}
function loyaltyIcon(v){return loyaltyTier(v).ic}

/* ============ 道具定义（保留，仅作为奖励池使用） ============ */
const SHOP_ITEMS=[
  {id:'love_knot',n:'同心结',ic:'💕',desc:'随机撮合两名弟子结为道侣（一人一道侣）',action:'lover'},
  {id:'break_pill',n:'破障丹',ic:'⚗️',desc:'首席下次突破率 +50%',action:'breakPill'},
  {id:'talent_pill',n:'招贤令',ic:'📜',desc:'下一个弟子必为天才资质',action:'talentNext'},
  {id:'rebirth_pill',n:'洗髓丹',ic:'💊',desc:'随机弟子的根骨/悟性/福缘重掷',action:'reroll'},
  {id:'long_life_pill',n:'延寿丹',ic:'🌿',desc:'随机弟子寿元 +50 年',action:'longLife'}
];
function itemName(id){const it=SHOP_ITEMS.find(x=>x.id===id);return it?it.n:id}

/* ============ 成就 ============ */
const ACHIEVEMENTS=[
  {id:'first_break',n:'初入道途',d:'弟子第一次突破',ic:'⚡',reward:{stone:50},check:s=>s.discipleList.some(d=>d.totalBreaks>=1)},
  {id:'ten_breaks',n:'勤修不辍',d:'累计突破 10 次',ic:'📈',reward:{stone:200},check:s=>s.discipleList.reduce((a,d)=>a+d.totalBreaks,0)>=10},
  {id:'fifty_breaks',n:'桃李芬芳',d:'累计突破 50 次',ic:'🌳',reward:{stone:2000},check:s=>s.discipleList.reduce((a,d)=>a+d.totalBreaks,0)>=50},
  {id:'hundred_breaks',n:'一代宗师',d:'累计突破 100 次',ic:'👑',reward:{stone:10000},check:s=>s.discipleList.reduce((a,d)=>a+d.totalBreaks,0)>=100},
  {id:'first_jindan',n:'金丹大道',d:'首席达到金丹',ic:'🥇',reward:{stone:5000},check:s=>{const t=topDisciple();return t&&t.level>=27}},
  {id:'first_yuanying',n:'元婴出窍',d:'首席达到元婴',ic:'👶',reward:{stone:30000},check:s=>{const t=topDisciple();return t&&t.level>=36}},
  {id:'first_huashen',n:'神识化域',d:'首席达到化神',ic:'👁️',reward:{stone:100000},check:s=>{const t=topDisciple();return t&&t.level>=45}},
  {id:'rich_1w',n:'略有家资',d:'毛达到 1 万',ic:'💵',reward:{stone:1000},check:s=>s.stones.gte(Dec.of(10000))},
  {id:'rich_100w',n:'富甲一方',d:'毛达到 100 万',ic:'💎',reward:{stone:20000},check:s=>s.stones.gte(Dec.of(1000000))},
  {id:'rich_1y',n:'富可敌国',d:'毛达到 1 亿',ic:'🏦',reward:{stone:2000000},check:s=>s.stones.gte(Dec.of(100000000))},
  {id:'two_disciples',n:'兄友弟恭',d:'收下第二名弟子',ic:'👥',reward:{stone:100},check:s=>s.discipleList.length>=2},
  {id:'six_disciples',n:'桃李满门',d:'收满 6 名弟子',ic:'🏛️',reward:{stone:20000},check:s=>s.discipleList.length>=6},
  {id:'first_event',n:'初掌宗门',d:'第一次处理事件',ic:'📋',reward:{stone:50},check:s=>s.flags.handledEvent},
  {id:'great_event',n:'天命所归',d:'事件大成功',ic:'🌟',reward:{stone:200},check:s=>s.flags.eventGreat},
  {id:'awful_event',n:'福祸相依',d:'事件大失败',ic:'💥',reward:{stone:30},check:s=>s.flags.eventAwful},
  {id:'first_build',n:'大兴土木',d:'升级第一个建筑',ic:'🔨',reward:{stone:50},check:s=>s.cave>0||Object.values(s.buildings).some(v=>v>0)},
  {id:'cave_10',n:'洞天福地',d:'洞府达到 10 级',ic:'🏔️',reward:{stone:20000},check:s=>s.cave>=10},
  {id:'first_era',n:'纪元轮回',d:'第一次转生',ic:'♻️',reward:{stone:50000},check:s=>s.eras>=1},
  {id:'report_100',n:'勤政爱民',d:'累计收到 100 份奏章',ic:'🖋️',reward:{stone:5000},check:s=>s.totalReports>=100},
  {id:'login_3',n:'道心初定',d:'累计登录 3 天',ic:'📅',reward:{stone:200},check:s=>s.loginDays>=3},
  {id:'login_7',n:'坚持不懈',d:'累计登录 7 天',ic:'📆',reward:{stone:2000},check:s=>s.loginDays>=7},
  {id:'chosen_one',n:'天命之子',d:'收下一名天命之子',ic:'✨',challenge:true,reward:{item:'break_pill'},title:'天命掌门',check:s=>s.discipleList.some(d=>d.chosen)},
  {id:'survive_tianjie',n:'渡过天劫',d:'成功度过一次天劫',ic:'⚡',challenge:true,reward:{stone:50000},title:'渡劫真人',check:s=>s.flags.survivedTianjie},
  {id:'one_disciple_jindan',n:'独木成林',d:'只用一名弟子达到金丹',ic:'🌲',challenge:true,reward:{item:'talent_pill'},title:'孤木剑仙',check:s=>s.discipleList.length===1&&s.discipleList[0].level>=27},
  {id:'first_mijing',n:'秘境初探',d:'第一次完成秘境',ic:'🗺️',reward:{stone:500},check:s=>s.stats.mijingDone>=1},
  {id:'mijing_10',n:'秘境老手',d:'完成 10 次秘境',ic:'🧭',reward:{stone:10000},check:s=>s.stats.mijingDone>=10},
  {id:'first_loyal',n:'真心相待',d:'拥有一位非骄纵、忠诚 90+ 且入门满 7 天的弟子',ic:'💖',challenge:true,reward:{item:'love_knot'},title:'仁德掌门',check:s=>s.discipleList.some(d=>(d.loyalty||0)>=90&&!d.pampered&&(Date.now()-(d.joinedAt||Date.now()))>=7*86400000)},
  {id:'has_lover',n:'道侣天成',d:'宗门出现一对道侣',ic:'💕',challenge:true,reward:{stone:20000},check:s=>s.discipleList.some(d=>(d.relationships||[]).some(r=>r.type==='lover'))},
  {id:'has_rival',n:'相爱相杀',d:'宗门出现一对宿敌',ic:'⚔️',reward:{stone:5000},check:s=>s.discipleList.some(d=>(d.relationships||[]).some(r=>r.type==='rival'))},
  {id:'first_death',n:'尘归尘',d:'第一次送别弟子',ic:'🕯️',challenge:true,reward:{stone:20000},title:'执灯人',check:s=>s.flags.firstDeath},
  {id:'relic_3',n:'薪火相传',d:'收集 3 件遗物',ic:'🕯️',reward:{stone:50000},check:s=>(s.relics||[]).length>=3},
  {id:'first_ending',n:'一毛之梦',d:'达成 14 亿毛',ic:'🌟',challenge:true,reward:{stone:1000000},title:'一毛真人',check:s=>s.flags.endingReached},
  {id:'loyalty_95',n:'死忠',d:'拥有一位非骄纵、忠诚 95+ 且入门满 7 天的弟子',ic:'💖',challenge:true,reward:{stone:5000},check:s=>s.discipleList.some(d=>(d.loyalty||0)>=95&&!d.pampered&&(Date.now()-(d.joinedAt||Date.now()))>=7*86400000)},
  {id:'tianxiang_spirit',n:'灵气潮汐',d:'经历过一次灵气潮汐',ic:'🌊',reward:{stone:500},check:s=>s.flags.tianxiangSpirit},
  {id:'tianxiang_grand',n:'天下大比',d:'经历过一次天下大比',ic:'🏆',challenge:true,reward:{stone:20000},check:s=>s.flags.tianxiangGrand},
  {id:'signin_7',n:'七日之约',d:'累计签到 7 天',ic:'📅',reward:{stone:500},check:s=>s.signIn&&s.signIn.totalDays>=7},
  {id:'signin_30',n:'一月不辍',d:'累计签到 30 天',ic:'📆',challenge:true,reward:{stone:10000},title:'恒心掌门',check:s=>s.signIn&&s.signIn.totalDays>=30},
  {id:'milestone_1w',n:'第一桶金',d:'达成 1 万毛里程碑',ic:'💰',reward:{stone:1000},check:s=>s.milestones&&s.milestones.m1w},
  {id:'milestone_1y',n:'富可敌国',d:'达成 1 亿毛里程碑',ic:'🏦',challenge:true,reward:{stone:500000},check:s=>s.milestones&&s.milestones.m1y},
  {id:'arc_master',n:'因材施教',d:'有弟子完成三段个人弧光',ic:'📖',challenge:true,reward:{stone:30000},title:'明师',check:s=>s.discipleList.some(d=>d.storyArcs&&d.storyArcs.filter(a=>a.done).length>=3)},
  {id:'chain_all',n:'天下事了',d:'完成两条事件链',ic:'🔗',reward:{stone:10000},check:s=>s.eventChain&&Object.keys(s.eventChain).filter(k=>s.eventChain[k]>=3).length>=2},
  {id:'expedition_first',n:'行万里路',d:'第一次外派弟子',ic:'🧭',reward:{stone:500},check:s=>s.stats.expeditionsDone>=1},
  {id:'expedition_10',n:'周游四方',d:'累计完成 10 次外派',ic:'🗺️',challenge:true,reward:{stone:30000},check:s=>s.stats.expeditionsDone>=10},
  {id:'weekly_full',n:'月旦评满',d:'完成一次周目标全部任务',ic:'📊',challenge:true,reward:{stone:20000},title:'守约掌门',check:s=>s.stats.weeklyFullCount>=1},
  {id:'legacy_first',n:'薪火之种',d:'第一次点传承树',ic:'♻️',reward:{stone:1000},check:s=>s.legacyTree&&Object.values(s.legacyTree).some(v=>v>0)},
  {id:'yearbook_first',n:'岁月有痕',d:'第一次看到年鉴',ic:'📖',reward:{stone:5000},check:s=>(s.yearbooks||[]).length>=1},
  {id:'world_first',n:'风云际会',d:'第一次经历天下真实事件',ic:'🌏',reward:{stone:1000},check:s=>s.stats.worldEventsSeen>=1}
];

/* ============ 建筑 ============ */
const BUILDINGS=[
  {key:'scripture',n:'藏经阁',ic:'📜',desc:'提升全体弟子修为速度',max:20,effect:lv=>'修为 +'+(lv*10)+'%'},
  {key:'alchemy',n:'炼丹房',ic:'⚗️',desc:'提升事件成功率',max:20,effect:lv=>'事件成功 +'+(lv*2)+'%'},
  {key:'arena',n:'演武场',ic:'⚔️',desc:'提升突破成功率',max:20,effect:lv=>'突破 +'+(lv*1.5).toFixed(1)+'%'},
  {key:'array',n:'护山大阵',ic:'🔮',desc:'减少负面事件概率',max:10,effect:lv=>'负面 -'+(lv*5)+'%'},
  {key:'cave',n:'洞府',ic:'🏔️',desc:'提升修为和毛速度',max:100,effect:lv=>'修为 +'+(lv*20)+'%，毛 +'+(lv*12)+'%'}
];

/* ============ 掌门月令 ============ */
const MOON_ORDERS=[
  {id:'cultivate', n:'潜修', ic:'🧘', desc:'修为 +25%，毛 -15%', expMul:1.25, stoneMul:0.85, loyaltyDaily:0},
  {id:'gather',    n:'敛财', ic:'💰', desc:'毛 +30%，修为 -10%', expMul:0.90, stoneMul:1.30, loyaltyDaily:0},
  {id:'train',     n:'历练', ic:'⚔️', desc:'外派/秘境收益 +20%', expMul:1.0, stoneMul:1.0, loyaltyDaily:0, expeditionMul:1.2, mijingMul:1.2},
  {id:'diplomacy', n:'外交', ic:'🤝', desc:'忠诚 +0.2/天，天下事件收益 +30%', expMul:1.0, stoneMul:1.0, loyaltyDaily:0.2, worldMul:1.3},
  {id:'rest',      n:'休养', ic:'🌿', desc:'忠诚 +0.5/天，产出 -15%', expMul:0.85, stoneMul:0.85, loyaltyDaily:0.5}
];
function moonOrder(){return MOON_ORDERS.find(x=>x.id===s.moonOrder)||MOON_ORDERS[0]}
function moonExpMul(){return moonOrder().expMul||1}
function moonStoneMul(){return moonOrder().stoneMul||1}
function moonLoyaltyDaily(){return moonOrder().loyaltyDaily||0}
function moonExpeditionMul(){return moonOrder().expeditionMul||1}
function moonMijingMul(){return moonOrder().mijingMul||1}
function moonWorldMul(){return moonOrder().worldMul||1}

/* ============ 每日任务 ============ */
const DAILY_TASK_POOL=[
  {id:'read3',n:'批阅 3 份奏章',target:3,reward:{stone:50},stat:'todayMemosRead'},
  {id:'read5',n:'批阅 5 份奏章',target:5,reward:{stone:120},stat:'todayMemosRead'},
  {id:'read8',n:'批阅 8 份奏章',target:8,reward:{stone:250},stat:'todayMemosRead'},
  {id:'break1',n:'弟子突破 1 次',target:1,reward:{exp:50},stat:'todayBreaks'},
  {id:'break3',n:'弟子突破 3 次',target:3,reward:{stone:120},stat:'todayBreaks'},
  {id:'break5',n:'弟子突破 5 次',target:5,reward:{stone:250},stat:'todayBreaks'},
  {id:'event1',n:'处理 1 次事件',target:1,reward:{stone:50},stat:'todayEvents'},
  {id:'event2',n:'处理 2 次事件',target:2,reward:{stone:150},stat:'todayEvents'},
  {id:'great1',n:'事件成功 1 次',target:1,reward:{stone:80},stat:'todayEventGood'},
  {id:'great2',n:'事件成功 2 次',target:2,reward:{stone:250},stat:'todayEventGood'},
  {id:'recruit1',n:'招收 1 名弟子',target:1,reward:{stone:50},stat:'todayRecruits'},
  {id:'recruit2',n:'招收 2 名弟子',target:2,reward:{stone:200},stat:'todayRecruits'},
  {id:'mijing1',n:'完成 1 次秘境',target:1,reward:{stone:150},stat:'todayMijing'},
  {id:'mijing2',n:'完成 2 次秘境',target:2,reward:{stone:400},stat:'todayMijing'},
  {id:'sign1',n:'完成今日签到',target:1,reward:{stone:80},special:'signIn'},
  {id:'loyal80',n:'让一名弟子忠诚达到 80',target:1,reward:{stone:200},special:'loyal80'}
];

/* ============ 弟子故事 ============ */
const STORY_TEMPLATES={
  origin:['{name}出身江南水乡，父亲是个渔夫。','{name}来自北方小镇，家里开着一间药铺。','{name}出身富贵人家，却自幼体弱多病。','{name}是个孤儿，被一位老道士捡到养大。','{name}是猎户的儿子，从小在山里长大。','{name}出身书香门第，本该考取功名。','{name}家道中落，父母把他送进了山。','{name}生在边关，见过风沙，也见过血。'],
  reason:['那年秋天，村里来了一位道人，说他根骨不错。','父母犹豫了三天，最终把他送进了山。','他曾在山门外跪了一夜，直到天明。','是他的师兄路过，把他带回了宗门。','他带着一枚玉佩，来到了山门前。','有一天，他在梦里看到了一扇门。','他背着一把剑，走了七天的路。'],
  wish:['他想修炼有成，回去看看爹娘。','他想找到当年那个道人，问一句为什么。','他想有一天，能站在山巅看一看云。','他不想再被人看不起。','他只是想活下去，活得久一点。','他想找到自己的来处。','他想报一个仇，也想放下一个仇。','他只是想看看，修行的尽头是什么。']
};

/* ============ 弟子个人剧情（3 段弧光）============ */
const STORY_ARCS={
  diligent:[
    {stage:1,lv:18,title:'一份家书',text:'弟子收到一封家书。父亲病重，想见最后一面。',choices:[{n:'让他回去',effect:{exp:50,loyalty:10},text:'弟子归家送终，回来后更刻苦。'},{n:'留他修炼',effect:{exp:150,loyalty:-15},text:'弟子没回去。那天晚上，他一个人坐了很久。'}]},
    {stage:2,lv:27,title:'师弟的请教',text:'新来的师弟问他：「师兄，你为什么这么拼？」',choices:[{n:'他讲了家书的事',effect:{exp:80,loyalty:10},text:'师弟听完，也沉默了很久。'},{n:'他只说「习惯了」',effect:{exp:120,loyalty:3},text:'师弟没听懂，但他也没多解释。'}]},
    {stage:3,lv:36,title:'授业',text:'弟子主动提出，想带一个新入门的弟子。',choices:[{n:'让他带',effect:{exp:200,loyalty:15},text:'他把自己会的，一样一样教给新人。'},{n:'让他专心修炼',effect:{exp:400,loyalty:-5},text:'他有些失落，但还是回去修炼了。'}],reward:{type:'exp',value:0.03,icon:'📚',name:'苦修之证',desc:'全宗门修为 +3%（永久）',title:'苦修者'}}
  ],
  clever:[
    {stage:1,lv:15,title:'一笔生意',text:'弟子发现宗门附近有个商机，想借点本钱。',choices:[{n:'借他 100 毛',cost:100,effect:{stone:500,exp:20},text:'弟子赚了一笔，还了本钱还多给了宗门。'},{n:'不借',effect:{exp:20,loyalty:-5},text:'弟子有些失望。'}]},
    {stage:2,lv:22,title:'一次豪赌',text:'弟子说，他看准了一批货，但需要一大笔本钱。',choices:[{n:'倾囊相助',cost:500,effect:{stone:3000,exp:50,loyalty:10},text:'他押上了全部身家，也押上了你对他的信任。'},{n:'稳一点',effect:{exp:40,loyalty:-3},text:'他听了你的话，但眼神里有点不甘。'}]},
    {stage:3,lv:33,title:'一代商贾',text:'弟子已经能独当一面，他说想为宗门立一条商路。',choices:[{n:'让他去',effect:{stone:5000,exp:100,loyalty:15},text:'他立下的商路，让宗门受益百年。'},{n:'留在宗门',effect:{exp:200,loyalty:3},text:'他留下了，但你知道，他本来能走得更远。'}],reward:{type:'stone',value:0.03,icon:'💰',name:'商贾之印',desc:'全宗门毛 +3%（永久）',title:'一代商贾'}}
  ],
  steady:[
    {stage:1,lv:20,title:'守夜',text:'弟子主动为宗门守夜。',choices:[{n:'让他守',effect:{exp:60,loyalty:5},text:'他一夜没睡，第二天却精神很好。'},{n:'让他休息',effect:{exp:20,loyalty:3},text:'弟子很感激。'}]},
    {stage:2,lv:30,title:'独当一面',text:'宗门有事需要人处理，弟子主动请缨。',choices:[{n:'交给他',effect:{exp:150,loyalty:10},text:'他办得滴水不漏。'},{n:'再等等',effect:{exp:60,loyalty:-5},text:'他退下了，但你没看到他攥紧的手。'}]},
    {stage:3,lv:42,title:'宗门柱石',text:'弟子说：「掌门，宗门的事，以后有我。」',choices:[{n:'把一部分交给他',effect:{exp:300,loyalty:20},text:'从那天起，他真的成了宗门的柱石。'},{n:'让他专心突破',effect:{exp:400,loyalty:5},text:'他没说什么，只是更用功了。'}],reward:{type:'break',value:0.01,icon:'🛡️',name:'守心之印',desc:'全宗门突破 +1%（永久）',title:'宗门柱石'}}
  ],
  fated:[
    {stage:1,lv:15,title:'一个梦',text:'弟子说梦里有人告诉他，山中有宝物。',choices:[{n:'信他',effect:{stone:300,exp:40},text:'真让他挖到了。'},{n:'不信',effect:{exp:10},text:'弟子悻悻而归。'}]},
    {stage:2,lv:24,title:'一次预言',text:'弟子说他梦见宗门将有一场大劫。',choices:[{n:'信他，提前防备',effect:{exp:80,loyalty:10},text:'大劫来了，但宗门没伤到分毫。'},{n:'不信',effect:{exp:40,loyalty:-8},text:'大劫来了，宗门损失了一些东西。'}]},
    {stage:3,lv:36,title:'天命所归',text:'弟子说：「掌门，我终于知道，我为什么来了。」',choices:[{n:'听他讲',effect:{exp:250,loyalty:15},text:'他说了很久，你听懂了。'},{n:'不必说',effect:{exp:350,loyalty:3},text:'他点点头，笑了。'}],reward:{type:'stone',value:0.03,icon:'🍀',name:'天命之印',desc:'全宗门毛 +3%（永久）',title:'知天命者'}}
  ],
  proud:[
    {stage:1,lv:18,title:'一场比试',text:'弟子想挑战首席的位置。',choices:[{n:'让他挑战',effect:{exp:150},text:'比试一场，双方都有收获。'},{n:'不必',effect:{exp:20,loyalty:-8},text:'弟子不服，却也没说什么。'}]},
    {stage:2,lv:28,title:'一次失败',text:'弟子输了一场他不该输的比试。',choices:[{n:'陪他坐一会儿',effect:{exp:100,loyalty:20},text:'他一句话没说，但你看到他眼睛红了。'},{n:'让他自己想通',effect:{exp:200,loyalty:-5},text:'他闭关了三天，出来后更沉默了。'}]},
    {stage:3,lv:40,title:'强者之心',text:'弟子说：「掌门，我不再想当最强的了。」',choices:[{n:'问他为什么',effect:{exp:250,loyalty:15},text:'他说：「我想让宗门，成为最强的。」'},{n:'拍拍他的肩',effect:{exp:350,loyalty:10},text:'他愣住了，然后笑了。'}],reward:{type:'break',value:0.01,icon:'⚔️',name:'争锋之印',desc:'全宗门突破 +1%（永久）',title:'不争者'}}
  ],
  lazy:[
    {stage:1,lv:12,title:'一个午觉',text:'弟子在藏经阁睡着了，被其他弟子告状。',choices:[{n:'罚他抄经',effect:{exp:40,loyalty:-3},text:'弟子抄了一整夜。'},{n:'让他睡',effect:{exp:100,loyalty:8},text:'弟子醒来后，居然顿悟了一点。'}]},
    {stage:2,lv:22,title:'一次顿悟',text:'弟子说他睡了一觉，梦里想通了一件事。',choices:[{n:'听他说',effect:{exp:120,loyalty:10},text:'他说的那件事，让你也想了很久。'},{n:'让他继续睡',effect:{exp:180,loyalty:5},text:'他真的去睡了，第二天又顿悟了一点。'}]},
    {stage:3,lv:33,title:'大智若愚',text:'弟子说：「掌门，我大概明白了，修炼不是为了变强。」',choices:[{n:'问他为了什么',effect:{exp:220,loyalty:15},text:'他说：「是为了能一直睡下去。」'},{n:'让他去睡',effect:{exp:300,loyalty:10},text:'他真的去睡了，但你觉得，他其实是宗门里最清醒的人。'}],reward:{type:'exp',value:0.03,icon:'💤',name:'无为之心',desc:'全宗门修为 +3%（永久）',title:'无为者'}}
  ],
  loyal:[
    {stage:1,lv:15,title:'一次选择',text:'有其他宗门想挖走弟子，开出了优厚的条件。',choices:[{n:'挽留他',effect:{exp:40,loyalty:20},text:'弟子拒绝了对方。'},{n:'让他自己决定',effect:{exp:20,loyalty:5},text:'弟子留了下来。'}]},
    {stage:2,lv:25,title:'一次危机',text:'宗门遭袭，弟子挡在了最前面。',choices:[{n:'让他上',effect:{exp:150,loyalty:10},text:'他受了伤，但宗门没事。'},{n:'拦住他',effect:{exp:80,loyalty:15},text:'他很不情愿，但还是听了你的话。'}]},
    {stage:3,lv:38,title:'守心不渝',text:'弟子说：「掌门，弟子这一生，就守在这里了。」',choices:[{n:'拍拍他的肩',effect:{exp:250,loyalty:20},text:'他没再说什么，但你懂了。'},{n:'让他出去闯',effect:{exp:400,loyalty:5},text:'他摇摇头：「弟子只想守在这里。」'}],reward:{type:'exp',value:0.03,icon:'🤝',name:'守心之证',desc:'全宗门修为 +3%（永久）',title:'守心人'}}
  ],
  loner:[
    {stage:1,lv:18,title:'一个人',text:'弟子在后山待了三天，没人知道他在干什么。',choices:[{n:'去看看他',effect:{exp:60,loyalty:10},text:'弟子看到掌门，愣了一下，然后点了点头。'},{n:'由他去',effect:{exp:100,loyalty:-3},text:'弟子回来时，好像悟到了什么。'}]},
    {stage:2,lv:28,title:'一次出关',text:'弟子闭关七天，出关时变了一个人。',choices:[{n:'问他悟到了什么',effect:{exp:150,loyalty:5},text:'他只说了三个字：「一个人。」'},{n:'不问',effect:{exp:220,loyalty:10},text:'他看了你一眼，点了点头。'}]},
    {stage:3,lv:40,title:'独行千里',text:'弟子说：「掌门，弟子想去走一走。」',choices:[{n:'让他去',effect:{exp:300,loyalty:15},text:'他走了三年，回来时带了一身风霜，和一颗更静的心。'},{n:'留住他',effect:{exp:180,loyalty:-10},text:'他留下了，但你知道，他的心还在路上。'}],reward:{type:'exp',value:0.03,icon:'🌙',name:'独行之印',desc:'全宗门修为 +3%（永久）',title:'独行者'}}
  ],
  romantic:[
    {stage:1,lv:15,title:'一段缘分',text:'弟子对另一名弟子有了情意。',choices:[{n:'撮合他们',effect:{exp:60,loyalty:15},text:'两人成了道侣，宗门多了一对。'},{n:'让他专心',effect:{exp:100,loyalty:-10},text:'弟子把情意埋在了心里。'}]},
    {stage:2,lv:25,title:'一次分别',text:'弟子和道侣因为修炼理念不同，冷战了。',choices:[{n:'劝他们和好',effect:{exp:120,loyalty:15},text:'两人抱头痛哭，之后感情更好。'},{n:'让他们自己解决',effect:{exp:180,loyalty:-5},text:'他们和好了，但心里有了裂痕。'}]},
    {stage:3,lv:38,title:'情之所钟',text:'弟子说：「掌门，弟子明白了，情也是道。」',choices:[{n:'点头',effect:{exp:250,loyalty:20},text:'他笑了，眼睛很亮。'},{n:'问他后不后悔',effect:{exp:300,loyalty:10},text:'他说：「不后悔。」'}],reward:{type:'stone',value:0.03,icon:'🌸',name:'情之所钟',desc:'全宗门毛 +3%（永久）',title:'有情者'}}
  ]
};

/* ============ 事件模板 ============ */
function eventScale(d){
  if(!d)return{stone:50,exp:50,level:0};
  const sr=discipleStoneRate(d).toNum();
  const er=discipleExpRate(d).toNum();
  return{
    stone:Math.max(50,Math.floor(sr*500)),
    exp:Math.max(50,Math.floor(er*500)),
    level:d.level
  };
}
function evStone(sc,mul){return Math.max(1,Math.floor(sc.stone*(mul||1)))}
function evExp(sc,mul){return Math.max(1,Math.floor(sc.exp*(mul||1)))}

const EVENT_TEMPLATES=[
  {id:'village_visit',title:'山下来客',minLv:0,chainId:'village',chainStep:1,build(sc){const gift=evStone(sc,0.15);return{ask:'山下村庄的里正带着几袋米面来拜访。',choices:[
    {n:'全数收下',tag:'safe',tagText:'保守',desc:'收下礼物',outcomes:{great:{w:2,exp:evExp(sc,0.5),text:'里正还带来一坛自酿的酒。'},good:{w:5,exp:evExp(sc,0.3),text:'弟子们饱餐一顿。'},ok:{w:3,exp:evExp(sc,0.1),text:'收下了。'},bad:{w:2,exp:0,text:'米面有点陈。'},awful:{w:1,exp:-evExp(sc,0.05),text:'米里有虫。'}}},
    {n:'以毛回礼',tag:'cost',tagText:'花费',desc:'花 '+gift+' 毛',cost:gift,outcomes:{great:{w:2,exp:evExp(sc,1.2),text:'村民感动。'},good:{w:4,exp:evExp(sc,0.6),text:'回赠山货。'},ok:{w:3,exp:evExp(sc,0.2),text:'千恩万谢。'},bad:{w:2,exp:0,text:'不好意思。'},awful:{w:1,exp:-evExp(sc,0.1),text:'办事不妥。'}}},
    {n:'婉拒',tag:'safe',tagText:'保守',desc:'继续修行',outcomes:{great:{w:1,exp:evExp(sc,0.8),text:'心无旁骛。'},good:{w:4,exp:evExp(sc,0.3),text:'继续修炼。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'不好意思。'},awful:{w:1,exp:-evExp(sc,0.1),text:'传出闲话。'}}}
  ]}}},
  {id:'village_return',title:'村民来求援',minLv:8,chainId:'village',chainStep:2,build(sc){const cost=evStone(sc,0.5);return{ask:'上次来过的里正又来了，这次是求援——山下闹了兽灾。',choices:[
    {n:'派弟子下山',tag:'risky',tagText:'激进',desc:'花 '+cost+' 毛',cost:cost,outcomes:{great:{w:2,stone:evStone(sc,3),exp:evExp(sc,2),text:'弟子击退兽群，村民感恩戴德。'},good:{w:4,stone:evStone(sc,1.2),exp:evExp(sc,0.8),text:'兽灾平息。'},ok:{w:3,stone:evStone(sc,0.4),text:'勉强应付。'},bad:{w:2,stone:-Math.floor(cost*0.5),text:'弟子受了伤。'},awful:{w:1,stone:-cost,exp:-evExp(sc,2),text:'弟子重伤。'}}},
    {n:'婉拒',tag:'safe',tagText:'保守',desc:'自家事要紧',outcomes:{great:{w:1,exp:evExp(sc,1),text:'专心修炼。'},good:{w:3,exp:evExp(sc,0.4),text:'没帮上。'},ok:{w:4,exp:0,text:'村民自己解决了。'},bad:{w:2,exp:-evExp(sc,0.3),text:'村民有怨言。'},awful:{w:1,exp:-evExp(sc,0.8),text:'名声受损。'}}}
  ]}}},
  {id:'village_gift',title:'村民送大礼',minLv:18,chainId:'village',chainStep:3,build(sc){const gift=evStone(sc,1.2);return{ask:'村民感恩上次援手，抬着一口大箱子上山。',choices:[
    {n:'收下',tag:'safe',tagText:'保守',desc:'收下礼物',outcomes:{great:{w:3,stone:evStone(sc,4),exp:evExp(sc,1),text:'箱子里是村里攒了多年的毛。'},good:{w:5,stone:evStone(sc,1.5),exp:evExp(sc,0.5),text:'礼轻情意重。'},ok:{w:2,stone:evStone(sc,0.6),text:'收下了。'},bad:{w:1,stone:0,text:'都是些旧物。'},awful:{w:1,stone:0,exp:-evExp(sc,0.3),text:'不太实用。'}}},
    {n:'回赠丹药',tag:'cost',tagText:'花费',desc:'花 '+Math.floor(gift*0.3)+' 毛',cost:Math.floor(gift*0.3),outcomes:{great:{w:2,exp:evExp(sc,2),stone:evStone(sc,4),text:'村民更加敬重。'},good:{w:4,exp:evExp(sc,1),stone:evStone(sc,1.2),text:'礼尚往来。'},ok:{w:3,exp:evExp(sc,0.3),text:'走个过场。'},bad:{w:1,exp:0,text:'村民不好意思收。'},awful:{w:1,exp:-evExp(sc,0.5),text:'觉得宗门傲慢。'}}}
  ]}}},
  {id:'spring',title:'后山灵泉',minLv:0,build(sc){const dig=evStone(sc,0.3);return{ask:'弟子在后山发现一眼泉水。',choices:[
    {n:'开凿',tag:'risky',tagText:'激进',desc:'花 '+dig+' 毛',cost:dig,outcomes:{great:{w:1,stone:evStone(sc,2),exp:evExp(sc,1.5),text:'泉眼越挖越旺！'},good:{w:3,stone:evStone(sc,0.8),exp:evExp(sc,0.5),text:'顺利开凿。'},ok:{w:3,stone:evStone(sc,0.3),text:'收益一般。'},bad:{w:2,stone:-Math.floor(dig*0.4),text:'塌了半边。'},awful:{w:1,stone:-dig,text:'全赔了。'}}},
    {n:'报告',tag:'safe',tagText:'保守',desc:'如实禀报',outcomes:{great:{w:1,exp:evExp(sc,0.8),text:'觉察天机。'},good:{w:4,exp:evExp(sc,0.3),text:'心里踏实。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'不够重视。'},awful:{w:1,exp:-evExp(sc,0.1),text:'被嘲笑。'}}},
    {n:'暂不理会',tag:'safe',tagText:'保守',desc:'专心修炼',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'记住这地方。'},good:{w:3,exp:evExp(sc,0.1),text:'继续修炼。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'有点可惜。'},awful:{w:1,exp:-evExp(sc,0.1),text:'泉水枯了。'}}}
  ]}}},
  {id:'bell',title:'夜半钟声',minLv:0,build(sc){const visit=evStone(sc,0.2);return{ask:'夜里远处传来一阵钟声。',choices:[
    {n:'去拜访',tag:'risky',tagText:'激进',desc:'花 '+visit+' 毛',cost:visit,outcomes:{great:{w:1,exp:evExp(sc,4),text:'隐修前辈指点。'},good:{w:3,exp:evExp(sc,1.2),text:'受益良多。'},ok:{w:3,exp:evExp(sc,0.3),text:'普通香客。'},bad:{w:2,exp:0,text:'门扉紧闭。'},awful:{w:1,exp:-evExp(sc,0.3),text:'病了一场。'}}},
    {n:'静听',tag:'safe',tagText:'保守',desc:'什么也不做',outcomes:{great:{w:2,exp:evExp(sc,0.8),text:'一夜开悟。'},good:{w:4,exp:evExp(sc,0.4),text:'心静如水。'},ok:{w:3,exp:evExp(sc,0.1),text:'普通钟声。'},bad:{w:1,exp:0,text:'睡着了。'},awful:{w:1,exp:-evExp(sc,0.1),text:'一夜未眠。'}}},
    {n:'不理会',tag:'safe',tagText:'保守',desc:'继续修行',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'心境更高。'},good:{w:4,exp:evExp(sc,0.1),text:'继续修炼。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'错过什么。'},awful:{w:1,exp:-evExp(sc,0.1),text:'心神不宁。'}}}
  ]}}},
  {id:'oldbook',title:'旧书残卷',minLv:0,build(sc){const buy=evStone(sc,0.25);return{ask:'弟子在旧货堆里翻到一本残缺的古书。',choices:[
    {n:'买下',tag:'cost',tagText:'花费',desc:'花 '+buy+' 毛',cost:buy,outcomes:{great:{w:1,exp:evExp(sc,3),text:'残缺功法！'},good:{w:3,exp:evExp(sc,1),text:'有些真东西。'},ok:{w:3,exp:evExp(sc,0.3),text:'没什么大用。'},bad:{w:2,exp:0,text:'一本破书。'},awful:{w:1,exp:-evExp(sc,0.3),text:'假书。'}}},
    {n:'不买',tag:'safe',tagText:'保守',desc:'省钱',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'心无旁骛。'},good:{w:3,exp:evExp(sc,0.1),text:'继续逛。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'后悔。'},awful:{w:1,exp:-evExp(sc,0.1),text:'后知后觉。'}}}
  ]}}},
  {id:'spirit_vein',title:'发现灵脉',minLv:3,build(sc){const agg=evStone(sc,0.6);return{ask:'弟子在后山发现一处灵脉。',choices:[
    {n:'开采',tag:'risky',tagText:'激进',desc:'花 '+agg+' 毛',cost:agg,outcomes:{great:{w:1,stone:evStone(sc,2.5),exp:evExp(sc,2),text:'大赚一笔！'},good:{w:4,stone:evStone(sc,1),exp:evExp(sc,0.6),text:'小赚一笔。'},ok:{w:2,stone:evStone(sc,0.4),text:'品质一般。'},bad:{w:2,stone:-Math.floor(agg*0.4),text:'比预想的差。'},awful:{w:1,stone:-agg,text:'损失惨重。'}}},
    {n:'放弃',tag:'safe',tagText:'保守',desc:'专心修炼',outcomes:{great:{w:1,exp:evExp(sc,0.8),text:'偶有所悟。'},good:{w:3,exp:0,text:'继续修炼。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'有些遗憾。'},awful:{w:1,exp:-evExp(sc,0.15),text:'想不开。'}}}
  ]}}},
  {id:'beast',title:'灵兽出没',minLv:5,build(sc){const bait=evStone(sc,0.2);return{ask:'弟子发现一只灵兽。',choices:[
    {n:'收服',tag:'risky',tagText:'激进',desc:'花 '+bait+' 毛买灵饵',cost:bait,outcomes:{great:{w:2,exp:evExp(sc,2.5),text:'成功收服！'},good:{w:3,exp:evExp(sc,1),text:'留了块灵玉。'},ok:{w:2,exp:evExp(sc,0.3),text:'灵兽跑了。'},bad:{w:2,exp:-evExp(sc,0.4),text:'灵饵白费。'},awful:{w:1,exp:-evExp(sc,0.8),text:'弟子受伤。'}}},
    {n:'观察',tag:'info',tagText:'观察',desc:'不打扰',outcomes:{great:{w:2,exp:evExp(sc,1),stone:evStone(sc,0.6),text:'悟到小术。'},good:{w:4,exp:evExp(sc,0.4),text:'有所得。'},ok:{w:3,exp:0,text:'没看出什么。'},bad:{w:1,exp:0,text:'灵兽走了。'},awful:{w:1,exp:-evExp(sc,0.3),text:'被追着跑。'}}}
  ]}}},
  {id:'bottleneck',title:'修炼瓶颈',minLv:18,build(sc){const pill=evStone(sc,0.4);return{ask:'弟子修炼遇到瓶颈。',choices:[
    {n:'赐丹药',tag:'cost',tagText:'花费',desc:'花 '+pill+' 毛',cost:pill,outcomes:{great:{w:2,exp:evExp(sc,2.5),loyalty:5,text:'一举突破！弟子对掌门感恩戴德。'},good:{w:4,exp:evExp(sc,1),loyalty:3,text:'顺利过瓶颈。'},ok:{w:2,exp:evExp(sc,0.3),text:'略有帮助。'},bad:{w:1,exp:0,text:'没什么用。'},awful:{w:1,exp:-evExp(sc,0.3),text:'伤势加重。'}}},
    {n:'硬扛',tag:'safe',tagText:'稳妥',desc:'不花钱',outcomes:{great:{w:1,exp:evExp(sc,1.2),text:'根基更稳！'},good:{w:3,exp:evExp(sc,0.5),text:'有所进。'},ok:{w:3,exp:evExp(sc,0.15),text:'慢慢磨过去了。'},bad:{w:2,exp:-evExp(sc,0.1),text:'硬扛失败。'},awful:{w:1,exp:-evExp(sc,0.3),text:'伤到根基。'}}}
  ]}}},
  {id:'rival',title:'同行挑衅',minLv:27,chainId:'rival',chainStep:1,build(sc){const cost=evStone(sc,0.3);return{ask:'邻宗弟子前来挑衅。',choices:[
    {n:'应战',tag:'risky',tagText:'激进',desc:'花 '+cost+' 毛',cost:cost,outcomes:{great:{w:2,stone:evStone(sc,2.5),exp:evExp(sc,3),text:'大胜！'},good:{w:4,exp:evExp(sc,1.2),text:'胜出。'},ok:{w:2,exp:evExp(sc,0.4),text:'打平。'},bad:{w:2,exp:-evExp(sc,0.6),text:'落败。'},awful:{w:1,stone:-cost,exp:-evExp(sc,1.2),text:'重伤。'}}},
    {n:'婉拒',tag:'safe',tagText:'保守',desc:'不接战',outcomes:{great:{w:1,exp:evExp(sc,0.8),text:'修炼精进。'},good:{w:3,exp:evExp(sc,0.3),text:'不理会。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.15),text:'憋屈。'},awful:{w:1,exp:-evExp(sc,0.3),text:'分心。'}}}
  ]}}},
  {id:'rival_peace',title:'邻宗求和',minLv:36,chainId:'rival',chainStep:2,build(sc){return{ask:'上次挑衅过的邻宗，这次带着礼物上门求和。',choices:[
    {n:'接受求和',tag:'safe',tagText:'稳妥',desc:'化敌为友',outcomes:{great:{w:2,exp:evExp(sc,2),stone:evStone(sc,2),text:'两宗从此互通有无。'},good:{w:4,exp:evExp(sc,1),stone:evStone(sc,0.8),text:'握手言和。'},ok:{w:3,exp:evExp(sc,0.3),text:'表面和平。'},bad:{w:1,exp:0,text:'不太信他们。'},awful:{w:1,exp:-evExp(sc,0.5),stone:-evStone(sc,0.5),text:'被骗了。'}}},
    {n:'拒绝',tag:'safe',tagText:'保守',desc:'不服就再打',outcomes:{great:{w:1,exp:evExp(sc,1.5),text:'霸气！'},good:{w:3,exp:evExp(sc,0.6),text:'他们灰溜溜走了。'},ok:{w:4,exp:evExp(sc,0.1),text:'不了了之。'},bad:{w:2,exp:-evExp(sc,0.3),text:'两宗关系更差。'},awful:{w:1,exp:-evExp(sc,0.8),text:'记恨上了。'}}}
  ]}}},
  {id:'duel',title:'演武场比试',minLv:5,requires:2,build(sc){return{ask:'两名弟子在演武场切磋。',choices:[
    {n:'让他们打',tag:'risky',tagText:'激进',desc:'看谁更强',outcomes:{great:{w:2,exp:evExp(sc,0.8),text:'均有所悟。'},good:{w:4,exp:evExp(sc,0.4),text:'士气大振。'},ok:{w:3,exp:evExp(sc,0.1),text:'打平。'},bad:{w:2,exp:-evExp(sc,0.1),text:'受点伤。'},awful:{w:1,exp:-evExp(sc,0.3),text:'伤了和气。'}}},
    {n:'及时制止',tag:'safe',tagText:'保守',desc:'点到为止',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'领会「以和为贵」。'},good:{w:4,exp:evExp(sc,0.2),text:'收了手。'},ok:{w:4,exp:0,text:'没什么大事。'},bad:{w:1,exp:-evExp(sc,0.05),text:'不过瘾。'},awful:{w:1,exp:-evExp(sc,0.15),text:'觉得掌门偏心。'}}}
  ]}}},
  {id:'quarrel',title:'弟子争执',minLv:8,requires:2,build(sc){return{ask:'两名弟子因为修炼资源吵了起来。',choices:[
    {n:'偏袒老的',tag:'safe',tagText:'保守',desc:'尊重先入门的',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'师兄更努力。'},good:{w:4,exp:evExp(sc,0.2),text:'争执平息。'},ok:{w:3,exp:0,text:'算了。'},bad:{w:2,exp:-evExp(sc,0.2),text:'师弟委屈。'},awful:{w:1,exp:-evExp(sc,0.5),text:'心生怨恨。'}}},
    {n:'各打五十',tag:'safe',tagText:'稳妥',desc:'不偏袒',outcomes:{great:{w:1,exp:evExp(sc,0.8),text:'握手言和。'},good:{w:4,exp:evExp(sc,0.3),text:'安静下来。'},ok:{w:3,exp:0,text:'停止了。'},bad:{w:1,exp:-evExp(sc,0.2),text:'觉得不公平。'},awful:{w:1,exp:-evExp(sc,0.4),text:'记恨掌门。'}}}
  ]}}},
  {id:'neighbor_visit',title:'邻宗来访',minLv:20,build(sc){return{ask:'青云宗掌门来访。',choices:[
    {n:'结盟',tag:'safe',tagText:'稳妥',desc:'与邻宗结好',outcomes:{great:{w:2,exp:evExp(sc,1),stone:evStone(sc,1.5),text:'互通有无。'},good:{w:4,exp:evExp(sc,0.4),text:'送了礼物。'},ok:{w:3,exp:evExp(sc,0.1),text:'走了仪式。'},bad:{w:1,exp:0,text:'盟约空洞。'},awful:{w:1,exp:-evExp(sc,0.2),text:'占了便宜。'}}},
    {n:'婉拒',tag:'safe',tagText:'保守',desc:'专心自己',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'独立重要。'},good:{w:3,exp:evExp(sc,0.1),text:'离开了。'},ok:{w:4,exp:0,text:'没什么。'},bad:{w:2,exp:-evExp(sc,0.05),text:'觉得傲慢。'},awful:{w:1,exp:-evExp(sc,0.2),text:'记恨上了。'}}}
  ]}}},
  {id:'imperial_offer',title:'朝廷招安',minLv:30,build(sc){return{ask:'朝廷派使者来。',choices:[
    {n:'接受',tag:'safe',tagText:'稳妥',desc:'有官方身份',outcomes:{great:{w:2,stone:evStone(sc,4),exp:evExp(sc,0.5),text:'财源滚滚。'},good:{w:3,stone:evStone(sc,1.5),text:'官家支持。'},ok:{w:3,stone:evStone(sc,0.5),text:'得个封号。'},bad:{w:2,exp:-evExp(sc,0.3),text:'不喜欢约束。'},awful:{w:1,exp:-evExp(sc,0.6),text:'被利用。'}}},
    {n:'婉拒',tag:'safe',tagText:'保守',desc:'散修自由',outcomes:{great:{w:1,exp:evExp(sc,0.6),text:'敬佩骨气。'},good:{w:3,exp:evExp(sc,0.2),text:'自由修行。'},ok:{w:4,exp:0,text:'走了。'},bad:{w:1,exp:-evExp(sc,0.1),text:'不悦。'},awful:{w:1,exp:-evExp(sc,0.4),text:'派兵围山。'}}}
  ]}}},
  {id:'meteor',title:'天降陨石',minLv:25,build(sc){return{ask:'一颗流星划过夜空。',choices:[
    {n:'立刻查看',tag:'risky',tagText:'激进',desc:'可能有大机缘',outcomes:{great:{w:1,exp:evExp(sc,3),stone:evStone(sc,4),text:'陨铁是炼器至宝！'},good:{w:3,exp:evExp(sc,1),stone:evStone(sc,1.5),text:'有好东西。'},ok:{w:3,exp:evExp(sc,0.3),text:'普通石头。'},bad:{w:2,exp:-evExp(sc,0.1),text:'灵气紊乱。'},awful:{w:1,exp:-evExp(sc,0.5),text:'辐射受伤。'}}},
    {n:'不理会',tag:'safe',tagText:'保守',desc:'专心修炼',outcomes:{great:{w:1,exp:evExp(sc,0.6),text:'心无旁骛。'},good:{w:3,exp:evExp(sc,0.2),text:'没什么。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:2,exp:-evExp(sc,0.05),text:'好奇。'},awful:{w:1,exp:-evExp(sc,0.2),text:'错过宝物。'}}}
  ]}}},
  {id:'demon_tide',title:'妖兽潮',minLv:40,build(sc){const cost=evStone(sc,0.8);return{ask:'山中妖兽暴动。',choices:[
    {n:'迎战',tag:'risky',tagText:'激进',desc:'花 '+cost+' 毛',cost:cost,outcomes:{great:{w:1,exp:evExp(sc,5),stone:evStone(sc,4),text:'名声大振！'},good:{w:3,exp:evExp(sc,2),stone:evStone(sc,1.5),text:'击退了。'},ok:{w:3,exp:evExp(sc,0.6),text:'勉强守住。'},bad:{w:2,exp:-evExp(sc,0.5),stone:-Math.floor(cost*0.5),text:'受损。'},awful:{w:1,exp:-evExp(sc,2),stone:-cost,text:'弟子重伤。'}}},
    {n:'退守',tag:'safe',tagText:'保守',desc:'避其锋芒',outcomes:{great:{w:1,exp:evExp(sc,1),text:'平安。'},good:{w:3,exp:evExp(sc,0.4),text:'无伤亡。'},ok:{w:4,exp:evExp(sc,0.1),text:'损失些东西。'},bad:{w:2,exp:-evExp(sc,0.3),text:'山下被袭。'},awful:{w:1,exp:-evExp(sc,0.8),text:'觉得怯战。'}}}
  ]}}},
  {id:'fairy_pass',title:'仙人路过',minLv:50,build(sc){return{ask:'一位仙人路过山门。',choices:[
    {n:'恭敬迎接',tag:'safe',tagText:'稳妥',desc:'以礼相待',outcomes:{great:{w:1,exp:evExp(sc,6),text:'指点一番！'},good:{w:3,exp:evExp(sc,2.5),text:'留下偈语。'},ok:{w:3,exp:evExp(sc,0.6),text:'走了。'},bad:{w:2,exp:0,text:'没说话。'},awful:{w:1,exp:-evExp(sc,0.5),text:'失礼。'}}},
    {n:'远远行礼',tag:'safe',tagText:'保守',desc:'不打扰',outcomes:{great:{w:1,exp:evExp(sc,2),text:'微微点头。'},good:{w:4,exp:evExp(sc,0.8),text:'感受到敬意。'},ok:{w:4,exp:evExp(sc,0.15),text:'走了。'},bad:{w:1,exp:0,text:'没发生什么。'},awful:{w:1,exp:-evExp(sc,0.3),text:'觉得太拘谨。'}}}
  ]}}}  ,
  {id:'lost_letter',title:'一封家书',minLv:3,build(sc){return{ask:'弟子收到一封家书，说家中老母病重。',choices:[
    {n:'准他归家',tag:'safe',tagText:'稳妥',desc:'停修三日',outcomes:{great:{w:2,exp:evExp(sc,1.5),loyalty:15,text:'弟子归家侍疾，回来时眼中带光。'},good:{w:4,exp:evExp(sc,0.6),loyalty:8,text:'家人已愈，弟子安心归来。'},ok:{w:3,exp:0,loyalty:3,text:'来回奔波，略感疲惫。'},bad:{w:1,exp:-evExp(sc,0.2),text:'归途遇雨。'},awful:{w:1,exp:-evExp(sc,0.4),loyalty:-5,text:'老母已故，弟子心碎。'}}},
    {n:'留他修行',tag:'cost',tagText:'代价',desc:'修为优先',outcomes:{great:{w:1,exp:evExp(sc,3),loyalty:-8,text:'弟子面无表情地打坐了一夜。'},good:{w:3,exp:evExp(sc,1.5),loyalty:-5,text:'他什么也没说。'},ok:{w:4,exp:evExp(sc,0.5),loyalty:-3,text:'默默修炼。'},bad:{w:2,exp:0,loyalty:-10,text:'心中有了结。'},awful:{w:1,exp:-evExp(sc,0.5),loyalty:-15,text:'他开始怀疑修行意义。'}}}
  ]}}},
  {id:'wine_guest',title:'山中酒客',minLv:6,build(sc){const cost=evStone(sc,0.15);return{ask:'一位醉醺醺的老者来到山门，说要讨口酒喝。',choices:[
    {n:'陪他喝',tag:'cost',tagText:'花费',desc:'花 '+cost+' 毛',cost:cost,outcomes:{great:{w:1,exp:evExp(sc,3),text:'老者大笑，留下一句口诀飘然下山。'},good:{w:3,exp:evExp(sc,1.2),text:'老者醉话中似有真意。'},ok:{w:3,exp:evExp(sc,0.3),text:'喝得尽兴。'},bad:{w:2,exp:0,text:'老者醉倒，弟子扶他下山。'},awful:{w:1,exp:-evExp(sc,0.3),text:'老者撒酒疯，砸了演武场。'}}},
    {n:'请他喝茶',tag:'safe',tagText:'保守',desc:'以茶代酒',outcomes:{great:{w:1,exp:evExp(sc,1),text:'老者点头称赞「有道气」。'},good:{w:4,exp:evExp(sc,0.3),text:'老者喝完就走了。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:2,exp:-evExp(sc,0.1),text:'老者嫌茶淡。'},awful:{w:1,exp:-evExp(sc,0.2),text:'老者拂袖而去。'}}}
  ]}}},
  {id:'fox_spirit',title:'狐影',minLv:15,build(sc){return{ask:'夜里，有弟子在后山看到一只白狐。',choices:[
    {n:'追上去',tag:'risky',tagText:'激进',desc:'赌一把',outcomes:{great:{w:1,exp:evExp(sc,3),stone:evStone(sc,1),text:'白狐化作少女，送了一枚灵果。'},good:{w:3,exp:evExp(sc,1),text:'白狐停下看了他一眼，跑了。'},ok:{w:3,exp:evExp(sc,0.3),text:'追丢了。'},bad:{w:2,exp:-evExp(sc,0.3),text:'迷路了。'},awful:{w:1,exp:-evExp(sc,0.8),loyalty:-3,text:'被幻术所惑，三日方醒。'}}},
    {n:'不去打扰',tag:'safe',tagText:'保守',desc:'各安天命',outcomes:{great:{w:2,exp:evExp(sc,0.8),text:'白狐临走前回望一眼。'},good:{w:4,exp:evExp(sc,0.3),text:'什么也没发生。'},ok:{w:3,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'有点后悔。'},awful:{w:1,exp:-evExp(sc,0.1),text:'夜里睡不着。'}}}
  ]}}},
  {id:'sect_brawl',title:'山门纠纷',minLv:12,requires:3,build(sc){return{ask:'山下村民与邻宗弟子发生冲突，闹到山门前。',choices:[
    {n:'出面调解',tag:'safe',tagText:'稳妥',desc:'做和事佬',outcomes:{great:{w:2,exp:evExp(sc,1),stone:evStone(sc,0.8),loyalty:3,text:'双方都卖掌门面子。'},good:{w:4,exp:evExp(sc,0.4),text:'事情平息。'},ok:{w:3,exp:0,text:'各回各家。'},bad:{w:1,exp:-evExp(sc,0.2),text:'被说偏心。'},awful:{w:1,exp:-evExp(sc,0.5),text:'双方都记恨宗门。'}}},
    {n:'偏帮村民',tag:'risky',tagText:'激进',desc:'站在山下人一边',outcomes:{great:{w:2,exp:evExp(sc,1.2),stone:evStone(sc,1.2),text:'村民感恩戴德。'},good:{w:3,exp:evExp(sc,0.5),text:'邻宗忍气吞声。'},ok:{w:3,exp:0,text:'不了了之。'},bad:{w:2,exp:-evExp(sc,0.3),text:'邻宗记恨。'},awful:{w:1,exp:-evExp(sc,0.6),stone:-evStone(sc,0.4),text:'引起两宗纷争。'}}}
  ]}}},
  {id:'dream_ancestor',title:'梦见祖师',minLv:20,build(sc){return{ask:'弟子说他梦到了宗门祖师。',choices:[
    {n:'让他细说',tag:'safe',tagText:'稳妥',desc:'听梦',outcomes:{great:{w:1,exp:evExp(sc,4),text:'梦中口诀，醒来竟是真法。'},good:{w:3,exp:evExp(sc,1.2),text:'梦境清晰，有所领悟。'},ok:{w:4,exp:evExp(sc,0.3),text:'醒来只记得一个模糊背影。'},bad:{w:2,exp:0,text:'什么也想不起来。'},awful:{w:1,exp:-evExp(sc,0.3),loyalty:-3,text:'弟子开始疑神疑鬼。'}}},
    {n:'不必在意',tag:'safe',tagText:'保守',desc:'梦而已',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'弟子自己悟了。'},good:{w:4,exp:evExp(sc,0.2),text:'继续修炼。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'弟子有点失落。'},awful:{w:1,exp:-evExp(sc,0.2),loyalty:-3,text:'弟子觉得掌门不重视他。'}}}
  ]}}},
  {id:'mountain_slide',title:'山体滑坡',minLv:25,build(sc){const cost=evStone(sc,0.6);return{ask:'连日暴雨，后山有滑坡迹象。',choices:[
    {n:'派人加固',tag:'cost',tagText:'花费',desc:'花 '+cost+' 毛',cost:cost,outcomes:{great:{w:3,stone:evStone(sc,1.5),exp:evExp(sc,1),text:'弟子筑起石墙，宗门无恙。'},good:{w:5,exp:evExp(sc,0.5),text:'勉强稳住。'},ok:{w:2,exp:evExp(sc,0.2),text:'有惊无险。'},bad:{w:2,stone:-Math.floor(cost*0.3),text:'损失部分物资。'},awful:{w:1,stone:-cost,exp:-evExp(sc,0.8),text:'滑坡冲毁了演武场。'}}},
    {n:'按兵不动',tag:'risky',tagText:'激进',desc:'赌雨停',outcomes:{great:{w:1,exp:evExp(sc,0.8),text:'雨停了，虚惊一场。'},good:{w:3,exp:evExp(sc,0.3),text:'雨势渐小。'},ok:{w:4,exp:0,text:'没出事。'},bad:{w:2,exp:-evExp(sc,0.4),text:'部分弟子受伤。'},awful:{w:1,exp:-evExp(sc,1),loyalty:-5,text:'宗门设施损毁严重。'}}}
  ]}}},
  {id:'rival_offer',title:'挖角',minLv:30,requires:2,build(sc){return{ask:'邻宗派人来挖你的弟子，开出双倍待遇。',choices:[
    {n:'加礼挽留',tag:'cost',tagText:'花费',desc:'给弟子加待遇',cost:evStone(sc,0.5),outcomes:{great:{w:2,exp:evExp(sc,1.5),loyalty:15,text:'弟子拒绝了对方，说「我生是一毛宗的人」。'},good:{w:4,exp:evExp(sc,0.6),loyalty:8,text:'弟子留了下来。'},ok:{w:3,exp:evExp(sc,0.2),loyalty:3,text:'弟子犹豫了很久，最终留下。'},bad:{w:1,exp:-evExp(sc,0.2),loyalty:-3,text:'弟子还是走了（未离队但心已远）。'},awful:{w:1,exp:-evExp(sc,0.5),loyalty:-10,text:'弟子觉得你是在用钱买他。'}}},
    {n:'放手让他去',tag:'risky',tagText:'激进',desc:'成人之美',outcomes:{great:{w:2,exp:evExp(sc,2),loyalty:20,text:'弟子大哭，说不走。'},good:{w:3,exp:evExp(sc,0.8),loyalty:10,text:'弟子留下，从此更忠心。'},ok:{w:3,exp:evExp(sc,0.2),text:'弟子想了想，留下了。'},bad:{w:2,exp:-evExp(sc,0.5),loyalty:-5,text:'弟子真的走了（未离队但忠诚 -5）。'},awful:{w:1,exp:-evExp(sc,1),loyalty:-15,text:'弟子当场收拾行李离队。'}}}
  ]}}},
  {id:'star_child',title:'星子入怀',minLv:40,build(sc){return{ask:'夜里，一颗流星落在宗门附近，弟子们去找，发现一个发光的婴孩。',choices:[
    {n:'收养他',tag:'risky',tagText:'激进',desc:'承担因果',outcomes:{great:{w:1,exp:evExp(sc,5),stone:evStone(sc,3),text:'婴孩长大，竟是绝世天才。'},good:{w:2,exp:evExp(sc,2),text:'婴孩让宗门灵气大涨。'},ok:{w:3,exp:evExp(sc,0.5),text:'婴孩被邻宗接走。'},bad:{w:3,exp:-evExp(sc,0.5),loyalty:-2,text:'婴孩是妖物，惊了弟子。'},awful:{w:2,exp:-evExp(sc,1.5),loyalty:-5,text:'引来天雷，宗门受损。'}}},
    {n:'交给邻宗',tag:'safe',tagText:'保守',desc:'不揽因果',outcomes:{great:{w:1,exp:evExp(sc,0.8),text:'邻宗欠你一个人情。'},good:{w:3,exp:evExp(sc,0.3),text:'邻宗很感激。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:2,exp:-evExp(sc,0.2),text:'邻宗从此崛起。'},awful:{w:1,exp:-evExp(sc,0.5),text:'邻宗反咬你一口。'}}}
  ]}}},
  {id:'world_rumor',title:'山外传言',minLv:50,build(sc){return{ask:'山外传言，说一毛宗掌门藏着一件上古秘宝。',choices:[
    {n:'公开澄清',tag:'safe',tagText:'稳妥',desc:'昭告天下',outcomes:{great:{w:2,exp:evExp(sc,1.5),stone:evStone(sc,1.5),text:'众人敬佩掌门坦荡。'},good:{w:4,exp:evExp(sc,0.5),text:'传言渐息。'},ok:{w:3,exp:evExp(sc,0.2),text:'风头过去了。'},bad:{w:2,exp:-evExp(sc,0.3),text:'有人不信。'},awful:{w:1,exp:-evExp(sc,0.6),text:'越描越黑。'}}},
    {n:'借势立威',tag:'risky',tagText:'激进',desc:'顺水推舟',outcomes:{great:{w:1,exp:evExp(sc,3),stone:evStone(sc,3),text:'众宗争相来拜。'},good:{w:3,exp:evExp(sc,1),stone:evStone(sc,1),text:'名气大涨。'},ok:{w:3,exp:evExp(sc,0.3),text:'无风无浪。'},bad:{w:2,exp:-evExp(sc,0.5),stone:-evStone(sc,0.5),text:'被群起而攻。'},awful:{w:1,exp:-evExp(sc,1.2),stone:-evStone(sc,1.2),text:'宗门被围。'}}}
  ]}}}
];
function buildDynamicEvent(tpl,top){
  const sc=eventScale(top);
  if(tpl.requires&&s.discipleList.length<tpl.requires)return null;
  try{
    const b=tpl.build(sc,top?top.level:0);
    if(!b||!b.choices)return null;
    const curStone=s.stones.toNum();
    const aff=b.choices.filter(c=>!c.cost||c.cost<=curStone*0.8);
    if(aff.length<2)return null;
    return{id:tpl.id,title:tpl.title,ask:b.ask,choices:aff,chainId:tpl.chainId||null,chainStep:tpl.chainStep||0};
  }catch(e){return null}
}
function pickEvent(){
  const top=topDisciple();if(!top)return null;
  s.reportsSinceEvent=(s.reportsSinceEvent||0)+1;
const force=s.reportsSinceEvent>=CONFIG.eventForceInterval;
if(!force&&s.reportsSinceEvent<CONFIG.eventMinInterval)return null;
if(!force&&Math.random()>CONFIG.eventChance)return null;
  s.reportsSinceEvent=0;
  const lvl=top.level;
  if(!s.eventChain)s.eventChain={};
  const cands=EVENT_TEMPLATES.filter(e=>{
    if(e.minLv&&lvl<e.minLv)return false;
    if(e.chainId){
      const cur=s.eventChain[e.chainId]||0;
      if(cur<e.chainStep-1)return false;
      if(cur>=e.chainStep)return false;
    }
    return true;
  });
  if(cands.length===0)return null;
  if(!s.recentEvents)s.recentEvents=[];
  let pool=cands.filter(e=>!s.recentEvents.includes(e.id));
  if(pool.length<2)pool=cands.slice();
  const sh=shuffle(pool);
  for(const t of sh){
    const ev=buildDynamicEvent(t,top);
    if(ev){s.recentEvents.push(t.id);if(s.recentEvents.length>5)s.recentEvents.shift();return ev}
  }
  return null;
}
function _calcOutcomeWeights(choice,d){
  const p=d?getP(d):PERSONALITIES[0],root=d?getRoot(d):ROOTS[5];
  const w={great:10,good:40,ok:25,bad:20,awful:5};

  // ---- 选项倾向 ----
  if(choice&&choice.tag==='risky'){w.great+=10;w.awful+=5;w.ok-=5}
  else if(choice&&choice.tag==='safe'){w.great-=3;w.awful-=3;w.ok+=10}

  // ---- 弟子属性影响 ----
  if(d){
    // 悟性：提高 great/good，降低 ok
    const comp=((d.comprehension||50)-50)/500;
    w.great+=comp*100;
    w.good+=comp*100;
    w.ok-=comp*40;
    // 福缘：两极分化，好运出大事
    const luck=((d.luck||50)-50)/500;
    w.great+=luck*80;
    w.awful-=luck*40;
    // 忠诚：影响稳定性，高忠诚不出 awful
    const loy=((d.loyalty||50)-50)/500;
    w.awful-=loy*60;
    w.bad-=loy*30;
  }

  // ---- 性格 / 建筑 / 传承 / 专精 ----
  let b=p.riskBonus+alchemyBonus()+legacyEventBonus();
  if(d){const sp=getSpecialty(d);if(sp.eventBonus)b+=sp.eventBonus;}
  if(root.eventBonus)b+=root.eventBonus;
  if(b>0){w.great+=b*100;w.awful-=b*50}
  if(b<0){w.awful+=Math.abs(b)*100;w.great-=Math.abs(b)*50}

  // ---- 护山大阵 ----
  w.awful*=arrayReduction();w.bad*=arrayReduction();

  // ---- 下限保护 ----
  for(const k in w)w[k]=Math.max(1,w[k]);
  return w;
}
function estimateOutcomeChance(choice,d){
  const w=_calcOutcomeWeights(choice,d);
  let total=0;for(const k in w)total+=w[k];
  return{
    great:w.great/total,
    good:w.good/total,
    ok:w.ok/total,
    bad:w.bad/total,
    awful:w.awful/total,
    success:(w.great+w.good)/total,
    risk:w.awful/total
  };
}
function rollOutcome(choice,d){
  const w=_calcOutcomeWeights(choice,d);
  let total=0;for(const k in w)total+=w[k];
  let r=Math.random()*total;
  for(const k of['great','good','ok','bad','awful']){r-=w[k];if(r<=0)return k}
  return'ok';
}
/* ============ 天象 ============ */
const TIANXIANG_POOL=[
  {id:'normal',name:'平常日',icon:'☁️',weight:65,duration:24*3600*1000,expMul:1,stoneMul:1,breakBonus:0,desc:'无特殊效果'},
  {id:'spirit_tide',name:'灵气潮汐',icon:'🌊',weight:10,duration:24*3600*1000,expMul:1.3,stoneMul:1,breakBonus:0,desc:'修为 +30%'},
  {id:'silent_night',name:'静默之夜',icon:'🌑',weight:5,duration:6*3600*1000,expMul:0.8,stoneMul:1,breakBonus:0,desc:'修为 -20%'},
  {id:'star_fall',name:'星辰坠世',icon:'💫',weight:8,duration:24*3600*1000,expMul:1.15,stoneMul:1,breakBonus:0,desc:'修为 +15%'},
  {id:'all_methods',name:'万法归一',icon:'✨',weight:7,duration:24*3600*1000,expMul:1,stoneMul:1,breakBonus:0.05,desc:'突破率 +5%'},
  {id:'grand_tournament',name:'天下大比',icon:'🏆',weight:5,duration:3*24*3600*1000,expMul:1.2,stoneMul:1,breakBonus:0,desc:'修为 +20%，持续 3 天'}
];
function rollTianxiang(){
  const total=TIANXIANG_POOL.reduce((a,t)=>a+t.weight,0);
  let r=Math.random()*total;
  for(const t of TIANXIANG_POOL){r-=t.weight;if(r<=0)return t}
  return TIANXIANG_POOL[0];
}
function getTianxiang(){return TIANXIANG_POOL.find(t=>t.id===s.tianxiangId)||TIANXIANG_POOL[0]}

/* ============ 天下消息 ============ */
const TIANXIA_TEMPLATES=[
  '某宗掌门 <span class="t-name">{name}</span> 收下一名 <span class="t-hl">{apt}</span> 弟子。',
  '某宗弟子 <span class="t-name">{name}</span> 突破至 <span class="t-hl">{realm}</span>。',
  '某宗掌门 <span class="t-name">{name}</span> 在古墓中发现一柄飞剑。',
  '某宗弟子 <span class="t-name">{name}</span> 于秘境中陨落。',
  '某宗掌门 <span class="t-name">{name}</span> 立下大志，要收齐 14 亿毛。',
  '某宗弟子 <span class="t-name">{name}</span> 一夜之间连破三境。',
  '某宗掌门 <span class="t-name">{name}</span> 与邻宗结盟。',
  '某宗弟子 <span class="t-name">{name}</span> 在坊市捡到一块上古玉简。',
  '某宗掌门 <span class="t-name">{name}</span> 引来天劫，生死未卜。'
];

/* ============ 天下真实事件文案 ============ */
const WORLD_CHALLENGE_TEXTS=[
  '某宗弟子不服你宗门近来名声，扬言三日后上门挑战。',
  '邻宗有人放话，说一毛宗不过是运气好。',
  '天下传开：有一宗弟子指名要和你的弟子比试。'
];
const WORLD_TREASURE_TEXTS=[
  '传言某地古墓出世，机缘遍地，宗门附近灵气也浓了几分。',
  '天下风闻：一处秘境近日灵气暴涨。',
  '有消息说，海外有仙山浮出水面，灵气外溢。'
];
const WORLD_SERMON_TEXTS=[
  '一位隐修前辈在附近山中讲道，弟子们听说后都很兴奋。',
  '天下传开：附近某宗请来一位高人开坛说法。',
  '有传言说，山野间最近出现了「道韵」，弟子修炼格外顺畅。'
];

/* ============ 传承 ============ */
const LEGACY_QUOTES=[
  '我仿佛记得上一世……',
  '这个手势，我怎么觉得做过。',
  '掌门，弟子好像在哪里见过您。',
  '弟子昨晚做了个梦，梦见自己姓{surname}。',
  '这个宗门，弟子莫名觉得熟悉。'
];

/* ============ 结局 ============ */
const ENDINGS=[
  {id:'collected',title:'收 齐 了',icon:'🌟',condition:s=>s.stones.gte(Dec.of(TARGET_MAO)),text:'你站在山巅，看着账本。\n14 亿毛，一毛不少。\n\n弟子们站在你身后，谁都没说话。\n风吹过来，翻到账本最后一页——\n\n你笑了。\n\n「这只是开始。」'},
  {id:'reincarnate',title:'五 世 轮 回',icon:'♻️',condition:s=>s.eras>=5&&s.stones.lt(Dec.of(TARGET_MAO)),text:'五世转生，你依然没收到 14 亿毛。\n\n一个弟子走上前，轻声问：\n「掌门，我们还继续吗？」\n\n你看着他，看了很久。\n然后点了点头。\n\n「继续。」'},
  {id:'legacy',title:'薪 火',icon:'🕯️',condition:s=>s.relics&&s.relics.length>=10,text:'十个弟子化道，留下十件遗物。\n\n你把它们摆在藏经阁最深处。\n新入门的弟子问：\n「掌门，这些都是谁？」\n\n你一件一件地说：\n「这是张云的剑。\n这是李雨的玉佩。\n这是……」\n\n你说到一半，停下了。\n\n「……他们都很好。」'}
];

/* ============ 工具 ============ */
const $=id=>document.getElementById(id);
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
    numFormat:'short',audioEnabled:true,vibrationEnabled:true,fontSize:'normal',dialect:'sc',
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
    signIn:{lastDate:'',cycleDay:0,totalDays:0},
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
function expNeed(lv){return Dec.of(1.09).pow(lv).mul(100)}
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
  return Math.max(CONFIG.breakMinRate,Math.min(CONFIG.breakMaxRate,base));
}
function expProgress(d){return d.exp.div(expNeed(d.level)).toNum()}
function caveCost(){return Dec.of(1.3).pow(s.cave).mul(50)}
function buildingCost(key){return Dec.of(1.5).pow(s.buildings[key]).mul(200)}
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

/* ============ DOM ============ */
const el={
  splash:$('splash'),topGoalText:$('topGoalText'),create:$('create'),game:$('game'),
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
  btnReport:$('btnReport'),btnRecruit:$('btnRecruit'),memoBadge:$('memoBadge'),
  modal:$('modal'),modalCard:$('modalCard'),flash:$('flash'),toast:$('toast'),tipBanner:$('tipBanner'),
  tutMask:$('tutMask'),tutTip:$('tutTip'),
  menuBtn:$('menuBtn'),menuBtnDot:$('menuBtnDot'),menuPop:$('menuPop'),
  soundQuickBtn:$('soundQuickBtn'),donateQuickBtn:$('donateQuickBtn'),helpQuickBtn:$('helpQuickBtn'),
  menuClaimAll:$('menuClaimAll'),
  menuSignIn:$('menuSignIn'),menuSignInBadge:$('menuSignInBadge'),
  menuDaily:$('menuDaily'),menuDailyBadge:$('menuDailyBadge'),
  menuWeekly:$('menuWeekly'),menuWeeklyBadge:$('menuWeeklyBadge'),
  menuDisciples:$('menuDisciples'),menuRelations:$('menuRelations'),menuVice:$('menuVice'),menuSect:$('menuSect'),
  menuExpedition:$('menuExpedition'),
  menuMijing:$('menuMijing'),menuRelic:$('menuRelic'),
  menuSave:$('menuSave'),menuSettings:$('menuSettings'),menuChronicle:$('menuChronicle'),menuAchieve:$('menuAchieve'),
  menuYearbook:$('menuYearbook'),menuLegacy:$('menuLegacy'),
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
  menuMoonOrder:$('menuMoonOrder'),
  ending:$('ending'),endingCard:$('endingCard'),
  firstRecruit:$('firstRecruit'),frSkip:$('frSkip')
};
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
    if(o.loyalty&&target)changeLoyalty(target,o.loyalty);

    // === 新增：选择会改变弟子 ===
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
    numFormat:s.numFormat||'short',audioEnabled:AudioSys.enabled,
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
    signIn:s.signIn||{lastDate:'',cycleDay:0,totalDays:0},
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
    legacyQuote:d.legacyQuote||null,legacyChecked:!!d.legacyChecked};
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
    legacyQuote:d.legacyQuote||null,legacyChecked:!!d.legacyChecked};
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

function flushSave() {
  if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
  executeSave();
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
    tickAge();tickLoyalty();
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
  requestAnimationFrame(gameLoop);
}
function ensureAudioInit(){
  const h = () => {
    AudioSys.init();
    AudioSys.resume();
    
    // 检查 BGM 并在用户交互后播放
    const bgm = document.getElementById('bgm');
    if (bgm && AudioSys.enabled) {
      if (bgm.paused) {
        bgm.volume = 0; // 初始音量设为 0
        bgm.play().then(() => {
          // 播放成功后，在 1.5 秒内平滑淡入到 0.2
          let vol = 0;
          const fadeIn = setInterval(() => {
            if (vol < 0.2) {
              vol += 0.01;
              bgm.volume = Math.min(0.2, vol);
            } else {
              clearInterval(fadeIn);
            }
          }, 50);
        }).catch(err => {
          console.log('等待下一次点击以恢复音频:', err);
        });
      }
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
el.btnRecruit.onclick=(e)=>{
  e.stopPropagation();
  AudioSys.click();
  if(!s.flags.firstRecruitDone&&s.discipleList.length===0){
    openRecruit(true);
  } else {
    openRecruit();
  }
};
el.soundQuickBtn.onclick=(e)=>{e.stopPropagation();AudioSys.init();AudioSys.resume();AudioSys.enabled=!AudioSys.enabled;if(AudioSys.enabled)AudioSys.click();renderUI();save();setTimeout(()=>{if(!AudioSys.ctx)toast('点击屏幕激活音效');else toast(AudioSys.enabled?'音效已开启':'音效已关闭')},50)};
el.helpQuickBtn.onclick=(e)=>{e.stopPropagation();AudioSys.click();openHelp()};
el.donateQuickBtn.onclick=(e)=>{e.stopPropagation();AudioSys.click();openDonate()};
el.menuBtn.onclick=(e)=>{e.stopPropagation();AudioSys.click();const w=!el.menuPop.classList.contains('show');el.menuPop.classList.toggle('show');if(w)tryShowTip('firstMenuOpen')};
document.addEventListener('click',(e)=>{if(!el.menuPop.contains(e.target)&&e.target!==el.menuBtn&&e.target!==el.menuBtnDot)el.menuPop.classList.remove('show')});
el.menuClaimAll.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();autoClaimAll()};
el.menuSignIn.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();showSignInModal()};
el.menuDaily.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openDaily()};
el.menuWeekly.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openWeekly()};
el.menuDisciples.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openDisciples()};
el.menuRelations.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openRelations()};
el.menuMoonOrder.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openMoonOrder()};
el.menuVice.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openVice()};
el.menuExpedition.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openExpedition()};
el.menuSect.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openSect()};
el.menuMijing.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openMijingSelect()};
el.menuRelic.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openRelics()};
el.menuChronicle.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openChronicle()};
el.menuYearbook.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openYearbook()};
el.menuAchieve.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openAchievements()};
el.menuLegacy.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openLegacy()};
el.menuSave.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openSaveManage()};
el.menuSettings.onclick=()=>{el.menuPop.classList.remove('show');AudioSys.click();openSettings()};
if(el.charArea)el.charArea.addEventListener('click',(e)=>{e.stopPropagation();handleCharClick()});
if(el.moonOrderRow)el.moonOrderRow.addEventListener('click',(e)=>{e.stopPropagation();AudioSys.click();openMoonOrder()});
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
  requestAnimationFrame(gameLoop);
}
init();