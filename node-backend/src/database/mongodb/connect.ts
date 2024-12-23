import mongoose from 'mongoose';

/**
 * Connect to MongoDB with retry mechanism
 * @param {string} uri MongoDB connection URI
 * @param {number} retries Number of retries before failing
 * @param {number} delay Delay between retries in milliseconds
 */
const connectMongoDB = async (
  uri: string,
  retries: number = 3,
  delay: number = 5000
) => {
  let attempt = 0;

  const connectWithRetry = async () => {
    attempt++;
    try {
      await mongoose.connect(uri);
      console.log('Successfully connected to MongoDB');
    } catch (error: any) {
      if (attempt <= retries) {
        console.error(
          `Attempt ${attempt} failed. Retrying in ${delay / 1000} seconds...`
        );
        setTimeout(connectWithRetry, delay);
      } else {
        console.error(
          'Error connecting to MongoDB after multiple attempts:',
          error.message
        );
        process.exit(1);
      }
    }
  };

  await connectWithRetry();

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection lost');
  });
};

export default connectMongoDB;
