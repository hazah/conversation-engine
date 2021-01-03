import Entered from './entered';
import Exited from './exited';

import EventStore from './event-store';

export default class LobbyEntry {
  public constructor(private eventStore: EventStore) {
    this.eventStore.register(Entered, this.entered);
    this.eventStore.register(Exited, this.exited);
  }

  public entered(entered: Entered): void {
    const agent = entered.agent;
    const lobby = entered.lobby;

    agent.add(lobby);
    lobby.add(agent);

    agent.validate();
    lobby.validate();
  }

  public exited(exited: Exited): void {
    const agent = exited.agent;
    const lobby = exited.lobby;

    agent.remove(lobby);
    lobby.remove(agent);

    agent.validate();
    lobby.validate();
  }
}
