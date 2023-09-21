import { BaseService } from "@/_core/service/BaseService";
import axios from "axios";
import { ParserCategory, ParserStats } from "./models/ParserModel";

export default class ParsersService extends BaseService {
  API_HEADERS = { "X-API-KEY": "be8e1aef-07ef-4d25-88aa-28f0264bab0c" };

  apiInstance = axios.create({
    baseURL: "https://plus-parser.yarus.ru/",
  });

  async getSummaryInfo(): Promise<ParserStats | undefined> {
    const response = await this.doRequest("category");
    if (!!response && !!response.data) {
      const res: ParserStats = {
        active: response.data.find((iter) => iter.id === ParserCategory.ACTIVE)?.counter || 0,
        inactive: response.data.find((iter) => iter.id === ParserCategory.INACTIVE)?.counter || 0,
        all: response.data.find((iter) => iter.id === ParserCategory.ALL)?.counter || 0,
        invalid: response.data.find((iter) => iter.id === ParserCategory.INVALID)?.counter || 0,
        disabled: response.data.find((iter) => iter.id === ParserCategory.DISABLED)?.counter || 0,
      };
      return res;
    }
  }

  setOffParser(_id: number) {
    return this.changeParserStatus(_id, 0);
  }

  setOnParser(_id: number) {
    return this.changeParserStatus(_id, 1);
  }

  changeParserStatus(_id: number, status: number) {
    const config: any = {};
    config.headers = this.API_HEADERS;
    const data = { _id, status };
    return this.apiInstance.patch("parser/status", data, config);
  }

  async getParserList(status: ParserCategory) {
    const count = (await this.doRequest("category/parser", { category: status, limit: 1 })).data?.totalCount || 0;
    const arr = [...new Array(count)].map((_iter, index) => {
      if (index % 100 === 0) {
        return this.doRequest("category/parser", { category: status, limit: 100, offset: (index / 100) * 100 });
      }
      return null;
    });
    const res = await Promise.all(arr.filter((iter) => !!iter));
    return res.map((iter) => iter?.data?.parsers).flat();
  }

  private doRequest(url: string, params?: any) {
    const config: any = {};
    config.headers = this.API_HEADERS;
    config.params = params;
    return this.apiInstance.get(`/${url}`, config);
  }
}
