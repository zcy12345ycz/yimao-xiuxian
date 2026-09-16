/* ============ 版本 ============ */
const GAME_VERSION='v0.5';
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