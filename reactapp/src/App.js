import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import SharedDocument from "./pages/SharedDocument";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ErrorBoundary from "./components/ErrorBoundary";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
}

function LandingRoute({ children }) {
  const { user } = useAuth();
  return user ? (
    <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} />
  ) : (
    children
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <div className="App">
              <Routes>
                <Route
                  path="/"
                  element={
                    <LandingRoute>
                      <Landing />
                    </LandingRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/demo" element={<Dashboard />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="/shared/:id" element={<SharedDocument />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
