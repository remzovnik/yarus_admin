import { ComplaintCategory } from "@/modules/Complaint/models/ComplaintCategory";

export class ComplaintModel {
  id: string | number;
  date: string;
  email?: string;
  material: string;
  user: string;
  category: ComplaintCategory;

  public constructor(init?: ComplaintModel) {
    Object.assign(this, init);
  }
}
