import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Pulse Point" width={36} height={36} />
          <span className="text-xl font-bold text-foreground">Pulse Point</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/patient-dashboard">
            <Button variant="ghost" size="sm">Patient Portal</Button>
          </Link>
          <Link to="/doctor-dashboard">
            <Button variant="ghost" size="sm">Doctor Portal</Button>
          </Link>
          <Link to="/doctor-register">
            <Button size="sm">Register as Doctor</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
