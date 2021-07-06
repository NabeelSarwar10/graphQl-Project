import { combineResolvers } from "apollo-resolvers";
import userResolvers from "./user";

export default (db) => combineResolvers([ userResolvers(db)]);
