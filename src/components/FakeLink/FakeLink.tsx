import { ReactNode } from 'react';
import './FakeLink.style.scss';

interface FakeLinkProps {
  children: ReactNode;
}

export default function FakeLink({ children }: FakeLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <a href="#" className="fake-link" onClick={handleClick}>
      {children}
    </a>
  );
}
