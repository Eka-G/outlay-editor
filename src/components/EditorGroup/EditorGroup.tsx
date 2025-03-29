import { useState } from 'react';
import classnames from 'classnames';

import { useDeleteRowMutation, useAddEmptyRowMutation } from '@/api/outlayApi';
import FileIcon from '@/assets/img/file.svg';
import TrashIcon from "@/assets/img/trash.svg";

import './EditorGroup.style.scss';
import { UNEXISTING_ROW_ID } from '@/shared/constants';

type EditorGroupProps = {
  level: number;
  id: number;
  isTableEditing: boolean;
  setEditingRowIdInTable: (id: number | null) => void;
};

const BASE_PADDING = 12;

export default function EditorGroup({
  level,
  id,
  isTableEditing,
  setEditingRowIdInTable,
}: EditorGroupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [ deleteRow ] = useDeleteRowMutation();
  const [ addEmptyRow ] = useAddEmptyRowMutation();
  const offsetStyles = {
    marginLeft: `${BASE_PADDING * (1.5 * level + 1)}px`,
  };

  const handleAddClick = async () => {
    if (isLoading) {
      return;
    };
    
    setIsLoading(true);

    try {
      await addEmptyRow({ parentId: id }).unwrap();
      setEditingRowIdInTable(UNEXISTING_ROW_ID);
    } catch (error) {
      // TODO: add notification
      console.error('Failed to add row:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (isLoading || isTableEditing) {
      return;
    }

    setIsLoading(true);

    try {
      await deleteRow(id).unwrap();
    } catch (error) {
      // TODO: add notification
      console.error("Failed to delete row:", error);
    } finally {
      setIsLoading(false);
    }
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
              "editor-group__button--loading": isLoading,
            }
          )}
          onClick={handleAddClick}
          disabled={isLoading || isTableEditing}
        >
          <FileIcon />
        </button>
        <button
          type="button"
          className={classnames(
            "editor-group__button",
            "editor-group__delete-button",
            {
              "editor-group__button--loading": isLoading,
            }
          )}
          onClick={handleDeleteClick}
          disabled={isLoading || isTableEditing}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
