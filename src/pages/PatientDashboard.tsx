import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Thermometer, Droplets } from "lucide-react";

const vitals = [
  { label: "Heart Rate", value: "72 bpm", icon: Heart, status: "Normal" },
  { label: "Blood Pressure", value: "120/80", icon: Activity, status: "Normal" },
  { label: "Temperature", value: "98.6°F", icon: Thermometer, status: "Normal" },
  { label: "Blood Sugar", value: "95 mg/dL", icon: Droplets, status: "Normal" },
];

const upcomingAppointments = [
  { doctor: "Dr. Smith", specialty: "Cardiology", date: "Apr 5, 2026", time: "10:00 AM" },
  { doctor: "Dr. Patel", specialty: "General Practice", date: "Apr 12, 2026", time: "2:30 PM" },
];

const medications = [
  { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", refillDate: "Apr 15" },
  { name: "Metformin", dosage: "500mg", frequency: "Twice daily", refillDate: "Apr 20" },
  { name: "Vitamin D", dosage: "1000 IU", frequency: "Once daily", refillDate: "May 1" },
];

const PatientDashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Patient Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome, Sarah Johnson</p>

      {/* Vitals */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {vitals.map((v) => (
          <Card key={v.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <v.icon className="h-5 w-5 text-primary" />
                <Badge variant="secondary">{v.status}</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{v.value}</p>
              <p className="text-sm text-muted-foreground">{v.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button size="sm">Book New</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.map((a) => (
              <div key={a.doctor + a.date} className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium text-foreground">{a.doctor}</p>
                <p className="text-sm text-muted-foreground">{a.specialty} · {a.date} at {a.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">{m.name} — {m.dosage}</p>
                  <p className="text-sm text-muted-foreground">{m.frequency}</p>
                </div>
                <span className="text-xs text-muted-foreground">Refill: {m.refillDate}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default PatientDashboard;
