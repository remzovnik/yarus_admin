import { Pagination } from "@/_core/models/Pagination";
import { BaseService } from "@/_core/service/BaseService";
import QuestModel from "./models/QuestModel";
import QuestCategoryModel from "./models/QuestCategoryModel";
import QuestDownloadLinkModel from "./models/QuestDownloadLinkModel";

const API_BASE_URL = "http://10.0.3.11/api/v1";

export default class QuestService extends BaseService {
  async getQuestList() {
    return await this.getArrayOrEmpty(QuestModel, `${API_BASE_URL}/quest`);
  }

  async getCategoryList() {
    return await this.getArrayOrEmpty(QuestCategoryModel, `${API_BASE_URL}/quest/category`);
  }

  async postNewImage(formData) {
    const response = await this.apiRequest.post(`${API_BASE_URL}/image`, formData);
    return response.data.data.url;
  }

  async createNewCategory(newCategoryName) {
    try {
      await this.apiRequest.post(`${API_BASE_URL}/quest/category`, { name: newCategoryName });
      return true;
    } catch (error) {
      return false;
    }
  }

  async removeCategory(id) {
    try {
      await this.apiRequest.delete(`${API_BASE_URL}/quest/category/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async removeQuest(id) {
    try {
      await this.apiRequest.delete(`${API_BASE_URL}/quest/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async patchQuest(data) {
    try {
      await this.apiRequest.patch(`${API_BASE_URL}/quest/${data.id}`, data);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createQuest(data) {
    try {
      await this.apiRequest.post(`${API_BASE_URL}/quest`, data);
      return true;
    } catch (error) {
      return false;
    }
  }

  async postDownloadAppLink(url) {
    try {
      await this.apiRequest.post(`${API_BASE_URL}/preference/`, {
        key: "url",
        value: url,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getDownloadAppLink() {
    try {
      const response = await this.getOneOrFail(QuestDownloadLinkModel, `${API_BASE_URL}/preference/url`);
      return response.value;
    } catch (error) {
      return "";
    }
  }
}
