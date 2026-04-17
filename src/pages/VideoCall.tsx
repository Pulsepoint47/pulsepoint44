import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare,
  Loader2,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const VideoCall = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [otherUserName, setOtherUserName] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get user media and setup video
  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        streamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Simulate connection delay
        setTimeout(() => {
          setIsConnecting(false);
          
          // Start call timer
          intervalRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
          }, 1000);
        }, 2000);
      } catch (error) {
        toast.error("Failed to access camera/microphone");
        console.error("Media error:", error);
      }
    };

    setupMedia();

    // Fetch call details
    const fetchCallDetails = async () => {
      if (!roomId) return;
      
      const { data: call } = await supabase
        .from("video_calls")
        .select("*, conversations(*)")
        .eq("room_id", roomId)
        .single();

      if (call && user) {
        const otherUserId = call.conversations?.doctor_id === user.id 
          ? call.conversations?.patient_id 
          : call.conversations?.doctor_id;
        
        if (otherUserId) {
          const { data: otherProfile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", otherUserId)
            .single();
          
          setOtherUserName(otherProfile?.full_name || null);
        }
      }
    };

    fetchCallDetails();

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [roomId, user]);

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    // Update call status in database
    if (roomId) {
      await supabase
        .from("video_calls")
        .update({ 
          status: "ended",
          ended_at: new Date().toISOString()
        })
        .eq("room_id", roomId);
    }
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    
    navigate(-1);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">PulsePoint</span>
        </div>
        
        <div className="flex items-center gap-3">
          {!isConnecting && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              {formatDuration(callDuration)}
            </span>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-muted/30 p-4 flex items-center justify-center">
        {isConnecting ? (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Connecting...
              </h2>
              <p className="text-muted-foreground">
                Setting up your video call
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Remote Video (Main) */}
            <div className="w-full h-full max-w-4xl max-h-[70vh] rounded-2xl bg-card border overflow-hidden flex items-center justify-center">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover hidden"
              />
              {/* Placeholder for remote video - in a real app this would show the other person */}
              <div className="text-center p-8">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                    {getInitials(otherUserName)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {otherUserName || "Waiting for connection..."}
                </h3>
                <p className="text-muted-foreground">
                  Video call in progress
                </p>
              </div>
            </div>

            {/* Local Video (Picture-in-picture) */}
            <Card className="absolute bottom-6 right-6 w-40 h-28 sm:w-48 sm:h-36 overflow-hidden shadow-lg">
              <CardContent className="p-0 h-full">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "w-full h-full object-cover",
                    isVideoOff && "hidden"
                  )}
                />
                {isVideoOff && (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="bg-card/80 backdrop-blur-sm border-t p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "w-14 h-14 rounded-full",
              isMuted && "bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20"
            )}
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className={cn(
              "w-14 h-14 rounded-full",
              isVideoOff && "bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20"
            )}
            onClick={toggleVideo}
          >
            {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
          </Button>

          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90"
            onClick={endCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={() => navigate(-1)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
