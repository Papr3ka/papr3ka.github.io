// node v24.2.0
import { BrowserRouter, Routes, Route, /*, Link*/ } from 'react-router-dom';
import './App.css';

import { AppProvider } from './components/shared/Context.js';
import Home from './components/pages/Home.js'

function App() {

  // Scroll is disabled when modal is open
  // This is done in the provider

  return (
    <AppProvider>
      <div className='app' id='appcontent' >
        <BrowserRouter>
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}

export default App