import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = ({ sections, activeSection, scrollToSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <nav>
          <ul>
            {sections.map((section) => (
              <li 
                key={section.id} 
                className={activeSection === section.id ? 'active' : ''}
              >
                <button onClick={() => {
                  scrollToSection(section.id);
                  setIsMobileMenuOpen(false);
                }}>
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;