
import { useContext } from "react";
import { TodoContext } from "../context/TaskContext";

const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context)
    throw new Error(
      "Context chưa được khởi tạo | hoặc component ở ngoài context"
    );
  return context;
};

export default useTodo;
