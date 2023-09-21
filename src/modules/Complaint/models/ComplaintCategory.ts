import { BaseViewModel } from "@/_core/models/BaseViewModel";

export class ComplaintCategory extends BaseViewModel {
  id: string | number;
  name: string;

  public constructor(init?: Partial<ComplaintCategory>) {
    super();
    Object.assign(this, init);
  }
}
