import { combineResolvers } from "apollo-resolvers";
import userResolvers from "./user";
import postResolvers from "./post";

export default (db) => combineResolvers([ userResolvers(db),postResolvers(db)]);
