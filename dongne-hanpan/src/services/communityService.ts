import apiInstance from "./apiInstance";
import type { Post, UploadedFile } from "@/types";

interface FileUploadResponse {
  item: UploadedFile[];
}
interface PostResponse {
  item: Post;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  /** POST /files 업로드 후 받은 경로들 */
  images?: UploadedFile[];
  extra?: Record<string, unknown>;
}

export const communityService = {
  /**
   * POST /files — 이미지 멀티파트 업로드
   * Content-Type: multipart/form-data (axios가 자동 처리)
   */
  async uploadFiles(files: File[]): Promise<UploadedFile[]> {
    const form = new FormData();
    files.forEach((f) => form.append("attach", f));

    const res = await apiInstance.post<FileUploadResponse>("/files", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.item ?? [];
  },

  /** POST /posts — 운동 인증 게시글 등록 */
  async createPost(payload: CreatePostPayload): Promise<Post> {
    const body = {
      type: "community",
      title: payload.title,
      content: payload.content,
      ...(payload.images?.length ? { images: payload.images } : {}),
      ...(payload.extra ? { extra: payload.extra } : {}),
    };
    const res = await apiInstance.post<PostResponse>("/posts", body);
    return res.data.item;
  },
};
