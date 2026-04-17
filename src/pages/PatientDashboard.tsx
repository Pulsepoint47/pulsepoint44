import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  MessageSquare, 
  Video, 
  Calendar,
  Stethoscope,
  ArrowRight,
  Plus,
  Clock
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ConversationPreview {
  id: string;
  doctor_name: string | null;
  specialization: string | null;
  last_message?: string;
  unread_count: number;
}

const vitals = [
  { label: "Heart Rate", value: "72 bpm", icon: Heart, status: "Normal", color: "text-rose-500" },
  { label: "Blood Pressure", value: "120/80", icon: Activity, status: "Normal", color: "text-primary" },
  { label: "Temperature", value: "98.6°F", icon: Thermometer, status: "Normal", color: "text-orange-500" },
  { label: "Blood Sugar", value: "95 mg/dL", icon: Droplets, status: "Normal", color: "text-blue-500" },
];

const upcomingAppointments = [
  { doctor: "Dr. Smith", specialty: "Cardiology", date: "Apr 5, 2026", time: "10:00 AM" },
  { doctor: "Dr. Patel", specialty: "General Practice", date: "Apr 12, 2026", time: "2:30 PM" },
];

const PatientDashboard = () => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoadingConvs(true);

      const { data: convs } = await supabase
        .from("conversations")
        .select("*")
        .eq("patient_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(3);

      if (convs) {
        const previews = await Promise.all(
          convs.map(async (conv) => {
            // Fetch doctor profile
            const { data: doctorProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("user_id", conv.doctor_id)
              .single();

            // Fetch doctor specialization
            const { data: doctorData } = await supabase
              .from("doctors")
              .select("specialization")
              .eq("user_id", conv.doctor_id)
              .single();

            // Fetch last message
            const { data: lastMsg } = await supabase
              .from("messages")
              .select("content")
              .eq("conversation_id", conv.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            // Count unread
            const { count } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("conversation_id", conv.id)
              .eq("is_read", false)
              .neq("sender_id", user.id);

            return {
              id: conv.id,
              doctor_name: doctorProfile?.full_name || null,
              specialization: doctorData?.specialization || null,
              last_message: lastMsg?.content,
              unread_count: count || 0,
            };
          })
        );

        setConversations(previews);
      }

      setLoadingConvs(false);
    };

    fetchConversations();
  }, [user]);

  const getInitials = (name: string | null) => {
    if (!name) return "DR";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Patient"}
            </h1>
            <p className="text-muted-foreground">Here&apos;s your health overview</p>
          </div>
          <div className="flex gap-3">
            <Link to="/find-doctors">
              <Button className="gap-2">
                <Stethoscope className="h-4 w-4" />
                Find a Doctor
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { to: "/find-doctors", icon: Stethoscope, title: "Find Doctor", desc: "Browse specialists" },
            { to: "/conversations", icon: MessageSquare, title: "Messages", desc: "Chat with doctors" },
            { to: "/conversations", icon: Video, title: "Video Call", desc: "Start consultation" },
            { to: "/patient-dashboard", icon: Calendar, title: "Appointments", desc: "Schedule visit" },
          ].map((action) => (
            <Link key={action.title} to={action.to} className="block group">
              <Card className="hover:shadow-elegant hover:border-primary/40 hover:-translate-y-0.5 transition-smooth cursor-pointer h-full border-border/60">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-smooth">
                    <action.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Vitals */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Your Vitals</h2>
            <p className="text-sm text-muted-foreground">Latest readings from connected devices</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {vitals.map((v) => (
            <Card key={v.label} className="border-border/60 hover:shadow-soft transition-smooth">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <v.icon className={`h-5 w-5 ${v.color}`} />
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-0">{v.status}</Badge>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{v.value}</p>
                <p className="text-sm text-muted-foreground">{v.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Conversations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Conversations</CardTitle>
              <Link to="/conversations">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingConvs ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">No conversations yet</p>
                  <Link to="/find-doctors">
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Find a Doctor
                    </Button>
                  </Link>
                </div>
              ) : (
                conversations.map((conv) => (
                  <Link key={conv.id} to={`/chat/${conv.id}`} className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(conv.doctor_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">
                            {conv.doctor_name || "Doctor"}
                          </p>
                          {conv.unread_count > 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                              {conv.unread_count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.specialization} {conv.last_message ? `· ${conv.last_message}` : ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Book New
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.map((a) => (
                <div key={a.doctor + a.date} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{a.doctor}</p>
                      <p className="text-sm text-muted-foreground">{a.specialty}</p>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      Scheduled
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{a.date} at {a.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
