import './SiteFooter.css';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <img
            className="site-footer__logo"
            src="/ministry-logo-top-left.webp"
            alt="Ministry of Foreign Affairs"
          />
        </div>
        <div className="site-footer__help">
          <p className="site-footer__heading">Need Assistance?</p>
          <p>Contact your nearest diplomatic mission or visa application centre for help with a record.</p>
        </div>
      </div>
      <div className="site-footer__legal">
        <span>&copy; {new Date().getFullYear()} Ministry of Foreign Affairs Italy. All rights reserved.</span>
        {/* <span>This portal is for verification purposes only and does not constitute travel authorization.</span> */}
      </div>
    </footer>
  );
}
