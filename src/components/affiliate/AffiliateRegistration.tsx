
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type AffiliateRegistrationProps = {
  onRegister: (name: string, email: string) => Promise<any>;
  isLoading: boolean;
};

const AffiliateRegistration = ({ onRegister, isLoading }: AffiliateRegistrationProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onRegister(values.name, values.email);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Join Our Affiliate Program</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Benefits:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Earn 25% commission on completed projects</li>
          <li>Track referrals and earnings in real-time</li>
          <li>Option to resell our services at your own price</li>
          <li>No cap on earnings potential</li>
        </ul>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
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
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Join Affiliate Program"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AffiliateRegistration;
