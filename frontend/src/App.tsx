import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Library } from './pages/Library';
import { Investments } from './pages/Investments';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));
const SharedReport = lazy(() => import('./pages/SharedReport').then(module => ({ default: module.SharedReport })));

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-500">Loading Taxync...</div>}>
          <TooltipProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/shared-report/:reportId" element={<SharedReport />} />
              
              {/* Protected Routes with Layout */}
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/investments" element={<Investments />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/library" element={<Library />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </TooltipProvider>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;