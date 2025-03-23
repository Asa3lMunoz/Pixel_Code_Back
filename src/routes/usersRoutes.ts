import { Elysia } from "elysia";
import {getUsers} from "../controllers/usersController";

export const usersRoutes = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    return await getUsers();
  });