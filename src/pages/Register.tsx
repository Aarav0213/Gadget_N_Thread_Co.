import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    
    try {
      // 1️⃣ Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: data.fullName },
        },
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('already')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(signUpError.message);
        }
        return;
      }

      // 2️⃣ Verify we got a user ID
      const userId = signUpData.user?.id;
      
      if (!userId) {
        throw new Error('User ID not returned after signup');
      }

      // 3️⃣ Upsert profile (handles both insert and update)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            email: data.email,
            full_name: data.fullName,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (profileError) {
        console.error('Profile upsert error:', profileError);
        throw new Error('Failed to create user profile');
      }

      // 4️⃣ Upsert user role (no need to check if exists first!)
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert(
          {
            user_id: userId,
            role: 'customer',
            created_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (roleError) {
        console.error('User role upsert error:', roleError);
        // Don't throw here - account is created, just log the issue
        toast.warning('Account created, but there was an issue assigning the role. Please contact support if you experience any issues.');
      } else {
        toast.success('Account created successfully! You can now log in.');
      }

      navigate('/login');
      
    } catch (err: any) {
      console.error('Signup failed:', err);
      toast.error(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join us for exclusive offers and easy checkout
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
