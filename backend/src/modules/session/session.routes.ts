import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { refreshTokenSchema } from "./session.validation.js";
import { refreshAccessToken } from "./session.controller.js";

const sessionRouter = Router();

sessionRouter.post("/", validate(refreshTokenSchema), refreshAccessToken);

export { sessionRouter };
