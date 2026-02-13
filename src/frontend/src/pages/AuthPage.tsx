import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InterestsCheckboxGroup from '@/components/auth/InterestsCheckboxGroup';
import { INTERESTS } from '@/constants/interests';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState<string>('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loginEmail) newErrors.email = 'Email is required';
    if (!loginPassword) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setMessage('Login functionality is not yet implemented. This is a UI-only preview.');
    console.log('Login attempt:', { email: loginEmail, password: loginPassword });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!registerFirstName) newErrors.firstName = 'First name is required';
    if (!registerLastName) newErrors.lastName = 'Last name is required';
    if (!registerEmail) newErrors.email = 'Email is required';
    if (!registerPassword) newErrors.password = 'Password is required';
    if (!registerConfirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setMessage('Registration functionality is not yet implemented. This is a UI-only preview.');
    console.log('Registration attempt:', {
      firstName: registerFirstName,
      lastName: registerLastName,
      email: registerEmail,
      password: registerPassword,
      interests: selectedInterests,
    });
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-8 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to SPEAKR</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {message && activeTab === 'login' && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-first-name">First Name</Label>
                    <Input
                      id="register-first-name"
                      type="text"
                      placeholder="John"
                      value={registerFirstName}
                      onChange={(e) => setRegisterFirstName(e.target.value)}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-last-name">Last Name</Label>
                    <Input
                      id="register-last-name"
                      type="text"
                      placeholder="Doe"
                      value={registerLastName}
                      onChange={(e) => setRegisterLastName(e.target.value)}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Interests</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select topics you're interested in (optional)
                  </p>
                  <InterestsCheckboxGroup
                    interests={INTERESTS}
                    selectedInterests={selectedInterests}
                    onChange={setSelectedInterests}
                  />
                </div>

                {message && activeTab === 'register' && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
