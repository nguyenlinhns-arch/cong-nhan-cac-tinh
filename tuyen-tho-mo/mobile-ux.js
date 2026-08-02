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

  const normalizePhrase = (value) => String(value || "")
    .toLocaleLowerCase("vi")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

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
          <input type="search" inputmode="search" autocomplete="off" enterkeyhint="search" placeholder="Ví dụ: điều kiện, hồ sơ, lương, Nghệ An…">
        </label>
      </form>
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
    if (!header || header.querySelector(".tl-site-search-button")) return;
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

  function itemPhraseText(item) {
    if (!item._phraseText) {
      item._phraseText = normalizePhrase([
        item.title,
        item.description,
        ...(Array.isArray(item.keywords) ? item.keywords : []),
      ].join(" "));
    }
    return item._phraseText;
  }

  function scoreItem(item, query) {
    if (!query) return Number(item.priority || 0);
    const title = normalize(item.title);
    const keywords = normalize((item.keywords || []).join(" "));
    const description = normalize(item.description);
    const words = query.split(" ").filter(Boolean);
    const indexedWords = itemSearchText(item).split(" ");
    const hasWord = (word) => indexedWords.some((candidate) => candidate === word || (word.length >= 3 && candidate.startsWith(word)));
    if (!words.every(hasWord)) return -1;
    let score = Number(item.priority || 0);
    if (title === query) score += 80;
    if (title.startsWith(query)) score += 40;
    if (title.includes(query)) score += 24;
    if (keywords.includes(query)) score += 14;
    if (description.includes(query)) score += 6;
    score += words.filter((word) => title.includes(word)).length * 7;
    return score;
  }

  function renderResults(dialog) {
    const input = dialog.querySelector("input[type='search']");
    const status = dialog.querySelector(".tl-search-status");
    const grid = dialog.querySelector(".tl-search-results__grid");
    const query = normalize(input.value);
    const phraseQuery = normalizePhrase(input.value);
    const source = searchIndex || popular;
    let candidates = source.filter((item) => activeCategory === "all" || item.category === activeCategory);
    if (phraseQuery.includes(" ")) {
      const phraseMatches = candidates.filter((item) => itemPhraseText(item).includes(phraseQuery));
      if (phraseMatches.length) candidates = phraseMatches;
    }
    const matches = candidates
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "vi"))
      .slice(0, 12)
      .map(({ item }) => item);

    grid.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "tl-search-empty";
      empty.innerHTML = "<strong>Chưa tìm thấy nội dung phù hợp</strong><span>Thử từ khóa ngắn hơn như “hồ sơ”, “lương”, “an toàn” hoặc tên tỉnh.</span>";
      grid.append(empty);
      status.textContent = "Không có kết quả";
      return;
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
    status.textContent = query || activeCategory !== "all"
      ? `${matches.length} nội dung phù hợp`
      : "Các nội dung được xem nhiều";
  }

  async function loadSearchIndex(dialog) {
    if (searchIndex) return;
    if (!searchPromise) {
      searchPromise = fetch("/search-index.json", { credentials: "same-origin" })
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

  createContactButtons();
  document.documentElement.classList.add("tl-mobile-ux-ready");
  setupSearch();
})();
