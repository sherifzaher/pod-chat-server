type CreateUserDetails = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type ValidateUserDetails = {
  email: string;
  password: string;
};

type FindUserParams = Partial<{
  id: number;
  email: string;
}>;
