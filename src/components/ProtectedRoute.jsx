import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from 'api/auth';

// ==============================|| PROTECTED ROUTE ||============================== //

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra nếu user chưa đăng nhập
    if (!isAuthenticated()) {
      // Lưu current path để redirect về sau khi login
      const from = location.pathname + location.search;
      navigate('/login', { 
        replace: true,
        state: { from }
      });
    }
  }, [navigate, location]);

  // Nếu đã đăng nhập thì render children
  if (isAuthenticated()) {
    return children;
  }

  // Hiển thị loading hoặc null trong khi redirect
  return null;
};

export default ProtectedRoute; 