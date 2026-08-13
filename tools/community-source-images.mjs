import {communitySourceImages as baseCommunitySourceImages} from "./community-source-images-base.mjs";
import {dailyCommunitySourceImages20260804} from "./daily-community-source-images-20260804.mjs";
import {dailyCommunitySourceImages20260809} from "./daily-community-source-images-20260809.mjs";
import {dailyCommunitySourceImages20260810} from "./daily-community-source-images-20260810.mjs";
import {dailyCommunitySourceImages20260811} from "./daily-community-source-images-20260811.mjs";
import {dailyCommunitySourceImages20260812} from "./daily-community-source-images-20260812.mjs";
import {dailyCommunitySourceImages20260813} from "./daily-community-source-images-20260813.mjs";

export const communitySourceImages = Object.freeze({
  ...baseCommunitySourceImages,
  ...dailyCommunitySourceImages20260804,
  ...dailyCommunitySourceImages20260809,
  ...dailyCommunitySourceImages20260810,
  ...dailyCommunitySourceImages20260811,
  ...dailyCommunitySourceImages20260812,
  ...dailyCommunitySourceImages20260813,
});
