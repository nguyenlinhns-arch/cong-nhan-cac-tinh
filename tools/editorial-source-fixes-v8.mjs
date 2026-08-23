import {pressStoryArticles} from "./press-story-articles.mjs";

const changed = [];

function getArticle(slug) {
  const article = pressStoryArticles.find((item) => item.slug === slug);
  if (!article) throw new Error(`editorial-source-fixes-v8: không tìm thấy ${slug}`);
  return article;
}

{
  const article = getArticle("ma-khac-huynh-nguoi-mo-duong-trong-long-dat");
  article.intro = [
    "Ngày làm việc của Bùi Văn Tuyên bắt đầu từ sáng sớm. Trước khi rời nơi ở công nhân, anh gọi về nhà, kiểm tra trang bị rồi chuẩn bị vào ca tại Công ty Than Hòn Gai.",
    "Phía sau nhịp sinh hoạt ấy là một quyết định lớn. Sau nhiều năm làm việc ở quê, anh Tuyên chọn rời công việc quen thuộc để học và làm một nghề mới tại Quảng Ninh. Ma Khắc Huỳnh đi theo con đường khác: xác định hướng học mỏ từ năm lớp 12 rồi làm công việc đào đường lò từ năm 2015. Hai điểm xuất phát khác nhau gặp nhau ở quá trình học nghề, thích nghi với ca kíp và làm việc trong tổ đội.",
  ];
  const section = article.sections?.find((item) => /Ma Khắc Huỳnh chọn nghề/u.test(item.title || ""));
  if (!section?.paragraphs?.length) throw new Error("editorial-source-fixes-v8: thiếu phần Ma Khắc Huỳnh");
  section.paragraphs[0] = "Khác với anh Tuyên, Ma Khắc Huỳnh chuẩn bị cho nghề mỏ từ sớm. Sau phổ thông, anh theo học chuyên ngành mỏ rồi vào Than Hòn Gai năm 2015, nhận nhiệm vụ tại tổ đào lò, lực lượng mở đường cho các công đoạn khai thác phía sau.";
  changed.push(article.slug);
}

const forbidden = [
  /\bbài\s+(?:viết|báo)\s+(?:cho\s+thấy|nêu|ghi\s+nhận|mô\s+tả)\b/iu,
  /đào\s+lò,lực\s+lượng/iu,
  /\bĐáng\s+chú\s+ý(?:\s+là)?\b/iu,
  /\bĐây\s+không\s+chỉ\s+là\b/iu,
  /\bTrọng\s+tâm\s+không\s+chỉ\s+là\b/iu,
  /\bkhông\s+chỉ\b[^.!?]{0,120}\bmà\s+còn\b/iu,
];

for (const slug of changed) {
  const article = getArticle(slug);
  const text = JSON.stringify({intro: article.intro, sections: article.sections});
  for (const pattern of forbidden) {
    if (pattern.test(text)) throw new Error(`${slug}: source sau sửa vẫn còn khuôn câu/lỗi dấu câu ${pattern}`);
  }
}

console.log(JSON.stringify({
  status: "editorial-source-fixes-v8-ready",
  changed,
  sourceLevel: true,
  errors: 0,
}, null, 2));
