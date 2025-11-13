import {
  IndexTable,
  useIndexResourceState,
  Button,
  Card,
} from "@shopify/polaris";
import useTodo from "@/hooks/useTodo";
import Row from "./Row";
import { useState } from "react";
import ModalAddTask from "../modal/ModalAddTask";
import { useAPI } from "@/hooks/useApi";

function ListTask() {
  const { tasks , setTask } = useTodo();
  const { put, post } = useAPI();
  const [isOpenModalCreate, setIsOpenModalCreate] = useState<boolean>(false);
  const [isActionDeleteMoreTask, setIsActionDeleteMoreTask] =
    useState<boolean>(false);
  const [isActionCompleteMoreTask, setIsActionCompleteMoreTask] =
    useState<boolean>(false);
  const [isActionIncompleteMoreTask, setIsActionIncompleteMoreTask] =
    useState<boolean>(false);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(tasks);
  // console.log(selectedResources);
  const resourceName = {
    singular: "task",
    plural: "tasks",
  };

  const onClickButtonIncompleteMoreTask = () => {
    setIsActionIncompleteMoreTask(true);
    setTimeout(async () => {
      try {
        const data = await put(`/tasks`, {
          ids: selectedResources,
          completed: false,
        });
        
        if(data) {
          setIsActionIncompleteMoreTask(false);
          setTask(tasks.map((t) => {
            if(selectedResources.includes(t.id)) return {...t,completed:false};
            return t
          } ))
        }
      } catch (error) {
        setIsActionIncompleteMoreTask(false);
      }
    }, 1000);
  };
  const onClickButtonCompleteMoreTask = () => {
    setIsActionCompleteMoreTask(true);
    setTimeout(async () => {
      try {
        const data = await put(`/tasks`, {
          ids: selectedResources,
          completed: true,
        });
        
        if(data) {
          setIsActionCompleteMoreTask(false);
          setTask(tasks.map((t) => {
            if(selectedResources.includes(t.id)) return {...t,completed:true};
            return t
          } ))
        }
      } catch (error) {
        setIsActionCompleteMoreTask(false);
      }
    }, 1000);
  };
  const onClickButtonDeleteMoreTask = () => {
    setIsActionDeleteMoreTask(true);
    setTimeout(async () => {
      try {
        const data = await post(`/del/tasks`, {
          ids: selectedResources,
        });
        
        if(data) {
          setIsActionDeleteMoreTask(false);
          setTask(tasks.filter((t) => !selectedResources.includes(t.id)))
        }
      } catch (error) {
        setIsActionDeleteMoreTask(false);
      }
    }, 1000);
  };
  const rowMarkup = tasks?.map((task, index) => (
    <Row
      isActionCompleteMoreTask={isActionCompleteMoreTask}
      isActionDeleteMoreTask={isActionDeleteMoreTask}
      isActionIncompleteMoreTask={isActionIncompleteMoreTask}
      selectedResources={selectedResources}
      index={index}
      task={task}
    />
  ));

  return (
    <div style={{ width: "80vw", marginTop: "30px" }}>
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold">Todoes</h3>
        <Button
          variant="primary"
          onClick={() => {
            setIsOpenModalCreate(true);
          }}
        >
          Create
        </Button>
        <ModalAddTask
          setIsOpenModalCreate={setIsOpenModalCreate}
          isOpenModalCreate={isOpenModalCreate}
        />
      </div>
      <IndexTable
        resourceName={resourceName}
        itemCount={tasks.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[{ title: "" }, { title: "" }]}
      >
        {rowMarkup}
      </IndexTable>
      <div className="mt-5 flex justify-center">
        {selectedResources.length > 1 && (
          <div className="w-[25%]">
            <Card>
              <div className="flex justify-around">
                <Button onClick={onClickButtonIncompleteMoreTask}>
                  Incomplete
                </Button>
                <Button tone="success" onClick={onClickButtonCompleteMoreTask}>
                  Complete
                </Button>
                <Button tone="critical" onClick={onClickButtonDeleteMoreTask}>
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListTask;
