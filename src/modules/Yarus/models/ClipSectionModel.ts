import { BaseViewModel } from "@/_core/models/BaseViewModel";
import ClipItemModel from "./ClipItemModel";

export default class ClipSectionModel extends BaseViewModel {
  tag: string;
  description: string;
  clips: ClipItemModel[];
}
