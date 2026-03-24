import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';

import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Marketplace from './components/Marketplace';
import Calendar from './components/Calendar';
import Users from './components/Users';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AppShell>
      <Navbar />
      <main style={{ padding: '1.5rem 1rem', minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </AppShell>
  );
}

export default App;