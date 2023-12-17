import { deleteBoard } from "@/actions/deleteBoard";
import { FormDelete } from "./FormDelete";

interface Props {
  title: string;
  id: string;
}

export const Board = ({ title, id }: Props) => {
  const deleteBoardById = deleteBoard.bind(null, id);

  return (
    <form action={deleteBoardById} className="flex items-center gap-x-2">
      <p>{title}</p>
      <FormDelete />
    </form>
  );
};
