import {
  Form,
  FormLayout,
  Modal,
  TextField,
} from "@shopify/polaris";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import { useAPI } from "@/hooks/useApi";
import useTodo from "@/hooks/useTodo";

type ModalAddTaskProps = {
  isOpenModalCreate: boolean;
  setIsOpenModalCreate: Dispatch<SetStateAction<boolean>>;
};

const ModalAddTask = ({
  isOpenModalCreate,
  setIsOpenModalCreate,
}: ModalAddTaskProps) => {
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [title, setTitle] = useState("");
  const { post } = useAPI();
  const { setTask } = useTodo();
  const addNewTaskAction = () => {
    setIsLoadingAdd(true);
    setTimeout(async () => {
      try {
        const data = await post("/tasks", { title: title });
        if (data) {
          setIsLoadingAdd(false);
          setTask((pre) => [...pre, data]);
          setIsOpenModalCreate(false);
          setTitle('')
        }
      } catch (error) {
        setIsLoadingAdd(false);
      }
    }, 1000);
  };
  return (
    <Modal
      // activator={activator}
      size="small"
      open={isOpenModalCreate}
      onClose={() => {
        setIsOpenModalCreate(false);
      }}
      title={`Create todo`}
      primaryAction={{
        content: "Add",
        loading: isLoadingAdd,
        onAction: addNewTaskAction,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => {
            setIsOpenModalCreate(false);
          },
        },
      ]}
    >
      <div className="m-5">
        <Form onSubmit={() => {}}>
          <FormLayout>
            <TextField
              label="Title"
              value={title}
              onChange={(value) => {
                setTitle(value);
              }}
              type="text"
              autoComplete=""
            />
          </FormLayout>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalAddTask;
