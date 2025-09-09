const Experience = () => {
  return (
    <div className="section">
      <h1>Experience</h1>
      <div className="vertical-container">
        <div className="pill-container">
          <h2>Fullstack Developer<div className="text-line" /></h2>
          <p className="experience-overview">Mikobyte Solutions • September 2024 • 4 months</p>
          <p className="experience-description">Built high-performance backend systems for financial trading, from low latency order books to custom communication protocols</p>
        </div>
        <div className="pill-container">
          <h2>Software Developer<div className="text-line" /></h2>
          <p className="experience-overview">Mikobyte Solutions • January 2024 • 4 months</p>
          <p className="experience-description">Built financial literacy apps, accelerated EEG data APIs by 500%, and engineered an RAG-ready C++ language model library</p>
        </div>
        <div className="pill-container">
          <h2>Game Developer<div className="text-line" /></h2>
          <p className="experience-overview">Magnus Dei Corporation • June 2021 • 3 months</p>
          <p className="experience-description">Developed core gameplay systems and UI features for an isometric RPG, blending backend mechanics with player-facing design</p>
        </div>
      </div>
    </div>
  );
};

export default Experience;