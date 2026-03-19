export type Item = {
  id: string;
  name: string;
  checked: boolean;
};
export type Category = {
  id: string;
  name: string;
  items: Item[];
};
export type ChecklistPost = {
  _id: number;
  content: string;
  user: {
    _id: number;
  };
};
