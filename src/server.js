import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "koa-logger";
import { config } from "./config.js";
import authentication from "./routes/authentication.js";
import message from "./routes/message.js";
import stats from "./routes/stats.js";

const app = new Koa();

const PORT = config.port;

app.use(bodyParser());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(logger());

app.use(stats.routes());
app.use(authentication.routes());
app.use(message.routes());

const server = app
  .listen(PORT, async () => {
    console.log(`Server listening on port: ${PORT}`);
  })
  .on("error", (err) => {
    console.error(err);
  });

export default server;
