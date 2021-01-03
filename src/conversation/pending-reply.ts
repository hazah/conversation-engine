import Agent from './agent/entity';
import ConversationInitiation from './conversation-initiation';
import ConversationRequest from './conversation-request';
import Conversation from './conversation/entity';
import EventStore from './event-store';
import ReplyToPending from './reply-to-pending';

export default class PendingReply {
  public constructor(
    private eventStore: EventStore,
    public waiting: Agent,
    public from: Agent,
    public request: ConversationRequest,
  ) {}

  reply(pending: ReplyToPending): void {
    if (pending as ConversationInitiation) {
      const conversation: Conversation = this.request.conversation;
    }
  }
}
