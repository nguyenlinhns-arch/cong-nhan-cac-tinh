import {applyJournalisticSourceEditing} from "./journalistic-source-edit.mjs";
import {applyEditorialSourceOverridesV5} from "./editorial-source-overrides-v5.mjs";
import {applyEditorialSourceOverridesV5b} from "./editorial-source-overrides-v5b.mjs";
import {applyEditorialSourceOverridesV5c} from "./editorial-source-overrides-v5c.mjs";
import {applyEditorialSourceOverridesV5d} from "./editorial-source-overrides-v5d.mjs";
import {applyEditorialSourceOverridesV5e} from "./editorial-source-overrides-v5e.mjs";
import {applyEditorialSourceOverridesV5f} from "./editorial-source-overrides-v5f.mjs";
import {dailyCommunityArticles as dailyCommunityArticles20260803} from "./daily-community-articles.mjs";
import {dailyCommunityArticles20260804} from "./daily-community-articles-20260804.mjs";
import {dailyCommunityArticles20260809} from "./daily-community-articles-20260809.mjs";
import {dailyCommunityArticles20260810} from "./daily-community-articles-20260810.mjs";
import {dailyCommunityArticles20260811} from "./daily-community-articles-20260811.mjs";
import {dailyCommunityArticles20260812} from "./daily-community-articles-20260812.mjs";
import {dailyCommunityArticles20260813} from "./daily-community-articles-20260813.mjs";
import {dailyCommunityArticles20260814} from "./daily-community-articles-20260814.mjs";
import {dailyCommunityArticles20260821} from "./daily-community-articles-20260821.mjs";
import {dailyCommunityArticles20260822} from "./daily-community-articles-20260822.mjs";
import {dailyCommunityArticles20260826} from "./daily-community-articles-20260826.mjs";
import {dailyCommunityArticles20260827} from "./daily-community-articles-20260827.mjs";
import {dailyCommunityArticles20260828} from "./daily-community-articles-20260828.mjs";
import {dailyCommunityArticles20260829} from "./daily-community-articles-20260829.mjs";
import {dailyCommunityArticles20260830} from "./daily-community-articles-20260830.mjs";
import {dailyCommunityArticles20260831} from "./daily-community-articles-20260831.mjs";

export const dailyCommunityArticles = [
  ...dailyCommunityArticles20260803,
  ...dailyCommunityArticles20260804,
  ...dailyCommunityArticles20260809,
  ...dailyCommunityArticles20260810,
  ...dailyCommunityArticles20260811,
  ...dailyCommunityArticles20260812,
  ...dailyCommunityArticles20260813,
  ...dailyCommunityArticles20260814,
  ...dailyCommunityArticles20260821,
  ...dailyCommunityArticles20260822,
  ...dailyCommunityArticles20260826,
  ...dailyCommunityArticles20260827,
  ...dailyCommunityArticles20260828,
  ...dailyCommunityArticles20260829,
  ...dailyCommunityArticles20260830,
  ...dailyCommunityArticles20260831,
].map(applyJournalisticSourceEditing)
  .map(applyEditorialSourceOverridesV5)
  .map(applyEditorialSourceOverridesV5b)
  .map(applyEditorialSourceOverridesV5c)
  .map(applyEditorialSourceOverridesV5d)
  .map(applyEditorialSourceOverridesV5e)
  .map(applyEditorialSourceOverridesV5f)
  .map(applyJournalisticSourceEditing);
