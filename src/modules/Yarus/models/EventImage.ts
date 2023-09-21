export interface Mobile {
  url: string;
  width: number;
  height: number;
}

export interface Original {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  sourceUrl: string;
  mobile: Mobile;
  original: Original;
}
