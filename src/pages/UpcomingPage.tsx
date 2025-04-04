
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMeetings } from "@/contexts/MeetingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MeetingCard from "@/components/MeetingCard";
import { Calendar as CalendarIcon, CalendarPlus, Loader2, Search } from "lucide-react";
import { format, parseISO } from "date-fns";

const UpcomingPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { getUpcomingMeetings } = useMeetings();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeetings, setFilteredMeetings] = useState(getUpcomingMeetings());
  
  useEffect(() => {
    // Redirect to sign in if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      navigate("/signin");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  useEffect(() => {
    const upcomingMeetings = getUpcomingMeetings();
    
    if (searchTerm.trim() === "") {
      setFilteredMeetings(upcomingMeetings);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = upcomingMeetings.filter(
        (meeting) =>
          meeting.title.toLowerCase().includes(term) ||
          meeting.description.toLowerCase().includes(term) ||
          meeting.location.toLowerCase().includes(term) ||
          meeting.participants.some(
            (p) => p.name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term)
          )
      );
      setFilteredMeetings(filtered);
    }
  }, [searchTerm, getUpcomingMeetings]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }
  
  // Group meetings by date
  const meetingsByDate = filteredMeetings.reduce((acc, meeting) => {
    const date = meeting.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meeting);
    return acc;
  }, {} as Record<string, typeof filteredMeetings>);
  
  // Sort dates
  const sortedDates = Object.keys(meetingsByDate).sort(
    (a, b) => parseISO(a).getTime() - parseISO(b).getTime()
  );
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Upcoming Meetings</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your scheduled meetings
            </p>
          </div>
          <Button onClick={() => navigate("/schedule")}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule New Meeting
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search meetings by title, description, or participants..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Meeting List */}
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
            <p className="mt-1 text-muted-foreground">
              {searchTerm
                ? "No meetings match your search criteria"
                : "You don't have any upcoming meetings scheduled"}
            </p>
            <Button
              onClick={() => navigate("/schedule")}
              className="mt-6"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <div key={date}>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-brand-600" />
                  {format(parseISO(date), "EEEE, MMMM do, yyyy")}
                  <span className="ml-2 text-sm text-muted-foreground font-normal">
                    ({meetingsByDate[date].length} meeting{meetingsByDate[date].length > 1 ? "s" : ""})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {meetingsByDate[date].map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingPage;
