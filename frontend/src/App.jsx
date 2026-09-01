import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateTicket from './pages/CreateTicket.jsx';
import MyTickets from './pages/MyTickets.jsx';
import TicketDetail from './pages/TicketDetail.jsx';
import LiveStatus from './pages/LiveStatus.jsx';
import About from './pages/About.jsx';
import SafetyTips from './pages/SafetyTips.jsx';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/live-status" element={<LiveStatus />} />
            <Route path="/about" element={<About />} />
            <Route path="/safety-tips" element={<SafetyTips />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-ticket"
              element={
                <ProtectedRoute>
                  <Layout><CreateTicket /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <Layout><MyTickets /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets/:id"
              element={
                <ProtectedRoute>
                  <Layout><TicketDetail /></Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <ChatWidget />
          <CustomCursor />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;