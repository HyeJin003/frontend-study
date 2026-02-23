import type { ReactNode } from "react";

type ButtonVariant = "DEFAULT" | "POSITIVE" | "NEGATIVE";
type ButtonClick = "button" | "submit" | "reset";

export const ButtonColor: Record<ButtonVariant, string> = {
  DEFAULT: "bg-[#ececec] text-black",
  POSITIVE: "bg-green-500",
  NEGATIVE: "bg-red-500",
};
export interface ButtonType {
  children: ReactNode;
  onClick?: () => void;
  type?: ButtonClick;
  variant?: ButtonVariant;
}
