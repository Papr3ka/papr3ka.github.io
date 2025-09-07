import { scrollToTop } from '../shared/Util.js'

const Footer = () => {
  return (
    <div className="footer">
      <p className="footer-text pointer prevent-select" onClick={scrollToTop}>[Back to top]</p>
    </div>
  );
};

export default Footer;