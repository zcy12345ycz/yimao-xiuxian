/* ============ 版本 ============ */
const GAME_VERSION='v0.4.5';
const BGM_TRACKS = ['bgm.mp3', 'bgm1.mp3'];
const GAME_AUTHOR='Zhao | Struct. E.';
const CURRENT_SAVE_VERSION=6;

/* ============ 存档键 ============ */
const SAVE_KEY='yimao_companion_v1';
const EXPORT_VERSION=1;

/* ============ 图标（保留弟子头像用的那部分） ============ */
function _sv(p){return '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-0.15em">'+p+'</svg>'}
const _ICON={
  diligent:_sv('<path d="M4 4h6a2 2 0 012 2v13a1.5 1.5 0 00-1.5-1.5H4z"/><path d="M20 4h-6a2 2 0 00-2 2v13a1.5 1.5 0 011.5-1.5H20z"/>'),
  clever:_sv('<path d="M5 9l2-5 3 4h4l3-4 2 5v5a5 5 0 01-5 5h-4a5 5 0 01-5-5z"/><circle cx="10" cy="13" r=".5"/><circle cx="14" cy="13" r=".5"/><path d="M11 16h2"/>'),
  steady:_sv('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'),
  fated:_sv('<circle cx="12" cy="8" r="3"/><circle cx="16" cy="12" r="3"/><circle cx="12" cy="16" r="3"/><circle cx="8" cy="12" r="3"/>'),
  proud:_sv('<path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/>'),
  lazy:_sv('<path d="M17 4l.7 2.3L20 7l-2.3.7L17 10l-.7-2.3L14 7l2.3-.7z"/><path d="M20 13A8 8 0 1112.5 5a6 6 0 008.5 8z"/>'),
  loyal:_sv('<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>'),
  loner:_sv('<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>'),
  romantic:_sv('<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="6" rx="2" ry="3"/><ellipse cx="12" cy="18" rx="2" ry="3"/><ellipse cx="6" cy="12" rx="3" ry="2"/><ellipse cx="18" cy="12" rx="3" ry="2"/>')
};

/* ============ 方言 ============ */
const TX={
  splash_story:{std:'六岁那年，你算了一笔账：<br>中国有14亿人，如果每人给你一毛钱……<br><span class="hl">你就成14亿毛了。</span><span class="pause"></span>你兴奋得一夜没睡。<span class="pause"></span>后来你长大了，才发现没有人会白给你一毛钱。<span class="pause"></span>于是你决定修仙，<br>因为师父说过：<span class="hl">修成仙人，便能点石成金。</span><br>你立下大志：<span class="hl">先成仙，再把那14亿毛全赚回来！</span>',sc:'六岁那年，你算了一笔账：<br>中国有14亿人，要是每人给你一毛钱……<br><span class="hl">你就成14亿毛咯。</span><span class="pause"></span>你兴奋得一夜没睡。<span class="pause"></span>后来你长大了，才晓得没得哪个会白给你一毛钱。<span class="pause"></span>于是你决定修仙，<br>因为师父说过：<span class="hl">修成仙人，便能点石成金。</span><br>你立下大志：<span class="hl">先成仙，再把那14亿毛全赚回来！</span>'},
  first_meet_1:{std:'一个年轻人站在山门前，手里捧着一枚铜钱。',sc:'一个年轻人站到山门前，手头捧到一枚铜钱。'},
  first_meet_2:{std:'「掌门，弟子只有一毛，请掌门收下。」',sc:'「掌门，弟子只有一毛，请掌门收下。」'},
  master_reply_1:{std:'入我门来，便是一家人。',sc:'进门就是一家人咯。'},
  master_reply_2:{std:'好好修行。',sc:'好生修行。'},
  master_reply_3:{std:'不必多礼。',sc:'莫多礼。'},
  master_reply_4:{std:'你且安心住下，缺什么跟为师说。',sc:'你安心住到，缺啥子跟为师说。'}
};
function t(k){const it=TX[k];if(!it)return'';const d=s.dialect||'sc';return it[d]||it.std||''}

