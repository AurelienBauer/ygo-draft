export interface IRoom {
  title: string;
  uuid: string;
  players: IPlayer[];
  adminId: {
    pub: string;
  };
  iAmAdmin?: boolean;
  createdBy: string;
  createdAt: string;
}

export interface IPlayer {
  uuid: string;
  socketID: string;
  name: string;
  room?: IRoom;
  connected: boolean;
}

export interface ICard {
  attribute: string;
  description: string;
  id: string;
  image_small_url: string;
  image_url: string;
  level: number;
  _type: string;
  name: string;
  _id: string;
  uuid: string;
  frameType: string;
  atk?: number;
  def?: number;
  race?: string;
  archetype?: string;
}

export interface IDisconnectionMsg {
  message: "disconnected" | "disconnection_failed";
}
