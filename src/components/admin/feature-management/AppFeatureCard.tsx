"use client";

import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, UserPlus, Settings, BarChart3, CreditCard, Edit, Mail, School, Info, Cake, GraduationCap, Trash2, TrendingUp, Target, Users, Share2, Link2, HelpCircle, Sparkles, Star, CheckCircle2, ExternalLink, ScrollText, Compass, Percent, ListChecks, XCircle, Package, FileText as FileTextIcon } from 'lucide-react'; // Renamed FileText to FileTextIcon
import { useToast } from "@/hooks/use-toast";

const featureSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    adminOnly: z.boolean().optional(),
});
export type AppFeature = z.infer<typeof featureSchema>;

interface FeatureCardProps {
    feature: AppFeature;
    onSave: (updatedFeature: AppFeature) => void;
    onCancel: () => void;
}

export function AppFeatureCard({ feature, onSave, onCancel }: FeatureCardProps) {
    const form = useForm<AppFeature>({
        resolver: zodResolver(featureSchema),
        defaultValues: feature,
        mode: "onChange"
    });

    const { handleSubmit } = form;

    const onSubmit = (data: AppFeature) => {
        onSave(data);
    };

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Feature Bewerken</CardTitle>
                <CardDescription>Bewerk de details van deze feature.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Label" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Beschrijving</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Beschrijving" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="adminOnly"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Alleen voor admins</FormLabel>
                                        <FormDescription>Is deze feature alleen voor admins?</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="ghost" onClick={onCancel}>
                                Annuleren
                            </Button>
                            <Button type="submit">
                                Opslaan
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
