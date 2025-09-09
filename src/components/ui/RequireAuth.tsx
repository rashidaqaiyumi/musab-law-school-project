import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';  // Correct import path

const RequireAuth = ({ children, role }: { children: JSX.Element, role: string }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the user is not authorized based on role, redirect them
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireAuth;