/* ============ 性格 ============ */
const PERSONALITIES=[
  {id:'diligent',n:'勤奋',ic:_ICON.diligent,desc:'话不多，但记得住'},
  {id:'clever',n:'机灵',ic:_ICON.clever,desc:'爱打听，常问为什么'},
  {id:'steady',n:'稳重',ic:_ICON.steady,desc:'慢一点，想清楚再说'},
  {id:'fated',n:'福缘',ic:_ICON.fated,desc:'总梦到奇怪的事'},
  {id:'proud',n:'好胜',ic:_ICON.proud,desc:'嘴上不服，心里要强'},
  {id:'lazy',n:'懒散',ic:_ICON.lazy,desc:'爱睡觉，偶尔一针见血'},
  {id:'loyal',n:'忠厚',ic:_ICON.loyal,desc:'话少，做什么都踏实'},
  {id:'loner',n:'孤僻',ic:_ICON.loner,desc:'喜欢一个人待着'},
  {id:'romantic',n:'痴情',ic:_ICON.romantic,desc:'心里常有事惦记着'}
];
const CATCHPHRASES={
  diligent:['多练一个时辰也是好的。','勤能补拙，弟子不怕慢。','弟子不聪明，就多练。'],
  clever:['嘿嘿，弟子又打听到点好玩的。','掌门，弟子这眼光，绝了。','这波啊，这波是稳赚不赔。'],
  steady:['稳一点，慢一点，不怕。','掌门放心，弟子心里有数。','一步一个脚印。'],
  fated:['弟子总觉得要出大事。','弟子昨晚又做了个怪梦。','冥冥中自有天意。'],
  proud:['弟子一定会成为最强的。','弟子不弱于人。','再给弟子点时间。'],
  lazy:['今天的太阳好舒服啊……','能不能再睡一会儿……','弟子正在参悟「无为」。'],
  loyal:['掌门说啥就是啥。','弟子永远忠于掌门。','掌门放心，有弟子在。'],
  loner:['……','弟子一个人挺好。','嗯。'],
  romantic:['掌门，弟子最近遇到个人……','弟子心里有个人。','缘分这种事，急不来。']
};
function rollCatchphrase(pid){return pick(CATCHPHRASES[pid]||CATCHPHRASES.steady)}

/* ============ 姓名 ============ */
const SURNAMES=['张','李','王','赵','陈','刘','孙','周','吴','郑','林','韩','萧','叶','秦','苏','许','何','罗','唐'];
const GIVEN_NAMES=['云','风','雨','雪','霜','月','星','辰','阳','浩','天','行','飞','扬','逸','尘','清','明','志','远','宇','轩','子','墨','青','玄','机'];
function makeName(){const s1=SURNAMES[Math.floor(Math.random()*SURNAMES.length)];const g=GIVEN_NAMES[Math.floor(Math.random()*GIVEN_NAMES.length)];if(Math.random()<0.5)return s1+g;return s1+g+GIVEN_NAMES[Math.floor(Math.random()*GIVEN_NAMES.length)]}
function uniqueName(){let n=makeName(),tries=0;while(s.discipleList.some(d=>d.name===n)&&tries++<30)n=makeName();return n}

/* ============ 工具 ============ */
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function todayStr(){const n=new Date();return n.toDateString()}
function playDays(){return Math.max(1,Math.floor((Date.now()-(s.createdAt||Date.now()))/86400000)+1)}

/* ============ 主界面点击吐槽文案 ============ */
const BG_CLICK_TEXTS = {
  level1: [
    '乱点啥子？耍不来点右上角看说明！',
    '莫摸老子，老子报警了哦！'
  ],
  level2: [
    '哎哟，手痒哇？去点右边那个铜钱按钮嘛。',
    '还点？信不信我唤雷劈你？',
    '点嘛，点坏了算你的。'
  ],
  level3: [
    '又不是我的手机，使劲点！',
    '点嘛，点脱了皮算我的，反正我又不心疼。',
    '算了，你慢慢点，我睡一觉先。'
  ],
  level4: [
    '脑壳有包嗦！点坏了要你赔！',
    '莫搞咯！再点我就把宗门解散咯！',
    '你再点，我就把网线拔了！'
  ],
  donate: [
    '点击右边铜钱，给我充值，你给我充，我就有了。',
    '看啥子看，点撒！赏我一毛，你就是我的原始股东！',
    '一毛就好，真的，我只想体验一下暴富的感觉，多了我不要。'
  ],
  ultimate: '穷得叮当响，天劫都懒得劈你。'
};

