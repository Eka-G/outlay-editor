import classnames from 'classnames';
import FileIcon from '@/assets/img/file.svg';
import './EditorGroup.style.scss';

type EditorGroupProps = {
  level: number;
};

const BASE_PADDING = 12;

export default function EditorGroup({level}: EditorGroupProps) {
  const offsetStyles = {
    marginLeft: `${BASE_PADDING * (1.5 * level + 1)}px`,
  };

  const handleAddClick = () => {};

  return (
    <div className="editor-group">
      <button
        className={classnames("editor-group__button", {
          "editor-group__button--child": !!Number(level),
        })}
        style={offsetStyles}
      >
        <FileIcon />
      </button>
    </div>
  );
}
