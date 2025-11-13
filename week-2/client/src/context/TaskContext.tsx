
import type { Task } from "../types/task";
import { useAPI } from "../hooks/useApi";
import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type TodoContext = {
  tasks: Task[] | [];
  setTask: Dispatch<SetStateAction<Task[]>>;
};
type ContextProps = { children: ReactNode };

export const TodoContext = createContext<TodoContext | undefined>(undefined);
const TaskContext = ({ children }: ContextProps) => {
  const [tasks, setTask] = useState<Task[]>([]);
  const { get } = useAPI();
  useEffect(() => {
    const getData = async () => {
      const data: Task[] = await get("/tasks");
      setTask(data);
    };
   getData()
  }, []);
  return (
    <TodoContext.Provider value={{ setTask, tasks }}>
      {children}
    </TodoContext.Provider>
  );
};

export default TaskContext;
