import { ButtonColor, type ButtonType } from "../types/button";

export default function Button({
  children,
  type = "button",
  variant = "DEFAULT",
  onClick,
}: ButtonType) {
  return (
    <>
      <button
        className={`${ButtonColor[variant]} cursor-pointer border-none rounded-[5px] px-[20px] py-[10px] text-[18px] whitespace-nowrap`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </>
  );
}
