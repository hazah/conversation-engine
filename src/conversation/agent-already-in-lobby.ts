import Agent from './agent/entity';
import Lobby from './lobby/entity';

export default class AgentAlreadyInLobby {
  constructor(private agent: Agent, private lobby: Lobby) {}
}
