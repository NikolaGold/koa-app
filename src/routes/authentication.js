import Router from "koa-router";
import jwt from "jsonwebtoken";
import {
  INVALID_CREDENTIALS,
  LOGIN_SUCCESSFUL,
  LOGOUT_SUCCESSFUL,
} from "../utils/constants.js";
import { config } from "../config.js";

const router = new Router();

export const users = {
  admin: { password: "admin123", username: "admin", role: "admin" },
  user: { password: "user123", username: "user", role: "user" },
};

router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body;

  const user = users[username];

  if (user && user.password === password) {
    const sessionToken = jwt.sign(
      { username, role: user.role },
      config.secretKey,
      {
        expiresIn: "1h",
      },
    );

    ctx.cookies.set("session", sessionToken);
    ctx.body = { message: LOGIN_SUCCESSFUL };
  } else {
    ctx.status = 401;
    ctx.body = { error: INVALID_CREDENTIALS };
  }
});

router.post("/logout", async (ctx) => {
  ctx.cookies.set("session", null, { expires: new Date(0) });
  ctx.body = { message: LOGOUT_SUCCESSFUL };
});

export default router;
