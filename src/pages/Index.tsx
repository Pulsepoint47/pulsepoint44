import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { 
  Activity, 
  Users, 
  Shield, 
  Clock, 
  Video, 
  MessageSquare, 
  Calendar,
  Heart,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  UserCircle
} from "lucide-react";

const features = [
  { 
    icon: MessageSquare, 
    title: "Instant Chat", 
    description: "Connect with your doctor through secure, real-time messaging anytime." 
  },
  { 
    icon: Video, 
    title: "Video Consultations", 
    description: "Face-to-face appointments from the comfort of your home." 
  },
  { 
    icon: Shield, 
    title: "Secure & Private", 
    description: "HIPAA-compliant platform ensuring your data stays protected." 
  },
  { 
    icon: Clock, 
    title: "24/7 Availability", 
    description: "Access healthcare support whenever you need it, day or night." 
  },
];

const benefits = [
  "No waiting rooms or travel time",
  "Access specialists from anywhere",
  "Secure medical records storage",
  "Prescription management",
  "Appointment scheduling",
  "Health monitoring tools",
];

const stats = [
  { value: "10,000+", label: "Patients Served" },
  { value: "500+", label: "Licensed Doctors" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Heart className="h-4 w-4" />
                <span>Healthcare Made Simple</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Your Health Journey,{" "}
                <span className="text-primary">Reimagined</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                PulsePoint connects you with certified doctors through secure video calls and instant messaging. 
                Get the care you deserve, whenever and wherever you need it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                    Sign In
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground text-xs font-medium border-2 border-background"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Join 10,000+ patients</p>
                  <p className="text-muted-foreground">already using PulsePoint</p>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative bg-card rounded-3xl border shadow-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Dr. Sarah Chen</h3>
                    <p className="text-sm text-muted-foreground">Cardiologist</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Available
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Video className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">Video consultation ready</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">Chat anytime</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">Next slot: Today, 3:00 PM</span>
                  </div>
                </div>
                
                <Button className="w-full" size="lg">
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
            Everything You Need for Better Healthcare
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform provides comprehensive tools to manage your health journey effectively.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="group border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How PulsePoint Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", description: "Sign up as a patient or doctor in minutes", icon: UserCircle },
              { step: "02", title: "Find Your Doctor", description: "Browse specialists and check availability", icon: Users },
              { step: "03", title: "Start Consultation", description: "Chat or video call with your doctor instantly", icon: Video },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-border" />
                )}
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center mx-auto">
                      <item.icon className="h-10 w-10 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
              Why Choose PulsePoint for Your Healthcare Needs?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              We combine cutting-edge technology with compassionate care to provide you 
              with the best possible healthcare experience.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <Card className="p-6 border-primary/20">
                <Activity className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-semibold text-foreground mb-1">Real-time Monitoring</h4>
                <p className="text-sm text-muted-foreground">Track your vitals and health metrics</p>
              </Card>
              <Card className="p-6 mt-8 border-primary/20">
                <Calendar className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-semibold text-foreground mb-1">Easy Scheduling</h4>
                <p className="text-sm text-muted-foreground">Book appointments in seconds</p>
              </Card>
              <Card className="p-6 border-primary/20">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-semibold text-foreground mb-1">Data Security</h4>
                <p className="text-sm text-muted-foreground">Enterprise-grade encryption</p>
              </Card>
              <Card className="p-6 mt-8 border-primary/20">
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-semibold text-foreground mb-1">Quality Care</h4>
                <p className="text-sm text-muted-foreground">Certified medical professionals</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors already using PulsePoint for better healthcare outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 text-base">
                <UserCircle className="h-5 w-5" />
                Sign Up as Patient
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Stethoscope className="h-5 w-5" />
                Join as Doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">PulsePoint</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 PulsePoint. All rights reserved. Your health, our priority.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
