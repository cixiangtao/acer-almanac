export default function () {
  var e,
    n,
    o,
    t,
    r,
    d,
    l,
    g,
    i,
    s,
    c,
    m,
    u,
    b,
    f,
    h,
    p = {
      good: [],
      bad: []
    },
    good, bad,
    v,
    D,
    M,
    A,
    I,
    x,
    y,
    Y,
    k,
    q,
    w,
    F,
    V,
    j,
    z,
    B,
    C,
    E,
    G,
    H,
    J;
  for (var uDate = new Date, C = 37621 * uDate.getFullYear() + 539 * (uDate.getMonth() + 1) + uDate.getDate(), A = [{
        name: "看AV",
        good: "释放压力，重铸自我",
        bad: "会被家人撞到"
      }, {
        name: "组模型",
        good: "今天的喷漆会很完美",
        bad: "精神不集中板件被剪断了"
      }, {
        name: "投稿情感区",
        good: "问题圆满解决",
        bad: "会被当事人发现"
      }, {
        name: "逛匿名版",
        good: "今天也要兵库北",
        bad: "看到丧尸在晒妹"
      }, {
        name: "和女神聊天",
        good: "女神好感度上升",
        bad: "我去洗澡了，呵呵"
      }, {
        name: "啪啪啪",
        good: "啪啪啪啪啪啪啪",
        bad: "会卡在里面"
      }, {
        name: "熬夜",
        good: "夜间的效率更高",
        bad: "明天有很重要的事"
      }, {
        name: "锻炼",
        good: "八分钟给你比利般的身材",
        bad: "会拉伤肌肉"
      }, {
        name: "散步",
        good: "遇到妹子主动搭讪",
        bad: "走路会踩到水坑"
      }, {
        name: "打排位赛",
        good: "遇到大腿上分500",
        bad: "我方三人挂机"
      }, {
        name: "汇报工作",
        good: "被夸奖工作认真",
        bad: "上班偷玩游戏被扣工资"
      }, {
        name: "抚摸猫咪",
        good: "才不是特意蹭你的呢",
        bad: "死开！愚蠢的人类"
      }, {
        name: "遛狗",
        good: "遇见女神遛狗搭讪",
        bad: "狗狗随地大小便被罚款"
      }, {
        name: "烹饪",
        good: "黑暗料理界就由我来打败",
        bad: "难道这就是……仰望星空派？"
      }, {
        name: "告白",
        good: "其实我也喜欢你好久了",
        bad: "对不起，你是一个好人"
      }, {
        name: "求站内信",
        good: "最新种子入手",
        bad: "收到有码葫芦娃"
      }, {
        name: "追新番",
        good: "完结之前我绝不会死",
        bad: "会被剧透"
      }, {
        name: "打卡日常",
        good: "怒回首页",
        bad: "会被老板发现"
      }, {
        name: "下副本",
        good: "配合默契一次通过",
        bad: "会被灭到散团"
      }, {
        name: "抢沙发",
        good: "沙发入手弹无虚发",
        bad: "会被挂起来羞耻play"
      }, {
        name: "网购",
        good: "商品大减价",
        bad: "问题产品需要退换"
      }, {
        name: "跳槽",
        good: "新工作待遇大幅提升",
        bad: "再忍一忍就加薪了"
      }, {
        name: "读书",
        good: "知识就是力量",
        bad: "注意力完全无法集中"
      }, {
        name: "早睡",
        good: "早睡早起方能养生",
        bad: "会在半夜醒来，然后失眠"
      }, {
        name: "写新的功能块",
        good: "毫无bug，完美完成",
        bad: "遇到连环bug"
      }, {
        name: "逛街",
        good: "物美价廉大优惠",
        bad: "会遇到奸商"
      }], g = function () {
        for (j = [], D = 1; D <= 50; D++) {
          j.push(D);
        }
        return j
      }.apply(this),
      m = null,
      c = null,
      s = null,
      d = null,
      // e = [     2635,     333387,     1701,     1748,     267701,     694, 2391,
      // 133423,     1175,     396438,     3402,     3749,     331177, 1453,     694,
      // 201326,     2350,     465197,     3221,     3402, 400202,     2901, 1386,
      // 267611,     605,     2349,     137515, 2709,     464533,     1738, 2901,
      // 330421,     1242,     2651, 199255,     1323,     529706, 3733, 1706, 398762,
      //     2741, 1206,     267438,     2647,     1318,   204070,   3477, 461653,
      // 1386,     2413,     330077,     1197, 2637,     268877,   3365, 531109, 2900,
      //     2922,     398042,     2395,     1179, 267415, 2635, 661067, 1701, 1748,
      // 398772, 2742,     2391, 330031,     1175, 1611, 200010,     3749,   527717,
      // 1452, 2742,     332397,     2350,     3222,     268949, 3402, 3493, 133973,
      // 1386,     464219,     605,    2349,   334123, 2709, 2890, 267946, 2773,
      // 592565,     1210,    2651,  395863, 1323,   2707, 265877 ], x = [     0,  31,
      // 59,     90, 120,   151,    181,  212, 243, 273,     304,     334 ],
      n = function (a, e) {
        return a >> e & 1
      },
      f = function () {
        var o,
          t,
          r,
          l,
          g,
          i,
          u,
          b,
          f,
          h;
        for (u = 1 <= arguments.length ?
          a.call(arguments, 0) : [], d = 3 !== u.length ?
          new Date :
          new Date(u[0], u[1], u[2]), h = null, l = null, g = null, t = null, o = !1, f = d.getYear(), f < 1900 && (f += 1900), h = 365 * (f - 1921) + Math.floor((f - 1921) / 4) + x[d.getMonth()] + d.getDate() - 38, d.getYear() % 4 === 0 && d.getMonth() > 1 && h++, l = r = 0; r < 255; l = ++r) {
          for (t = e[l] < 4095 ?
            11 :
            12, g = i = b = t; i >= 0; g = i += -1) {
            if (h <= 29 + n(e[l], g)) {
              o = !0;
              break
            }
            h = h - 29 - n(e[l], g)
          }
          if (o)
            break
        }
        if (m = 1921 + l, c = t - g + 1, s = h, 12 === t && (c === Math.floor(e[l] / 65536) + 1 && (c = 1 - c), c > Math.floor(e[l] / 65536) + 1))
          return c--
      },
      r = function () {
        var a;
        return a = "",
          a += H.charAt((m - 4) % 10),
          a += b.charAt((m - 4) % 12),
          a += "",
          a += G.charAt((m - 4) % 12),
          a += "年 ",
          c < 1 ?
          (a += "闰", a += Y.charAt(-c - 1)) :
          a += Y.charAt(c - 1),
          a += "月",
          a += s < 11 ?
          "初" :
          s < 20 ?
          "十" :
          s < 30 ?
          "廿" :
          "三十",
          s % 10 === 0 && 10 !== s || (a += q.charAt((s - 1) % 10)),
          a
      },
      t = function (a, e, n) {
        return a < 1921 || a > 2020 ?
          "" :
          (e = parseInt(e) > 0 ?
            e - 1 :
            11, f(a, e, n), r())
      },
      o = function () {
        return u.getFullYear() + "年" + (1 + u.getMonth()) + "月" + u.getDate() + "日 星期" + [
          "日",
          "一",
          "二",
          "三",
          "四",
          "五",
          "六"
        ][u.getDay()]
      },
      z = function (a, e) {
        var n,
          o,
          t,
          r;
        for (t = a % 11117, n = o = 0, r = 25 + e; 0 <= r ?
          o < r :
          o > r; n = 0 <= r ?
          ++o :
          --o)
          t *= t,
          t %= 11117;
        return t
      },
      E = z(C, 8) % 100,
      B = z(C, 4) % 100,
      good = [],
      v = M = 0,
      F = z(C, 9) % 3 + 2; 0 <= F ?
    M < F :
    M > F; v = 0 <= F ?
    ++M :
    --M)
    k = parseInt(.01 * E * A.length, 10),
    l = A[k],
    I = parseInt(z(C, 3 + v) % 100 * .01 * g.length, 10),

    good.push({
      img: g[I],
      label: l.name,
      good: l.good
    }),
    A.splice(k, 1),
    g.splice(I, 1);
  for (bad = [], v = w = 0, V = z(C, 7) % 3 + 2; 0 <= V ?
    w < V :
    w > V; v = 0 <= V ?
    ++w :
    --w)
    k = parseInt(.01 * B * A.length, 10),
    l = A[k],
    I = parseInt(z(C, 2 + v) % 100 * .01 * g.length, 10),

    bad.push({
      img: g[I],
      label: l.name,
      bad: l.bad
    }),
    A.splice(k, 1),
    g.splice(I, 1);

  p.good = good;
  p.bad = bad;
  return p;
}
