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

export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

export const NStateSlider = ({
  value,
  onChange,
  labels = [],
  disabled = false,
  className = '',
}) => {
  // If no labels provided, generate ["1", "2", "3", ...]
  const normalizedLabels = labels.length > 0
    ? labels
    : Array.from({ length: Math.max(2, labels.length) }, (_, i) => String(i + 1));

  const n = normalizedLabels.length;

  if (n < 2) {
    console.error('NStateSlider requires at least 2 states.');
    return null;
  }

  const activeIndex = normalizedLabels.indexOf(value);
  const isValidValue = activeIndex !== -1;

  const handleClick = (label) => {
    if (disabled || !onChange) return;
    onChange(label);
  };

  return (
    <div
      className={`n-state-slider ${className} ${disabled ? 'disabled' : ''}`}
      role="radiogroup"
      aria-label="State selector"
      style={{ '--n-states': n }}
    >
      {normalizedLabels.map((label, index) => (
        <button
          key={label}
          type="button"
          className={`slider-option ${isValidValue && value === label ? 'active' : ''}`}
          onClick={() => handleClick(label)}
          aria-checked={isValidValue && value === label}
          role="radio"
          tabIndex={disabled ? -1 : 0}
          disabled={disabled}
        >
          {label}
        </button>
      ))}

      {isValidValue && (
        <div
          className="slider-indicator"
          style={{
            transform: `translateX(${activeIndex * (100 / n)*labels.length}%)`,
            width: `calc(100% / ${n})`,
          }}
        />
      )}
    </div>
  );
};

// export default SideBarHandler;