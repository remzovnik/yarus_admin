import { BaseViewModel } from "@/_core/models/BaseViewModel";
import VideoModel from "./VideoModel";

export default class ContentItemModel extends BaseViewModel {
  id?: number;
  type: number;
  text: string;
  param?: number;
  image?: any;
  imageWidth?: any;
  imageHeight?: any;
  link?: any;
  video?: VideoModel;

  imageOriginal;
  width;
  widthOriginal;
  height;
  heightOriginal;
}
