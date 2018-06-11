import User from './user/typeDefs';
import schema from './defaultTypes';
import Card from './card/typeDefs';
import Operation from './operation/typeDefs';
import Group from './group/typeDefs';
import Worker from './worker/typeDefs';
import Product from './product/typeDefs';

const types = [...schema, ...User, ...Card, ...Operation, ...Group, ...Worker, ...Product];

export default types;
