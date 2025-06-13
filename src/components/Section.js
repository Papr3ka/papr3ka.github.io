import React from 'react';

const Section = ({ id, title, children }) => {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      <div className="section-content">
        {children}
      </div>
    </section>
  );
};

export default Section;