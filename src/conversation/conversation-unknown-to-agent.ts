import Agent from './agent/entity';
import Conversation from './conversation/entity';

export default class ConversationUnknownToAgent {
  public constructor(public conversation: Conversation, public agent: Agent) {}
}
