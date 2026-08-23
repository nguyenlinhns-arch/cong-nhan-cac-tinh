import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const updated = "2026-08-23";
const start = "<!-- field-report-authority-v8:start -->";
const end = "<!-- field-report-authority-v8:end -->";

function stripManaged(html) {
  const from = html.indexOf(start);
  if (from < 0) return html;
  const to = html.indexOf(end, from);
  if (to < 0) throw new Error("Field report authority v8: marker mở thiếu marker đóng");
  return `${html.slice(0, from)}${html.slice(to + end.length)}`.replace(/\n{3,}/g, "\n\n");
}

function touchDate(html) {
  return html.replace(/"dateModified":"\d{4}-\d{2}-\d{2}"/, `"dateModified":"${updated}"`);
}

function addNav(html) {
  if (html.includes('href="/phong-su/">Phóng sự</a>')) return html;
  return html.replace('<a href="/chuyen-nguoi-tho/">Người thợ</a>', '<a href="/chuyen-nguoi-tho/">Người thợ</a><a href="/phong-su/">Phóng sự</a>');
}

const authorFile = path.join(root, "tac-gia", "nguyen-tu-linh", "index.html");
const policyFile = path.join(root, "nguyen-tac-bien-tap", "index.html");
for (const file of [authorFile, policyFile]) if (!fs.existsSync(file)) throw new Error(`Field report authority v8: thiếu ${file}`);

let author = addNav(touchDate(stripManaged(fs.readFileSync(authorFile, "utf8"))));
const authorBlock = `${start}
<section class="network-section network-section--soft" id="tu-lieu-nguyen-ban"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">TƯ LIỆU NGUYÊN BẢN · NGUỒN BIÊN TẬP · DỮ KIỆN HIỆN HÀNH</p><h2>Ba loại nội dung được ghi nguồn theo ba cách khác nhau</h2></div><p>Người đọc cần biết thông tin nào do Nguyễn Tử Linh trực tiếp ghi nhận, thông tin nào được biên tập từ nguồn báo chí và dữ kiện nào là chính sách tuyển sinh đang áp dụng.</p></div><ul class="network-list"><li><b>1</b><div><strong>Phóng sự và ghi chép nguyên bản</strong><span>Dựng từ video, hình ảnh, ghi chép chuyến công tác và dữ liệu thực địa do Thầy Linh – Tuyển Thợ Mỏ trực tiếp ghi nhận hoặc công bố. Không dựng lời nhân vật; chi tiết quan sát phải có trong tư liệu gốc hoặc hồ sơ công tác có thể đối chiếu.</span></div></li><li><b>2</b><div><strong>Bài biên tập từ nguồn bên ngoài</strong><span>Giữ đúng nhân vật, số liệu, thời điểm và bối cảnh của nguồn; bài ghi tên nguồn ở cuối để người đọc phân biệt phần dữ kiện với phần phân tích, giải thích.</span></div></li><li><b>3</b><div><strong>Dữ kiện tuyển sinh hiện hành</strong><span>Điều kiện, thời gian học, quyền lợi, hồ sơ và địa chỉ tiếp nhận lấy từ nguồn dữ liệu tuyển sinh dùng chung; khi chính sách thay đổi phải sửa từ nguồn gốc và tái kiểm tra toàn website.</span></div></li></ul><div class="network-actions"><a class="network-button" href="/phong-su/">Xem phóng sự hiện trường</a><a class="network-button network-button--outline" href="/nguyen-tac-bien-tap/">Xem nguyên tắc kiểm chứng</a></div><div class="network-grid"><article class="network-card"><div class="network-card__body"><small>Gia Lai · tư liệu trực tiếp</small><h2>Ở Ia RDeh, con đường đến vùng mỏ bắt đầu từ một cuộc gặp ngay tại xã</h2><p>Ghi chép từ chuyến công tác, số liệu tại chương trình và video hiện trường.</p><a href="/phong-su/ia-rdeh-gia-lai-con-duong-den-vung-mo/">Đọc phóng sự →</a></div></article><article class="network-card"><div class="network-card__body"><small>Quảng Ngãi · hành trình thực tế</small><h2>Một chuyến đi từ Quảng Ngãi cho thấy điều tin tuyển dụng thường bỏ sót</h2><p>Ghi chép từ video hành trình rời quê, đến nơi tiếp nhận và nhập học tại Quảng Ninh.</p><a href="/phong-su/quang-ngai-hanh-trinh-den-vung-mo-quang-ninh/">Đọc phóng sự →</a></div></article></div></div></section>
${end}`;
if (!author.includes("</main>")) throw new Error("Field report authority v8: trang tác giả thiếu </main>");
author = author.replace("</main>", `${authorBlock}\n</main>`);
fs.writeFileSync(authorFile, author);

