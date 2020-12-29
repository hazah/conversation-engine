import Lobby from '../lobby/entity';
import EventStore from '../event-store';
import Entered from '../entered';
import Exited from '../exited';
import AgentAlreadyInLobby from '../agent-already-in-lobby';
import AgentNotInLobby from '../agent-not-in-lobby';
import Validator from '../validator';

export default class Agent {
  private _lobbies: Lobby[] = new Array<Lobby>();
  private _error: any = null;

  public constructor(private eventStore: EventStore, private validator: Validator) {}

  public get lobbies(): Lobby[] {
    return this._lobbies;
  }

  public get error(): any {
    return this._error;
  }

  public enter(lobby: Lobby): void {
    this.eventStore.publish(new Entered(this, lobby));
    this.eventStore.process_events();
  }

  public exit(lobby: Lobby): void {
    this.eventStore.publish(new Exited(this, lobby));
    this.eventStore.process_events();
  }

  public add(lobby: Lobby): void {
    if (this.lobbies.indexOf(lobby) !== -1) {
      throw new AgentAlreadyInLobby(this, lobby);
    }
    this.lobbies.push(lobby);
  }

  public remove(lobby: Lobby): void {
    const index = this.lobbies.indexOf(lobby);
    if (index === -1) {
      throw new AgentNotInLobby(this, lobby);
    }
    this.lobbies.splice(index, 1);
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