import { AvantagesPage } from "./AvantagesPage";
import type { User } from "../types";

interface AvantagesProps {
  authenticatedUser?: User | null;
  onUserAuthenticated: (user: User) => void;
}

export function Avantages({ authenticatedUser, onUserAuthenticated }: AvantagesProps) {
  // Mapper l'utilisateur au format attendu par AvantagesPage
  const mappedUser = authenticatedUser ? {
    firstName: authenticatedUser.firstName,
    loyaltyStatus: (authenticatedUser.membershipLevel.toLowerCase() === 'gold' ? 'gold' : 
                   authenticatedUser.membershipLevel.toLowerCase() === 'platinum' ? 'platinum' :
                   authenticatedUser.membershipLevel.toLowerCase() === 'silver' ? 'silver' : 'bronze') as 'bronze' | 'silver' | 'gold' | 'platinum',
    points: authenticatedUser.points
  } : undefined;

  return <AvantagesPage user={mappedUser} />;
}