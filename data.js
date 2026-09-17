/* ============ 版本 ============ */
const GAME_VERSION='v0.9';
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
  breakBaseSmall: 0.35,        // 小境界基础突破率
  breakBaseBig: 0.10,          // 大境界基础突破率
  breakFailStreakBonus: 0.08,  // 每次失败累积 +8% 突破率
  breakFailStreakMax: 0.40,    // 保底加成上限
  breakMinRate: 0.05,          // 突破率下限
  breakMaxRate: 0.98,          // 突破率上限
  breakAttemptRate: 0.85,      // 达到经验后每次实际尝试的概率
  breakFailLossSmall: 0.50,    // 小境界失败损失经验比例
  breakFailLossBig: 0.60,      // 大境界失败损失经验比例
  breakChosenBonus: 0.08,      // 天命之子突破加成
  breakForceBreakBonus: 0.50,  // 破障丹加成

  // ---- 修为产出 ----
  expBase: 0.1,                // 修为基础值
  expLevelGrowth: 1.04,        // 每级增长
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
  eraResetLevel: 189,                // 转生所需等级
  targetMao: 1400000000,            // 终极目标：14 亿毛
  grandTournamentMao: 10000000,     // 宗门大比触发阈值：1000 万毛
  refreshHour: 4,                   // 每日刷新时间（凌晨 4 点）
  yearDuration: 30 * 86400000,      // 年鉴周期：30 天
  // ---- 古风问答（凡间见闻）----
  gufengRefreshInterval: 8 * 3600 * 1000, // 每 8 小时刷新 1 道
  gufengMaxPending: 6,                    // 最多保留 6 道
  gufengExpGain: 0.08,                    // 答对：当前等级需求修为的 8%
  gufengExpLose: 0.03,                    // 答错：当前等级需求修为的 -3%
  gufengHintComp: 70,                     // 悟性达到此值 → 有概率给出提示（去掉一个错选项）
  gufengHintChance: 0.5,                  // 提示触发概率
  gufengLuckyLuck: 70,                    // 福缘达到此值 → 答错有概率蒙对
  gufengLuckyChance: 0.3,                 // 蒙对触发概率
      // ---- 掌门月令 ----
  moonOrderDefault: 'cultivate',    // 默认月令
  moonOrderCooldown: 12 * 3600 * 1000, // 月令切换冷却：12 小时

  // ---- 收徒 ----
  discipleRecruitCooldown: 2 * 3600 * 1000 // 收徒冷却：2 小时
};


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
const YEAR_DURATION=CONFIG.yearDuration;
const GUFENG_REFRESH_INTERVAL=CONFIG.gufengRefreshInterval;
const GUFENG_MAX_PENDING=CONFIG.gufengMaxPending;
const GUFENG_EXP_GAIN=CONFIG.gufengExpGain;
const GUFENG_EXP_LOSE=CONFIG.gufengExpLose;
const GUFENG_HINT_COMP=CONFIG.gufengHintComp;
const GUFENG_HINT_CHANCE=CONFIG.gufengHintChance;
const GUFENG_LUCKY_LUCK=CONFIG.gufengLuckyLuck;
const GUFENG_LUCKY_CHANCE=CONFIG.gufengLuckyChance;
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
  {day:1,icon:'🪙',name:'×2',type:'stone',mul:2},
  {day:2,icon:'🪙',name:'×3',type:'stone',mul:3},
  {day:3,icon:'📖',name:'修为',type:'exp',mul:0.3},
  {day:4,icon:'🪙',name:'×4',type:'stone',mul:4},
  {day:5,icon:'🎁',name:'道具',type:'item',pool:['break_pill','talent_pill','rebirth_pill','long_life_pill']},
  {day:6,icon:'🪙',name:'×6',type:'stone',mul:6},
  {day:7,icon:'💎',name:'×11',type:'stone',mul:11}
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
const DISCIPLE_THRESHOLDS=[30, 90, 200, 350, 500];

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
/* ============ 弟子状态（长尾后果） ============ */
const STATE_TYPES={
  injury:        {id:'injury',        n:'旧伤',     ic:'🩹', color:'#e58a8a', desc:'修为速度 -30%',                expMul:0.70, breakAdd:0,      breakMul:1,     duration:3*86400000},
  heart_demon:   {id:'heart_demon',   n:'心魔',     ic:'🌑', color:'#c088dd', desc:'突破率 -50%',                 expMul:1.00, breakAdd:0,      breakMul:0.50,  duration:7*86400000},
  obsession:     {id:'obsession',     n:'执念',     ic:'🔥', color:'#e6a877', desc:'修为 +20%，突破 -10%',        expMul:1.20, breakAdd:-0.10,  breakMul:1,     duration:5*86400000},
  enlightenment: {id:'enlightenment', n:'顿悟',     ic:'💡', color:'#e6c473', desc:'修为速度 +50%',                expMul:1.50, breakAdd:0,      breakMul:1,     duration:24*3600*1000},
  dao_heart:     {id:'dao_heart',     n:'道心通明', ic:'✨', color:'#7dd99d', desc:'突破率 +20%',                 expMul:1.00, breakAdd:0.20,   breakMul:1,     duration:3*86400000},
  hedao:         {id:'hedao',         n:'合道期',   ic:'☯️', color:'#e6c473', desc:'突破 +40%，修为 +30%',         expMul:1.30, breakAdd:0.40,   breakMul:1,     duration:3*86400000},
  seclusion:     {id:'seclusion',     n:'闭关',     ic:'🧘', color:'#7ab8c4', desc:'突破 +60%，修为 -20%',         expMul:0.80, breakAdd:0.60,   breakMul:1,     duration:3*86400000}
};

/* 事件结果 → 长尾状态（默认规则）
 * 每个 outcome 可选 positive / negative 池，池内按 w 权重抽。
 * 概率是"是否附加"的概率，不是抽中的概率。 */
const STATE_RULES={
  great:{prob:0.60,positive:[{s:'enlightenment',w:50},{s:'dao_heart',w:30},{s:'hedao',w:15},{s:'seclusion',w:5}]},
  good: {prob:0.25,positive:[{s:'enlightenment',w:80},{s:'seclusion',w:20}]},
  ok:   {prob:0},
  bad:  {prob:0.50,negative:[{s:'injury',w:70},{s:'obsession',w:30}]},
  awful:{prob:0.75,negative:[{s:'injury',w:50},{s:'heart_demon',w:50}]}
};

const APTITUDES=[
  {id:'low',n:'下等',mul:0.7,w:22,color:'#8a9ca6'},
  {id:'mid',n:'中等',mul:1.0,w:42,color:'#7ab8c4'},
  {id:'high',n:'上等',mul:1.4,w:24,color:'#7dd99d'},
  {id:'genius',n:'天才',mul:2.0,w:9,color:'#e6c473'},
  {id:'monster',n:'妖孽',mul:3.0,w:3,color:'#c088dd'}
];
const GIFT_BASE={
  low:[5,10],
  mid:[10,25],
  high:[25,60],
  genius:[60,150],
  monster:[150,400]
};
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
  {key:'scripture',n:'藏经阁',ic:'📜',desc:'提升全体弟子修为速度',max:50,effect:lv=>'修为 +'+(lv*5)+'%'},
  {key:'alchemy',n:'炼丹房',ic:'⚗️',desc:'提升事件成功率',max:50,effect:lv=>'事件成功 +'+(lv*1)+'%'},
  {key:'arena',n:'演武场',ic:'⚔️',desc:'提升突破成功率',max:50,effect:lv=>'突破 +'+(lv*1)+'%'},
  {key:'array',n:'护山大阵',ic:'🔮',desc:'减少负面事件概率',max:20,effect:lv=>'负面 -'+(lv*2.5)+'%'},
  {key:'cave',n:'洞府',ic:'🏔️',desc:'提升修为和毛速度',max:200,effect:lv=>'修为 +'+(lv*10)+'%，毛 +'+(lv*6)+'%'}
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

