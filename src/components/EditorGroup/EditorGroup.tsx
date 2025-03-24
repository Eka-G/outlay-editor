import classnames from 'classnames';

import { useDeleteRowMutation } from '@/api/outlayApi';
import FileIcon from '@/assets/img/file.svg';
import TrashIcon from "@/assets/img/trash.svg";

import './EditorGroup.style.scss';

type EditorGroupProps = {
  level: number;
  id: number;
  parentId: number | null;
};

const BASE_PADDING = 12;

export default function EditorGroup({ level, id, parentId }: EditorGroupProps) {
  const [ deleteRow ] = useDeleteRowMutation();
  const offsetStyles = {
    marginLeft: `${BASE_PADDING * (1.5 * level + 1)}px`,
  };

  const handleAddClick = () => {};
  const handleDeleteClick = async () => {
    try {
      await deleteRow(id);
    } catch (error) {}
  };

  return (
    <div className="editor-group" style={offsetStyles}>
      <div className="editor-group__container">
        <button
          type="button"
          className={classnames(
            "editor-group__button",
            "editor-group__create-button",
            {
              "editor-group__create-button--child": !!Number(level),
            }
          )}
        >
          <FileIcon />
        </button>
        <button
          type="button"
          className={classnames(
            "editor-group__button",
            "editor-group__delete-button"
          )}
          onClick={handleDeleteClick}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
