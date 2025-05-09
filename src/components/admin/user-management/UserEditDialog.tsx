// src/components/admin/user-management/UserEditDialog.tsx
"use client";

import type { User, UserRole, UserStatus } from '@/types/user';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale'; // Added import for nl locale
import { CalendarIcon, UserCircle, Settings, ShieldCheck, ImageUp } from 'lucide-react'; // Added icons
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const userFormSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 tekens bevatten."),
  email: z.string().email("Ongeldig e-mailadres."),
  status: z.enum(['actief', 'niet geverifieerd', 'geblokkeerd']),
  role: z.enum(['admin', 'coach', 'deelnemer']),
  avatarUrl: z.string().url("Ongeldige URL voor avatar.").optional().or(z.literal('')),
  coaching_startDate: z.date().optional(),
  coaching_interval: z.coerce.number().int().positive("Interval moet een positief getal zijn.").optional().or(z.literal(0)),
  coaching_currentDayInFlow: z.coerce.number().int().positive("Dag in flow moet een positief getal zijn.").optional().or(z.literal(0)),
  password: z.string().optional().or(z.literal('')), // Keep optional for edit, empty if not changing
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine(data => {
    if (data.password && data.password.length > 0 && data.password.length < 8) return false; // Password must be at least 8 chars if provided
    return true;
  }, {
    message: "Wachtwoord moet minimaal 8 tekens zijn.",
    path: ["password"],
  })
  .refine(data => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen.",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserEditDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
  isAddingNewUser: boolean;
  onSave: (data: User) => void;
}

export function UserEditDialog({ isOpen, onOpenChange, user, isAddingNewUser, onSave }: UserEditDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'niet geverifieerd',
      role: 'deelnemer',
      avatarUrl: '',
      coaching_interval: 0,
      coaching_currentDayInFlow: 0,
      password: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    if (user && !isAddingNewUser) {
      reset({
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        avatarUrl: user.avatarUrl || '',
        coaching_startDate: user.coaching?.startDate ? parseISO(user.coaching.startDate) : undefined,
        coaching_interval: user.coaching?.interval || 0,
        coaching_currentDayInFlow: user.coaching?.currentDayInFlow || 0,
        password: '',
        confirmPassword: '',
      });
    } else {
      reset({ // Default for new user
        name: '',
        email: '',
        status: 'niet geverifieerd',
        role: 'deelnemer',
        avatarUrl: '',
        coaching_startDate: undefined,
        coaching_interval: 0,
        coaching_currentDayInFlow: 0,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, isAddingNewUser, reset, isOpen]);

  const onSubmit = (data: UserFormData) => {
    const processedData: Partial<User> & Pick<User, 'name' | 'email' | 'status' | 'role'> = {
      name: data.name,
      email: data.email,
      status: data.status,
      role: data.role,
      avatarUrl: data.avatarUrl || undefined,
      coaching: {
        startDate: data.coaching_startDate ? data.coaching_startDate.toISOString() : undefined,
        interval: data.coaching_interval && data.coaching_interval > 0 ? data.coaching_interval : undefined,
        currentDayInFlow: data.coaching_currentDayInFlow && data.coaching_currentDayInFlow > 0 ? data.coaching_currentDayInFlow : undefined,
      }
    };
    // Password handling would be more complex, e.g. only send if changed
    // For now, this simplified onSave expects a User-like object.
    onSave(processedData as User);
  };

  const getInitials = (name?: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isAddingNewUser ? 'Nieuwe Gebruiker Toevoegen' : 'Gebruiker Bewerken'}</DialogTitle>
          {!isAddingNewUser && user && <DialogDescription>ID: {user.id} | Aangemaakt: {user.createdAt ? format(new Date(user.createdAt), 'Pp', { locale: nl }) : 'N/A'}</DialogDescription>}
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto space-y-4 pr-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile"><UserCircle className="mr-1 h-4 w-4 inline-block" />Profiel</TabsTrigger>
              <TabsTrigger value="permissions"><ShieldCheck className="mr-1 h-4 w-4 inline-block" />Rollen</TabsTrigger>
              <TabsTrigger value="coaching"><Settings className="mr-1 h-4 w-4 inline-block" />Coaching</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatarUrl || ''} data-ai-hint="user avatar"/>
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                {/* Basic avatar URL input for now. File upload would be more complex. */}
                 <div className="w-full space-y-1">
                    <Label htmlFor="avatarUrl">Avatar URL (optioneel)</Label>
                    <div className="relative">
                         <ImageUp className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                         <Input id="avatarUrl" {...register("avatarUrl")} placeholder="https://example.com/avatar.png" className="pl-10"/>
                    </div>
                    {errors.avatarUrl && <p className="text-sm text-destructive">{errors.avatarUrl.message}</p>}
                 </div>
              </div>
              <div>
                <Label htmlFor="name">Naam</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register("email")} disabled={!isAddingNewUser} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                {!isAddingNewUser && <p className="text-xs text-muted-foreground">E-mail kan niet gewijzigd worden voor bestaande gebruikers.</p>}
              </div>
              {(isAddingNewUser || (user && user.status !== 'actief')) && ( // Only show password for new users or if account is not active
                 <>
                    <div>
                        <Label htmlFor="password">Wachtwoord {isAddingNewUser ? '' : '(leeg laten om niet te wijzigen)'}</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Bevestig Wachtwoord</Label>
                        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                    </div>
                 </>
              )}
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 pt-2">
              <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="status"><SelectValue placeholder="Selecteer status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actief">Actief</SelectItem>
                        <SelectItem value="niet geverifieerd">Niet Geverifieerd</SelectItem>
                        <SelectItem value="geblokkeerd">Geblokkeerd</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                 <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="role"><SelectValue placeholder="Selecteer rol" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                        <SelectItem value="deelnemer">Deelnemer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              </div>
            </TabsContent>

            <TabsContent value="coaching" className="space-y-4 pt-2">
              <div>
                <Label htmlFor="coaching_startDate">Startdatum Coaching (optioneel)</Label>
                 <Controller
                    name="coaching_startDate"
                    control={control}
                    render={({ field }) => (
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", {locale: nl }) : <span>Kies een datum</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                    )}
                    />
                {errors.coaching_startDate && <p className="text-sm text-destructive">{errors.coaching_startDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="coaching_interval">Coaching Interval (dagen, optioneel)</Label>
                <Input id="coaching_interval" type="number" {...register("coaching_interval")} />
                {errors.coaching_interval && <p className="text-sm text-destructive">{errors.coaching_interval.message}</p>}
              </div>
              <div>
                <Label htmlFor="coaching_currentDayInFlow">Huidige Dag in Coaching Flow (optioneel)</Label>
                <Input id="coaching_currentDayInFlow" type="number" {...register("coaching_currentDayInFlow")} />
                {errors.coaching_currentDayInFlow && <p className="text-sm text-destructive">{errors.coaching_currentDayInFlow.message}</p>}
              </div>
            </TabsContent>
          </Tabs>
        </form>
        <DialogFooter className="pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Annuleren</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>Opslaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
