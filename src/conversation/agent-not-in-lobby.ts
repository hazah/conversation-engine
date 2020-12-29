import Agent from "./agent/entity";
import Lobby from "./lobby/entity";


export default class AgentNotInLobby {
  constructor(private agent: Agent, private lobby: Lobby) {}
}