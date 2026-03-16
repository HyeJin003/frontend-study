export async function postList() {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/`, {
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
      },
    });
    return { status: result.status, data: await result.json() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function postDetail(postId: string) {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
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
export const postResit = async () => {};
export const updatePost = async () => {};
export const deletePost = async () => {};
export const addBookmark = async () => {};
export const removeBookmark = async () => {};
export const getBookmarks = async () => {};
