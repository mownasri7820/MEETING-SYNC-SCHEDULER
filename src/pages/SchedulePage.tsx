
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMeetings, Meeting, Participant } from "@/contexts/MeetingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SchedulePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { meetings, addMeeting, updateMeeting } = useMeetings();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("edit");
  
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    participants: [] as Participant[],
    location: "",
    reminderTime: "15"
  });
  
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: ""
  });
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Redirect to sign in if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      navigate("/signin");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  useEffect(() => {
    // If editing an existing meeting
    if (editId) {
      const meetingToEdit = meetings.find(m => m.id === editId);
      if (meetingToEdit) {
        setIsEditing(true);
        setFormData({
          title: meetingToEdit.title,
          date: meetingToEdit.date,
          startTime: meetingToEdit.startTime,
          endTime: meetingToEdit.endTime,
          description: meetingToEdit.description,
          participants: [...meetingToEdit.participants],
          location: meetingToEdit.location,
          reminderTime: meetingToEdit.reminderTime
        });
        
        if (meetingToEdit.date) {
          setDate(new Date(meetingToEdit.date));
        }
      }
    }
  }, [editId, meetings]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setFormData(prev => ({ 
        ...prev, 
        date: format(newDate, "yyyy-MM-dd")
      }));
    }
  };
  
  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewParticipant(prev => ({ ...prev, [name]: value }));
  };
  
  const addParticipant = () => {
    if (newParticipant.name && newParticipant.email) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, { ...newParticipant }]
      }));
      setNewParticipant({ name: "", email: "" });
    }
  };
  
  const removeParticipant = (email: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.email !== email)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      return;
    }
    
    if (isEditing && editId) {
      updateMeeting(editId, formData);
    } else {
      addMeeting({
        ...formData,
        createdBy: user?.id || "unknown"
      });
    }
    
    navigate("/dashboard");
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Schedule Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Meeting" : "Schedule a New Meeting"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing 
              ? "Update the details of your meeting" 
              : "Fill in the details below to create a new meeting"}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>
              Enter all the information needed for your meeting
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Basic Details</TabsTrigger>
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                  <TabsTrigger value="reminders">Reminders & Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Meeting Title*</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter a title for your meeting"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date*</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time*</Label>
                        <Select 
                          value={formData.startTime} 
                          onValueChange={(value) => handleSelectChange("startTime", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Start Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <SelectItem key={`start-${hour}`} value={`${hour.toString().padStart(2, "0")}:00`}>
                                {hour.toString().padStart(2, "0")}:00
                              </SelectItem>
                            ))}
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <SelectItem key={`start-${hour}-30`} value={`${hour.toString().padStart(2, "0")}:30`}>
                                {hour.toString().padStart(2, "0")}:30
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time*</Label>
                        <Select 
                          value={formData.endTime} 
                          onValueChange={(value) => handleSelectChange("endTime", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="End Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <SelectItem key={`end-${hour}`} value={`${hour.toString().padStart(2, "0")}:00`}>
                                {hour.toString().padStart(2, "0")}:00
                              </SelectItem>
                            ))}
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <SelectItem key={`end-${hour}-30`} value={`${hour.toString().padStart(2, "0")}:30`}>
                                {hour.toString().padStart(2, "0")}:30
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Meeting room, Zoom link, etc."
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter details about the meeting agenda, preparation needed, etc."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="participants" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="participantName">Name</Label>
                      <Input
                        id="participantName"
                        name="name"
                        placeholder="Participant name"
                        value={newParticipant.name}
                        onChange={handleParticipantChange}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="participantEmail">Email</Label>
                      <Input
                        id="participantEmail"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={newParticipant.email}
                        onChange={handleParticipantChange}
                      />
                    </div>
                    
                    <div className="flex items-end md:col-span-1">
                      <Button 
                        type="button"
                        onClick={addParticipant}
                        className="w-full"
                        disabled={!newParticipant.name || !newParticipant.email}
                      >
                        Add Participant
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Participants ({formData.participants.length})</h3>
                    {formData.participants.length === 0 ? (
                      <p className="text-muted-foreground text-sm py-4 text-center">
                        No participants added yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {formData.participants.map((participant, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 px-3 bg-accent rounded-md"
                          >
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-sm text-muted-foreground">{participant.email}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeParticipant(participant.email)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reminders" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminderTime">Reminder Time</Label>
                    <Select 
                      value={formData.reminderTime} 
                      onValueChange={(value) => handleSelectChange("reminderTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="When to send reminder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="10">10 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                        <SelectItem value="120">2 hours before</SelectItem>
                        <SelectItem value="1440">1 day before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-2">Meeting Summary</h3>
                    <div className="bg-accent rounded-md p-4">
                      <p className="font-medium">{formData.title || "No title"}</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Date: {date ? format(date, "EEEE, MMMM do, yyyy") : "No date selected"}</p>
                        <p>Time: {formData.startTime} - {formData.endTime}</p>
                        <p>Location: {formData.location || "Not specified"}</p>
                        <p>Participants: {formData.participants.length}</p>
                        <p>Reminder: {formData.reminderTime} minutes before</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Meeting" : "Schedule Meeting"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SchedulePage;
