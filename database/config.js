import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw new Error("Fallo la conexión a la base de datos");
  }
};

export default dbConnection;
