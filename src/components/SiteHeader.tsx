import { SocialIcons } from "./SocialIcons";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary">
        <div className="nav__links">
          <a href="#home">Home</a>
          <span className="nav__sep" aria-hidden="true">
            ·
          </span>
          <a href="#credits">Credits</a>
          <span className="nav__sep" aria-hidden="true">
            ·
          </span>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav__social">
          <SocialIcons className="nav__icon-link" />
        </div>
      </nav>
    </header>
  );
}
