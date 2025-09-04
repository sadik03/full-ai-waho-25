import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100/50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-amber-700 mb-4">404</h1>
          <p className="text-2xl font-semibold text-slate-800 mb-2">Oops! Page not found</p>
          <p className="text-slate-600 mb-8">The page you are looking for does not exist or has been moved.</p>
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-bold shadow hover:bg-amber-700 transition-all">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    );
};

export default NotFound;
