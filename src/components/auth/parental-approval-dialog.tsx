
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Mail, User } from "lucide-react";

const parentApprovalSchema = z.object({
  parentName: z.string().min(2, { message: "Naam van ouder/verzorger is vereist." }),
  parentEmail: z.string().email({ message: "Voer een geldig e-mailadres in." }),
});

type ParentApprovalFormData = z.infer<typeof parentApprovalSchema>;

interface ParentalApprovalDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  planName: string;
}

export function ParentalApprovalDialog({ isOpen, onOpenChange, planName }: ParentalApprovalDialogProps) {
  const { toast } = useToast();
  const form = useForm<ParentApprovalFormData>({
    resolver: zodResolver(parentApprovalSchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
    },
  });

  const onSubmit = (values: ParentApprovalFormData) => {
    // TODO: Implement actual backend logic to send email to parent
    console.log("Parental approval form submitted:", values, "for plan:", planName);
    toast({
      title: "Verzoek verzonden",
      description: `Een betalingsverzoek voor ${planName} is naar ${values.parentEmail} gestuurd. Vraag je ouder/verzorger om hun e-mail te controleren.`,
      duration: 5000,
    });
    form.reset();
    onOpenChange(false);
    // TODO: Update user's subscription status to 'pending_parental_approval' in backend/context
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ouderlijke toestemming vereist</DialogTitle>
          <DialogDescription>
            Voor het activeren van het "{planName}" abonnement is toestemming en betaling door een ouder/verzorger nodig. Vul hieronder hun gegevens in.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="parentName">Naam ouder/verzorger</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="parentName"
                placeholder="Volledige naam"
                {...form.register("parentName")}
                className="pl-10"
              />
            </div>
            {form.formState.errors.parentName && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.parentName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="parentEmail">E-mailadres ouder/verzorger</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="parentEmail"
                type="email"
                placeholder="ouder@email.com"
                {...form.register("parentEmail")}
                className="pl-10"
              />
            </div>
            {form.formState.errors.parentEmail && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.parentEmail.message}</p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuleren
              </Button>
            </DialogClose>
            <Button type="submit">
              Verstuur betalingsverzoek
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
