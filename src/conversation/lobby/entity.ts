import Agent from '../agent/entity';
import EventStore from '../event-store';
import LobbyAlreadyHasAgent from '../lobby-already-has-agent';

export default class Lobby {
  private _agents: Agent[] = new Array<Agent>();

  public constructor(private eventStore: EventStore) {
  }

  public get agents(): Agent[] {
    return this._agents;
  }

  public add(agent: Agent): void {
    if (this.agents.indexOf(agent) !== -1) {
      throw new LobbyAlreadyHasAgent(this, agent);
    }
    this.agents.push(agent);
  }
  
  public remove(agent: Agent): void {
  }

  public validate(): void {

  }
}