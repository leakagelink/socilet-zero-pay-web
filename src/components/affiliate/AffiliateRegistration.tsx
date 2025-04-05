
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgePercent, Store, DollarSign, Loader2 } from "lucide-react";

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
    <Card className="max-w-md w-full mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Join Our Affiliate Program</CardTitle>
        <CardDescription>
          Earn money by referring clients to our services
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <BadgePercent className="h-5 w-5 text-blue-600" /> Program Benefits
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 mt-0.5 text-blue-600" />
                <span>Earn 25% commission on every completed project</span>
              </li>
              <li className="flex items-start gap-2">
                <Store className="h-4 w-4 mt-0.5 text-blue-600" />
                <span>Option to resell our services at your own price</span>
              </li>
              <li className="flex items-start gap-2">
                <BadgePercent className="h-4 w-4 mt-0.5 text-blue-600" />
                <span>No cap on earnings - refer unlimited clients</span>
              </li>
            </ul>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : "Join Affiliate Program"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
      
      <CardFooter className="text-center text-sm text-muted-foreground">
        By joining, you agree to our affiliate program terms and conditions.
      </CardFooter>
    </Card>
  );
};

export default AffiliateRegistration;
