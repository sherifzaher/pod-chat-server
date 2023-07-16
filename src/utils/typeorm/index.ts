import { User } from './entities/User';
import { Session } from './entities/Session';
import { Conversation } from './entities/Conversation';
import { Group } from './entities/Group';
import { Message } from './entities/Message';
import { GroupMessage } from './entities/GroupMessage';
const entities = [User, Session, Conversation, Message, Group, GroupMessage];

export { User, Session, Conversation, Message, Group, GroupMessage };

export default entities;
