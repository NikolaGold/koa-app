import Router from "koa-router";
import { readDataFromFile, writeDataToFile } from "../utils/utils.js";
import jwt from "jsonwebtoken";
import {
  ERROR_MESSAGE_FOR_LOGOUT_USER,
  ERROR_MESSAGE_INVALID_INPUT,
  INVALID_TOKEN_MESSAGE,
  MESSAGE_SENT_SUCCESSFUL,
  TOKEN_VERIFICATION_FAILED,
} from "../utils/constants.js";
import { config } from "../config.js";

const router = new Router();

router.post("/message", async (ctx) => {
  const session = ctx.cookies.get("session");

  if (!session) {
    ctx.status = 401;
    ctx.body = {
      error: ERROR_MESSAGE_FOR_LOGOUT_USER,
    };
    return;
  }

  try {
    const decoded = jwt.verify(session, config.secretKey);
    const userRole = decoded.role;

    if (userRole) {
      const { from, to, message } = ctx.request.body;
      const data = await readDataFromFile();
      const hasValidMessage = from && to && message;
      const messagePropertiesAreString =
        typeof from === "string" &&
        typeof to === "string" &&
        typeof message === "string";

      if (hasValidMessage && messagePropertiesAreString) {
        await writeDataToFile({
          // There is a race condition, and this could be resolved by some library like a https://www.npmjs.com/package/async-lock
          numberOfCalls: data.numberOfCalls + 1,
          lastMessage: { from, to, message },
        });

        ctx.body = { success: true, message: MESSAGE_SENT_SUCCESSFUL };
      } else {
        ctx.status = 400;
        ctx.body = {
          error: ERROR_MESSAGE_INVALID_INPUT,
        };
      }
    }
  } catch (err) {
    console.error(TOKEN_VERIFICATION_FAILED, err.message);
    ctx.status = 401;
    ctx.body = { error: INVALID_TOKEN_MESSAGE };
  }
});

export default router;
