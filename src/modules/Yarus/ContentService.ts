import { ContentType } from "../BloggersFeed/models/BloggerContentData";
import { BaseService } from "./../../_core/service/BaseService";
import ClipItemModel from "./models/ClipItemModel";
import ContentDetailModel from "./models/ContentDetailModel";
import VideoModel from "./models/VideoModel";
// const result = [...new Array(1000)].map(() => this.apiRequest.post(`${type}/${id}/view`, { skipRate: "1999" }));

export default class ContentService extends BaseService {
  getPostById(id: number) {
    return this.getOneOrDefault(ContentDetailModel, `post/${id}`);
  }

  getVideoById(id: number) {
    return this.getOneOrDefault(VideoModel, `video/${id}`);
  }

  getClipById(id: number) {
    return this.getOneOrDefault(ClipItemModel, `clip/${id}`);
  }

  getNewsById(id: number) {
    return this.getOneOrDefault(ContentDetailModel, `news/${id}`);
  }

  forTestDddos(type: ContentType, id: number) {
    // Захуячим 10 000 запросов, с моего компа, то есть с одного моего IP, ну или провайдера, я ХЗ
    // Дернем тупо получение поста 24103577
    // Захуячим параллеллллннооо
    const result = [...new Array(1000)].map(() => this.apiRequest.get("post/24103577"));
    Promise.all(result);
  }

  async saveNews(news: ContentDetailModel) {
    try {
      await this.apiRequest.patch(`news/${news.id}`, news);
      return true;
    } catch {
      return false;
    }
  }
}
