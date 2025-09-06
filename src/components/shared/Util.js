// useSharedEffect.js
import { useEffect } from 'react';

export const SideBarHandler = ({ sections, activeSection, setActiveSection }) => {
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
    }, []); // Pass dependencies array
};

export const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
        window.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth'
        })
    }
}

// export default SideBarHandler;