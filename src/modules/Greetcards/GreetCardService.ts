import { BaseService } from "@/_core/service/BaseService";
import GreetCardCategoryModel from "./models/GreetCardCategoryModel";
import { GreetCardModel } from "./models/GreetCardModel";
import { GreetCardSliderModel } from "./models/GreetCardSliderModel";

/* TODO: Адрес тестовый, потом поменять*/
const API_BASE_URL = "http://10.0.3.11/api/v1/";

export default class GreetCardService extends BaseService {
  getCategoryList() {
    const config = { params: { offset: 0, limit: 100 } };
    return this.getArrayOrEmpty(GreetCardCategoryModel, `${API_BASE_URL}card/category`, config);
  }

  getSliderList() {
    const config = { params: { offset: 0, limit: 100 } };
    return this.getArrayOrEmpty(GreetCardSliderModel, `${API_BASE_URL}card/group`, config);
  }

  getCardList() {
    const config = { params: { offset: 0, limit: 100 } };
    return this.getArrayOrEmpty(GreetCardModel, `${API_BASE_URL}card`, config);
  }

  getCategoryById(id: number | string) {
    return this.getOneOrDefault(GreetCardCategoryModel, `${API_BASE_URL}card/category/${id}`);
  }

  getSliderById(id: number | string) {
    return this.getOneOrDefault(GreetCardSliderModel, `${API_BASE_URL}card/group/${id}`);
  }

  getCardById(id: number | string) {
    return this.getOneOrDefault(GreetCardModel, `${API_BASE_URL}card/${id}`);
  }

  async createOrUpdateCategory(model: GreetCardCategoryModel) {
    const { groups, ...clonedModel } = model;
    if (!!model.id) {
      await this.apiRequest.patch(`${API_BASE_URL}card/category/${model.id}`, clonedModel);
    } else {
      await this.apiRequest.post(`${API_BASE_URL}card/category`, clonedModel);
    }
  }

  async createOrUpdateSlider(model: GreetCardSliderModel) {
    const { cards, ...clonedModel } = model;
    if (!!model.id) {
      await this.apiRequest.patch(`${API_BASE_URL}card/group/${model.id}`, clonedModel);
    } else {
      await this.apiRequest.post(`${API_BASE_URL}card/group`, clonedModel);
    }
  }

  async createOrUpdateCard(model: GreetCardModel) {
    if (!!model.id) {
      await this.apiRequest.patch(`${API_BASE_URL}card/${model.id}`, model);
    } else {
      await this.apiRequest.post(`${API_BASE_URL}card`, model);
    }
  }

  async deleteCard(id: number | string) {
    await this.apiRequest.delete(`${API_BASE_URL}card/${id}`);
  }

  async deleteSlider(id: number | string) {
    await this.apiRequest.delete(`${API_BASE_URL}card/group/${id}`);
  }

  async deleteCategory(id: number | string) {
    await this.apiRequest.delete(`${API_BASE_URL}card/category/${id}`);
  }

  async loadImageOnServer(data) {
    const response = await this.apiRequest.post(`${API_BASE_URL}image`, data);
    return response?.data?.data.url;
  }

  async changeCardPosition(id, data) {
    await this.apiRequest.patch(`${API_BASE_URL}card/${id}/position`, data);
  }
  //  запросы на стату
  getMostPopularCategory() {
    // что-то происходит
  }
  getMostPopularSlider() {
    // что-то происходит
  }
  getMostPopularCard() {
    // что-то происходит
  }
}
