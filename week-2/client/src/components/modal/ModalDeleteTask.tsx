import { Modal } from "@shopify/polaris";
import { useState, type Dispatch, type SetStateAction } from "react";
import useTodo from "@/hooks/useTodo";
import { useAPI } from "@/hooks/useApi";

type ModalDeleteTaskProps = {
  active: boolean;
  setActive?: Dispatch<SetStateAction<boolean>>;
  taskName: string;
  taskId: string;
};

export default function ModalDeleteTask({
  active,
  setActive,
  taskId,
  taskName,
}: ModalDeleteTaskProps) {
  const { setTask } = useTodo();
  const { del } = useAPI();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const onDeleteTask = (taskId: string) => {
    setIsLoadingDelete(true);
    setTimeout(async () => {
      try {
        const data = await del(`/tasks/${taskId}`);
        if (data) {
          setIsLoadingDelete(false);
          setActive(false);
          setTask((preTasks) => {
            return preTasks.filter((preTask) => preTask.id != taskId);
          });
        }
      } catch (e) {
        setIsLoadingDelete(false);
      }
    }, 1000);
  };

  return (
    <Modal
      // activator={activator}
      open={active}
      onClose={() => {
        setActive(false);
      }}
      title={`Bạn có muốn xóa nhiệm vụ ${taskName}`}
      primaryAction={{
        content: "Delete",
        loading: isLoadingDelete,
        onAction: () => {
          onDeleteTask(taskId);
        },
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => {
            setActive(false);
          },
        },
      ]}
    ></Modal>
  );
}
