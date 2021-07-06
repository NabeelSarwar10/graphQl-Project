import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default (db) => {
  const User = db.collection("user");
  return {
    Query: {
      getUserByEmail: async (_, { email }, context) => {
        return await User.findOne({ email });
      },
      getAllUsers: async () => {
        const users = await User.find({});
        const userMap = [];
        await users.map((user) => {
          console.log(user);
          userMap.push(user);
        });
        return userMap;
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
          await User.insertOne(user);
          const userDoc = await User.updateOne(
            { email: email },
            {
              $set: { password: password },
            }
          );
          const token = jwt.sign(
            { userId: userDoc._id },
            process.env.JWT_SECRET
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
      updateUser: async (_, { name, email }) => {
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
          const token = jwt.sign({ userId: doc._id }, process.env.JWT_SECRET);
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
