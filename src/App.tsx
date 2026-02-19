import { Link, useNavigate } from "react-router-dom";
import Router from "./routes";

function App() {
  // 1."/" 모든일기를 조회하는 폼페이지
  // 2. / new 는 새로운 일기를 작성하는 페이지
  // /diary 일기를 상세히 조회 하는 페이지

  const mov = useNavigate();
  const moveHandle = () => {
    mov("/new");
  };
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/new">New</Link>
      <Link to="/diary">Diary</Link>
      <button onClick={moveHandle}>New 페이지로 이동하기 </button>
      <h1>감정 일기장</h1>
      <Router />
    </div>
  );
}

export default App;
