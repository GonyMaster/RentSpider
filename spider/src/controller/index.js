var XC = require("../../schema/xc");

/**
 * 随机获取一条记录
 *
 * @getIp
 */
export function getIp(res) {
  XC.aggregate([
    // { $match: { eff: { $exists: false }
    // //  type: "HTTPS" 
    //  } },
    { $sample: { size: 1 } }
  ]).exec(function(err, data) {
    res.send(JSON.stringify(data));
  });
}

export function getSuccessIp(res) {
  XC.aggregate([
    { $match: { eff: "3"}},
    { $sample: { size: 1 } }
  ]).exec(function(err, data) {
    res.send(JSON.stringify(data));
  });
}
