import type { HeaderType } from "../types/header";

export default function Header({ title, leftChild, rightChild }: HeaderType) {
  return (
    <>
      <header className="flex items-center p-0 px-[20px] border-b border-b-[rgb(226,226,226)]">
        <div className="w-1/4 justify-start">{leftChild}</div>
        <div className="w-1/2 text-[25px] flex justify-center items-center">
          {title}
        </div>
        <div className="w-1/4 justify-end">{rightChild}</div>
      </header>
    </>
  );
}
