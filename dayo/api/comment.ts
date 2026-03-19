//  - 댓글 목록 조회
//   - 댓글 작성                                                                                                                              - 댓글 삭제
//   - 대댓글 작성

export async function commentList(postId: number) {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/replies`,
      {
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        },
        cache: "no-store",
      },
    );
    return { status: result.status, data: await result.json() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function commentWrite(postId: number, content: string) {
  try {
    const token = localStorage.getItem("accessToken");
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/replies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
        }),
      },
    );
    return { status: result.status, data: await result.json() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function commentDelete(
  postId: number,
  data: { _id: number; reply_id: number },
) {
  try {
    const token = localStorage.getItem("accessToken");
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/replies/${data.reply_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        body: JSON.stringify({ _id: data._id, reply_id: data.reply_id }),
      },
    );
    return { status: result.status, data: await result.json() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function commentUpdate(
  postId: number,
  replyId: number,
  content: string,
) {
  try {
    const token = localStorage.getItem("accessToken");
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/replies/${replyId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      },
    );
    return { status: result.status, data: await result.json() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
