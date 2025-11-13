import Router from "koa-router";
import type { Context } from "koa";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [
  {
    id: 1,
    title: "task 1",
    completed: true,
  },
  {
    id: 2,
    title: "task 2",
    completed: false,
  },
  {
    id: 3,
    title: "task 3",
    completed: true,
  },
  {
    id: 4,
    title: "task 4",
    completed: false,
  },
  {
    id: 5,
    title: "task 5",
    completed: true,
  },
];

const router = new Router();

// GET /todos
router.get("/tasks", (ctx: Context) => {
  ctx.response.body = todos;
});


// POST /todos
router.post("/tasks", (ctx) => {
  const { title }: any = ctx.request.body;
  if (!title) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Title is required" };
    return;
  }
  const maxId = todos.reduce((acc, current) => {
    return acc < current.id ? current.id : acc;
  }, 0);
  // console.log(maxId);
  const newTodo: Todo = { id: maxId + 1, title, completed: false };
  todos.push(newTodo);
  ctx.response.status = 201;
  ctx.response.body = newTodo;
});

// PUT /todos/:id
router.put("/tasks/:id", (ctx: Context) => {
  const id = Number(ctx.params.id);
  const { title, completed }: any = ctx.request.body;
  // console.log(title, completed);
  const idx = todos.findIndex((t) => t.id === id);
  // console.log(idx);
  if (idx == -1) {
    ctx.response.status = 404;
    ctx.response.body = { message: "task không tồn tại" };
    return;
  }

  todos[idx].title = title;
  todos[idx].completed = completed;
  console.log(todos);
  ctx.response.body = todos[idx];
});

// DELETE /todos/:id
router.delete("/tasks/:id", (ctx: Context) => {
  const id = Number(ctx.params.id);
  // console.log(id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    ctx.response.status = 404;
    ctx.response.body = { message: "task không tồn tại" };
    return;
  }
  ctx.response.body = { message: "xóa thành công" };

  todos.splice(index, 1);
  // console.log(todos);
});

router.post("/del/tasks", async (ctx: Context) => {
  const { ids }: any = ctx.request.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Dữ liệu không hợp lệ" };
    return;
  }

 
  ids.forEach((id: number) => {
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
  });
  ctx.response.status = 200;
  ctx.response.body = { data: ids, message: "Delete thành công" };
});

router.put("/tasks", async (ctx: Context) => {
  const { ids , completed}: any = ctx.request.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Dữ liệu không hợp lệ" };
    return;
  }
  for (const id of ids) {
  const idx = todos.findIndex((t) => t.id == id);
  if (idx === -1) continue; 
  todos[idx].completed = completed;
  ctx.response.body = {data: ids , message : "sửa thành công"}
} 

});

export default router;
