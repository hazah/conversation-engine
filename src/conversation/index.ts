import AgentValidator from './agent/agent-validator';
import _Agent from './agent/entity';
import _Lobby from './lobby/entity';
import EventStore from './event-store';
import LobbyValidator from './lobby/lobby-validator';

export const eventStore: EventStore = new EventStore();

export class Agent extends _Agent {
  constructor() {
    super(eventStore, new AgentValidator());
  }
}

export class Lobby extends _Lobby {
  constructor() {
    super(eventStore, new LobbyValidator());
  }
}
