'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';

import { Employee } from '@/types';

export async function addEmployee(formData: FormData) {
  try {
    const { env } = getRequestContext();
    const db = env.DB;

    if (!db) {
      return { success: false, error: 'Database binding missing' };
    }

    const employee: Employee = {
      full_name: formData.get('full_name') as string,
      date_of_birth: formData.get('date_of_birth') as string,
      nrc_number: formData.get('nrc_number') as string,
      gender: formData.get('gender') as string,
      position: formData.get('position') as string,
      start_date: formData.get('start_date') as string,
      contact_number: formData.get('contact_number') as string,
      address: formData.get('address') as string,
      next_of_kin_name: formData.get('next_of_kin_name') as string,
      next_of_kin_contact: formData.get('next_of_kin_contact') as string,
      next_of_kin_relationship: formData.get('next_of_kin_relationship') as string,
      image_data: formData.get('image_data') as string,
    };

    const stmt = db.prepare(`
      INSERT INTO employees (
        full_name, date_of_birth, nrc_number, gender, position, start_date,
        contact_number, address, next_of_kin_name, next_of_kin_contact, next_of_kin_relationship, image_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.bind(
      employee.full_name, employee.date_of_birth, employee.nrc_number, employee.gender, employee.position, employee.start_date,
      employee.contact_number, employee.address, employee.next_of_kin_name, employee.next_of_kin_contact, employee.next_of_kin_relationship, employee.image_data || null
    ).run();

    return { success: true };
  } catch (error) {
    console.error('Failed to add employee:', error);
    return { success: false, error: 'Failed to add employee' };
  }
}

export async function searchEmployees(query: string = '') {
  const { env } = getRequestContext();
  const db = env.DB;

  let stmt;
  if (!query) {
    stmt = db.prepare('SELECT * FROM employees ORDER BY created_at DESC');
  } else {
    stmt = db.prepare('SELECT * FROM employees WHERE full_name LIKE ? OR position LIKE ? ORDER BY created_at DESC').bind(`%${query}%`, `%${query}%`);
  }

  const { results } = await stmt.all<Employee>();
  return results as Employee[];
}

export async function updateEmployee(id: number, formData: FormData) {
  try {
    console.log('updateEmployee started for ID:', id);
    const { env } = getRequestContext();
    const db = env.DB;

    if (!db) {
      console.error('DB binding missing in updateEmployee');
      return { success: false, error: 'Database binding missing' };
    }

    const employee: Partial<Employee> = {
      full_name: formData.get('full_name') as string,
      date_of_birth: formData.get('date_of_birth') as string,
      nrc_number: formData.get('nrc_number') as string,
      gender: formData.get('gender') as string,
      position: formData.get('position') as string,
      start_date: formData.get('start_date') as string,
      contact_number: formData.get('contact_number') as string,
      address: formData.get('address') as string,
      next_of_kin_name: formData.get('next_of_kin_name') as string,
      next_of_kin_contact: formData.get('next_of_kin_contact') as string,
      next_of_kin_relationship: formData.get('next_of_kin_relationship') as string,
      image_data: formData.get('image_data') as string,
    };

    const stmt = db.prepare(`
      UPDATE employees SET
        full_name = ?, date_of_birth = ?, nrc_number = ?, gender = ?, position = ?, start_date = ?,
        contact_number = ?, address = ?, next_of_kin_name = ?, next_of_kin_contact = ?, next_of_kin_relationship = ?, image_data = ?
      WHERE id = ?
    `);

    await stmt.bind(
      employee.full_name, employee.date_of_birth, employee.nrc_number, employee.gender, employee.position, employee.start_date,
      employee.contact_number, employee.address, employee.next_of_kin_name, employee.next_of_kin_contact, employee.next_of_kin_relationship, employee.image_data || null,
      id
    ).run();

    console.log('updateEmployee database update successful');
    return { success: true };
  } catch (error) {
    console.error('Failed to update employee:', error);
    return { success: false, error: 'Failed to update employee' };
  }
}


export async function updatePassword(currentPass: string, newPass: string) {
  try {
    const { env } = getRequestContext();
    const db = env.DB;

    if (!db) return { success: false, error: 'Database binding missing' };

    // 1. Verify current password
    const result = await db.prepare('SELECT value FROM settings WHERE key = ?')
      .bind('admin_password')
      .first<{ value: string }>();

    const actualCurrent = result?.value || 'admin123'; // Default if not set

    if (currentPass !== actualCurrent) {
      return { success: false, error: 'Current password incorrect' };
    }

    // 2. Update to new password
    await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
      .bind('admin_password', newPass)
      .run();

    return { success: true };
  } catch (error) {
    console.error('Failed to update password:', error);
    return { success: false, error: 'Failed to update password' };
  }
}
