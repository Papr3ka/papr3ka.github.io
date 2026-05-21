import React from 'react';

// Centralized data makes it easy to update without touching JSX
const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    skills: ['C', 'C++', 'Rust', 'Python', 'Java', 'Kotlin', 'JavaScript', 'HTML', 'CSS']
  },
  {
    title: 'Frameworks & Platforms',
    skills: ['React.js', 'Node.js', 'AOSP']
  },
  {
    title: 'DevOps & Tooling',
    skills: ['Git', 'VS Code', 'GDB', 'CMake', 'CI/CD', 'GitHub Actions', 'YAML', 'LaTeX']
  },
  {
    title: 'Embedded & Hardware',
    skills: ['Verilog', 'GTKWave', 'Icarus Verilog', 'LTSpice', 'Hardware-in-the-Loop']
  }
];

const Skills = () => {
  return (
    <section className="section" aria-labelledby="skills-heading">
      <h1 id="skills-heading">Skills</h1>

      <div className="grid-container">
        {SKILL_CATEGORIES.map(({ title, skills }) => (
          <div className="pill-container" key={title}>
            <h2>
              <span className="pill-header">{title}</span>
              <span className="text-line" aria-hidden="true" />
            </h2>

            <div className="pill-gradient-container" role="list">
              {skills.map((skill) => (
                <span className="pill" key={skill} role="listitem">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;