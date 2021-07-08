export default async (db, { req }) => {
  const User = db.collection("user");
  const token = req.headers.authorization || "";
  console.log(token);
  const user = await User.findOne(req.payload.id);
  if (user) {
    console.log(user);
  }
};
