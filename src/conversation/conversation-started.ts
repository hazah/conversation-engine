import Conversation from './conversation/entity';

export default class ConversationStarted {
  public constructor(public conversation: Conversation) {}
}
