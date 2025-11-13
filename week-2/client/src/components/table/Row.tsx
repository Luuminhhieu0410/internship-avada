import { IndexTable, Text, Badge, Button } from "@shopify/polaris";
import type { Task } from "@/types/task";
import { useState, type Dispatch, type SetStateAction } from "react";
import ModalDeleteTask from "../modal/ModalDeleteTask";
import useTodo from "@/hooks/useTodo";
import { useAPI } from "@/hooks/useApi";

type RowProps = {
  task: Task;
  index: number;
  selectedResources: string[];
  isActionDeleteMoreTask: boolean;
  isActionIncompleteMoreTask: boolean;
  isActionCompleteMoreTask: boolean;
  // setIsActionCompleteMoreTask: Dispatch<SetStateAction<boolean>>;
  // setIsActionDeleteMoreTask: Dispatch<SetStateAction<boolean>>;
  // setIsActionIncompleteMoreTask: Dispatch<SetStateAction<boolean>>;
};

const Row = ({
  task,
  index,
  selectedResources,
  isActionDeleteMoreTask,
  isActionIncompleteMoreTask,
  isActionCompleteMoreTask,
  // setIsActionCompleteMoreTask,
  // setIsActionDeleteMoreTask,
  // setIsActionIncompleteMoreTask,
}: RowProps) => {
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [loadingChangeStateComplete, setLoadingChangeStateComplete] =
    useState(false);
  const { setTask } = useTodo();
  const { put } = useAPI();
  console.log(">>>>" , isActionIncompleteMoreTask);
  const onChangeState = () => {
    // console.log("click");
    setLoadingChangeStateComplete(true);
    setTimeout(async () => {
      try {
        const data = await put(`/tasks/${task.id}`, {
          id: task.id,
          title: task.title,
          completed: !task.completed,
        });
        if (data) {
          setLoadingChangeStateComplete(false);
          setTask((preTasks) => {
            return preTasks.map((preTask) => {
              return preTask.id == task.id
                ? {
                    id: preTask.id,
                    title: preTask.title,
                    completed: !preTask.completed,
                  }
                : preTask;
            });
          });
        }
      } catch (e) {
        setLoadingChangeStateComplete(false);
      }
    }, 1000);
  };
  return (
    <IndexTable.Row
      id={task.id}
      key={index}
      selected={selectedResources.includes(task.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text as="span">{task.title} </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end">
          {task.completed ? (
            <span style={{ marginRight: "7px" }}>
              <Badge tone="success">Complete</Badge>
            </span>
          ) : (
            <span style={{ marginRight: "7px" }}>
              <Badge tone="attention">Incomplete</Badge>
            </span>
          )}
          <span style={{ marginRight: "7px" }}>
            <Button
              loading={loadingChangeStateComplete || isActionIncompleteMoreTask && selectedResources.includes(task.id) || isActionCompleteMoreTask && selectedResources.includes(task.id)}
              onClick={onChangeState}
              tone={task.completed ? "critical" : "success"}
            >
              {task.completed ? "Incomplete" : "Complete"}
            </Button>
          </span>
          <span style={{ marginRight: "4px" }}>
            <Button
            loading={isActionDeleteMoreTask &&  selectedResources.includes(task.id)}
              onClick={() => {
                setOpenModalDelete(true);
              }}
              tone="critical"
            >
              Delete
            </Button>
            <ModalDeleteTask
              taskName={task.title}
              taskId={task.id}
              setActive={setOpenModalDelete}
              active={openModalDelete}
            />
          </span>
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

export default Row;
