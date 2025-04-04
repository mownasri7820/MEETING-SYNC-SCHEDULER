
import { Meeting } from "@/contexts/MeetingContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, Users, AlertCircle, Edit, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMeetings } from "@/contexts/MeetingContext";
import { useNavigate } from "react-router-dom";

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard = ({ meeting }: MeetingCardProps) => {
  const { deleteMeeting } = useMeetings();
  const navigate = useNavigate();
  
  const formattedDate = format(parseISO(meeting.date), "EEEE, MMMM do, yyyy");
  
  const getTimePeriod = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    return hour >= 12 ? "PM" : "AM";
  };
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours) % 12 || 12;
    return `${hour}:${minutes} ${getTimePeriod(time)}`;
  };
  
  // Calculate if the meeting is today
  const isToday = () => {
    const today = new Date();
    const meetingDate = parseISO(meeting.date);
    return (
      today.getDate() === meetingDate.getDate() &&
      today.getMonth() === meetingDate.getMonth() &&
      today.getFullYear() === meetingDate.getFullYear()
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-brand-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{meeting.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
              {formattedDate}
              {isToday() && (
                <Badge className="ml-2 bg-brand-500" variant="default">
                  Today
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</p>
            </div>
          </div>
          
          {meeting.location && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p>{meeting.location}</p>
              </div>
            </div>
          )}
          
          {meeting.participants.length > 0 && (
            <div className="flex items-start">
              <Users className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p>{meeting.participants.length} participants</p>
              </div>
            </div>
          )}
          
          {meeting.reminderTime && (
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p>Reminder: {meeting.reminderTime} minutes before</p>
              </div>
            </div>
          )}
          
          {meeting.description && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm line-clamp-2">{meeting.description}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => navigate(`/schedule?edit=${meeting.id}`)}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the meeting
                "{meeting.title}" scheduled for {formattedDate}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteMeeting(meeting.id)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;
