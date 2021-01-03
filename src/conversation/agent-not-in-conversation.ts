import Agent from './agent/entity';
import Conversation from './conversation/entity';

export default class AgentNotInConversation {
  public constructor(public agent: Agent, public conversation: Conversation) {}
}
