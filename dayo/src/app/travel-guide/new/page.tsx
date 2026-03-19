"use client";
export default function TravelGuideNewPage() {
  return (
    //  - 나라 선택 (버튼)
    // - 카테고리 선택 (버튼)
    // - 제목 입력
    // - 한줄 설명 입력
    // - 구매처/위치 입력
    // - 이미지 업로드
    // - 저장 버튼
    <main>
      <div>
        <button>나라선택</button>
        <button>카테고리 선택</button>
      </div>
      <input type="text" placeholder="제목 입력" />
      <input type="text" placeholder="한줄 설명 입력" />
      <input type="text" placeholder="구매처/위치 입력" />
      <input type="file" accept="image/*" hidden />
      <button type="button">이미지 업로드</button>
      <button>저장</button>
    </main>
  );
}
