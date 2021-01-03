import Agent from './agent/entity';
import Conversation from './conversation/entity';

export default class AgentAlreadyInConversation {
  public constructor(public agent: Agent, public conversation: Conversation) {}
}
