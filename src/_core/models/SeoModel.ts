import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class SeoModel extends BaseViewModel {
  meta_h1: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  meta_slug: string;
  meta_image?: string;
  fullPath: string;

  public constructor(init?: Partial<SeoModel>) {
    super();
    Object.assign(this, init);
  }
}
