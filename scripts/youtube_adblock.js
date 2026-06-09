/**
 * YouTube 去广告 — 响应脚本（原创实现 / original）
 * YouTube ad removal — http-response script.
 *
 * 原理：拦截 YouTube InnerTube API（youtubei/v1/*）的 JSON 响应，
 *       删除其中的广告字段与信息流广告 renderer。
 *
 * 限制：仅处理 JSON 响应。若响应为二进制（protobuf），无法解析，
 *       则原样放行（不破坏内容，但当次不去广告）。
 *
 * 适用：Shadowrocket / Surge / Loon / Stash（http-response 脚本）
 * 作者：Akira
 */

const TAG = "[youtube-adblock]";

// player 接口里的视频广告字段（删除即去掉贴片/插播广告）
const PLAYER_AD_KEYS = ["adPlacements", "adSlots", "playerAds", "adBreakHeartbeatParams"];

// 信息流 / 列表 / 搜索里属于广告的 renderer（整块删除）
const AD_RENDERER_KEYS = [
  "adSlotRenderer",
  "promotedSparklesWebRenderer",
  "promotedSparklesTextSearchRenderer",
  "compactPromotedItemRenderer",
  "compactPromotedVideoRenderer",
  "promotedVideoRenderer",
  "bannerPromoRenderer",
  "statementBannerRenderer",
  "adsControlRenderer",
];

const AD_KEYS = new Set([...PLAYER_AD_KEYS, ...AD_RENDERER_KEYS]);

let result = {};
const body = $response.body;

if (body) {
  let obj = null;
  try {
    obj = JSON.parse(body);
  } catch (e) {
    obj = null;
  }

  if (obj === null) {
    // 非 JSON（可能是 protobuf 二进制）—— 原样放行，避免破坏响应
    console.log(`${TAG} non-JSON body, passed through.`);
  } else {
    const removed = stripAds(obj);
    console.log(`${TAG} removed ${removed} ad object(s).`);
    result = { body: JSON.stringify(obj) };
  }
}

$done(result);

/**
 * 递归删除广告字段：
 *  - 对象里命中 AD_KEYS 的键 → 删除
 *  - 数组里「本身就是广告 renderer」的元素 → 整个移除
 * @returns {number} 删除的广告对象数量
 */
function stripAds(node) {
  let count = 0;

  if (Array.isArray(node)) {
    for (let i = node.length - 1; i >= 0; i--) {
      const item = node[i];
      if (isAdItem(item)) {
        node.splice(i, 1);
        count++;
      } else {
        count += stripAds(item);
      }
    }
  } else if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      if (AD_KEYS.has(key)) {
        delete node[key];
        count++;
      } else {
        count += stripAds(node[key]);
      }
    }
  }

  return count;
}

// 判断数组元素是否是一个广告条目，例如 { "adSlotRenderer": {...} }
function isAdItem(item) {
  return (
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    Object.keys(item).some((k) => AD_RENDERER_KEYS.includes(k))
  );
}
