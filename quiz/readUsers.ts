import express, { Response } from "express";
import { UserRequest } from "./types";
const router = express.Router();

router.get("/usernames", (req: UserRequest, res: Response) => {
  let usernames = req.users?.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

router.get("/username/:name", (req: UserRequest, res: Response) => {
  let users_with_name = req.users?.filter(
    (u) => u.username === req.params.name
  );
  if (users_with_name?.length === 0) {
    res.send({
      error: { message: "User not found", status: 404 },
    });
  } else {
    res.send(users_with_name);
  }
});

export default router;
