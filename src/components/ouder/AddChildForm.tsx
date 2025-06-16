// src/components/ouder/AddChildForm.tsx
"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Users, School, Mail } from "lucide-react";

const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders"];

const addChildFormSchema = z.object({
  firstName: z.string().min(2, { message: "Voornaam moet minimaal 2 tekens bevatten." }),
  lastName: z.string().min(2, { message: "Achternaam moet minimaal 2 tekens bevatten." }),
  ageGroup: z.enum(['12-14 jaar', '15-18 jaar'], {
    required_error: "Selecteer een leeftijdsgroep.",
  }),
  childEmail: z.string().email({ message: "Voer een geldig e-mailadres voor het kind in." }),
  schoolType: z.string().optional(),
  className: z.string().optional(),
});

export type AddChildFormData = z.infer<typeof addChildFormSchema>;

interface AddChildFormProps {
  onSave: (data: AddChildFormData) => void;
  onCancel: () => void;
}

export function AddChildForm({ onSave, onCancel }: AddChildFormProps) {
  const form = useForm<AddChildFormData>({
    resolver: zodResolver(addChildFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ageGroup: undefined,
      childEmail: "",
      schoolType: "",
      className: "",
    },
  });

  function onSubmit(values: AddChildFormData) {
    onSave(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voornaam kind</FormLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="Sofie" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achternaam kind</FormLabel>
               <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="de Tester" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ageGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leeftijdsgroep</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="pl-10">
                     <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <SelectValue placeholder="Selecteer leeftijdsgroep" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="12-14 jaar">12-14 jaar</SelectItem>
                  <SelectItem value="15-18 jaar">15-18 jaar</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="childEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mailadres kind (voor account activatie)</FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <FormControl>
                  <Input type="email" placeholder="kind@email.com" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="schoolType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type school (optioneel)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="pl-10">
                    <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <SelectValue placeholder="Selecteer schooltype" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schoolTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  <SelectItem value="">Niet opgegeven</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="className"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Klas (optioneel)</FormLabel>
              <div className="relative">
                {/* Consider a more specific icon if available, e.g., ClipboardList or Users for class */}
                <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="Bijv. 3A, VWO 5" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuleren
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Kind Opslaan & Uitnodigen
          </Button>
        </div>
      </form>
    </Form>
  );
}
