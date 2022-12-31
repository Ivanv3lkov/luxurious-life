import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';

import Layout from './components/Layout/Layout/Layout';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
