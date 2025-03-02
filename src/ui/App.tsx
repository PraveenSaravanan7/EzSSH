import "./App.css";
import { ConnectionList } from "./components/ConnectionList";
import { Header } from "./components/Header";

const App = () => {
  return (
    <>
      <Header />
      <div className="app">
        <ConnectionList />
      </div>
    </>
  );
};

export default App;
