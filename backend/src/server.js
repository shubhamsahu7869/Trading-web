import app, { connectMongo } from "./app.js";

const port = process.env.PORT || 5000;

async function start() {
  await connectMongo();
  if (process.env.MONGODB_URI) console.log("MongoDB connected");
  app.listen(port, () => console.log(`FinPulse API running on ${port}`));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
