import Agent from './agent/entity';
import Conversation from './conversation/entity';
import ReplyToPending from './reply-to-pending';

export default class AcceptRequest implements ReplyToPending {
  public constructor(public agent: Agent, public conversation: Conversation) {}
}
