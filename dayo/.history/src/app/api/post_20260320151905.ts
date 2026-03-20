export async function postList(
  keyword: string = "",
  page: number = 1,
  type: string = "post",
) {
  try {
    const token = localStorage.getItem("accessToken");
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/?type=${type}&keyword=${keyword}&page=${page}&limit=10`,
      {
        headers: {
          "Content-Type": "application/json",
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        },
        cache: "no-store",
      },
    );
    const text = await result.text();
    try {
      return { status: result.status, data: JSON.parse(text) };
    } catch {
      return { status: result.status, data: { item: [] } };
    }
  } catch (error) {
    console.error(error);
    return { status: 500, data: { item: [] } };
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

export async function postRegist(post: RegistPost) {
  try {
    const token = localStorage.getItem("accessToken");
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: post.type,
        title: post.title,
        content: post.content,
      }),
    });
    return { status: result.status, data: await result.json() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePost(
  id: number,
  data: { title: string; content: string },
) {
  try {
    const token = localStorage.getItem("accessToken");

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
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
    return { status: result.status, data: await result.json() };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadImage(files: File[]) {
  try {
    const urls: string[] = [];
    const token = localStorage.getItem("accessToken");

    for (const file of files) {
      const formData = new FormData();
      formData.append("attach", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/files/`,
        {
          method: "POST",
          headers: {
            "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const result = await response.json();

      urls.push(result.item[0].path);
    }
    return urls;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//포스터 삭제
export async function deletePost(id: number) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
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
    console.error(error);
    throw error;
  }
}

export async function addBookmark(target_id: number) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookmarks/post`,
      {
        method: "POST",
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ target_id }),
      },
    );
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeBookmark(target_id: number) {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${target_id}`,
      {
        method: "DELETE",
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getBookmarks() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return {
        ok: 0,
        item: [],
      };
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookmarks/post`,
      {
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function addLike(postId: number) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookmarks/post`,
    {
      method: "POST",
      headers: {
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ target_id: postId, is_like: true }),
    },
  );
  return response.json();
}

export async function removeLike(likeId: number) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${likeId}`,
    {
      method: "DELETE",
      headers: {
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}

export async function getLikes() {
  const token = localStorage.getItem("accessToken");
  if (!token) return { ok: 0, item: [] };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookmarks/post?is_like=true`,
    {
      headers: {
        "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}
