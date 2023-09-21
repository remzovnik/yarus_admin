import ClipItemModel from "@/modules/Yarus/models/ClipItemModel";
import ContentDetailModel from "@/modules/Yarus/models/ContentDetailModel";
import VideoModel from "@/modules/Yarus/models/VideoModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export enum ContentType {
  CLIP = "clip",
  POST = "post",
  VIDEO = "video",
  FEED = "feed",
  EVENT = "event",
  NEWS = "news",
}

export enum ModerationActionType {
  DECLINE = "decline",
  APPROVE = "approve",
  BLOCK = "block",
}

export enum ModerationStatus {
  ON_MODERATION = -1,
  NOT_APPROVED = 0,
  APPROVED = 1,
}

export enum NotApproveStatus {
  DECLINED = 1,
  BLOCKED = 3,
}

export enum FeedItemModelType {
  CLIP = 6,
  VIDEO = 0,
  POST = 2,
  NEWS = 1,
}

export class BloggerFeedItemModel extends BaseViewModel {
  type: FeedItemModelType;
  model: ContentDetailModel | VideoModel | ClipItemModel;
}
