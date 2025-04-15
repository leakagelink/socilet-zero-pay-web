
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if this might be a broken referral link
    if (location.pathname.includes('/refer') || location.search.includes('ref=')) {
      console.error(
        "Possible broken referral link:",
        location.pathname + location.search
      );
    } else {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        
        {(location.pathname.includes('/refer') || location.search.includes('ref=')) && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              It looks like you were trying to access a referral link. 
              The format should be <code>/refer/[referrerId]</code>.
            </p>
          </div>
        )}
        
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline font-medium">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
