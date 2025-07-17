// app/dashboard/admin/user-management/page.tsx
import { UserManagementTable } from "@/components/admin/user-management/UserManagementTable";
import { getAllUsers } from "@/services/userService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const UserManagementPage = async () => {
  // Fetch users from the database using the service
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Gebruikersbeheer
              </CardTitle>
              <CardDescription>
                Beheer alle gebruikersaccounts, wijzig statussen en rollen.
              </CardDescription>
            </div>
            <Button asChild>
              {/* This link is a placeholder for future implementation */}
              <Link href="/dashboard/admin/user-management/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Gebruiker
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* The UserManagementTable is now inside the CardContent */}
          <UserManagementTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;
