
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';

// Schema for project submission form
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  projectType: z.string().min(1, { message: "Please select a project type." }),
  description: z.string().min(10, { message: "Please provide a brief description of your project." }),
  budget: z.string().min(1, { message: "Please enter your budget." }),
  timeline: z.string().min(1, { message: "Please select a timeline." }),
});

interface ReferredProjectFormProps {
  referrerId: string;
}

const ReferredProjectForm: React.FC<ReferredProjectFormProps> = ({ referrerId }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      description: "",
      budget: "",
      timeline: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real implementation, this would send the form data to an API endpoint
    console.log("Form values:", values);
    console.log("Referred by:", referrerId);
    
    // For demo, store in localStorage
    const submissions = JSON.parse(localStorage.getItem('projectSubmissions') || '[]');
    submissions.push({
      ...values,
      referrerId,
      status: "Pending",
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('projectSubmissions', JSON.stringify(submissions));
    
    // Show success message
    toast.success("Project submitted successfully! Our team will contact you soon.");
    form.reset();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Project</CardTitle>
        <CardDescription>
          Tell us about your project to get started. We'll get back to you within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="website">Website Development</SelectItem>
                      <SelectItem value="app">App Development</SelectItem>
                      <SelectItem value="both">Website & App Development</SelectItem>
                      <SelectItem value="ai-spokesperson">AI Spokesperson</SelectItem>
                      <SelectItem value="business-profile">Business Profile</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your project requirements..." 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Budget (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your budget" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-2-weeks">1-2 Weeks</SelectItem>
                        <SelectItem value="3-4-weeks">3-4 Weeks</SelectItem>
                        <SelectItem value="1-2-months">1-2 Months</SelectItem>
                        <SelectItem value="3-6-months">3-6 Months</SelectItem>
                        <SelectItem value="not-sure">Not Sure Yet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full">Submit Project</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReferredProjectForm;
