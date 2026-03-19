import { UserLoginType, UserSign } from "../type/user";

export async function signup(userSign: UserSign) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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
    throw error;
  }
}
export async function userLogin(loginData: UserLoginType) {
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
    throw error;
  }
}
export async function checkEmail(email: string) {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/email?email=${email}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        },
      },
    );
    return { status: result.status, data: await result.json() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getProfile(userId: number) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
      {
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.json();
  } catch (error) {
    throw error;
  }
}
export async function updateProfile(
  userId: number,
  data: {
    name?: string;
    password?: string;
    image?: string;
    extra?: { bio?: string };
  },
) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  } catch (error) {
    throw error;
  }
}
export async function deleteAccount(userId: number) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.json();
  } catch (error) {
    throw error;
  }
}
export async function uploadFile(file: File) {
  try {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("attach", file);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/`, {
      method: "POST",
      headers: {
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}
