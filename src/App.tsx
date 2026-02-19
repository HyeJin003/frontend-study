import Router from "./routes";

function App() {
  // 1."/" 모든일기를 조회하는 폼페이지
  // 2. / new 는 새로운 일기를 작성하는 페이지
  // /diary 일기를 상세히 조회 하는 페이지

  return (
    <div>
      <h1>감정 일기장</h1>
      <Router />
    </div>
  );
}

export default App;
