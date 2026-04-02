import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "" as "doctor" | "patient" | "" });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.role) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: form.fullName, role: form.role },
      },
    });
    setLoading(false);

    if (error) { toast.error(error.message); return; }

    toast.success("Account created! Check your email to confirm, or log in if auto-confirmed.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create your Pulse Point account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Smith" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div>
                <Label>I am a</Label>
                <Select onValueChange={(v) => setForm({ ...form, role: v as "doctor" | "patient" })}>
                  <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
