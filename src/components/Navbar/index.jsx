import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z"/>
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-lg">Refúgio</span>
        <span className="ml-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">⚠ Risco ALTO</span>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
      >
        Sair
      </button>
    </header>
  );
}