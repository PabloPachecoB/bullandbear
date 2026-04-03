import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import './App.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const RegistrationPage = lazy(() => import('./components/RegistrationPage'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="app">
      <ScrollToTop />
      <Header />

      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a' }} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registro" element={<RegistrationPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>

      {!isAdmin && <Footer />}
      {!isAdmin && <BackToTop />}
    </div>
  );
}

export default App;
