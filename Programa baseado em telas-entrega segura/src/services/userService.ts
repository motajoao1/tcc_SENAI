import type { RegisterData, SellerProfile, User } from '../domain/types';
import { DEMO_PASSWORD } from '../data/mockData';
import { generateId } from '../utils/formatters';

export const userService = {
  authenticate(users: User[], email: string, password: string): User | null {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return null;
    // Prototype auth: seeded accounts share a demo password, accounts created in
    // this session accept any password of at least 6 characters.
    if (password === DEMO_PASSWORD || password.length >= 6) return user;
    return null;
  },

  createUser(data: RegisterData): User {
    return {
      id: `user-${generateId()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      cpf: data.cpf,
      condominiumId: data.condominiumId,
      block: data.block.trim(),
      apartment: data.apartment.trim(),
      role: 'buyer',
      rating: 0,
      totalRatings: 0,
      validated: false,
    };
  },

  enableSeller(user: User, sellerProfile: SellerProfile): User {
    return { ...user, role: 'both', sellerProfile };
  },

  applyRating(user: User, rating: number): User {
    const totalRatings = user.totalRatings + 1;
    const avg = (user.rating * user.totalRatings + rating) / totalRatings;
    return { ...user, totalRatings, rating: Math.round(avg * 10) / 10 };
  },

  emailTaken(users: User[], email: string): boolean {
    return users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  },
};
