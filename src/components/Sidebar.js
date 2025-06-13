import React from 'react';

const Sidebar = ({ sections, activeSection, scrollToSection }) => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {sections.map((section) => (
            <li 
              key={section.id} 
              className={activeSection === section.id ? 'active' : ''}
            >
              <button onClick={() => scrollToSection(section.id)}>
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;