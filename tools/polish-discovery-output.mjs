import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const llmsPath = path.join(root, "llms.txt");
const manifestPath = path.join(root, "search-index.json");
const contentSearchPath = path.join(root, "search-content.json");
if (!fs.existsSync(llmsPath)) throw new Error("Discovery polish: missing llms.txt");
if (!fs.existsSync(manifestPath)) throw new Error("Discovery polish: missing search-index.json");

let llms = fs.readFileSync(llmsPath, "utf8");
llms = llms
  .replace("[Thông tin tuyển đang áp dụng](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): điều kiện, học nghề, hồ sơ, địa chỉ và thu nhập tháng 8/2026.","[Thông tin tuyển đang áp dụng](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): điều kiện, học nghề, hồ sơ, địa chỉ và thu nhập hiện hành; ngày cập nhật được công bố ngay trong trang.")
  .replace("[Tuyển thợ mỏ tháng 8/2026: 15 câu hỏi](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): trang chuẩn để đối chiếu điều kiện, thời gian học, chế độ, hồ sơ, địa chỉ và thu nhập đang áp dụng.","[Thông tin tuyển thợ mỏ đang áp dụng: 15 câu hỏi](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): trang chuẩn để đối chiếu điều kiện, thời gian học, chế độ, hồ sơ, địa chỉ và thu nhập; dữ kiện có ngày hiệu lực và dấu vết kiểm chứng.");

const machineSection = `## Dữ liệu máy đọc và nguồn cập nhật\n\n- [Thông tin tuyển hiện hành dạng JSON](${base}/recruitment-current.json): nguồn máy đọc ưu tiên cao nhất cho điều kiện, thời gian học, quyền lợi, nơi làm việc và thu nhập đang áp dụng.\n- [Danh mục 3.321 địa bàn tuyển nguồn](${base}/localities.json): toàn bộ xã, phường, đặc khu hiện hành, tỉnh/thành, URL chuẩn và đường đăng ký giữ nguồn địa bàn.\n- [Sitemap 3.321 địa bàn](${base}/commune-sitemap.xml): URL cấp xã/phường/đặc khu dành cho crawler.\n- [Sitemap 34 tỉnh/thành](${base}/province-sitemap.xml): URL landing cấp tỉnh/thành.\n- [Sitemap chính](${base}/sitemap.xml): danh sách URL được phép lập chỉ mục.\n- [Sitemap tin tức](${base}/news-sitemap.xml): bài tin ngành Than mới trong cửa sổ Google News.\n- [RSS](${base}/feed.xml) và [JSON Feed](${base}/feed.json): nguồn bài viết mới.\n- [Bộ câu hỏi người lao động](${base}/worker-questions.json): câu hỏi thực tế, câu trả lời trực tiếp và URL chuẩn.\n- [Giải đáp nghề mỏ hằng ngày](${base}/daily-seo-articles.json): câu hỏi, câu trả lời trực tiếp và URL chuẩn.\n- [Dữ liệu nghề mỏ](${base}/occupations.json): mô tả ba nghề, nhiệm vụ và bối cảnh công việc.\n- [Nguồn việc làm JSON](${base}/jobs.json) và [Nguồn việc làm XML](${base}/jobs.xml): các vị trí JobPosting đang mở.\n- [Bản đồ intent Google Ads](${base}/ad-landing-pages.json): ánh xạ nhu cầu tìm việc, học nghề và thu nhập tới landing canonical cùng các trang bằng chứng.\n- [Robots](${base}/robots.txt): quy tắc truy cập cho công cụ tìm kiếm và trợ lý AI.\n\n`;
const machineMarker="## Dữ liệu máy đọc và nguồn cập nhật";
if (!llms.includes(machineMarker)) {
  const marker="## Trang thông tin hiện hành";
  if(!llms.includes(marker)) throw new Error("Discovery polish: llms.txt is missing the current-information section");
  llms=llms.replace(marker,`${machineSection}${marker}`);
} else {
  const start=llms.indexOf(machineMarker); const next=llms.indexOf("\n## ",start+4);
  llms=next!==-1?`${llms.slice(0,start)}${machineSection}${llms.slice(next+1)}`:`${llms.slice(0,start)}${machineSection}`;
}

