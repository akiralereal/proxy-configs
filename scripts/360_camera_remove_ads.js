/**
 * 360 摄像机去广告 / 360 Camera Ad Removal
 *
 * 作用：拦截 jia.360.cn 配置接口（/conf/v1.json）的响应，删除其中的广告
 *       相关配置字段，使 App 内不再下发 / 展示对应广告位。
 *
 * 适用：Shadowrocket / Surge / Loon / Stash（http-response 脚本）
 * 作者：Akira
 */

// 需要删除的顶层广告字段（可按抓包结果增删）
// Top-level ad-related keys to strip (adjust based on your captures)
const AD_KEYS = ["tab_conf", "ad_conf", "ads", "activity", "splash", "banner", "popup"];

// 在嵌套对象中也会被清理的字段名（按 key 名匹配，递归）
// Key names removed anywhere in the object tree (matched recursively)
const NESTED_AD_KEYS = ["ad_conf", "ads", "advertisement", "splash_ad", "banner_ad"];

const TAG = "[360-camera-adblock]";

let body = $response.body;

// 无响应体时原样放行，避免白屏 / pass through when there is no body
if (!body) {
  $done({});
} else {
  try {
    const obj = JSON.parse(body);
    let removed = 0;

    // 1) 删除约定的顶层广告字段 / strip top-level ad keys
    for (const key of AD_KEYS) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        delete obj[key];
        removed++;
      }
    }

    // 2) 递归清理嵌套广告字段 / recursively strip nested ad keys
    removed += scrub(obj);

    console.log(`${TAG} removed ${removed} ad field(s).`);
    $done({ body: JSON.stringify(obj) });
  } catch (e) {
    // 解析失败时返回原始响应，确保功能正常 / on failure, return the original body
    console.log(`${TAG} parse failed, passing through. ${e}`);
    $done({ body });
  }
}

/**
 * 递归删除对象树中名称命中 NESTED_AD_KEYS 的字段。
 * Recursively delete keys whose names match NESTED_AD_KEYS.
 * @returns {number} 删除的字段数量 / number of fields removed
 */
function scrub(node) {
  let count = 0;
  if (Array.isArray(node)) {
    for (const item of node) count += scrub(item);
  } else if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      if (NESTED_AD_KEYS.includes(key)) {
        delete node[key];
        count++;
      } else {
        count += scrub(node[key]);
      }
    }
  }
  return count;
}
