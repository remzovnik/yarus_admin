import { BaseViewModel } from "@/_core/models/BaseViewModel";
import QuestModel from "./QuestModel";

export default class QuestCategoryModel extends BaseViewModel {
  id: number;
  name: string;
  quests: QuestModel[];
}
