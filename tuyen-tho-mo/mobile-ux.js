(() => {
  "use strict";

  const ROOT = "https://thaylinhtuyenthomo.vn";
  const APPLICATION_URL = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky";
  const ZALO_URL = "https://zalo.me/0963048585";
  const MESSENGER_URL = "https://m.me/thaylinhtuyenthomo";
  const DRAFT_KEY = "thaylinh_application_draft_v1";
  const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
  const SEARCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
  const MESSENGER_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.5 2 2 6.14 2 11.25c0 2.91 1.46 5.5 3.74 7.2V22l3.42-1.88c.9.25 1.86.38 2.84.38 5.5 0 10-4.14 10-9.25S17.5 2 12 2Zm1 12.45-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.93-2.72L13 14.45Z"></path></svg>';
  const WORKER_SHORTCUTS = [
    { key: "conditions", label: "Điều kiện", question: "Tôi có đủ điều kiện?", href: "/#dieu-kien" },
    { key: "benefits", label: "Quyền lợi", question: "Được hỗ trợ những gì?", href: "/#quyen-loi" },
    { key: "dossier", label: "Hồ sơ", question: "Hồ sơ gồm giấy tờ gì?", href: "/#ho-so" },
    { key: "address", label: "Nơi học", question: "Học và nhập học ở đâu?", href: "/#dia-diem" },
    { key: "province", label: "Theo tỉnh", question: "Xem thông tin tỉnh tôi", href: "/viec-lam-nganh-than/" },
  ];

  const categories = [
    ["all", "Tất cả"],
    ["entry", "Điều kiện & hồ sơ"],
    ["training", "Học nghề"],
    ["work", "Công việc & lương"],
    ["welfare", "Đời sống & phúc lợi"],
    ["technology", "An toàn & công nghệ"],
    ["province", "Theo tỉnh"],
    ["news", "Tin ngành Than"],
  ];

  const popular = [
    {
      url: "/bai-viet/dieu-kien-tuyen-tho-lo-2026/",
      title: "Điều kiện tuyển thợ lò 2026",
      description: "Độ tuổi, chiều cao, cân nặng và sức khỏe cần kiểm tra trước.",
      type: "Điều kiện & hồ sơ",
      category: "entry",
    },
    {
      url: "/bai-viet/ho-so-hoc-nghe-mo-can-gi/",
      title: "Hồ sơ học nghề mỏ cần gì?",
      description: "Danh sách giấy tờ ngắn gọn để chuẩn bị đúng ngay từ đầu.",
      type: "Điều kiện & hồ sơ",
      category: "entry",
    },
    {
      url: "/bai-viet/13500-tho-lo-thu-nhap-tren-300-trieu-2025/",
      title: "13.507 thợ lò thu nhập trên 300 triệu đồng/năm",
      description: "Đọc số liệu năm 2025 và chính sách cam kết thu nhập khi hoàn thành định mức lao động.",
      type: "Công việc & lương",
      category: "work",
    },
    {
      url: "/bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/",
      title: "Học nghề khai thác mỏ 2–3 tháng",
      description: "Nội dung học, thực hành và lộ trình trước khi nhận việc.",
      type: "Học nghề",
      category: "training",
    },
    {
      url: "/bai-viet/nghe-tho-lo-co-on-dinh-khong/",
      title: "Nghề thợ lò có ổn định không?",
      description: "Các yếu tố quyết định khả năng gắn bó lâu dài với nghề.",
      type: "Công việc & lương",
      category: "work",
    },
    {
      url: "/tin-nganh-than/",
      title: "Toàn bộ cẩm nang và tin ngành Than",
      description: "Xem thư viện bài viết được chia theo từng nhu cầu tìm kiếm.",
      type: "Cẩm nang nghề mỏ",
      category: "news",
    },
  ];

  let searchIndex = null;
  let searchPromise = null;
  let activeCategory = "all";
  let lastFocused = null;

  const normalize = (value) => String(value || "")
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const SEARCH_STOP_WORDS = new Set([
    "a", "anh", "bao", "bi", "can", "chi", "cho", "chua", "co", "cua", "dau", "de", "di", "duoc",
    "em", "gi", "gom", "hay", "hoac", "hoi", "k", "khong", "ko", "la", "lam", "may", "minh", "muon",
    "nao", "neu", "nhe", "nhieu", "nhu", "o", "oi", "phai", "que", "roi", "the", "thi", "toi", "va",
    "van", "vay", "viec",
  ]);

  const SEARCH_INTENTS = [
    {
      url: "/#dieu-kien",
      bonus: 360,
      patterns: [
        /\b(dieu kien|bao nhieu tuoi|nam sinh|gioi tinh|nu|con gai|chieu cao|can nang|suc khoe|bi can|can thi|thi luc|benh mat|benh tim|tim mach|huyet ap)\b/,
        /\b\d{2}\s*tuoi\b/,
        /\b\d(?:[.,]?m|m)\d{1,2}\b/,
        /\b\d{2,3}\s*(?:kg|can)\b/,
      ],
    },
    {
      url: "/#quyen-loi",
      bonus: 360,
      patterns: [/\b(luong+|thu nhap|muc luong|luong bn|bao nhieu tien|dinh muc|quyen loi)\b/],
    },
    {
      url: "/#thoi-gian-hoc",
      bonus: 360,
      patterns: [/\b(hoc bao lau|hoc may thang|thoi gian hoc|2 3 thang|10 thang|co dien mo|khai thac mo|xay dung mo)\b/],
    },
    {
      url: "/#ho-tro-hoc-nghe",
      bonus: 360,
      patterns: [/\b(hoc phi|mien hoc phi|mat tien|dong tien|an o|ky tuc xa|ktx|ho tro|7 5 trieu|ba bua|3 bua)\b/],
    },
    {
      url: "/#ho-so",
      bonus: 360,
      patterns: [/\b(ho so|hs|hso|giay to|cccd|can cuoc|khai sinh|bang cap|tieu hoc|cap 2|thcs|cap 3|thpt|mat bang|khong co bang|chua co bang)\b/],
    },
    {
      url: "/#dia-diem",
      bonus: 380,
      patterns: [/\b(dia chi|noi hoc|hoc o dau|nhap hoc o dau|quang hanh|khu c|truong o dau)\b/],
    },
    {
      url: "/#noi-lam-viec",
      bonus: 380,
      patterns: [/\b(lam o dau|noi lam viec|cong ty nao|doanh nghiep nao|lam tai dau)\b/],
    },
    {
      url: "/#quy-trinh",
      bonus: 380,
      patterns: [/\b(quy trinh|dang ky the nao|dang ky nhu nao|cac buoc|lich nhap hoc|bao gio nhap hoc|khi nao nhap hoc|bao gio di hoc|khi nao di hoc)\b/],
    },
    {
      url: "/#dang-ky",
      bonus: 320,
      patterns: [/\b(dang ky|ung tuyen|nop ho so|gui thong tin|sdt|so dien thoai|zalo|lien he|goi dien)\b/],
    },
  ];

  function meaningfulQueryTerms(value) {
    return normalize(value)
      .split(" ")
      .filter((word) => word && !SEARCH_STOP_WORDS.has(word));
  }

  function queryIntentScores(value) {
    const query = normalize(value);
    const scores = new Map();
    for (const intent of SEARCH_INTENTS) {
      const hits = intent.patterns.filter((pattern) => pattern.test(query)).length;
      if (hits) scores.set(intent.url, intent.bonus + (hits - 1) * 20);
    }
    return scores;
  }

  function provinceAliases(item) {
    if (item?.category !== "province") return [];
    const aliases = [];
    const titleMatch = String(item.title || "").match(/tại\s+(.+?)(?:\s*\||$)/i);
    if (titleMatch?.[1]) aliases.push(normalize(titleMatch[1]));
    for (const keyword of Array.isArray(item.keywords) ? item.keywords : []) {
      const match = String(keyword).match(/(?:tuyển thợ mỏ|tuyển dụng ngành than|học nghề mỏ|việc làm thợ lò|việc làm ngành than)\s+(.+)$/i);
      if (match?.[1]) aliases.push(normalize(match[1]));
    }
    return [...new Set(aliases.filter((alias) => alias.length >= 3))];
  }

  function pageGroup() {
    const segment = location.pathname.split("/").filter(Boolean)[0] || "home";
    if (["bai-viet", "tin-nganh-than"].includes(segment)) return "article";
    if (segment === "viec-lam-nganh-than") return "province";
    if (segment === "viec-lam") return "job";
    return segment.replace(/[^a-z0-9-]/gi, "").slice(0, 32) || "other";
  }

  function trackedApplicationUrl(campaign, content) {
    const url = new URL(APPLICATION_URL, ROOT);
    url.searchParams.set("utm_source", "website");
    url.searchParams.set("utm_medium", "internal");
    url.searchParams.set("utm_campaign", campaign);
    url.searchParams.set("utm_content", content);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function trackUi(event, payload = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page_path: location.pathname, ...payload });
  }

  function createWorkerCompass() {
    const pathname = location.pathname.replace(/\/index\.html$/i, "/");
    if (pathname === "/" || document.querySelector(".tl-worker-compass")) return;
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    if (!main) return;
    const group = pageGroup();
    const nav = document.createElement("nav");
    nav.className = "tl-worker-compass";
    nav.setAttribute("aria-label", "Tìm nhanh thông tin tuyển thợ mỏ");
    nav.innerHTML = `<div class="tl-worker-compass__inner"><strong>Cần xem:</strong><div>${WORKER_SHORTCUTS.map(({ key, label, href }) => `<a href="${href}" data-worker-shortcut="${key}">${label}</a>`).join("")}<button type="button" data-open-site-search data-worker-shortcut="search" aria-haspopup="dialog">${SEARCH_ICON}<span>Tìm kiếm</span></button><a class="tl-worker-compass__apply" href="${trackedApplicationUrl("worker_compass_2026", `compass_${group}`)}" data-contact="application" data-context="worker-compass" data-worker-shortcut="application">Ứng tuyển</a></div></div>`;
    nav.addEventListener("click", (event) => {
      const target = event.target.closest?.("[data-worker-shortcut]");
      if (target) trackUi("worker_compass_click", { destination: target.dataset.workerShortcut || "unknown", page_group: group });
    });
    if (header?.insertAdjacentElement) header.insertAdjacentElement("afterend", nav);
    else main.parentNode?.insertBefore(nav, main);
  }

  function hasActiveApplicationDraft() {
    try {
      const stored = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      const savedAt = Date.parse(stored?.saved_at || "");
      const active = Boolean(stored?.values && typeof stored.values === "object")
        && Number.isFinite(savedAt)
        && Date.now() - savedAt <= DRAFT_TTL_MS
        && savedAt <= Date.now() + 60_000;
      if (!active) localStorage.removeItem(DRAFT_KEY);
      return active;
    } catch (_) {
      try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
      return false;
    }
  }

  function updateApplicationResumeLabels(activeDraft) {
    if (!activeDraft) return;
    document.querySelectorAll("[data-application-resume-label]").forEach((label) => {
      label.textContent = "Tiếp tục hồ sơ";
      if (label.matches("a, button")) label.setAttribute("aria-label", "Tiếp tục hồ sơ ứng tuyển đã lưu");
    });
  }

  function createContactButtons() {
    if (document.querySelector(".tl-mobile-contact")) return;
    const activeDraft = hasActiveApplicationDraft();
    const pageApplication = document.querySelector('.mobile-contact a[data-contact="application"], a[href*="#dang-ky"]');
    let applicationUrl = APPLICATION_URL;
    if (pageApplication) {
      try {
        const resolved = new URL(pageApplication.getAttribute("href"), location.href);
        if (resolved.origin === location.origin) applicationUrl = `${resolved.pathname}${resolved.search}${resolved.hash}`;
      } catch (_) {}
    }
    const nav = document.createElement("nav");
    nav.className = "tl-mobile-contact";
    nav.setAttribute("aria-label", "Ứng tuyển và liên hệ nhanh");
    nav.innerHTML = `
      <a class="tl-mobile-contact__application" href="${applicationUrl}" aria-label="${activeDraft ? "Tiếp tục hồ sơ ứng tuyển đã lưu" : "Ứng tuyển và kiểm tra điều kiện"}" data-contact="application" data-context="mobile-floating">
        <b aria-hidden="true">✓</b><span data-application-resume-label>${activeDraft ? "Tiếp tục" : "Ứng tuyển"}</span>
      </a>
      <a class="tl-mobile-contact__zalo" href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo cho Thầy Linh theo số 096 304 8585" data-contact="zalo" data-context="mobile-floating">
        <b aria-hidden="true">Z</b><span>Zalo</span>
      </a>
      <a class="tl-mobile-contact__messenger" href="${MESSENGER_URL}" target="_blank" rel="noopener noreferrer" aria-label="Nhắn Messenger cho Thầy Linh" data-contact="messenger" data-context="mobile-floating">
        ${MESSENGER_ICON}<span>Messenger</span>
      </a>`;
    document.body.append(nav);
    updateApplicationResumeLabels(activeDraft);
  }

  function createSearchDialog() {
    const dialog = document.createElement("dialog");
    dialog.className = "tl-search-dialog";
    dialog.setAttribute("aria-labelledby", "tl-search-title");
    dialog.innerHTML = `
      <div class="tl-search-dialog__header">
        <div><span class="tl-search-dialog__eyebrow">Tìm nhanh trên website</span><h2 id="tl-search-title">Nội dung ngành mỏ bạn cần</h2></div>
        <button class="tl-search-dialog__close" type="button" aria-label="Đóng tìm kiếm">×</button>
      </div>
      <form class="tl-search-dialog__form" role="search">
        <label class="tl-search-input-wrap">
          ${SEARCH_ICON}
          <span class="tl-visually-hidden">Từ khóa tìm kiếm</span>
          <input type="search" inputmode="search" autocomplete="off" enterkeyhint="search" placeholder="Gõ cả câu, ví dụ: lương bao nhiêu?">
        </label>
      </form>
      <nav class="tl-search-shortcuts" aria-label="Câu hỏi được tìm nhiều">
        ${WORKER_SHORTCUTS.map(({ key, question, href }) => `<a href="${href}" data-worker-shortcut="search_${key}">${question}</a>`).join("")}
        <a class="tl-search-shortcuts__apply" href="${trackedApplicationUrl("search_to_application_2026", `search_${pageGroup()}`)}" data-contact="application" data-context="search-shortcut" data-worker-shortcut="search_application">Đăng ký ngay</a>
      </nav>
      <div class="tl-search-categories" role="group" aria-label="Lọc theo chủ đề">
        ${categories.map(([key, label]) => `<button type="button" data-search-category="${key}" aria-pressed="${key === "all"}">${label}</button>`).join("")}
      </div>
      <p class="tl-search-status" role="status" aria-live="polite">Các nội dung được xem nhiều</p>
      <div class="tl-search-results" tabindex="-1"><div class="tl-search-results__grid"></div></div>`;
    document.body.append(dialog);
    return dialog;
  }

  function insertSearchButton(openSearch) {
    const header = document.querySelector(".site-header .header-inner") || document.querySelector(".site-header");
    if (!header || header.querySelector(".tl-site-search-button, [data-open-site-search]")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tl-site-search-button";
    button.setAttribute("aria-label", "Tìm nội dung ngành mỏ");
    button.setAttribute("aria-haspopup", "dialog");
    button.title = "Tìm nội dung ngành mỏ";
    button.innerHTML = `${SEARCH_ICON}<span class="tl-visually-hidden">Tìm nội dung ngành mỏ</span>`;
    button.addEventListener("click", openSearch);
    const anchor = header.querySelector("[data-menu-button], .menu-toggle, .back-link, .header-cta");
    header.insertBefore(button, anchor || null);
  }

  function safeUrl(value) {
    try {
      const url = new URL(value, ROOT);
      return url.origin === ROOT ? `${url.pathname}${url.search}${url.hash}` : "/tin-nganh-than/";
    } catch {
      return "/tin-nganh-than/";
    }
  }

  function itemSearchText(item) {
    if (!item._searchText) {
      item._searchText = normalize([
        item.title,
        item.description,
        item.type,
        item.categoryLabel,
        ...(Array.isArray(item.keywords) ? item.keywords : []),
      ].join(" "));
    }
    return item._searchText;
  }

  function oneEditApart(left, right) {
    if (left === right) return true;
    if (Math.min(left.length, right.length) < 4 || Math.abs(left.length - right.length) > 1) return false;
    let leftIndex = 0;
    let rightIndex = 0;
    let edits = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] === right[rightIndex]) {
        leftIndex += 1;
        rightIndex += 1;
        continue;
      }
      edits += 1;
      if (edits > 1) return false;
      if (left.length > right.length) leftIndex += 1;
      else if (right.length > left.length) rightIndex += 1;
      else {
        leftIndex += 1;
        rightIndex += 1;
      }
    }
    return edits + Number(leftIndex < left.length || rightIndex < right.length) <= 1;
  }

  function scoreItem(item, rawQuery) {
    const query = normalize(rawQuery);
    if (!query) return Number(item.priority || 0);
    const title = normalize(item.title);
    const keywords = normalize((item.keywords || []).join(" "));
    const description = normalize(item.description);
    const words = meaningfulQueryTerms(query);
    const intentBonus = queryIntentScores(query).get(item.url) || 0;
    const provinceExactBonus = provinceAliases(item).some((alias) => ` ${query} `.includes(` ${alias} `)) ? 700 : 0;
    const indexedWords = itemSearchText(item).split(" ");
    const hasWord = (word) => indexedWords.some((candidate) => candidate === word
      || (word.length >= 4 && candidate.startsWith(word))
      || oneEditApart(candidate, word));
    const matchedWords = words.filter(hasWord);
    const coverage = words.length ? matchedWords.length / words.length : 0;
    if (!intentBonus && !provinceExactBonus && (!matchedWords.length || (words.length > 1 && coverage < 0.6))) return -1;
    let score = Number(item.priority || 0) + intentBonus + provinceExactBonus + Math.round(coverage * 30);
    if (title === query) score += 80;
    if (title.startsWith(query)) score += 40;
    if (title.includes(query)) score += 24;
    if (keywords.includes(query)) score += 14;
    if (description.includes(query)) score += 6;
    score += matchedWords.filter((word) => title.includes(word)).length * 7;
    if (item.category === "province" && words.length && words.every((word) => title.includes(word) || keywords.includes(word))) score += 120;
    return score;
  }

  if (typeof document === "undefined" && typeof process !== "undefined" && process?.env?.TL_SEARCH_TEST_ONLY === "1") {
    window.__TL_SEARCH_INTERNALS__ = { normalize, meaningfulQueryTerms, queryIntentScores, provinceAliases, oneEditApart, scoreItem };
    return;
  }

  function renderResults(dialog) {
    const input = dialog.querySelector("input[type='search']");
    const status = dialog.querySelector(".tl-search-status");
    const grid = dialog.querySelector(".tl-search-results__grid");
    const rawQuery = input.value;
    const query = normalize(rawQuery);
    const source = searchIndex || popular;
    let candidates = source.filter((item) => activeCategory === "all" || item.category === activeCategory);
    let matches = candidates
      .map((item) => ({ item, score: scoreItem(item, rawQuery) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "vi"))
      .slice(0, 12)
      .map(({ item }) => item);

    grid.replaceChildren();
    let showingFallback = false;
    if (!matches.length && query) {
      const fallbackUrls = ["/#dieu-kien", "/#ho-so", "/#dia-diem", "/#dang-ky"];
      matches = fallbackUrls.map((url) => source.find((item) => item.url === url)).filter(Boolean);
      showingFallback = matches.length > 0;
    }
    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "tl-search-empty";
      empty.innerHTML = `<strong>Chưa tìm thấy nội dung phù hợp</strong><span>Chọn một mục bên dưới hoặc nhắn trực tiếp để được hướng dẫn.</span><div class="tl-search-empty__actions"><a href="/#dieu-kien" data-worker-shortcut="empty_conditions">Điều kiện</a><a href="/#ho-so" data-worker-shortcut="empty_dossier">Hồ sơ</a><a href="/#dia-diem" data-worker-shortcut="empty_address">Nơi học</a><a href="${ZALO_URL}" target="_blank" rel="noopener" data-contact="zalo" data-context="search-empty" data-worker-shortcut="empty_zalo">Hỏi qua Zalo</a></div>`;
      grid.append(empty);
      status.textContent = "Không có kết quả";
      return;
    }

    if (showingFallback) {
      const empty = document.createElement("div");
      empty.className = "tl-search-empty";
      empty.style.gridColumn = "1 / -1";
      empty.innerHTML = "<strong>Chưa khớp chính xác câu hỏi này</strong><span>Chọn một trong 4 mục gần nhất dưới đây để xem ngay.</span>";
      grid.append(empty);
    }

    for (const item of matches) {
      const link = document.createElement("a");
      link.className = "tl-search-result";
      link.href = safeUrl(item.url);
      const type = document.createElement("small");
      type.textContent = item.type || item.categoryLabel || "Cẩm nang nghề mỏ";
      const title = document.createElement("strong");
      title.textContent = item.title;
      const description = document.createElement("span");
      description.textContent = item.description || "Xem nội dung chi tiết.";
      link.append(type, title, description);
      grid.append(link);
    }
    status.textContent = showingFallback
      ? "4 lối đi nhanh gần nhất"
      : query || activeCategory !== "all"
        ? `${matches.length} nội dung phù hợp`
        : "Các nội dung được xem nhiều";
  }

  async function loadSearchIndex(dialog) {
    if (searchIndex) return;
    if (!searchPromise) {
      searchPromise = fetch("/search-index.json", { credentials: "same-origin", cache: "no-cache" })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((payload) => {
          searchIndex = Array.isArray(payload) ? payload : payload.items;
          if (!Array.isArray(searchIndex)) throw new Error("Invalid search index");
          return searchIndex;
        })
        .catch(() => {
          searchIndex = popular;
          return searchIndex;
        });
    }
    await searchPromise;
    renderResults(dialog);
  }

  function setupSearch() {
    let dialog = null;
    let input = null;

    const closeSearch = () => {
      if (!dialog) return;
      if (typeof dialog.close === "function" && dialog.open) dialog.close();
      else dialog.removeAttribute("open");
      document.documentElement.classList.remove("tl-search-open");
      if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
    };

    const ensureSearchDialog = () => {
      if (dialog) return dialog;
      dialog = createSearchDialog();
      input = dialog.querySelector("input[type='search']");
      dialog.querySelector(".tl-search-dialog__close").addEventListener("click", closeSearch);
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeSearch();
      });
      dialog.addEventListener("click", (event) => {
        const shortcut = event.target.closest?.("[data-worker-shortcut]");
        if (shortcut) trackUi("worker_search_shortcut", { destination: shortcut.dataset.workerShortcut || "unknown" });
        const rect = dialog.getBoundingClientRect();
        const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
        if (outside) closeSearch();
      });
      input.addEventListener("input", () => renderResults(dialog));
      dialog.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();
        renderResults(dialog);
      });
      dialog.querySelectorAll("[data-search-category]").forEach((button) => {
        button.addEventListener("click", () => {
          activeCategory = button.dataset.searchCategory;
          dialog.querySelectorAll("[data-search-category]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
          renderResults(dialog);
        });
      });
      return dialog;
    };

    const openSearch = (event) => {
      const activeDialog = ensureSearchDialog();
      lastFocused = event?.currentTarget instanceof HTMLElement ? event.currentTarget : document.activeElement;
      if (typeof activeDialog.showModal === "function") activeDialog.showModal();
      else activeDialog.setAttribute("open", "");
      document.documentElement.classList.add("tl-search-open");
      renderResults(activeDialog);
      loadSearchIndex(activeDialog);
      requestAnimationFrame(() => input?.focus({ preventScroll: true }));
    };

    insertSearchButton(openSearch);
    document.querySelectorAll("[data-open-site-search]").forEach((button) => button.addEventListener("click", openSearch));
  }

  createWorkerCompass();
  createContactButtons();
  document.documentElement.classList.add("tl-mobile-ux-ready");
  setupSearch();
})();
