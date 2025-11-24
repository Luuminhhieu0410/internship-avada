import Router from "@koa/router";
import * as taskHandler from "../handlers/task.handler";
import { validateInputTask } from "../middleware/task.middleware";

const router = new Router({ prefix: "/tasks" });

router.get("/", taskHandler.getAllTasks);
router.post("/", validateInputTask, taskHandler.addNewTask);
router.put("/:id", taskHandler.updateTask);
router.delete("/", taskHandler.deleteTask);
export default router;
