import { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Dashoboard from './pages/Dashboard/Dashboard';
import { ROUTES } from './routes/routes';
import PrivateRoute from './routes/PrivateRoute';
import DefaultLayout from './layout/DefaultLayout';
import NotFound from './pages/404';
import CoworkingHomepage from './pages/CoworkingHomepage';
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const authRoutes = ["/auth/signin", "/auth/signup"];
  const isAuthRoute = authRoutes.includes(pathname);
  return loading ? (
    <Loader />
  ) : (
    isAuthRoute ? ( 
      // Render Sign In / Sign Up without DefaultLayout
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
      </Routes>
    ) : (
      <Routes>
      {/* <Route index element={<Navigate to={ROUTES.TENANT_DASHBOARD} replace />} /> */}
      
      {/* Public routes */}
      <Route path="/" element={<CoworkingHomepage />} />
      <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
      <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
    
      {/* Protected routes with layout */}
      <Route element={
        <PrivateRoute>
          <DefaultLayout />
        </PrivateRoute>
      }>
        <Route path={ROUTES.TENANT_DASHBOARD} element={<Dashoboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    )
  );
}

export default App;