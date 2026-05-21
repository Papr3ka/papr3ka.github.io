const Experience = () => {
  return (
    <div className="section">
      <h1>Experience</h1>
      <div className="vertical-container">
        {/* Ford Motor Company */}
        <div className="pill-container">
          <h2>
            <span className="pill-header">Ford Motor Company</span>
            <div className="text-line" />
          </h2>
          <p className="experience-role">Software Engineer • January 2026 - April 2026</p>
          <p className="experience-description">Hardened safety-critical service stability, delivered a validated 3D Avatar UI PoC, and accelerated infotainment validation through enhanced emulator tooling across Driver Assist systems</p>
        </div>

        {/* Mikobyte Solutions - Grouped Return Offers */}
        <div className="pill-container company-group">
          <div className="group-header">
            <h2>
              <span className="pill-header">Mikobyte Solutions</span>
              <div className="text-line" />
            </h2>
          </div>

          <div className="grouped-roles">
            <div className="pill-container nested">
              <p className="experience-role">Fullstack Developer • September 2024 - December 2024</p>
              <p className="experience-description">Built high-performance backend systems for financial trading, from low latency order books to custom communication protocols</p>
            </div>

            <div className="pill-container nested">
              <p className="experience-role">Software Developer • January 2024 - April 2024</p>
              <p className="experience-description">Built financial literacy apps, accelerated EEG data APIs by 500%, and engineered an RAG-ready C++ language model library</p>
            </div>
          </div>
        </div>

        {/* Magnus Dei Corporation */}
        <div className="pill-container">
          <h2>
            <span className="pill-header">Magnus Dei Corporation</span>
            <div className="text-line" />
          </h2>
          <p className="experience-role">Game Developer • June 2021 - August 2021</p>
          <p className="experience-description">Developed core gameplay systems and UI features for an isometric RPG, blending backend mechanics with player-facing design</p>
        </div>
      </div>
    </div>
  );
};

export default Experience;