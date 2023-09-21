import { BaseService } from "./BaseService";
import SeoModel from "@/_core/models/SeoModel";

export class SeoMetaTagsBuilder extends BaseService {
  public create(meta: SeoModel | null | undefined, _pageRelativePath?: string) {
    meta = this.setDefaultValues(meta, _pageRelativePath);

    return {
      title: meta?.meta_title,
      meta: [
        {
          hid: "og:url",
          property: "og:url",
          content: meta.fullPath,
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "website",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: meta?.meta_title?.substring(0, 70),
        },
        {
          hid: "og:description",
          property: "og:description",
          content: meta?.meta_description?.substring(0, 150),
        },
        {
          hid: "og:image",
          property: "og:image",
          content: meta?.meta_image,
        },
        {
          hid: "description",
          name: "description",
          content: meta?.meta_description?.substring(0, 150),
        },
        {
          hid: "Keywords",
          name: "Keywords",
          keywords: meta?.meta_keywords,
        },
      ],
    };
  }

  private setDefaultValues(headMetaTagInfo: SeoModel | null | undefined, _pageRelativePath?: string): SeoModel {
    // const config = this.ctx.$config;

    headMetaTagInfo = headMetaTagInfo || new SeoModel();
    // headMetaTagInfo.meta_description = headMetaTagInfo.meta_description || config.defaultMetaDescription;
    // headMetaTagInfo.meta_title = headMetaTagInfo.meta_title || config.defaulMetaTitle;
    // headMetaTagInfo.meta_image = headMetaTagInfo.meta_image || config.defaulMetaImgSrc;
    // headMetaTagInfo.meta_keywords = headMetaTagInfo.meta_keywords || config.defaultMetaDescription;
    // headMetaTagInfo.fullPath = `${config.siteUrl}/${_pageRelativePath?.toLowerCase()}`;
    return headMetaTagInfo;
  }
}
