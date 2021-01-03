import Agent from '../agent/entity';
import EventStore from '../event-store';
import LobbyAlreadyHasAgent from '../lobby-already-has-agent';
import LobbyUnknownToAgent from '../lobby-unknown-to-agent';
import Validator from '../validator';

export default class Lobby {
  private _agents: Agent[] = new Array<Agent>();
  private _error: any;

  public constructor(
    private eventStore: EventStore,
    private validator: Validator,
  ) {}

  public get agents(): Agent[] {
    return this._agents;
  }

  public get error(): any {
    return this._error;
  }

  public add(agent: Agent): void {
    if (this.agents.indexOf(agent) !== -1) {
      throw new LobbyAlreadyHasAgent(this, agent);
    }
    this.agents.push(agent);
  }

  public remove(agent: Agent): void {
    const index = this.agents.indexOf(agent);
    if (index === -1) {
      throw new LobbyUnknownToAgent(this, agent);
    }
    this.agents.splice(index, 1);
  }

  public validate(): void {
    this._error = null;
    this.validator.validate(this);
  }

  public valid(): boolean {
    try {
      this.validate();
      return true;
    } catch (error) {
      this._error = error;
      return false;
    }
  }
}
