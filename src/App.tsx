import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CollectionPage } from './pages/CollectionPage';
import { CustomizePage } from './pages/CustomizePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CollectionPage />} />
          <Route path="/customize" element={<CustomizePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
