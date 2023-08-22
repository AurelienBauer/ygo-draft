export interface YGORequestResponse {
  status: number;
  statusText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any;
}

export interface YGOCardImages {
  image_url: string;
  image_url_small: string;
}

export interface YGOCardResponseBody {
  id: number;
  name: string;
  desc: string;
  card_images?: YGOCardImages[];
  type?: string;
  attribute?: string;
  level?: number;
  frameType: string;
  atk?: number;
  def?: number;
  race?: string;
  archetype?: string;
}
