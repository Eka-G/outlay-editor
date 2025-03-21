import classnames from 'classnames';

import ItemIcon from '@/assets/img/project.svg';
import FakeLink from '@/components/FakeLink';

import mockProjects from './mockProjects.json';
import './NavBar.style.scss';

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className }: NavBarProps) {
  return (
    <nav className={className}>
      <ul className="nav">
        {Object.entries(mockProjects).map(([key, value]) => {
          return (
            <FakeLink key={key}>
              <li className={classnames("nav__item", { "nav__item--active": value.isActive})}>
                <ItemIcon width={22} height={22} />
                <span>{key}</span>
              </li>
            </FakeLink>
          );
        })}
      </ul>
    </nav>
  );
}
