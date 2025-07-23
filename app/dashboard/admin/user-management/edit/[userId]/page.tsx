import { notFound } from 'next/navigation';
import { getAllUsers } from '@/services/userService';
import { UserEditForm } from '@/components/admin/user-management/UserEditForm';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { UserCog } from 'lucide-react';
import Link from 'next/link';

interface UserEditPageProps {
  params: Promise<{ userId: string }>;
}

const getUserById = async (userId: string) => {
  const users = await getAllUsers();
  return users.find(u => u.id === userId);
}

const UserEditPage = async ({ params }: UserEditPageProps) => {
  const { userId } = await params; // Await the params Promise!
  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="h-6 w-6 text-primary" />
          Gebruiker Bewerken
        </h2>
      </div>
      
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/admin/user-management">Gebruikersbeheer</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium text-foreground">{user.name}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <UserEditForm user={user} />
    </div>
  );
};

export default UserEditPage;