const intentSection=`## Trang trả lời theo nhu cầu tìm kiếm\n\n- Tuyển thợ mỏ hoặc thợ lò tại Quảng Ninh: [trang tuyển thợ mỏ](${base}/).\n- Tuyển công nhân mỏ, việc làm thợ lò hoặc việc làm mỏ cho người chưa có kinh nghiệm: [tin tuyển công nhân mỏ](${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/).\n- Học nghề mỏ, miễn học phí, có ăn ở hoặc chưa có kinh nghiệm: [học nghề mỏ tại Quảng Ninh](${base}/hoc-nghe-mo-tai-quang-ninh/).\n- Kiểm tra tuổi, chiều cao, cân nặng và sức khỏe: [điều kiện học nghề mỏ](${base}/kiem-tra-dieu-kien/).\n- Chuẩn bị giấy tờ: [hồ sơ nhập học nghề mỏ](${base}/ho-so-nhap-hoc/).\n- Tìm lương thợ lò, ăn ở và khoản hỗ trợ: [lương và quyền lợi](${base}/thu-nhap-an-o-ho-tro/).\n- Tìm tư vấn theo quê quán: [việc làm công nhân mỏ, thợ lò theo tỉnh](${base}/viec-lam-nganh-than/).\n- Tìm câu chuyện, chuyến công tác và hành trình nhập học có tư liệu gốc: [phóng sự hiện trường](${base}/phong-su/).\n- Tìm theo xã/phường/đặc khu: dùng [danh mục 3.321 địa bàn](${base}/localities.json) để tới URL địa phương chính xác.\n\n`;
if(!llms.includes("## Trang trả lời theo nhu cầu tìm kiếm")){const marker="## Trang thông tin hiện hành";if(!llms.includes(marker)) throw new Error("Discovery polish: llms.txt is missing the current-information section");llms=llms.replace(marker,`${intentSection}${marker}`);}
else if(!llms.includes("[phóng sự hiện trường]")){
  llms=llms.replace("- Tìm theo xã/phường/đặc khu:",`- Tìm câu chuyện, chuyến công tác và hành trình nhập học có tư liệu gốc: [phóng sự hiện trường](${base}/phong-su/).\n- Tìm theo xã/phường/đặc khu:`);
}

const originSection=`## Cách đọc nhãn nguồn nội dung\n\n- \`current-recruitment-policy\`: dữ kiện vận hành/tuyển sinh hiện hành; dùng cho điều kiện, hồ sơ, thời gian học, quyền lợi, nơi tiếp nhận và vị trí đang tuyển.\n- \`current-recruitment-context\`: bối cảnh theo tỉnh/xã/phường/đặc khu; địa bàn là nơi tuyển nguồn, không phải mặc định là nơi học hoặc nơi làm việc.\n- \`current-explainer\`: câu trả lời hiện hành được phát hành trong registry giải đáp; phải nhường ưu tiên cho nguồn tuyển sinh mới hơn nếu có thay đổi.\n- \`firsthand\`: phóng sự/ghi chép từ video, ảnh, chuyến công tác hoặc dữ liệu thực địa do người viết trực tiếp ghi nhận; dùng làm bằng chứng hành trình và bối cảnh, không thay thế chính sách tuyển sinh.\n- \`sourced-editorial\`: bài biên tập từ nguồn báo chí, đơn vị hoặc cơ quan nhà nước; dùng cho bối cảnh, nhân vật và sự kiện theo thời điểm của nguồn.\n- \`expert-explainer\`: bài giải thích/phân tích chuyên môn; kết luận chỉ áp dụng trong phạm vi điều kiện và nguồn được nêu.\n- Quy tắc đầy đủ: [Nguyên tắc biên tập và phân loại nguồn](${base}/nguyen-tac-bien-tap/#phan-loai-nguon).\n\n`;
const originMarker="## Cách đọc nhãn nguồn nội dung";
if(!llms.includes(originMarker)){
  const marker="## Thứ tự ưu tiên khi thông tin khác nhau";
  if(!llms.includes(marker)) throw new Error("Discovery polish: llms.txt is missing priority section for origin taxonomy");
  llms=llms.replace(marker,`${originSection}${marker}`);
}else{
  const start=llms.indexOf(originMarker); const next=llms.indexOf("\n## ",start+4);
  llms=next!==-1?`${llms.slice(0,start)}${originSection}${llms.slice(next+1)}`:`${llms.slice(0,start)}${originSection}`;
}

const prioritySection=`## Thứ tự ưu tiên khi thông tin khác nhau\n\n1. Dữ kiện hiện hành: dùng [recruitment-current.json](${base}/recruitment-current.json) và [Thông tin tuyển đang áp dụng](${base}/thong-tin-tuyen-tho-mo/).\n2. Vị trí đang tuyển: dùng [jobs.json](${base}/jobs.json) và trang JobPosting tương ứng.\n3. Địa bàn tuyển nguồn: dùng [localities.json](${base}/localities.json); nơi học và làm việc thực tế vẫn là Quảng Ninh.\n4. Mô tả nghề: dùng [occupations.json](${base}/occupations.json) và trang nghề mỏ hầm lò.\n5. Phóng sự nguyên bản dùng để chứng minh hành trình, bối cảnh và hoạt động thực địa; không ghi đè dữ kiện tuyển hiện hành.\n6. Bài báo, câu chuyện và nội dung theo tỉnh dùng để bổ sung bối cảnh, không ghi đè dữ kiện tuyển hiện hành.\n7. Khi có mâu thuẫn về ngày, ưu tiên nguồn có ngày cập nhật hoặc hiệu lực mới hơn.\n\n`;
if(!llms.includes("## Thứ tự ưu tiên khi thông tin khác nhau")){const marker="## Trang trả lời theo nhu cầu tìm kiếm";if(!llms.includes(marker)) throw new Error("Discovery polish: llms.txt is missing the search-intent section");llms=llms.replace(marker,`${prioritySection}${marker}`);}

