import Agent from './agent/entity';
import Conversation from './conversation/entity';

export default class ConversationAlreadyHasAgent {
  public constructor(public conversation: Conversation, public agent: Agent) {}
}