/* ============ 修炼境界 ============ */
const REALMS = [
  { id: 'lianqi',   n: '练气', baseExp: 240,    color: '#7dd99d' },
  { id: 'zhuji',    n: '筑基', baseExp: 720,    color: '#7ab8c4' },
  { id: 'jindan',   n: '金丹', baseExp: 1800,   color: '#e6c473' },
  { id: 'yuanying', n: '元婴', baseExp: 3600,   color: '#c088dd' },
  { id: 'huashen',  n: '化神', baseExp: 7200,   color: '#e58a8a' },
  { id: 'lianxu',   n: '炼虚', baseExp: 14400,  color: '#e6a877' },
  { id: 'heti',     n: '合体', baseExp: 28800,  color: '#7dd99d' },
  { id: 'dacheng',  n: '大乘', baseExp: 57600,  color: '#e6c473' },
  { id: 'dujie',    n: '渡劫', baseExp: 115200, color: '#c088dd' },
  { id: 'xianren',  n: '仙人', baseExp: 230400, color: '#ffffff' }
];

/* 修为需求：大境界第 9 层 ×2 作为门槛，再乘难度系数 */
function getExpNeeded(realmIdx, layer) {
  const r = REALMS[realmIdx] || REALMS[0];
  const base = layer === 9 ? r.baseExp * 2 : r.baseExp;
  return base * DIFFICULTY_MULT;
}

function getRealmName(realmIdx, layer) {
  const r = REALMS[realmIdx] || REALMS[0];
  return r.n + ' ' + layer + ' 层';
}

function getRealmColor(realmIdx) {
  return (REALMS[realmIdx] || REALMS[0]).color;
}

/* ============ 修炼速度 ============ */
/* ============ 难度系数 ============
 * 1 = 原版速度
 * 2 = 慢一倍（推荐新手）
 * 3 = 慢三倍（推荐）
 * 5 = 硬核
 * 改这一个数字，整体节奏跟着变
 */
const DIFFICULTY_MULT = 5;

const CULTIVATE_RATE_ONLINE  = 0.4;   // 在线 0.4 修为/秒（原 1.0）
const CULTIVATE_RATE_OFFLINE = 0.2;   // 离线 0.2 修为/秒（原 0.4）
const OFFLINE_CAP_HOURS      = 12;    // 离线结算上限 12 小时

/* ============ 突破基础成功率 ============ */
/* 每个大境界：起始成功率 → 第 9 层成功率，中间线性插值 */
const BREAKTHROUGH_REALM_START = [0.90, 0.70, 0.55, 0.42, 0.32, 0.24, 0.17, 0.12, 0.08, 0.05];
const BREAKTHROUGH_REALM_END   = [0.70, 0.55, 0.42, 0.32, 0.24, 0.17, 0.12, 0.08, 0.05, 0.02];

function getBaseRate(realmIdx, layer) {
  const start = BREAKTHROUGH_REALM_START[realmIdx] || 0.02;
  const end   = BREAKTHROUGH_REALM_END[realmIdx]   || 0.02;
  const t = (layer - 1) / 8;
  return start + (end - start) * t;
}

/* ============ 突破加成常量 ============ */
const DAOYUN_PER_FAIL   = 0.02;   // 每次失败 +2%
const DAOYUN_CAP        = 0.20;   // 道韵上限 +20%

const XUSHI_BONUS_PER   = 0.03;   // 每溢出 1 倍 +3%
const XUSHI_CAP         = 0.15;   // 蓄势上限 +15%

const XIANYUAN_BONUS    = 0.15;   // 每日仙缘 +15%

