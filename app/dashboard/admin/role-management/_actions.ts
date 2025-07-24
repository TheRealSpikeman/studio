// app/dashboard/admin/role-management/_actions.ts
"use server";

import { query } from 'lib/db';

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    const { rows } = await query('SELECT * FROM roles ORDER BY name', []);
    return rows;
  } catch (error) {
    console.error('Error in getRoles:', error);
    throw new Error('Could not fetch roles.');
  }
};

export const createRole = async (roleData: Omit<Role, 'id'>): Promise<Role> => {
    const { name, description } = roleData;
    const sql = `
        INSERT INTO roles (name, description)
        VALUES ($1, $2)
        RETURNING *;
    `;
    try {
        const { rows } = await query(sql, [name, description || null]);
        return rows[0];
    } catch (error) {
        console.error('Error in createRole:', error);
        throw new Error('Could not create role.');
    }
};

export const deleteRole = async (id: string): Promise<{ success: boolean }> => {
    try {
        const { rowCount } = await query('DELETE FROM roles WHERE id = $1', [id]);
        return { success: rowCount !== null && rowCount > 0 };
    } catch (error) {
        console.error(`Error in deleteRole for id ${id}:`, error);
        if ((error as any).code === '23503') {
            throw new Error('Cannot delete role. It is currently assigned to one or more users.');
        }
        throw new Error('Could not delete role.');
    }
};
