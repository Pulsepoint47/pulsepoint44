import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Patients", value: "128", icon: Users, change: "+12%" },
  { label: "Appointments Today", value: "8", icon: Calendar, change: "+3" },
  { label: "Avg. Wait Time", value: "12 min", icon: Clock, change: "-2 min" },
  { label: "Satisfaction", value: "4.8/5", icon: TrendingUp, change: "+0.2" },
];

const appointments = [
  { patient: "Sarah Johnson", time: "9:00 AM", type: "Follow-up", status: "confirmed" },
  { patient: "Mike Chen", time: "10:30 AM", type: "Consultation", status: "confirmed" },
  { patient: "Emily Davis", time: "11:00 AM", type: "Check-up", status: "pending" },
  { patient: "Robert Wilson", time: "2:00 PM", type: "Lab Review", status: "confirmed" },
  { patient: "Lisa Anderson", time: "3:30 PM", type: "Follow-up", status: "pending" },
];

const statusColor = (s: string) => s === "confirmed" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground";

const DoctorDashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back, Dr. Smith</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="h-5 w-5 text-primary" />
                <span className="text-xs text-primary font-medium">{s.change}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.patient + a.time} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">{a.patient}</p>
                  <p className="text-sm text-muted-foreground">{a.time} · {a.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColor(a.status)}>{a.status}</Badge>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default DoctorDashboard;