/* ============ 状态剧情 ============ */
const STATE_STORY_TEMPLATES=[
  /* ===== 旧伤 ===== */
  {id:'state_injury',title:'旧伤未愈',stateType:'injury',weight:50,
   build(sc,d){return{ask:d.name+'旧伤未愈，却仍在苦修。弟子们看了都劝他歇一歇。',choices:[
     {n:'令他休养',tag:'safe',tagText:'稳妥',desc:'停下修炼，专心养伤',
      outcomes:{
        great:{w:2,clearState:'injury',loyalty:8,exp:-evExp(sc,0.3),text:'弟子听话歇了几日，旧伤痊愈。'},
        good: {w:4,clearState:'injury',loyalty:5,exp:-evExp(sc,0.5),text:'养了几天，伤好了。'},
        ok:   {w:3,clearState:'injury',loyalty:2,text:'弟子勉强歇下，伤渐渐好了。'},
        bad:  {w:1,loyalty:1,text:'弟子嘴上答应，第二天又去修炼了。'},
        awful:{w:1,loyalty:-3,text:'弟子觉得你小看他，赌气跑了。'}}},
     {n:'令他继续',tag:'risky',tagText:'激进',desc:'鼓励他坚持修行',
      outcomes:{
        great:{w:1,exp:evExp(sc,1.5),loyalty:5,text:'弟子越练越勇，旧伤反而成了磨砺。'},
        good: {w:3,exp:evExp(sc,0.6),text:'弟子咬牙坚持下来了。'},
        ok:   {w:3,exp:evExp(sc,0.2),text:'勉力修行。'},
        bad:  {w:2,addState:'injury',text:'旧伤复发。'},
        awful:{w:1,addState:'heart_demon',exp:-evExp(sc,0.3),text:'伤痛未愈，心魔又起。'}}}
   ]}}},

  /* ===== 心魔 ===== */
  {id:'state_heart_demon',title:'心魔缠身',stateType:'heart_demon',weight:50,
   build(sc,d){return{ask:d.name+'近来常常独自发呆，修炼时也心不在焉。看来是有什么心事。',choices:[
     {n:'唤来开解',tag:'safe',tagText:'稳妥',desc:'亲自与弟子谈一谈',
      outcomes:{
        great:{w:2,clearState:'heart_demon',loyalty:12,text:'一番长谈，弟子眼睛亮了。心结解了。'},
        good: {w:4,clearState:'heart_demon',loyalty:6,text:'弟子听了你的话，长长地出了口气。'},
        ok:   {w:3,clearState:'heart_demon',loyalty:2,text:'弟子点了点头，回去了。'},
        bad:  {w:1,loyalty:3,text:'弟子什么也没说，但好像好了一些。'},
        awful:{w:1,loyalty:-5,text:'弟子觉得你根本不理解他。'}}},
     {n:'令其闭关',tag:'safe',tagText:'保守',desc:'让他自己想通',
      outcomes:{
        great:{w:1,clearState:'heart_demon',exp:evExp(sc,1.2),text:'弟子闭关七日，出关时目光清明。'},
        good: {w:3,clearState:'heart_demon',exp:evExp(sc,0.5),text:'弟子自己走出来了。'},
        ok:   {w:4,exp:evExp(sc,0.2),text:'弟子继续闭关。'},
        bad:  {w:2,addState:'injury',text:'弟子不吃不喝，身子垮了。'},
        awful:{w:1,addState:'heart_demon',loyalty:-5,text:'心魔越缠越深。'}}}
   ]}}},

  /* ===== 执念 ===== */
  {id:'state_obsession',title:'执念入魔',stateType:'obsession',weight:40,
   build(sc,d){return{ask:d.name+'这两日像疯了一样修炼，连饭都不吃了。',choices:[
     {n:'由他去',tag:'safe',tagText:'保守',desc:'执念也是一种动力',
      outcomes:{
        great:{w:2,exp:evExp(sc,1.5),text:'他练成了点什么。'},
        good: {w:4,exp:evExp(sc,0.7),text:'他还在练。'},
        ok:   {w:3,exp:evExp(sc,0.3),text:'他继续埋头苦修。'},
        bad:  {w:2,clearState:'obsession',exp:evExp(sc,0.1),text:'他终于撑不住，睡了三天。'},
        awful:{w:1,addState:'injury',text:'他把自己练伤了。'}}},
     {n:'强行制止',tag:'risky',tagText:'激进',desc:'喝令他停下来',
      outcomes:{
        great:{w:2,clearState:'obsession',loyalty:8,text:'他被你镇住了，喘着气坐了下来。'},
        good: {w:3,clearState:'obsession',loyalty:4,text:'他愣愣地看着你，然后点点头。'},
        ok:   {w:3,clearState:'obsession',text:'他停下来了。'},
        bad:  {w:2,loyalty:-3,text:'他很生气，但没敢顶撞。'},
        awful:{w:1,addState:'heart_demon',loyalty:-8,text:'他觉得自己被否定了，从此沉默。'}}}
   ]}}},

  /* ===== 顿悟 ===== */
  {id:'state_enlightenment',title:'顿悟之时',stateType:'enlightenment',weight:60,
   build(sc,d){return{ask:d.name+'前几日突然顿悟，此刻正坐在后山，周身灵气不散。',choices:[
     {n:'助他闭关',tag:'safe',tagText:'稳妥',desc:'让他借势冲击境界',
      outcomes:{
        great:{w:2,exp:evExp(sc,2.5),text:'弟子借势突破了。'},
        good: {w:4,exp:evExp(sc,1.2),text:'弟子修为大进。'},
        ok:   {w:3,exp:evExp(sc,0.5),text:'弟子受益。'},
        bad:  {w:1,exp:evExp(sc,0.1),text:'灵气渐渐散了。'},
        awful:{w:1,clearState:'enlightenment',text:'灵气散了，弟子的顿悟也断了。'}}},
     {n:'顺其自然',tag:'safe',tagText:'保守',desc:'不打扰他',
      outcomes:{
        great:{w:1,exp:evExp(sc,1.5),text:'弟子自己抓到了那一线。'},
        good: {w:4,exp:evExp(sc,0.6),text:'弟子安静地坐着，一切都好。'},
        ok:   {w:4,exp:evExp(sc,0.2),text:'弟子坐了半天。'},
        bad:  {w:1,exp:evExp(sc,0.05),text:'弟子醒来，忘了大半。'},
        awful:{w:1,clearState:'enlightenment',text:'弟子自己走神了。'}}}
   ]}}},

  /* ===== 道心通明 ===== */
  {id:'state_dao_heart',title:'道心通明',stateType:'dao_heart',weight:60,
   build(sc,d){return{ask:d.name+'这几日道心通明，看什么都通透。弟子们都想向他请教。',choices:[
     {n:'令他授业',tag:'safe',tagText:'稳妥',desc:'让他带带师弟师妹',
      outcomes:{
        great:{w:2,exp:evExp(sc,0.8),loyalty:10,text:'他讲得极好，宗门上下都受益。'},
        good: {w:4,exp:evExp(sc,0.3),loyalty:5,text:'他带着大家修炼。'},
        ok:   {w:3,exp:evExp(sc,0.1),text:'他讲了半天。'},
        bad:  {w:1,clearState:'dao_heart',loyalty:-3,text:'他觉得自己被打扰了。'},
        awful:{w:1,clearState:'dao_heart',text:'他被问烦了，拂袖而去。'}}},
     {n:'让他自己修行',tag:'safe',tagText:'保守',desc:'珍惜这段机缘',
      outcomes:{
        great:{w:1,exp:evExp(sc,2),text:'他趁着道心通明，又进一层。'},
        good: {w:3,exp:evExp(sc,0.8),text:'他受益匪浅。'},
        ok:   {w:4,exp:evExp(sc,0.3),text:'他安静修行。'},
        bad:  {w:1,exp:evExp(sc,0.1),text:'通明渐退。'},
        awful:{w:1,clearState:'dao_heart',text:'机缘过去了。'}}}
   ]}}},

  /* ===== 合道期 ===== */
  {id:'state_hedao',title:'合道之机',stateType:'hedao',weight:40,
   build(sc,d){return{ask:d.name+'这几日与天地相合，周身道韵流转，连呼吸都带着一股说不出的味道。',choices:[
     {n:'令他巩固',tag:'safe',tagText:'稳妥',desc:'稳住这个状态',outcomes:{
       great:{w:2,exp:evExp(sc,2),text:'他借合道之势又进一层。'},
       good: {w:4,exp:evExp(sc,1),text:'他静静地坐了七日。'},
       ok:   {w:3,exp:evExp(sc,0.3),text:'他保持住了这个状态。'},
       bad:  {w:1,exp:evExp(sc,0.1),text:'道韵渐散，他睁开了眼。'},
       awful:{w:1,clearState:'hedao',text:'合道之势散了。'}}},
     {n:'令他出手',tag:'risky',tagText:'激进',desc:'趁势做一件大事',outcomes:{
       great:{w:1,exp:evExp(sc,4),stone:evStone(sc,2),text:'他出手一次，天下震动。'},
       good: {w:3,exp:evExp(sc,1.5),stone:evStone(sc,0.8),text:'他不负所托。'},
       ok:   {w:3,exp:evExp(sc,0.5),text:'他办成了。'},
       bad:  {w:2,clearState:'hedao',exp:-evExp(sc,0.3),text:'事情成了，但合道之势散了。'},
       awful:{w:1,clearState:'hedao',exp:-evExp(sc,0.8),text:'他强行出手，伤了道基。'}}}
   ]}}},

  /* ===== 闭关 ===== */
  {id:'state_seclusion',title:'闭关中',stateType:'seclusion',weight:60,
   build(sc,d){return{ask:d.name+'已经闭关两日，尚未出关。弟子们议论纷纷。',choices:[
     {n:'不打扰',tag:'safe',tagText:'稳妥',desc:'让他继续闭关',outcomes:{
       great:{w:2,exp:evExp(sc,2.5),text:'他出关时，气质已然不同。'},
       good: {w:4,exp:evExp(sc,1),text:'他安静地闭关。'},
       ok:   {w:3,exp:evExp(sc,0.3),text:'他在里面待着。'},
       bad:  {w:1,exp:evExp(sc,0.05),text:'没什么进展。'},
       awful:{w:1,clearState:'seclusion',text:'他闷得慌，自己出来了。'}}},
     {n:'催他出关',tag:'risky',tagText:'激进',desc:'有要事相商',outcomes:{
       great:{w:1,exp:evExp(sc,1.5),loyalty:5,text:'他应声出关，事情办得漂亮。'},
       good: {w:3,exp:evExp(sc,0.5),text:'他出来了。'},
       ok:   {w:3,clearState:'seclusion',text:'他出关了。'},
       bad:  {w:2,clearState:'seclusion',loyalty:-3,text:'他出关，但神情有些烦躁。'},
       awful:{w:1,clearState:'seclusion',loyalty:-8,text:'他刚有所悟，被硬生生打断了。'}}}
   ]}}}
];
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
  {id:'oldbook',title:'旧书残卷',minLv:0,personalities:['diligent','clever'],build(sc){const buy=evStone(sc,0.25);return{ask:'弟子在旧货堆里翻到一本残缺的古书。',choices:[
    {n:'买下',tag:'cost',tagText:'花费',desc:'花 '+buy+' 毛',cost:buy,outcomes:{great:{w:1,exp:evExp(sc,3),text:'残缺功法！'},good:{w:3,exp:evExp(sc,1),text:'有些真东西。'},ok:{w:3,exp:evExp(sc,0.3),text:'没什么大用。'},bad:{w:2,exp:0,text:'一本破书。'},awful:{w:1,exp:-evExp(sc,0.3),text:'假书。'}}},
    {n:'不买',tag:'safe',tagText:'保守',desc:'省钱',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'心无旁骛。'},good:{w:3,exp:evExp(sc,0.1),text:'继续逛。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'后悔。'},awful:{w:1,exp:-evExp(sc,0.1),text:'后知后觉。'}}}
  ]}}},
  {id:'spirit_vein',title:'发现灵脉',minLv:3,specialties:['merchant','artifact'],build(sc){const agg=evStone(sc,0.6);return{ask:'弟子在后山发现一处灵脉。',choices:[
    {n:'开采',tag:'risky',tagText:'激进',desc:'花 '+agg+' 毛',cost:agg,outcomes:{great:{w:1,stone:evStone(sc,2.5),exp:evExp(sc,2),text:'大赚一笔！'},good:{w:4,stone:evStone(sc,1),exp:evExp(sc,0.6),text:'小赚一笔。'},ok:{w:2,stone:evStone(sc,0.4),text:'品质一般。'},bad:{w:2,stone:-Math.floor(agg*0.4),text:'比预想的差。'},awful:{w:1,stone:-agg,text:'损失惨重。'}}},
    {n:'放弃',tag:'safe',tagText:'保守',desc:'专心修炼',outcomes:{great:{w:1,exp:evExp(sc,0.8),text:'偶有所悟。'},good:{w:3,exp:0,text:'继续修炼。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'有些遗憾。'},awful:{w:1,exp:-evExp(sc,0.15),text:'想不开。'}}}
  ]}}},
  {id:'beast',title:'灵兽出没',minLv:5,specialties:['body','sword'],build(sc){const bait=evStone(sc,0.2);return{ask:'弟子发现一只灵兽。',choices:[
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
  {id:'lost_letter',title:'一封家书',minLv:3,stateOn:{
    bad:{state:'heart_demon',text:'弟子嘴上不说，心里却结了个疙瘩。'},
    awful:{state:'heart_demon',text:'老母已故，弟子道心蒙尘。'}
  },build(sc){return{ask:'弟子收到一封家书，说家中老母病重。',choices:[
    {n:'准他归家',tag:'safe',tagText:'稳妥',desc:'停修三日',outcomes:{great:{w:2,exp:evExp(sc,1.5),loyalty:15,text:'弟子归家侍疾，回来时眼中带光。'},good:{w:4,exp:evExp(sc,0.6),loyalty:8,text:'家人已愈，弟子安心归来。'},ok:{w:3,exp:0,loyalty:3,text:'来回奔波，略感疲惫。'},bad:{w:1,exp:-evExp(sc,0.2),text:'归途遇雨。'},awful:{w:1,exp:-evExp(sc,0.4),loyalty:-5,text:'老母已故，弟子心碎。'}}},
    {n:'留他修行',tag:'cost',tagText:'代价',desc:'修为优先',outcomes:{great:{w:1,exp:evExp(sc,3),loyalty:-8,text:'弟子面无表情地打坐了一夜。'},good:{w:3,exp:evExp(sc,1.5),loyalty:-5,text:'他什么也没说。'},ok:{w:4,exp:evExp(sc,0.5),loyalty:-3,text:'默默修炼。'},bad:{w:2,exp:0,loyalty:-10,text:'心中有了结。'},awful:{w:1,exp:-evExp(sc,0.5),loyalty:-15,text:'他开始怀疑修行意义。'}}}
  ]}}},
  {id:'wine_guest',title:'山中酒客',minLv:6,build(sc){const cost=evStone(sc,0.15);return{ask:'一位醉醺醺的老者来到山门，说要讨口酒喝。',choices:[
    {n:'陪他喝',tag:'cost',tagText:'花费',desc:'花 '+cost+' 毛',cost:cost,outcomes:{great:{w:1,exp:evExp(sc,3),text:'老者大笑，留下一句口诀飘然下山。'},good:{w:3,exp:evExp(sc,1.2),text:'老者醉话中似有真意。'},ok:{w:3,exp:evExp(sc,0.3),text:'喝得尽兴。'},bad:{w:2,exp:0,text:'老者醉倒，弟子扶他下山。'},awful:{w:1,exp:-evExp(sc,0.3),text:'老者撒酒疯，砸了演武场。'}}},
    {n:'请他喝茶',tag:'safe',tagText:'保守',desc:'以茶代酒',outcomes:{great:{w:1,exp:evExp(sc,1),text:'老者点头称赞「有道气」。'},good:{w:4,exp:evExp(sc,0.3),text:'老者喝完就走了。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:2,exp:-evExp(sc,0.1),text:'老者嫌茶淡。'},awful:{w:1,exp:-evExp(sc,0.2),text:'老者拂袖而去。'}}}
  ]}}},
  {id:'fox_spirit',title:'狐影',minLv:15,personalities:['fated','romantic'],stateOn:{
    awful:{state:'heart_demon',text:'幻术虽解，心魔难消。'}
  },build(sc){return{ask:'夜里，有弟子在后山看到一只白狐。',choices:[
    {n:'追上去',tag:'risky',tagText:'激进',desc:'赌一把',outcomes:{great:{w:1,exp:evExp(sc,3),stone:evStone(sc,1),text:'白狐化作少女，送了一枚灵果。'},good:{w:3,exp:evExp(sc,1),text:'白狐停下看了他一眼，跑了。'},ok:{w:3,exp:evExp(sc,0.3),text:'追丢了。'},bad:{w:2,exp:-evExp(sc,0.3),text:'迷路了。'},awful:{w:1,exp:-evExp(sc,0.8),loyalty:-3,text:'被幻术所惑，三日方醒。'}}},
    {n:'不去打扰',tag:'safe',tagText:'保守',desc:'各安天命',outcomes:{great:{w:2,exp:evExp(sc,0.8),text:'白狐临走前回望一眼。'},good:{w:4,exp:evExp(sc,0.3),text:'什么也没发生。'},ok:{w:3,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'有点后悔。'},awful:{w:1,exp:-evExp(sc,0.1),text:'夜里睡不着。'}}}
  ]}}},
  {id:'sect_brawl',title:'山门纠纷',minLv:12,requires:3,build(sc){return{ask:'山下村民与邻宗弟子发生冲突，闹到山门前。',choices:[
    {n:'出面调解',tag:'safe',tagText:'稳妥',desc:'做和事佬',outcomes:{great:{w:2,exp:evExp(sc,1),stone:evStone(sc,0.8),loyalty:3,text:'双方都卖掌门面子。'},good:{w:4,exp:evExp(sc,0.4),text:'事情平息。'},ok:{w:3,exp:0,text:'各回各家。'},bad:{w:1,exp:-evExp(sc,0.2),text:'被说偏心。'},awful:{w:1,exp:-evExp(sc,0.5),text:'双方都记恨宗门。'}}},
    {n:'偏帮村民',tag:'risky',tagText:'激进',desc:'站在山下人一边',outcomes:{great:{w:2,exp:evExp(sc,1.2),stone:evStone(sc,1.2),text:'村民感恩戴德。'},good:{w:3,exp:evExp(sc,0.5),text:'邻宗忍气吞声。'},ok:{w:3,exp:0,text:'不了了之。'},bad:{w:2,exp:-evExp(sc,0.3),text:'邻宗记恨。'},awful:{w:1,exp:-evExp(sc,0.6),stone:-evStone(sc,0.4),text:'引起两宗纷争。'}}}
  ]}}},
  {id:'dream_ancestor',title:'梦见祖师',minLv:20,personalities:['fated'],build(sc){return{ask:'弟子说他梦到了宗门祖师。',choices:[
    {n:'让他细说',tag:'safe',tagText:'稳妥',desc:'听梦',outcomes:{great:{w:1,exp:evExp(sc,4),text:'梦中口诀，醒来竟是真法。'},good:{w:3,exp:evExp(sc,1.2),text:'梦境清晰，有所领悟。'},ok:{w:4,exp:evExp(sc,0.3),text:'醒来只记得一个模糊背影。'},bad:{w:2,exp:0,text:'什么也想不起来。'},awful:{w:1,exp:-evExp(sc,0.3),loyalty:-3,text:'弟子开始疑神疑鬼。'}}},
    {n:'不必在意',tag:'safe',tagText:'保守',desc:'梦而已',outcomes:{great:{w:1,exp:evExp(sc,0.5),text:'弟子自己悟了。'},good:{w:4,exp:evExp(sc,0.2),text:'继续修炼。'},ok:{w:4,exp:0,text:'平平无奇。'},bad:{w:1,exp:-evExp(sc,0.05),text:'弟子有点失落。'},awful:{w:1,exp:-evExp(sc,0.2),loyalty:-3,text:'弟子觉得掌门不重视他。'}}}
  ]}}},
  {id:'mountain_slide',title:'山体滑坡',minLv:25,stateOn:{
    awful:{state:'injury',text:'弟子们在抢险中受了伤。'}
  },build(sc){const cost=evStone(sc,0.6);return{ask:'连日暴雨，后山有滑坡迹象。',choices:[
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
    const b=tpl.build(sc,top);
    if(!b||!b.choices)return null;
    const curStone=s.stones.toNum();
    const aff=b.choices.filter(c=>!c.cost||c.cost<=curStone*0.8);
    if(aff.length<2)return null;
    return{id:tpl.id,title:tpl.title,ask:b.ask,choices:aff,chainId:tpl.chainId||null,chainStep:tpl.chainStep||0};
  }catch(e){return null}
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
    safe:(w.great+w.good+w.ok)/total,
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

/* ============ 凡间商道 · 理财问答题库 ============ */
const QUIZ_BANK = [
  // ===== 基础理财概念（10 道）=====
  { question: '分散投资主要为了？', options: ['提高收益', '降低单一风险', '消除全部风险'], answer: 1, explain: '分散投资只能降低单一资产带来的非系统性风险，无法消除系统性风险。' },
  { question: '收益越高，通常风险？', options: ['越低', '不变', '越高'], answer: 2, explain: '收益与风险成正比，高收益往往伴随着高风险。' },
  { question: '复利是指？', options: ['利息也生息', '只还本金', '单利计算'], answer: 0, explain: '复利就是"利滚利"，利息也会产生利息。时间越长，复利威力越大。' },
  { question: '通货膨胀会让现金？', options: ['购买力上升', '购买力下降', '不变'], answer: 1, explain: '物价上涨，同样金额能买到的东西变少，现金购买力下降。' },
  { question: '"年化收益率"是指？', options: ['折算成一年的收益率', '一天的真实收益', '银行给的利息'], answer: 0, explain: '年化收益率是把当前收益率（日/周/月）折算成一年的收益率，便于横向比较。' },
  { question: '风险承受能力通常和什么有关？', options: ['只看年龄', '年龄/收入/资产/家庭综合', '只看收入'], answer: 1, explain: '风险承受能力需结合年龄、收入、资产、家庭负担等多方面综合评估。' },
  { question: '"理财"的核心目的是？', options: ['一夜暴富', '资产保值增值', '躲避税收'], answer: 1, explain: '理财的目标是让资产在可控风险下实现保值增值，而非一夜暴富。' },
  { question: '流动性最好的资产通常是？', options: ['现金/活期存款', '房产', '定期存款'], answer: 0, explain: '现金和活期存款可随时取用，流动性最好；房产变现慢、手续费高。' },
  { question: '"家庭紧急备用金"通常建议储备？', options: ['1 个月支出', '3-6 个月支出', '3 年支出'], answer: 1, explain: '一般建议 3-6 个月的家庭开支作为备用金，应对失业、疾病等突发情况。' },
  { question: '记账的主要作用是？', options: ['提高收入', '了解收支结构、减少浪费', '提升信用分'], answer: 1, explain: '记账帮助你看清钱花在哪里，是理财的第一步。' },

  // ===== 银行存款与利率（8 道）=====
  { question: '存款保险最高赔多少？', options: ['100万元', '20万元', '50万元'], answer: 2, explain: '中国存款保险条例规定，最高偿付限额为人民币 50 万元。' },
  { question: '活期存款与定期存款相比，利率通常？', options: ['活期更高', '定期更高', '一样'], answer: 1, explain: '定期存款期限越长、利率通常越高；活期流动性好但利率最低。' },
  { question: '大额存单相比普通定期存款，利率通常？', options: ['更低', '相同', '更高'], answer: 2, explain: '大额存单起存金额高（通常 20 万起），利率比普通定期更高。' },
  { question: '结构性存款的本金通常？', options: ['不保本', '保本，但收益浮动', '保证高收益'], answer: 1, explain: '结构性存款通常保本，但收益与挂钩标的表现挂钩，可能很低甚至为零。' },
  { question: '银行理财"打破刚兑"是指？', options: ['不再保本保收益', '不能买', '利率更高'], answer: 0, explain: '资管新规后，理财产品不再承诺保本保收益，风险由投资者自担。' },
  { question: '存款准备金率上调通常会？', options: ['放松货币', '收紧货币', '没有影响'], answer: 1, explain: '准备金率上调意味着银行可放贷资金减少，属于货币收紧信号。' },
  { question: 'LPR 是指？', options: ['存款基准利率', '贷款市场报价利率', '外币汇率'], answer: 1, explain: 'LPR（Loan Prime Rate）是贷款市场报价利率，由 18 家报价行报价形成。' },
  { question: '定期存款提前支取，通常？', options: ['按活期计息', '按定期计息', '不给利息'], answer: 0, explain: '提前支取的定期存款，通常按支取日活期利率计息，收益大打折扣。' },

  // ===== 股票基础（12 道）=====
  { question: 'A股上午交易时间？', options: ['9:00-11:00', '9:30-11:30', '10:00-12:00'], answer: 1, explain: 'A股上午连续竞价时间为 9:30-11:30。' },
  { question: 'A股下午交易时间？', options: ['13:00-15:00', '12:00-14:00', '14:00-16:00'], answer: 0, explain: 'A股下午连续竞价时间为 13:00-15:00。' },
  { question: 'A股股票买入后多久可卖？', options: ['当天', '次日', '一周'], answer: 1, explain: 'A股实行 T+1 交收制度，当天买入的股票次一交易日才能卖出。' },
  { question: '主板股票涨跌停幅度？', options: ['5%', '10%', '20%'], answer: 1, explain: 'A股主板股票涨跌停幅度通常为 10%。' },
  { question: '创业板涨跌停幅度？', options: ['10%', '20%', '30%'], answer: 1, explain: '创业板股票涨跌停幅度为 20%。' },
  { question: '科创板涨跌停幅度？', options: ['10%', '20%', '30%'], answer: 1, explain: '科创板股票涨跌停幅度为 20%。' },
  { question: 'ST 股票涨跌停幅度？', options: ['5%', '10%', '20%'], answer: 0, explain: 'ST / *ST 股票（被风险警示）涨跌停幅度通常为 5%。' },
  { question: '股票交易的印花税由谁收？', options: ['证券公司', '国家', '交易所'], answer: 1, explain: '印花税由国家征收，券商代扣代缴；目前 A 股卖出时按 0.05% 单边收取。' },
  { question: '股票的"市盈率"是指？', options: ['股价 / 每股收益', '股价 / 每股净资产', '每股分红 / 股价'], answer: 0, explain: '市盈率（PE）＝股价 ÷ 每股收益，反映投资者愿意为每元盈利付出多少价格。' },
  { question: '股票的"市净率"是指？', options: ['股价 / 每股收益', '股价 / 每股净资产', '每股分红 / 股价'], answer: 1, explain: '市净率（PB）＝股价 ÷ 每股净资产，常用于银行、地产等重资产行业估值。' },
  { question: '"股息率"是指？', options: ['每股分红 / 股价', '股价 / 每股收益', '股价 / 每股净资产'], answer: 0, explain: '股息率＝每股分红 ÷ 股价，衡量现金分红的回报水平。' },
  { question: '股票"除权除息"后，股价通常会？', options: ['不变', '下调', '上调'], answer: 1, explain: '分红或送股后，股价会相应下调，股东总资产不变。' },

  // ===== 基金（8 道）=====
  { question: '基金"申购"是指？', options: ['买入基金', '卖出基金', '转换基金'], answer: 0, explain: '申购是买入，赎回是卖出。' },
  { question: '基金"赎回"是指？', options: ['买入基金', '卖出基金', '分红'], answer: 1, explain: '赎回是把持有的基金份额卖出换回现金。' },
  { question: '货币基金主要投资于？', options: ['股票', '短期货币工具', '房地产'], answer: 1, explain: '货币基金主要投资短期国债、央行票据、同业存单等，风险低、流动性好。' },
  { question: '股票型基金的股票仓位通常？', options: ['≤20%', '≥80%', '任意'], answer: 1, explain: '按监管分类，股票型基金的股票仓位不得低于 80%。' },
  { question: '债券型基金主要投资？', options: ['股票', '债券', '房产'], answer: 1, explain: '债券型基金 80% 以上资产投资于债券，风险和收益通常低于股票型。' },
  { question: '混合型基金通常投资？', options: ['仅股票', '仅债券', '股票 + 债券'], answer: 2, explain: '混合型基金同时投资股票和债券，比例灵活，风险介于股票型和债券型之间。' },
  { question: '指数基金跟踪的是？', options: ['某位基金经理', '某个指数', '某只个股'], answer: 1, explain: '指数基金以跟踪某个指数（如沪深 300）为目标，追求与指数相近的收益。' },
  { question: '基金"管理费"通常按什么方式收取？', options: ['一次性收取', '按年费率、按日计提', '免费'], answer: 1, explain: '基金管理费按年费率计算，从基金净值中按日计提，投资者感受不到单独扣除。' },

  // ===== 债券（5 道）=====
  { question: '债券的"票面利率"是指？', options: ['市场利率', '约定的年利率', '通胀率'], answer: 1, explain: '票面利率是债券发行时约定的年利率，用于计算每期利息。' },
  { question: '国债通常被认为风险？', options: ['高', '中', '低'], answer: 2, explain: '国债以国家信用背书，通常被视为风险最低的债券之一。' },
  { question: '债券价格与市场利率通常？', options: ['同向变动', '反向变动', '无关'], answer: 1, explain: '市场利率上升时，已发行债券的相对吸引力下降，价格下跌；反之亦然。' },
  { question: '可转债可以转换成？', options: ['基金', '股票', '黄金'], answer: 1, explain: '可转换债券（可转债）可以在约定条件下转换成发行公司的股票。' },
  { question: '债券的"到期收益率"是指？', options: ['票面利率', '持有到期的年化收益率', '银行利率'], answer: 1, explain: '到期收益率（YTM）是考虑买入价、票息、到期兑付后的综合年化收益率。' },

  // ===== 保险（6 道）=====
  { question: '保险的"犹豫期"通常是？', options: ['3 天', '10-15 天', '90 天'], answer: 1, explain: '犹豫期内可全额退保，一般长期人身险为 10-15 天。' },
  { question: '"重疾险"主要保障？', options: ['意外伤害', '重大疾病', '住院费用'], answer: 1, explain: '重疾险在确诊合同约定的重大疾病时一次性赔付保额。' },
  { question: '"意外险"通常保障？', options: ['重大疾病', '意外伤害', '住院费用'], answer: 1, explain: '意外险保障因外来的、突发的、非本意的事故造成的伤害。' },
  { question: '"医疗险"通常报销？', options: ['意外身故', '住院/门诊医疗费', '重大疾病'], answer: 1, explain: '医疗险按实际发生的医疗费用报销，属于费用补偿型保险。' },
  { question: '"寿险"主要保障？', options: ['意外受伤', '身故 / 全残', '疾病住院'], answer: 1, explain: '寿险以被保险人的生命为标的，身故或全残时赔付。' },
  { question: '保险的"现金价值"是指？', options: ['保额', '退保时能拿回的钱', '年缴保费'], answer: 1, explain: '现金价值是保单退保时可领取的金额，早期通常低于已缴保费。' },

  // ===== 房产与税务（5 道）=====
  { question: '买房"首付"是指？', options: ['首次缴税', '首期付款', '月供'], answer: 1, explain: '首付是购房时的首期付款，剩余部分通过贷款支付。' },
  { question: '个人所得税综合所得起征点？', options: ['3500 元/月', '5000 元/月', '8000 元/月'], answer: 1, explain: '2018 年税改后，综合所得基本减除费用标准为 5000 元/月。' },
  { question: '"增值税"是一种？', options: ['所得税', '流转税', '财产税'], answer: 1, explain: '增值税对商品和服务在流转过程中的增值额征税，属于流转税。' },
  { question: '房地产交易中的"契税"通常由谁缴？', options: ['买方', '卖方', '中介'], answer: 0, explain: '契税由买方缴纳，按成交价的一定比例征收，税率各地略有不同。' },
  { question: '"限购"政策主要针对？', options: ['开发商', '购房资格', '房价'], answer: 1, explain: '限购政策通过户籍、社保年限等条件限制部分人群购房资格。' },

  // ===== 反诈与风险防范（6 道）=====
  { question: '反诈：收到陌生短信链接，应该？', options: ['点开看看', '不点击、直接删除', '转发给朋友'], answer: 1, explain: '不明链接可能植入木马或诱导登录钓鱼网站，应直接删除。' },
  { question: '反诈：自称"公检法"要求转账到"安全账户"？', options: ['配合转账', '是典型诈骗，立即挂断', '先转一部分'], answer: 1, explain: '公检法不会通过电话要求转账，此类"安全账户"一律是诈骗。' },
  { question: '反诈：承诺"高收益零风险"的理财？', options: ['靠谱，可投', '是骗局，远离', '试试看'], answer: 1, explain: '投资不可能同时做到高收益、零风险、高流动性，此类宣传基本是骗局。' },
  { question: '反诈：网上兼职"刷单返利"？', options: ['可以试试', '是诈骗', '视情况而定'], answer: 1, explain: '刷单本身违法，所谓"返利"多为诱饵，最终会诱导加大投入后失联。' },
  { question: '反诈："杀猪盘"是指？', options: ['赌场骗局', '婚恋诱导投资诈骗', '彩票诈骗'], answer: 1, explain: '杀猪盘通过婚恋交友建立信任，再诱导受害人在虚假平台投资，最终收割。' },
  { question: '反诈：P2P 网贷平台的风险通常？', options: ['很低', '较高，已全面清退', '与银行一样'], answer: 1, explain: 'P2P 平台风险极高，国内已于 2020 年前后全面清退。' },
  // ... 请把剩下的 190 道题按上面格式全部补全 ...

  // ===== 扩展题库：新增 140 道 =====
  // ---- 基础理财概念 +10 ----
  { question: '什么是"机会成本"？', options: ['放弃的最佳替代方案的价值', '已经花掉的钱', '未来的收益'], answer: 0, explain: '机会成本是指为选择某个方案而放弃的其他最佳方案的价值。' },
  { question: '"资产配置"是指？', options: ['只买一种资产', '把钱分配到不同资产类别', '把钱都存银行'], answer: 1, explain: '资产配置是把资金分配到股票、债券、现金、房产等不同类别，以平衡风险和收益。' },
  { question: '"被动收入"是指？', options: ['不需要主动劳动就能获得的收入', '加班费', '年终奖'], answer: 0, explain: '被动收入如房租、股息、利息，不需要持续投入劳动即可获得。' },
  { question: '"财务自由"通常指？', options: ['有很多钱', '被动收入覆盖生活支出', '不用上班'], answer: 1, explain: '财务自由的核心是无需为生活开销而努力工作的状态，即被动收入 ≥ 生活支出。' },
  { question: '"杠杆"是指？', options: ['借来的钱', '本金', '收益'], answer: 0, explain: '杠杆指用借入的资金放大投资规模，会同时放大收益和亏损。' },
  { question: '"净值"是指？', options: ['总资产', '总资产减去总负债', '现金余额'], answer: 1, explain: '净值（净资产）＝总资产 − 总负债。' },
  { question: '"负债率"是？', options: ['总负债/总资产', '总资产/总负债', '收入/负债'], answer: 0, explain: '负债率＝总负债 ÷ 总资产，反映家庭或企业的杠杆水平。' },
  { question: '"货币时间价值"是指？', options: ['现在的钱比未来的钱更值钱', '时间就是金钱', '未来收益更高'], answer: 0, explain: '货币有时间价值，今天的 100 元可以投资生息，所以比未来的 100 元更值钱。' },
  { question: '"定投"是指？', options: ['一次性买入', '按固定周期投资固定金额', '随时买卖'], answer: 1, explain: '定投是按固定周期（如每月）投入固定金额，能平滑成本、分散择时风险。' },
  { question: '"止盈止损"是指？', options: ['设定卖出条件', '追涨杀跌', '只买不卖'], answer: 0, explain: '止盈止损是事先设定目标价位或止损价位，达到条件就执行，控制情绪化操作。' },

  // ---- 银行存款与利率 +5 ----
  { question: '定期存款的期限通常不包括？', options: ['3 个月', '5 年', '30 年'], answer: 2, explain: '银行定期存款最长一般为 5 年，没有 30 年的定期存款。' },
  { question: '"零存整取"是指？', options: ['每月存固定金额，到期一次性取出', '一次性存入', '随时存取'], answer: 0, explain: '零存整取是每月固定存入，到期一次性支取本息。' },
  { question: '"整存零取"是指？', options: ['一次性存入，分期支取', '一次性存取', '每月存入'], answer: 0, explain: '整存零取是一次存入较大金额，之后按约定分期支取。' },
  { question: '"通知存款"取款需要？', options: ['提前通知银行', '随时取', '需预约 1 个月'], answer: 0, explain: '通知存款取款时需提前通知银行（通常 1 天或 7 天）。' },
  { question: '银行存款利率与央行基准利率的关系？', options: ['银行可自主浮动', '完全由央行定', '与央行无关'], answer: 0, explain: '利率市场化后，银行可在央行基准利率基础上自主浮动。' },

  // ---- 股票进阶 +25 ----
  { question: 'K 线图由哪四价构成？', options: ['开盘、收盘、最高、最低', '开盘、收盘、成交量、成交额', '只有收盘价'], answer: 0, explain: 'K 线由开盘价、收盘价、最高价、最低价四个价格构成。' },
  { question: 'K 线中"阳线"通常表示？', options: ['收盘价高于开盘价', '收盘价低于开盘价', '涨跌不定'], answer: 0, explain: '阳线（红/白色）表示收盘价高于开盘价，为上涨。' },
  { question: 'K 线中"阴线"通常表示？', options: ['收盘价低于开盘价', '收盘价高于开盘价', '平盘'], answer: 0, explain: '阴线（绿/黑色）表示收盘价低于开盘价，为下跌。' },
  { question: '"均线"（MA）是？', options: ['某段时间的平均收盘价', '最高价', '最低价'], answer: 0, explain: '均线是某段时间内股价的平均值连成的线，常用 5 日、10 日、20 日等。' },
  { question: '"涨停板"是指？', options: ['股价涨幅达到当日上限', '成交量最大', '上涨开始'], answer: 0, explain: '涨停板是股价当日涨幅达到规定上限（如主板 10%）。' },
  { question: '"跌停板"是指？', options: ['跌幅达到当日下限', '下跌开始', '成交量最小'], answer: 0, explain: '跌停板是股价当日跌幅达到规定下限。' },
  { question: '"换手率"是指？', options: ['成交量/流通股本', '股价/每股收益', '涨跌幅度'], answer: 0, explain: '换手率＝成交量 ÷ 流通股本，反映股票的交易活跃程度。' },
  { question: '"成交量"是指？', options: ['成交的股数', '成交的金额', '涨跌幅度'], answer: 0, explain: '成交量是成交的股票数量（股或手），反映交易活跃度。' },
  { question: '"成交额"是指？', options: ['成交的金额', '成交的股数', '换手率'], answer: 0, explain: '成交额是成交的总金额，＝成交量 × 成交均价。' },
  { question: '一手 A 股通常是多少股？', options: ['10 股', '100 股', '1000 股'], answer: 1, explain: 'A 股一手等于 100 股（科创板可以 1 股为单位）。' },
  { question: '"龙虎榜"是指？', options: ['交易所公布的异动股票买卖席位', '每日涨跌榜', '公司高管榜'], answer: 0, explain: '龙虎榜是交易所公布的出现异常波动或特定条件的股票的买卖前五席位。' },
  { question: '"融资融券"是指？', options: ['借钱买股', '借股卖出', '借钱买股和借股卖出'], answer: 2, explain: '融资是借钱买股票，融券是借股票卖出，都是杠杆交易方式。' },
  { question: '"北向资金"是指？', options: ['通过沪股通、深股通流入 A 股的境外资金', '南下资金', '外资直投'], answer: 0, explain: '北向资金是从香港通过沪股通、深股通买 A 股的境外资金。' },
  { question: '"港股通"是指？', options: ['内地投资者买卖港股', '香港投资者买 A 股', '双向通道'], answer: 0, explain: '港股通是内地投资者通过上交所、深交所买卖港股的机制。' },
  { question: '"沪股通、深股通"是？', options: ['香港投资者买卖上海/深圳 A 股', '内地投资者买卖港股', '双向'], answer: 0, explain: '沪股通、深股通是境外投资者买卖上交所、深交所 A 股的通道。' },
  { question: '"分红派息"是指？', options: ['公司把利润分给股东', '公司回购股票', '公司增发'], answer: 0, explain: '分红派息是上市公司将部分利润以现金或股票形式分给股东。' },
  { question: '"送股"是指？', options: ['以股票形式分配利润', '现金分红', '增发新股'], answer: 0, explain: '送股是用股票代替现金分红，公司股本扩大、股价相应降低。' },
  { question: '"转增股本"和"送股"的区别是？', options: ['来源不同：送股来自利润，转增来自资本公积', '没有区别', '转增要扣税'], answer: 0, explain: '送股来自未分配利润，转增来自资本公积，转增通常不视为分红、不缴个税。' },
  { question: '"配股"是指？', options: ['公司向老股东按比例增发新股', '公司回购', '送股'], answer: 0, explain: '配股是上市公司向现有股东按持股比例、以低于市价的价格发行新股。' },
  { question: '"增发"是指？', options: ['公司发行新股', '回购股票', '分红'], answer: 0, explain: '增发是上市公司再次发行股票融资，分定向增发和公开增发。' },
  { question: '"回购"是指？', options: ['公司从市场买回自己股票', '卖出股票', '分红'], answer: 0, explain: '股票回购是公司用自有资金从市场买回自己股票，通常减少流通股、提升每股收益。' },
  { question: '"限售股"是指？', options: ['暂时不能上市流通的股票', '涨停的股票', '跌停的股票'], answer: 0, explain: '限售股（如大股东、原始股东）在锁定期内不能卖出。' },
  { question: '"解禁"是指？', options: ['限售股到期可以上市流通', '涨停', '停牌'], answer: 0, explain: '解禁是限售股的锁定期结束，可以自由交易。' },
  { question: '"停牌"是指？', options: ['股票暂停交易', '涨停', '跌停'], answer: 0, explain: '停牌是股票暂停交易，通常因重大事项、核查异常波动等。' },
  { question: '"退市"是指？', options: ['股票被终止上市', '停牌', '摘帽'], answer: 0, explain: '退市是股票不再在交易所挂牌交易，通常因连续亏损或重大违规。' },

  // ---- 基金进阶 +15 ----
  { question: '"ETF"是指？', options: ['交易型开放式指数基金', '封闭式基金', '货币基金'], answer: 0, explain: 'ETF（Exchange Traded Fund）是可在交易所买卖的指数基金。' },
  { question: '"LOF"是指？', options: ['上市型开放式基金', '封闭式基金', '货币基金'], answer: 0, explain: 'LOF（Listed Open-Ended Fund）可同时在场内和场外交易。' },
  { question: '"QDII"基金是指？', options: ['投资境外市场的基金', '量化基金', '债券基金'], answer: 0, explain: 'QDII（合格境内机构投资者）基金是投资海外市场的基金。' },
  { question: '"FOF"是指？', options: ['基金中的基金', '债券基金', '量化基金'], answer: 0, explain: 'FOF（Fund of Funds）是投资其他基金的基金。' },
  { question: '"夏普比率"衡量的是？', options: ['单位风险的超额收益', '总收益', '波动率'], answer: 0, explain: '夏普比率＝（组合收益 − 无风险收益）÷ 组合波动率，越高越优。' },
  { question: '"最大回撤"衡量的是？', options: ['从高点到低点的最大跌幅', '总亏损', '波动率'], answer: 0, explain: '最大回撤是基金历史净值从最高点回落到最低点的最大幅度。' },
  { question: '"定投"最适合什么市场？', options: ['波动大的市场', '单边上涨', '单边下跌'], answer: 0, explain: '定投在波动大的市场中更能体现摊平成本的优势。' },
  { question: '基金"净值"是指？', options: ['每份基金的价值', '基金总规模', '管理费'], answer: 0, explain: '基金净值是每份基金的价值，＝基金总资产 ÷ 总份额。' },
  { question: '基金"累计净值"考虑了？', options: ['分红再投资', '只是净值', '只有价格'], answer: 0, explain: '累计净值把历史分红加回净值，反映基金真实业绩。' },
  { question: '"场内基金"是指？', options: ['在交易所买卖的基金', '只能场外申购', '只能银行买'], answer: 0, explain: '场内基金（如 ETF、LOF）可在交易所像股票一样买卖。' },
  { question: '"场外基金"是指？', options: ['在银行/券商/第三方平台申购的基金', '交易所买卖', '只能柜台'], answer: 0, explain: '场外基金通过银行、券商、第三方平台申购赎回，不是交易所买卖。' },
  { question: '基金"申购费"通常？', options: ['买入时收取', '卖出时收取', '按日扣'], answer: 0, explain: '申购费是买入基金时收取的费用，赎回费是卖出时收取。' },
  { question: '基金"赎回费"通常？', options: ['持有时间越短越高', '固定不变', '免费'], answer: 0, explain: '赎回费通常与持有时间挂钩，持有越短费率越高，鼓励长期持有。' },
  { question: '"货币基金"的收益通常？', options: ['高于活期、低于股票型', '高于股票型', '高于所有基金'], answer: 0, explain: '货币基金风险低、流动性好，收益高于活期但低于股票型基金。' },
  { question: '余额宝本质上是？', options: ['货币基金', '股票', '债券'], answer: 0, explain: '余额宝对接的是货币市场基金。' },

  // ---- 债券 +5 ----
  { question: '债券的"发行人"是指？', options: ['借钱的一方', '买债券的人', '监管机构'], answer: 0, explain: '债券发行人是筹资方（如政府、企业），投资者是出借方。' },
  { question: '债券的"信用评级"越低，风险通常？', options: ['越高', '越低', '不变'], answer: 0, explain: '评级越低，违约风险越高，需要更高的利率补偿。' },
  { question: '"国债逆回购"本质上是？', options: ['短期借出资金获得利息', '买国债', '卖国债'], answer: 0, explain: '国债逆回购是投资者把钱短期借出，对方以国债作抵押，到期还本付息。' },
  { question: '债券的"到期日"是指？', options: ['发行人偿还本金的日期', '付息日', '发行日'], answer: 0, explain: '到期日是债券发行人按面值偿还本金的日期。' },
  { question: '"零息债券"是指？', options: ['不付利息、折价发行', '不付本金', '无到期日'], answer: 0, explain: '零息债券不支付利息，以低于面值的价格发行，到期按面值兑付。' },

  // ---- 保险进阶 +10 ----
  { question: '"定期寿险"是指？', options: ['保障一定期限的身故', '终身保障', '只保意外'], answer: 0, explain: '定期寿险在约定期间内身故赔付，保费较低、杠杆高。' },
  { question: '"终身寿险"是指？', options: ['保障终身的身故', '只保 10 年', '只保疾病'], answer: 0, explain: '终身寿险保障终身，必然赔付，兼具保障和储蓄功能。' },
  { question: '"年金险"主要是？', options: ['按约定分期领取的保险', '只保身故', '只保意外'], answer: 0, explain: '年金险在约定时间开始按期给付保险金，常用于养老和教育金规划。' },
  { question: '"百万医疗险"通常？', options: ['保额高、保费低、有免赔额', '保额低', '没有免赔'], answer: 0, explain: '百万医疗险保额常达百万，保费便宜，一般有 1 万元免赔额。' },
  { question: '"意外险"通常是否包含疾病？', options: ['不包含', '包含', '部分包含'], answer: 0, explain: '意外险只保意外事故，不保疾病。' },
  { question: '"重疾险"的赔付方式通常是？', options: ['确诊即赔', '报销制', '事后补贴'], answer: 0, explain: '重疾险通常是确诊合同约定的重疾后一次性赔付保额。' },
  { question: '"免赔额"是指？', options: ['自己先承担的部分', '保险公司全赔', '保额上限'], answer: 0, explain: '免赔额是保险公司不赔、需自己承担的部分，超过部分才由保险赔付。' },
  { question: '"等待期"是指？', options: ['投保后一段时间内出险不赔', '犹豫期', '缴费期'], answer: 0, explain: '等待期是保险合同生效后一段时间内出险不赔，防止带病投保。' },
  { question: '"如实告知"是指？', options: ['投保时如实说明健康状况', '随便填', '隐瞒病情'], answer: 0, explain: '投保时应如实告知健康状况，否则可能影响理赔甚至合同无效。' },
  { question: '"保险利益"是指？', options: ['投保人对被保险人具有法律上承认的利益', '收益', '分红'], answer: 0, explain: '保险利益是投保人对被保险人具有的法律上承认的利益，是投保的前提。' },

  // ---- 房产与税务进阶 +10 ----
  { question: '"公积金"是指？', options: ['住房公积金', '社保', '商业保险'], answer: 0, explain: '住房公积金是职工和单位共同缴存的长期住房储金，可用于购房、租房等。' },
  { question: '"等额本息"与"等额本金"相比？', options: ['每月还款额固定', '前期多后期少', '每月递减'], answer: 0, explain: '等额本息每月还款额固定；等额本金每月还款额递减、前期压力大。' },
  { question: '"LPR 加点"是指？', options: ['在 LPR 基础上的浮动', '固定利率', '折扣'], answer: 0, explain: '房贷利率通常以 LPR 为基准加减点形成。' },
  { question: '"二手房满五唯一"通常免征？', options: ['个人所得税', '契税', '增值税'], answer: 0, explain: '"满五唯一"（满 5 年且是家庭唯一住房）通常免征个人所得税。' },
  { question: '契税的纳税人是？', options: ['买方', '卖方', '中介'], answer: 0, explain: '契税由买方缴纳。' },
  { question: '个税专项附加扣除不包括？', options: ['子女教育', '住房贷款利息', '旅游支出'], answer: 2, explain: '专项附加扣除包括子女教育、继续教育、住房贷款利息、住房租金、赡养老人、大病医疗等，不含旅游。' },
  { question: '个人所得税的"综合所得"包括？', options: ['工资薪金、劳务报酬、稿酬、特许权使用费', '只有工资', '只有劳务'], answer: 0, explain: '综合所得包括工资薪金、劳务报酬、稿酬、特许权使用费四项。' },
  { question: '年终奖单独计税政策？', options: ['可选择单独计税或并入综合所得', '必须并入', '必须单独'], answer: 0, explain: '年终奖可选择单独计税或并入综合所得，纳税人可择低适用。' },
  { question: '"增值税专用发票"可以用来？', options: ['抵扣进项税', '报销', '抵个税'], answer: 0, explain: '增值税专用发票可用于一般纳税人抵扣进项税额。' },
  { question: '房产税目前在上海、重庆？', options: ['试点征收', '全国征收', '尚未试点'], answer: 0, explain: '房产税目前在上海、重庆等地试点，尚未全国推开。' },

  // ---- 反诈与风险防范 +10 ----
  { question: '反诈："冒充客服退款"骗局的典型套路？', options: ['引导点击钓鱼链接', '直接退款', '上门服务'], answer: 0, explain: '冒充客服以退款为由，诱导点击钓鱼链接或提供验证码。' },
  { question: '反诈："刷单返利"的最终目的？', options: ['诱使受害者加大投入后失联', '帮商家刷单', '提高评分'], answer: 0, explain: '刷单返利通过小额返现建立信任，最终诱使大额投入后卷款跑路。' },
  { question: '反诈：收到"ETC 已失效"短信？', options: ['不点击链接、通过官方渠道核实', '立即点击', '直接回复'], answer: 0, explain: '此类短信多为钓鱼，应通过官方 App 或客服核实。' },
  { question: '反诈："AI 换脸"诈骗常见于？', options: ['视频通话冒充亲友借钱', '网购', '招聘'], answer: 0, explain: '骗子利用 AI 换脸冒充亲友视频借钱，需通过其他渠道确认。' },
  { question: '反诈："注销校园贷"骗局针对？', options: ['应届毕业生', '老年人', '儿童'], answer: 0, explain: '骗子冒充网贷平台客服，以"注销校园贷否则影响征信"为由行骗。' },
  { question: '反诈："征信修复"通常？', options: ['是骗局，征信记录不可人为修改', '有效', '收费可删'], answer: 0, explain: '征信记录由央行征信系统管理，任何"花钱修复"都是骗局。' },
  { question: '反诈："虚拟货币"投资需注意？', options: ['国内虚拟货币交易不受法律保护', '稳赚不赔', '官方支持'], answer: 0, explain: '国内虚拟货币相关业务活动属于非法金融活动，交易不受法律保护。' },
  { question: '反诈："杀猪盘"的典型特征？', options: ['先建立感情再诱导投资', '直接要钱', '只卖商品'], answer: 0, explain: '杀猪盘通过长期感情铺垫，再诱导被害人在虚假平台投资。' },
  { question: '反诈："冒充公检法"电话通常要求？', options: ['转账到"安全账户"', '到派出所配合', '提供身份信息'], answer: 0, explain: '公检法不会电话办案、不会要求转账到所谓"安全账户"。' },
  { question: '反诈：陌生人索要"收款码"时？', options: ['可能被用于洗钱', '无风险', '可随便给'], answer: 0, explain: '出租、出借收款码可能被用于洗钱，需谨慎。' },

  // ---- 宏观经济 +15 ----
  { question: 'GDP 是指？', options: ['国内生产总值', '国民生产总值', '人均收入'], answer: 0, explain: 'GDP（Gross Domestic Product）是国内生产总值，衡量一国境内生产活动总规模。' },
  { question: 'CPI 是指？', options: ['居民消费价格指数', '工业品出厂价', '采购经理指数'], answer: 0, explain: 'CPI（Consumer Price Index）是居民消费价格指数，反映通胀水平。' },
  { question: 'PPI 是指？', options: ['工业生产者出厂价格指数', '消费价格指数', 'GDP'], answer: 0, explain: 'PPI（Producer Price Index）反映工业品出厂价格的变动。' },
  { question: 'PMI 是指？', options: ['采购经理指数', '消费价格', '生产价格'], answer: 0, explain: 'PMI（Purchasing Managers\u0027 Index）反映制造业和服务业的景气度，50 为荣枯线。' },
  { question: 'M2 是指？', options: ['广义货币供应量', '狭义货币', '基础货币'], answer: 0, explain: 'M2 是广义货币供应量，包括 M1 及定期存款、储蓄存款等。' },
  { question: '"加息"通常会导致？', options: ['股市承压、债券价格下跌', '股市上涨', '债券上涨'], answer: 0, explain: '加息提高资金成本，通常利空股市和债市。' },
  { question: '"降准"是指？', options: ['下调存款准备金率', '降息', '减少货币'], answer: 0, explain: '降准是下调存款准备金率，释放银行可贷资金，属于宽松信号。' },
  { question: '"逆回购"是央行？', options: ['向市场投放资金', '回笼资金', '买卖股票'], answer: 0, explain: '央行逆回购是向市场短期投放流动性。' },
  { question: '"正回购"是央行？', options: ['从市场回笼资金', '投放资金', '买国债'], answer: 0, explain: '央行正回购是从市场回笼资金。' },
  { question: '"通缩"是指？', options: ['物价普遍持续下跌', '物价上涨', '经济繁荣'], answer: 0, explain: '通缩是物价总水平持续下降，通常伴随经济衰退。' },
  { question: '"滞胀"是指？', options: ['经济停滞 + 通胀', '经济衰退 + 通缩', '高速增长'], answer: 0, explain: '滞胀是经济停滞与通货膨胀并存的状态。' },
  { question: '"财政政策"主要由谁执行？', options: ['政府', '央行', '商业银行'], answer: 0, explain: '财政政策由政府通过税收、支出等手段实施。' },
  { question: '"货币政策"主要由谁执行？', options: ['央行', '政府', '商业银行'], answer: 0, explain: '货币政策由中央银行通过利率、存款准备金率等工具实施。' },
  { question: '"贸易顺差"是指？', options: ['出口大于进口', '进口大于出口', '进出口相等'], answer: 0, explain: '贸易顺差是出口总额大于进口总额。' },
  { question: '"人民币升值"通常会导致？', options: ['出口承压、进口受益', '出口受益', '无关'], answer: 0, explain: '人民币升值使出口商品以外币计价更贵，出口承压；进口成本下降。' },

  // ---- 投资理念与心理 +15 ----
  { question: '"价值投资"的核心是？', options: ['买入被低估的资产并长期持有', '追涨杀跌', '短线交易'], answer: 0, explain: '价值投资关注资产内在价值，低估时买入、长期持有。' },
  { question: '"追涨杀跌"通常？', options: ['容易亏损', '稳赚', '无风险'], answer: 0, explain: '追涨杀跌是典型的情绪化操作，往往高买低卖。' },
  { question: '"羊群效应"是指？', options: ['盲目跟风', '独立思考', '冷静分析'], answer: 0, explain: '羊群效应是投资者盲目跟随大众决策，容易在市场顶部买入。' },
  { question: '"锚定效应"是指？', options: ['过度依赖最初获得的信息', '理性判断', '分散投资'], answer: 0, explain: '锚定效应是投资者过度依赖第一印象或某个参考价做决策。' },
  { question: '"损失厌恶"是指？', options: ['对亏损的痛苦大于同等收益的快乐', '喜欢亏损', '无差别'], answer: 0, explain: '损失厌恶是行为金融学概念，人们对损失的敏感度高于同等收益。' },
  { question: '"长期主义"强调？', options: ['坚持长期投资、忽略短期波动', '短线交易', '频繁操作'], answer: 0, explain: '长期主义强调时间复利，减少短期择时和频繁交易。' },
  { question: '"能力圈"是指？', options: ['自己真正理解的领域', '所有投资', '别人推荐的'], answer: 0, explain: '能力圈是自己真正了解和擅长的领域，投资应尽量在此范围内。' },
  { question: '"安全边际"是指？', options: ['买入价低于内在价值的差额', '保本', '止损'], answer: 0, explain: '安全边际是买入价格低于估算内在价值的空间，为误判留缓冲。' },
  { question: '"不要把所有鸡蛋放在一个篮子里"强调？', options: ['分散投资', '集中投资', '只买一只'], answer: 0, explain: '分散投资能降低单一资产波动对整体组合的影响。' },
  { question: '"赌徒谬误"是指？', options: ['认为随机事件有记忆', '理性判断', '分散投资'], answer: 0, explain: '赌徒谬误是错误认为过去的结果会影响未来独立随机事件的概率。' },
  { question: '"幸存者偏差"是指？', options: ['只看到成功案例而忽略失败者', '统计严谨', '理性分析'], answer: 0, explain: '幸存者偏差是只关注成功样本，忽略失败样本，导致误判。' },
  { question: '"复利效应"的关键是？', options: ['时间 + 持续收益', '短期暴利', '一次性投入'], answer: 0, explain: '复利的效果依赖足够长的时间和稳定的正收益。' },
  { question: '"72 法则"用于估算？', options: ['本金翻倍所需年数', '收益率', '通胀'], answer: 0, explain: '72 法则：本金翻倍所需年数 ≈ 72 ÷ 年化收益率（%）。' },
  { question: '"投资不可能三角"是指？', options: ['高收益、低风险、高流动性不能同时满足', '只能选一个', '三者可兼得'], answer: 0, explain: '任何投资都无法同时做到高收益、低风险、高流动性。' },
  { question: '"仓位管理"是指？', options: ['控制投入资金比例', '只买一只', '满仓'], answer: 0, explain: '仓位管理是合理分配投入资金比例，控制整体风险。' },

  // ---- 生活理财（信用卡/征信/消费）+10 ----
  { question: '信用卡"最低还款"通常？', options: ['需支付高额利息', '免费', '相当于全额还清'], answer: 0, explain: '最低还款只是避免逾期，未还部分会按日计息，成本较高。' },
  { question: '信用卡"免息期"通常？', options: ['20-50 天左右', '永远免息', '只有 1 天'], answer: 0, explain: '信用卡免息期一般为 20-50 天，具体取决于账单日和还款日。' },
  { question: '信用卡逾期会影响？', options: ['个人征信', '没有影响', '只影响信用卡'], answer: 0, explain: '信用卡逾期会记入央行征信，影响后续贷款、信用卡申请。' },
  { question: '征信报告查询方式？', options: ['央行征信中心官网或 App', '只能线下', '只能银行'], answer: 0, explain: '可通过中国人民银行征信中心官网或手机 App 查询个人信用报告。' },
  { question: '征信报告中的"硬查询"是指？', options: ['贷款审批、信用卡审批等查询', '本人查询', '贷后管理'], answer: 0, explain: '硬查询包括贷款审批、信用卡审批等，过多硬查询会影响征信评分。' },
  { question: '"花呗""白条"等属于？', options: ['消费信贷产品', '储蓄', '保险'], answer: 0, explain: '花呗、白条本质是消费信贷产品，使用会上征信（部分）。' },
  { question: '"年化利率"和"月利率"的关系？', options: ['年化 ≈ 月利率 × 12', '相等', '无关'], answer: 0, explain: '年化利率约等于月利率乘以 12，注意有些产品用月费率混淆。' },
  { question: '"消费贷"资金通常？', options: ['不能用于买房炒股', '可以买房', '可以炒股'], answer: 0, explain: '监管禁止消费贷资金流入楼市、股市。' },
  { question: '等额本息还款方式的实际年化利率？', options: ['通常高于名义利率（IRR）', '等于名义', '低于名义'], answer: 0, explain: '等额本息还款方式下，用 IRR 计算的真实年化利率高于名义利率。' },
  { question: '"砍头息"是指？', options: ['放贷时预先扣除利息', '提前还款', '逾期罚息'], answer: 0, explain: '砍头息是放贷时先从本金中扣除利息，属于违规行为。' },

  // ---- 其他金融知识 +10 ----
  { question: '"外汇"是指？', options: ['外国货币及外币资产', '黄金', '股票'], answer: 0, explain: '外汇是外国货币、外币存款、外币有价证券等资产。' },
  { question: '"汇率"是指？', options: ['一国货币兑换另一国货币的比率', '利率', '通胀率'], answer: 0, explain: '汇率是两种货币之间的兑换比率。' },
  { question: '"黄金"通常被视为？', options: ['避险资产', '高风险资产', '货币'], answer: 0, explain: '黄金通常被视为避险资产，在动荡时期受青睐。' },
  { question: '"期货"是指？', options: ['约定未来交割的标准化合约', '现货', '期权'], answer: 0, explain: '期货是约定在未来特定时间以特定价格买卖标的物的标准化合约。' },
  { question: '"期权"是指？', options: ['未来买卖的权利（非义务）', '期货', '现货'], answer: 0, explain: '期权赋予买方在未来以约定价格买卖的权利，而非义务。' },
  { question: '"信托"是指？', options: ['受托管理财产的金融产品', '保险', '基金'], answer: 0, explain: '信托是委托人将财产委托给受托人管理，常用于高净值客户。' },
  { question: '"私募基金"通常？', options: ['面向合格投资者、门槛较高', '面向所有人', '免费'], answer: 0, explain: '私募基金面向合格投资者，起投通常 100 万元，不可公开宣传。' },
  { question: '"公募基金"是指？', options: ['公开募集、面向大众的基金', '私募基金', '内部基金'], answer: 0, explain: '公募基金可以公开宣传、面向大众投资者募集。' },
  { question: '"合格投资者"通常要求？', options: ['一定的资产或收入门槛', '无门槛', '年龄限制'], answer: 0, explain: '合格投资者需满足金融资产、年收入等门槛，可投资高风险产品。' },
  { question: '"REITs"是指？', options: ['不动产投资信托基金', '货币基金', '债券'], answer: 0, explain: 'REITs（Real Estate Investment Trusts）是投资不动产的信托基金。' },

  // ===== 新增 100 道 · 职业规划与收入（10）=====
  { question: '"SWOT 分析"中的 S 是指？', options: ['优势', '劣势', '机会'], answer: 0, explain: 'SWOT 分别代表 Strengths（优势）、Weaknesses（劣势）、Opportunities（机会）、Threats（威胁）。' },
  { question: '"人力资本"是指？', options: ['公司的固定资产', '个人所拥有的知识、技能和健康', '人力资源部门'], answer: 1, explain: '人力资本是体现在人身上的知识、技能、健康等，是个人最重要的资产。' },
  { question: '提高收入最根本的途径通常是？', options: ['加班加点', '换工作', '提升自身不可替代性'], answer: 2, explain: '不可替代性越高，议价能力越强，收入提升越可持续。' },
  { question: '选择副业时最应关注？', options: ['是否与主业冲突、能否长期积累', '短期收益高低', '别人做什么'], answer: 0, explain: '副业要能与主业协同或长期积累，避免单纯出卖时间。' },
  { question: '"职业天花板"通常指？', options: ['公司楼层高度', '职业发展达到的上限', '工资的上限'], answer: 1, explain: '职业天花板是个人在当前路径上能达到的最高位置。' },
  { question: '跳槽决策时最不该只看？', options: ['岗位发展空间', '公司文化', '薪资涨幅'], answer: 2, explain: '跳槽应综合考虑发展空间、公司文化、通勤等，只看薪资容易踩坑。' },
  { question: '"斜杠青年"是指？', options: ['有多重职业身份的人', '喜欢画斜杠的人', '专职兼职的人'], answer: 0, explain: '斜杠青年指拥有多重职业和身份的人，如"设计师/摄影师/博主"。' },
  { question: '"35 岁危机"反映的是？', options: ['生理衰老', '职业竞争力与年龄的错配', '年龄歧视'], answer: 1, explain: '核心是部分岗位对年龄的隐性偏好，以及个人竞争力未能随年龄同步提升。' },
  { question: '职业转型时最稳妥的做法通常是？', options: ['裸辞 All in', '跟风转行', '先积累新领域技能再转'], answer: 2, explain: '先积累新领域技能和资源，再平滑过渡，风险最低。' },
  { question: '"睡后收入"是指？', options: ['不需要持续投入劳动的收入', '睡觉时赚的钱', '加班费'], answer: 0, explain: '睡后收入即被动收入，如房租、股息、版权费等。' },

  // ===== 新增 100 道 · 家庭理财与规划（10）=====
  { question: '家庭资产负债表中，房产属于？', options: ['资产', '负债', '权益'], answer: 0, explain: '自住房产属于资产项，房贷属于负债项。' },
  { question: '"家庭现金流"是指？', options: ['家庭存款余额', '家庭收入与支出的流动情况', '家庭贷款总额'], answer: 1, explain: '现金流关注的是钱进出的节奏，而非存量。' },
  { question: '家庭理财规划的第一步通常是？', options: ['买股票', '买保险', '明确家庭财务目标'], answer: 2, explain: '先明确目标（教育、养老、购房），再倒推配置方案。' },
  { question: '"4321 法则"中，40% 用于？', options: ['投资', '生活开支', '储蓄'], answer: 0, explain: '4321 法则：40% 投资、30% 生活、20% 储蓄、10% 保险。' },
  { question: '夫妻共同理财时最重要的是？', options: ['各管各的', '透明沟通、目标一致', '谁赚得多谁说了算'], answer: 1, explain: '家庭理财是共同决策，透明和共识比谁赚得多更重要。' },
  { question: '"教育金"规划应优先考虑？', options: ['高收益', '随时可取', '安全性和专款专用'], answer: 2, explain: '教育金是刚性支出，安全性和专款专用优先于收益。' },
  { question: '养老金准备越早越好，主要因为？', options: ['复利效应', '越早越便宜', '政策要求'], answer: 0, explain: '时间是复利最好的朋友，越早开始，积累越轻松。' },
  { question: '家庭负债中"良性负债"通常指？', options: ['信用卡消费', '能带来资产增值或收入提升的负债', '所有负债'], answer: 1, explain: '如房贷、教育贷款等，能带来长期资产或收入提升。' },
  { question: '"家庭财务安全线"通常指？', options: ['存款 100 万', '有房有车', '应急储备 + 保险 + 稳定收入'], answer: 2, explain: '安全线是应急储备、保险保障和稳定收入的组合，而非单一数字。' },
  { question: '家庭理财中"不要把鸡蛋放在一个篮子里"最适用于？', options: ['投资资产配置', '存款', '保险'], answer: 0, explain: '分散投资能降低单一资产波动对家庭财富的冲击。' },

  // ===== 新增 100 道 · 消费陷阱与理性消费（10）=====
  { question: '"消费主义陷阱"的典型表现是？', options: ['按需购买', '为身份认同和情绪买单', '货比三家'], answer: 1, explain: '消费主义常把商品与身份、情绪绑定，诱导非理性消费。' },
  { question: '"沉没成本"在消费决策中应？', options: ['纳入考虑', '部分考虑', '不予考虑'], answer: 2, explain: '沉没成本是已发生且不可收回的支出，理性决策应忽略它。' },
  { question: '"锚定价格"常见于？', options: ['打折促销', '超市标价', '以上都是'], answer: 0, explain: '商家先标一个高价，再打折，让你觉得"赚到了"。' },
  { question: '"买一送一"往往利用的是？', options: ['理性计算', '贪便宜心理', '需求导向'], answer: 1, explain: '买一送一常让你买下本不需要的东西，实际支出更多。' },
  { question: '"限时抢购"制造的是？', options: ['安全感', '满足感', '紧迫感与稀缺感'], answer: 2, explain: '限时、限量会压缩思考时间，诱导冲动消费。' },
  { question: '"先用后付"可能带来的风险是？', options: ['过度消费和逾期', '无风险', '提升信用'], answer: 0, explain: '先用后付降低了支付痛感，容易导致过度消费和逾期。' },
  { question: '"会员卡充值"的主要风险是？', options: ['使用不便', '商家跑路', '以上都是'], answer: 1, explain: '充值后商家跑路是常见风险，充值金额越大风险越高。' },
  { question: '"直播带货"中最容易冲动消费的原因是？', options: ['价格便宜', '商品质量好', '主播营造的氛围和紧迫感'], answer: 2, explain: '主播通过话术、倒计时、限量等营造紧迫感，诱导冲动下单。' },
  { question: '"消费降级"是指？', options: ['理性消费、减少不必要开支', '降低生活品质', '完全不消费'], answer: 0, explain: '消费降级不等于降低品质，而是减少不必要开支、回归理性。' },
  { question: '"断舍离"的核心理念是？', options: ['极简主义', '只保留真正需要的东西', '以上都是'], answer: 1, explain: '断舍离强调只保留真正需要的东西，减少物欲负担。' },

  // ===== 新增 100 道 · 数字金融与支付安全（10）=====
  { question: '"数字人民币"是？', options: ['虚拟货币', '支付宝余额', '央行发行的法定数字货币'], answer: 2, explain: '数字人民币是央行发行的法定数字货币，与纸钞等价。' },
  { question: '"刷脸支付"的主要风险是？', options: ['生物信息泄露', '无法识别', '速度慢'], answer: 0, explain: '人脸等生物信息一旦泄露无法更改，需谨慎授权。' },
  { question: '"免密支付"应如何设置？', options: ['全部开启', '仅小额、可信场景开启', '从不开启'], answer: 1, explain: '免密支付应限制在小额、可信场景，降低盗刷风险。' },
  { question: '"二维码支付"时应注意？', options: ['随意扫码', '不用核对', '核对收款方信息'], answer: 2, explain: '扫码前应核对收款方名称，避免扫到伪造码。' },
  { question: '"钓鱼网站"的典型特征是？', options: ['域名与官网相似但有细微差别', '有 HTTPS 就安全', '页面精美'], answer: 0, explain: '钓鱼网站常用相似域名混淆，HTTPS 不代表安全。' },
  { question: '"短信验证码"的正确使用方式是？', options: ['可告知客服', '绝不告知他人', '可发朋友圈'], answer: 1, explain: '验证码是账户最后一道防线，任何情况下都不应告知他人。' },
  { question: '手机丢失后应首先？', options: ['报警', '买新手机', '挂失 SIM 卡、冻结支付账户'], answer: 2, explain: '先挂失 SIM 卡、冻结支付账户，防止被冒用。' },
  { question: '公共 WiFi 下不宜进行？', options: ['网银转账等敏感操作', '看视频', '聊天'], answer: 0, explain: '公共 WiFi 可能被监听，敏感操作应使用移动网络。' },
  { question: '"数字遗产"是指？', options: ['数字货币', '逝者留下的数字账户和资产', '虚拟货币'], answer: 1, explain: '数字遗产包括社交账号、云盘、虚拟货币等数字资产。' },
  { question: '"跨境支付"时需注意？', options: ['汇率', '手续费', '以上都是'], answer: 2, explain: '跨境支付需关注汇率、手续费、到账时间等。' },

  // ===== 新增 100 道 · 国际金融与汇率（10）=====
  { question: '"美元指数"衡量的是？', options: ['美元对一篮子货币的汇率', '美元利率', '美国 GDP'], answer: 0, explain: '美元指数衡量美元对一篮子主要货币的汇率强弱。' },
  { question: '"汇率避险"常用工具是？', options: ['股票', '远期结售汇', '基金'], answer: 1, explain: '远期结售汇、期权等是常用的汇率避险工具。' },
  { question: '"购买力平价"理论认为长期汇率由什么决定？', options: ['利率', '政治', '两国物价水平'], answer: 2, explain: '购买力平价认为长期汇率趋近于两国物价水平之比。' },
  { question: '"美联储加息"通常会导致？', options: ['美元走强', '美元走弱', '无影响'], answer: 0, explain: '加息提高美元资产吸引力，通常推动美元走强。' },
  { question: '"人民币汇率"的报价方式是？', options: ['间接标价法', '直接标价法', '双向报价'], answer: 1, explain: '人民币采用直接标价法，即 1 美元兑多少人民币。' },
  { question: '"外汇储备"的主要用途是？', options: ['投资股票', '发工资', '稳定汇率、国际支付'], answer: 2, explain: '外汇储备用于稳定汇率、国际支付和应对金融风险。' },
  { question: '"资本外流"通常会导致？', options: ['本币贬值压力', '本币升值', '无影响'], answer: 0, explain: '资本外流增加本币抛压，通常导致本币贬值。' },
  { question: '"QDII 基金"投资海外时主要承担？', options: ['只有市场风险', '汇率风险', '无风险'], answer: 1, explain: 'QDII 基金除市场风险外，还承担人民币与外币之间的汇率风险。' },
  { question: '"国际收支顺差"是指？', options: ['支出大于收入', '平衡', '收入大于支出'], answer: 2, explain: '国际收支顺差指一国对外收入大于支出。' },
  { question: '"SWIFT 系统"是？', options: ['国际银行间通信系统', '支付平台', '交易所'], answer: 0, explain: 'SWIFT 是全球银行间金融通信系统，用于跨境报文传输。' },

  // ===== 新增 100 道 · 行为经济学进阶（10）=====
  { question: '"前景理论"的核心观点是？', options: ['人对损失比对收益更敏感', '人总是理性', '人总是冒险'], answer: 0, explain: '前景理论认为人对损失的痛苦大于同等收益的快乐。' },
  { question: '"心理账户"是指？', options: ['银行账户', '人们把不同来源的钱分门别类', '会计科目'], answer: 1, explain: '人们会把工资、奖金、意外之财放进不同的"心理账户"。' },
  { question: '"确认偏误"是指？', options: ['客观分析', '随机决策', '只关注支持自己观点的信息'], answer: 2, explain: '确认偏误让人只寻找支持自己观点的信息，忽略反面证据。' },
  { question: '"过度自信"在投资中会导致？', options: ['频繁交易、亏损', '稳健收益', '无影响'], answer: 0, explain: '过度自信导致频繁交易、集中持仓，长期收益反而更差。' },
  { question: '"后见之明偏误"是指？', options: ['预见未来', '事后觉得"我早就知道"', '记忆好'], answer: 1, explain: '事后觉得事情"理所当然"，会高估自己的判断力。' },
  { question: '"框架效应"是指？', options: ['框架结构', '思维方式', '同一问题的不同表述导致不同决策'], answer: 2, explain: '同一问题用"收益"或"损失"表述，会让人做出不同选择。' },
  { question: '"沉没成本谬误"是指？', options: ['因已投入而继续错误决策', '理性止损', '忽略成本'], answer: 0, explain: '因已投入时间、金钱而继续错误决策，是典型的沉没成本谬误。' },
  { question: '"从众心理"在投资中表现为？', options: ['独立思考', '追涨杀跌', '分散投资'], answer: 1, explain: '从众心理让人在市场狂热时追涨、恐慌时杀跌。' },
  { question: '"过度反应"是指？', options: ['反应不足', '无反应', '市场对新信息反应过度'], answer: 2, explain: '市场常对新信息反应过度，导致价格超调。' },
  { question: '"心理韧性"在投资中是指？', options: ['承受波动的能力', '预测能力', '运气'], answer: 0, explain: '心理韧性是面对市场波动时保持理性的能力。' },

  // ===== 新增 100 道 · 老年理财与养老规划（10）=====
  { question: '"养老金替代率"是指？', options: ['退休金 / 退休前工资', '养老金 / GDP', '储蓄 / 收入'], answer: 0, explain: '养老金替代率衡量退休后收入相对退休前的比例。' },
  { question: '"三支柱养老体系"中第一支柱是？', options: ['企业年金', '基本养老保险', '个人养老金'], answer: 1, explain: '第一支柱是基本养老保险，第二支柱是企业年金，第三支柱是个人养老金。' },
  { question: '"以房养老"是指？', options: ['买房养老', '租房养老', '把房产抵押换取养老金'], answer: 2, explain: '以房养老是通过反向抵押等方式，把房产转化为养老现金流。' },
  { question: '老年人理财最应优先考虑？', options: ['安全性和流动性', '高收益', '长期锁定期'], answer: 0, explain: '老年人风险承受能力较低，安全性和流动性优先。' },
  { question: '"养老目标基金"的特点是？', options: ['高风险', '随年龄调整风险', '短期'], answer: 1, explain: '养老目标基金通常随目标日期临近，逐步降低风险资产比例。' },
  { question: '老年人防诈最关键的是？', options: ['多投资', '相信熟人', '不轻信高收益承诺'], answer: 2, explain: '高收益零风险是典型诈骗话术，老年人应尤其警惕。' },
  { question: '"长期护理保险"主要应对？', options: ['失能护理费用', '医疗费用', '住院费用'], answer: 0, explain: '长期护理险主要覆盖因失能产生的长期护理费用。' },
  { question: '"退休规划"应提前多久开始？', options: ['退休前 5 年', '越早越好', '退休后'], answer: 1, explain: '退休规划越早开始，复利效应越明显。' },
  { question: '"遗产规划"中最常见的工具是？', options: ['保险', '信托', '遗嘱'], answer: 2, explain: '遗嘱是最常见的遗产规划工具，保险和信托也是常用工具。' },
  { question: '"养老社区"选择时应重点考虑？', options: ['医疗配套', '环境', '以上都是'], answer: 2, explain: '医疗配套、环境、费用、交通等都需综合考虑。' },

  // ===== 新增 100 道 · 儿童财商与教育金（10）=====
  { question: '儿童财商教育应从几岁开始？', options: ['3-6 岁', '12 岁', '18 岁'], answer: 0, explain: '3-6 岁是儿童金钱观形成的关键期，可以从认识钱币开始。' },
  { question: '"零花钱"制度的主要目的是？', options: ['让孩子有钱花', '让孩子学会管理金钱', '奖励成绩'], answer: 1, explain: '零花钱的核心是让孩子在实践中学习预算、储蓄和消费。' },
  { question: '教孩子"储蓄"最有效的方式是？', options: ['给储蓄罐', '强制存钱', '开设儿童账户、设定目标'], answer: 2, explain: '让孩子参与开户、设定目标，比单纯给储蓄罐更有效。' },
  { question: '"教育金保险"的特点是？', options: ['强制储蓄、专款专用', '高收益', '随时可取'], answer: 0, explain: '教育金保险的核心是强制储蓄和专款专用，收益不是首要目标。' },
  { question: '"财商"包括？', options: ['只有赚钱', '赚钱、花钱、存钱、投资的能力', '只有省钱'], answer: 1, explain: '财商是综合能力，包括赚钱、花钱、存钱、投资等多方面。' },
  { question: '让孩子参与家庭购物决策的好处是？', options: ['培养金钱观', '学会比较', '以上都是'], answer: 2, explain: '参与购物决策能培养孩子的金钱观、比较能力和责任感。' },
  { question: '"儿童基金定投"的优势是？', options: ['长期复利', '平滑成本、分散风险', '以上都是'], answer: 2, explain: '定投结合长期复利和平滑成本，适合教育金等长期目标。' },
  { question: '教育金规划应优先考虑？', options: ['安全性', '高收益', '短期'], answer: 0, explain: '教育金是刚性支出，安全性优先于收益。' },
  { question: '"财商教育"中家长最应以身作则的是？', options: ['攀比', '理性消费', '冲动购物'], answer: 1, explain: '家长的消费行为是孩子最直接的学习对象。' },
  { question: '"儿童保险"配置顺序通常是？', options: ['重疾险 → 意外险', '随便', '意外险 → 医疗险 → 重疾险'], answer: 2, explain: '儿童保险一般按意外险、医疗险、重疾险的顺序配置。' },

  // ===== 新增 100 道 · 创业融资与股权（10）=====
  { question: '"天使投资"通常发生在？', options: ['创业早期', '上市前', '成熟期'], answer: 0, explain: '天使投资通常发生在创业早期，风险高、金额相对小。' },
  { question: '"VC"是指？', options: ['债券', '风险投资', '保险'], answer: 1, explain: 'VC（Venture Capital）即风险投资，主要投资成长期企业。' },
  { question: '"PE"是指？', options: ['公募基金', '债券', '私募股权'], answer: 2, explain: 'PE（Private Equity）即私募股权，主要投资成熟期企业。' },
  { question: '"估值"是指？', options: ['公司值多少钱', '利润', '收入'], answer: 0, explain: '估值是对公司价值的评估，常用市盈率、市销率等方法。' },
  { question: '"股权稀释"是指？', options: ['股价下跌', '原股东持股比例下降', '利润下降'], answer: 1, explain: '新一轮融资发行新股，原股东持股比例会被稀释。' },
  { question: '"对赌协议"常见于？', options: ['银行存款', '保险', '创业融资'], answer: 2, explain: '对赌协议常见于创业融资，约定业绩目标未达成时的补偿条款。' },
  { question: '"IPO"是指？', options: ['首次公开募股', '并购', '债券'], answer: 0, explain: 'IPO（Initial Public Offering）即首次公开发行股票。' },
  { question: '"股权激励"的主要目的是？', options: ['发工资', '绑定核心员工利益', '融资'], answer: 1, explain: '股权激励让核心员工与公司长期利益绑定。' },
  { question: '"融资轮次"通常按什么排序？', options: ['C 轮 → B 轮', '随意', '天使 → A 轮 → B 轮 → C 轮'], answer: 2, explain: '融资轮次通常按天使、A、B、C 轮依次推进。' },
  { question: '"退出机制"在投资中是指？', options: ['如何变现退出', '破产', '清算'], answer: 0, explain: '退出机制是投资者如何将股权变现，如 IPO、并购、回购等。' },

  // ===== 新增 100 道 · 税务进阶与合法节税（10）=====
  { question: '"个税汇算清缴"通常在每年？', options: ['3-6 月', '1 月', '12 月'], answer: 0, explain: '个税汇算清缴通常在次年 3 月 1 日至 6 月 30 日进行。' },
  { question: '"专项附加扣除"中住房租金扣除标准？', options: ['全国统一', '按城市不同', '无标准'], answer: 1, explain: '住房租金扣除按城市规模不同，标准从 800 到 1500 元不等。' },
  { question: '"个人所得税"的税率形式是？', options: ['比例税率', '定额', '超额累进'], answer: 2, explain: '综合所得适用 3%-45% 的超额累进税率。' },
  { question: '"税收筹划"的合法边界是？', options: ['合法合规', '可以逃税', '可以虚报'], answer: 0, explain: '税收筹划必须在合法合规范围内，否则构成逃税。' },
  { question: '"增值税小规模纳税人"的征收率通常是？', options: ['13%', '3%', '25%'], answer: 1, explain: '小规模纳税人增值税征收率通常为 3%（部分时期有优惠）。' },
  { question: '"企业所得税"的标准税率是？', options: ['15%', '20%', '25%'], answer: 2, explain: '企业所得税标准税率为 25%，高新技术企业可享 15%。' },
  { question: '"年终奖"计税方式的选择应？', options: ['比较两种方式择低', '必须单独', '必须并入'], answer: 0, explain: '年终奖可选单独计税或并入综合所得，应比较后择低适用。' },
  { question: '"个人所得税"的居民个人判定标准之一是？', options: ['有房', '在中国境内居住满 183 天', '有工作'], answer: 1, explain: '在中国境内居住满 183 天的个人为居民个人。' },
  { question: '"发票"在个税中的作用是？', options: ['无作用', '抵税', '部分扣除凭证'], answer: 2, explain: '发票是部分专项附加扣除和经营所得扣除的凭证。' },
  { question: '"偷税"与"节税"的本质区别是？', options: ['是否合法', '金额大小', '时间'], answer: 0, explain: '节税合法，偷税违法，本质区别在于是否遵守税法。' }
];

/* ============ 凡间见闻 · 古风理财问答题库 ============ */
const GUFENG_QUIZ = [
  // ===== 基础理财 =====
  {
    id: 'gq_001', cat: '基础理财', icon: '🧂', title: '集市遇盐商',
    scene: '弟子{name}在集市遇见一位老盐商。老盐商叹气道：「老朽年轻时把全部身家押在一口盐井上，一朝塌方，半生积蓄化为乌有。小友，你说老朽当年错在哪了？」',
    options: [
      { text: '该多开几口井，别把身家押在一处', ok: true },
      { text: '该押更大的本，一次赚够', ok: false },
      { text: '该守着小本买卖，绝不冒险', ok: false }
    ],
    explain: '盐井要塌，盐路要断。把全部家当押到一处，不是胆子大，是拿命在赌。'
  },
  {
    id: 'gq_002', cat: '基础理财', icon: '📦', title: '稳赚不赔',
    scene: '弟子{name}在坊市遇到一位贩货商人。商人拍着胸脯说：「跟着我干，稳赚不赔！每月三分利，童叟无欺！」弟子回来问掌门：这话可信吗？',
    options: [
      { text: '可信，三分利不算高', ok: false },
      { text: '有诈，高收益背后必有高风险', ok: true },
      { text: '不太清楚', ok: false }
    ],
    explain: '三分月息，一年下来就是四成本金咯。天下哪有这种好事？利钱越高，坑越深。'
  },
  {
    id: 'gq_003', cat: '基础理财', icon: '🪙', title: '利滚利',
    scene: '弟子{name}在钱庄存了一百毛。掌柜说：「存一年，明年连本带息再存，第三年就多了。」弟子不明白：「这利息，也能生利息？」',
    options: [
      { text: '不能，利息只算本金', ok: false },
      { text: '能，这就是"利滚利"，时间越长越可观', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '利钱也要生利钱，这就是利滚利。时间拖得越长，滚起来越凶。'
  },
  {
    id: 'gq_004', cat: '基础理财', icon: '🌾', title: '米价',
    scene: '弟子{name}返乡探亲，回来后说：「村里米价涨了。三年前一斗米二十文，现在要三十文了。爹娘攒的那些铜板，还是那么些，却买不到从前那么多米了。」弟子问：这是为什么？',
    options: [
      { text: '米商黑心', ok: false },
      { text: '钱变"少"了——同样的钱买不到同样多的东西', ok: true },
      { text: '是好事，说明村子富了', ok: false }
    ],
    explain: '钱还是那些钱，货还是那些货，就是钱不值钱咯。这就叫通货膨胀。攒死钱，不如攒能生钱的东西。'
  },
  {
    id: 'gq_005', cat: '基础理财', icon: '🏦', title: '哪个合算',
    scene: '弟子{name}在钱庄看到两种存法：甲，三个月，三分利；乙，一年，一毛利。掌柜说两种都差不多，可弟子怎么觉得不对劲？',
    options: [
      { text: '甲合算，三个月就三分', ok: false },
      { text: '乙合算，一年一毛', ok: false },
      { text: '要算"年化"，不能只看眼前', ok: true }
    ],
    explain: '三个月三分利，折成一年就是十二分。年化就是把不同期限的放到一起比，看哪个划得来。'
  },
  {
    id: 'gq_006', cat: '基础理财', icon: '📜', title: '老账房的劝',
    scene: '弟子{name}想借宗门一笔毛，去搏一桩买卖。管账的老账房拦住他：「小友，你今年二十出头，没家没业，一人吃饱全家不饿，拼一把也无妨。可隔壁那位，有老母要养，有幼弟要顾，他若也这么搏，就是拿一家人的命在赌。」',
    options: [
      { text: '老账房偏心', ok: false },
      { text: '每个人的风险承受能力不一样——要看年龄、家底、负担', ok: true },
      { text: '借给谁都是赌', ok: false }
    ],
    explain: '敢不敢搏，不只看胆子大不大，还要看你后头站到好多人。'
  },
  {
    id: 'gq_007', cat: '基础理财', icon: '💡', title: '什么是理财',
    scene: '弟子{name}问：「掌门，弟子听说山下富户都讲究『理财』。是不是把钱都拿去搏一桩大的，一夜翻身？」',
    options: [
      { text: '对，搏一把大的', ok: false },
      { text: '不是，理财是让资产慢慢保值增值', ok: true },
      { text: '是把钱锁在箱子里', ok: false }
    ],
    explain: '理财不是赌博，是让钱在把稳的风险里头，慢慢长大。'
  },
  {
    id: 'gq_008', cat: '基础理财', icon: '🏜️', title: '荒年',
    scene: '弟子{name}游历时遇到荒年，见一户人家有百亩良田，却拿不出买米的现钱。地里长的还没收，仓里存的都是谷，一家人饿了两天。',
    options: [
      { text: '太穷', ok: false },
      { text: '田和谷难变现，不如手里有现钱', ok: true },
      { text: '时运不好', ok: false }
    ],
    explain: '田和谷算家当，但不能马上换成饭。这叫流动性差。手头留点现钱，才遭得住突发的关口。'
  },
  {
    id: 'gq_009', cat: '基础理财', icon: '📜', title: '家书',
    scene: '弟子{name}收到家书，说爹病重，要一大笔诊金。弟子平日里的毛都拿去搏买卖、买丹药，手里没剩多少。一时慌了神。弟子问：平日里留多少，才不至于被这种事逼到墙角？',
    options: [
      { text: '一分不留，全拿去博', ok: false },
      { text: '留三到六个月的用度', ok: true },
      { text: '留十年用度才安心', ok: false }
    ],
    explain: '三到六个月的用度，是留给意外的。失业、生病、出变故——这些事不跟你打招呼，来了就要钱。'
  },
  {
    id: 'gq_010', cat: '基础理财', icon: '🧾', title: '糊涂账',
    scene: '弟子{name}被派去管宗门采买，一个月下来，账上少了一笔毛。弟子想不起花在哪了，很自责。弟子问：怎么才能不糊涂？',
    options: [
      { text: '不要管账', ok: false },
      { text: '把每一笔进出都记下来', ok: true },
      { text: '多找几个人一起管', ok: false }
    ],
    explain: '记账不是为了抠门，是为了晓得钱跑哪去了。糊涂账里头，既藏到浪费，也藏到漏洞。'
  },

  // ===== 银行存款 =====
  {
    id: 'gq_011', cat: '银行存款', icon: '🏦', title: '钱庄也会倒',
    scene: '弟子{name}在钱庄存了三百毛，回来听说：「钱庄也会倒！当年城东那家，一夜之间人都跑了。」弟子慌了：那弟子的毛怎么办？',
    options: [
      { text: '全无保障，只能自认倒霉', ok: false },
      { text: '朝廷有规矩，一家钱庄里存的钱，最多保到五十万毛', ok: true },
      { text: '只要钱庄大，就没事', ok: false }
    ],
    explain: '朝廷有规矩：一家钱庄存的钱，五十万毛以内全保。超出的另算。莫把鸡蛋全放到一家钱庄。'
  },
  {
    id: 'gq_012', cat: '银行存款', icon: '💰', title: '存法',
    scene: '弟子{name}想存三百毛到钱庄。掌柜说：「活期随取，定期要等。可定期的利钱，是活期的好几倍。」弟子问：该选哪种？',
    options: [
      { text: '活期，随时能取最方便', ok: false },
      { text: '定期，利钱更多', ok: false },
      { text: '看情况——常用的留活期，不动的存定期', ok: true }
    ],
    explain: '全存活期，亏利钱；全存定期，急用钱的时候反而吃亏。各有各的用处。'
  },
  {
    id: 'gq_013', cat: '银行存款', icon: '📜', title: '大额存单',
    scene: '弟子{name}路过钱庄，听见掌柜对一位大主顾说：「您这一千毛存个『大额单子』，利钱比寻常定期还多那么一点。」弟子回来问：为什么大主顾的利钱更多？',
    options: [
      { text: '大主顾运气好', ok: false },
      { text: '因为他存得多、存得久，钱庄愿意给更多利钱', ok: true },
      { text: '因为钱庄喜欢他', ok: false }
    ],
    explain: '钱庄也是做生意。你存得越多越稳当，钱庄能拿去做的事就越多，自然愿意多分你点。'
  },
  {
    id: 'gq_014', cat: '银行存款', icon: '🔮', title: '高息存法',
    scene: '弟子{name}遇到一位道人，道人说：「我这存法，保本，却比寻常存法多两三倍利钱。只是——利钱多少，要看老天爷给不给面子。」',
    options: [
      { text: '完全不靠谱', ok: false },
      { text: '这种"保本，但收益看天"的存法，叫结构性存款', ok: true },
      { text: '是骗局', ok: false }
    ],
    explain: '本钱大体保得住，利钱要看某个事情给不给面子。不是骗人的，但也莫指望好高的利钱。'
  },
  {
    id: 'gq_015', cat: '银行存款', icon: '🏦', title: '钱庄的话变了',
    scene: '弟子{name}发现钱庄的告示变了。从前写：「存本保息，童叟无欺。」现在写：「本钱有险，盈亏自负。」弟子问：钱庄是不是要倒了？',
    options: [
      { text: '是，钱庄要倒了', ok: false },
      { text: '不是，朝廷立了新规：钱庄卖的"理财"不再保本保收益', ok: true },
      { text: '是钱庄掌柜偷懒', ok: false }
    ],
    explain: '从前朝廷护到钱庄，亏了也要赔你。现在规矩变了。存存款才有保障，买理财就莫得咯。'
  },
  {
    id: 'gq_016', cat: '银行存款', icon: '⏰', title: '急用',
    scene: '弟子{name}去年存了三百毛定期，一年利钱一毛五。可这几天他爹病了，急着用钱。弟子去取，钱庄掌柜说：「提前取，按活期算——利钱只有三分。」',
    options: [
      { text: '钱庄耍赖', ok: false },
      { text: '定期的规矩就是这样：提前取，按活期算', ok: true },
      { text: '应该闹一闹', ok: false }
    ],
    explain: '存之前要想清楚——这笔钱，一年内用不用得上。一部分定期，一部分活期，比全押定期把稳。'
  },

  // ===== 宏观 =====
  {
    id: 'gq_017', cat: '宏观', icon: '📯', title: '朝中的风吹',
    scene: '弟子{name}在市集听到消息：朝廷下令，各钱庄每收一百毛，要留二十毛在库里，不准放贷。街上钱一下子紧了。',
    options: [
      { text: '没影响，只是钱庄的事', ok: false },
      { text: '钱庄能放的钱少了，市面上的钱变紧，借贷变贵', ok: true },
      { text: '好事，说明朝廷要发钱', ok: false }
    ],
    explain: '这个比例一提，市面上能流动的钱就少，借钱的利钱就贵——离我们远，也会绕到我们身上来。'
  },
  {
    id: 'gq_018', cat: '宏观', icon: '🏠', title: '买房',
    scene: '弟子{name}想在山下买一宅子，成家立业。跑去钱庄问，掌柜说：「按 LPR 算，加二十个点。」弟子听不懂，回来问掌门。',
    options: [
      { text: '朝廷定的固定利率', ok: false },
      { text: '钱庄报出来的"贷款市场报价利率"', ok: true },
      { text: '钱庄名字', ok: false }
    ],
    explain: 'LPR 是十八家钱庄每个月报一次价，掐头去尾取中间。你借钱的利钱，多半就挂到这上头。'
  },

  // ===== 债券 =====
  {
    id: 'gq_019', cat: '债券', icon: '🤝', title: '借不借',
    scene: '隔壁村闹水患，村正来借钱修堤，说「三年后连本带息还你，年息一分。」弟子{name}问：这算不算一桩买卖？',
    options: [
      { text: '是买卖，但要注意：借钱给谁、他还不还得上', ok: true },
      { text: '不是买卖，是施舍', ok: false },
      { text: '是买卖，稳赚不赔', ok: false }
    ],
    explain: '借钱给村里，就是买了一张债券。看债看两样：借给哪个，还不还得上。村正讲信用、三年能还，就是好债；要是赖账的村，利钱再高也要躲。'
  },

  // ===== 股票 =====
  {
    id: 'gq_020', cat: '股票', icon: '🏪', title: '值不值',
    scene: '弟子{name}想盘下山下一间铺子。掌柜开价五百毛，铺子一年能赚五十毛。弟子算：十年回本。可隔壁另一间铺子，开价三百毛，一年也赚五十毛。弟子问：哪间更值？',
    options: [
      { text: '一样的', ok: false },
      { text: '按"几年回本"算——两年回本的比十年回本的更值', ok: true },
      { text: '看铺子大小', ok: false }
    ],
    explain: '价钱除以年利润，就是几年回本，行话叫市盈率。一样的利润，价钱越低越划得来。'
  },

  // ===== 股票 =====
  {
    id: 'gq_021', cat: '股票', icon: '📈', title: '红绿柱子',
    scene: '弟子{name}下山办事，看到一堵墙上画满了红绿柱子，问掌门：「那些人盯到墙上的红绿柱子，一会儿笑一会儿哭，那是个啥子东西？」',
    options: [
      { text: '是朝廷的布告', ok: false },
      { text: '是股价涨跌的图，红柱表示涨，绿柱表示跌', ok: true },
      { text: '是商号的账本', ok: false }
    ],
    explain: '那叫 K 线。红柱是收得比开得多，绿柱是收得比开得少。看多了就晓得，红绿都是寻常事。'
  },
  {
    id: 'gq_022', cat: '股票', icon: '📉', title: '涨停板',
    scene: '弟子{name}从坊市回来，兴冲冲地说：「掌门！弟子买的那只票今天『涨停』了！听人说，一天就赚了一成！」',
    options: [
      { text: '厉害，明天再买点', ok: false },
      { text: '涨停是涨到当天上限，想卖也未必卖得脱', ok: true },
      { text: '涨停就是永远不跌', ok: false }
    ],
    explain: '主板一天最多涨一成，涨到顶就动不了咯。买的人多，卖的人少，你想卖都排不上队。'
  },
  {
    id: 'gq_023', cat: '股票', icon: '💰', title: '股息',
    scene: '弟子{name}听说山下有家老字号，每年都给股东分红利，问掌门：「这是不是比存钱庄划得来？」',
    options: [
      { text: '分红就一定划得来', ok: false },
      { text: '要看股息率——一年分红除以股价', ok: true },
      { text: '分不分红跟股价莫得关系', ok: false }
    ],
    explain: '分红是好事，但要看跟股价比划不划得来。一年分红除以股价，就是股息率。'
  },
  {
    id: 'gq_024', cat: '股票', icon: '💸', title: '除息',
    scene: '弟子{name}持有的票分了红，可他第二天一看，股价跌了一截。弟子慌了：「是不是被人骗了？」',
    options: [
      { text: '是被骗了', ok: false },
      { text: '是除息——分红之后股价要相应下调，总资产没变', ok: true },
      { text: '是庄家在操纵', ok: false }
    ],
    explain: '分了红，股价就要扣掉分红那部分，这叫除息。你拿到手的钱加股价，跟原来一样。'
  },
  {
    id: 'gq_025', cat: '股票', icon: '🐴', title: '白马与黑马',
    scene: '弟子{name}在坊市听人摆龙门阵，有人说买「白马股」稳，有人说要抓「黑马股」才赚。弟子回来问掌门：「白马黑马，到底是啥子？」',
    options: [
      { text: '白马是外国的马', ok: false },
      { text: '白马是业绩稳的大公司，黑马是突然爆发的', ok: true },
      { text: '白马是白色的马', ok: false }
    ],
    explain: '白马股是那些名声好、业绩稳的。黑马股是原先不起眼，突然发力的。各有各的赌法。'
  },

  // ===== 基金 =====
  {
    id: 'gq_026', cat: '基金', icon: '🪙', title: '聚沙成塔',
    scene: '弟子{name}听说有个法子，把一百个人的小钱凑起来，交给一个懂行的人去打理，赚了一人分一点。弟子问：「这靠不靠得住？」',
    options: [
      { text: '靠不住，钱交给别个不放心', ok: false },
      { text: '这就是基金——大家凑钱，专人打理，风险共担', ok: true },
      { text: '是骗局', ok: false }
    ],
    explain: '把钱凑起来交给懂行的人，就是基金。好处是分散，坏处是管理的人不一定靠谱。'
  },
  {
    id: 'gq_027', cat: '基金', icon: '📊', title: '跟到大盘走',
    scene: '弟子{name}问：「有没有那种不用动脑筋，跟到大盘一起走就行的法子？」',
    options: [
      { text: '莫得，天下没有这种事', ok: false },
      { text: '有，指数基金——跟着某个指数走，不用挑个股', ok: true },
      { text: '有，但要天天盯盘', ok: false }
    ],
    explain: '指数基金就是跟到某个榜走。榜上有的它都买点，榜变它也变。适合不想操心的人。'
  },
  {
    id: 'gq_028', cat: '基金', icon: '🔄', title: '定投',
    scene: '弟子{name}说：「弟子每个月存一点毛，固定买同一只基金，不管涨跌都买，掌门觉得咋样？」',
    options: [
      { text: '要等跌了再买', ok: false },
      { text: '定投能摊平成本，不用择时，适合长期', ok: true },
      { text: '是傻办法', ok: false }
    ],
    explain: '定投就是不管涨跌都买。贵的买得少，便宜的买得多，日子久了成本就平了。'
  },
  {
    id: 'gq_029', cat: '基金', icon: '📜', title: '申购费',
    scene: '弟子{name}买了一只基金，发现还没赚就先扣了一笔钱，问：「这是不是被人骗了？」',
    options: [
      { text: '是被骗了', ok: false },
      { text: '是申购费，买基金本来就要收手续费', ok: true },
      { text: '是基金公司偷钱', ok: false }
    ],
    explain: '买基金要收申购费，卖要收赎回费。持得越短，赎回费越贵。'
  },

  // ===== 债券 =====
  {
    id: 'gq_030', cat: '债券', icon: '🏛️', title: '朝廷借条',
    scene: '弟子{name}在市集听说朝廷发了一批「借条」，说好三年后连本带利还。弟子问：「朝廷也要借钱？」',
    options: [
      { text: '朝廷借钱肯定赖账', ok: false },
      { text: '这叫国债，朝廷发的债，是最把稳的一种', ok: true },
      { text: '是谣言', ok: false }
    ],
    explain: '朝廷发的借条就是国债。一个国家的信用撑着，比哪个商号的借条都把稳。'
  },
  {
    id: 'gq_031', cat: '债券', icon: '🔄', title: '可转可换',
    scene: '弟子{name}听说有一种债，到期不光能拿回本钱，还能换成那家商号的股。弟子觉得很划算，回来问掌门。',
    options: [
      { text: '天下哪有这种好事', ok: false },
      { text: '这叫可转债，兼有债和股的性子', ok: true },
      { text: '那是骗人的', ok: false }
    ],
    explain: '可转债就是债，但到了时候能换成股。涨了换股，跌了拿本钱，两头都沾点边。'
  },
  {
    id: 'gq_032', cat: '债券', icon: '⚖️', title: '利钱一涨债就跌',
    scene: '弟子{name}手里有一张债，本想把稳，结果市面上的利钱一涨，他手里的债反而不值钱了。弟子不解。',
    options: [
      { text: '是有人操纵', ok: false },
      { text: '利钱涨了，老债就不吃香了，价钱自然跌', ok: true },
      { text: '是弟子运气不好', ok: false }
    ],
    explain: '市面上利钱一涨，新债利钱高，老债就没人要咯，价钱就要跌。这是老规矩。'
  },

  // ===== 保险 =====
  {
    id: 'gq_033', cat: '保险', icon: '💊', title: '给身子留条后路',
    scene: '弟子{name}游历时见一户人家，主人生了重病，一家老小砸锅卖铁。弟子回来问：「有没有啥子法子，能防这种事？」',
    options: [
      { text: '多存钱就行了', ok: false },
      { text: '买重疾险——生了大病，一次赔一笔钱', ok: true },
      { text: '无解', ok: false }
    ],
    explain: '重疾险是那种，生了大病一次性赔你一笔钱。治病、养家、还债，想咋个用就咋个用。'
  },
  {
    id: 'gq_034', cat: '保险', icon: '🏥', title: '看病报销',
    scene: '弟子{name}问：「听说有种法子，生病住院花的钱，能按实报销？」',
    options: [
      { text: '莫得这种事', ok: false },
      { text: '有，医疗险，按实际花费报销', ok: true },
      { text: '是骗子', ok: false }
    ],
    explain: '医疗险是按实际花的钱来报，花了好多报好多，不会多赔。'
  },
  {
    id: 'gq_035', cat: '保险', icon: '⏳', title: '后悔的期限',
    scene: '弟子{name}替宗门买了份保险，回来觉得不划算，问掌门能不能退。',
    options: [
      { text: '买了就退不脱咯', ok: false },
      { text: '有犹豫期，十来天内可以全退', ok: true },
      { text: '退了要赔一大笔', ok: false }
    ],
    explain: '买保险有犹豫期，十来天内反悔可以全退。过了这个村就没这个店咯。'
  },

  // ===== 房产税务 =====
  {
    id: 'gq_036', cat: '房产税务', icon: '🏠', title: '契税',
    scene: '弟子{name}在山下买了一处宅子，去衙门办手续时被收了一笔钱。弟子问：「这是啥子钱？」',
    options: [
      { text: '是衙门乱收费', ok: false },
      { text: '是契税，买房要交的税，由买方出', ok: true },
      { text: '是中介费', ok: false }
    ],
    explain: '买房要交契税，这笔钱是买方出，不是卖方。各地税率不一样，要问清楚。'
  },
  {
    id: 'gq_037', cat: '房产税务', icon: '🏦', title: '还贷两种还法',
    scene: '弟子{name}想借钱庄的钱买房，掌柜问他要选哪种还法：「一种每月还一样多，一种越还越少。」弟子拿不定主意。',
    options: [
      { text: '选每月还一样的，省心', ok: false },
      { text: '两种各有各的好处——等额本息前期压力小，等额本金总利钱少', ok: true },
      { text: '看掌柜喜欢哪种', ok: false }
    ],
    explain: '每月还一样多的叫等额本息，前期轻松。越还越少的叫等额本金，总利钱少，但开头要拿得出。'
  },

  // ===== 反诈 =====
  {
    id: 'gq_038', cat: '反诈', icon: '💔', title: '杀猪盘',
    scene: '弟子{name}遇到一位嘴甜的人，天天嘘寒问暖，说带他去一个稳赚的买卖。弟子有点心动，回来问掌门。',
    options: [
      { text: '是好人，可以信', ok: false },
      { text: '这是杀猪盘——先跟你处感情，再引你去投资', ok: true },
      { text: '试试也无妨', ok: false }
    ],
    explain: '先哄你开心，再引你去投钱，钱一进去就出不来了。这是杀猪盘，莫信。'
  },
  {
    id: 'gq_039', cat: '反诈', icon: '📞', title: '冒充公门',
    scene: '弟子{name}接到一通电话，对方说自己是衙门的人，说弟子犯了事，要把钱转到「安全账户」去。弟子慌了。',
    options: [
      { text: '赶紧转，别惹事', ok: false },
      { text: '是骗子——衙门不会打电话叫你转钱', ok: true },
      { text: '先转一半试试', ok: false }
    ],
    explain: '衙门办案不会打电话，更不会叫你转钱到啥子安全账户。接到这种电话，直接挂。'
  },
  {
    id: 'gq_040', cat: '反诈', icon: '🛒', title: '刷单返利',
    scene: '弟子{name}看到一个告示，说帮人刷单就能拿返利，第一单还真的返了钱。弟子心动，想加大投入。',
    options: [
      { text: '加大投入，赚得更多', ok: false },
      { text: '是诈骗——先给甜头，等你投大了就卷款跑', ok: true },
      { text: '可以试试小额的', ok: false }
    ],
    explain: '先让你尝点甜头，等你投大的时候，人早就跑咯。这是老套路。'
  },
  {
    id: 'gq_041', cat: '反诈', icon: '🪙', title: '高息理财',
    scene: '弟子{name}听说一个买卖，「投一百，一年变两百」，稳赚。弟子来问掌门要不要投。',
    options: [
      { text: '投，机会难得', ok: false },
      { text: '一年翻倍的，十有八九是骗局', ok: true },
      { text: '投一点点试试', ok: false }
    ],
    explain: '一年翻倍，天下哪有这种好事。利钱高得离谱的，十有八九是骗人的。'
  },

  // ===== 宏观 =====
  {
    id: 'gq_042', cat: '宏观', icon: '🥬', title: '物价涨了',
    scene: '弟子{name}从山下回来，抱怨菜价涨了：「去年一文钱两把菜，现在一文钱一把了。」问掌门这是啥子原因。',
    options: [
      { text: '菜农黑心', ok: false },
      { text: '这就是通胀，钱没变少，是钱不值钱了', ok: true },
      { text: '是天气不好', ok: false }
    ],
    explain: '菜价涨、米价涨、啥子都在涨，这就是通货膨胀。钱还在，就是不值钱咯。'
  },
  {
    id: 'gq_043', cat: '宏观', icon: '📊', title: '一国一年',
    scene: '弟子{name}问：「掌门，弟子听说朝廷每年都要算一个数，说一国一年一共做了好多买卖，那个叫啥子？」',
    options: [
      { text: '叫国库', ok: false },
      { text: '叫 GDP——一国一年内产出的全部东西的价值', ok: true },
      { text: '叫税收', ok: false }
    ],
    explain: 'GDP 就是一国一年里头，做出来的东西加起来的价值。数字越大，说明买卖越兴旺。'
  },
  {
    id: 'gq_044', cat: '宏观', icon: '📈', title: '加息',
    scene: '弟子{name}听说朝廷要「加息」，问掌门这是好事还是坏事。',
    options: [
      { text: '一定是好事', ok: false },
      { text: '存钱吃利的人欢喜，借钱的和股债要吃亏', ok: true },
      { text: '跟我们莫得关系', ok: false }
    ],
    explain: '利钱一涨，存钱的安逸，借钱的头疼。股和债多半要跌，做买卖的也难过。'
  },

  // ===== 投资心理 =====
  {
    id: 'gq_045', cat: '投资心理', icon: '📉', title: '追涨杀跌',
    scene: '弟子{name}看别人买啥子就买啥子，涨了追进去，跌了赶紧跑。忙了一年，反而亏了。弟子想不通。',
    options: [
      { text: '运气不好', ok: false },
      { text: '这是追涨杀跌——典型的亏钱法子', ok: true },
      { text: '市场不好', ok: false }
    ],
    explain: '涨了追，跌了跑，多半是买高卖低。稳得住的人才赚得到钱。'
  },
  {
    id: 'gq_046', cat: '投资心理', icon: '🐑', title: '跟到大家走',
    scene: '弟子{name}看大家买啥子就跟着买，说：「大家都买的，肯定莫得错。」',
    options: [
      { text: '有道理', ok: false },
      { text: '这叫羊群效应——大家错的时候一起错', ok: true },
      { text: '人多就稳当', ok: false }
    ],
    explain: '大家都买不一定对。人多的地方往往贵，等你跟进去，就成了接盘的那个。'
  },
  {
    id: 'gq_047', cat: '投资心理', icon: '😖', title: '输了心头难受',
    scene: '弟子{name}买的东西跌了一成，难受得睡不着。掌门问他为啥子，他说：「跌一成的难受，比涨两成的欢喜还厉害。」',
    options: [
      { text: '弟子心态不好', ok: false },
      { text: '这是人性——亏的痛比赚的喜要强', ok: true },
      { text: '弟子太贪', ok: false }
    ],
    explain: '人都一样，亏一块的痛，要赚两块才补得回来。这叫损失厌恶，晓得就好。'
  },

  // ===== 生活理财 =====
  {
    id: 'gq_048', cat: '生活理财', icon: '💳', title: '先花后还',
    scene: '弟子{name}拿到一张「先花后还」的凭证，说这个月花下个月还。弟子觉得好用，想多花点。',
    options: [
      { text: '随便花，下个月还就行', ok: false },
      { text: '要小心——花起的时候不心疼，还的时候才晓得痛', ok: true },
      { text: '莫得关系', ok: false }
    ],
    explain: '先花后还，花的时候不心疼，还的时候才晓得。用多了就成了无底洞。'
  },
  {
    id: 'gq_049', cat: '生活理财', icon: '📋', title: '信用',
    scene: '弟子{name}想借钱庄的钱，掌柜查了查，摇头说：「你名字底下莫得信用。」弟子不懂。',
    options: [
      { text: '是掌柜看不起他', ok: false },
      { text: '是征信——借过钱、还过钱，才攒得起信用', ok: true },
      { text: '是家底不够', ok: false }
    ],
    explain: '朝廷有个册子，记到你借钱还钱的事。借了按时还，就攒得起信用；赖了账，以后借钱就难咯。'
  },
  {
    id: 'gq_050', cat: '生活理财', icon: '⚠️', title: '借来的钱不能乱用',
    scene: '弟子{name}听说有一种「消费贷」，借来的钱能拿去买房买股。弟子问掌门这样行不行。',
    options: [
      { text: '行，只要能赚', ok: false },
      { text: '不行——消费贷只能用来消费，挪去买房炒股是违规的', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '消费贷就是叫你去花钱的，不能挪去买房炒股。查到了要收回，还要吃罚。'
  },

  // ===== 股票（续）=====
  {
    id: 'gq_051', cat: '股票', icon: '📊', title: '换手',
    scene: '弟子{name}从坊市回来，一脸稀奇：「掌门，弟子看那墙上有个数，一会儿大一会儿小，叫啥子『换手』，是啥子意思嘛？」',
    options: [
      { text: '是换庄家的手', ok: false },
      { text: '是成交量和流通股数的比，代表买卖活不活跃', ok: true },
      { text: '是排队的人', ok: false }
    ],
    explain: '换手就是这一天成交的股，占全部能买卖的股的好多。换手高，说明买卖旺；低，就冷清。'
  },
  {
    id: 'gq_052', cat: '股票', icon: '⏰', title: 'T+1',
    scene: '弟子{name}买了一只票，第二天想卖，发现卖不脱。弟子急了，跑来问：「是不是被人锁死了？」',
    options: [
      { text: '是被人锁死了', ok: false },
      { text: '是规矩——今天买的，明天才能卖', ok: true },
      { text: '要三天后才能卖', ok: false }
    ],
    explain: '这是 T+1 的规矩。今天买的，明天才准卖。防的就是当天来回倒腾。'
  },
  {
    id: 'gq_053', cat: '股票', icon: '💰', title: '一手是好多',
    scene: '弟子{name}想去买票，回来问：「掌门，人家说一手一百股，弟子只能凑够五十股，能不能买半手？」',
    options: [
      { text: '可以买半手', ok: false },
      { text: '不行，最少一手一百股，除非是科创板', ok: true },
      { text: '看行情', ok: false }
    ],
    explain: '一般一手是一百股，最少买一手。科创板例外，可以一股一股买。'
  },
  {
    id: 'gq_054', cat: '股票', icon: '📜', title: '招股书',
    scene: '弟子{name}拿到一本厚厚的册子，说是一家商号要「上市」，招人入股。弟子看不懂，来问掌门。',
    options: [
      { text: '扔了，莫得用', ok: false },
      { text: '这是招股书，要仔细看——里头写了商号的底细', ok: true },
      { text: '是广告', ok: false }
    ],
    explain: '招股书是商号上市前交底的册子。里头写了家底、做啥子、赚好多。买之前要看。'
  },
  {
    id: 'gq_055', cat: '股票', icon: '🚪', title: '停牌',
    scene: '弟子{name}手里的票突然买不脱也卖不脱了，急得团团转。跑来问掌门是不是出了啥子事。',
    options: [
      { text: '商号跑路了', ok: false },
      { text: '是停牌——有大事，先停一停，等查清楚再开', ok: true },
      { text: '被官府封了', ok: false }
    ],
    explain: '停牌是有大事，比如要重组、核查，先停一停。等事情清楚了，再开市。'
  },
  {
    id: 'gq_056', cat: '股票', icon: '📉', title: '跌停',
    scene: '弟子{name}买的一只票连着跌停三天，急得吃不下饭。问掌门：「是不是永远出不来了？」',
    options: [
      { text: '永远出不来了', ok: false },
      { text: '跌停是跌到当天上限，不是出不来，是想卖的人多', ok: true },
      { text: '是骗局', ok: false }
    ],
    explain: '跌停是跌到当天不能再跌。想卖的人多，排队也未必卖得脱。但过了这天，又能动咯。'
  },
  {
    id: 'gq_057', cat: '股票', icon: '📖', title: '沪深',
    scene: '弟子{name}听人说要去「沪深」买票，回来问掌门沪深在哪儿，要走几天路。',
    options: [
      { text: '走三天', ok: false },
      { text: '沪深是两处交易所，一南一北，不用走路，是买卖的场子', ok: true },
      { text: '是两个人的名字', ok: false }
    ],
    explain: '沪深是两处交易所：一处在上海，一处在深圳。全国的票都在那里头买卖。'
  },
  {
    id: 'gq_058', cat: '股票', icon: '🛡️', title: '蓝筹',
    scene: '弟子{name}听人说买「蓝筹股」稳当，回来问掌门：「啥子是蓝筹？是不是蓝色的筹码？」',
    options: [
      { text: '是蓝色的筹码', ok: false },
      { text: '是大商号、老字号的票，业绩稳、分红多', ok: true },
      { text: '是官家的票', ok: false }
    ],
    explain: '蓝筹股是那些老字号、大商号。业绩稳当，分红也多，跌也跌不到哪儿去。'
  },
  {
    id: 'gq_059', cat: '股票', icon: '📈', title: '均线',
    scene: '弟子{name}盯着墙上的图，看到几根弯弯的线，问掌门那是啥子。',
    options: [
      { text: '是装饰', ok: false },
      { text: '是均线——把前几天收盘价平均出来的线', ok: true },
      { text: '是买卖的人数', ok: false }
    ],
    explain: '均线就是把前几天收的价平均一下，画成一根线。五天的、十天的、二十天的，各看各的。'
  },
  {
    id: 'gq_060', cat: '股票', icon: '🔍', title: '内幕',
    scene: '弟子{name}神秘兮兮地说：「掌门，弟子听人说明天有桩大事，提前买肯定赚。」',
    options: [
      { text: '赶紧去买', ok: false },
      { text: '内幕交易是犯法的，莫沾', ok: true },
      { text: '自己人听一嘴莫得关系', ok: false }
    ],
    explain: '内幕是犯法的。听一嘴也不行，查到了要罚，还要坐牢。莫为这点钱把自己搭进去。'
  },

  // ===== 基金（续）=====
  {
    id: 'gq_061', cat: '基金', icon: '💧', title: '余额宝',
    scene: '弟子{name}把钱放进去一个地方，说随用随取，还有利钱。问掌门这是啥子。',
    options: [
      { text: '是钱庄', ok: false },
      { text: '是货币基金——放短期的钱，稳当又活泛', ok: true },
      { text: '是骗局', ok: false }
    ],
    explain: '货币基金就是买短期的票，稳当又能随时取。余额宝就是这一类。'
  },
  {
    id: 'gq_062', cat: '基金', icon: '🌍', title: '出海',
    scene: '弟子{name}说：「掌门，弟子听说有法子把毛拿去买海外的铺子，那个叫啥子？」',
    options: [
      { text: '叫走私', ok: false },
      { text: '叫 QDII——拿境内的钱去买海外的票', ok: true },
      { text: '叫外贸', ok: false }
    ],
    explain: 'QDII 就是拿境内的钱去买海外的票。好处是散得开，坏处是还要担汇率的风险。'
  },
  {
    id: 'gq_063', cat: '基金', icon: '📦', title: '一篮子',
    scene: '弟子{name}买了一只基金，问掌门：「这只基金里头装了些啥子？总不能啥都不晓得吧。」',
    options: [
      { text: '看运气', ok: false },
      { text: '看持仓——基金每季度会公布买了啥', ok: true },
      { text: '不公布', ok: false }
    ],
    explain: '基金每季度要公布买了啥子，叫持仓。不看的都是闭到眼睛买。'
  },
  {
    id: 'gq_064', cat: '基金', icon: '💼', title: 'ETF',
    scene: '弟子{name}听人说「ETF」，问掌门这是三个啥子字。',
    options: [
      { text: '三个商号名', ok: false },
      { text: '是一种能在交易所买卖的指数基金', ok: true },
      { text: '是一种债', ok: false }
    ],
    explain: 'ETF 就是能在交易所像票一样买卖的指数基金。买卖方便，费用也低。'
  },
  {
    id: 'gq_065', cat: '基金', icon: '🎯', title: '净值和累计净值',
    scene: '弟子{name}看到一只基金有两个价，一个叫净值，一个叫累计净值，搞不懂哪个算数。',
    options: [
      { text: '看净值就行了', ok: false },
      { text: '净值是眼前价，累计净值算上了历史分红', ok: true },
      { text: '看累计就行了', ok: false }
    ],
    explain: '净值是眼前的价。累计净值是把历年的分红加回去，看基金真实成绩的。'
  },
  {
    id: 'gq_066', cat: '基金', icon: '📉', title: '最大回撤',
    scene: '弟子{name}问：「掌门，弟子怎么晓得一只基金最惨的时候能跌好多？」',
    options: [
      { text: '没法晓得', ok: false },
      { text: '看最大回撤——历史最高点跌到最低点的幅度', ok: true },
      { text: '看当下的价', ok: false }
    ],
    explain: '最大回撤就是从最高点跌下来最多跌了好多。这个数越大，说明跌起来越狠。'
  },
  {
    id: 'gq_067', cat: '基金', icon: '⚖️', title: '夏普',
    scene: '弟子{name}听到一个词叫「夏普比率」，搞不懂，回来问掌门。',
    options: [
      { text: '是个人名', ok: false },
      { text: '是衡量赚得划不划得来的数——赚得多、波动小的更优', ok: true },
      { text: '是个商号', ok: false }
    ],
    explain: '夏普比率是看赚这么多钱，担了好大的波动。同样的赚，波动越小越划算。'
  },
  {
    id: 'gq_068', cat: '基金', icon: '📜', title: '认申购费',
    scene: '弟子{name}买基金时，看到「申购」「认购」两个词，问掌门有啥子区别。',
    options: [
      { text: '一样的', ok: false },
      { text: '新发基金叫认购，老基金叫申购', ok: true },
      { text: '认购更贵', ok: false }
    ],
    explain: '新发基金在募集的时候买叫认购。老基金平日买叫申购。'
  },
  {
    id: 'gq_069', cat: '基金', icon: '🏦', title: '场内场外',
    scene: '弟子{name}买基金，有人说去「场内」，有人说去「场外」，弟子懵了。',
    options: [
      { text: '一个在屋里，一个在屋外', ok: false },
      { text: '场内是在交易所买，场外是在钱庄、票号买', ok: true },
      { text: '两个是一回事', ok: false }
    ],
    explain: '场内是在交易所像票一样买卖，场外是找钱庄、票号买。各有各的方便。'
  },
  {
    id: 'gq_070', cat: '基金', icon: '📊', title: '指数增强',
    scene: '弟子{name}看到一只基金叫「指数增强」，问掌门啥子叫增强。',
    options: [
      { text: '是骗人的', ok: false },
      { text: '是指数基金上加点主动操作，想跑赢指数', ok: true },
      { text: '是指数翻倍', ok: false }
    ],
    explain: '指数增强就是跟到指数走，再自己动点手脚，想多赚点。搞得好赚得多，搞得撇就跑输。'
  },

  // ===== 保险（续）=====
  {
    id: 'gq_071', cat: '保险', icon: '⏳', title: '等待期',
    scene: '弟子{name}刚买了一份保险，第二个月就病了，去要赔，人家说「还在等待期」。弟子不解。',
    options: [
      { text: '是人家耍赖', ok: false },
      { text: '是等待期——刚买的一段时间里出险不赔', ok: true },
      { text: '是弟子买错了', ok: false }
    ],
    explain: '刚买保险有一段时间叫等待期，这期间出险不赔。防的就是带病投保。'
  },
  {
    id: 'gq_072', cat: '保险', icon: '📋', title: '如实告知',
    scene: '弟子{name}替自己买保险，人家问他身子有没有啥子毛病，弟子觉得说了就买不成，想瞒到。',
    options: [
      { text: '瞒到，反正人家查不到', ok: false },
      { text: '要如实说——瞒了以后赔的时候要吃亏', ok: true },
      { text: '随便写', ok: false }
    ],
    explain: '买保险要如实说身子情况。瞒了以后出事，人家一查，可以拒赔，还退不到本钱。'
  },
  {
    id: 'gq_073', cat: '保险', icon: '💰', title: '免赔额',
    scene: '弟子{name}生病住院花了一笔，去要赔，人家说「先扣一万免赔额」。弟子搞不懂。',
    options: [
      { text: '是人家耍赖', ok: false },
      { text: '免赔额是自己先担的部分，超过的才赔', ok: true },
      { text: '是罚款', ok: false }
    ],
    explain: '免赔额是自己先担的。比如一万，你花了一万五，人家只赔五千。'
  },
  {
    id: 'gq_074', cat: '保险', icon: '💀', title: '寿险',
    scene: '弟子{name}问：「掌门，弟子听人说有一种险，自己走了以后才赔，那买来干啥子嘛？」',
    options: [
      { text: '莫得用', ok: false },
      { text: '是寿险——留给家里人用的', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '寿险是给自己走了以后赔的。是留给爹娘、婆娘、娃儿用的，自己是用不上的。'
  },
  {
    id: 'gq_075', cat: '保险', icon: '🎁', title: '现金价值',
    scene: '弟子{name}想退一份保险，人家说「按现金价值退」。弟子问这现金价值是啥子。',
    options: [
      { text: '就是赔的钱', ok: false },
      { text: '是退保能拿回来的钱，前面几年多半比交的少', ok: true },
      { text: '是分红', ok: false }
    ],
    explain: '现金价值就是退保能拿回的。前面几年交的钱扣了费用，多半比交的少。'
  },
  {
    id: 'gq_076', cat: '保险', icon: '🚗', title: '意外',
    scene: '弟子{name}问：「掌门，弟子听说有一种险，只赔意外，不赔病。那不赔病的，买来干啥子？」',
    options: [
      { text: '莫得用', ok: false },
      { text: '意外险就是保意外——摔伤、车祸这些', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '意外险就是保意外。摔了、撞了、烫了，这些是意外。生病不算。'
  },
  {
    id: 'gq_077', cat: '保险', icon: '🧓', title: '年金',
    scene: '弟子{name}问：「掌门，弟子听说有一种险，年轻的时候交钱，老了按月拿，那叫啥子？」',
    options: [
      { text: '叫养老金', ok: false },
      { text: '叫年金险——到了年头按月给钱', ok: true },
      { text: '叫存款', ok: false }
    ],
    explain: '年金险是年轻时候交钱，到了约定的年头，按月或按年给你。养老、养娃儿，都可以用。'
  },
  {
    id: 'gq_078', cat: '保险', icon: '📱', title: '百万医疗',
    scene: '弟子{name}听说有一种险，保额上百万，一年才几十毛。弟子觉得是骗子。',
    options: [
      { text: '肯定是骗子', ok: false },
      { text: '是真有——叫百万医疗险，保额高、费用低，但有免赔额', ok: true },
      { text: '保额是虚的', ok: false }
    ],
    explain: '百万医疗是真有的。保额上百万，一年几十毛，但有一万的免赔额。小病用不上，大病才管用。'
  },

  // ===== 反诈（续）=====
  {
    id: 'gq_079', cat: '反诈', icon: '📞', title: '领奖电话',
    scene: '弟子{name}接到电话，说他在啥子比试里中了头奖，要先交一笔税费才能领。弟子心动。',
    options: [
      { text: '赶紧交', ok: false },
      { text: '是诈骗——领奖哪有先交钱的', ok: true },
      { text: '交一点点试试', ok: false }
    ],
    explain: '领奖哪有先交钱的道理。先交钱的，十有八九是骗人的。'
  },
  {
    id: 'gq_080', cat: '反诈', icon: '💻', title: '退款短信',
    scene: '弟子{name}收到一条短信，说他之前买的东西有问题，点链接可以退款。弟子手一滑就点了。',
    options: [
      { text: '没事，点就点了', ok: false },
      { text: '危险——链接可能是钓鱼的，会偷走信息', ok: true },
      { text: '是好事', ok: false }
    ],
    explain: '不明来路的链接莫点。点了可能要你输账号、密码、验证码。真正的退款走的是原路。'
  },
  {
    id: 'gq_081', cat: '反诈', icon: '👮', title: '查案',
    scene: '弟子{name}接到电话，说自己是衙门的，说弟子卷进了一桩大案，要配合查，把钱转到指定账户。',
    options: [
      { text: '赶紧转，配合衙门', ok: false },
      { text: '是诈骗——衙门不会电话办案，更不会叫转钱', ok: true },
      { text: '先转一半', ok: false }
    ],
    explain: '衙门办案要当面，不会打电话。更不会叫你转钱到啥子账户。接到这种电话，直接挂。'
  },
  {
    id: 'gq_082', cat: '反诈', icon: '💳', title: '征信修复',
    scene: '弟子{name}听说有人能花钱把征信上的黑点抹掉。弟子信以为真，来问掌门要不要花这笔钱。',
    options: [
      { text: '花钱抹掉', ok: false },
      { text: '是骗局——征信上的记录，任何人都改不了', ok: true },
      { text: '试试也无妨', ok: false }
    ],
    explain: '征信是朝廷的册子，谁都不能改。说是能花钱抹的，都是骗子。'
  },
  {
    id: 'gq_083', cat: '反诈', icon: '🎣', title: '钓鱼',
    scene: '弟子{name}收到一封信，说钱庄要升级，叫他点链接改密码。弟子差点就点了。',
    options: [
      { text: '点了没事', ok: false },
      { text: '是钓鱼——钱庄不会发链接叫你改密码', ok: true },
      { text: '小心点就行', ok: false }
    ],
    explain: '钱庄不会发链接叫你改密码。遇到这种信，先打官方电话问，莫点链接。'
  },
  {
    id: 'gq_084', cat: '反诈', icon: '💸', title: '刷单',
    scene: '弟子{name}在网上接到一单活：帮商号刷好评就给钱。开头真的给了几毛。后来人家叫他投一笔大钱，说刷得越多赚得越多。',
    options: [
      { text: '投大钱', ok: false },
      { text: '是诈骗——刷单本身就违法，返利是诱饵', ok: true },
      { text: '小投一点', ok: false }
    ],
    explain: '刷单本身就犯法，返利是钓你上钩的。等你投大了，人就跑咯。'
  },
  {
    id: 'gq_085', cat: '反诈', icon: '🎭', title: 'AI 换脸',
    scene: '弟子{name}接到师兄的视频，说急着用钱，叫他赶紧转。弟子觉得脸是师兄的脸，声音也对，差点就转了。',
    options: [
      { text: '转，师兄有难', ok: false },
      { text: '小心——现在有换脸的骗术，要打电话核实', ok: true },
      { text: '先转一半', ok: false }
    ],
    explain: '现在有换脸的邪术，脸和声音都能仿。真借钱，要打回电话亲口问。'
  },
  {
    id: 'gq_086', cat: '反诈', icon: '📦', title: '注销校园贷',
    scene: '弟子{name}接到电话，说他在外面借的校园贷不注销，以后要影响征信，要他把钱转到一个账户去「销账」。',
    options: [
      { text: '赶紧转', ok: false },
      { text: '是诈骗——莫得这种销账的法子', ok: true },
      { text: '先问问', ok: false }
    ],
    explain: '校园贷的销账走官方渠道，莫得打钱过去这一说。接到这种电话，直接挂。'
  },

  // ===== 宏观（续）=====
  {
    id: 'gq_087', cat: '宏观', icon: '🌊', title: '降准',
    scene: '弟子{name}从坊市回来，说朝廷「降准」了，街上钱庄的人都笑。弟子问掌门这是啥子意思。',
    options: [
      { text: '是降低工资', ok: false },
      { text: '是下调存款准备金率，钱庄能放的钱多了', ok: true },
      { text: '是降利息', ok: false }
    ],
    explain: '降准是让钱庄多留一点钱去放贷。市面上的钱就多了，借钱也便宜些。'
  },
  {
    id: 'gq_088', cat: '宏观', icon: '💰', title: 'M2',
    scene: '弟子{name}听到一个词叫「M2」，问掌门这是啥子。',
    options: [
      { text: '是个人名', ok: false },
      { text: '是广义货币——市面上一共有好多钱', ok: true },
      { text: '是商号名', ok: false }
    ],
    explain: 'M2 就是市面上所有的钱加起来的数。这个数越大，说明钱越多。'
  },
  {
    id: 'gq_089', cat: '宏观', icon: '📊', title: 'CPI',
    scene: '弟子{name}听人说「CPI」，问掌门这是啥子。',
    options: [
      { text: '是个人名', ok: false },
      { text: '是物价指数——看平时买的东西涨了好多', ok: true },
      { text: '是税', ok: false }
    ],
    explain: 'CPI 就是把平时买的东西加起来，看比去年贵了好多。这个数一高，就说明通胀来了。'
  },
  {
    id: 'gq_090', cat: '宏观', icon: '🌏', title: '顺差逆差',
    scene: '弟子{name}听人摆龙门阵，说我们跟海外做买卖「顺差」。弟子问顺差是啥子。',
    options: [
      { text: '是走出去的多', ok: false },
      { text: '是卖到海外的比从海外买的多', ok: true },
      { text: '是路顺', ok: false }
    ],
    explain: '顺差就是卖出去的多，买回来的少。逆差就反过来。'
  },
  {
    id: 'gq_091', cat: '宏观', icon: '💵', title: '人民币升值',
    scene: '弟子{name}听说朝廷的铜板升值了，问掌门这是好事还是坏事。',
    options: [
      { text: '一定是好事', ok: false },
      { text: '买海外的东西划得来，卖出去的要吃亏', ok: true },
      { text: '跟我们莫得关系', ok: false }
    ],
    explain: '钱升值了，买海外的东西便宜，出去耍也划算。但卖东西到海外的，换回来就少了，要吃亏。'
  },
  {
    id: 'gq_092', cat: '宏观', icon: '📈', title: '滞胀',
    scene: '弟子{name}听人说什么「滞胀」，问掌门这是啥子毛病。',
    options: [
      { text: '是走不动路', ok: false },
      { text: '是买卖不涨，物价还涨，最难办的境况', ok: true },
      { text: '是走路慢', ok: false }
    ],
    explain: '滞胀就是买卖不景气，物价还一个劲地涨。又挣不到钱，钱还不值钱，最难办。'
  },
  {
    id: 'gq_093', cat: '宏观', icon: '🏛️', title: '财政货币',
    scene: '弟子{name}问掌门：「朝廷里头有两拨人管钱，一拨管收税花钱，一拨管印钱收钱，那两拨啥子区别？」',
    options: [
      { text: '一样的', ok: false },
      { text: '管收税花钱的是财政，管印钱的是货币', ok: true },
      { text: '都是管印钱的', ok: false }
    ],
    explain: '财政是朝廷收税、花钱。货币是央行印钱、调利息。两拨人，各管一头。'
  },

  // ===== 投资心理（续）=====
  {
    id: 'gq_094', cat: '投资心理', icon: '🎲', title: '赌徒谬误',
    scene: '弟子{name}说：「掌门，弟子买的那只票跌了五天咯，弟子觉得明天肯定要涨。」',
    options: [
      { text: '有道理', ok: false },
      { text: '每次涨跌都是独立的，跌了五天不代表明天涨', ok: true },
      { text: '那是运气不好', ok: false }
    ],
    explain: '前头跌了，跟明天涨不涨莫得关系。莫拿"该涨了"来哄自己，这是赌徒的心思。'
  },
  {
    id: 'gq_095', cat: '投资心理', icon: '🎯', title: '锚定',
    scene: '弟子{name}说：「掌门，弟子这只票买成一百毛，现在跌到八十，弟子不甘心卖，等回到一百就卖。」',
    options: [
      { text: '有道理，等回本', ok: false },
      { text: '买价只是买价，看的是它以后值好多，不是过去买了好多', ok: true },
      { text: '多等一下就好了', ok: false }
    ],
    explain: '买价是你的买价，市场不管你买成好多。看的是它以后还值好多，莫被买价绑死咯。'
  },
  {
    id: 'gq_096', cat: '投资心理', icon: '💡', title: '能力圈',
    scene: '弟子{name}看到别人做玉石买卖赚了大钱，心动，也想去。可他自己连玉石都分不清。',
    options: [
      { text: '跟着买就行', ok: false },
      { text: '不懂的买卖莫沾——只在懂的里头做', ok: true },
      { text: '学两天就会了', ok: false }
    ],
    explain: '你懂啥子，就在啥子里头做。不懂的买卖，别人赚，你未必赚。这叫能力圈。'
  },
  {
    id: 'gq_097', cat: '投资心理', icon: '⏳', title: '长期',
    scene: '弟子{name}天天盯到墙上，涨了笑，跌了哭，人都瘦了一圈。掌门劝他，他说忍不住。',
    options: [
      { text: '盯到好些', ok: false },
      { text: '看长远些，莫天天盯，多看一眼多一分焦虑', ok: true },
      { text: '盯到才稳当', ok: false }
    ],
    explain: '天天盯，心态要绷断。看长远点，反而赚得多。钱是等出来的，不是盯出来的。'
  },
  {
    id: 'gq_098', cat: '投资心理', icon: '🎁', title: '幸存者偏差',
    scene: '弟子{name}说：「掌门，弟子听人说做玉石买卖赚了几十万毛，弟子也想去。」',
    options: [
      { text: '赶紧去', ok: false },
      { text: '你只看到赚了的，那些亏了的没出来说话', ok: true },
      { text: '赚的人是运气好', ok: false }
    ],
    explain: '你只看到赚了的那个。街上做玉石亏了家当的，早就不好意思出门咯。这叫幸存者偏差。'
  },
  {
    id: 'gq_099', cat: '投资心理', icon: '💊', title: '沉没成本',
    scene: '弟子{name}开了一间铺子，亏了半年，还想接着投钱，说：「都投了这么多了，不能就这么算了。」',
    options: [
      { text: '对，投都投了', ok: false },
      { text: '前面投的钱叫沉没成本，已经收不回来，看的是它以后能不能行', ok: true },
      { text: '再投一年看看', ok: false }
    ],
    explain: '投进去收不回来的钱，叫沉没成本。看的是铺子以后行不行，不是前面投了好多。'
  },
  {
    id: 'gq_100', cat: '投资心理', icon: '🧘', title: '仓位',
    scene: '弟子{name}把全部家当都押在一只票上，掌门劝他留点。弟子说：「押得重才赚得多。」',
    options: [
      { text: '有道理', ok: false },
      { text: '押得重，亏起来也重。要留点余地，才睡得着觉', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '押得重，赚得确实多，但亏起来一样重。要留点余地，才扛得住波动，晚上才睡得着。'
  },

  // ===== 生活理财（续）=====
  {
    id: 'gq_101', cat: '生活理财', icon: '💰', title: '砍头息',
    scene: '弟子{name}借了一笔钱，说好一百毛，到手只有九十毛，人家说那十毛是「先扣的利钱」。',
    options: [
      { text: '很正常', ok: false },
      { text: '这叫砍头息——是违规的，借一百就只能到手一百', ok: true },
      { text: '看人吧', ok: false }
    ],
    explain: '借一百到手九十，那十毛就是砍头息。这是违规的，告到衙门要挨罚。'
  },
  {
    id: 'gq_102', cat: '生活理财', icon: '📱', title: '花呗白条',
    scene: '弟子{name}用「花呗」「白条」花起没感觉，月底一算，花出去的比自己挣的还多。',
    options: [
      { text: '很正常', ok: false },
      { text: '花起来莫感觉，是这类东西最要紧的坑', ok: true },
      { text: '多用几次就习惯咯', ok: false }
    ],
    explain: '先花后还，花的时候莫感觉，还的时候才心疼。用多了，就成了无底洞。'
  },
  {
    id: 'gq_103', cat: '生活理财', icon: '💳', title: '最低还款',
    scene: '弟子{name}信用卡还不上，选了「最低还款」，以为占了大便宜。',
    options: [
      { text: '是占了便宜', ok: false },
      { text: '剩下没还的按天算利钱，比高利贷还凶', ok: true },
      { text: '莫得关系', ok: false }
    ],
    explain: '最低还款只是不逾期，剩下没还的部分按天算利钱，滚起来吓人。'
  },
  {
    id: 'gq_104', cat: '生活理财', icon: '⏰', title: '免息期',
    scene: '弟子{name}听说信用卡有「免息期」，问掌门最长能有好多天。',
    options: [
      { text: '永远免息', ok: false },
      { text: '二十到五十天，要看账单日和还款日', ok: true },
      { text: '只免一天', ok: false }
    ],
    explain: '免息期一般是二十到五十天，看你哪天花的。账单日到还款日之间最长。'
  },
  {
    id: 'gq_105', cat: '生活理财', icon: '📋', title: '征信查询',
    scene: '弟子{name}想借钱，人家说要查「征信」。弟子问掌门征信咋个查。',
    options: [
      { text: '只能到衙门查', ok: false },
      { text: '朝廷有专门的册子，本人每年可以免费查几次', ok: true },
      { text: '查不了', ok: false }
    ],
    explain: '朝廷有专门的册子，本人每年可以免费查几次。莫让别人乱查，查多了影响征信。'
  },
  {
    id: 'gq_106', cat: '生活理财', icon: '🔍', title: '硬查询',
    scene: '弟子{name}申请了几家钱庄的贷款，结果都没批。后来再申请，人家说征信「花了」。',
    options: [
      { text: '是钱庄小气', ok: false },
      { text: '每次申请贷款都会留记录，查多了会让人觉得你缺钱', ok: true },
      { text: '是弟子长得不行', ok: false }
    ],
    explain: '每申请一次贷款，征信上就多一条。查多了，人家觉得你到处借钱，就不敢借给你咯。'
  },
  {
    id: 'gq_107', cat: '生活理财', icon: '💰', title: '等额本息',
    scene: '弟子{name}借钱庄的钱，选的是「每月还一样多」那种。还了一年，本金好像没少好多。弟子纳闷。',
    options: [
      { text: '钱庄黑', ok: false },
      { text: '前面还的多半是利钱，本金少，这很正常', ok: true },
      { text: '是算错了', ok: false }
    ],
    explain: '每月还一样多的叫等额本息。前面还的多半是利钱，本金少，后面才慢慢变多。'
  },
  {
    id: 'gq_108', cat: '生活理财', icon: '🎯', title: '年化陷阱',
    scene: '弟子{name}借钱，人家说「月利只要一分」，弟子觉得很便宜。回来一算，一年下来吓一跳。',
    options: [
      { text: '月利一分不贵', ok: false },
      { text: '月利一分折成年化就是十二分，一点也不便宜', ok: true },
      { text: '算错了', ok: false }
    ],
    explain: '月利一分，一年就是十二分。好些地方用月利、日利来糊人，折成年化一看，吓一跳。'
  },
  {
    id: 'gq_109', cat: '生活理财', icon: '🎁', title: '攒钱',
    scene: '弟子{name}说：「掌门，弟子每个月挣得也不少，就是攒不下钱。」',
    options: [
      { text: '挣得太少', ok: false },
      { text: '攒钱要"先攒后花"，拿到手先留一笔，剩下的再花', ok: true },
      { text: '莫得法子', ok: false }
    ],
    explain: '拿到钱先留一笔，剩下的再花，这才攒得下。反过来先花后攒，多半攒不成。'
  },
  {
    id: 'gq_110', cat: '生活理财', icon: '🏦', title: '记账',
    scene: '弟子{name}说每个月钱花得不明不白，问掌门咋个才能搞清楚。',
    options: [
      { text: '把钱都存起来', ok: false },
      { text: '记个账——每一笔进出都写下来', ok: true },
      { text: '莫得法子', ok: false }
    ],
    explain: '把每一笔都记下来，月底一看就晓得钱跑哪去了。记了三个月，自己都吓一跳。'
  },
  {
    id: 'gq_111', cat: '生活理财', icon: '💡', title: '断舍离',
    scene: '弟子{name}屋子里堆满了东西，钱都花在这上头了。问掌门咋个办。',
    options: [
      { text: '多买点收纳的', ok: false },
      { text: '只留真正要用的，其余的处理掉，也少花冤枉钱', ok: true },
      { text: '搬家', ok: false }
    ],
    explain: '东西多了，钱也花了，屋子也挤了。只留要用的，剩下的处理掉，清爽又省钱。'
  },
  {
    id: 'gq_112', cat: '生活理财', icon: '🛒', title: '冲动消费',
    scene: '弟子{name}看到打折就走不动路，买回来又用不上。问掌门咋个治。',
    options: [
      { text: '打折就买，划算', ok: false },
      { text: '买之前先问自己：不打折的时候，还会不会买', ok: true },
      { text: '多买点就习惯了', ok: false }
    ],
    explain: '打折只是让你觉得占了便宜，不是真的需要。买前先问一句：不打折还买不买？'
  },

  // ===== 债券（续）=====
  {
    id: 'gq_113', cat: '债券', icon: '📜', title: '到期收益率',
    scene: '弟子{name}手里有一张债，问掌门咋个算划不划算。',
    options: [
      { text: '看票面上的利钱', ok: false },
      { text: '要看"到期收益率"——把买价、利钱、到期还本都算进去', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '票面利钱只是面上的。要看划不划算，得把买价、利钱、到期还本一起算，叫到期收益率。'
  },
  {
    id: 'gq_114', cat: '债券', icon: '🏛️', title: '国债逆回购',
    scene: '弟子{name}听说有一种买卖，把钱借出去一夜，第二天连本带利还，对方拿国债押到。弟子问靠不靠得住。',
    options: [
      { text: '靠不住', ok: false },
      { text: '叫国债逆回购，稳当，短期闲钱可以放', ok: true },
      { text: '是骗局', ok: false }
    ],
    explain: '对方拿国债押到，你把钱借出去一夜，第二天连本带利拿回来。短期闲钱放这儿，稳当。'
  },
  {
    id: 'gq_115', cat: '债券', icon: '💵', title: '信用评级',
    scene: '弟子{name}想买一张商号的债，看到有「评级」两个字，问掌门是啥子意思。',
    options: [
      { text: '是商号的等级', ok: false },
      { text: '是评它还不还得上钱的等级，越低风险越高', ok: true },
      { text: '是利息高低', ok: false }
    ],
    explain: '评级是评它还不还得上钱。等级高，还钱把稳，利钱低；等级低，利钱高，但要担大风险。'
  },
  {
    id: 'gq_116', cat: '债券', icon: '🎫', title: '零息债',
    scene: '弟子{name}听说有一种债，不付利钱，但是卖得便宜。弟子觉得怪。',
    options: [
      { text: '是骗子', ok: false },
      { text: '是零息债——便宜买进，到期按原价还本', ok: true },
      { text: '是废纸', ok: false }
    ],
    explain: '零息债不付利钱，但买的时候便宜，到期按原价还。省下来的差价就是赚的。'
  },
  {
    id: 'gq_117', cat: '债券', icon: '🏭', title: '企业债',
    scene: '弟子{name}说：「掌门，朝廷的债利钱太少了，弟子想买商号的债，利钱高些。」',
    options: [
      { text: '商号债肯定稳', ok: false },
      { text: '商号债利钱高，但要看商号还不还得上，有风险', ok: true },
      { text: '商号债是骗人的', ok: false }
    ],
    explain: '商号债利钱高，是因为风险也高。万一商号倒了，本钱都可能拿不回来。'
  },
  {
    id: 'gq_118', cat: '债券', icon: '⏳', title: '久期',
    scene: '弟子{name}听人说债有「久期」，问掌门这是啥子。',
    options: [
      { text: '是放好久', ok: false },
      { text: '是衡量债对利钱变化敏不敏感——久期越长，利钱一动，价就动得多', ok: true },
      { text: '是发行的时间', ok: false }
    ],
    explain: '久期越长，利钱一动，价格动得就越凶。买债的，要看这个。'
  },

  // ===== 基础理财（续）=====
  {
    id: 'gq_119', cat: '基础理财', icon: '🎯', title: '目标',
    scene: '弟子{name}说：「掌门，弟子想攒钱，可总攒不下。」掌门问他攒钱干啥子，他说不上来。',
    options: [
      { text: '攒钱不需要目标', ok: false },
      { text: '攒钱要先有个目标——买房、娶亲、还是养老，越具体越好', ok: true },
      { text: '看心情', ok: false }
    ],
    explain: '攒钱要有个由头。有个具体的数、具体的事，攒起来才有劲。'
  },
  {
    id: 'gq_120', cat: '基础理财', icon: '💼', title: '副业',
    scene: '弟子{name}想搞点副业多挣些。问掌门该咋个选。',
    options: [
      { text: '哪个来钱快选哪个', ok: false },
      { text: '要看跟主业冲不冲突，能不能长期积累', ok: true },
      { text: '看别人做啥', ok: false }
    ],
    explain: '副业不要跟主业打架，最好还能攒点本事。只图眼前来钱快的，多半长久不了。'
  },
  {
    id: 'gq_121', cat: '基础理财', icon: '📚', title: '人力资本',
    scene: '弟子{name}问：「掌门，弟子莫得家底，咋个才算有本钱？」',
    options: [
      { text: '莫得家底就没本钱', ok: false },
      { text: '你的身子、本事、学问，就是最大的本钱', ok: true },
      { text: '等有钱再说', ok: false }
    ],
    explain: '你的身子、你的本事、你的学问，就是最大的本钱。学东西，就是给自己攒本钱。'
  },
  {
    id: 'gq_122', cat: '基础理财', icon: '💼', title: '职业天花板',
    scene: '弟子{name}说：「掌门，弟子在这个位子上干了好几年，好像再也上不去了。」',
    options: [
      { text: '是你不够努力', ok: false },
      { text: '这叫天花板——有的位子天生就有上限，要换条路才行', ok: true },
      { text: '再等等', ok: false }
    ],
    explain: '有的位子干到头也就那样，这叫天花板。想再上，得换条路走，或者换个行当。'
  },
  {
    id: 'gq_123', cat: '基础理财', icon: '💡', title: '斜杠',
    scene: '弟子{name}白天在宗门修行，晚上给人抄书赚钱，周末还去给人看宅子。掌门问他为啥子这么忙。',
    options: [
      { text: '太辛苦了，别做了', ok: false },
      { text: '这叫斜杠，一个人有多种身份，也是抗风险的法子', ok: true },
      { text: '是不务正业', ok: false }
    ],
    explain: '一个人有几样本事、几个来钱的路子，这叫斜杠。一条路断了，还有别的走。'
  },
  {
    id: 'gq_124', cat: '基础理财', icon: '💰', title: '睡后收入',
    scene: '弟子{name}问：「掌门，弟子听说有一种收入，睡起觉都在来钱，真的假的？」',
    options: [
      { text: '假的', ok: false },
      { text: '真的有——像房租、分红、利息，不用天天出力', ok: true },
      { text: '是骗局', ok: false }
    ],
    explain: '房租、分红、利息，这些不用你天天出力，钱自己就来。这叫被动收入，也叫睡后收入。'
  },

  // ===== 银行存款（续）=====
  {
    id: 'gq_125', cat: '银行存款', icon: '💰', title: '零存整取',
    scene: '弟子{name}想攒钱，钱庄说可以「零存整取」，每个月存一点，到期一次取。弟子问划不划算。',
    options: [
      { text: '不划算', ok: false },
      { text: '适合管不住手的人——强制攒钱', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '零存整取就是每月存一点，到期一次拿。利钱不算高，但适合攒不下钱的人。'
  },
  {
    id: 'gq_126', cat: '银行存款', icon: '💧', title: '整存零取',
    scene: '弟子{name}手头有一笔毛，想按期拿一点出来用。钱庄说可以「整存零取」。',
    options: [
      { text: '不行', ok: false },
      { text: '可以，一次存入，按期取一点出来', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '整存零取就是一次存入，之后按期取一点用。适合手里有笔钱、但想分期用的。'
  },
  {
    id: 'gq_127', cat: '银行存款', icon: '📜', title: '通知存款',
    scene: '弟子{name}问：「掌门，弟子有一笔钱，随时可能要用，又不想存活期，咋个办？」',
    options: [
      { text: '存活期', ok: false },
      { text: '通知存款——提前跟钱庄打个招呼，就能取', ok: true },
      { text: '莫得法子', ok: false }
    ],
    explain: '通知存款介于活期和定期之间。要用了，提前一天或七天跟钱庄说一声，就能取。'
  },
  {
    id: 'gq_128', cat: '银行存款', icon: '🏦', title: '利率浮动',
    scene: '弟子{name}说：「掌门，弟子看两家钱庄，同样的存法，利钱咋个不一样？」',
    options: [
      { text: '是有一家黑心', ok: false },
      { text: '朝廷只给个基准，各家可以在上头浮动', ok: true },
      { text: '是算错了', ok: false }
    ],
    explain: '朝廷只给个基准数，各家钱庄可以在上头加点、减点，所以利钱不完全一样。'
  },
  {
    id: 'gq_129', cat: '银行存款', icon: '💰', title: '压岁钱',
    scene: '弟子{name}有个小师弟，每年过年都得一笔压岁钱，问掌门该咋个帮他存。',
    options: [
      { text: '花了算了', ok: false },
      { text: '帮他开个户，教他记账，从小养成习惯', ok: true },
      { text: '不归你管', ok: false }
    ],
    explain: '从小教他管钱，比给好多钱都值。开个户，记个账，让他自己管一小部分。'
  },

  // ===== 股票（再续）=====
  {
    id: 'gq_130', cat: '股票', icon: '🏛️', title: '科创',
    scene: '弟子{name}说：「掌门，弟子听说有个『科创板』，跟寻常的票不一样。啥子不一样嘛？」',
    options: [
      { text: '一样的', ok: false },
      { text: '门槛高，涨跌也大，一天最多动两成', ok: true },
      { text: '是给官家买的', ok: false }
    ],
    explain: '科创板门槛高，一天涨跌最多两成，比寻常的票凶。没搞懂莫乱买。'
  },
  {
    id: 'gq_131', cat: '股票', icon: '📉', title: 'ST',
    scene: '弟子{name}手里的票名字前头突然多了两个字母「ST」，问掌门是啥子意思。',
    options: [
      { text: '是好事', ok: false },
      { text: '是商号出了问题，被朝廷警示了', ok: true },
      { text: '是商号上市了', ok: false }
    ],
    explain: 'ST 是商号出了毛病，比如连着亏钱，被朝廷警示了。这种票要小心。'
  },
  {
    id: 'gq_132', cat: '股票', icon: '🏢', title: '配股',
    scene: '弟子{name}手里的商号说可以「配股」，让股东再拿钱买新股，比市面便宜。弟子问该不该买。',
    options: [
      { text: '不买就亏了', ok: false },
      { text: '不买股份会稀释，买又得出钱，看手里宽不宽裕', ok: true },
      { text: '一定是好事', ok: false }
    ],
    explain: '配股不买，你手里的股占比就变小咯。要买，又要再拿钱出来。手头不宽裕就莫勉强。'
  },
  {
    id: 'gq_133', cat: '股票', icon: '💵', title: '分红',
    scene: '弟子{name}手里的票分红了，开心的跑来告诉掌门。',
    options: [
      { text: '分红就白赚了', ok: false },
      { text: '分红后股价要下调，总资产没变，只是换了个形式', ok: true },
      { text: '是白给的', ok: false }
    ],
    explain: '分红之后，股价要相应往下调。你的钱没多，只是换成了现钱。'
  },
  {
    id: 'gq_134', cat: '股票', icon: '🎯', title: '大盘',
   scene: '弟子{name}说：「掌门，今日全城都在说『大盘涨了』，大盘是啥子？」',
    options: [
      { text: '是最大的那只票', ok: false },
      { text: '是把好多种票综合起来的一个数', ok: true },
      { text: '是官家的票', ok: false }
    ],
    explain: '大盘是把好多票综合起来算的一个数。大盘涨，多数票也涨；大盘跌，多数票也跌。'
  },
  {
    id: 'gq_135', cat: '股票', icon: '👥', title: '散户',
    scene: '弟子{name}听人说自己「散户」，问掌门这是啥子身份。',
    options: [
      { text: '是散开的户', ok: false },
      { text: '是小本买卖的，跟大庄家不一样', ok: true },
      { text: '是官家', ok: false }
    ],
    explain: '散户就是小本买卖的，钱不多。跟大庄家比，散户信息慢、力气小，要小心。'
  },

  // ===== 基金（再续）=====
  {
    id: 'gq_136', cat: '基金', icon: '🔄', title: '转换',
    scene: '弟子{name}买了一只基金，想换成另外一只，问掌门咋个办最省事。',
    options: [
      { text: '先赎再买', ok: false },
      { text: '有些平台可以直接转换，省时间也省钱', ok: true },
      { text: '莫得法子', ok: false }
    ],
    explain: '有些平台可以直接把一只基金换成另一只，比先赎再买快，费用也可能更省。'
  },
  {
    id: 'gq_137', cat: '基金', icon: '📉', title: '止损',
    scene: '弟子{name}的基金跌了两成，问掌门要不要割了。',
    options: [
      { text: '割了算了', ok: false },
      { text: '先看当初为啥子买它，理由还在就不慌', ok: true },
      { text: '再等等', ok: false }
    ],
    explain: '跌了先莫慌。问问自己当初为啥子买它，如果那个理由还在，就莫急到割。'
  },
  {
    id: 'gq_138', cat: '基金', icon: '📊', title: '基金定投止盈',
    scene: '弟子{name}定投了好几年，赚了不少，问掌门啥时候该收手。',
    options: [
      { text: '永远不止盈', ok: false },
      { text: '设个目标，赚到就落袋为安', ok: true },
      { text: '看心情', ok: false }
    ],
    explain: '定投也要有止盈的打算。设个目标，赚够了就落袋为安，莫贪。'
  },
  {
    id: 'gq_139', cat: '基金', icon: '🏢', title: '私募',
    scene: '弟子{name}听说有一种基金只给「合格的人」买，门槛很高。',
    options: [
      { text: '是骗人的', ok: false },
      { text: '叫私募——只给有钱、有经验的人买', ok: true },
      { text: '是官家的', ok: false }
    ],
    explain: '私募只卖给有钱、有经验的人，门槛高。普通人碰不到，也不该碰。'
  },
  {
    id: 'gq_140', cat: '基金', icon: '📋', title: '基金合同',
    scene: '弟子{name}买基金前，人家给他一本厚厚的合同。弟子看不懂，想扔了。',
    options: [
      { text: '扔了算了', ok: false },
      { text: '要翻一翻——里头写了费用、风险、咋个赎', ok: true },
      { text: '让别个看', ok: false }
    ],
    explain: '合同里头写了费用、风险、咋个赎。看不懂也要翻一翻，特别看费用和风险那几段。'
  },
  {
    id: 'gq_141', cat: '基金', icon: '💰', title: '基金分红',
    scene: '弟子{name}的基金分红了，问掌门是不是白赚了。',
    options: [
      { text: '是白赚的', ok: false },
      { text: '分红后净值要下调，选现金分红或红利再投', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '分红后净值要往下调，钱没多。可以选拿现钱，也可以选再投进去买更多份额。'
  },

  // ===== 房产税务（续）=====
  {
    id: 'gq_142', cat: '房产税务', icon: '🏠', title: '首付',
    scene: '弟子{name}想买房，问掌门咋个才能少借点钱庄的钱。',
    options: [
      { text: '借多点', ok: false },
      { text: '多凑点首付，借得少，利钱也少', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '首付给得多，借得就少，利钱也少。手里宽裕的话，多凑点首付划算。'
  },
  {
    id: 'gq_143', cat: '房产税务', icon: '📋', title: '满五唯一',
    scene: '弟子{name}想卖房，人家说「满五唯一」可以不交个税。弟子不懂。',
    options: [
      { text: '是骗人的', ok: false },
      { text: '是房住满五年、且是家里唯一住房，卖的时候可以免个税', ok: true },
      { text: '是住了五年', ok: false }
    ],
    explain: '满五唯一就是住满五年，并且是家里唯一住房。卖的时候个税可以免。'
  },
  {
    id: 'gq_144', cat: '房产税务', icon: '💰', title: '增值税',
    scene: '弟子{name}卖房时被扣了一笔「增值税」，问掌门这是啥子。',
    options: [
      { text: '是乱收的', ok: false },
      { text: '是卖东西时对赚的部分收的税', ok: true },
      { text: '是中介费', ok: false }
    ],
    explain: '增值税是对赚的部分收的税。买卖东西、提供服务，多半都要交。'
  },
  {
    id: 'gq_145', cat: '房产税务', icon: '🏛️', title: '个税起征',
    scene: '弟子{name}问：「掌门，弟子每月挣的钱，好多才开始交个税？」',
    options: [
      { text: '三百毛', ok: false },
      { text: '五千毛起，超过的部分才交', ok: true },
      { text: '好多都要交', ok: false }
    ],
    explain: '现在起征点是五千毛，超过的部分才按等级交税。挣得少的，多半不用交。'
  },

  // ===== 保险（再续）=====
  {
    id: 'gq_146', cat: '保险', icon: '👨‍👩‍👧', title: '保险利益',
    scene: '弟子{name}想给邻居买保险，人家说不行。弟子不解。',
    options: [
      { text: '是人家耍赖', ok: false },
      { text: '买保险得对人家有「保险利益」——家人、债主才行', ok: true },
      { text: '是弟子钱少', ok: false }
    ],
    explain: '买保险得对人家有保险利益，比如父子、夫妻、债主。邻居不行，防的是有人动歪心思。'
  },
  {
    id: 'gq_147', cat: '保险', icon: '🧓', title: '老年人防诈',
    scene: '弟子{name}回家，发现爷爷在听人说「高息养老理财」，还准备把老本钱投进去。弟子慌了。',
    options: [
      { text: '老人愿意投就投', ok: false },
      { text: '高息养老理财多是骗局，要劝住', ok: true },
      { text: '投一点点试试', ok: false }
    ],
    explain: '高息养老理财十有八九是骗局，盯到的是老人的老本钱。要劝住，还要陪着去查。'
  },
  {
    id: 'gq_148', cat: '保险', icon: '🚨', title: '冒充保险',
    scene: '弟子{name}接到电话，说他的保险要「升级」，叫他转钱。弟子差点就转了。',
    options: [
      { text: '转了没事', ok: false },
      { text: '是诈骗——正规保险不会电话叫你转钱', ok: true },
      { text: '小心点就行', ok: false }
    ],
    explain: '正规保险不会打电话叫你转钱。遇到这种电话，先打官方电话核实。'
  },

  // ===== 反诈（再续）=====
  {
    id: 'gq_149', cat: '反诈', icon: '🔌', title: '共享屏幕',
    scene: '弟子{name}接到电话，对方说帮他处理问题，叫他开「共享屏幕」。弟子想开。',
    options: [
      { text: '开就是', ok: false },
      { text: '危险——共享屏幕等于把手机给人家看', ok: true },
      { text: '没关系', ok: false }
    ],
    explain: '共享屏幕就是把你手机给人家看。验证码、账户、密码，全暴露。正经办事不会叫你开这个。'
  },
  {
    id: 'gq_150', cat: '反诈', icon: '🎰', title: '境外赌博',
    scene: '弟子{name}被人拉进一个群，说里面能「稳赢」。开头真赢了几毛。',
    options: [
      { text: '跟着下注', ok: false },
      { text: '是诈骗——先让你赢，再让你输得倾家荡产', ok: true },
      { text: '小玩一下', ok: false }
    ],
    explain: '开头让你赢几毛，是钓你上钩。等你投大的，一晚上输得底朝天。境外赌局，十赌十输。'
  },

  // ===== 生活理财（续）=====
  {
    id: 'gq_151', cat: '生活理财', icon: '🍜', title: '外卖',
    scene: '弟子{name}算账，发现一个月光吃饭就花了一小半钱。掌门问他咋个花的。他说：「顿顿外卖，省事。」',
    options: [
      { text: '省事就值', ok: false },
      { text: '自己弄几顿，一个月能省不少', ok: true },
      { text: '看心情', ok: false }
    ],
    explain: '顿顿外卖，看着一顿不多，一个月加起来吓人。自己弄几顿，钱就省下来咯。'
  },
  {
    id: 'gq_152', cat: '生活理财', icon: '📱', title: '会员',
    scene: '弟子{name}说：「掌门，弟子手机上开了七八个会员，每个月自动扣钱，弟子都不晓得扣了好多。」',
    options: [
      { text: '开着就开着', ok: false },
      { text: '把不用的停了，一年下来是笔大钱', ok: true },
      { text: '莫得关系', ok: false }
    ],
    explain: '好几个会员自动续，一个月几十毛，一年就是几百。用不上的，赶紧停。'
  },
  {
    id: 'gq_153', cat: '生活理财', icon: '☕', title: '小习惯',
    scene: '弟子{name}每天都要喝一杯茶，说一天才几毛，不算啥子。掌门给他算了算一年。',
    options: [
      { text: '一天几毛，确实不多', ok: false },
      { text: '一天几毛，一年下来也是一笔大钱', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '一天几毛听着不多，一年下来就是几百。小习惯最容易掏空钱包。'
  },
  {
    id: 'gq_154', cat: '生活理财', icon: '🛍️', title: '名牌',
    scene: '弟子{name}省吃俭用买了件名牌，回来跟大家炫耀。掌门问他：「穿上以后，你本事长了？」',
    options: [
      { text: '长面子就够了', ok: false },
      { text: '名牌不长本事，钱花了就是花了', ok: true },
      { text: '看场合', ok: false }
    ],
    explain: '名牌穿上好看，但你的本事没长。花这个钱，是给别个看的，不是给自己的。'
  },
  {
    id: 'gq_155', cat: '生活理财', icon: '📅', title: '双十一',
    scene: '弟子{name}看到各家商号都在打折，忍不住买了一大堆。买回来才发现，好些用不上。',
    options: [
      { text: '打折就买，划算', ok: false },
      { text: '打折之前先问：不打折的时候，要不要买', ok: true },
      { text: '看别人买不买', ok: false }
    ],
    explain: '打折是商号的套路，让你觉得占了便宜。买之前先问问自己，不打折的时候要不要买。'
  },
  {
    id: 'gq_156', cat: '生活理财', icon: '🏪', title: '逛超市',
    scene: '弟子{name}去市集，本来说好只买两样，出来的时候提了一大包。',
    options: [
      { text: '多买点没关系', ok: false },
      { text: '出门前先列个单子，按单子买', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '出门前先列单子，进了市集按单子买。不然看啥子都想买，一回就多花好多。'
  },
  {
    id: 'gq_157', cat: '生活理财', icon: '💸', title: '借钱给朋友',
    scene: '弟子{name}的朋友来借钱，说好一个月还。弟子想问掌门该不该借。',
    options: [
      { text: '朋友有难，肯定借', ok: false },
      { text: '要看你舍不舍得这笔钱，舍不舍得这段情', ok: true },
      { text: '不借', ok: false }
    ],
    explain: '借钱给朋友，先想清楚：这笔钱要不回来，你舍不舍得；这段情，还能不能处。'
  },
  {
    id: 'gq_158', cat: '生活理财', icon: '📊', title: '家庭账本',
    scene: '弟子{name}成了家，两口子各花各的，月底一对，完全对不上。',
    options: [
      { text: '各管各的就行', ok: false },
      { text: '一起记个家庭账本，互相通气', ok: true },
      { text: '谁挣得多谁做主', ok: false }
    ],
    explain: '两口子各记各的，就永远对不上。搞一个共用的账本，互相晓得花到哪了。'
  },
  {
    id: 'gq_159', cat: '生活理财', icon: '🏠', title: '搬家',
    scene: '弟子{name}换了住处，发现押金要不回来，还赔了一笔。问掌门当初咋个没留心。',
    options: [
      { text: '倒霉', ok: false },
      { text: '入住先拍照、留凭证，搬走时才好交底', ok: true },
      { text: '莫得法子', ok: false }
    ],
    explain: '入住前拍个照、留个凭证，搬走的时候才好在房东面前说得清。'
  },
  {
    id: 'gq_160', cat: '生活理财', icon: '💰', title: '中奖',
    scene: '弟子{name}中了一笔小奖，想立刻花掉。掌门劝他。',
    options: [
      { text: '花就花，反正是白得的', ok: false },
      { text: '意外之财，先存一半，剩下一半再花', ok: true },
      { text: '都花掉才开心', ok: false }
    ],
    explain: '中奖的钱来得容易，去得也容易。先存一半，剩下一半再花，钱才留得住。'
  },
  {
    id: 'gq_161', cat: '生活理财', icon: '🏥', title: '看病',
    scene: '弟子{name}的爹病了，看医生花了不少。弟子说：「早晓得当初该买份保险。」',
    options: [
      { text: '事后的话莫用', ok: false },
      { text: '现在买也不迟，从今日起把风险兜住', ok: true },
      { text: '等等再买', ok: false }
    ],
    explain: '事后感慨莫得用。现在开始把风险兜住，比啥子都不做要强。'
  },
  {
    id: 'gq_162', cat: '生活理财', icon: '🚬', title: '烟酒',
    scene: '弟子{name}每天抽烟喝酒，一个月花不少。掌门问他算过没有。',
    options: [
      { text: '抽烟喝酒是人情', ok: false },
      { text: '一天几毛，一年就是一大笔，还伤身子', ok: true },
      { text: '看个人', ok: false }
    ],
    explain: '一天几毛，一年就是一大笔。钱花了，身子还遭罪，两样都不划算。'
  },
  {
    id: 'gq_163', cat: '生活理财', icon: '📱', title: '短信扣费',
    scene: '弟子{name}每月话费都超，查看账单，一堆不晓得的服务在扣钱。',
    options: [
      { text: '算了', ok: false },
      { text: '打客服取消，好些服务是默认开的', ok: true },
      { text: '换号', ok: false }
    ],
    explain: '好些服务是默认开的，你不管就一直扣。打客服取消，一年能省不少。'
  },
  {
    id: 'gq_164', cat: '生活理财', icon: '💧', title: '水电气',
    scene: '弟子{name}说每个月水电气都快赶上房租了。掌门问他自己家的表看没看。',
    options: [
      { text: '看那个干啥子', ok: false },
      { text: '自己看一眼表，跟账单对一对，有时会算错', ok: true },
      { text: '莫得办法', ok: false }
    ],
    explain: '偶尔自己看一眼表，跟账单对一对。有时候是真算错了，你不查就一直交。'
  },
  {
    id: 'gq_165', cat: '生活理财', icon: '👶', title: '养娃',
    scene: '弟子{name}刚添了个娃，天天买这买那。掌门问他，这些都用得上不。',
    options: [
      { text: '为娃儿花啥子都值', ok: false },
      { text: '娃儿的东西，用得上才买，莫被商号牵着走', ok: true },
      { text: '看别人买啥子', ok: false }
    ],
    explain: '为娃儿花钱是应该的，但不是啥子都要买。用不上的，买回来也堆到起。'
  },

  // ===== 投资心理（续）=====
  {
    id: 'gq_166', cat: '投资心理', icon: '🎰', title: '梭哈',
    scene: '弟子{name}把全部家当押到一只票上，掌门劝他。他说：「押得重才翻得快。」',
    options: [
      { text: '有道理', ok: false },
      { text: '梭哈是赌，不是投资。留一手，才走得远', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '全部压进去叫梭哈，是赌。留一手，跌了还能再起来，才走得远。'
  },
  {
    id: 'gq_167', cat: '投资心理', icon: '💭', title: '隔壁老王',
    scene: '弟子{name}说：「掌门，隔壁老王买那只票赚了两成，弟子也想跟着买。」',
    options: [
      { text: '跟着买就对了', ok: false },
      { text: '老王啥时候买的、买了好多，你都不晓得', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '老王赚了两成，但他啥时候进的、投了好多，你都不晓得。跟风买，多半接在半山腰。'
  },
  {
    id: 'gq_168', cat: '投资心理', icon: '📰', title: '听消息',
    scene: '弟子{name}说：「掌门，弟子听人说某某票要涨。」掌门问他是哪个说的。他说：「街边上的人。」',
    options: [
      { text: '那就买', ok: false },
      { text: '街边上的消息，等你听到，早就晚咯', ok: true },
      { text: '小心点', ok: false }
    ],
    explain: '街边上传的，等你听到，多半已经晚咯。真有好消息，不会传到街边上。'
  },
  {
    id: 'gq_169', cat: '投资心理', icon: '😤', title: '不服气',
    scene: '弟子{name}亏了钱，说一定要"翻本"，把家底都拿出来接着搏。',
    options: [
      { text: '对，把本翻回来', ok: false },
      { text: '越亏越想翻本，是最容易陷进去的时候', ok: true },
      { text: '再搏一把', ok: false }
    ],
    explain: '越亏越想翻本，这是最危险的时候。停下来歇一口气，比啥子都强。'
  },
  {
    id: 'gq_170', cat: '投资心理', icon: '🎯', title: '止损',
    scene: '弟子{name}手里的东西跌了两成，掌门劝他割掉。他说：「再等等，说不定涨回来。」',
    options: [
      { text: '对，再等等', ok: false },
      { text: '先想好跌到好多就走，别一路往下等', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '买之前就要想好：跌到好多就走。一路往下等，跌起来莫得底。'
  },
  {
    id: 'gq_171', cat: '投资心理', icon: '🪞', title: '照镜子',
    scene: '弟子{name}赚了钱，觉得自己本事大。掌门让他看看到底是本事还是运气。',
    options: [
      { text: '肯定是本事', ok: false },
      { text: '行情好的时候，谁都能赚；要看行情差的时候', ok: true },
      { text: '看个人', ok: false }
    ],
    explain: '行情好的时候，谁都能赚。要看行情差的时候还赚不赚得到，才晓得是不是真本事。'
  },
  {
    id: 'gq_172', cat: '投资心理', icon: '⏸️', title: '空仓',
    scene: '弟子{name}说：「掌门，弟子手里莫得票的时候，心头慌得很，总觉得错过了啥子。」',
    options: [
      { text: '那就随便买点', ok: false },
      { text: '空仓也是一种状态，看不清楚的时候，不买就是最好的选择', ok: true },
      { text: '多买点就不慌了', ok: false }
    ],
    explain: '手里空着，心头不慌才对。看不清楚的时候，不买就是最好的选择。'
  },
  {
    id: 'gq_173', cat: '投资心理', icon: '📝', title: '记笔记',
    scene: '弟子{name}买卖了好几年，问掌门咋个才能长进。',
    options: [
      { text: '多做几次就熟了', ok: false },
      { text: '把每次买卖的理由记下来，隔段时间回头看', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '把每次买卖的理由记下来，过段时间回头看。对的在哪、错的在哪，自己就清楚了。'
  },
  {
    id: 'gq_174', cat: '投资心理', icon: '👥', title: '跟风',
    scene: '弟子{name}说：「掌门，街上都在买那只票，肯定有道理。」',
    options: [
      { text: '那赶紧买', ok: false },
      { text: '人多的地方，往往是价贵的地方', ok: true },
      { text: '看看再说', ok: false }
    ],
    explain: '人多的地方，价往往贵。等你跟进去，就是接盘的那个。'
  },
  {
    id: 'gq_175', cat: '投资心理', icon: '🧠', title: '理性',
    scene: '弟子{name}说：「掌门，弟子一看到红柱子就忍不住想买，一看到绿柱子就想卖。」',
    options: [
      { text: '这是本能', ok: false },
      { text: '这是本能，但买卖要动脑子，不能跟着感觉走', ok: true },
      { text: '跟着感觉走就对了', ok: false }
    ],
    explain: '看到红的想买、看到绿的想卖，是人人都有的本能。但买卖要动脑子，不能跟着感觉走。'
  },
  {
    id: 'gq_176', cat: '投资心理', icon: '📊', title: '风险偏好',
    scene: '弟子{name}问掌门，他适合买啥子样的东西。',
    options: [
      { text: '买涨得凶的', ok: false },
      { text: '先看你睡得着觉不：亏好多你会失眠，就买比那更稳的', ok: true },
      { text: '买别个推荐的', ok: false }
    ],
    explain: '先看自己：亏好多会睡不着？买比这个更稳的，才扛得住波动。'
  },
  {
    id: 'gq_177', cat: '投资心理', icon: '⏳', title: '耐心',
    scene: '弟子{name}买了三个月没动，急得团团转。掌门问他要不要换成别个。',
    options: [
      { text: '赶紧换', ok: false },
      { text: '好的东西要拿得住，天天换只会越换越差', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '好东西要拿得住。天天换，光手续费就够你受的，还越换越差。'
  },
  {
    id: 'gq_178', cat: '投资心理', icon: '🎓', title: '学费',
    scene: '弟子{name}刚入市就亏了一笔，很沮丧。掌门安慰他。',
    options: [
      { text: '不干了', ok: false },
      { text: '这一笔叫学费，学到东西，就不亏', ok: true },
      { text: '再搏一把翻回来', ok: false }
    ],
    explain: '刚入市亏的一笔，叫学费。学到东西，就不亏。学不到，才是真亏。'
  },
  {
    id: 'gq_179', cat: '投资心理', icon: '🌊', title: '潮水',
    scene: '弟子{name}说：「掌门，涨潮的时候大家都赚钱，退潮的时候才看得到哪个没穿裤子。」',
    options: [
      { text: '说得对', ok: false },
      { text: '就是这个理——涨潮谁都能赚，退潮才见真章', ok: true },
      { text: '太悲观了', ok: false }
    ],
    explain: '潮水涨的时候，谁都能赚。退潮的时候，才看得到哪个是真有本事，哪个是光起屁股。'
  },
  {
    id: 'gq_180', cat: '投资心理', icon: '🎭', title: '贪婪与恐惧',
    scene: '弟子{name}说：「掌门，弟子发现一件事：别人怕的时候弟子也怕，别人贪的时候弟子也贪。」',
    options: [
      { text: '这是正常的', ok: false },
      { text: '跟别个反着来，多半才对', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '大家都怕的时候，往往是机会；大家都贪的时候，往往是顶。跟别个反着来，多半才对。'
  },

  // ===== 宏观（续）=====
  {
    id: 'gq_181', cat: '宏观', icon: '🌐', title: '贸易战',
    scene: '弟子{name}听人说海外跟我们打「贸易战」，问掌门这是啥子。',
    options: [
      { text: '是打仗', ok: false },
      { text: '是两边互相加税，做买卖的都吃亏', ok: true },
      { text: '是打官司', ok: false }
    ],
    explain: '贸易战就是两边互相加税，做买卖的都吃亏。最后买菜的老百姓也要多花钱。'
  },
  {
    id: 'gq_182', cat: '宏观', icon: '📉', title: '通缩',
    scene: '弟子{name}说：「掌门，最近啥子东西都在降价，这不是好事嘛？」',
    options: [
      { text: '是天大的好事', ok: false },
      { text: '东西一直降价，说明买卖不景气，反而难办', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '东西一直降价，看着是好事，其实是买卖不景气。大家都不买，商号就关门，人就没得活干。'
  },
  {
    id: 'gq_183', cat: '宏观', icon: '🏭', title: 'PMI',
    scene: '弟子{name}听人说什么「PMI」，问掌门这是啥子。',
    options: [
      { text: '是个人名', ok: false },
      { text: '是采购经理指数——看买卖景气不景气，五十为界', ok: true },
      { text: '是税', ok: false }
    ],
    explain: 'PMI 是问各家做买卖的，看他们觉得景气不景气。五十以上是兴旺，以下是冷清。'
  },
  {
    id: 'gq_184', cat: '宏观', icon: '🌾', title: 'PPI',
    scene: '弟子{name}听人说「PPI」涨了，问掌门这是啥子意思。',
    options: [
      { text: '是粮价', ok: false },
      { text: '是工厂出货的价钱，涨了说明成本在涨', ok: true },
      { text: '是股市', ok: false }
    ],
    explain: 'PPI 是工厂出货的价钱。这个数一涨，说明厂里的成本在涨，后头多半要传到菜价上去。'
  },
  {
    id: 'gq_185', cat: '宏观', icon: '💵', title: '外汇储备',
    scene: '弟子{name}听说朝廷有一大笔「外汇储备」，问掌门这是干啥子的。',
    options: [
      { text: '是朝廷的金库', ok: false },
      { text: '是朝廷存的海外钱，用来稳汇率、付账', ok: true },
      { text: '是给官家花的', ok: false }
    ],
    explain: '外汇储备是朝廷存的海外钱。用来稳汇率、付海外的账，碰到大事的时候顶用。'
  },
  {
    id: 'gq_186', cat: '宏观', icon: '🏛️', title: '央行',
    scene: '弟子{name}问：「掌门，都说朝廷里头有个『央行』，它跟寻常钱庄有啥子不一样？」',
    options: [
      { text: '一样的', ok: false },
      { text: '央行是钱庄的钱庄，管印钱、定利息', ok: true },
      { text: '是官家开的钱庄', ok: false }
    ],
    explain: '央行是钱庄的钱庄，管印钱、定利息，管到所有的钱庄。它一动，全城都要动。'
  },
  {
    id: 'gq_187', cat: '宏观', icon: '📊', title: '利率',
    scene: '弟子{name}说：「掌门，弟子听说朝廷要把利息降一点，这跟弟子有啥子关系？」',
    options: [
      { text: '莫得关系', ok: false },
      { text: '降息了，存钱利钱少，借钱便宜，房子可能涨', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '降息了，存钱的利钱变少，借钱的便宜。买房、做买卖的人更容易借到钱。'
  },
  {
    id: 'gq_188', cat: '宏观', icon: '🌊', title: '逆周期',
    scene: '弟子{name}听人说朝廷在「逆周期调节」，问掌门这是啥子。',
    options: [
      { text: '是逆着来', ok: false },
      { text: '是买卖热的时候收一收，冷的时候放一放', ok: true },
      { text: '是看运气', ok: false }
    ],
    explain: '逆周期就是买卖太热的时候收一收，太冷的时候放一放，让日子走得稳些。'
  },
  {
    id: 'gq_189', cat: '宏观', icon: '📜', title: '两会',
    scene: '弟子{name}听人说朝廷每年开「两会」，问掌门那是不是商量国事的。',
    options: [
      { text: '不是', ok: false },
      { text: '是，商量国事，定下一年的方向', ok: true },
      { text: '是走个过场', ok: false }
    ],
    explain: '两会就是朝廷商量国事，定下一年的方向。出来的时候，多少会影响买卖。'
  },
  {
    id: 'gq_190', cat: '宏观', icon: '🌾', title: '粮食',
    scene: '弟子{name}问：「掌门，朝廷为啥子这么看重粮食？」',
    options: [
      { text: '粮食好吃', ok: false },
      { text: '粮食是根基，粮价一乱，啥子都要跟着乱', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '粮食是根基。粮价一乱，菜价、肉价、工钱全都要跟着乱，所以朝廷死死盯住。'
  },

  // ===== 股票（再续）=====
  {
    id: 'gq_191', cat: '股票', icon: '🎯', title: '涨跌停',
    scene: '弟子{name}问：「掌门，为啥子有时候一只票一天最多只动一成，有时候又能动两成？」',
    options: [
      { text: '没区别', ok: false },
      { text: '主板一成，创业板、科创板两成，看是哪种', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '主板一天最多动一成，创业板和科创板动两成。ST 的动半成。'
  },
  {
    id: 'gq_192', cat: '股票', icon: '💼', title: '券商',
    scene: '弟子{name}问：「掌门，弟子要买票，找哪个？」',
    options: [
      { text: '找钱庄', ok: false },
      { text: '找券商——是专门做这个的场子', ok: true },
      { text: '找衙门', ok: false }
    ],
    explain: '买票要找券商，是专门做这个的场子。钱庄多半只做存贷，不做这个。'
  },
  {
    id: 'gq_193', cat: '股票', icon: '📊', title: 'K 线',
    scene: '弟子{name}问：「掌门，墙上那根红红绿绿的柱子，到底看啥子？」',
    options: [
      { text: '看颜色就够了', ok: false },
      { text: '看四样：开盘、收盘、最高、最低', ok: true },
      { text: '看长短', ok: false }
    ],
    explain: '一根 K 线，看四样：开盘的价、收盘的价、当天最高的价、当天最低的价。'
  },
  {
    id: 'gq_194', cat: '股票', icon: '🚀', title: '庄家',
    scene: '弟子{name}问：「掌门，听说有『庄家』，庄家是啥子？」',
    options: [
      { text: '是做庄的', ok: false },
      { text: '是手里票多、能翻手为云的大户', ok: true },
      { text: '是官家', ok: false }
    ],
    explain: '庄家就是手里票多的大户，一买一卖都能带动行情。散户斗不过，莫跟到赌。'
  },
  {
    id: 'gq_195', cat: '股票', icon: '🛒', title: '打新',
    scene: '弟子{name}听说申购新上市商号的票能赚，问掌门咋个弄。',
    options: [
      { text: '随便申', ok: false },
      { text: '打新要有老票垫底，中不中要看运气', ok: true },
      { text: '是骗局', ok: false }
    ],
    explain: '打新就是申购新上市的票。要有老票垫底，中不中看运气。中了多半赚，也可能亏。'
  },
  {
    id: 'gq_196', cat: '股票', icon: '💵', title: '送股',
    scene: '弟子{name}手里的商号送股了，弟子高兴得跳。掌门让他先看一眼股价。',
    options: [
      { text: '送股就是白赚', ok: false },
      { text: '送股后股价要下调，总资产没变', ok: true },
      { text: '赚大了', ok: false }
    ],
    explain: '送股之后股价要相应下调。你手里的股数多了，但每一股便宜了，总资产没变。'
  },
  {
    id: 'gq_197', cat: '股票', icon: '🏛️', title: '增发',
    scene: '弟子{name}手里的商号说要「增发新股」，问掌门这是好事还是坏事。',
    options: [
      { text: '是好事', ok: false },
      { text: '是商号再拿股票换钱，股本变大，对老股东多半是摊薄', ok: true },
      { text: '是坏事', ok: false }
    ],
    explain: '增发就是商号再拿股票换钱。股本大了，老股东手里的股占比就变小，多半是摊薄。'
  },
  {
    id: 'gq_198', cat: '股票', icon: '🛡️', title: '退市',
    scene: '弟子{name}的票突然说「退市」，弟子慌了，问掌门钱还能不能拿回来。',
    options: [
      { text: '一分不剩', ok: false },
      { text: '会先摘牌，之后进老三板交易，多半拿不回本钱', ok: true },
      { text: '能全退', ok: false }
    ],
    explain: '退市是摘下牌子，之后进老三板慢慢交易。多半拿不回本钱，所以要躲开风险大的票。'
  },
  {
    id: 'gq_199', cat: '股票', icon: '💰', title: '股息率',
    scene: '弟子{name}问：「掌门，咋个看一只票分不分得划算？」',
    options: [
      { text: '看分红多少', ok: false },
      { text: '算股息率——每股分红除以股价', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '股息率是每股分红除以股价。这个数越高，说明分红相对股价越划算。'
  },
  {
    id: 'gq_200', cat: '股票', icon: '🔍', title: '基本面',
    scene: '弟子{name}问掌门：「买票到底看啥子？」',
    options: [
      { text: '看行情', ok: false },
      { text: '先看商号的底子——赚不赚钱、欠不欠债', ok: true },
      { text: '看别人买啥子', ok: false }
    ],
    explain: '买票要先看商号的底子：赚不赚钱、欠不欠债、有没有前途。这叫基本面。'
  },

  // ===== 基金（再续）=====
  {
    id: 'gq_201', cat: '基金', icon: '🏦', title: '托管',
    scene: '弟子{name}问：「掌门，弟子把钱交给基金打理，万一他跑路了咋个办？」',
    options: [
      { text: '只能认倒霉', ok: false },
      { text: '钱由第三方托管，基金公司动不了', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '基金的钱由第三方托管，基金管理的人只动得了投资，动不了你的本金。跑了也没用。'
  },
  {
    id: 'gq_202', cat: '基金', icon: '📊', title: '风格',
    scene: '弟子{name}问：「掌门，弟子看两只基金，名字都差不多，为啥子涨跌差这么多？」',
    options: [
      { text: '一样的', ok: false },
      { text: '看它买的是啥——价值风格、成长风格，走的不是一条路', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '基金看它买啥子。有的买稳当的大商号，有的买冒尖的新商号。走的不是一条路。'
  },
  {
    id: 'gq_203', cat: '基金', icon: '💰', title: '分红方式',
    scene: '弟子{name}的基金分红，钱庄问他要「现金分红」还是「红利再投」，弟子不懂。',
    options: [
      { text: '随便选', ok: false },
      { text: '要现钱用就选现金，想接着赚就选再投', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '现金分红是拿现钱，红利再投是拿去买更多份额。要用钱就选现金，想接着赚就选再投。'
  },
  {
    id: 'gq_204', cat: '基金', icon: '🎯', title: '主动被动',
    scene: '弟子{name}问：「掌门，主动基金和被动基金有啥子区别？」',
    options: [
      { text: '一样的', ok: false },
      { text: '主动的靠人挑，被动的跟到指数走', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '主动基金靠人挑票，想跑赢大盘。被动基金跟到指数走，不求跑赢，只求跟得上。'
  },
  {
    id: 'gq_205', cat: '基金', icon: '📈', title: '牛市熊市',
    scene: '弟子{name}问：「掌门，啥子叫牛市啥子叫熊市？」',
    options: [
      { text: '看动物', ok: false },
      { text: '一直涨的叫牛市，一直跌的叫熊市', ok: true },
      { text: '看天气', ok: false }
    ],
    explain: '一直涨的行情叫牛市，一直跌的叫熊市。牛往顶上顶，熊往底下扑。'
  },
  {
    id: 'gq_206', cat: '基金', icon: '🔄', title: '定投频率',
    scene: '弟子{name}问：「掌门，定投是每个月投好，还是每周投好？」',
    options: [
      { text: '随便', ok: false },
      { text: '按月按周都行，关键是长期不断', ok: true },
      { text: '看行情', ok: false }
    ],
    explain: '按月按周都行，差别不大。关键是长期坚持，断了就莫得意思咯。'
  },
  {
    id: 'gq_207', cat: '基金', icon: '🏢', title: '基金公司',
    scene: '弟子{name}问：「掌门，选基金要不要看哪家基金公司？」',
    options: [
      { text: '不用看', ok: false },
      { text: '要看——大公司、老团队，多半更稳当', ok: true },
      { text: '看名字好不好听', ok: false }
    ],
    explain: '基金公司要看：大不大、老不老、团队稳不稳。名不见经传的，多留个心眼。'
  },
  {
    id: 'gq_208', cat: '基金', icon: '💼', title: 'FOF',
    scene: '弟子{name}看到一只基金叫「FOF」，问掌门这是啥子。',
    options: [
      { text: '是外国人', ok: false },
      { text: '是"基金中的基金"——它不买票，买别的基金', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: 'FOF 是拿钱去买别的基金，层层分散。好处是稳，坏处是费用叠了两层。'
  },
  {
    id: 'gq_209', cat: '基金', icon: '📉', title: '赎回费',
    scene: '弟子{name}买基金才半个月就想赎，一看赎回费贵得吓人。',
    options: [
      { text: '是钱庄黑', ok: false },
      { text: '赎回费按持的时间算，持得越短越贵', ok: true },
      { text: '是算错了', ok: false }
    ],
    explain: '赎回费按持的时间算：持得越短越贵，持得越久越便宜。逼你拿久点。'
  },
  {
    id: 'gq_210', cat: '基金', icon: '🧮', title: '仓位',
    scene: '弟子{name}问：「掌门，弟子买了基金，是不是把钱全压上去最好？」',
    options: [
      { text: '全压上', ok: false },
      { text: '分批进去，留点余地，才扛得住波动', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '钱一次全压上去，跌了就没子弹咯。分批进去，留点余地，才扛得住。'
  },

  // ===== 债券（再续）=====
  {
    id: 'gq_211', cat: '债券', icon: '🏛️', title: '地方政府债',
    scene: '弟子{name}听说州府也发债，问掌门跟朝廷的债有啥子区别。',
    options: [
      { text: '一样的', ok: false },
      { text: '州府的债也是朝廷背书，但等级比国债低一点', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '州府的债也有朝廷背书，但等级比国债低一点，利钱也高一点。'
  },
  {
    id: 'gq_212', cat: '债券', icon: '⚖️', title: '违约',
    scene: '弟子{name}手里一张商号的债，到期没还上，问掌门咋个办。',
    options: [
      { text: '算了', ok: false },
      { text: '这叫违约——可以走衙门，但多半追不回来多少', ok: true },
      { text: '莫得办法', ok: false }
    ],
    explain: '到期没还上叫违约。可以走衙门追，但多半追不回多少。买之前要看商号的底子。'
  },
  {
    id: 'gq_213', cat: '债券', icon: '🔄', title: '债基',
    scene: '弟子{name}问：「掌门，弟子不想一张一张买债，有没有简单点的法子？」',
    options: [
      { text: '莫得', ok: false },
      { text: '有，买债券基金，一篮子债一次搞定', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '买债券基金就是一篮子债一次搞定。省事，风险也散开了。'
  },
  {
    id: 'gq_214', cat: '债券', icon: '📊', title: '短债长债',
    scene: '弟子{name}问：「掌门，债也有长短之分？」',
    options: [
      { text: '没区别', ok: false },
      { text: '有——短债稳当，长债利钱高但波动大', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '短债稳当，利钱少。长债利钱高，但利钱一动，价就动得凶。'
  },
  {
    id: 'gq_215', cat: '债券', icon: '🌐', title: '美元债',
    scene: '弟子{name}听说有商号发「美元债」，问掌门这是啥子。',
    options: [
      { text: '是骗人的', ok: false },
      { text: '是拿美元借的债，还要担汇率的风险', ok: true },
      { text: '跟我们莫得关系', ok: false }
    ],
    explain: '美元债是拿美元借的。利钱可能高些，但汇率一波动，赚的亏的都放大。'
  },
  {
    id: 'gq_216', cat: '债券', icon: '📈', title: '债牛',
    scene: '弟子{name}听说「债牛」来了，问掌门这是啥子。',
    options: [
      { text: '是牛的牛市', ok: false },
      { text: '是债的行情好——利钱在跌，债在涨', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '债牛就是利钱在跌，债价在涨。跟股牛一样，都是行情好的意思。'
  },
  {
    id: 'gq_217', cat: '债券', icon: '💰', title: '利钱',
    scene: '弟子{name}问：「掌门，债的利钱是从哪来的？」',
    options: [
      { text: '天上掉的', ok: false },
      { text: '是借债的人付的——他借了你的钱，就要付利钱', ok: true },
      { text: '是朝廷发的', ok: false }
    ],
    explain: '债的利钱是借债的人付的。他借了你的钱去用，就要按约定付你利钱。'
  },
  {
    id: 'gq_218', cat: '债券', icon: '🏦', title: '债评级',
    scene: '弟子{name}手里一张债，听说评级被下调了，问掌门要不要慌。',
    options: [
      { text: '不用慌', ok: false },
      { text: '要慌——评级下调说明还钱的风险大了', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '评级下调说明它还钱的风险大了。手里有这种债，要多留个心眼。'
  },

  // ===== 反诈（再续）=====
  {
    id: 'gq_219', cat: '反诈', icon: '💳', title: '套现',
    scene: '弟子{name}被人拉去「帮忙套现」，说只要刷一下卡，就能拿一笔好处。',
    options: [
      { text: '这钱好赚', ok: false },
      { text: '是违法的——套现可能被用来洗钱', ok: true },
      { text: '小玩一下', ok: false }
    ],
    explain: '套现是违法的，还可能被用来洗钱。刷了这一次，往后麻烦跟着来。'
  },
  {
    id: 'gq_220', cat: '反诈', icon: '🏧', title: '假 ATM',
    scene: '弟子{name}在一处偏僻地方取钱，发现机器怪怪的，插卡的地方比寻常多出一块。',
    options: [
      { text: '照用不误', ok: false },
      { text: '可能是改过的机器，赶紧走，换一处取', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '插卡口多出一块，可能是骗子装的东西，专门偷卡的信息。换一处取。'
  },
  {
    id: 'gq_221', cat: '反诈', icon: '📱', title: '验证码',
    scene: '弟子{name}接到电话，对方说帮他处理问题，要他念一下刚收到的验证码。',
    options: [
      { text: '念给他', ok: false },
      { text: '验证码是最后一道防线，任何人都不念', ok: true },
      { text: '念一半', ok: false }
    ],
    explain: '验证码是最后一道防线。不管对方说他是哪个，验证码都不念。'
  },
  {
    id: 'gq_222', cat: '反诈', icon: '🎁', title: '免费领',
    scene: '弟子{name}看到街边一个摊子，说扫码免费领东西。弟子差点就扫了。',
    options: [
      { text: '扫就扫', ok: false },
      { text: '莫扫——不明来源的码，扫了可能泄露信息', ok: true },
      { text: '小心点', ok: false }
    ],
    explain: '不明来源的码莫扫。贪这几毛的便宜，泄的可能是一辈子的信息。'
  },
  {
    id: 'gq_223', cat: '反诈', icon: '💼', title: '兼职',
    scene: '弟子{name}看到一个兼职，说交押金就能上岗，干得好还能退。',
    options: [
      { text: '交就交', ok: false },
      { text: '正规招工不收押金，先交钱的多半是坑', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '正规招工不收押金。先交钱再上岗的，多半是坑，押金要不回来。'
  },
  {
    id: 'gq_224', cat: '反诈', icon: '🚪', title: '上门推销',
    scene: '弟子{name}家里来了个人，说是来检查天然气的，要进屋看看。',
    options: [
      { text: '让他进', ok: false },
      { text: '先打电话核实，不认得的莫开门', ok: true },
      { text: '看穿着', ok: false }
    ],
    explain: '上门推销、检查的，先打电话核实。不认得的，莫轻易开门。'
  },
  {
    id: 'gq_225', cat: '反诈', icon: '🏆', title: '中奖短信',
    scene: '弟子{name}收到短信，说他中了大奖，点链接填信息就能领。',
    options: [
      { text: '赶紧填', ok: false },
      { text: '是骗局——中奖莫得先填信息的', ok: true },
      { text: '填一半', ok: false }
    ],
    explain: '中奖莫得先填信息的。填了信息，就等着被人拿去骗下一回。'
  },
  {
    id: 'gq_226', cat: '反诈', icon: '💊', title: '保健品',
    scene: '弟子{name}的奶奶被人推销一种「神药」，说包治百病。',
    options: [
      { text: '买给奶奶', ok: false },
      { text: '包治百病的都是假的，带奶奶看正经医生', ok: true },
      { text: '试试也无妨', ok: false }
    ],
    explain: '包治百病的都是假的。钱花了是小事，耽误看病才是大事。带奶奶去看正经医生。'
  },

  // ===== 基础理财（再续）=====
  {
    id: 'gq_227', cat: '基础理财', icon: '🎯', title: '财务自由',
    scene: '弟子{name}问：「掌门，大家都说『财务自由』，那到底是啥子？」',
    options: [
      { text: '是有好多钱', ok: false },
      { text: '是不用为吃饭去干活——被动收入盖得住日常开支', ok: true },
      { text: '是不上班', ok: false }
    ],
    explain: '财务自由不是钱好多，是每天挣的被动收入盖得住日常开支，不用为吃饭去干活。'
  },
  {
    id: 'gq_228', cat: '基础理财', icon: '📚', title: '学习',
    scene: '弟子{name}问：「掌门，弟子莫得钱，想学理财，从哪儿开始？」',
    options: [
      { text: '等有钱再说', ok: false },
      { text: '先学记账，把日常收支搞明白', ok: true },
      { text: '先买本股市书', ok: false }
    ],
    explain: '没钱也能学。先学记账，搞明白自己钱跑哪去了，这是第一步。'
  },
  {
    id: 'gq_229', cat: '基础理财', icon: '💼', title: '风险',
    scene: '弟子{name}问：「掌门，弟子不想担风险，能不能只赚不亏？」',
    options: [
      { text: '可以', ok: false },
      { text: '莫得——想有收益就有风险，天下莫得白赚的事', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '想有收益就有风险。跟你说稳赚不赔的，多半是盯到你的本钱。'
  },
  {
    id: 'gq_230', cat: '基础理财', icon: '📊', title: '资产配置',
    scene: '弟子{name}问：「掌门，弟子有点毛，全买一种好不？」',
    options: [
      { text: '全买一种', ok: false },
      { text: '分成几份，稳的、活的、搏的各放一点', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '分成几份：稳的、活的、搏的各放一点。一种全压，跌了就莫得退路。'
  },
  {
    id: 'gq_231', cat: '基础理财', icon: '💰', title: '记账',
    scene: '弟子{name}问：「掌门，弟子记了三个月账，可还是不攒钱，问题在哪？」',
    options: [
      { text: '记账莫得用', ok: false },
      { text: '记完要回头看——哪几笔不该花，下个月改', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '记账不是记完就算，要回头看。看到哪几笔不该花，下个月改，才叫记账。'
  },
  {
    id: 'gq_232', cat: '基础理财', icon: '🎯', title: '遗产',
    scene: '弟子{name}问：「掌门，弟子有点家底，想给娃儿留点，咋个留最稳当？」',
    options: [
      { text: '全留现钱', ok: false },
      { text: '立个遗嘱，免得后人扯皮', ok: true },
      { text: '随便', ok: false }
    ],
    explain: '家底想留给后人，先立个遗嘱。免得老人一走，家里为这点东西扯皮。'
  },

  // ===== 银行存款（再续）=====
  {
    id: 'gq_233', cat: '银行存款', icon: '🏦', title: '大额存单门槛',
    scene: '弟子{name}听说大额存单利钱高，跑去买，人家说他钱不够。',
    options: [
      { text: '钱庄小气', ok: false },
      { text: '大额存单有门槛，一般要二十万毛起', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '大额存单门槛高，一般二十万毛起。够得着就买，够不着就买寻常定期的。'
  },
  {
    id: 'gq_234', cat: '银行存款', icon: '💧', title: '存款利息',
    scene: '弟子{name}问：「掌门，钱庄的利钱，为啥子比借钱的少那么多？」',
    options: [
      { text: '是钱庄贪心', ok: false },
      { text: '钱庄借钱庄的钱，转手借给别人，赚的就是这个差', ok: true },
      { text: '是算错了', ok: false }
    ],
    explain: '钱庄借你的钱利钱低，转手借给别人利钱高，赚的就是这个差。'
  },
  {
    id: 'gq_235', cat: '银行存款', icon: '🏛️', title: '国债',
    scene: '弟子{name}听说买国债最稳，问掌门咋个买。',
    options: [
      { text: '买不到', ok: false },
      { text: '钱庄就能买，门槛低，利钱比定存高点', ok: true },
      { text: '要去京城', ok: false }
    ],
    explain: '国债在钱庄就能买，门槛低，利钱比寻常定存高一点。稳当，适合不想操心的。'
  },
  {
    id: 'gq_236', cat: '银行存款', icon: '💰', title: '定期利率',
    scene: '弟子{name}问：「掌门，为啥子存三年、五年，利钱反而一样？」',
    options: [
      { text: '是钱庄黑', ok: false },
      { text: '钱庄也得算自己赚不赚——利钱是各方博弈出来的', ok: true },
      { text: '是算错了', ok: false }
    ],
    explain: '钱庄也得算自己赚不赚。三年五年利钱一样，说明钱庄觉得长期利钱涨不上去。'
  },
  {
    id: 'gq_237', cat: '银行存款', icon: '📋', title: '结构性存款',
    scene: '弟子{name}问：「掌门，为啥子结构性存款有时候利钱特别高，有时候又特别低？」',
    options: [
      { text: '是钱庄骗人', ok: false },
      { text: '因为它挂钩某样东西——那样东西好它就高，不好就低', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '结构性存款挂钩某样东西，那样东西好，它利钱就高；那样东西差，它利钱就低。'
  },

  // ===== 保险（再续）=====
  {
    id: 'gq_238', cat: '保险', icon: '💊', title: '重疾险保额',
    scene: '弟子{name}问：「掌门，重疾险该买好大的保额？」',
    options: [
      { text: '随便', ok: false },
      { text: '按你治病、养家要好多来算，一般三年收入', ok: true },
      { text: '越多越好', ok: false }
    ],
    explain: '重疾险保额按你治病、养家要好多来算。一般三年收入，够治病也够养家。'
  },
  {
    id: 'gq_239', cat: '保险', icon: '👴', title: '给老人买',
    scene: '弟子{name}想给爹买重疾险，人家说年纪大了不好买。弟子不解。',
    options: [
      { text: '是人家耍赖', ok: false },
      { text: '年纪越大，生病风险越高，保费就贵，还可能不给保', ok: true },
      { text: '是弟子钱少', ok: false }
    ],
    explain: '年纪越大，生病风险越高，保费就贵，有的直接不给保。保险要趁早买。'
  },
  {
    id: 'gq_240', cat: '保险', icon: '👶', title: '给娃买',
    scene: '弟子{name}问：「掌门，弟子的娃儿，该先买哪样保险？」',
    options: [
      { text: '随便', ok: false },
      { text: '先意外、再医疗、再重疾，按这个顺序来', ok: true },
      { text: '先买贵的', ok: false }
    ],
    explain: '给娃买保险，按顺序：先意外、再医疗、再重疾。钱不够就按这个来。'
  },
  {
    id: 'gq_241', cat: '保险', icon: '🚗', title: '车险',
    scene: '弟子{name}买了辆车，问掌门车险该咋个买。',
    options: [
      { text: '只买最便宜的', ok: false },
      { text: '交强险必买，商业险看情况——第三者、车损是大头', ok: true },
      { text: '随便', ok: false }
    ],
    explain: '交强险是官家定的，必买。商业险里，第三者责任险和车损险最重要。'
  },
  {
    id: 'gq_242', cat: '保险', icon: '📋', title: '保险合同',
    scene: '弟子{name}买保险，人家给他一本厚厚的合同，他不想看。',
    options: [
      { text: '不用看', ok: false },
      { text: '要看——特别是"保啥子"和"不保啥子"两段', ok: true },
      { text: '让别个看', ok: false }
    ],
    explain: '合同里最要紧的是"保啥子"和"不保啥子"。这两段不看，买了也白买。'
  },

  // ===== 房产税务（再续）=====
  {
    id: 'gq_243', cat: '房产税务', icon: '🏠', title: '租房',
    scene: '弟子{name}想租房，问掌门签合同要注意啥子。',
    options: [
      { text: '随便签', ok: false },
      { text: '要看租期、押金、违约条款，白纸黑字', ok: true },
      { text: '口头说好就行', ok: false }
    ],
    explain: '租房要白纸黑字写清楚：租期、押金、违约咋办。口头说的，翻脸就不认。'
  },
  {
    id: 'gq_244', cat: '房产税务', icon: '🏛️', title: '房产税',
    scene: '弟子{name}听说朝廷要开征「房产税」，问掌门这是啥子。',
    options: [
      { text: '是买房交的税', ok: false },
      { text: '是持有房子每年要交的税，目前只在少数地方试点', ok: true },
      { text: '是谣言', ok: false }
    ],
    explain: '房产税是持有房子每年要交的税。跟买房时交的契税不一样。目前只在少数地方试点。'
  },
  {
    id: 'gq_245', cat: '房产税务', icon: '🏠', title: '限购',
    scene: '弟子{name}想买房，人家说他不符合「限购」。弟子不解。',
    options: [
      { text: '是人家耍赖', ok: false },
      { text: '限购是朝廷限制买房的资格——户口、社保这些', ok: true },
      { text: '是弟子的钱不够', ok: false }
    ],
    explain: '限购是朝廷限制买房的资格。户口、社保交了好多年、名下有几套房，都要看。'
  },
  {
    id: 'gq_246', cat: '房产税务', icon: '💰', title: '公积金',
    scene: '弟子{name}问：「掌门，弟子每个月的工钱被扣了一笔『公积金』，这是干啥子的？」',
    options: [
      { text: '是税', ok: false },
      { text: '是给你存着买房、租房的，你自己也能用', ok: true },
      { text: '是白扣的', ok: false }
    ],
    explain: '公积金是给你存着买房、租房用的。你自己一份、东家一份，都是你的。'
  },
  {
    id: 'gq_247', cat: '房产税务', icon: '📜', title: '购房合同',
    scene: '弟子{name}买房，要签一摞合同，看得头昏。掌门问他看没看交房日期和违约条款。',
    options: [
      { text: '没看', ok: false },
      { text: '要细看交房日期、违约条款、面积差异这些', ok: true },
      { text: '看名字就行', ok: false }
    ],
    explain: '买房合同要细看：啥时候交房、违约咋办、面积多了少了好多算。这几样最容易扯皮。'
  },
  {
    id: 'gq_248', cat: '房产税务', icon: '🏦', title: 'LPR 加点',
    scene: '弟子{name}问：「掌门，弟子听说房贷是『LPR 加点』，那个点能不能改？」',
    options: [
      { text: '能随便改', ok: false },
      { text: 'LPR 会动，加点部分一般签了就不变', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: 'LPR 会跟着行情动，加点那部分一般签了就不变。签的时候要多比较几家。'
  },
  {
    id: 'gq_249', cat: '房产税务', icon: '🏛️', title: '二手房',
    scene: '弟子{name}想买二手房，问掌门要注意啥子。',
    options: [
      { text: '看价钱就行', ok: false },
      { text: '要看房本清不清楚、有没有抵押、税费谁出', ok: true },
      { text: '看装修', ok: false }
    ],
    explain: '二手房要看三样：房本清不清楚、有没有抵押、税费谁出。装修是次要的。'
  },
  {
    id: 'gq_250', cat: '房产税务', icon: '💰', title: '以租养贷',
    scene: '弟子{name}想借钱买套房，租出去用租金还贷。问掌门这个想法行不行。',
    options: [
      { text: '肯定行', ok: false },
      { text: '要看租得起好多、贷得起好多，两头差太远就危险', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '以租养贷要看租金够不够还贷。租金够不上月供，就得自己补，缺口大了要出事。'
  },

  // ===== 基础理财（收尾）=====
  {
    id: 'gq_251', cat: '基础理财', icon: '💰', title: '借钱给亲戚',
    scene: '弟子{name}的舅舅来借钱，说好三个月还，可弟子听说他爱赌。弟子拿不定主意。',
    options: [
      { text: '亲戚一场，借', ok: false },
      { text: '沾赌的钱，借出去多半回不来，要慎重', ok: true },
      { text: '借一半', ok: false }
    ],
    explain: '沾赌的钱，借出去多半肉包子打狗。亲戚一场，也要看他还得上不。'
  },
  {
    id: 'gq_252', cat: '基础理财', icon: '🎯', title: '先还债还是先投资',
    scene: '弟子{name}手里有点毛，又想还债，又想拿去搏一搏。问掌门先做哪个。',
    options: [
      { text: '先搏，赚了再还', ok: false },
      { text: '先还债——还债的"收益"是省下的利息，最稳当', ok: true },
      { text: '各分一半', ok: false }
    ],
    explain: '先还债。还债省的利钱，是最稳的收益，比搏一把把稳。'
  },
  {
    id: 'gq_253', cat: '基础理财', icon: '📊', title: '赚多少够',
    scene: '弟子{name}问：「掌门，弟子做买卖，赚好多才叫够？」',
    options: [
      { text: '越多越好', ok: false },
      { text: '要能盖过物价涨幅，还能有点剩下，才算够', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '赚的钱，先要盖过物价涨的那部分。剩下来的，才叫真赚的。'
  },
  {
    id: 'gq_254', cat: '基础理财', icon: '📚', title: '学不会',
    scene: '弟子{name}说：「掌门，弟子愚钝，学不会理财。」',
    options: [
      { text: '那就算了', ok: false },
      { text: '先学一件事：不乱花。别的慢慢来', ok: true },
      { text: '看天赋', ok: false }
    ],
    explain: '学不会深的不要紧。先学一件事：不乱花。光这一点，就够用了。'
  },
  {
    id: 'gq_255', cat: '基础理财', icon: '🏆', title: '财富观',
    scene: '弟子{name}问：「掌门，弟子到底该咋个看钱？」',
    options: [
      { text: '钱越多越好', ok: false },
      { text: '钱是手段不是目的——是为过日子，不是日子为钱', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '钱是手段，不是目的。是为了过日子过得舒服，不是把日子过成攒钱。'

  },

  // ===== 银行存款（收尾）=====
  {
    id: 'gq_256', cat: '银行存款', icon: '🏦', title: '三张存单',
    scene: '弟子{name}问：「掌门，弟子有一笔毛，该一次存三年，还是分成三张存？」',
    options: [
      { text: '一次存三年', ok: false },
      { text: '分成几张，到期时间错开，急用钱时不慌', ok: true },
      { text: '随便', ok: false }
    ],
    explain: '分成几张，到期时间错开。急用钱的时候，取一张就够，别的利息不动。'
  },
  {
    id: 'gq_257', cat: '银行存款', icon: '💰', title: '信用卡',
    scene: '弟子{name}问：「掌门，弟子办了好几张信用卡，这是好事不？」',
    options: [
      { text: '越多越好', ok: false },
      { text: '两三张够用就行，多了容易乱花钱', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '信用卡两三张够用就行。多了，这里刷一点那里刷一点，自己都搞不清花了好多。'
  },
  {
    id: 'gq_258', cat: '银行存款', icon: '💸', title: '存哪里',
    scene: '弟子{name}问：「掌门，钱存哪家钱庄好？」',
    options: [
      { text: '哪家高存哪家', ok: false },
      { text: '大钱庄稳当，小钱庄利钱高，各有各的取舍', ok: true },
      { text: '看名字', ok: false }
    ],
    explain: '大钱庄稳，小钱庄利钱高。要稳就大，要利就小，但小钱庄万一倒了，就只能等存款保险。'
  },
  {
    id: 'gq_259', cat: '银行存款', icon: '📋', title: '存折',
    scene: '弟子{name}问：「掌门，钱庄给的存折，弟子该收好不？」',
    options: [
      { text: '扔了算了', ok: false },
      { text: '收好——上面有账号、密码提示，被人捡到要出事', ok: true },
      { text: '随便放', ok: false }
    ],
    explain: '存折上有账号、密码提示。被人捡到，麻烦跟着来。要收好。'
  },
  {
    id: 'gq_260', cat: '银行存款', icon: '🔐', title: '密码',
    scene: '弟子{name}把存折密码设成生日，掌门让他改。弟子说：「生日好记。」',
    options: [
      { text: '好记就行', ok: false },
      { text: '生日最容易被人猜到，要换个不是生日的', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '生日最好猜。捡到存折的人，第一件事就是试生日。换个不是生日的密码。'
  },

  // ===== 保险（收尾）=====
  {
    id: 'gq_261', cat: '保险', icon: '👴', title: '年金养老',
    scene: '弟子{name}问：「掌门，弟子想老了有点进项，年金险合适不？」',
    options: [
      { text: '肯定合适', ok: false },
      { text: '合适——年金险就是年轻时交钱，老了按月领', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '年金险就是年轻时交钱，老了按月领。长期把稳，但利钱不算高。'
  },
  {
    id: 'gq_262', cat: '保险', icon: '📱', title: '网上买',
    scene: '弟子{name}在网上买保险，比线下便宜。问掌门靠不靠得住。',
    options: [
      { text: '肯定不靠谱', ok: false },
      { text: '网上也能买，但要看清是哪家、保啥子、不保啥子', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '网上买保险也可以。但要看清是哪家的、保啥子、不保啥子。价格低，不等于保障好。'
  },
  {
    id: 'gq_263', cat: '保险', icon: '💊', title: '带病投保',
    scene: '弟子{name}已经有点小毛病，想瞒着买保险。掌门劝他。',
    options: [
      { text: '瞒着买', ok: false },
      { text: '瞒着买，出事人家拒赔，钱也白交', ok: true },
      { text: '先买再说', ok: false }
    ],
    explain: '瞒着买，理赔的时候人家一查病历，可以拒赔。钱白交，出事还赔不到。'
  },
  {
    id: 'gq_264', cat: '保险', icon: '🔄', title: '退保',
    scene: '弟子{name}想退一份保险，人家说只能拿回一点点。弟子问为啥子。',
    options: [
      { text: '是人家耍赖', ok: false },
      { text: '前面几年交的钱，大半是费用，退保只能拿"现金价值"', ok: true },
      { text: '是骗人的', ok: false }
    ],
    explain: '前面几年交的钱，大半是费用。退保只能按现金价值退，比交的少。'
  },
  {
    id: 'gq_265', cat: '保险', icon: '🎁', title: '赠送险',
    scene: '弟子{name}在网上买东西，商家说送一份保险。弟子觉得很划算。',
    options: [
      { text: '白送肯定好', ok: false },
      { text: '要看清送的是啥子，多半是便宜的意外险', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '送的保险多半是便宜的意外险，保额不高。看清是啥子，莫当大事。'
  },

  // ===== 债券（收尾）=====
  {
    id: 'gq_266', cat: '债券', icon: '🏛️', title: '国债逆回购收益',
    scene: '弟子{name}问：「掌门，弟子把钱借出去一夜，咋个算利钱？」',
    options: [
      { text: '看运气', ok: false },
      { text: '按约定的利率算，一般不多，但比活期强', ok: true },
      { text: '跟定期一样', ok: false }
    ],
    explain: '国债逆回购的利钱按约定的利率算。一般不多，但比放活期强，适合短期闲钱。'
  },
  {
    id: 'gq_267', cat: '债券', icon: '📊', title: '债市',
    scene: '弟子{name}问：「掌门，债也有像票那样的买卖场子？」',
    options: [
      { text: '莫得', ok: false },
      { text: '有，债也能在交易所买卖', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '债也能在交易所买卖。你手里的债，随时可以卖给别人。'
  },
  {
    id: 'gq_268', cat: '债券', icon: '💰', title: '买债好时机',
    scene: '弟子{name}问：「掌门，啥子时候买债好？」',
    options: [
      { text: '随便', ok: false },
      { text: '利钱高的时候买债好——将来利钱跌了，债价就涨', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '利钱高的时候买债划得来。将来利钱跌，你手里的债价就涨。'
  },
  {
    id: 'gq_269', cat: '债券', icon: '📉', title: '债券基金跌',
    scene: '弟子{name}买了一只债券基金，跌了几天，慌了。',
    options: [
      { text: '赶紧赎', ok: false },
      { text: '债基跌得少、回升也稳，看长期', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '债基跌起来温和，回升也稳。短期的波动不用慌，看长期。'
  },
  {
    id: 'gq_270', cat: '债券', icon: '🏢', title: '城投债',
    scene: '弟子{name}听说有一种债叫「城投债」，利钱高，问掌门能不能买。',
    options: [
      { text: '利钱高就买', ok: false },
      { text: '城投债是地方融资平台的债，看地方财政和信用，不能光看利钱', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '城投债是地方融资平台发的，看地方的财政和信用。利钱高，风险也大，要看清楚。'
  },

  // ===== 房产税务（收尾）=====
  {
    id: 'gq_271', cat: '房产税务', icon: '🏠', title: '买房时机',
    scene: '弟子{name}问：「掌门，啥子时候买房好？」',
    options: [
      { text: '越低越好', ok: false },
      { text: '看自己需不需要——自己住的，啥时候都行；投机的，要看行情', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '自己住，啥时候都行。投机，要看行情。别把住的地方当赌场。'
  },
  {
    id: 'gq_272', cat: '房产税务', icon: '🏦', title: '提前还贷',
    scene: '弟子{name}手里有点钱，问掌门该不该提前还贷。',
    options: [
      { text: '肯定还', ok: false },
      { text: '看你贷的利钱高不高——利钱高，提前还划算', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '看你贷的利钱高不高。利钱高，提前还省的利息多，划得来。利钱低，不如拿去投资。'
  },
  {
    id: 'gq_273', cat: '房产税务', icon: '💰', title: '房产继承',
    scene: '弟子{name}问：「掌门，爹娘的房子给弟子，要交税不？」',
    options: [
      { text: '要交好多', ok: false },
      { text: '继承一般不用交个税，但办过户有别的费用', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '继承一般不用交个税。过户有别的费用，但跟卖房比，负担小得多。'
  },
  {
    id: 'gq_274', cat: '房产税务', icon: '🏛️', title: '赠与',
    scene: '弟子{name}想把房子过户给娃儿，问掌门是"赠与"好还是"买卖"好。',
    options: [
      { text: '赠与好', ok: false },
      { text: '要看情况——赠与当时便宜，但娃儿将来卖的时候可能要多交税', ok: true },
      { text: '买卖好', ok: false }
    ],
    explain: '赠与当时便宜，但娃儿将来卖的时候，可能要按原价算，多交税。要算长远账。'
  },
  {
    id: 'gq_275', cat: '房产税务', icon: '📋', title: '办证',
    scene: '弟子{name}买了房，懒得去办证，拖了几年。掌门劝他早点去。',
    options: [
      { text: '不急', ok: false },
      { text: '要早办——没办证，房子法律上还不算你的', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '没办证，房子法律上还不算你的。办证要趁早，免得以后扯皮。'
  },

  // ===== 反诈（收尾）=====
  {
    id: 'gq_276', cat: '反诈', icon: '💸', title: '假老板',
    scene: '弟子{name}在一个群里，群主自称是某大商号的老板，带大家投资。',
    options: [
      { text: '跟着投', ok: false },
      { text: '假老板太多了——要核实身份，莫跟着投', ok: true },
      { text: '小心点', ok: false }
    ],
    explain: '网上自称老板的太多了，十有八九是假的。要投，得走正规渠道核实。'
  },
  {
    id: 'gq_277', cat: '反诈', icon: '🏦', title: '假平台',
    scene: '弟子{name}被人拉去一个平台，说能买卖海外的票，利钱很高。',
    options: [
      { text: '投一点试试', ok: false },
      { text: '假平台——正规买卖要走朝廷批的场子', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '正规买卖要走朝廷批的场子。来路不明的平台，进去就是送钱。'
  },
  {
    id: 'gq_278', cat: '反诈', icon: '📞', title: '客服电话',
    scene: '弟子{name}接到电话，说他买的东西有问题，要给他退款，要他报账户。',
    options: [
      { text: '报给他', ok: false },
      { text: '正规退款走原路，不会打电话要账户', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '正规退款走原路，钱会退回到你付款的账户。打电话问你账户的，是骗子。'
  },
  {
    id: 'gq_279', cat: '反诈', icon: '🎁', title: '红包',
    scene: '弟子{name}收到一条信息，说点开就有红包。弟子差点就点了。',
    options: [
      { text: '点开看看', ok: false },
      { text: '不明来源的链接莫点，红包多半是诱饵', ok: true },
      { text: '小心点', ok: false }
    ],
    explain: '不明来源的链接莫点。红包是诱饵，点了可能泄露信息，也可能装上坏东西。'
  },
  {
    id: 'gq_280', cat: '反诈', icon: '💼', title: '假招聘',
    scene: '弟子{name}看到一个招聘，说月钱很高，但要先交培训费。',
    options: [
      { text: '交费上岗', ok: false },
      { text: '正规招聘不收培训费，先交钱的多半是坑', ok: true },
      { text: '试试看', ok: false }
    ],
    explain: '正规招聘不收培训费。先交钱再上岗的，多半是坑，钱交了工作也莫得。'
  },
  {
    id: 'gq_281', cat: '反诈', icon: '🏧', title: '转账',
    scene: '弟子{name}接到"师兄"的消息，说急用钱，让他马上转一笔。',
    options: [
      { text: '赶紧转', ok: false },
      { text: '打回电话亲口问——现在有换脸的骗术', ok: true },
      { text: '先转一半', ok: false }
    ],
    explain: '现在有换脸的骗术，脸和声音都能仿。遇到借钱的，打电话亲口问。'
  },
  {
    id: 'gq_282', cat: '反诈', icon: '💊', title: '神医',
    scene: '弟子{name}村里来了个「神医」，说祖传秘方包治百病。',
    options: [
      { text: '请他看病', ok: false },
      { text: '包治百病的都是骗子，要看正经医生', ok: true },
      { text: '试试也无妨', ok: false }
    ],
    explain: '包治百病的都是骗子。耽误病情才是大事，要看正经医生。'
  },
  {
    id: 'gq_283', cat: '反诈', icon: '📱', title: '钓鱼二维码',
    scene: '弟子{name}停车的时候，看到车上贴了个二维码，说扫码交停车费。',
    options: [
      { text: '扫就扫', ok: false },
      { text: '可能是假的，要看是不是官家的码', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '车上的码可能是假的。要看清是不是官家的码，别随便扫。'
  },

  // ===== 宏观（收尾）=====
  {
    id: 'gq_284', cat: '宏观', icon: '🌏', title: '汇率',
    scene: '弟子{name}问：「掌门，两个国家的钱咋个换？」',
    options: [
      { text: '看运气', ok: false },
      { text: '看汇率——两种钱兑换的比例', ok: true },
      { text: '看朝廷', ok: false }
    ],
    explain: '汇率就是两种钱兑换的比例。汇率一动，做海外买卖的、出去耍的，都跟着动。'
  },
  {
    id: 'gq_285', cat: '宏观', icon: '📈', title: 'GDP 增速',
    scene: '弟子{name}问：「掌门，朝廷每年说 GDP 增速，增速慢了好不好？」',
    options: [
      { text: '越慢越好', ok: false },
      { text: '不一定——要看跟别的比、跟往年比，还要看质量', ok: true },
      { text: '越快越好', ok: false }
    ],
    explain: '增速不是越快越好，也不是越慢越好。要看跟别国比、跟往年比，还要看质量。'
  },
  {
    id: 'gq_286', cat: '宏观', icon: '🏛️', title: '财政赤字',
    scene: '弟子{name}问：「掌门，朝廷花的比收的多，这是好事不？」',
    options: [
      { text: '肯定不好', ok: false },
      { text: '看情况——买卖不景气的时候，多花点钱反而该做', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '朝廷花的比收的多，叫财政赤字。买卖不景气的时候，多花点钱反而是该做的。'
  },
  {
    id: 'gq_287', cat: '宏观', icon: '💵', title: '外汇管制',
    scene: '弟子{name}问：「掌门，弟子想把毛拿出去，朝廷管不管？」',
    options: [
      { text: '不管', ok: false },
      { text: '管——换外汇有额度，超过的要报批', ok: true },
      { text: '随便换', ok: false }
    ],
    explain: '换外汇有额度，一年一人换多少是有数的。超过的，要报批。'
  },
  {
    id: 'gq_288', cat: '宏观', icon: '📊', title: '失业率',
    scene: '弟子{name}问：「掌门，朝廷说失业率，那个数靠不靠得住？」',
    options: [
      { text: '肯定准', ok: false },
      { text: '要看是咋个算的——统计口径不一样，数字也不一样', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '失业率要看是咋个算的。统计算不算在家歇的、算不算打零工的，各地说法不一样。'
  },
  {
    id: 'gq_289', cat: '宏观', icon: '📜', title: '五年规划',
    scene: '弟子{name}问：「掌门，朝廷搞的那个『五年规划』，跟弟子有啥子关系？」',
    options: [
      { text: '莫得关系', ok: false },
      { text: '有关系——规划里说了今后搞啥子，跟着走的多半吃得到红利', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '五年规划里说了今后重点搞啥子。跟着那个方向走，多半吃得到红利。'
  },
  {
    id: 'gq_290', cat: '宏观', icon: '🌊', title: '逆全球化',
    scene: '弟子{name}问：「掌门，弟子听说外面在『逆全球化』，这是啥子？」',
    options: [
      { text: '是好事', ok: false },
      { text: '是各国开始筑墙——加税、限购，做买卖的更难', ok: true },
      { text: '跟我们莫得关系', ok: false }
    ],
    explain: '逆全球化就是各国开始筑墙——加税、限购。做买卖的更难，买菜的老百姓也要多花钱。'
  },

  // ===== 投资心理（收尾）=====
  {
    id: 'gq_291', cat: '投资心理', icon: '🎭', title: '第一笔',
    scene: '弟子{name}第一次买卖赚了钱，觉得自己是天才。掌门让他稳住。',
    options: [
      { text: '弟子就是天才', ok: false },
      { text: '第一笔多半是运气，别当成本事', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '第一笔多半是运气。把它当本事，往后就要吃亏。'
  },
  {
    id: 'gq_292', cat: '投资心理', icon: '📱', title: '看盘上瘾',
    scene: '弟子{name}一刻不看盘就难受，饭也吃不下，觉也睡不好。',
    options: [
      { text: '多看几眼好些', ok: false },
      { text: '这是上瘾了——看得越勤，越容易做错决定', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '看盘上瘾，越看越慌，越慌越乱做。把视线放远点，反而不容易做错。'
  },
  {
    id: 'gq_293', cat: '投资心理', icon: '📊', title: '别人的建议',
    scene: '弟子{name}问：「掌门，别个推荐的东西，弟子要不要听？」',
    options: [
      { text: '听就对了', ok: false },
      { text: '别人的话只作参考——自己搞不懂的，别买', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '别人的话只作参考。自己搞不懂的，别买。买了也拿不住。'
  },
  {
    id: 'gq_294', cat: '投资心理', icon: '🌊', title: '潮水退了',
    scene: '弟子{name}说：「掌门，弟子发现赚钱的时候都是运气，亏钱的时候才是本事不够。」',
    options: [
      { text: '说得太悲观', ok: false },
      { text: '说得对——赚钱的时候多想想是不是靠运气', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '赚钱的时候，多想想是不是靠运气。想清楚了，才不会在市场翻脸的时候措手不及。'
  },
  {
    id: 'gq_295', cat: '投资心理', icon: '🎯', title: '知足',
    scene: '弟子{name}赚了一笔，还想赚更多。掌门劝他先落袋一部分。',
    options: [
      { text: '再搏一把大的', ok: false },
      { text: '落袋一部分——赚到手的才是真赚的', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '赚到手的，才是真赚的。全押着不落袋，迟早要还回去一部分。'
  },

  // ===== 股票（收尾）=====
  {
    id: 'gq_296', cat: '股票', icon: '📈', title: '牛回头',
    scene: '弟子{name}说：「掌门，弟子听说牛市里也有暴跌，这是不是要跑了？」',
    options: [
      { text: '跑', ok: false },
      { text: '牛市里的暴跌叫"牛回头"，是正常的事，要看大势', ok: true },
      { text: '看运气', ok: false }
    ],
    explain: '牛市里的暴跌叫牛回头。是正常的事，先看大势，别急着跑。'
  },
  {
    id: 'gq_297', cat: '股票', icon: '🚀', title: '停不下来',
    scene: '弟子{name}赚了钱，还想赚更多，天天搏。掌门让他歇一歇。',
    options: [
      { text: '趁热打铁', ok: false },
      { text: '该歇就歇——钱挣不完，人垮了就莫得了', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '钱挣不完，人垮了就莫得了。赚了钱该歇就歇，别把自己搏进去。'
  },

  // ===== 基金（收尾）=====
  {
    id: 'gq_298', cat: '基金', icon: '🔄', title: '换手率',
    scene: '弟子{name}问：「掌门，弟子看一只基金换手率特别高，是好事不？」',
    options: [
      { text: '是好事', ok: false },
      { text: '换手太高说明基金经理老在买卖，费用高，多半不是好事', ok: true },
      { text: '看情况', ok: false }
    ],
    explain: '换手太高说明基金经理老在买卖，费用高，长期反而跑不赢。'
  },
  {
    id: 'gq_299', cat: '基金', icon: '🎯', title: '基金经理',
    scene: '弟子{name}问：「掌门，选基金要不要看是谁在管？」',
    options: [
      { text: '不用看', ok: false },
      { text: '要看——经理的履历、风格、在任时间都要看', ok: true },
      { text: '看名字', ok: false }
    ],
    explain: '基金是人在管，经理的履历、风格、在任时间都要看。人换了，风格也变了。'
  },
  {
    id: 'gq_300', cat: '基金', icon: '💰', title: '长期持有',
    scene: '弟子{name}问：「掌门，基金要拿好久？」',
    options: [
      { text: '看行情', ok: false },
      { text: '股票型的，一般三五年才看得到效果', ok: true },
      { text: '拿了就卖', ok: false }
    ],
    explain: '股票型基金，一般拿三五年才看得到效果。拿几天就想赚，那是赌。'
  }
];