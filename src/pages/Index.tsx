import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";
import { Activity, Users, Shield, Clock } from "lucide-react";

const features = [
  { icon: Activity, title: "Real-Time Monitoring", description: "Track patient vitals and health metrics in real time." },
  { icon: Users, title: "Doctor-Patient Connect", description: "Seamless communication between doctors and patients." },
  { icon: Shield, title: "Secure Records", description: "HIPAA-compliant storage for all medical records." },
  { icon: Clock, title: "24/7 Availability", description: "Access your health data anytime, anywhere." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your Health, Our <span className="text-primary">Priority</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Pulse Point connects patients and doctors through a modern, intuitive healthcare platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/patient-dashboard">
              <Button size="lg">Patient Dashboard</Button>
            </Link>
            <Link to="/doctor-register">
              <Button size="lg" variant="outline">Join as Doctor</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Pulse Point?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8 text-center text-sm text-muted-foreground">
        © 2026 Pulse Point. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
