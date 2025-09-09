import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Shared.css';

const Sidebar = ({ sections, activeSection, scrollToSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mobileHeaderRef = useRef(null);

  // Handle scroll behavior for mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide mobile header based on scroll direction
      if (currentScrollY > 100) {
        setIsScrolled(currentScrollY > lastScrollY);
      } else {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileHeaderRef.current && 
          !mobileHeaderRef.current.contains(event.target) &&
          !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get the title of the active section
  const activeSectionTitle = sections.find(section => section.id === activeSection)?.title || '';

  return (
    <>
      {/* Mobile Header Bar (only visible on mobile) */}
      <header 
        ref={mobileHeaderRef}
        className={`mobile-header ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className="mobile-header-content">
          <span className="current-section">{activeSectionTitle}</span>
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu-dropdown ${isMobileMenuOpen ? 'open' : ''}`}>
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
        </div>
      </header>

      {/* Desktop Sidebar (unchanged) */}
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
    </>
  );
};

export default Sidebar;