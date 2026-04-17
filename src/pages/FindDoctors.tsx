import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Search, 
  Loader2, 
  ArrowLeft, 
  MessageSquare, 
  Video, 
  Star,
  Stethoscope,
  Clock,
  CheckCircle2
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Doctor = Database["public"]["Tables"]["doctors"]["Row"];

interface DoctorWithProfile extends Doctor {
  profile: Profile | null;
}

const FindDoctors = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startingChat, setStartingChat] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);

      // Fetch all doctors
      const { data: doctorData, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_available", true);

      if (error) {
        toast.error("Failed to load doctors");
        setLoading(false);
        return;
      }

      // Fetch profiles for each doctor
      const doctorsWithProfiles = await Promise.all(
        (doctorData || []).map(async (doctor) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", doctor.user_id)
            .single();

          return {
            ...doctor,
            profile: profileData,
          };
        })
      );

      setDoctors(doctorsWithProfiles);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  const startConversation = async (doctorUserId: string) => {
    if (!user) {
      toast.error("Please log in to start a conversation");
      navigate("/login");
      return;
    }

    setStartingChat(doctorUserId);

    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("doctor_id", doctorUserId)
      .eq("patient_id", user.id)
      .single();

    if (existingConv) {
      navigate(`/chat/${existingConv.id}`);
      return;
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert({
        doctor_id: doctorUserId,
        patient_id: user.id,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to start conversation");
      setStartingChat(null);
      return;
    }

    navigate(`/chat/${newConv.id}`);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "DR";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Find a Doctor</h1>
            <p className="text-sm text-muted-foreground">
              Browse available doctors and start a consultation
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or specialization..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredDoctors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No doctors found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm 
                  ? "Try a different search term" 
                  : "No doctors are currently available"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredDoctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {getInitials(doctor.profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {doctor.profile?.full_name || "Doctor"}
                          </h3>
                          <p className="text-sm text-primary font-medium">
                            {doctor.specialization}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-success/10 text-success flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Available
                        </Badge>
                      </div>
                      
                      {doctor.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {doctor.bio}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {doctor.years_experience || 0} years exp.
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-warning" />
                          4.9 rating
                        </span>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 gap-2 rounded-xl"
                          onClick={() => startConversation(doctor.user_id)}
                          disabled={startingChat === doctor.user_id}
                        >
                          {startingChat === doctor.user_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-2 rounded-xl"
                          onClick={() => startConversation(doctor.user_id)}
                          disabled={startingChat === doctor.user_id}
                        >
                          <Video className="h-4 w-4" />
                          Video Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
