
// src/components/admin/user-management/UserEditDialog.tsx
"use client";

import type { User, UserRole, UserStatus, AgeGroup } from '@/types/user';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle } from '@/components/ui/card';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Calendar as CalendarIcon, UserRound, Settings, ShieldCheck, ImageUp, CheckCircle2 as CheckCircle, XCircle, Briefcase, Cake, Users, HeartHandshake, ExternalLink } from '@/lib/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ageGroupValues = ["12-15", "16-18", "18+"] as const;
const userRoleValues: [UserRole, ...UserRole[]] = ['admin', 'coach', 'leerling', 'tutor', 'ouder'];

const userFormSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 tekens bevatten."),
  email: z.string().email("Ongeldig e-mailadres."),
  status: z.enum(['actief', 'niet geverifieerd', 'geblokkeerd', 'pending_onboarding', 'pending_approval', 'rejected', 'wacht_op_ouder_goedkeuring']),
  role: z.enum(userRoleValues),
  ageGroup: z.enum(ageGroupValues).optional(),
  avatarUrl: z.string().url("Ongeldige URL voor avatar.").optional().or(z.literal('')),
  coaching_startDate: z.date().optional(),
  coaching_interval: z.coerce.number().int().positive("Interval moet een positief getal zijn.").optional().or(z.literal(0)),
  coaching_currentDayInFlow: z.coerce.number().int().positive("Dag in flow moet een positief getal zijn.").optional().or(z.literal(0)),
  password: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
  tutorDetails_bio: z.string().optional(),
  tutorDetails_subjects: z.array(z.string()).optional(),
  tutorDetails_hourlyRate: z.coerce.number().min(0, "Uurtarief mag niet negatief zijn.").optional(),
  tutorDetails_availability: z.string().optional(),
  tutorDetails_cvUrl: z.string().url("Ongeldige URL voor CV.").optional().or(z.literal('')),
  tutorDetails_vogUrl: z.string().url("Ongeldige URL voor VOG.").optional().or(z.literal('')),
  coachDetails_bio: z.string().optional(),
  coachDetails_specializations: z.array(z.string()).optional(),
  coachDetails_hourlyRate: z.coerce.number().min(0, "Uurtarief mag niet negatief zijn.").optional(),
  coachDetails_availability: z.string().optional(),
  parentId: z.string().optional().or(z.literal('')),
}).refine(data => {
    if (data.password && data.password.length > 0 && data.password.length < 8) return false;
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
  const { toast } = useToast();
  const { register, handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '', email: '', status: 'niet geverifieerd', role: 'leerling', ageGroup: undefined, avatarUrl: '',
      coaching_interval: 0, coaching_currentDayInFlow: 0, password: '', confirmPassword: '',
      tutorDetails_bio: '', tutorDetails_subjects: [], tutorDetails_hourlyRate: undefined,
      tutorDetails_availability: '', tutorDetails_cvUrl: '', tutorDetails_vogUrl: '',
      coachDetails_bio: '', coachDetails_specializations: [], coachDetails_hourlyRate: undefined,
      coachDetails_availability: '',
      parentId: '',
    }
  });

  const currentRole = watch("role");
  const currentStatus = watch("status");
  const isTutorPendingApproval = currentRole === 'tutor' && user?.status === 'pending_approval';

  useEffect(() => {
    if (isOpen) {
      if (user && !isAddingNewUser) {
        reset({
          name: user.name, email: user.email, status: user.status, role: user.role,
          ageGroup: user.ageGroup || undefined,
          avatarUrl: user.avatarUrl || '',
          coaching_startDate: user.coaching?.startDate ? parseISO(user.coaching.startDate) : undefined,
          coaching_interval: user.coaching?.interval || 0,
          coaching_currentDayInFlow: user.coaching?.currentDayInFlow || 0,
          password: '', confirmPassword: '',
          tutorDetails_bio: user.tutorDetails?.bio || '',
          tutorDetails_subjects: user.tutorDetails?.subjects || [],
          tutorDetails_hourlyRate: user.tutorDetails?.hourlyRate ?? undefined,
          tutorDetails_availability: user.tutorDetails?.availability || '',
          tutorDetails_cvUrl: user.tutorDetails?.cvUrl || '',
          tutorDetails_vogUrl: user.tutorDetails?.vogUrl || '',
          coachDetails_bio: user.coachDetails?.bio || '',
          coachDetails_specializations: user.coachDetails?.specializations || [],
          coachDetails_hourlyRate: user.coachDetails?.hourlyRate ?? undefined,
          coachDetails_availability: user.coachDetails?.availability || '',
          parentId: user.parentId || '',
        });
      } else {
        reset({
          name: '', email: '', status: 'niet geverifieerd', role: 'leerling', ageGroup: undefined, avatarUrl: '',
          coaching_startDate: undefined, coaching_interval: 0, coaching_currentDayInFlow: 0,
          password: '', confirmPassword: '',
          tutorDetails_bio: '', tutorDetails_subjects: [], tutorDetails_hourlyRate: undefined,
          tutorDetails_availability: '', tutorDetails_cvUrl: '', tutorDetails_vogUrl: '',
          coachDetails_bio: '', coachDetails_specializations: [], coachDetails_hourlyRate: undefined,
          coachDetails_availability: '',
          parentId: '',
        });
      }
    }
  }, [user, isAddingNewUser, reset, isOpen]);

  const onSubmit = (data: UserFormData) => {
    const processedData: Partial<User> & Pick<User, 'name' | 'email' | 'status' | 'role'> = {
      name: data.name, email: data.email, status: data.status, role: data.role,
      ageGroup: data.role === 'leerling' ? data.ageGroup : undefined,
      avatarUrl: data.avatarUrl || undefined,
      coaching: (data.coaching_startDate || data.coaching_interval || data.coaching_currentDayInFlow) ? {
        startDate: data.coaching_startDate ? data.coaching_startDate.toISOString() : undefined,
        interval: data.coaching_interval && data.coaching_interval > 0 ? data.coaching_interval : undefined,
        currentDayInFlow: data.coaching_currentDayInFlow && data.coaching_currentDayInFlow > 0 ? data.coaching_currentDayInFlow : undefined,
      } : undefined,
      tutorDetails: data.role === 'tutor' ? {
        bio: data.tutorDetails_bio,
        subjects: data.tutorDetails_subjects,
        hourlyRate: data.tutorDetails_hourlyRate,
        availability: data.tutorDetails_availability,
        cvUrl: data.tutorDetails_cvUrl,
        vogUrl: data.tutorDetails_vogUrl,
      } : undefined,
      coachDetails: data.role === 'coach' ? {
        bio: data.coachDetails_bio,
        specializations: data.coachDetails_specializations,
        hourlyRate: data.coachDetails_hourlyRate,
        availability: data.coachDetails_availability,
      } : undefined,
      parentId: data.role === 'leerling' ? (data.parentId || undefined) : undefined,
      children: data.role === 'ouder' ? (user?.children || []) : undefined,
    };
    onSave(processedData as User);
  };

  const handleApproveTutor = () => {
    if (user && user.role === 'tutor' && user.status === 'pending_approval') {
      setValue('status', 'actief');
      handleSubmit(onSubmit)();
    }
  };

  const handleRejectTutor = () => {
     if (user && user.role === 'tutor' && user.status === 'pending_approval') {
      setValue('status', 'rejected');
      handleSubmit(onSubmit)();
    }
  };

  const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isAddingNewUser ? 'Nieuwe Gebruiker Toevoegen' : 'Gebruiker Bewerken'}</DialogTitle>
          {!isAddingNewUser && user && <DialogDescription>ID: {user.id} | Aangemaakt: {user.createdAt ? format(parseISO(user.createdAt), 'Pp', { locale: nl }) : 'N/A'}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto space-y-4 pr-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className={cn("grid w-full grid-cols-3", (currentRole === 'tutor' || currentRole === 'ouder' || currentRole === 'coach') && "md:grid-cols-4")}>
              <TabsTrigger value="profile"><UserRound className="mr-1 h-4 w-4 inline-block" />Profiel</TabsTrigger>
              <TabsTrigger value="permissions"><ShieldCheck className="mr-1 h-4 w-4 inline-block" />Rollen & Status</TabsTrigger>
              {currentRole !== 'ouder' && <TabsTrigger value="coaching"><Settings className="mr-1 h-4 w-4 inline-block" />Coaching</TabsTrigger>}
              {currentRole === 'tutor' && <TabsTrigger value="tutorSpecific"><Briefcase className="mr-1 h-4 w-4 inline-block" />Tutor Details</TabsTrigger>}
              {currentRole === 'coach' && <TabsTrigger value="coachSpecific"><HeartHandshake className="mr-1 h-4 w-4 inline-block" />Coach Details</TabsTrigger>}
              {currentRole === 'ouder' && <TabsTrigger value="parentSpecific"><Users className="mr-1 h-4 w-4 inline-block" />Kinderen</TabsTrigger>}
            </TabsList>

            <TabsContent value="profile" className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={watch("avatarUrl") || undefined} data-ai-hint="user avatar"/>
                  <AvatarFallback>{getInitials(watch("name"))}</AvatarFallback>
                </Avatar>
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
                {!isAddingNewUser && <p className="text-xs text-muted-foreground">E-mail kan niet gewijzigd worden.</p>}
              </div>
              {currentRole === 'leerling' && (
                 <>
                  <div>
                      <Label htmlFor="ageGroup" className="flex items-center gap-1">
                          <Cake className="h-4 w-4 text-muted-foreground"/>
                          Leeftijdsgroep
                      </Label>
                      <Controller
                        name="ageGroup"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <SelectTrigger id="ageGroup" className="mt-1">
                              <SelectValue placeholder="Selecteer leeftijdsgroep" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12-15">12-15 jaar</SelectItem>
                              <SelectItem value="16-18">16-18 jaar</SelectItem>
                              <SelectItem value="18+">Volwassene</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.ageGroup && <p className="text-sm text-destructive">{errors.ageGroup.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="parentId">Gekoppelde Ouder ID (optioneel)</Label>
                      <Input id="parentId" {...register("parentId")} placeholder="ID van ouder account" />
                      {errors.parentId && <p className="text-sm text-destructive">{errors.parentId.message}</p>}
                    </div>
                 </>
              )}
              {(isAddingNewUser || (user && (user.status !== 'actief' && user.status !== 'pending_approval'))) && (
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={isTutorPendingApproval}>
                      <SelectTrigger id="status"><SelectValue placeholder="Selecteer status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actief">Actief</SelectItem>
                        <SelectItem value="niet geverifieerd">Niet Geverifieerd</SelectItem>
                        <SelectItem value="wacht_op_ouder_goedkeuring">Wacht op Ouder Goedkeuring (Leerling)</SelectItem>
                        <SelectItem value="geblokkeerd">Geblokkeerd</SelectItem>
                        {(currentRole === 'tutor' || currentRole === 'coach' || isAddingNewUser) && <SelectItem value="pending_onboarding">Wacht op Onboarding (Tutor/Coach)</SelectItem>}
                        {(currentRole === 'tutor' || currentRole === 'coach' || isAddingNewUser) && <SelectItem value="pending_approval">Wacht op Goedkeuring (Tutor/Coach)</SelectItem>}
                        {(currentRole === 'tutor' || currentRole === 'coach' || isAddingNewUser) && <SelectItem value="rejected">Afgewezen (Tutor/Coach)</SelectItem>}
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
                        <SelectItem value="leerling">Leerling</SelectItem>
                        <SelectItem value="tutor">Tutor</SelectItem>
                        <SelectItem value="ouder">Ouder</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              </div>
            </TabsContent>

            {(currentRole === 'leerling' || currentRole === 'admin') && (
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
            )}

            {currentRole === 'tutor' && (
              <TabsContent value="tutorSpecific" className="space-y-4 pt-2">
                <CardTitle className="text-lg">Tutor Specifieke Informatie</CardTitle>
                <div><Label htmlFor="tutorDetails_bio">Bio/Motivatie:</Label><Textarea id="tutorDetails_bio" {...register("tutorDetails_bio")} readOnly={isTutorPendingApproval && currentStatus === 'pending_approval'} /></div>
                <div><Label htmlFor="tutorDetails_hourlyRate">Uurtarief (€):</Label><Input id="tutorDetails_hourlyRate" type="number" {...register("tutorDetails_hourlyRate")} readOnly={isTutorPendingApproval && currentStatus === 'pending_approval'} /></div>
                <div><Label htmlFor="tutorDetails_availability">Beschikbaarheid:</Label><Textarea id="tutorDetails_availability" {...register("tutorDetails_availability")} readOnly={isTutorPendingApproval && currentStatus === 'pending_approval'} /></div>
                <div>
                    <Label htmlFor="tutorDetails_subjects">Vakken (komma-gescheiden):</Label>
                    <Input id="tutorDetails_subjects" {...register("tutorDetails_subjects", {setValueAs: v => typeof v === 'string' ? v.split(',').map((s:string) => s.trim()).filter(Boolean) : v})} readOnly={isTutorPendingApproval && currentStatus === 'pending_approval'} />
                </div>
                <div>
                    <Label htmlFor="tutorDetails_cvUrl">CV URL:</Label>
                    <Input id="tutorDetails_cvUrl" {...register("tutorDetails_cvUrl")} readOnly={isTutorPendingApproval && currentStatus === 'pending_approval'} />
                    {watch("tutorDetails_cvUrl") && <Button variant="link" asChild className="p-0 h-auto text-xs"><a href={watch("tutorDetails_cvUrl")!} target="_blank" rel="noopener noreferrer">Bekijk CV <ExternalLink className="h-3 w-3 inline-block ml-1"/></a></Button>}
                </div>
                <div>
                    <Label htmlFor="tutorDetails_vogUrl">VOG URL:</Label>
                    <Input id="tutorDetails_vogUrl" {...register("tutorDetails_vogUrl")} readOnly={isTutorPendingApproval && currentStatus === 'pending_approval'} />
                    {watch("tutorDetails_vogUrl") && <Button variant="link" asChild className="p-0 h-auto text-xs"><a href={watch("tutorDetails_vogUrl")!} target="_blank" rel="noopener noreferrer">Bekijk VOG <ExternalLink className="h-3 w-3 inline-block ml-1"/></a></Button>}
                </div>
                 {isTutorPendingApproval && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button onClick={handleApproveTutor} className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="mr-2 h-4 w-4"/> Goedkeuren & Opslaan
                        </Button>
                        <Button onClick={handleRejectTutor} variant="destructive">
                            <XCircle className="mr-2 h-4 w-4"/> Afwijzen & Opslaan
                        </Button>
                    </div>
                )}
              </TabsContent>
            )}
             {currentRole === 'coach' && (
              <TabsContent value="coachSpecific" className="space-y-4 pt-2">
                <CardTitle className="text-lg">Coach Specifieke Informatie</CardTitle>
                 <div><Label htmlFor="coachDetails_bio">Bio/Motivatie:</Label><Textarea id="coachDetails_bio" {...register("coachDetails_bio")} /></div>
                <div><Label htmlFor="coachDetails_hourlyRate">Sessietarief (€):</Label><Input id="coachDetails_hourlyRate" type="number" {...register("coachDetails_hourlyRate")} /></div>
                <div><Label htmlFor="coachDetails_availability">Beschikbaarheid:</Label><Textarea id="coachDetails_availability" {...register("coachDetails_availability")} /></div>
                 <div>
                    <Label htmlFor="coachDetails_specializations">Specialisaties (komma-gescheiden):</Label>
                    <Input id="coachDetails_specializations" {...register("coachDetails_specializations", {setValueAs: v => typeof v === 'string' ? v.split(',').map((s:string) => s.trim()).filter(Boolean) : v})} />
                </div>
              </TabsContent>
            )}
            {currentRole === 'ouder' && (
              <TabsContent value="parentSpecific" className="space-y-4 pt-2">
                <CardTitle className="text-lg">Gekoppelde Kinderen (Ouder)</CardTitle>
                {user?.children && user.children.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {user.children.map(childId => <li key={childId}>Kind ID: {childId} (Details volgen)</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nog geen kinderen gekoppeld aan deze ouder.</p>
                )}
                <Button variant="outline" disabled>Kind Toevoegen/Beheren (binnenkort)</Button>
              </TabsContent>
            )}
          </Tabs>
        </form>
        <DialogFooter className="pt-4 border-t mt-auto">
          <DialogClose asChild>
            <Button variant="outline">Annuleren</Button>
          </DialogClose>
          {!isTutorPendingApproval && (
             <Button type="button" onClick={handleSubmit(onSubmit)}>Opslaan</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
