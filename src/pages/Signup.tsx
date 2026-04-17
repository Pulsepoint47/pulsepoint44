import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Stethoscope, UserCircle, Heart, CheckCircle2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "doctor" | "patient";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    role: "" as Role | "",
    specialization: "",
    licenseNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.role) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) { 
      toast.error("Password must be at least 6 characters."); 
      return; 
    }
    if (form.role === "doctor" && (!form.specialization || !form.licenseNumber)) {
      toast.error("Please provide your specialization and license number.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { 
          full_name: form.fullName, 
          role: form.role,
          specialization: form.specialization || undefined,
          license_number: form.licenseNumber || undefined,
        },
      },
    });
    setLoading(false);

    if (error) { 
      toast.error(error.message); 
      return; 
    }

    toast.success("Account created! Check your email to confirm, or log in if auto-confirmed.");
    navigate("/login");
  };

  const selectRole = (role: Role) => {
    setForm({ ...form, role });
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" aria-hidden />
      <div className="relative">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-lg mx-auto">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mx-auto shadow-elegant">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Join <span className="text-gradient-primary">PulsePoint</span>
                </h1>
                <p className="text-muted-foreground">Choose how you want to use our platform</p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => selectRole("patient")}
                  className={cn(
                    "group relative p-6 rounded-2xl border-2 bg-card/95 backdrop-blur text-left transition-smooth hover:border-primary hover:shadow-elegant hover:-translate-y-0.5",
                    form.role === "patient" ? "border-primary shadow-elegant" : "border-border/60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-smooth">
                      <UserCircle className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-1">I&apos;m a Patient</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Connect with doctors, book appointments, and manage your health records all in one place.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {["Chat with doctors", "Video calls", "Health tracking"].map((feature) => (
                          <span key={feature} className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectRole("doctor")}
                  className={cn(
                    "group relative p-6 rounded-2xl border-2 bg-card/95 backdrop-blur text-left transition-smooth hover:border-primary hover:shadow-elegant hover:-translate-y-0.5",
                    form.role === "doctor" ? "border-primary shadow-elegant" : "border-border/60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-smooth">
                      <Stethoscope className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-1">I&apos;m a Doctor</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Expand your practice, connect with patients, and provide care through our secure platform.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {["Manage patients", "Virtual consultations", "Scheduling"].map((feature) => (
                          <span key={feature} className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <Card className="border-border/60 shadow-elegant backdrop-blur bg-card/95 animate-scale-in">
              <CardHeader className="space-y-1">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change role
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {form.role === "doctor" ? (
                      <Stethoscope className="h-5 w-5 text-primary" />
                    ) : (
                      <UserCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Create Your Account</CardTitle>
                    <CardDescription>
                      Sign up as a {form.role === "doctor" ? "healthcare provider" : "patient"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={form.fullName} 
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                      placeholder={form.role === "doctor" ? "Dr. John Smith" : "John Smith"}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                      placeholder="you@example.com"
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={form.password} 
                      onChange={(e) => setForm({ ...form, password: e.target.value })} 
                      placeholder="Min. 6 characters"
                      className="h-11"
                    />
                  </div>

                  {form.role === "doctor" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input 
                          id="specialization" 
                          value={form.specialization} 
                          onChange={(e) => setForm({ ...form, specialization: e.target.value })} 
                          placeholder="e.g., Cardiology, General Practice"
                          className="h-11"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Medical License Number</Label>
                        <Input 
                          id="licenseNumber" 
                          value={form.licenseNumber} 
                          onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} 
                          placeholder="Your medical license number"
                          className="h-11"
                        />
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Log in
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
