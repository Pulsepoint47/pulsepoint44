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
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Video,
  ArrowRight,
  Bell
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ConversationPreview {
  id: string;
  patient_name: string | null;
  last_message?: string;
  unread_count: number;
  updated_at: string;
}

const stats = [
  { label: "Total Patients", value: "128", icon: Users, change: "+12%", color: "text-blue-500" },
  { label: "Appointments Today", value: "8", icon: Calendar, change: "+3", color: "text-primary" },
  { label: "Avg. Wait Time", value: "12 min", icon: Clock, change: "-2 min", color: "text-orange-500" },
  { label: "Satisfaction", value: "4.8/5", icon: TrendingUp, change: "+0.2", color: "text-green-500" },
];

const appointments = [
  { patient: "Sarah Johnson", time: "9:00 AM", type: "Follow-up", status: "confirmed" },
  { patient: "Mike Chen", time: "10:30 AM", type: "Consultation", status: "confirmed" },
  { patient: "Emily Davis", time: "11:00 AM", type: "Check-up", status: "pending" },
  { patient: "Robert Wilson", time: "2:00 PM", type: "Lab Review", status: "confirmed" },
  { patient: "Lisa Anderson", time: "3:30 PM", type: "Follow-up", status: "pending" },
];

const statusColor = (s: string) => 
  s === "confirmed" 
    ? "bg-success/10 text-success border-success/30" 
    : "bg-warning/10 text-warning border-warning/30";

const DoctorDashboard = () => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoadingConvs(true);

      const { data: convs } = await supabase
        .from("conversations")
        .select("*")
        .eq("doctor_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5);

      if (convs) {
        let totalUnreadCount = 0;
        
        const previews = await Promise.all(
          convs.map(async (conv) => {
            // Fetch patient profile
            const { data: patientProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("user_id", conv.patient_id)
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

            const unreadCount = count || 0;
            totalUnreadCount += unreadCount;

            return {
              id: conv.id,
              patient_name: patientProfile?.full_name || null,
              last_message: lastMsg?.content,
              unread_count: unreadCount,
              updated_at: conv.updated_at,
            };
          })
        );

        setConversations(previews);
        setTotalUnread(totalUnreadCount);
      }

      setLoadingConvs(false);
    };

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel("doctor-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getInitials = (name: string | null) => {
    if (!name) return "P";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Welcome back, Dr. {profile?.full_name?.split(" ").slice(-1)[0] || "Doctor"}
            </h1>
            <p className="text-muted-foreground">Here&apos;s what&apos;s happening today</p>
          </div>
          <div className="flex gap-3">
            <Link to="/conversations">
              <Button variant="outline" className="gap-2 relative">
                <MessageSquare className="h-4 w-4" />
                Messages
                {totalUnread > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 min-w-5 p-0 flex items-center justify-center bg-primary">
                    {totalUnread}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <Card key={s.label} className="border-border/60 hover:shadow-soft transition-smooth">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <span className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-full">
                    {s.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Patient Messages */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Patient Messages</CardTitle>
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
                  <p className="text-muted-foreground">No patient messages yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <Link key={conv.id} to={`/chat/${conv.id}`} className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div className="relative">
                        <Avatar className="h-11 w-11">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(conv.patient_name)}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unread_count > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-primary-foreground">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">
                            {conv.patient_name || "Patient"}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conv.updated_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.last_message || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Today&apos;s Appointments</CardTitle>
              <Badge variant="outline" className="text-primary border-primary/30">
                {appointments.length} scheduled
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.patient + a.time} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(a.patient)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{a.patient}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{a.time}</span>
                          <span className="text-border">·</span>
                          <span>{a.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusColor(a.status)}>
                        {a.status}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
