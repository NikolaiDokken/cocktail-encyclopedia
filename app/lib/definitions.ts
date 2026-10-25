export type Drink = {
  id: string;
  name: string;
  category: string | null;
  instructions: string | null;
  garnish: string | null;
  imageUrl: string | null;
  liked: boolean;
};
