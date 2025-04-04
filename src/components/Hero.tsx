
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-brand-600/5 -z-10" />
      
      {/* Floating shapes for visual interest */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-200 rounded-full blur-3xl opacity-20 animate-pulse-slow -z-10" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-secondary rounded-full blur-3xl opacity-10 animate-pulse-slow -z-10" />
      
      <div className="container px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center animate-fade-in">
            Streamline Your Professional Meetings
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-center text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
            MeetSync helps busy professionals schedule, manage, and never miss important meetings. Save time and boost productivity with intelligent reminders.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:400ms]">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in [animation-delay:600ms]">
            {[
              {
                icon: <CalendarDays className="h-10 w-10 text-brand-600" />,
                title: "Smart Scheduling",
                description: "Create and manage meetings with a few clicks. Set time, location, and participants easily."
              },
              {
                icon: <CheckCircle2 className="h-10 w-10 text-brand-600" />,
                title: "Timely Reminders",
                description: "Never miss a meeting with customized reminders. Set when and how you want to be notified."
              },
              {
                icon: <CalendarDays className="h-10 w-10 text-brand-600" />,
                title: "Collaborative Planning",
                description: "Invite participants, share details, and keep everyone on the same page."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-accent transition-colors duration-300">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