const LIANPO_BONUS      = { 3: 0.05, 5: 0.10, 7: 0.15, 9: 0.20 };  // 连破加成

const TIANJISHI_BONUS_PER = 0.05; // 每颗天机石 +5%
const TIANJISHI_CAP       = 10;   // 最多持有/使用 10 颗

const RATE_CAP_NORMAL = 0.95;     // 普通层成功率上限
const RATE_CAP_BIG    = 0.80;     // 大境界突破上限

/* ============ 天机石掉落（毫秒） ============ */
const TIANJISHI_ONLINE_MIN  = 15 * 60 * 1000;    // 在线 15 分钟
const TIANJISHI_ONLINE_MAX  = 45 * 60 * 1000;    // 在线 45 分钟
const TIANJISHI_OFFLINE_MIN = 1 * 3600 * 1000;   // 离线 1 小时
const TIANJISHI_OFFLINE_MAX = 3 * 3600 * 1000;   // 离线 3 小时

/* ============ 天象 · 吉日 ============ */
const TIANXIANG_BONUS = 0.20;    // 吉日 +20%

/* 判断今天是不是吉日 */
function isTianxiangDay() {
  if (!s.tianxiangDays || !s.tianxiangDays.length) return false;
  const d = new Date();
  const curMonth = d.getFullYear() + '-' + (d.getMonth() + 1);
  if (s.tianxiangMonth !== curMonth) return false;  // 月份过期，等下次刷新
  return s.tianxiangDays.includes(d.getDate());
}

/* 刷新本月吉日（每月 1-3 天随机） */
function refreshTianxiang() {
  const d = new Date();
  const curMonth = d.getFullYear() + '-' + (d.getMonth() + 1);
  if (s.tianxiangMonth === curMonth) return;  // 本月已刷新过
  
  s.tianxiangMonth = curMonth;
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const count = 1 + Math.floor(Math.random() * 3);  // 1-3 天
  const days = [];
  while (days.length < count) {
    const day = 1 + Math.floor(Math.random() * daysInMonth);
    if (!days.includes(day)) days.push(day);
  }
  days.sort((a, b) => a - b);
  s.tianxiangDays = days;
}

/* ============ 数字格式化（中文单位） ============ */
const CN_UNITS = [
  { v: 1e32, s: '沟' }, { v: 1e28, s: '穰' }, { v: 1e24, s: '秭' },
  { v: 1e20, s: '垓' }, { v: 1e16, s: '京' }, { v: 1e12, s: '兆' },
  { v: 1e8,  s: '亿' }, { v: 1e4,  s: '万' }
];
function fmtNum(n) {
  if (!isFinite(n)) return '∞';
  if (n < 0) return '-' + fmtNum(-n);
  if (n < 1e4) return Math.floor(n).toString();
  for (const u of CN_UNITS) {
    if (n >= u.v) {
      const v = n / u.v;
      const s = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
      return s + u.s;
    }
  }
  return Math.floor(n).toString();
}

/* ============ 洞府修行 ============ */
const DONGFU_INTERVAL = 30 * 60 * 1000; // 30 分钟刷新一次

const DONGFU_ROUTES = [
  {
    id: 'dazuo',
    n: '吐纳打坐',
    ic: '🧘',
    desc: '老老实实打坐，啥子都不想。',
    effect: '修为 +50%'
  },
  {
    id: 'gaoqian',
    n: '下山搞钱',
    ic: '💰',
    desc: '去山下摆个算命摊子，顺便看看能不能捞点偏门。',
    effect: '天机石翻倍'
  },
  {
    id: 'liandan',
    n: '炼丹采药',
    ic: '🌿',
    desc: '去后山挖点草草，炼点丹药补身子。',
    effect: '修为 +20% · 突破 +3%'
  }
];

// 修为倍率
function getDongfuRateMult() {
  if (s.dongfuChoice === 'dazuo') return 1.5;
  if (s.dongfuChoice === 'liandan') return 1.2;
  return 1.0;
}

// 突破加成
function getDongfuBreakBonus() {
  if (s.dongfuChoice === 'liandan') return 0.03;
  return 0;
}

