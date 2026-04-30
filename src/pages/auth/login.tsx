import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, LockIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import logo from '@/assets/logo.png';

interface LoginProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-muted/50 to-background p-4 animate-in fade-in duration-700">
      <div className="relative w-full max-w-md">
        {/* Background Decorative Elements */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        
        <Card className="relative overflow-hidden rounded-lg border-border/50 bg-card/50 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-4 flex flex-col items-center pt-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-primary/10 p-2 ring-1 ring-primary/20">
              <img src={logo} alt="Hospi Logo" className="h-full w-full object-contain" />
            </div>
            <div className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
              <CardDescription className="mt-2 text-sm">Please enter your credentials to access Hospi</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground z-10">
                    <HugeiconsIcon icon={UserIcon} size={18} />
                  </div>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    className="pl-10 h-11 rounded-md bg-background/50 focus-visible:ring-offset-2 transition-all duration-200"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground z-10">
                    <HugeiconsIcon icon={LockIcon} size={18} />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-11 rounded-md bg-background/50 focus-visible:ring-offset-2 transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="rounded-md" />
                  <Label htmlFor="remember" className="text-xs font-normal text-muted-foreground">Remember me</Label>
                </div>
                <Button variant="link" className="px-0 text-xs font-medium text-primary hover:no-underline">
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="group relative w-full h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Login to Dashboard</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col pb-8">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Don't have an account? <Button variant="link" className="h-auto p-0 font-semibold text-primary">Contact Administrator</Button>
              </p>
            </div>
          </CardFooter>
          
          {/* Subtle bottom accent */}
          <div className="h-1.5 w-full bg-linear-to-r from-primary/20 via-primary to-primary/20" />
        </Card>
      </div>
    </div>
  );
};
