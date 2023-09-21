import UserModel from "@/modules/Auth/models/UserModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class CommentModel extends BaseViewModel {
  id: number;
  postId: number;
  createDate: number;
  text: string;
  type: number;
  vote: number;
  userVote?: any;
  user: UserModel;
}
