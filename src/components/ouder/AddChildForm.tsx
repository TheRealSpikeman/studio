// src/components/ouder/AddChildForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Users, School, Mail, Info, Cake } from "lucide-react"; // Added Cake

const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders"];
const NOT_SPECIFIED_VALUE = "_NOT_SPECIFIED_";
const childAgeOptions = Array.from({ length: (20 - 10) + 1 }, (_, i) => (i + 10).toString());

const addChildFormSchema = z.object({
  firstName: z.string().min(2, { message: "Voornaam moet minimaal 2 tekens bevatten." }),
  lastName: z.string().min(2, { message: "Achternaam moet minimaal 2 tekens bevatten." }),
  age: z.string().min(1, { message: "Selecteer een leeftijd." }),
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
      age: undefined,
      childEmail: "",
      schoolType: "",
      className: "",
    },
  });

  function onSubmit(values: AddChildFormData) {
    const dataToSave = {
      ...values,
      schoolType: values.schoolType === NOT_SPECIFIED_VALUE ? "" : values.schoolType,
    };
    onSave(dataToSave);
  }

  return (
    <Card className="w-full shadow-xl">
        <CardHeader>
            <CardTitle>Kindgegevens Invoeren</CardTitle>
            <CardDescription>
                Voer de gegevens van uw kind in. Na het opslaan ontvangt het kind een uitnodiging om het eigen account te activeren en te koppelen.
                Deze informatie helpt ons ook bij het selecteren van de juiste quizzen en, indien van toepassing, de meest geschikte tutor.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
                <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Leeftijd kind</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="pl-10">
                            <Cake className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <SelectValue placeholder="Selecteer leeftijd" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {childAgeOptions.map(age => (
                            <SelectItem key={age} value={age}>{age} jaar</SelectItem>
                        ))}
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
                    <FormDescription className="flex items-center gap-1 text-xs pt-1">
                        <Info className="h-3 w-3"/> Het kind ontvangt hierop een uitnodiging om het account te activeren.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="schoolType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Type school</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""} >
                            <FormControl>
                            <SelectTrigger className="pl-10">
                                <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <SelectValue placeholder="Selecteer schooltype" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {schoolTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            <SelectItem value={NOT_SPECIFIED_VALUE}>Niet opgegeven / Anders</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-xs pt-1">
                            Helpt ons bij het vinden van passende tutors.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="className"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Klas</FormLabel>
                        <div className="relative">
                            <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <FormControl>
                            <Input placeholder="Bijv. 3A, VWO 5" {...field} className="pl-10" />
                            </FormControl>
                        </div>
                         <FormDescription className="text-xs pt-1">
                           Optioneel, voor specifieke tutor matching.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <CardFooter className="flex justify-end gap-2 pt-8 px-0 pb-0">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Annuleren
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        Kind Opslaan & Uitnodigen
                    </Button>
                </CardFooter>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
