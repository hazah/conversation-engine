import Agent from './agent/entity';
import Lobby from './lobby/entity';

export default class LobbyAlreadyHasAgent {
  constructor(private lobby: Lobby, private agent: Agent) {}
}
