import { User } from './entities/User';
import { Session } from './entities/Session';
import { Conversation } from './entities/Conversation';
import { GroupConversation } from './entities/GroupConversation';
import { Message } from './entities/Message';
const entities = [User, Session, Conversation, Message, GroupConversation];

export { User, Session, Conversation, Message, GroupConversation };

export default entities;
