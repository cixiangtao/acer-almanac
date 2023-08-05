/*
 * @Author: 虾哔哔
 * @Date: 2018-05-15 17:00:01
 * @Last Modified by: 虾哔哔
 * @Last Modified time: 2018-05-15 23:35:07
 */
export default function (bir) {
  var date = new Date(),
    allDate = 37621 * date.getFullYear() + 539 * (date.getMonth() + 1) + date.getDate(),
    birthday;

  if (String(Number(bir)) != "NaN") {
    birthday = Number(bir);
  } else {
    birthday = 19930112;
  }

  var val = (function (a, e) {
    var n, o, t, r;
    for (
      t = a % 11117, n = o = 0, r = 25 + e; 0 <= r ? o < r : o > r; n = 0 <= r ? ++o : --o
    )
      (t *= t), (t %= 11117);
    return t;
  })(allDate * birthday, 6) % 100;

  function luck() {
    return val < 5 ?
      "大凶" :
      val < 20 ?
      "凶" :
      val < 50 ?
      "末吉" :
      val < 60 ?
      "半吉" :
      val < 70 ? "吉" : val < 80 ? "小吉" : val < 90 ? "中吉" : "大吉";
  };
  //
  return {
    label: luck(),
    color: "rgb(" + (10 + 0.8 * val) + "%, 20%, 20%)",
    attr: val
  }
}
