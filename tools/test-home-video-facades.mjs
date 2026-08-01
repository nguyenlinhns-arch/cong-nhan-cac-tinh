import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("tuyen-tho-mo/portal-official.js", "utf8");

function dataKey(attribute) {
  return attribute.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function element(tagName = "DIV", dataset = {}) {
  return {
    tagName,
    dataset: { ...dataset },
    attributes: new Map(),
    listeners: new Map(),
    children: [],
    textContent: "",
    hidden: false,
    href: "",
    src: "",
    title: "",
    style: {},
    addEventListener(name, listener) { this.listeners.set(name, listener); },
    setAttribute(name, value) {
      this.attributes.set(name, String(value));
      if (name.startsWith("data-")) this.dataset[dataKey(name)] = String(value);
    },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; },
    closest(selector) {
      const match = selector.match(/^\[([^\]]+)\]$/);
      return match && this.attributes.has(match[1]) ? this : null;
    },
  };
}

const featuredHost = element();
const featuredFacade = element("BUTTON", { videoId: "ts41cqu7r9c", videoTitle: "Câu chuyện công nhân ngành Than" });
featuredFacade.setAttribute("data-featured-video-facade", "");
featuredHost.children = [featuredFacade];
const featuredLabel = element();
const featuredHeading = element();
const storyButton = element("BUTTON", { videoId: "TIDiY-Nuo_4", videoTitle: "An cư, lập nghiệp tại Quảng Ninh", videoLabel: "Đời sống vùng mỏ" });

const provinceHost = element();
const provinceFacade = element("BUTTON", { videoId: "ts41cqu7r9c", videoTitle: "Video Thanh Hóa" });
provinceFacade.setAttribute("data-province-video-facade", "");
provinceHost.children = [provinceFacade];
const provinceButton = element("A", { provinceKey: "nghe-an" });
const provinceName = element();
const provinceTitle = element();
const provinceCount = element();
const provinceSalary = element("IMG");
const provinceSalaryView = element();
const provinceAlbumButton = element("A");
const provincePage = element("A");
const provinceMissing = element();
const provinceStatus = element();

const selectors = new Map([
  ["[data-featured-video-host]", featuredHost],
  ["[data-video-label]", featuredLabel],
  ["[data-video-heading]", featuredHeading],
  ["[data-province-video-host]", provinceHost],
  ["[data-province-name]", provinceName],
  ["[data-province-title]", provinceTitle],
  ["[data-province-count]", provinceCount],
  ["[data-province-salary]", provinceSalary],
  ["[data-province-salary-view], [data-province-album]", provinceSalaryView],
  ["[data-province-album-button]", provinceAlbumButton],
  ["[data-province-page]", provincePage],
  ["[data-province-missing]", provinceMissing],
  ["[data-province-status]", provinceStatus],
]);

const documentStub = {
  querySelector: selector => selectors.get(selector) || null,
  querySelectorAll: selector => selector === ".video-item[data-video-id]" ? [storyButton] : selector === "[data-province-key]" ? [provinceButton] : [],
  createElement: tag => element(tag.toUpperCase()),
  addEventListener() {},
};

const windowStub = {
  dataLayer: [],
  addEventListener() {},
  requestAnimationFrame(callback) { callback(); return 1; },
  innerHeight: 800,
  scrollY: 0,
};

vm.runInNewContext(source, {
  document: documentStub,
  window: windowStub,
  location: { pathname: "/" },
  Date,
}, { filename: "portal-official.js" });

featuredHost.listeners.get("click")({ target: featuredFacade });
const firstFrame = featuredHost.children[0];
if (firstFrame.tagName !== "IFRAME" || !firstFrame.src.includes("autoplay=1")) throw new Error("Featured facade did not mount the player on click");

storyButton.listeners.get("click")();
const selectedFrame = featuredHost.children[0];
if (!selectedFrame.src.includes("TIDiY-Nuo_4") || featuredHeading.textContent !== storyButton.dataset.videoTitle) throw new Error("Story selection did not mount the selected video");

provinceButton.listeners.get("click")({ preventDefault() {}, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false });
const refreshedFacade = provinceHost.children[0];
if (refreshedFacade.tagName !== "BUTTON" || !refreshedFacade.attributes.has("data-province-video-facade") || refreshedFacade.dataset.videoId !== "uPLUcoFN1cU") {
  throw new Error("Province selection must return to a click-to-play facade");
}

provinceHost.listeners.get("click")({ target: refreshedFacade });
const provinceFrame = provinceHost.children[0];
if (provinceFrame.tagName !== "IFRAME" || !provinceFrame.src.includes("uPLUcoFN1cU") || !provinceFrame.src.includes("autoplay=1")) throw new Error("Province facade did not mount the selected video");

if (windowStub.dataLayer.filter(item => item.event === "video_play").length !== 3) throw new Error("Video play events were not measured exactly once per play action");

console.log(JSON.stringify({
  initial_iframes: 0,
  facades: 2,
  tested_plays: 3,
  province_resets_to_facade: true,
  errors: 0,
}, null, 2));
