import classnames from 'classnames';
import { NavBar, OutlayTable } from '@/components';

import "./ProjectManager.style.scss";

export default function ProjectManager() {
  return (
    <div className="project-manager">
      <div
        className={classnames(
          "project-manager__cell",
          "project-manager__projects"
        )}
      >
        <select className="project-manager__selection">
          <option>Название проекта</option>
        </select>
        <sub className="project-manager__abbreviation">Аббревиатура</sub>
      </div>
      <div
        className={classnames(
          "project-manager__cell",
          "project-manager__current"
        )}
      >
        <h1 className="project-manager__title">Строительно-монтажные работы</h1>
      </div>

      <NavBar className="project-manager__nav" />

      <OutlayTable />
    </div>
  );
}
