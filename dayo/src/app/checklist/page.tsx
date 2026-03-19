"use client";
import { useEffect, useRef, useState } from "react";
import { postList, postRegist, updatePost } from "../../../api/post";
import { Item, Category, ChecklistPost } from "../../../type/checkList";

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "docs",
    name: "여권 · 서류",
    items: [
      { id: "d1", name: "여권 (유효기간 6개월 이상)", checked: false },
      { id: "d2", name: "항공권 e-티켓", checked: false },
      { id: "d3", name: "숙소 예약 확인서", checked: false },
      { id: "d4", name: "여행자 보험 증서", checked: false },
      { id: "d5", name: "여행 경비 (현금)", checked: false },
      { id: "d6", name: "신용카드 / 체크카드", checked: false },
    ],
  },
  {
    id: "clothes",
    name: "의류",
    items: [
      { id: "c1", name: "속옷 (일수만큼)", checked: false },
      { id: "c2", name: "양말 (여분 포함)", checked: false },
      { id: "c3", name: "상의 / 하의", checked: false },
      { id: "c4", name: "겉옷 / 재킷", checked: false },
      { id: "c5", name: "잠옷", checked: false },
    ],
  },
  {
    id: "toiletry",
    name: "세면 · 위생",
    items: [
      { id: "t1", name: "칫솔 / 치약", checked: false },
      { id: "t2", name: "샴푸 / 컨디셔너", checked: false },
      { id: "t3", name: "선크림", checked: false },
      { id: "t4", name: "스킨케어", checked: false },
      { id: "t5", name: "면도기", checked: false },
    ],
  },
  {
    id: "electronics",
    name: "전자기기",
    items: [
      { id: "e1", name: "스마트폰 + 충전기", checked: false },
      { id: "e2", name: "보조배터리", checked: false },
      { id: "e3", name: "해외 어댑터", checked: false },
      { id: "e4", name: "이어폰", checked: false },
    ],
  },
  {
    id: "medicine",
    name: "의약품",
    items: [
      { id: "m1", name: "소화제", checked: false },
      { id: "m2", name: "진통제", checked: false },
      { id: "m3", name: "지사제", checked: false },
      { id: "m4", name: "반창고 / 밴드", checked: false },
      { id: "m5", name: "모기 기피제", checked: false },
    ],
  },
];

