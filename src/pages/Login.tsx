
import { useEffect } from "react";
import { useAuth } from "@/components/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/Auth/LoginForm";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-support-600 text-white p-1.5 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span className="text-xl font-bold">Support360</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to Support360</h1>
            <p className="mt-2 text-muted-foreground">Sign in to access your support dashboard</p>
          </div>
          
          <div className="mt-6">
            <LoginForm />
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Demo credentials:
            </p>
            <div className="mt-2 space-y-1">
              <div><strong>Admin:</strong> admin@support360.com / password</div>
              <div><strong>Agent:</strong> any agent email / password</div>
              <div><strong>Customer:</strong> any customer email / password</div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; 2025 Support360. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;
