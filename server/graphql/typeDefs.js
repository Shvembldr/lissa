import { User } from './user/typeDefs';
import schema from './defaultTypes';

const types = [...schema, ...User];

export default types;
