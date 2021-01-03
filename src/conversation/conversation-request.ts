import Agent from './agent/entity';
import Conversation from './conversation/entity';

export default class ConversationRequest {
  public constructor(
    public agents: Agent[],
    private _conversation: Conversation,
  ) {}

  public get conversation(): Conversation {
    return this._conversation;
  }
}
