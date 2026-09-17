/* ============ 版本 ============ */
const GAME_VERSION='v0.9.6.3';
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
  viceCut: 0.10,                    // 副掌门抽成比例
  yearDuration: 30 * 86400000,      // 年鉴周期：30 天
  // ---- 掌门精力 ----
  maxEnergy: 5,                         // 精力上限
  energyRecoverInterval: 4 * 3600 * 1000, // 每4小时恢复1点精力

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
  {day:1,icon:'🪙',name:'×2',type:'stone',mul:2},
  {day:2,icon:'🪙',name:'×3',type:'stone',mul:3},
  {day:3,icon:'📖',name:'修为',type:'exp',mul:0.3},
  {day:4,icon:'🪙',name:'×4',type:'stone',mul:4},
  {day:5,icon:'🎁',name:'道具',type:'item',pool:['break_pill','talent_pill','rebirth_pill','long_life_pill']},
  {day:6,icon:'🪙',name:'×6',type:'stone',mul:6},
  {day:7,icon:'💎',name:'×11',type:'stone',mul:11}
];
/* ============ 每日答题（凡间商道） ============ */
const DAILY_QUIZ_COUNT = 3;                // 每天抽题数
const QUIZ_REWARD_MULT = {                 // 正确率 → 奖励系数
  3: 0.8,
  2: 0.5,
  1: 0.2,
  0: 0.05
};

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
function pickEvent(){
  const top=topDisciple();if(!top)return null;
  s.reportsSinceEvent=(s.reportsSinceEvent||0)+1;
const force=s.reportsSinceEvent>=CONFIG.eventForceInterval;
if(!force&&s.reportsSinceEvent<CONFIG.eventMinInterval)return null;
if(!force&&Math.random()>CONFIG.eventChance)return null;
  s.reportsSinceEvent=0;
  if(!s.eventChain)s.eventChain={};
  // === 选定本次事件的主角弟子 ===
  // 首席 60% 概率主导，其余由其他在宗门弟子分担
  const others=s.discipleList.filter(d=>d.id!==top.id&&!isOnExpedition(d)&&!isInMijing(d));
  let actor=top;
  if(others.length>0&&Math.random()<0.4)actor=pick(others);
  const lvl=actor.level;
  // === 优先状态剧情：弟子身上有活跃状态时，50% 概率先抽状态剧情 ===
  const _activeSt=getActiveStates(actor);
  if(_activeSt.length>0&&Math.random()<0.5){
    const matching=STATE_STORY_TEMPLATES.filter(t=>_activeSt.some(st=>st.id===t.stateType));
    if(matching.length>0){
      const st=weightedPick(matching,'weight');
      const ev=buildDynamicEvent(st,actor);
      if(ev){
        ev.discipleId=actor.id;
        ev.discipleName=actor.name;
        ev.stateStory=true;
        return ev;
      }
    }
  }
  const cands=EVENT_TEMPLATES.filter(e=>{
    if(e.minLv&&lvl<e.minLv)return false;
    // === 按性格过滤（模板未指定则不限） ===
    if(e.personalities&&e.personalities.length>0&&!e.personalities.includes(actor.personality))return false;
    // === 按专精过滤（模板未指定则不限） ===
    if(e.specialties&&e.specialties.length>0&&!e.specialties.includes(actor.specialty))return false;
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
    const ev=buildDynamicEvent(t,actor);
    if(ev){
      // === 把主角弟子绑进事件里 ===
      ev.discipleId=actor.id;
      ev.discipleName=actor.name;
      s.recentEvents.push(t.id);
      if(s.recentEvents.length>5)s.recentEvents.shift();
      return ev;
    }
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