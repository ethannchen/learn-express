import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { promises as fsPromises } from "fs";
import path from "path";
import readUsersRouter from "./readUsers";
import writeUsersRouter from "./writeUsers";
import { User, UserRequest } from "./types";

const app: Express = express();
const port: number = 8000;
const dataFile = "../data/users.json";

let users: User[];

// Function to read users from the file
async function readUsersFile() {
  try {
    console.log("reading file ... ");
    const data = await fsPromises.readFile(path.resolve(__dirname, dataFile));
    users = JSON.parse(data.toString());
    console.log("File read successfully");
  } catch (err) {
    console.error("Error reading file:", err);
    throw err;
  }
}

readUsersFile();
// Middleware function to add users to the request
const addMsgToRequest = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (users) {
    (req as UserRequest).users = users;
    next();
  } else {
    return res.json({
      error: { message: "users not found", status: 404 },
    });
  }
};

// Middleware and body parsers
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(addMsgToRequest);
app.use("/read", readUsersRouter);
app.use("/write", writeUsersRouter);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
