import AppCotnainer from '@components/AppCotnainer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import AppNavigator from 'src/navigation';
import store from 'src/store';


const queryClient = new QueryClient();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppCotnainer>
            <AppNavigator />
          </AppCotnainer>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
