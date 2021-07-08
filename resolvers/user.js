import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthenticationError } from "apollo-server";

export default (db) => {
  const User = db.collection("user");

  return {
    Query: {
      getUserByEmail: async (_, { email }, context) => {
        console.log(context);
        return await User.findOne({ email });
      },
      getAllUsers: async () => {
        const userArray = [];
        await User.find()
          .toArray()
          .then((users) => {
            users.map((user) => {
              userArray.push(user);
            });
          });

        return userArray;
      },
      getCurrentUser: async (_, {}, { user }) => {
        const email = user.email;
        return await User.findOne({ email });
      },
    },
    Mutation: {
      createUser: async (_, { user }, context) => {
        try {
          const email = user.email;
          var salt = bcrypt.genSaltSync(10);
          var password = bcrypt.hashSync(user.password, salt);
          const doc = await User.findOne({ email });
          if (doc) throw new Error("User already exist");
          await User.insertOne({ ...user, createdAt: new Date() });
          const userDoc = await User.updateOne(
            { email: email },
            {
              $set: { password: password },
            }
          );

          const token = jwt.sign(
            { id: userDoc._id, email: userDoc.email },
            process.env.JWT_SECRET,
            { algorithm: "HS256", expiresIn: "1d" }
          );
          return {
            success: true,
            message: "User Created Successfully!",
            token: token,
            user: email,
          };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
      updateUser: async (_, { name, email }, { user }) => {
        console.log(user);
        if (!user || user.email !== email)
          throw new AuthenticationError("Please autheticate");
        await User.updateOne(
          { email: email },
          {
            $set: { name: name },
          }
        );
        return true;
      },
      login: async (_, { email, password }, context) => {
        try {
          const doc = await User.findOne({ email });
          if (!doc) {
            throw new Error("No such user found");
          }
          const valid = await bcrypt.compare(password, doc.password);
          if (!valid) {
            throw new Error("Invalid password");
          }
          const token = jwt.sign(
            { id: doc._id, email: doc.email },
            process.env.JWT_SECRET,
            {
              algorithm: "HS256",
              expiresIn: "1d",
            }
          );
          return {
            success: true,
            message: "User Logged in Successfully",
            token: token,
            user: doc.email,
          };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
  };
};