// 天机石掉落间隔倍率（小于 1 表示加快）
function getDongfuTianjishiMult() {
  if (s.dongfuChoice === 'gaoqian') return 0.5;
  return 1.0;
}

/* ============ 洞府 · 随机奇遇 ============ */
const DONGFU_EVENT_CHANCE = 0.30;   // 30% 概率触发
/* 稀有度权重（越大越容易出） */
const DONGFU_RARITY = {
  common: { n: '常见', color: '#7dd99d', weight: 10 },
  rare:   { n: '罕见', color: '#c088dd', weight: 5  },
  epic:   { n: '珍稀', color: '#e6c473', weight: 2  }
};

const DONGFU_EVENTS = [
  {
    id: 'beggar',
    rarity: 'common',
    n: '乞丐塞破铜钱',
    ic: '🥺',
    desc: '洞府外，一个老乞丐拦住你，硬塞给你一枚破铜钱。他嘴里念叨着「拿着，会有用的」。',
    options: [
      {
        text: '收下（修为 +2%）',
        apply: () => {
          const gain = Math.floor(getExpNeeded(s.realm, s.layer) * 0.02);
          s.exp += gain;
          toast('修为 +' + fmtNum(gain), 2000);
        }
      },
      {
        text: '拒绝（道韵 +2%）',
        apply: () => {
          s.daoyun = Math.min(DAOYUN_CAP, s.daoyun + 0.02);
          toast('道韵 +2%', 2000);
        }
      }
    ]
  },
  {
    id: 'meteor',
    rarity: 'epic',
    n: '陨石砸坏炼丹炉',
    ic: '☄️',
    desc: '一颗陨石从天而降，砸烂了你的炼丹炉。炉子里还剩点余烬，旁边散落些碎石。',
    options: [
      {
        text: '去挖矿（天机石 +1）',
        apply: () => {
          if(s.tianjishi >= TIANJISHI_CAP){
            toast('天机石已满', 2000);
          } else {
            s.tianjishi = Math.min(TIANJISHI_CAP, s.tianjishi + 1);
            toast('💎 天机石 +1', 2000);
          }
        }
      },
      {
        text: '修炉子（修为 +5%）',
        apply: () => {
          const gain = Math.floor(getExpNeeded(s.realm, s.layer) * 0.05);
          s.exp += gain;
          toast('修为 +' + fmtNum(gain), 2000);
        }
      }
    ]
  },
  {
    id: 'yelling',
    rarity: 'common',
    n: '瓜娃子叫骂',
    ic: '😡',
    desc: '一个瓜娃子站在洞府门口，扯着嗓子骂你，从你师父骂到你家十八代祖宗。',
    options: [
      {
        text: '出去揍他一顿（道韵清零 · 修为 +3%）',
        apply: () => {
          s.daoyun = 0;
          const gain = Math.floor(getExpNeeded(s.realm, s.layer) * 0.03);
          s.exp += gain;
          toast('心念通达 · 修为 +' + fmtNum(gain), 2000);
        }
      },
      {
        text: '忍气吞声（道韵 +5%）',
        apply: () => {
          s.daoyun = Math.min(DAOYUN_CAP, s.daoyun + 0.05);
          toast('道韵 +5%', 2000);
        }
      }
    ]
  },
  {
    id: 'wolf',
    rarity: 'common',
    n: '野狼堵路',
    ic: '🐺',
    desc: '后山小道上一头野狼拦住去路，龇着牙，尾巴炸得老高，口水顺着下巴往下滴。',
    options: [
      {
        text: '抄家伙把它打跑（修为 +3%）',
        apply: () => {
          const gain = Math.floor(getExpNeeded(s.realm, s.layer) * 0.03);
          s.exp += gain;
          toast('你拾起一根木棍冲上去，狼跑了 · 修为 +' + fmtNum(gain), 2200);
        }
      },
      {
        text: '绕路走，多一事不如少一事（道韵 +3%）',
        apply: () => {
          s.daoyun = Math.min(DAOYUN_CAP, s.daoyun + 0.03);
          toast('绕了半里路，心里倒是静了 · 道韵 +3%', 2200);
        }
      }
    ]
  },
  {
    id: 'peach',
    rarity: 'rare',
    n: '仙桃落地',
    ic: '🍑',
    desc: '后山有棵老桃树，一颗熟透的桃子啪的一声落在你脚边，粉嫩嫩的，闻着就甜。',
    options: [
      {
        text: '拾起来吃了（修为 +5%）',
        apply: () => {
          const gain = Math.floor(getExpNeeded(s.realm, s.layer) * 0.05);
          s.exp += gain;
          toast('咬一口，汁水顺着下巴流 · 修为 +' + fmtNum(gain), 2200);
        }
      },
      {
        text: '留给山上的鸟吃（道韵 +4%）',
        apply: () => {
          s.daoyun = Math.min(DAOYUN_CAP, s.daoyun + 0.04);
          toast('你扭头走了，身后一群麻雀扑棱棱落下来 · 道韵 +4%', 2600);
        }
      }
    ]
  },
  {
    id: 'oldman',
    rarity: 'epic',
    n: '老头借宿',
    ic: '🧙',
    desc: '夜里有人敲门，是个白胡子老头，背着个破包袱，说天黑了要借宿一晚。你瞅了他一眼，看不透深浅。',
    options: [
      {
        text: '收留他一晚（天机石 +1）',
        apply: () => {
          if(s.tianjishi >= TIANJISHI_CAP){
            toast('天机石已满，老头留下一句话走了', 2200);
          } else {
            s.tianjishi = Math.min(TIANJISHI_CAP, s.tianjishi + 1);
            toast('老头临走塞给你一块石头 · 💎 +1', 2200);
          }
        }
      },
      {
        text: '推说洞府简陋，打发走（修为 +2%）',
        apply: () => {
          const gain = Math.floor(getExpNeeded(s.realm, s.layer) * 0.02);
          s.exp += gain;
          toast('你关上门接着打坐 · 修为 +' + fmtNum(gain), 2200);
        }
      }
    ]
  },
  {
    id: 'sword',
    rarity: 'rare',
    n: '路边残剑',
    ic: '🗡️',
    desc: '山坡上斜插着一把锈迹斑斑的剑，剑柄缠的布都烂了，不知道哪年哪月留下的。',
    options: [
      {
        text: '拔出来看看（修为 +3% · 道韵 +1%）',
        apply: () => {
          const gain = Math.floor(getExpNeeded(s.realm, s.layer) * 0.03);
          s.exp += gain;
          s.daoyun = Math.min(DAOYUN_CAP, s.daoyun + 0.01);
          toast('剑身锈得不成样子，倒是顺手练了两下 · 修为 +' + fmtNum(gain), 2400);
        }
      },
      {
        text: '给它培点土，让它继续锈着（道韵 +4%）',
        apply: () => {
          s.daoyun = Math.min(DAOYUN_CAP, s.daoyun + 0.04);
          toast('你捧了几把土盖上去，拍了拍手走了 · 道韵 +4%', 2400);
        }
      }
    ]
  },
  {
    id: 'flood',
    rarity: 'common',
    n: '山下涨水',
    ic: '🌊',
    desc: '一连下了三天雨，山下那条河涨得跟黄汤似的，村里几个汉子正扛着沙袋往堤上跑。',
    options: [
      {
        text: '脱了外袍下去搭把手（修为 +5%）',
        apply: () => {
          const gain = Math.floor(getExpNeeded(s.realm, s.layer) * 0.05);
          s.exp += gain;
          toast('你扛了一下午沙袋，腰都直不起来 · 修为 +' + fmtNum(gain), 2600);
        }
      },
      {
        text: '站岸上看，雨里的水流得挺有章法（道韵 +3%）',
        apply: () => {
          s.daoyun = Math.min(DAOYUN_CAP, s.daoyun + 0.03);
          toast('你蹲在岸边看了一下午水 · 道韵 +3%', 2400);
        }
      }
    ]
  }
];
