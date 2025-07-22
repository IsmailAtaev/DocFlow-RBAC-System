import { Kysely } from 'kysely';
import * as bcrypt from 'bcryptjs';

const roles = [
    { id: crypto.randomUUID(), code: 'superadmin', name: 'Super Admin' },
    { id: crypto.randomUUID(), code: 'admin', name: 'Admin' },
    { id: crypto.randomUUID(), code: 'moderator', name: 'Moderator' },
    { id: crypto.randomUUID(), code: 'user', name: 'User' },
];

const permissions = [
    // DOCUMENT
    { id: crypto.randomUUID(), model: 'DOCUMENT', action: 'create' },
    { id: crypto.randomUUID(), model: 'DOCUMENT', action: 'read' },
    { id: crypto.randomUUID(), model: 'DOCUMENT', action: 'update' },
    { id: crypto.randomUUID(), model: 'DOCUMENT', action: 'delete' },

    // USER
    { id: crypto.randomUUID(), model: 'USER', action: 'create' },
    { id: crypto.randomUUID(), model: 'USER', action: 'read' },
    { id: crypto.randomUUID(), model: 'USER', action: 'update' },
    { id: crypto.randomUUID(), model: 'USER', action: 'delete' },

    // ROLE
    { id: crypto.randomUUID(), model: 'ROLE', action: 'create' },
    { id: crypto.randomUUID(), model: 'ROLE', action: 'read' },
    { id: crypto.randomUUID(), model: 'ROLE', action: 'update' },
    { id: crypto.randomUUID(), model: 'ROLE', action: 'delete' },

    // PERMISSION
    { id: crypto.randomUUID(), model: 'PERMISSION', action: 'create' },
    { id: crypto.randomUUID(), model: 'PERMISSION', action: 'read' },
    { id: crypto.randomUUID(), model: 'PERMISSION', action: 'update' },
    { id: crypto.randomUUID(), model: 'PERMISSION', action: 'delete' },
];

export async function seedRolesAndPermissions(db: Kysely<any>) {
    await db.deleteFrom('role_permissions').execute();
    await db.deleteFrom('permissions').execute();
    await db.deleteFrom('roles').execute();
    await db.insertInto('roles').values(roles).execute();
    await db.insertInto('permissions').values(permissions).execute();
}

export async function seedRolePermissions(db: Kysely<any>) {
    const getRoleId = (code: string) => {
        const role = roles.find((r) => r.code === code);
        if (!role) throw new Error(`Missing role: ${code}`);
        return role.id;
    };

    const getPermission = (model: string, action: string) => {
        const perm = permissions.find((p) => p.model === model && p.action === action);
        if (!perm) throw new Error(`Missing permission: ${model}.${action}`);
        return perm.id;
    };

    const rolePermissions = [
        // Superadmin — все права
        ...permissions.map((p) => ({
            role_id: getRoleId('superadmin'),
            permission_id: p.id,
        })),

        // Admin — full rights to DOCUMENT and USER
        ...['create', 'read', 'update', 'delete'].flatMap((action) => [
            { role_id: getRoleId('admin'), permission_id: getPermission('DOCUMENT', action) },
            { role_id: getRoleId('admin'), permission_id: getPermission('USER', action) },
        ]),

        // Moderator — DOCUMENT only: read, create, delete
        { role_id: getRoleId('moderator'), permission_id: getPermission('DOCUMENT', 'read') },
        { role_id: getRoleId('moderator'), permission_id: getPermission('DOCUMENT', 'create') },
        { role_id: getRoleId('moderator'), permission_id: getPermission('DOCUMENT', 'delete') },

        // User — only read
        { role_id: getRoleId('user'), permission_id: getPermission('DOCUMENT', 'read') },
        { role_id: getRoleId('user'), permission_id: getPermission('USER', 'read') },
        { role_id: getRoleId('user'), permission_id: getPermission('ROLE', 'read') },
        { role_id: getRoleId('user'), permission_id: getPermission('PERMISSION', 'read') },
    ];

    await db.insertInto('role_permissions').values(rolePermissions).execute();

    console.log('RBAC: role_permissions Seeds successfully added');
}

export async function createAdminUser(db: Kysely<any>) {
    const username = 'admin123';
    const password = await bcrypt.hash(username, Number(process.env.HASH_SALT));

    const superadminRole = await db
        .selectFrom('roles')
        .selectAll()
        .where('code', '=', 'superadmin')
        .executeTakeFirst();

    if (!superadminRole) throw new Error('Role superadmin not found. Please seed roles first.');

    await db.insertInto('users').values({
        id: crypto.randomUUID(),
        username,
        password,
        fullname: 'Admin Admin',
        role_id: superadminRole.id,
    }).execute();

    console.log(`Admin user created: username=${username}, password=${username}`);
}
