// If you need to sort by field, you need to add it to the list

export const userSelf = [
  'profile_image',
  'role',
  'online',
  'first_name',
  'last_name',
  'username',
  'email',
  'last_seen',
  'isConfirmed',
  'url',
  'updatedAt'
];

export const user = [
  'profile_image',
  'online',
  'first_name',
  'last_name',
  'username',
  'email',
  'last_seen',
  'url'
];

export const users = [
  '-_id',
  'profile_image',
  'first_name',
  'last_name',
  'username',
  'last_seen',
  'url'
];

export const usersAdmin = [
  'profile_image',
  'role',
  'online',
  'first_name',
  'last_name',
  'username',
  'email',
  'last_seen',
  'isConfirmed',
  'isActive',
  'isBlocked',
  'softDelete',
  'updatedAt',
  'createdAt'
];

export default {
  userSelf,
  user,
  users,
  usersAdmin
}
