import React, { useState, useEffect } from 'react'

import './App.css';

// Components
import Sidebar from './components/Sidebar.js'

// Sections
import About from './sections/About'
import Interests from './sections/Interests'
import Photos from './sections/Photos';
import Contact from './sections/Contact'


const sections = [
  { id: 'about', title: 'About Me', component: About },
  { id: 'interests', title: 'Interests', component: Interests },
  { id: 'photos', title: 'Photos', component: Photos},
  { id: 'contact', title: 'Contact', component: Contact }
];

function App() {
  const [activeSection, setActiveSection] = useState('about')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      
      sections.forEach(section => {
        const element = document.getElementById(section.id)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="app">
      <Sidebar 
        sections={sections} 
        activeSection={activeSection} 
        scrollToSection={scrollToSection}
      />
      <main className="content">
        {sections.map((section, index) => (
          <>
            <section 
              key={section.id} 
              id={section.id} 
              className="content-section"
            >
              <section.component />
            
            </section>
            {/*index < (sections.length - 1) && <hr className="content-divider" />*/}
          </>
        ))}
      </main>
    </div>
  )
}


export default App
