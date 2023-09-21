import { ContentType, ModerationActionType } from "../BloggersFeed/models/BloggerContentData";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import AuthService from "../Auth/AuthService";
import { BaseService } from "@/_core/service/BaseService";

export default class ModerationService extends BaseService {
  async blockUser(id: number, reason: string) {
    try {
      await this.apiRequest.post(`content/block/user/${id}`);
      this.fixModerationAction(id, 99, ModerationActionType.BLOCK, reason);
      return true;
    } catch {
      return false;
    }
  }

  async moderateContent(id: number, feedType: ContentType, action: ModerationActionType, reason = "нет") {
    return await this.doContentAction(id, feedType, action, reason);
  }

  async blockUserContent(contentType: string, id: number, reason: string) {
    return await this.doContentAction(id, contentType, ModerationActionType.BLOCK, reason);
  }

  async doContentAction(id: number, feedType: string, action: ModerationActionType, reason: string) {
    const feedTypeValue = this.convertContentTypeString2Number(feedType);
    if (feedTypeValue !== -1) {
      try {
        const config: any = {
          params: {
            type: feedTypeValue,
            id,
          },
        };
        await this.apiRequest.post(`content/${action}`, null, config);
        this.fixModerationAction(id, feedTypeValue, action, reason);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  fixModerationAction(contentId: number, feedType: number, action: ModerationActionType, reason: string) {
    try {
      const userId = ServiceLocator.instance.getService(AuthService).currentUser?.id;
      const data: any = {
        staffer_id: userId || 1,
        content_id: contentId,
        content_type: feedType,
        action: this.converModerationActionType2Number(action),
        reason,
      };

      // this.apiRequest.post(`http://10.0.3.11/api/v1/moderation`, data);
    } catch (errr) {
      console.log(errr);
    }
  }

  converModerationActionType2Number(action: ModerationActionType) {
    return action === ModerationActionType.APPROVE ? 1 : action === ModerationActionType.BLOCK ? 2 : 3;
  }

  convertContentType2Number(feedType: ContentType) {
    switch (feedType) {
      case ContentType.CLIP:
        return 6;
      case ContentType.POST:
        return 2;
      case ContentType.VIDEO:
        return 0;
      default:
        return -1;
    }
  }

  convertContentTypeString2Number(feedType: string) {
    switch (feedType) {
      case "clip":
        return 6;
      case "post":
        return 2;
      case "video":
        return 0;
      default:
        return -1;
    }
  }
}
