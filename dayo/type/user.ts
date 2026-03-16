// export type UserLoginType = {};
// export type userSign = {};

export type EffectEmail = {
  email: string;
};

export type UserSign = {
  type: "user";
  email: string;
  password: string;
  name: string;
};
export type UserLoginType = {
  email: string;
  password: string;
};
