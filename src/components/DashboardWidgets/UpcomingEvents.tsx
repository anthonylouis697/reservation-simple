
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data for upcoming events
const events = [
  {
    id: "1",
    title: "Atelier de groupe",
    date: "2025-05-20",
    time: "14:00 - 16:00",
    participants: 8,
    maxParticipants: 12,
    type: "workshop"
  },
  {
    id: "2",
    title: "Cours collectif",
    date: "2025-05-23",
    time: "10:00 - 11:30",
    participants: 5,
    maxParticipants: 15,
    type: "course"
  }
];

export const UpcomingEvents = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Événements à venir</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/events")}>
            Voir tous
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Aucun événement à venir</p>
            <Button variant="link" onClick={() => navigate("/events/new")}>
              Planifier un événement
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{event.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {event.type === "workshop" ? "Atelier" : "Cours"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("fr-FR")} • {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm">
                      {event.participants}/{event.maxParticipants}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event.id}`)}>
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
