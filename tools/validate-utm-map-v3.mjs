import "./validate-worker-journey-v3.mjs";
import fs from "node:fs";

const errors = [];
let data = null;
try {
  data = JSON.parse(fs.readFileSync("operations/utm-campaign-map-2026.json", "utf8"));
} catch (error) {
  errors.push(`UTM map lỗi JSON: ${error.message}`);
}

if (data) {
  if (data.version !== 3) errors.push(`UTM map cần version 3, nhận ${data.version}`);
  const items = Array.isArray(data.landing_pages) ? data.landing_pages : [];
  if (items.length < 7) errors.push(`UTM map cần ít nhất 7 trang đích, nhận ${items.length}`);
  const contents = new Set();
  for (const item of items) {
    let url = null;
    try { url = new URL(item.destination); } catch { errors.push(`URL không hợp lệ: ${item.destination}`); continue; }
    for (const [key, expected] of [["utm_source", "meta"], ["utm_medium", "paid"], ["utm_campaign", item.campaign], ["utm_content", item.content]]) {
      if (url.searchParams.get(key) !== expected) errors.push(`${item.content}: sai ${key}`);
    }
    if (contents.has(item.content)) errors.push(`Trùng utm_content: ${item.content}`);
    contents.add(item.content);
    if (item.campaign === "camp1_kcn_mo" && url.pathname !== "/chon-kcn-hay-lam-mo/") errors.push("Camp 1 phải dẫn tới trang Chọn KCN hay làm mỏ");
    if (item.campaign === "camp2_phongsu" && !url.pathname.startsWith("/viec-lam-nganh-than/")) errors.push(`${item.content}: Camp 2 phải dẫn tới trang tỉnh`);
  }
}

console.log(JSON.stringify({ utm_pages: data?.landing_pages?.length || 0, errors }, null, 2));
if (errors.length) process.exit(1);
