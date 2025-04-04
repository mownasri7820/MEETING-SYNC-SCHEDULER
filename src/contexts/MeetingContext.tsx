
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface Participant {
  email: string;
  name: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  participants: Participant[];
  location: string;
  reminderTime: string;
  createdBy: string;
}

interface MeetingContextType {
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, "id">) => void;
  updateMeeting: (id: string, meeting: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  getUpcomingMeetings: () => Meeting[];
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const useMeetings = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error("useMeetings must be used within a MeetingProvider");
  }
  return context;
};

export const MeetingProvider = ({ children }: { children: React.ReactNode }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const { toast } = useToast();

  // Load meetings from localStorage
  useEffect(() => {
    const storedMeetings = localStorage.getItem("meetings");
    if (storedMeetings) {
      setMeetings(JSON.parse(storedMeetings));
    }
  }, []);

  // Save meetings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  const addMeeting = (meetingData: Omit<Meeting, "id">) => {
    const newMeeting = {
      ...meetingData,
      id: `meeting-${Date.now()}`,
    };
    
    setMeetings((prev) => [...prev, newMeeting]);
    
    toast({
      title: "Meeting scheduled",
      description: `"${newMeeting.title}" has been scheduled for ${newMeeting.date}`,
    });
  };

  const updateMeeting = (id: string, meetingData: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id ? { ...meeting, ...meetingData } : meeting
      )
    );
    
    toast({
      title: "Meeting updated",
      description: "The meeting details have been updated",
    });
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));
    
    toast({
      title: "Meeting deleted",
      description: "The meeting has been removed from your schedule",
    });
  };

  const getUpcomingMeetings = () => {
    const today = new Date();
    return meetings
      .filter((meeting) => {
        const meetingDate = new Date(meeting.date);
        return meetingDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      });
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        getUpcomingMeetings,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
