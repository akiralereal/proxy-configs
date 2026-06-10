/**
 * YouTube 去广告 — 响应脚本（原创实现 / original）
 * YouTube ad removal — http-response script.
 *
 * 原理：拦截 YouTube InnerTube API（youtubei/v1/*）的 JSON 响应，
 *       删除其中的广告字段与信息流广告 renderer。
 *
 * 安全设计：任何异常都兜底放行（$done 必被调用，绝不卡住请求）；
 *           非 JSON（如 protobuf 二进制）直接跳过；限制递归深度防栈溢出；
 *           未删除任何内容时不改写响应。
 *
 * 适用：Shadowrocket / Surge / Loon / Stash（http-response 脚本）
 * 作者：Akira
 */

const TAG = "[youtube-adblock]";
const MAX_DEPTH = 80; // 递归深度上限，防止超大响应导致栈溢出

// player 接口里的视频广告字段（删除即去掉贴片 / 插播广告）
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
];

const AD_KEYS = new Set([...PLAYER_AD_KEYS, ...AD_RENDERER_KEYS]);

// 整个处理流程包在 try/catch 里，确保 $done 一定被调用
let out = {};
try {
  out = process();
} catch (e) {
  console.log(`${TAG} error, passing through: ${e}`);
  out = {};
}
$done(out);

function process() {
  const body = $response.body;
  if (!body) return {};

  // 快速跳过非 JSON 文本（二进制 / protobuf）——不解析、不改动
  const first = body.charAt(0);
  if (first !== "{" && first !== "[") {
    return {};
  }

  let obj;
  try {
    obj = JSON.parse(body);
  } catch (e) {
    return {}; // 解析失败 → 原样放行
  }

  const removed = stripAds(obj, 0);
  if (removed > 0) {
    console.log(`${TAG} removed ${removed} ad object(s).`);
    return { body: JSON.stringify(obj) };
  }
  return {}; // 没删到东西 → 不改写
}

/**
 * 递归删除广告：
 *  - 对象里命中 AD_KEYS 的键 → 删除
 *  - 数组里「本身就是广告 renderer」的元素 → 整个移除
 */
function stripAds(node, depth) {
  if (depth > MAX_DEPTH || !node || typeof node !== "object") return 0;

  let count = 0;

  if (Array.isArray(node)) {
    for (let i = node.length - 1; i >= 0; i--) {
      if (isAdItem(node[i])) {
        node.splice(i, 1);
        count++;
      } else {
        count += stripAds(node[i], depth + 1);
      }
    }
  } else {
    for (const key of Object.keys(node)) {
      if (AD_KEYS.has(key)) {
        delete node[key];
        count++;
      } else {
        count += stripAds(node[key], depth + 1);
      }
    }
  }

  return count;
}

// 数组元素本身是否就是一个广告条目，例如 { "adSlotRenderer": {...} }
function isAdItem(item) {
  return (
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    Object.keys(item).some((k) => AD_RENDERER_KEYS.includes(k))
  );
}
