// app/dashboard/admin/coach-management/_actions.ts
"use server";

import { query } from 'lib/db';
import type { User } from '@/types/user';

const userQuery = `
    SELECT u.*, r.name as role
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
`;

export const getUsersByRole = async (roleName: string): Promise<User[]> => {
  try {
    const sql = `${userQuery} WHERE r.name = $1`;
    const { rows } = await query(sql, [roleName]);
    return rows;
  } catch (error) {
    console.error(`Error in getUsersByRole for role ${roleName}:`, error);
    throw new Error(`Could not fetch users with role ${roleName}.`);
  }
};

export const updateUser = async (id: string, updates: Partial<Omit<User, 'role'>> & { role_id?: string }): Promise<User | null> => {
    const setClause = Object.keys(updates).map((key, index) => `"${key}" = $${index + 2}`).join(', ');
    if (!setClause) {
        const sql = `${userQuery} WHERE u.id = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
    
    const sql = `
        UPDATE users
        SET ${setClause}
        WHERE id = $1
        RETURNING id;
    `;
    const values = [id, ...Object.values(updates)];

    try {
        const { rows } = await query(sql, values);
        if (rows.length > 0) {
            const userSql = `${userQuery} WHERE u.id = $1`;
            const { rows: userRows } = await query(userSql, [rows[0].id]);
            return userRows[0];
        }
        return null;
    } catch (error) {
        console.error(`Error in updateUser for id ${id}:`, error);
        throw new Error('Could not update user.');
    }
};
