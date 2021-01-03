import Lobby from '../lobby/entity';
import EventStore from '../event-store';
import Entered from '../entered';
import Exited from '../exited';
import AgentAlreadyInLobby from '../agent-already-in-lobby';
import AgentNotInLobby from '../agent-not-in-lobby';
import Validator from '../validator';
import ConversationRequest from '../conversation-request';
import Requested from '../requested';
import PendingReply from '../pending-reply';
import Conversation from '../conversation/entity';
import Replied from '../replied';
import AgentNotInConversationRequest from '../agent-not-in-conversation-request';
import ConversationInitiation from '../conversation-initiation';
import ReplyToPending from '../reply-to-pending';
import AcceptRequest from '../accept-request';
import AgentAlreadyInConversation from '../agent-already-in-conversation';
import AgentNotInConversation from '../agent-not-in-conversation';
import ConversationValidator from '../conversation/conversation-validator';
import AgentNotInAnyLobby from '../agent-not-in-any-lobby';

export default class Agent {
  private _lobbies: Lobby[] = new Array<Lobby>();
  private _error: any = null;
  private _pendingReplies: PendingReply[] = new Array<PendingReply>();
  private _conversations: Conversation[] = new Array<Conversation>();

  public constructor(
    private eventStore: EventStore,
    private validator: Validator,
  ) {}

  public get lobbies(): Lobby[] {
    return this._lobbies;
  }

  public get conversations(): Conversation[] {
    return this._conversations;
  }

  public get error(): any {
    return this._error;
  }

  public get pendingReplies(): PendingReply[] {
    return this._pendingReplies;
  }

  public enter(lobby: Lobby): void {
    this.eventStore.publish(new Entered(this, lobby));
  }

  public exit(lobby: Lobby): void {
    this.eventStore.publish(new Exited(this, lobby));
  }

  public request(agents: Agent[], lobby: Lobby): void {
    if (agents.length === 0) {
      return;
    }
    
    if (this.lobbies.indexOf(lobby) === -1) {
      throw new AgentNotInLobby(this, lobby);
    }

    agents.forEach(function (agent: Agent) {
      if (agent.lobbies.indexOf(lobby) === -1) {
        throw new AgentNotInLobby(agent, lobby);
      }
    });

    this.eventStore.publish(
      new Requested(
        this,
        new ConversationRequest(
          [this, ...agents],
          new Conversation(this.eventStore, new ConversationValidator(), lobby),
        ),
      ),
    );
  }

  public accept(request: ConversationRequest): void {
    if (request.agents.indexOf(this) === -1) {
      throw new AgentNotInConversationRequest(this, request);
    }
    const pendingReply = this.pendingReplies.find(function (
      pendingReply: PendingReply,
    ) {
      return request === pendingReply.request;
    });

    let reply: ReplyToPending;
    if (pendingReply) {
      reply = new AcceptRequest(this, request.conversation);
    } else {
      reply = new ConversationInitiation(this, request.conversation);
    }
    this.eventStore.publish(new Replied(reply));
  }

  public add(entity: Lobby | Conversation): void {
    if (entity instanceof Lobby) {
      const lobby: Lobby = entity;
      if (this.lobbies.indexOf(lobby) !== -1) {
        throw new AgentAlreadyInLobby(this, lobby);
      }
      this.lobbies.push(lobby);
    }

    if (entity instanceof Conversation) {
      const conversation: Conversation = entity;
      if (this.conversations.indexOf(conversation) !== -1) {
        throw new AgentAlreadyInConversation(this, conversation);
      }
    }
  }

  public remove(entity: Lobby | Conversation): void {
    if (entity instanceof Lobby) {
      const lobby: Lobby = entity;
      const index = this.lobbies.indexOf(lobby);
      if (index === -1) {
        throw new AgentNotInLobby(this, lobby);
      }
      this.lobbies.splice(index, 1);
    }

    if (entity instanceof Conversation) {
      const conversation: Conversation = entity;
      const index = this.conversations.indexOf(conversation);
      if (index === -1) {
        throw new AgentNotInConversation(this, conversation);
      }
      this.conversations.splice(index, 1);
    }
  }

  public pending(reply: PendingReply): void {
    this.pendingReplies.push(reply);
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