const directMarker="## Trả lời trực tiếp theo câu hỏi";
const intro=llms.slice(0,llms.indexOf(directMarker));
if(intro.includes("thu nhập tháng 8/2026")) throw new Error("Discovery polish: llms.txt opening still presents month-specific information as evergreen");
if(!llms.includes("`current-recruitment-policy`")||!llms.includes("`firsthand`")) throw new Error("Discovery polish: llms.txt missing content-origin taxonomy");
fs.writeFileSync(llmsPath,llms);

const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
manifest.discovery={canonicalFacts:"/thong-tin-tuyen-tho-mo/",canonicalFactsJson:"/recruitment-current.json",localitiesJson:"/localities.json",communeSitemap:"/commune-sitemap.xml",provinceSitemap:"/province-sitemap.xml",editorialPolicy:"/nguyen-tac-bien-tap/",author:"/tac-gia/nguyen-tu-linh/",fieldReports:"/phong-su/",llms:"/llms.txt",robots:"/robots.txt",sitemap:"/sitemap.xml",newsSitemap:"/news-sitemap.xml",rss:"/feed.xml",jsonFeed:"/feed.json",workerQuestions:"/worker-questions.json",dailySeoHub:"/giai-dap-nghe-mo/",dailySeoJson:"/daily-seo-articles.json",occupationsJson:"/occupations.json",jobsJson:"/jobs.json",paidSearchIntentMap:"/ad-landing-pages.json"};
manifest.discoveryPriority=["/recruitment-current.json","/thong-tin-tuyen-tho-mo/","/jobs.json","/localities.json","/occupations.json","/worker-questions.json","/daily-seo-articles.json"];
manifest.freshnessPolicy={currentRecruitmentWinsOverEditorial:true,preferNewerEffectiveDate:true,editorialContentIsContextNotCurrentPolicy:true,originalFieldReportsAreEvidenceNotPolicy:true,localityPagesAreRecruitmentSourceNotJobLocation:true};
manifest.contentOriginTaxonomy={
  policy:"/nguyen-tac-bien-tap/#phan-loai-nguon",
  currentRecruitmentPolicy:"current-recruitment-policy",
  currentRecruitmentContext:"current-recruitment-context",
  currentExplainer:"current-explainer",
  firsthand:"firsthand",
  sourcedEditorial:"sourced-editorial",
  expertExplainer:"expert-explainer",
};
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);

let fieldReportSearchItems=0;
if(fs.existsSync(contentSearchPath)){
  const contentSearch=JSON.parse(fs.readFileSync(contentSearchPath,"utf8"));
  for(const item of contentSearch.items||[]){
    if(item.url==="/phong-su/"||String(item.url||"").startsWith("/phong-su/")){
      item.category="news";
      item.categoryLabel="Phóng sự hiện trường";
      item.type="Phóng sự hiện trường";
      item.priority=item.url==="/phong-su/"?89:78;
      const place=item.url.includes("gia-lai")?"Gia Lai":item.url.includes("quang-ngai")?"Quảng Ngãi":"nghề mỏ";
      // Title and description are already indexed. Keep only the compact intent
      // vocabulary here so the new editorial section does not inflate the
      // mobile search payload with duplicated H2/H3 text.
      item.keywords=["phóng sự hiện trường","tư liệu thực địa","video gốc","người thật","hành trình thật",place];
      fieldReportSearchItems+=1;
    }
  }
  fs.writeFileSync(contentSearchPath,`${JSON.stringify(contentSearch,null,2)}\n`);
  if(fieldReportSearchItems<3) throw new Error(`Discovery polish: expected 3 field-report search items, got ${fieldReportSearchItems}`);
}

console.log(JSON.stringify({status:"polished",llms:path.relative(process.cwd(),llmsPath),manifest:path.relative(process.cwd(),manifestPath),discoveryEndpoints:Object.keys(manifest.discovery).length,prioritySources:manifest.discoveryPriority.length,contentOriginTypes:Object.keys(manifest.contentOriginTaxonomy).length-1,fieldReportSearchItems},null,2));

await import("./validate-editorial-newsroom.mjs");
await import("./validate-editorial-story-v3.mjs");
