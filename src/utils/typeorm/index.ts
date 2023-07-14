import { User } from './entities/User';
import { Session } from './entities/Session';
import { Conversation } from './entities/Conversation';
import { Group } from './entities/Group';
import { Message } from './entities/Message';
const entities = [User, Session, Conversation, Message, Group];

export { User, Session, Conversation, Message, Group };

export default entities;
