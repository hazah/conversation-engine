import AgentNotInLobby from "../agent-not-in-lobby";
import Lobby from "../lobby/entity";
import Validator from "../validator";
import Agent from "./entity";

export default class AgentValidator implements Validator {
  validate(agent: Agent): void {
    agent.lobbies.forEach((lobby: Lobby) => {
      if (lobby.agents.indexOf(agent) === -1) {
        throw new AgentNotInLobby(agent, lobby);
      }
    })
  }
}