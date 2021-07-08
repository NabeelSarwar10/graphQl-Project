import { AuthenticationError } from "apollo-server";
import { pathToArray } from "graphql/jsutils/Path";
import { ObjectID } from "mongodb";

export default (db) => {
  const User = db.collection("user");
  const Post = db.collection("post");
  return {
    Post: {
      createdBy: async ({ createdBy }) => {
        try {
          return await User.findOne({ _id: ObjectID(createdBy) });
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    Query: {
      getPostById: async (_, { _id }, { user }) => {
        if (!user) throw new AuthenticationError("Please autheticate");
        try {
          return await Post.findOne({ _id: ObjectID(_id) });
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
      getAllPosts: async () => {
        const postArray = [];
        await Post.find()
          .toArray()
          .then((docs) => {
            docs.map((doc) => {
              postArray.push(doc);
            });
          });
        return postArray;
      },
      getCurrentUserPost: async (_, {}, { user }) => {},
    },
    Mutation: {
      createPost: async (_, { post }, { user }) => {
        if (!user) throw new AuthenticationError("Please autheticate");
        try {
          await Post.insertOne({
            ...post,
            createdAt: new Date(),
            createdBy: ObjectID(user.id),
          });
          return {
            success: true,
            message: "Post created Successfully!",
          };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
  };
};
