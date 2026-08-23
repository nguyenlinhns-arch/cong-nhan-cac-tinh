import {communityArticles as baseCommunityArticles} from "./community-articles-base.mjs";
import {dailyCommunityArticles} from "./daily-community-articles-all.mjs";

const dailySlugs = new Set(dailyCommunityArticles.map((article) => article.slug));
const combinedArticles = [
  ...baseCommunityArticles.filter((article) => !dailySlugs.has(article.slug)),
  ...dailyCommunityArticles,
];

const capitalizeInitial = (text) => text.replace(
  /^(\s*)(\p{Ll})/u,
  (_, spacing, initial) => `${spacing}${initial.toLocaleUpperCase("vi")}`,
);

const removeMechanicalAttribution = (text) => {
  const cleaned = text
    .replace(/Bài nguồn ngày \d{2}\/\d{2}\/\d{4} nêu\s*/gu, "")
    .replace(/Nguồn cho biết\s*/gu, "")
    .replace(/\s{2,}/gu, " ");

  return cleaned === text ? text : capitalizeInitial(cleaned);
};

const polishEditorialValue = (value) => {
  if (Array.isArray(value)) return value.map(polishEditorialValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, polishEditorialValue(nestedValue)]),
    );
  }
  return typeof value === "string" ? removeMechanicalAttribution(value) : value;
};

const polishDamHaArticle = (article) => {
  if (article.slug !== "dam-ha-than-thong-nhat-dao-tao-viec-lam-2026") return article;

  return {
    ...article,
    updated: "2026-08-03T18:00:00+07:00",
    title: "Đầm Hà hợp tác Than Thống Nhất đào tạo nghề mỏ, tạo việc làm",
    description: "Đầm Hà, Than Thống Nhất và Trường Cao đẳng TKV phối hợp đào tạo nghề mỏ, hỗ trợ học viên và bố trí việc làm ngành Than giai đoạn 2026–2030.",
    lead: "Thỏa thuận ba bên mở thêm con đường học nghề mỏ và làm việc tại Quảng Ninh cho thanh niên, lao động nông thôn và người dân tộc thiểu số ở Đầm Hà.",
    intro: [
      "<strong>Đào tạo nghề mỏ Đầm Hà 2026</strong> được triển khai từ nhu cầu rất thực: thanh niên địa phương cần việc làm ổn định, còn Than Thống Nhất cần nguồn lao động có sức khỏe, tay nghề và kỷ luật. Ngày 22/05/2026, Công ty, UBND xã Đầm Hà và Trường Cao đẳng TKV ký biên bản hợp tác đào tạo nghề, giải quyết việc làm giai đoạn 2026–2030.",
      "Chương trình hướng tới thanh niên dân tộc thiểu số, lao động nông thôn và người chưa có việc làm ổn định. Nội dung tư vấn được đặt trong một bức tranh đầy đủ, từ công nghệ, an toàn, dinh dưỡng và phúc lợi đến quá trình học nghề mỏ hầm lò và cơ hội làm việc tại Quảng Ninh.",
    ],
    sections: article.sections.map((section) => {
      if (section.title === "Doanh nghiệp công bố thu nhập thợ lò trên 26 triệu đồng/tháng") {
        return {
          ...section,
          title: "Thu nhập thợ lò Than Thống Nhất trên 26 triệu đồng/tháng",
          paragraphs: [
            "Mức thu nhập hiện tại của thợ lò tại Than Thống Nhất đạt trên 26 triệu đồng/người/tháng, đi kèm các chế độ bảo hiểm và phúc lợi. Con số thực tế này cho thấy sức hút của việc làm ngành Than đối với người lao động có sức khỏe, tay nghề và khả năng duy trì năng suất ổn định.",
            "Với chương trình tuyển sinh đang áp dụng, người lao động hoàn thành định mức lao động được Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động. Đây là nền tảng để người đăng ký cân nhắc học nghề mỏ và xây dựng kế hoạch làm việc lâu dài tại Quảng Ninh.",
          ],
        };
      }

      if (section.title === "Hỗ trợ học phí, nội trú và sinh hoạt phải theo đúng khóa") {
        return {
          ...section,
          title: "Học nghề mỏ hầm lò được miễn học phí, bố trí nội trú",
          paragraphs: [
            "Người học nghề mỏ hầm lò theo chỉ tiêu được miễn học phí, bố trí chỗ ở ký túc xá, phục vụ ba bữa ăn mỗi ngày và hỗ trợ 7,5 triệu đồng/tháng sinh hoạt phí trong thời gian đào tạo. Sau khi hoàn thành khóa học và đạt yêu cầu, học viên được bố trí việc làm tại các đơn vị ngành Than ở Quảng Ninh.",
          ],
        };
      }

      return section;
    }),
  };
};

export const communityArticles = combinedArticles
  .map(polishDamHaArticle)
  .map(polishEditorialValue);

for (const article of communityArticles) {
  const serialized = JSON.stringify(article);
  for (const forbiddenPhrase of ["Bài nguồn ngày", "Nguồn cho biết"]) {
    if (serialized.includes(forbiddenPhrase)) {
      throw new Error(`Bài ${article.slug} còn cụm diễn đạt máy móc: ${forbiddenPhrase}`);
    }
  }
}
