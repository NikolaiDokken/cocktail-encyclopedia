export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Drink = {
  id: string;
  name: string;
  instructions: string;
  image_url: string | null;
  liked: boolean;
};
