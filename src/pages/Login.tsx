import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, Shield, Clock, MessageSquare } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { 
      toast.error("Please fill in all fields."); 
      return; 
    }
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { 
      toast.error(error.message); 
      return; 
    }

    // Fetch profile to redirect to correct dashboard
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    toast.success("Welcome back!");
    navigate(profile?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" aria-hidden />
      <div className="relative">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Features */}
          <div className="hidden lg:block space-y-8 animate-fade-in-up">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Heart className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Trusted Healthcare Platform</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Welcome back to <span className="text-gradient-primary">PulsePoint</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Continue your healthcare journey with secure access to your account, 
                appointments, and conversations with your care team.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: MessageSquare, title: "Instant Messaging", description: "Pick up where you left off with your doctor" },
                { icon: Shield, title: "Bank-Grade Security", description: "End-to-end encryption on all health data" },
                { icon: Clock, title: "Always Available", description: "24/7 access to your care, anywhere" },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 p-4 rounded-2xl bg-card/60 backdrop-blur border border-border/60 hover:border-primary/30 hover:shadow-soft transition-smooth">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                    <feature.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-scale-in">
            <Card className="border-border/60 shadow-elegant backdrop-blur bg-card/95">
              <CardHeader className="space-y-1 text-center pb-2">
                <div className="lg:hidden inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-2 shadow-soft">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl tracking-tight">Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="you@example.com"
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Enter your password"
                      className="h-11"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">New to PulsePoint?</span>
                  </div>
                </div>
                
                <Link to="/signup" className="block">
                  <Button variant="outline" className="w-full h-11">
                    Create an Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
