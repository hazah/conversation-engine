import Agent from './agent/entity';
import Conversation from './conversation/entity';

export default interface ReplyToPending {
  agent: Agent;
  conversation: Conversation;
}
