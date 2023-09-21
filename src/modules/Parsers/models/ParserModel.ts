import { BaseViewModel } from "@/_core/models/BaseViewModel";

export enum ParserStatus {
  DISABLED = 0,
  ENABLED = 1,
}
export enum ParserCategory {
  ALL = "all",
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISABLED = "disabled",
  INVALID = "invalid",
}
export class ParserCategoryModel extends BaseViewModel {
  id: string;
  name: string;
  counter: number;
  new_counter: number;
  new_parsers: any[];
}

export enum ParsersActionType {
  DISABLE = "отключить",
  ENABLE = "включить",
}

export class ParserModel extends BaseViewModel {
  _id: number;
  name: string;
  last_update: string | null;
  is_new?: boolean;
  status: ParserStatus;
}

export type ParserStats = {
  active: number;
  inactive: number;
  all: number;
  invalid: number;
  disabled: number;
};
