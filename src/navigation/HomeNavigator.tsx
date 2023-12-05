import {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '@views/Profile';
import ProfileSettings from '@components/profile/ProfileSettings';
import Verification from '@views/auth/Verification';
import {
  HomeNavigatorStackParamList,
  ProfileNavigatorStackParamList,
} from 'src/@types/navigation';
import Home from '@views/Home';
import PublicProfile from '@views/PublicProfile';

const Stack = createNativeStackNavigator<HomeNavigatorStackParamList>();

interface Props {}

const HomeNavigator: FC<Props> = props => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PublicProfile" component={PublicProfile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default HomeNavigator;
