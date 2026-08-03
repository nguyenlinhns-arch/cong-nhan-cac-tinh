import {communityArticles as baseCommunityArticles} from "./community-articles-base.mjs";
import {dailyCommunityArticles} from "./daily-community-articles.mjs";

const dailySlugs = new Set(dailyCommunityArticles.map((article) => article.slug));
export const communityArticles = [
  ...baseCommunityArticles.filter((article) => !dailySlugs.has(article.slug)),
  ...dailyCommunityArticles,
];
