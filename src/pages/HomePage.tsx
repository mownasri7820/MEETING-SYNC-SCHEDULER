
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import { CalendarClock, Check, Clock, Users } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Professionals Choose MeetSync</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Designed for busy professionals who need a reliable system to keep track of their important meetings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <CalendarClock className="h-8 w-8 text-brand-600" />,
                title: "One-Click Scheduling",
                description: "Create meetings in seconds with our intuitive interface.",
              },
              {
                icon: <Clock className="h-8 w-8 text-brand-600" />,
                title: "Smart Reminders",
                description: "Get notified exactly when you need, never miss a meeting again.",
              },
              {
                icon: <Users className="h-8 w-8 text-brand-600" />,
                title: "Team Coordination",
                description: "Invite team members and keep everyone in sync.",
              },
              {
                icon: <Check className="h-8 w-8 text-brand-600" />,
                title: "Peace of Mind",
                description: "Focus on what matters with reliable meeting management.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-sm hover-scale">
                <div className="rounded-full bg-brand-50 p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="gradient-bg py-20 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Streamline Your Meetings?</h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Join thousands of professionals who trust MeetSync to organize their busy schedules.
            Get started today for free.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-white text-brand-700 hover:bg-white/90 rounded-full px-8">
              <Link to="/signup">Try MeetSync For Free</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              MeetSync is trusted by professionals across industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "MeetSync has transformed how I manage my daily meetings. The reminders are a game-changer.",
                author: "Sarah Johnson",
                role: "Marketing Director"
              },
              {
                quote: "As a team lead, I need to coordinate multiple meetings every day. MeetSync makes this effortless.",
                author: "Michael Chen",
                role: "Engineering Manager"
              },
              {
                quote: "The simple interface and powerful features make this the perfect tool for busy professionals.",
                author: "Emily Rodriguez",
                role: "HR Consultant"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-accent p-6 rounded-lg">
                <p className="italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
