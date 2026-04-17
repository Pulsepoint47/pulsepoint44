import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MessageSquare, Search, Plus, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ConversationWithDetails {
  id: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  other_user: Profile | null;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

const Conversations = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoading(true);

      // Fetch conversations where user is either doctor or patient
      const { data: convs, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`doctor_id.eq.${user.id},patient_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (error) {
        toast.error("Failed to load conversations");
        setLoading(false);
        return;
      }

      // Fetch other user profiles and last messages
      const conversationsWithDetails = await Promise.all(
        (convs || []).map(async (conv) => {
          const otherUserId = conv.doctor_id === user.id ? conv.patient_id : conv.doctor_id;
          
          // Fetch other user's profile
          const { data: otherProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", otherUserId)
            .single();

          // Fetch last message
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at, sender_id")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Count unread messages
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .eq("is_read", false)
            .neq("sender_id", user.id);

          return {
            ...conv,
            other_user: otherProfile,
            last_message: lastMsg || undefined,
            unread_count: count || 0,
          };
        })
      );

      setConversations(conversationsWithDetails);
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to conversation updates
    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
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
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dashboardPath = profile?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(dashboardPath)}
            className="rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground">
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No conversations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {profile?.role === "patient"
                  ? "Start a conversation with a doctor from your dashboard."
                  : "Your patient conversations will appear here."}
              </p>
              <Link to={dashboardPath}>
                <Button>
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conv) => (
              <Link
                key={conv.id}
                to={`/chat/${conv.id}`}
                className="block"
              >
                <Card className={cn(
                  "transition-all hover:shadow-md hover:border-primary/30",
                  conv.unread_count > 0 && "border-primary/50 bg-primary/5"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={cn(
                          "text-sm",
                          conv.unread_count > 0 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-primary/10 text-primary"
                        )}>
                          {getInitials(conv.other_user?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={cn(
                            "font-medium truncate",
                            conv.unread_count > 0 ? "text-foreground" : "text-foreground"
                          )}>
                            {conv.other_user?.full_name || "Unknown User"}
                          </h3>
                          {conv.last_message && (
                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                              {formatTime(conv.last_message.created_at)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-sm truncate",
                            conv.unread_count > 0 
                              ? "text-foreground font-medium" 
                              : "text-muted-foreground"
                          )}>
                            {conv.last_message?.content || "No messages yet"}
                          </p>
                          
                          {conv.unread_count > 0 && (
                            <span className="flex-shrink-0 ml-2 min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center px-1.5">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
