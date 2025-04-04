
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(name, email, password);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CalendarDays className="h-12 w-12 text-brand-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-brand-600 hover:text-brand-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a MeetSync account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted-foreground/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-muted/30 px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full bg-card">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.0003 4.80002C13.6003 4.80002 15.0003 5.40002 16.0003 6.40002L19.6003 2.80002C17.6003 1.20002 15.0003 0 12.0003 0C7.60026 0 3.80026 2.40002 1.60026 6.00002L5.60026 9.20002C6.80026 6.60002 9.20026 4.80002 12.0003 4.80002Z" fill="#EA4335"/>
                <path d="M23.2003 12.2C23.2003 11.4 23.2003 10.6 23.0003 10H12.0003V14.6H18.2003C18.0003 16 17.2003 17.2 16.0003 18L19.8003 21C22.0003 19 23.2003 15.8 23.2003 12.2Z" fill="#4285F4"/>
                <path d="M5.40026 14.5998L1.40026 17.7998C3.60026 21.3998 7.40026 23.7998 11.8003 23.7998C14.8003 23.7998 17.4003 22.7998 19.4003 20.9998L15.6003 17.9998C14.6003 18.5998 13.4003 18.9998 12.0003 18.9998C9.20026 18.9998 6.80026 17.1998 5.60026 14.5998H5.40026Z" fill="#34A853"/>
                <path d="M5.60026 14.6C5.40026 13.8 5.20026 13 5.20026 12C5.20026 11 5.40026 10.2 5.60026 9.40002L1.60026 6.20001C0.800262 7.80001 0.200262 9.60002 0.200262 12C0.200262 14.4 0.600262 16.6 1.60026 18.4L5.60026 14.6Z" fill="#FBBC05"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full bg-card">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5003 1.20001C10.1003 1.20001 8.50026 2.80001 7.40026 5.30001C7.80026 5.30001 12.1003 5.30001 12.1003 5.30001C12.1003 5.30001 12.1003 5.30001 12.1003 5.30001C12.1003 5.30001 12.1003 5.30001 12.1003 5.30001C14.5003 5.30001 16.4003 7.30001 16.4003 9.70001C16.4003 12.1 14.4003 14.1 12.0003 14.1H7.40026C7.00026 14.9 6.70026 15.8 6.60026 16.7C6.40026 18.5 6.90026 20.2 8.00026 21.5C9.00026 22.8 10.6003 23.5 12.5003 23.5C16.8003 23.5 20.4003 20.5 21.4003 16.3L13.5003 1.20001Z" fill="#0070F3"/>
              </svg>
              Microsoft
            </Button>
          </div>

          <p className="mt-8 text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="font-medium text-brand-600 hover:text-brand-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-medium text-brand-600 hover:text-brand-500">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
