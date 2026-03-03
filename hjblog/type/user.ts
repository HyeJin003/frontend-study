export type user = "user" | "seller";
export interface userSign {
  email: string;
  password: string;
  name: string;
  type: user;
}
export interface UserLoginType {
  email: string;
  password: string;
}
