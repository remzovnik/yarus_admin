import { BaseService } from "@/_core/service/BaseService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import AuthService from "../Auth/AuthService";
import ModerationService from "../Yarus/ModerationService";
import {
  BloggerFeedItemModel,
  ContentType,
  ModerationActionType,
  ModerationStatus,
  NotApproveStatus,
} from "./models/BloggerContentData";

export default class BloggersFeedService extends BaseService {
  getContentList(
    contType: ContentType,
    mStatus: ModerationStatus,
    notApStatus: NotApproveStatus | null,
    offset = 0,
    limit = 100
  ) {
    const config: any = {
      params: {
        offset,
        limit,
        approved: mStatus,
      },
    };

    if (mStatus === ModerationStatus.NOT_APPROVED) {
      config.params.status = notApStatus;
    }
    return this.getArrayOrEmpty(BloggerFeedItemModel, `content/${contType}`, config);
  }

  async moderateContent(id: number, feedType: ContentType, action: ModerationActionType, reason = "нет") {
    ServiceLocator.instance.getService(ModerationService).moderateContent(id, feedType, action, reason);
  }
}
