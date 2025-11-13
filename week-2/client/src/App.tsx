import ListTask from "./components/table/ListTask";
import TaskContext from "./context/TaskContext";
import { AppProvider } from "@shopify/polaris"; // Or your specific UI library's AppProvider
import enTranslations from "@shopify/polaris/locales/en.json";
export default function App() {
  return (
    <div style={{background:'var(--p-color-bg-surface)', height:"100vh" , display:"flex" , justifyContent:"center"} }>
      <AppProvider i18n={enTranslations}>
        <TaskContext>
          <ListTask />
       
        </TaskContext>
      </AppProvider>
    </div>
  );
}
