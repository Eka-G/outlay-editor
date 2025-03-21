import classnames from 'classnames';
import NavBar from '@/components/NavBar';

import "./ProjectEditor.style.scss";

export default function ProjectEditor() {
  return (
    <div className="project-editor">
      <div
        className={classnames(
          "project-editor__cell",
          "project-editor__projects"
        )}
      >
        <select className="project-editor__selection">
          <option>Название проекта</option>
        </select>
        <sub className="project-editor__abbreviation">Аббревиатура</sub>
      </div>
      <div
        className={classnames(
          "project-editor__cell",
          "project-editor__current"
        )}
      >
        <h1 className="project-editor__title">
          Строительно-монтажные работы
        </h1>
      </div>

      <NavBar className="project-editor__nav" />
      <main className="main"></main>
    </div>
  );
}
