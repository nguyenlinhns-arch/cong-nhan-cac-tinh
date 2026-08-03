(() => {
  "use strict";

  const mobile = window.ThayLinhMobile;
  if (!mobile) return;
  const RECRUITMENT_YEAR = 2026;
  const categories = [
    ["all", "Tất cả"], ["entry", "Điều kiện & hồ sơ"], ["training", "Học nghề"],
    ["work", "Công việc & lương"], ["welfare", "Đời sống & phúc lợi"],
    ["technology", "An toàn & công nghệ"], ["province", "Theo tỉnh"], ["news", "Tin ngành Than"],
  ];
  const popular = [
    { url: "/#dieu-kien", title: "Điều kiện tuyển thợ mỏ 2026", description: "Nam 18–40 tuổi; kiểm tra chiều cao, cân nặng và sức khỏe trước.", type: "Trả lời nhanh", category: "entry", priority: 210 },
    { url: "/#ho-so", title: "Hồ sơ nhập học cần gì?", description: "CCCD bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có.", type: "Trả lời nhanh", category: "entry", priority: 210 },
    { url: "/#quyen-loi", title: "Thu nhập và quyền lợi", description: "Cam kết 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.", type: "Trả lời nhanh", category: "work", priority: 210 },
    { url: "/#thoi-gian-hoc", title: "Học nghề mỏ bao lâu?", description: "Khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng.", type: "Trả lời nhanh", category: "training", priority: 210 },
    { url: "/#dia-diem", title: "Học và nhập học ở đâu?", description: "Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, Quảng Ninh.", type: "Trả lời nhanh", category: "entry", priority: 210 },
  ];
  const SEARCH_STOP_WORDS = new Set([
    "a", "anh", "bao", "bi", "can", "chi", "cho", "chua", "co", "cua", "dau", "de", "di", "duoc",
    "em", "gi", "gom", "hay", "hoac", "hoi", "k", "khong", "ko", "la", "lam", "may", "minh", "muon",
    "nao", "neu", "nhe", "nhieu", "nhu", "o", "oi", "phai", "que", "roi", "the", "thi", "toi", "va", "van", "vay", "viec",
  ]);
  const SEARCH_INTENTS = [
    ["/#dieu-kien", 360, [
      /\b(dieu kien|bao nhieu tuoi|nam sinh|sinh nam|gioi tinh|nu|con gai|phu nu|chieu cao|can nang|suc khoe|bi can|can thi|thi luc|benh mat|benh tim|tim mach|huyet ap)\b/,
      /\b(?:sinh(?:\s+nam)?|sn)\s*(?:19|20)\d{2}\b/, /\b\d{2}\s*tuoi\b/, /\b\d(?:[.,]?m|m)\d{1,2}\b/,
      /\b1\s+\d{1,2}\s*m\b/, /\bcao\s+(?:1[3-9]\d|2[0-2]\d)\b/, /\b\d{2,3}\s*(?:kg|can|ki|ky|kilo)\b/,
    ]],
    ["/#quyen-loi", 360, [/\b(luong+|thu nhap|muc luong|luong bn|bao nhieu tien|dinh muc|quyen loi)\b/]],
    ["/#thoi-gian-hoc", 360, [/\b(hoc bao lau|hoc may thang|thoi gian hoc|2 3 thang|10 thang|co dien mo|khai thac mo|xay dung mo)\b/]],
    ["/#ho-tro-hoc-nghe", 360, [/\b(hoc phi|mien hoc phi|mat tien|dong tien|an o|ky tuc xa|ktx|ho tro|7 5 trieu|ba bua|3 bua)\b/]],
    ["/#ho-so", 360, [/\b(ho so|hs|hso|giay to|cccd|can cuoc|khai sinh|bang cap|tieu hoc|cap 2|thcs|cap 3|thpt|mat bang|khong co bang|chua co bang)\b/]],
    ["/#dia-diem", 380, [/\b(dia chi|noi hoc|hoc o dau|nhap hoc o dau|quang hanh|khu c|truong o dau)\b/]],
    ["/#noi-lam-viec", 380, [/\b(lam o dau|noi lam viec|cong ty nao|doanh nghiep nao|lam tai dau)\b/]],
    ["/#quy-trinh", 380, [/\b(quy trinh|dang ky the nao|dang ky nhu nao|cac buoc|lich nhap hoc|bao gio nhap hoc|khi nao nhap hoc|bao gio di hoc|khi nao di hoc)\b/]],
    ["/#dang-ky", 320, [/\b(dang ky|ung tuyen|nop ho so|gui thong tin|sdt|so dien thoai|zalo|lien he|goi dien)\b/]],
  ];
  const tiers = { core: null, provinces: null, content: null };
  const requests = new Map();
  let activeCategory = "all";
  let dialog = null;
  let input = null;
  let lastFocus = null;
  let queryTimer = 0;

  const normalize = (value) => String(value || "")
    .toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();

  function meaningfulQueryTerms(value) {
    return normalize(value).split(" ").filter((word) => word && !SEARCH_STOP_WORDS.has(word));
  }

  function queryIntentScores(value) {
    const query = normalize(value);
    const scores = new Map();
    for (const [url, bonus, patterns] of SEARCH_INTENTS) {
      const hits = patterns.filter((pattern) => pattern.test(query)).length;
      if (hits) scores.set(url, bonus + (hits - 1) * 20);
    }
    return scores;
  }

  function provinceAliases(item) {
    if (item?.category !== "province") return [];
    const aliases = Array.isArray(item.aliases) ? item.aliases.map(normalize) : [];
    const titleMatch = String(item.title || "").match(/tại\s+(.+?)(?:\s*\||$)/i);
    if (titleMatch?.[1]) aliases.push(normalize(titleMatch[1]));
    return [...new Set(aliases.filter((alias) => alias.length >= 3))];
  }

  function itemSearchText(item) {
    if (!item._searchText) item._searchText = normalize([item.title, item.description, item.type, item.categoryLabel, ...(item.keywords || []), ...(item.aliases || [])].join(" "));
    return item._searchText;
  }

  function oneEditApart(left, right) {
    if (left === right) return true;
    if (Math.min(left.length, right.length) < 4 || Math.abs(left.length - right.length) > 1) return false;
    let a = 0, b = 0, edits = 0;
    while (a < left.length && b < right.length) {
      if (left[a] === right[b]) { a += 1; b += 1; continue; }
      if (++edits > 1) return false;
      if (left.length > right.length) a += 1;
      else if (right.length > left.length) b += 1;
      else { a += 1; b += 1; }
    }
    return edits + Number(a < left.length || b < right.length) <= 1;
  }

  function scoreItem(item, rawQuery) {
    const query = normalize(rawQuery);
    if (!query) return Number(item.priority || 0);
    const title = normalize(item.title);
    const keywords = normalize((item.keywords || []).join(" "));
    const description = normalize(item.description);
    const words = meaningfulQueryTerms(query);
    const intentBonus = queryIntentScores(query).get(item.url) || 0;
    const provinceBonus = provinceAliases(item).some((alias) => ` ${query} `.includes(` ${alias} `)) ? 700 : 0;
    const indexedWords = itemSearchText(item).split(" ");
    const hasWord = (word) => indexedWords.some((candidate) => candidate === word || (word.length >= 4 && candidate.startsWith(word)) || oneEditApart(candidate, word));
    const matched = words.filter(hasWord);
    const coverage = words.length ? matched.length / words.length : 0;
    if (!intentBonus && !provinceBonus && (!matched.length || (words.length > 1 && coverage < 0.6))) return -1;
    let score = Number(item.priority || 0) + intentBonus + provinceBonus + Math.round(coverage * 30);
    if (title === query) score += 80;
    else if (title.startsWith(query)) score += 40;
    else if (title.includes(query)) score += 24;
    if (keywords.includes(query)) score += 14;
    if (description.includes(query)) score += 6;
    score += matched.filter((word) => title.includes(word)).length * 7;
    return score;
  }

  function parseWorkerMeasurements(value) {
    const query = normalize(value);
    const ageMatch = query.match(/\b(1[5-9]|[2-6]\d)\s*tuoi\b/);
    const birthYearMatch = query.match(/\b(?:sinh(?:\s+nam)?|sn)\s*((?:19|20)\d{2})\b/);
    const heightMMatch = query.match(/\b1m(\d{1,2})\b/);
    const heightDecimalMatch = query.match(/\b1\s+(\d{1,2})\s*m\b/);
    const heightCmMatch = query.match(/\b(1[3-9]\d|2[0-2]\d)\s*cm\b/);
    const heightContextMatch = query.match(/\bcao\s+(1[3-9]\d|2[0-2]\d)\b/);
    const weightUnitMatch = query.match(/\b(\d{2,3})\s*(?:kg|can|ki|ky|kilo)\b/);
    const weightContextMatch = query.match(/\b(?:nang|can nang)\s+(\d{2,3})\b/);
    const birthYear = birthYearMatch ? Number(birthYearMatch[1]) : null;
    const suffix = heightMMatch ? Number(heightMMatch[1]) : heightDecimalMatch ? Number(heightDecimalMatch[1]) : null;
    const heightCm = heightCmMatch ? Number(heightCmMatch[1]) : suffix !== null ? 100 + (suffix < 10 ? suffix * 10 : suffix) : heightContextMatch ? Number(heightContextMatch[1]) : null;
    const weightKg = weightUnitMatch ? Number(weightUnitMatch[1]) : weightContextMatch ? Number(weightContextMatch[1]) : null;
    return {
      age: ageMatch ? Number(ageMatch[1]) : null,
      birthYear: Number.isFinite(birthYear) && birthYear >= 1900 && birthYear <= RECRUITMENT_YEAR ? birthYear : null,
      heightCm: Number.isFinite(heightCm) && heightCm >= 130 && heightCm <= 220 ? heightCm : null,
      weightKg: Number.isFinite(weightKg) && weightKg >= 30 && weightKg <= 200 ? weightKg : null,
    };
  }

  function buildSearchAnswer(value, matches) {
    const query = normalize(value);
    if (/\b(?:nu|con gai|phu nu)\b/.test(query)) return {
      kind: "eligibility", state: "review", title: "Đợt tuyển hiện tại áp dụng cho lao động nam",
      text: "Chỉ tiêu đang công bố dành cho nam từ 18 đến 40 tuổi. Nếu cần hỏi chương trình khác, hãy trao đổi trực tiếp với Thầy Linh.",
      href: "/#dieu-kien", actionLabel: "Xem điều kiện đang tuyển", secondaryHref: mobile.ZALO_URL, secondaryLabel: "Hỏi chương trình khác",
    };
    const measurements = parseWorkerMeasurements(value);
    const checks = [];
    if (measurements.age !== null) checks.push([`${measurements.age} tuổi`, "18–40 tuổi", measurements.age >= 18 && measurements.age <= 40]);
    else if (measurements.birthYear !== null) {
      const youngest = RECRUITMENT_YEAR - measurements.birthYear - 1;
      const oldest = RECRUITMENT_YEAR - measurements.birthYear;
      checks.push([`Sinh năm ${measurements.birthYear} (khoảng ${youngest}–${oldest} tuổi)`, "18–40 tuổi", youngest >= 18 && oldest <= 40]);
    }
    if (measurements.heightCm !== null) checks.push([`${Math.floor(measurements.heightCm / 100)}m${String(measurements.heightCm % 100).padStart(2, "0")}`, "từ 1m53", measurements.heightCm >= 153]);
    if (measurements.weightKg !== null) checks.push([`${measurements.weightKg}kg`, "từ 47kg", measurements.weightKg >= 47]);
    if (checks.length) {
      const pass = checks.every(([, , state]) => state);
      return {
        kind: "screening", state: pass ? "pass" : "review",
        title: pass ? "Kết quả sơ bộ: các mốc đã nhập đều đạt" : "Kết quả sơ bộ: có mốc cần kiểm tra lại",
        text: checks.map(([label, requirement, state]) => `${label}: ${state ? "đạt" : "chưa đạt"} mốc ${requirement}`).join("; ") + ". Sức khỏe và kết quả khám tuyển là căn cứ cuối cùng.",
        href: pass ? "/#tu-kiem-tra" : "/#dieu-kien", actionLabel: pass ? "Kiểm tra đủ 4 điều kiện" : "Xem điều kiện đầy đủ",
        secondaryHref: mobile.ZALO_URL, secondaryLabel: "Hỏi trường hợp của tôi",
      };
    }
    const top = matches?.[0];
    if (!top) return null;
    if (top.type === "Trả lời nhanh" || Number(top.priority || 0) >= 200) return { kind: "direct", state: "info", title: top.title, text: top.description, href: top.url, actionLabel: "Mở đúng mục" };
    if (top.category === "province") return { kind: "province", state: "info", title: "Đã tìm thấy thông tin theo địa phương", text: `${top.title}. ${top.description || ""}`, href: top.url, actionLabel: "Mở trang địa phương" };
    return null;
  }

  function allItems(includeContent = true) {
    const items = [...popular, ...(tiers.core || []), ...(tiers.provinces || []), ...(includeContent ? tiers.content || [] : [])];
    return items.filter((item, index) => items.findIndex((other) => other.url === item.url) === index);
  }

  function loadTier(name) {
    if (tiers[name]) return Promise.resolve(tiers[name]);
    if (requests.has(name)) return requests.get(name);
    const files = { core: "/search-core.json?v=1", provinces: "/search-provinces.json?v=1", content: "/search-content.json?v=1" };
    const request = fetch(files[name], { credentials: "same-origin", cache: "no-cache" })
      .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
      .then((payload) => {
        tiers[name] = Array.isArray(payload) ? payload : payload.items;
        if (!Array.isArray(tiers[name])) throw new Error("Invalid search index tier");
        return tiers[name];
      }).catch(() => { tiers[name] = []; return tiers[name]; });
    requests.set(name, request);
    return request;
  }

  function appendAnswer(grid, answer) {
    const panel = document.createElement("section");
    panel.className = "tl-search-empty";
    panel.dataset.searchAnswer = answer.kind;
    panel.dataset.state = answer.state || "info";
    panel.setAttribute("aria-label", "Câu trả lời nhanh");
    const title = document.createElement("strong");
    title.textContent = answer.title;
    const text = document.createElement("span");
    text.textContent = answer.text;
    const voice = document.createElement("button");
    voice.type = "button";
    voice.className = "tl-voice-entry__button";
    voice.dataset.loadVoice = "answer";
    voice.textContent = "🔊 Nghe câu trả lời";
    const actions = document.createElement("div");
    actions.className = "tl-search-empty__actions";
    const primary = document.createElement("a");
    primary.href = mobile.safeUrl(answer.href);
    primary.textContent = answer.actionLabel;
    primary.dataset.workerShortcut = `answer_${answer.kind}`;
    actions.append(primary);
    if (answer.secondaryHref) {
      const secondary = document.createElement("a");
      secondary.href = answer.secondaryHref;
      secondary.target = "_blank";
      secondary.rel = "noopener";
      secondary.textContent = answer.secondaryLabel || "Hỏi qua Zalo";
      secondary.dataset.contact = "zalo";
      secondary.dataset.context = "search-answer";
      actions.append(secondary);
    }
    panel.append(title, text, voice, actions);
    grid.append(panel);
  }

  function rankedMatches(rawQuery, includeContent = true) {
    const candidates = allItems(includeContent).filter((item) => activeCategory === "all" || item.category === activeCategory);
    return candidates.map((item) => ({ item, score: scoreItem(item, rawQuery) }))
      .filter(({ score }) => score >= 0).sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "vi"))
      .slice(0, 12).map(({ item }) => item);
  }

  function renderResults() {
    if (!dialog) return 0;
    const status = dialog.querySelector(".tl-search-status");
    const grid = dialog.querySelector(".tl-search-results__grid");
    const rawQuery = input.value;
    const query = normalize(rawQuery);
    let matches = rankedMatches(rawQuery);
    grid.replaceChildren();
    const baseMatches = rankedMatches(rawQuery, false);
    const needsDeepContent = query && !baseMatches.length && tiers.content === null;
    if (needsDeepContent) {
      status.textContent = "Đang tìm thêm trong cẩm nang, bài báo và video…";
      void loadTier("content").then(renderResults);
      return 0;
    }
    let fallback = false;
    if (!matches.length && query && tiers.content !== null) {
      matches = ["/#dieu-kien", "/#ho-so", "/#dia-diem", "/#dang-ky"].map((url) => allItems().find((item) => item.url === url)).filter(Boolean);
      fallback = matches.length > 0;
    }
    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "tl-search-empty";
      empty.innerHTML = `<strong>Chưa tìm thấy nội dung phù hợp</strong><span>Chọn một mục hoặc liên hệ trực tiếp để được hướng dẫn.</span><div class="tl-search-empty__actions"><a href="/#dieu-kien">Điều kiện</a><a href="/#ho-so">Hồ sơ</a><a href="${mobile.ZALO_URL}" target="_blank" rel="noopener" data-contact="zalo" data-context="search-empty">Hỏi qua Zalo</a><a href="${mobile.PHONE_URL}" data-contact="phone" data-context="search-empty">Gọi tư vấn</a></div>`;
      grid.append(empty);
      status.textContent = "Không có kết quả";
      return 0;
    }
    if (fallback) {
      const note = document.createElement("div");
      note.className = "tl-search-empty";
      note.innerHTML = "<strong>Chưa khớp chính xác câu hỏi này</strong><span>Chọn một trong các mục gần nhất dưới đây.</span>";
      grid.append(note);
    }
    const answer = fallback ? null : buildSearchAnswer(rawQuery, matches);
    if (answer) { appendAnswer(grid, answer); matches = matches.slice(0, 4); }
    for (const item of matches) {
      const link = document.createElement("a");
      link.className = "tl-search-result";
      link.href = mobile.safeUrl(item.url);
      const type = document.createElement("small"); type.textContent = item.type || item.categoryLabel || "Cẩm nang nghề mỏ";
      const title = document.createElement("strong"); title.textContent = item.title;
      const description = document.createElement("span"); description.textContent = item.description || "Xem nội dung chi tiết.";
      link.append(type, title, description); grid.append(link);
    }
    status.textContent = answer ? `Câu trả lời ngay và ${matches.length} nội dung liên quan` : fallback ? "Các lối đi gần nhất" : query || activeCategory !== "all" ? `${matches.length} nội dung phù hợp` : "Các nội dung được xem nhiều";
    return matches.length;
  }

  function createDialog() {
    const element = document.createElement("dialog");
    element.className = "tl-search-dialog";
    element.setAttribute("aria-labelledby", "tl-search-title");
    element.innerHTML = `<div class="tl-search-dialog__header"><div><span class="tl-search-dialog__eyebrow">Tìm nhanh trên website</span><h2 id="tl-search-title">Nội dung ngành mỏ bạn cần</h2></div><button class="tl-search-dialog__close" type="button" aria-label="Đóng tìm kiếm">×</button></div><form class="tl-search-dialog__form" role="search"><label class="tl-search-input-wrap">${mobile.SEARCH_ICON}<span class="tl-visually-hidden">Từ khóa tìm kiếm</span><input type="search" inputmode="search" autocomplete="off" enterkeyhint="search" placeholder="Ví dụ: 39 tuổi có đi được không?"></label><div class="tl-voice-entry"><button type="button" data-load-voice="search">🎙 Nói để tìm</button><span>Giọng nói chỉ tải khi bạn bấm.</span></div></form><nav class="tl-search-shortcuts" aria-label="Câu hỏi được tìm nhiều">${mobile.WORKER_SHORTCUTS.map(({ key, question, href }) => `<a href="${href}" data-worker-shortcut="search_${key}">${question}</a>`).join("")}<a class="tl-search-shortcuts__apply" href="${mobile.trackedApplicationUrl("search_to_application_2026", `search_${mobile.pageGroup()}`)}" data-contact="application" data-context="search-shortcut">Đăng ký tư vấn</a></nav><div class="tl-search-categories" role="group" aria-label="Lọc theo chủ đề">${categories.map(([key, label]) => `<button type="button" data-search-category="${key}" aria-pressed="${key === "all"}">${label}</button>`).join("")}</div><p class="tl-search-status" role="status" aria-live="polite">Các nội dung được xem nhiều</p><div class="tl-search-results" tabindex="-1"><div class="tl-search-results__grid"></div></div>`;
    document.body.append(element);
    input = element.querySelector("input[type='search']");
    element.querySelector(".tl-search-dialog__close").addEventListener("click", close);
    element.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
    element.addEventListener("click", (event) => {
      const voice = event.target.closest?.("[data-load-voice]");
      if (voice) void mobile.activateVoice(element, voice.dataset.loadVoice);
      const shortcut = event.target.closest?.("[data-worker-shortcut]");
      if (shortcut) mobile.trackUi("worker_search_shortcut", { destination: shortcut.dataset.workerShortcut || "unknown" });
      const rect = element.getBoundingClientRect();
      if (event.target === element && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) close();
    });
    input.addEventListener("input", () => {
      window.clearTimeout(queryTimer);
      queryTimer = window.setTimeout(renderResults, 120);
    });
    element.querySelector("form").addEventListener("submit", (event) => { event.preventDefault(); renderResults(); });
    element.querySelectorAll("[data-search-category]").forEach((button) => button.addEventListener("click", () => {
      activeCategory = button.dataset.searchCategory;
      element.querySelectorAll("[data-search-category]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      if (["news", "technology", "welfare", "training", "work"].includes(activeCategory) && tiers.content === null) void loadTier("content").then(renderResults);
      else renderResults();
    }));
    return element;
  }

  function close() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    document.documentElement.classList.remove("tl-search-open");
    if (lastFocus instanceof HTMLElement) lastFocus.focus({ preventScroll: true });
  }

  function open(trigger) {
    dialog ||= createDialog();
    lastFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.documentElement.classList.add("tl-search-open");
    renderResults();
    void Promise.all([loadTier("core"), loadTier("provinces")]).then(renderResults);
    mobile.trackUi("worker_search_open", { page_group: mobile.pageGroup() });
    requestAnimationFrame(() => input?.focus({ preventScroll: true }));
  }

  if (typeof document === "undefined" && typeof process !== "undefined" && process?.env?.TL_SEARCH_TEST_ONLY === "1") {
    window.__TL_SEARCH_INTERNALS__ = { normalize, meaningfulQueryTerms, queryIntentScores, provinceAliases, oneEditApart, scoreItem, parseWorkerMeasurements, buildSearchAnswer };
    return;
  }

  window.ThayLinhSiteSearch = Object.freeze({ open, loadTier });
})();
