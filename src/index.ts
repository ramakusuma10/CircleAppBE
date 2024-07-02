import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import AuthController from "./controllers/auth";
import ThreadController from "./controllers/thread";
import UserController from "./controllers/user";
import ReplyController from "./controllers/reply";
import FollowController from "./controllers/follow";
import LikeController from "./controllers/like";
import upload from "./middlewares/upload-file";
import authenticate from "./middlewares/authenticate";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../swagger/swagger-output.json";
import { initializeRedisClient, redisClient } from "./libs/redis";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";


dotenv.config();

const app = express();
const port =  process.env.PORT || 5000;
const router = express.Router();
const routerv2 = express.Router();

initializeRedisClient().then(() => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, 
    standardHeaders: "draft-7", 
    legacyHeaders: false, 
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
  });

  app.use(limiter)
  app.use(cors());
  app.use(express.json());
  app.use("/api/v1", router);
  app.use("/api/v2", routerv2);
  app.use("/uploads", express.static("uploads"));
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello welcome to circle!");
  });

  // v1
  router.get("/", (req: Request, res: Response) => {
    res.send("Welcome to v1!");
  });

  router.get("/threads", authenticate,  async (req: Request, res: Response, next: NextFunction) => {
    const result = await redisClient.get("THREADS_DATA");
    if (result) return res.json(JSON.parse(result));

    next();
  },ThreadController.find);
  router.get("/threads/:id", authenticate, ThreadController.findOne);
  router.get("/threads/user/:id", authenticate, ThreadController.findUser);

  router.post("/threads",authenticate,upload.single("image"),ThreadController.create);
  router.delete("/threads/:id", authenticate, ThreadController.delete);

  router.delete("/replies/:id", authenticate, ReplyController.delete)
  router.post('/replies',upload.single('image'),authenticate,ReplyController.create)

  router.get("/follow/:id", authenticate, FollowController.follow)
  router.get("/unfollow/:id", authenticate, FollowController.unfollow)

  router.post("/likes", authenticate, LikeController.like)
  router.get("/search", authenticate, UserController.search)


  router.get("/users", authenticate,UserController.find)
  router.get("/profile", authenticate, UserController.findlogged)
  router.get("/users/:id", authenticate, UserController.findOne)
  router.patch("/users/profile",upload.single('avatar'),authenticate,UserController.update)

  router.post("/auth/register", AuthController.register)
  router.post("/auth/login", AuthController.login)
  router.post("/auth/forgot", AuthController.forgotPassword)
  router.patch("/auth/reset", authenticate, AuthController.resetPassword)

  // v2
  routerv2.get("/", (req: Request, res: Response) => {
    res.send("Welcome to v2!");
  });

  initializeRedisClient().then(() => {
    app.listen(port, () => {
      console.log(`Server berjalan di port ${port}`);
    });
  });
});