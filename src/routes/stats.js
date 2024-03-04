import Router from "koa-router";
import { readDataFromFile } from "../utils/utils.js";
import jwt from "jsonwebtoken";
import { users } from "./authentication.js";
import {
  ERROR_MESSAGE_FOR_LOGOUT_USER,
  INVALID_TOKEN_MESSAGE,
  PERMISSION_DENIED,
  TOKEN_VERIFICATION_FAILED,
} from "../utils/constants.js";
import { config } from "../config.js";

const router = new Router();

router.get("/stats", async (ctx) => {
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

    if (userRole === users.admin.role) {
      ctx.body = await readDataFromFile();
    } else {
      ctx.status = 403;
      ctx.body = { error: PERMISSION_DENIED };
    }
  } catch (err) {
    console.error(TOKEN_VERIFICATION_FAILED, err.message);
    ctx.status = 401;
    ctx.body = { error: INVALID_TOKEN_MESSAGE };
  }
});

export default router;
