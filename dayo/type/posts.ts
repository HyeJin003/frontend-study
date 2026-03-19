export type PostItem = {
  _id: number;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  user: {
    _id: number;
    name: string;
    image?: string;
  };
};
export type Props = {
  params: Promise<{ id: string }>;
};

export type RegistPost = {
  type: string;
  title: string;
  content: string;
  tag?: string;
};
export type ListPost = {
  type: string;
  keyword: string;
  page: number;
  limit: number;
  sort: string;
};
export type BookmarkItem = {
  _id: number;
  post: {
    _id: number;
  };
};

export type ReplyItem = {
  _id: number;
  content: string;
  createdAt: string;
  parent?: { _id: number };
  user: {
    _id: number;
    name: string;
    image?: string;
  };
};
export type GuidePost = {
  _id: number;
  title: string;
  createdAt: string;
  user: {
    _id: number;
    name: string;
    image?: string;
  };
  guide: {
    desc: string;
    country: string;
    category: string;
    image?: string;
    subDesc: string;
  };
};
export type Tab = "all" | "shopping" | "landmarks" | "favoritEat" | "attractions";
