import { useState, useEffect } from 'react'

import './Page.css'

// Components
import Sidebar from '../shared/Sidebar.js'
import { SideBarHandler, scrollToSection } from '../shared/Util.js'

// Sections
import Calculators from '../sections/Calculators.js'

const sections = [
    { id: 'calculators', title: 'Calculators', component: Calculators }
];

const Tools = () => {
    const [activeSection, setActiveSection] = useState('calculators')

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

export default Tools;