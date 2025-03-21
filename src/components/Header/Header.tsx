import MenuIcon from '@/assets/img/options.svg';
import ShareIcon from '@/assets/img/share.svg';
import FakeLink from '@/components/FakeLink';
import './Header.style.scss';

export default function Header() {
  return (
    <header className="header">
      <div className="header__icons">
        <FakeLink>
          <MenuIcon width={24} height={24} />
        </FakeLink>
        <FakeLink>
          <ShareIcon width={24} height={24} />
        </FakeLink>
      </div>

      <nav>
        <ul className="header__nav">
          <li className="header__nav-item--active">
            <FakeLink>Просмотр</FakeLink>
          </li>
          <li>
            <FakeLink>Управление</FakeLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
