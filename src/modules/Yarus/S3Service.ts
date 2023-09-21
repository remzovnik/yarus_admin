import { BaseService } from "@/_core/service/BaseService";
import { Guid } from "@/_core/utils/Guid";
import axios from "axios";

export enum S3FileType {
  IMAGE,
  MUSIC,
  VIDEO,
}

export default class S3Service extends BaseService {
  S3_API_HEADERS = { "X-API-KEY": "7a7908be-e629-42bd-b6cc-51769a34d179" };
  UNIQ_ID = `ID-${new Date().getTime().toString()}`;

  apiInstance = axios.create({
    baseURL: "https://s3.yarus.ru",
  });

  async uploadAndResizeImage(file: any) {
    const config: any = {};
    config.headers = this.S3_API_HEADERS;
    config.headers["X-DEVICE-ID"] = this.UNIQ_ID;

    const formData = new FormData();
    formData.append("file", file);

    const resp = await this.apiInstance.post(`upload/image-resize`, formData, config);

    return resp.data?.body;
  }

  async uploadFile(type: S3FileType, file: any, path = Guid.newGuid()) {
    const config: any = {};
    config.headers = this.S3_API_HEADERS;
    config.headers["X-DEVICE-ID"] = this.UNIQ_ID;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", "1");
    formData.append("path", path);

    const resp = await this.apiInstance.post(`upload/file`, formData, config);

    return resp.data?.body;
  }
}
