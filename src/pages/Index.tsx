import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import {
  Activity, Users, Shield, Clock, Video, MessageSquare, Calendar,
  Heart, ArrowRight, CheckCircle2, Stethoscope, UserCircle, Star,
  Sparkles, Zap, Globe,
} from "lucide-react";

const features = [
  { icon: MessageSquare, title: "Instant Chat", description: "Secure, real-time messaging with your care team — anytime, anywhere." },
  { icon: Video, title: "Video Consultations", description: "HD face-to-face appointments from the comfort of your home." },
  { icon: Shield, title: "Secure & Private", description: "End-to-end encryption and HIPAA-compliant infrastructure." },
  { icon: Clock, title: "24/7 Availability", description: "Care that never sleeps. Get support whenever you need it." },
];

const benefits = [
  "No waiting rooms or travel time",
  "Access specialists from anywhere",
  "Secure medical records storage",
  "Prescription management",
  "Smart appointment scheduling",
  "Continuous health monitoring",
];

const stats = [
  { value: "10K+", label: "Patients Served", icon: Users },
  { value: "500+", label: "Licensed Doctors", icon: Stethoscope },
  { value: "98%", label: "Satisfaction Rate", icon: Heart },
  { value: "24/7", label: "Always On", icon: Clock },
];

const testimonials = [
  {
    quote: "PulsePoint completely changed how I manage my family's health. The video calls feel just like being in the office.",
    name: "Maria L.", role: "Patient · 2 years",
  },
  {
    quote: "As a physician, the platform lets me focus on care, not paperwork. The interface is genuinely a joy to use.",
    name: "Dr. James Okafor", role: "Internal Medicine",
  },
  {
    quote: "I got a specialist consult within an hour. The peace of mind is worth everything.",
    name: "Sam K.", role: "Patient",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 -right-24 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-[28rem] h-[28rem] rounded-full bg-accent/40 blur-3xl" />

        <div className="relative container mx-auto px-4 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Healthcare, reimagined for 2026</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight text-balance">
                Care that comes{" "}
                <span className="text-gradient-primary">to you.</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Connect with certified doctors through secure video and instant messaging.
                Skip the waiting room — your health, on your schedule.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-7 rounded-xl shadow-elegant hover:shadow-glow transition-smooth">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/find-doctors">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-7 rounded-xl border-2">
                    Browse Doctors
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold border-2 border-background shadow-sm"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                    ))}
                    <span className="ml-1 font-semibold text-foreground">4.9</span>
                  </div>
                  <p className="text-muted-foreground">from 10,000+ patients</p>
                </div>
              </div>
            </div>

            {/* Hero card */}
            <div className="relative hidden lg:block animate-scale-in">
              <div className="absolute -inset-4 bg-gradient-primary opacity-20 rounded-[2rem] blur-2xl" />
              <div className="relative bg-card rounded-3xl border shadow-elegant p-7 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-soft">
                      <Stethoscope className="h-7 w-7 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Dr. Sarah Chen</h3>
                    <p className="text-sm text-muted-foreground">Cardiologist · 12 yrs</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    Online
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { icon: Video, label: "Video consultation ready" },
                    { icon: MessageSquare, label: "Reply in ~2 minutes" },
                    { icon: Calendar, label: "Next slot · Today, 3:00 PM" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <row.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{row.label}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-90 transition-smooth shadow-soft">
                  Book Consultation
                </Button>
              </div>

              {/* Floating chip */}
              <div className="absolute -top-4 -right-4 bg-card border rounded-2xl shadow-elegant p-3 flex items-center gap-2 animate-float">
                <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">72 BPM</p>
                  <p className="text-[10px] text-muted-foreground">Healthy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">Features</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance tracking-tight">
            Everything you need, beautifully built
          </h2>
          <p className="text-muted-foreground text-lg">
            Thoughtful tools that make managing your health feel effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className="group relative border-border/60 hover:border-primary/40 hover:shadow-elegant hover:-translate-y-1 transition-smooth overflow-hidden bg-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="pt-8 pb-7 px-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-soft flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-soft py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">Process</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              From sign-up to seen in minutes
            </h2>
            <p className="text-muted-foreground text-lg">Three steps. That's it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-4">
            {[
              { step: "01", title: "Create your account", description: "Sign up as a patient or doctor in under 60 seconds.", icon: UserCircle },
              { step: "02", title: "Find your match", description: "Browse verified specialists and check live availability.", icon: Users },
              { step: "03", title: "Start consulting", description: "Chat or jump on video — instantly, securely.", icon: Video },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-gradient-to-r from-primary/40 to-transparent" />
                )}
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-card border border-primary/20 shadow-soft flex items-center justify-center mx-auto">
                      <item.icon className="h-10 w-10 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-elegant">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">Why PulsePoint</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-5 text-balance tracking-tight">
              Better outcomes start with better access
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              We blend modern technology with compassionate care so you spend less time
              waiting and more time living.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  </div>
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Link to="/signup">
              <Button size="lg" className="gap-2 h-12 px-7 rounded-xl bg-gradient-primary hover:opacity-90 transition-smooth shadow-soft">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-[2rem] blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { icon: Activity, title: "Real-time Monitoring", desc: "Track your vitals instantly", offset: "" },
                { icon: Calendar, title: "Easy Scheduling", desc: "Book in seconds", offset: "mt-8" },
                { icon: Shield, title: "Bank-grade Security", desc: "End-to-end encrypted", offset: "" },
                { icon: Globe, title: "Care Anywhere", desc: "Across all devices", offset: "mt-8" },
              ].map((c) => (
                <Card key={c.title} className={`p-6 border-border/60 hover:shadow-elegant hover:-translate-y-1 transition-smooth ${c.offset}`}>
                  <div className="w-11 h-11 rounded-xl bg-gradient-soft flex items-center justify-center mb-4">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{c.title}</h4>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/40 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">Loved by patients & doctors</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Real stories, real results
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-7 border-border/60 hover:shadow-elegant transition-smooth bg-card">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative container mx-auto px-4 text-center text-primary-foreground">
          <Zap className="h-10 w-10 mx-auto mb-5 opacity-90" />
          <h2 className="text-4xl lg:text-5xl font-bold mb-5 text-balance tracking-tight">
            Ready to take control of your health?
          </h2>
          <p className="text-primary-foreground/85 text-lg mb-9 max-w-2xl mx-auto">
            Join thousands of patients and doctors building healthier futures with PulsePoint.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 text-base h-12 px-7 rounded-xl shadow-elegant">
                <UserCircle className="h-5 w-5" />
                Sign Up as Patient
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base h-12 px-7 rounded-xl bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <Stethoscope className="h-5 w-5" />
                Join as Doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <Logo size="md" />
              <p className="text-sm text-muted-foreground mt-4 max-w-sm leading-relaxed">
                Modern healthcare that meets you where you are. Secure, simple, and human.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/find-doctors" className="hover:text-primary transition-colors">Find doctors</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Get started</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">For doctors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/doctor-register" className="hover:text-primary transition-colors">Register</Link></li>
                <li><Link to="/doctor-dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © 2026 PulsePoint. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Your health, our priority.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
