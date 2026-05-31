import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        PayFlow
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Wallet</Link>
        <Link to="/transactions">Transactions</Link>
      </div>
      <div className="navbar-user">
        <span>{user?.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;