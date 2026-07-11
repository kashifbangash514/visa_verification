import { Link } from 'react-router-dom';
import './SiteHeader.css';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__notice">
        <span className="site-header__notice-mark">&#10003;</span>
        An official government service for verifying issued e-visas
      </div>
      <div className="site-header__main">
        <Link to="/" className="site-header__brand">
          <img
            className="site-header__logo"
            src="/ministry-logo-top-left.webp"
            alt="Ministry of Foreign Affairs — E-Visa Verification Portal"
          />
        </Link>
      </div>
    </header>
  );
}
