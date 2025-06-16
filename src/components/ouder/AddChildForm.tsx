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
import { User, Users } from "lucide-react";

const addChildFormSchema = z.object({
  firstName: z.string().min(2, { message: "Voornaam moet minimaal 2 tekens bevatten." }),
  lastName: z.string().min(2, { message: "Achternaam moet minimaal 2 tekens bevatten." }),
  ageGroup: z.enum(['12-14 jaar', '15-18 jaar'], {
    required_error: "Selecteer een leeftijdsgroep.",
  }),
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
    },
  });

  function onSubmit(values: AddChildFormData) {
    onSave(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
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
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuleren
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Kind Opslaan
          </Button>
        </div>
      </form>
    </Form>
  );
}
