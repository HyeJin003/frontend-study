export type PostItem = {
  _id: number;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    _id: number;
    name: string;
    image?: string;
  };
};
export type Props = {
  params: Promise<{ id: string }>;
};

export type RegistPost = {};
export type ListPost = {};
