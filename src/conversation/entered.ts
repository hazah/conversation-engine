import Agent from "./agent/entity";
import Lobby from "./lobby/entity";

export default class Entered {
  constructor(private _agent: Agent, private _lobby: Lobby) {}

  public get agent(): Agent {
    return this._agent;
  }

  public get lobby(): Lobby {
    return this._lobby;
  }
}