import { useState, useEffect } from 'react'

import './Page.css'

// Components
import Sidebar from '../shared/Sidebar.js'
import { SideBarHandler, scrollToSection } from '../shared/Util.js'

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

    SideBarHandler({ sections, activeSection, setActiveSection });

    return (
        <div>
            <Sidebar
                sections={sections}
                activeSection={activeSection}
                scrollToSection={scrollToSection}
            />
            <div className="content">
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
            </div>
        </div>
    )
}

export default Home;