import Agent from './agent/entity';
import ConversationRequest from './conversation-request';

export default class Requested {
  public constructor(public by: Agent, public request: ConversationRequest) {}
}
