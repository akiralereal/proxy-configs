/**
 * 360 摄像机抓包探针 / 360 Camera Traffic Probe（临时诊断用 / temporary diagnostic）
 *
 * 作用：记录 *.360.cn 的每个请求 URL，以及（JSON 响应的）顶层字段名，
 *       用来定位真正的广告接口与广告字段。确认后即可删除本脚本。
 *
 * 适用：Shadowrocket / Surge / Loon / Stash（http-response 脚本）
 */

const TAG = "[360-probe]";
const url = (typeof $request !== "undefined" && $request.url) ? $request.url : "(unknown url)";

try {
  const headers = ($response && $response.headers) || {};
  const ct = headers["Content-Type"] || headers["content-type"] || "";
  let line = url;

  if (/json/i.test(ct) && $response.body) {
    try {
      const obj = JSON.parse($response.body);
      const keys = obj && typeof obj === "object" ? Object.keys(obj) : [];
      line += "  ||  keys: " + keys.join(", ");
    } catch (e) {
      line += "  ||  (json parse failed)";
    }
  } else {
    line += "  ||  content-type: " + ct;
  }

  console.log(TAG + " " + line);
} catch (e) {
  console.log(TAG + " probe error: " + e);
}

// 探针不修改响应，原样放行 / probe never modifies the response
$done({});
