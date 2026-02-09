import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CollectionPage } from './pages/CollectionPage';
import { CustomizePage } from './pages/CustomizePage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CollectionPage />} />
          <Route path="/customize" element={<CustomizePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
