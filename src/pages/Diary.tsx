import { useParams } from "react-router-dom";

export default function Diary() {
  const { id } = useParams();

  return (
    <>
      <div>이 다이어리는 {id} 번째 일기다 </div>
    </>
  );
}
