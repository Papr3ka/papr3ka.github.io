const Skills = () => {
    return (
        <div className="section">
            <h1>Skills</h1>
                <div className="grid-container">
                    <div className="pill-container">
                        <h2>Languages <div className="text-line" /></h2>
                        <div className="pill-gradient-container">
                            <div className="pill">C</div>
                            <div className="pill">C++</div>
                            <div className="pill">Rust</div>
                            <div className="pill">Python</div>
                            <div className="pill">Java</div>
                            <div className="pill">JavaScript</div>
                            <div className="pill">HTML</div>
                            <div className="pill">CSS</div>
                        </div>
                    </div>
                    <div className="pill-container">
                        <h2>Technologies <div className="text-line" /></h2>
                        <div className="pill-gradient-container">
                            <div className="pill">React.js</div>
                            <div className="pill">Node.js</div>
                        </div>
                    </div>
                    <div className="pill-container">
                        <h2>Tools <div className="text-line" /></h2>
                        <div className="pill-gradient-container">
                            <div className="pill">Git</div>
                            <div className="pill">VS Code</div>
                            <div className="pill">Latex</div>
                            <div className="pill">GDB</div>
                        </div>
                    </div>
                    <div className="pill-container">
                        <h2>Hardware <div className="text-line" /></h2>
                        <div className="pill-gradient-container">
                            <div className="pill">Verilog</div>
                            <div className="pill">GTKWave</div>
                            <div className="pill">Icarus Verilog</div>
                            <div className="pill">LTSpice</div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Skills;