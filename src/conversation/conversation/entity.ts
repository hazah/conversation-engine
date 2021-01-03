import Agent from '../agent/entity';
import ConversationAlreadyHasAgent from '../conversation-already-has-agent';
import ConversationStarted from '../conversation-started';
import ConversationUnknownToAgent from '../conversation-unknown-to-agent';
import EventStore from '../event-store';
import Lobby from '../lobby/entity';
import Validator from '../validator';

export default class Conversation {
  private _agents: Agent[] = new Array<Agent>();
  private _error: any = null;

  public constructor(
    private eventStore: EventStore,
    private validator: Validator,
    private lobby: Lobby,
  ) {}

  public get agents(): Agent[] {
    return this._agents;
  }

  public add(agent: Agent) {
    if (this.agents.indexOf(agent) !== -1) {
      throw new ConversationAlreadyHasAgent(this, agent);
    }
    this.agents.push(agent);
  }

  public remove(agent: Agent): void {
    const index = this.agents.indexOf(agent);
    if (index === -1) {
      throw new ConversationUnknownToAgent(this, agent);
    }
    this.agents.splice(index, 1);
  }

  public start(): void {
    this.eventStore.publish(new ConversationStarted(this));
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
