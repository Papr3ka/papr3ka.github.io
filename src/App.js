// node v24.2.0
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import './App.css';

import AppProvider from './components/shared/Context';
import Home from './components/pages/Home.js'
import Tools from './components/pages/Tools.js'



function App() {
  return (
    <AppProvider>
      <div className='app'>
        <BrowserRouter>
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}

export default App
