import Agent from '../agent/entity';
import LobbyUnknownToAgent from '../lobby-unknown-to-agent';
import Validator from '../validator';
import Lobby from './entity';

export default class LobbyValidator implements Validator {
  validate(lobby: Lobby): void {
    lobby.agents.forEach((agent: Agent) => {
      if (agent.lobbies.indexOf(lobby) === -1) {
        throw new LobbyUnknownToAgent(lobby, agent);
      }
    });
  }
}