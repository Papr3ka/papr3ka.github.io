import { useState, useEffect } from 'react'

import './Home.css'

// Components
import Sidebar from '../shared/Sidebar.js'

// Sections
import About from '../sections/About.js'
import Interests from '../sections/Interests.js'
import Gallery from '../sections/Gallery.js'
import Contact from '../sections/Contact.js'

const sections = [
  { id: 'about', title: 'About Me', component: About },
  { id: 'interests', title: 'Interests', component: Interests },
  { id: 'gallery', title: 'Gallery', component: Gallery },
  { id: 'contact', title: 'Contact', component: Contact }
];

const Home = () => {
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
        <div>
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

export default Home;