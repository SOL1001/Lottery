import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type TabParamList = {
  Home: undefined;
  Wallet: undefined;
  Profile: undefined;
};

// Props types for screens
export type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = StackScreenProps<AuthStackParamList, 'Register'>;

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  StackScreenProps<RootStackParamList>
>;

export type BookScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Book'>,
  StackScreenProps<RootStackParamList>
>;

export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  StackScreenProps<RootStackParamList>
>;