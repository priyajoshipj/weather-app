import { useState, useEffect, useCallback } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import SearchBox from './components/SearchBox';
import { StoreProvider } from './store';

function App() {
  const [stateData, setStateData] = useState();

  return (
    <>
      {/* <StoreProvider.Provider> */}
      <div className="outer-box">
        <SearchBox />
      </div>
      {/* </StoreProvider.Provider> */}
    </>
  );
}

export default App;
