
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMeetings } from "@/contexts/MeetingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MeetingCard from "@/components/MeetingCard";
import { CalendarPlus, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { getUpcomingMeetings } = useMeetings();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to sign in if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      navigate("/signin");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const upcomingMeetings = getUpcomingMeetings();
  const todayMeetings = upcomingMeetings.filter(
    (meeting) => meeting.date === format(new Date(), "yyyy-MM-dd")
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's your meeting schedule for today and upcoming appointments
          </p>
        </div>

        {/* Dashboard Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => navigate("/schedule")}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule New Meeting
          </Button>
          <Button variant="outline" onClick={() => navigate("/upcoming")}>
            <Clock className="mr-2 h-4 w-4" />
            View All Meetings
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Meetings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-brand-600" />
                Today's Meetings
              </CardTitle>
              <CardDescription>
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No meetings scheduled for today.</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/schedule")}
                    className="mt-2"
                  >
                    Schedule one now
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>At a Glance</CardTitle>
              <CardDescription>Your meeting statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today</p>
                    <p className="text-2xl font-bold">{todayMeetings.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold">{upcomingMeetings.length - todayMeetings.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <CalendarPlus className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <CalendarPlus className="h-6 w-6 text-brand-600" />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate("/schedule")}
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  New Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Meetings Preview */}
          <Card className="lg:col-span-3 mt-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarPlus className="mr-2 h-5 w-5 text-brand-600" />
                Upcoming Meetings
              </CardTitle>
              <CardDescription>
                Your next {Math.min(3, upcomingMeetings.length - todayMeetings.length)} upcoming meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length - todayMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming meetings scheduled.</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/schedule")}
                    className="mt-2"
                  >
                    Schedule one now
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingMeetings
                      .filter((meeting) => meeting.date !== format(new Date(), "yyyy-MM-dd"))
                      .slice(0, 3)
                      .map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                      ))}
                  </div>
                  
                  {upcomingMeetings.length - todayMeetings.length > 3 && (
                    <div className="mt-6 text-center">
                      <Button variant="link" onClick={() => navigate("/upcoming")}>
                        View all upcoming meetings
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
