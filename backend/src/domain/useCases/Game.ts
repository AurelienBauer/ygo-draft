import { Games } from "../../types";

interface GameAction {
  stage?: string;
  nextStage?: string;
  action: string;
  datetime?: Date;
}

export default class Game {
  private actionsStack: GameAction[];

  private gameStage: string;

  private name: Games;

  constructor(name: Games) {
    this.actionsStack = [];
    this.gameStage = "room";
    this.name = name;
  }

  public newAction(action: GameAction) {
    this.actionsStack.push({
      ...action,
      datetime: new Date(),
      stage: this.gameStage,
    });
  }

  public popAction(): GameAction | undefined {
    return this.actionsStack.pop();
  }

  public getLastAction(): GameAction | undefined {
    return this.actionsStack[this.actionsStack.length - 1];
  }

  public changeGameState(newStage: string) {
    this.newAction({
      action: `New game stage: from ${this.gameStage} to ${newStage}`,
      nextStage: newStage,
    });
    this.gameStage = newStage;
  }

  public getStage(): string {
    return this.gameStage;
  }

  public getName(): string {
    return this.name;
  }
}
