import fs from "node:fs";

const thumbnails = new Map(JSON.parse(fs.readFileSync(new URL("../content/video-thumbnails.json", import.meta.url), "utf8")).map(item => [item.id, item]));

export function reelThumbnail(id) {
  const item = thumbnails.get(id);
  if (!item || item.sourceUrl !== `https://www.facebook.com/reel/${id}`) throw new Error(`Missing verified thumbnail for Reel ${id}`);
  return item;
}

export function reelImage(id) {
  const { image, width, height } = reelThumbnail(id);
  // Absolute positioning preserves the existing card's reserved dimensions.
  // Empty alt is intentional: the adjacent video title labels the same link/button.
  return `<img src="${image}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async" data-reel-thumbnail="${id}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`;
}