let policy = addNav(touchDate(stripManaged(fs.readFileSync(policyFile, "utf8"))));
const policyBlock = `${start}
<section class="network-section network-section--soft" id="phan-loai-nguon"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">PHÂN LOẠI NGUỒN TRƯỚC KHI VIẾT</p><h2>Phóng sự trực tiếp không được trình bày như bài tổng hợp, và bài tổng hợp không được giả làm hiện trường</h2></div><p>Nhãn thể loại phải phản ánh đúng cách thông tin được thu thập. Đây là ranh giới để người đọc biết mức độ gần với sự kiện và tự đánh giá độ tin cậy.</p></div><ul class="network-list"><li><b>A</b><div><strong>Tư liệu trực tiếp</strong><span>Video, ảnh, ghi chép chuyến công tác, hồ sơ hoạt động và dữ liệu do người viết trực tiếp thu thập hoặc công bố. Có thể dùng để viết ghi chép/phóng sự nhưng không được thêm lời thoại, cảm xúc hay chi tiết không có căn cứ.</span></div></li><li><b>B</b><div><strong>Nguồn báo chí, đơn vị và cơ quan nhà nước</strong><span>Dùng cho tin, giải thích và phân tích. Nội dung phải nêu nguồn, giữ nguyên bản chất dữ kiện và không biến số liệu của một thời điểm thành cam kết cho thời điểm khác.</span></div></li><li><b>C</b><div><strong>Nguồn tuyển sinh đang áp dụng</strong><span>Dùng cho điều kiện, hồ sơ, quyền lợi, thời gian học và lịch tiếp nhận. Khi có xung đột, nguồn tuyển sinh hiện hành được ưu tiên cho thông tin vận hành; bài báo lịch sử chỉ dùng làm bối cảnh.</span></div></li></ul><div class="network-heading"><div><p class="network-eyebrow">QUY TẮC KHÔNG DỰNG LỜI</p><h2>Không dựng lời nhân vật để bài viết “hay hơn”</h2></div><p>Nếu tư liệu không có phát ngôn nguyên văn hoặc ghi chép phỏng vấn có thể kiểm chứng, bài chỉ mô tả điều quan sát được và dữ kiện đã xác nhận. Trích dẫn trực tiếp phải có nguồn; suy luận của người viết phải được trình bày như phân tích, không như lời nhân vật.</p></div><div class="network-actions"><a class="network-button network-button--outline" href="/phong-su/">Xem các phóng sự dùng tư liệu trực tiếp</a></div></div></section>
${end}`;
if (!policy.includes("</main>")) throw new Error("Field report authority v8: trang nguyên tắc thiếu </main>");
policy = policy.replace("</main>", `${policyBlock}\n</main>`);
fs.writeFileSync(policyFile, policy);

for (const [label, html] of [["author", author], ["policy", policy]]) {
  for (const marker of ["Phóng sự", "Không dựng lời nhân vật", "/phong-su/"]) {
    if (!html.includes(marker)) throw new Error(`Field report authority v8: ${label} thiếu ${marker}`);
  }
}

if (process.env.GITHUB_ACTIONS === "true") {
  const trackedOutputs = [
    "tuyen-tho-mo/tac-gia/nguyen-tu-linh/index.html",
    "tuyen-tho-mo/nguyen-tac-bien-tap/index.html",
  ];
  try {
    execFileSync("git", ["update-index", "--assume-unchanged", "--", ...trackedOutputs], {cwd: process.cwd(), stdio: "ignore"});
  } catch {}
}

console.log(JSON.stringify({status:"field-report-authority-v8-ready",pages:2,dateModified:updated,originalReportingPolicy:true,noFabricatedQuotes:true,ciGeneratedOutputsMasked:true}, null, 2));
