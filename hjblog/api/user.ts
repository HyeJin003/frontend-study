import { userSign, UserLoginType } from "../type/user";

export const checkEmail = (email: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/email?email=${email}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
      },
    },
  ).then(async (result) => {
    return { status: result.status, data: await result.json() };
  });
};

export const signup = async (userSign: userSign) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
      },
      body: JSON.stringify(userSign),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const userLogin = async (loginData: UserLoginType) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        },
        body: JSON.stringify(loginData),
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};
