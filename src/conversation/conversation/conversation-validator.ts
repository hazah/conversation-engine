import ConversationUnknownToAgent from '../conversation-unknown-to-agent';
import Validator from '../validator';
import Conversation from './entity';
import Agent from '../agent/entity';

export default class ConversationValidator implements Validator {
  validate(conversation: Conversation): void {
    conversation.agents.forEach((agent: Agent) => {
      if (agent.conversations.indexOf(conversation) === -1) {
        throw new ConversationUnknownToAgent(conversation, agent);
      }
    });
  }
}
