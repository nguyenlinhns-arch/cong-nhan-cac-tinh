import {communitySourceImages as baseCommunitySourceImages} from "./community-source-images-base.mjs";
import {dailyCommunitySourceImages20260804} from "./daily-community-source-images-20260804.mjs";

export const communitySourceImages = Object.freeze({
  ...baseCommunitySourceImages,
  ...dailyCommunitySourceImages20260804,
});
