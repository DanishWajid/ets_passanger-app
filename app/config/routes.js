import React, {Component} from 'react';
import {
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import CustomDrawerContentComponent from './CustomDrawerContentComponent';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Logout from '../screens/Logout';
import Start from '../screens/Start';
import ForgotPassword from '../screens/ForgotPassword';
import Settings from '../screens/Settings';
import About from '../screens/About';
import Email from '../screens/Email';
import Name from '../screens/Name';
import Payment from '../screens/Payment';
import MobileNumber from '../screens/MobileNumber';
import Password from '../screens/Password';
import Gender from '../screens/Gender';
import Scheduled from '../screens/Scheduled';
import History from '../screens/History';
import RideDetails from '../screens/RideDetails';
import RideSummary from '../screens/RideSummary';
import QuoteSelection from '../screens/QuoteSelection';
import Contact from '../screens/Contact';
import VerifyPhone from '../screens/VerifyPhone';
import VerifyEmail from '../screens/VerifyEmail';
import LimitedAccess from '../screens/LimitedAccess';
import {CustomHeader} from '../components/CustomHeader';

const Application = createStackNavigator (
  {
    Start: {screen: Start},
    LoginPage: {screen: Login},
    SignupPage: {screen: Signup},
    ForgotPassword: {screen: ForgotPassword},
  },
  {
    headerMode: 'none',
    navigationOptions: {
      header: false,
      swipeEnabled: false,
      drawerLockMode: 'locked-closed',
      gesturesEnabled: false,
    },
  }
);

const SettingsNavigator = createStackNavigator (
  {
    Settings,
    Name,
    MobileNumber,
    Email,
    Password,
    Gender,
  },
  {
    headerMode: 'none',
  }
);

SettingsNavigator.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

const HomeNavigator = createStackNavigator (
  {
    Home,
    QuoteSelection,
    RideDetails,
    Payment,
  },
  {
    headerMode: 'none',
  }
);

HomeNavigator.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

const RidesTabNavigator = createMaterialTopTabNavigator (
  {
    Scheduled: {
      screen: Scheduled,
      navigationOptions: {
        tabBarLabel: 'SCHEDULED',
      },
    },
    History: {
      screen: History,
      navigationOptions: {
        tabBarLabel: 'HISTORY',
      },
    },
  },
  {
    initialRouteName: 'History',
    tabBarOptions: {
      activeTintColor: '#EA2141',
      inactiveTintColor: '#000000',
      labelStyle: {
        fontSize: 13,
        fontWeight: 'bold',
      },
      style: {
        backgroundColor: '#ffffff',
      },
      indicatorStyle: {
        backgroundColor: '#EA2141',
      },
    },
  }
);

const RidesNavigator = createStackNavigator (
  {
    RidesTabNavigator,
  },
  {
    navigationOptions: {
      header: props => (
        <CustomHeader
          title="Your Rides"
          drawerOpen={() => props.navigation.openDrawer ()}
        />
      ),
    },
  }
);
const CompleteRidesNavigator = createStackNavigator (
  {
    RidesNavigator,
    RideSummary,
  },
  {
    headerMode: 'none',
  }
);

CompleteRidesNavigator.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

const LimitedHome = createStackNavigator (
  {
    LimitedAccess: {
      screen: LimitedAccess,
    },
    VerifyEmail: {
      screen: VerifyEmail,
    },
    VerifyPhone: {
      screen: VerifyPhone,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      header: false,
      swipeEnabled: false,
      drawerLockMode: 'locked-closed',
      gesturesEnabled: false,
    },
  }
);

LimitedHome.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

const SignedInRouteConfigs = {
  Home: {
    screen: HomeNavigator,
    navigationOptions: {
      drawerLabel: 'Home',
      drawerIcon: () => <Icon name="home" style={{fontSize: 20, width: 23}} />,
    },
  },
  'About Us': {
    screen: About,
    navigationOptions: {
      drawerLabel: 'About',
      drawerIcon: () => (
        <Icon
          size={150}
          name="information-circle"
          style={{fontSize: 20, width: 23}}
        />
      ),
    },
  },
  'Contact Us': {
    screen: Contact,
    navigationOptions: {
      drawerLabel: 'Contact',
      drawerIcon: () => (
        <Icon size={150} name="contact" style={{fontSize: 20, width: 23}} />
      ),
    },
  },
  'Your Rides': {
    screen: CompleteRidesNavigator,
    navigationOptions: {
      drawerLabel: 'Your Rides',
      drawerIcon: () => (
        <Icon size={150} name="car" style={{fontSize: 20, width: 23}} />
      ),
    },
  },
  Settings: {
    screen: SettingsNavigator,
    navigationOptions: {
      drawerLabel: 'Settings',
      drawerIcon: () => (
        <Icon size={150} name="settings" style={{fontSize: 20, width: 23}} />
      ),
    },
  },
  Logout: {
    screen: Logout,
    navigationOptions: {
      drawerLabel: 'Logout',
      drawerIcon: () => (
        <Icon name="log-out" style={{fontSize: 20, width: 23}} />
      ),
    },
  },
};

const SignedInLimitedRouteConfigs = {
  Home: {
    screen: LimitedHome,
    navigationOptions: {
      drawerLabel: 'Limited Access',
      drawerIcon: () => <Icon name="home" style={{fontSize: 20, width: 23}} />,
    },
  },
  'Update Email': {
    screen: Email,
    navigationOptions: {
      drawerLabel: 'Update Email',
      drawerIcon: () => (
        <Icon size={150} name="mail" style={{fontSize: 20, width: 23}} />
      ),
    },
  },
  Logout: {
    screen: Logout,
    navigationOptions: {
      drawerLabel: 'Logout',
      drawerIcon: () => (
        <Icon name="log-out" style={{fontSize: 20, width: 23}} />
      ),
    },
  },
};

const SignedInLimitedDrawerNavigatorConfig = {
  initialRouteName: 'Home',
  drawerPosition: 'left',
  contentComponent: props => <CustomDrawerContentComponent {...props} />,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  order: ['Home', 'Update Email', 'Logout'],
};

const SignedInDrawerNavigatorConfig = {
  initialRouteName: 'Home',
  drawerPosition: 'left',
  contentComponent: props => <CustomDrawerContentComponent {...props} />,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  order: ['Home', 'About Us', 'Contact Us', 'Your Rides', 'Settings', 'Logout'],
};

const SignedInApp = createDrawerNavigator (
  SignedInRouteConfigs,
  SignedInDrawerNavigatorConfig
);

const SignedInLimitedApp = createDrawerNavigator (
  SignedInLimitedRouteConfigs,
  SignedInLimitedDrawerNavigatorConfig
);

const createRootNavigator = (signedIn = false, compVerified = false) => {
  return createSwitchNavigator (
    {
      SignedIn: {
        screen: SignedInApp,
      },
      SignedInLimited: {
        screen: SignedInLimitedApp,
      },
      SignedOut: {
        screen: Application,
      },
    },
    {
      initialRouteName: signedIn
        ? compVerified ? 'SignedIn' : 'SignedInLimited'
        : 'SignedOut',
    }
  );
};

class MainApp extends Component {
  static propTypes = {
    userLoginData: PropTypes.object,
    currentUser: PropTypes.object,
  };

  render () {
    const compVerified = this.props.userLoginData.compVerified;
    const userLoggedIn = this.props.userLoginData.userLoggedIn;
    const Layout = createRootNavigator (userLoggedIn, compVerified);
    return <Layout />;
  }
}

const mapStateToProps = state => ({
  currentUser: state.login.currentUser,
  userLoginData: state.login.userLoginData,
});

export default connect (mapStateToProps) (MainApp);
