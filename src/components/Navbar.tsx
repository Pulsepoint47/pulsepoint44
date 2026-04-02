import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Pulse Point" width={36} height={36} />
          <span className="text-xl font-bold text-foreground">Pulse Point</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {user ? (
            <>
              <Link to={profile?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}>
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
