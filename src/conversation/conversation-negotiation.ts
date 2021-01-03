import AcceptRequest from './accept-request';
import Agent from './agent/entity';
import ConversationInitiation from './conversation-initiation';
import ConversationRequest from './conversation-request';
import ConversationStart from './conversation-start';
import Conversation from './conversation/entity';
import EventStore from './event-store';
import PendingReply from './pending-reply';
import RejectRequest from './reject-request';
import Replied from './replied';
import ReplyToPending from './reply-to-pending';
import Requested from './requested';

export default class ConversationNegotiation {
  public constructor(private eventStore: EventStore) {
    this.eventStore.register(Requested, this.requested);
    this.eventStore.register(Replied, this.replied);
  }

  public requested(event: Requested): void {
    const waiting: Agent = event.by;
    const details: ConversationRequest = event.request;
    const eventStore = this.eventStore;
    details.agents.forEach(function (agent) {
      if (waiting === agent) {
        agent.accept(details);
      } else {
        agent.pending(new PendingReply(eventStore, waiting, agent, details));
      }
    });
  }

  public replied(event: Replied): void {
    const reply: ReplyToPending = event.reply;
    const agent: Agent = reply.agent;
    const conversation: Conversation = reply.conversation;

    if (!(reply instanceof RejectRequest)) {
      agent.add(conversation);
      conversation.add(agent);
    } else {
    }

    agent.validate();
    conversation.validate();

    if (reply instanceof ConversationInitiation) {
      conversation.start();
    }
  }
}
