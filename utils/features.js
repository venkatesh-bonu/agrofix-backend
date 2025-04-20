import mongoose from "mongoose";

export const connectDb = (uri) => {
  mongoose
    .connect(uri, { dbName: "agrofix" })
    .then((data) => console.log(`Database Connected: ${data.connection.host}`))
    .catch((err) => console.log(err));
};
