import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`Db Running on: ${process.env.DB_MONGO}`);
  } catch (e) {
    console.error('Error Ocurred Connecting MONGOOSE: ', e);
    process.exit(1);
  }
};
