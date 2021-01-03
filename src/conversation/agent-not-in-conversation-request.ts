import Agent from './agent/entity';
import ConversationRequest from './conversation-request';

export default class AgentNotInConversationRequest {
  public constructor(
    private agent: Agent,
    private request: ConversationRequest,
  ) {}
}