export default function ChecklistPage() {
  const [loaded, setLoaded] = useState(false);
  // 어떤 카테고리가 펼쳐져 있는지
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // 아이템 추가 중인 카테고리 id + 입력값
  const [addingItem, setAddItem] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  // 카테고리 추가 중인지 + 입력값
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  // 삭제 확인 중인 카테고리 id
  const [deletingCat, setDeletingCat] = useState<string | null>(null);
  // 자동저장 타이머

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [postId, setPostId] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoaded(true);
      return;
    }
    postList("", 1, "checklist").then((result) => {
      if (result.status === 200 && result.data.item.length > 0) {
        const mine = result.data.item.find(
          (post: ChecklistPost) => String(post.user._id) === String(userId),
        );
        if (mine) {
          try {
            setCategories(JSON.parse(mine.content));
            setPostId(mine._id);
          } catch {}
        }
      }

      setLoaded(true);
    });
  }, []);

  function save(updated: Category[]) {
    // 1. 화면 즉시 업데이트 (체크하면 바로 체크 표시)
    setCategories(updated);
    // 2. 기존 타이머가 있으면 취소
    //    (연속 클릭 시 이전 저장 예약 취소)
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    // 새 타이머 시작 (500ms 후 서버 저장)
    saveTimer.current = setTimeout(async () => {
      setSyncing(true);
      const content = JSON.stringify(updated);
      if (postId) {
        await updatePost(postId, { title: "내 체크리스트", content });
      } else {
        const result = await postRegist({
          type: "checklist",
          title: "내 체크리스트",
          content,
          tag: "",
        });
        if (result.status === 201) setPostId(result.data.item._id);
      }
      setSyncing(false);
    }, 500);
  }
  function toggleItem(categoryId: string, itemId: string) {
    save(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item,
              ),
            }
          : category,
      ),
    );
  }
  function addItem(categoryId: string) {
    if (newItemName.trim() === "") {
      return;
    }
    save(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: [
                ...category.items,
                {
                  id: Date.now().toString(),
                  name: newItemName.trim(),
                  checked: false,
                },
              ],
            }
          : category,
      ),
    );
    setNewItemName("");
    setAddItem(null);
  }
  function deleteItem(categoryId: string, itemId: string) {
    save(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter((item) => item.id !== itemId),
            }
          : category,
      ),
    );
  }
  function addCategory() {
    if (newCatName.trim() === "") {
      return;
    }
    const newCat: Category = {
      id: Date.now().toString(),
      name: newCatName.trim(),
      items: [],
    };
    save([...categories, newCat]);
    setNewCatName("");
    setAddingCategory(false);
  }
  function deleteCategory(categoryId: string) {
    save(categories.filter((category) => category.id !== categoryId));
    setDeletingCat(null);
  }
  function resetAll() {
    save(DEFAULT_CATEGORIES);
  }

  //진행률 계산
  const total = categories.reduce(
    (acc, category) => acc + category.items.length,
    0,
  );
  const done = categories.reduce(
    (acc, category) =>
      acc + category.items.filter((item) => item.checked).length,
    0,
  );
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  if (!loaded) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 text-sm text-gray-400 text-center">
        불러오는 중...
      </main>
    );
  }
  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-base font-bold">여행 체크리스트</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {done}/{total} 완료
            {syncing && (
              <span className="ml-2 text-xs text-gray-300">저장 중...</span>
            )}
          </p>
        </div>
        <button
          onClick={resetAll}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          기본값 초기화
        </button>
      </div>
      {/* 진행바 */}
      <div className="mb-6">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-gray-800 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">{percent}%</p>
      </div>
      {/* 카테고리 목록 전체를 감싸는 컨테이너 */}
      <div className="flex flex-col gap-3">
        {/* categories 배열을 하나씩 순회 */}
        {categories.map((category) => {
          // 이 카테고리에서 체크된 아이템 수
          const catDone = category.items.filter((item) => item.checked).length;

          // 이 카테고리가 펼쳐져 있는지
          // expanded["docs"] 가 undefined면 !== false 이므로 true (기본값 펼침)
          // expanded["docs"] 가 false면 false (닫힘)
          const isExpanded = expanded[category.id] !== false;

          return (
            // 카테고리 하나를 감싸는 박스
            // key는 React가 각 항목을 구별하기 위해 필요
            <div
              key={category.id}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              {/* 카테고리 헤더 영역 (회색 배경) */}
              <div className="flex items-center px-4 py-3 bg-gray-50">
                {/* 클릭하면 펼치기/닫기 토글 */}
                <button
                  className="flex-1 flex items-center justify-between text-left"
                  onClick={() =>
                    // expanded 상태에서 이 카테고리만 반대로 뒤집기
                    setExpanded((event) => ({
                      ...event,
                      [category.id]: !isExpanded,
                    }))
                  }
                >
                  {/* 카테고리 이름 */}
                  <span className="text-sm font-semibold text-gray-700">
                    {category.name}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* 몇 개 완료했는지 표시 예: 2/6 */}
                    <span className="text-xs text-gray-400">
                      {catDone}/{category.items.length}
                    </span>

                    {/* 펼침/닫힘 화살표 */}
                    <span className="text-gray-400 text-xs">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                {/* 카테고리 삭제 버튼 */}
                <button
                  onClick={() => setDeletingCat(category.id)}
                  className="ml-3 text-gray-300 hover:text-red-400 text-xs"
                >
                  삭제
                </button>
              </div>

              {/* 삭제 확인창 */}
              {deletingCat === category.id && (
                <div className="px-4 py-2.5 bg-red-50 flex items-center justify-between">
                  <p className="text-xs text-red-500">
                    "{category.name}" 카테고리를 삭제할까요?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-xs text-red-500 font-medium"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => setDeletingCat(null)}
                      className="text-xs text-gray-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              {/* 아이템 목록 */}
              {isExpanded && (
                <div className="px-4 flex flex-col">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 group"
                    >
                      <button
                        onClick={() => toggleItem(category.id, item.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          item.checked
                            ? "bg-gray-800 border-gray-800"
                            : "border-gray-300"
                        }`}
                      >
                        {item.checked && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <span
                        onClick={() => toggleItem(category.id, item.id)}
                        className={`flex-1 text-sm cursor-pointer ${item.checked ? "line-through text-gray-300" : "text-gray-700"}`}
                      >
                        {item.name}
                      </span>
                      <button
                        onClick={() => deleteItem(category.id, item.id)}
                        className="text-gray-200 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* 아이템 추가 */}
              {addingItem === category.id ? (
                <div className="flex items-center gap-2 py-2.5">
                  <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="항목 이름 입력"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addItem(category.id);
                      if (e.key === "Escape") setAddItem(null);
                    }}
                    className="flex-1 text-sm outline-none border-b border-gray-200 py-0.5"
                  />
                  <button
                    onClick={() => addItem(category.id)}
                    className="text-xs text-gray-700 font-medium"
                  >
                    추가
                  </button>
                  <button
                    onClick={() => setAddItem(null)}
                    className="text-xs text-gray-400"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddItem(category.id);
                    setNewItemName("");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 py-2.5 text-left"
                >
                  + 항목 추가
                </button>
              )}
            </div>
          );
        })}
      </div>
      {/* 카테고리 추가 */}
      <div className="mt-4">
        {addingCategory ? (
          <div className="border border-dashed border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <input
              autoFocus
              type="text"
              placeholder="카테고리 이름 (예: 스포츠용품, 아이용품)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategory();
                if (e.key === "Escape") setAddingCategory(false);
              }}
              className="flex-1 text-sm outline-none"
            />
            <button
              onClick={addCategory}
              className="text-xs text-gray-700 font-medium shrink-0"
            >
              추가
            </button>
            <button
              onClick={() => setAddingCategory(false)}
              className="text-xs text-gray-400 shrink-0"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingCategory(true)}
            className="w-full py-3 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:text-gray-600
  hover:border-gray-400 transition-colors"
          >
            + 카테고리 추가
          </button>
        )}
      </div>
    </main>
  );
}
