import { Context } from "koa";
import { db } from "../database/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { toISO } from "../utils/time";
import { Task } from "../types/task";

// GET : /tasks
export async function getAllTasks(ctx: Context) {
  try {
    const pageSize = Number(ctx.query.pageSize) || 10;
    const cursor = ctx.query.cursor as string | undefined;

    let query = db
      .collection("task")
      .orderBy("created_at", "desc")
      .limit(pageSize);

    if (cursor) {
      const cursorDoc = await db.collection("task").doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();

    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: toISO(data.created_at),
        updated_at: toISO(data.updated_at),
      };
    });

    // Lấy doc cuối để làm cursor cho trang tiếp theo
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor = lastDoc ? lastDoc.id : null;

    ctx.status = 200;
    ctx.body = {
      data: tasks,
      nextCursor,
      pageSize,
      hasNextPage: !!nextCursor,
    };
  } catch (error) {
    console.log("getAllTasks error:", error);
    ctx.throw(500, "Không thể lấy danh sách công việc");
  }
}

//GET: /tasks/:id

export async function getTaskById(ctx: Context) {
  try {
    const { id } = ctx.params;

    const taskDoc = db.collection("task").doc(id);
    const docSnapshot = await taskDoc.get();

    if (!docSnapshot.exists) {
      return ctx.throw(404, "Task không tồn tại");
    }

    const data = docSnapshot.data() as Omit<Task, "id">;
    ctx.status = 200;
    ctx.body = {
      task: {
        id: docSnapshot.id,
        ...data,
        created_at: toISO(data.created_at),
        updated_at: toISO(data.updated_at),
      },
    };
  } catch (error) {
    console.error("getTaskById error:", error);
    ctx.throw(500, "Không thể lấy công việc");
  }
}

// POST: /tasks
export async function addNewTask(ctx: Context) {
  try {
    const body: any = ctx.request.body;
    const taskRef = db.collection("task").doc();
    const newTask = {
      title: body.title,
      completed: body.completed ?? false,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    await taskRef.set(newTask);
    ctx.status = 201;
    ctx.body = {
      message: "Tạo task thành công",
      task: {
        ...newTask,
        id: taskRef.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    console.log("addNewTask error:", error);
    ctx.throw(500, error.message || "Không thể tạo công việc");
  }
}

// PUT: /tasks/:id
export async function updateTask(ctx: Context) {
  try {
    const { id } = ctx.params;
    const body: any = ctx.request.body;

    const taskDoc = db.collection("task").doc(id);
    const docSnapshot = await taskDoc.get();

    if (!docSnapshot.exists) {
      return ctx.throw(404, "Task không tồn tại");
    }

    const updateData = {
      ...body,
      updated_at: FieldValue.serverTimestamp(),
    };

    await taskDoc.update(updateData);

    // Lấy lại data sau khi update
    const updatedDoc = await taskDoc.get();
    const data = updatedDoc.data();

    ctx.status = 200;
    ctx.body = {
      message: "Cập nhật task thành công",
      data: {
        id: updatedDoc.id,
        ...data,
        created_at: toISO(data?.created_at),
        updated_at: toISO(data?.updated_at),
      },
    };
  } catch (error: any) {
    console.log("updateTask error:", error);
    ctx.throw(500, error.message || "Không thể cập nhật công việc");
  }
}

// DELETE: /tasks/:id
export async function deleteTask(ctx: Context) {
  try {
    const { id } = ctx.params;

    const taskDoc = db.collection("task").doc(id);
    const docSnapshot = await taskDoc.get();

    if (!docSnapshot.exists) {
      return ctx.throw(404, "Task không tồn tại");
    }

    await taskDoc.delete();

    ctx.status = 200;
    ctx.body = {
      message: "Xóa task thành công",
      id,
    };
  } catch (error: any) {
    console.log("deleteTask error:", error);
    ctx.throw(500, error.message || "Không thể xóa công việc");
  }
}
