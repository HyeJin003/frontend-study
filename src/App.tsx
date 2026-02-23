import Button from "./components/Button";
import Header from "./components/Header";
import Router from "./routes";

export default function App() {
  return (
    <>
      <Header
        title="일기"
        leftChild={<Button variant="DEFAULT">left</Button>}
        rightChild={<Button variant="DEFAULT">right</Button>}
      />

      <Router />
    </>
  );
}
