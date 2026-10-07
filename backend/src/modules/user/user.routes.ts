import { Router } from "express";
import { userValidation } from "./user.validation.js";
import { validate } from "../../middlewares/validate.js";
import { userController } from "./user.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authentication, userController.getUser);

userRouter.get("/all", authentication, userController.geAlltUser);

userRouter.post(
    "/signup",
    validate(userValidation.signUpSchema),
    userController.signUp,
);

userRouter.post(
    "/lgoin",
    validate(userValidation.loginSchema),
    userController.login,
);

userRouter.post("/logout", authentication, userController.logout);

export { userRouter };
