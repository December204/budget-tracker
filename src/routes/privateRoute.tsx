import { Home } from 'views/Home';
import { Profile } from 'views/Profile';
import { Transactions } from 'views/Transactions';

const privateRoute = {
  home: {
    path: '/',
    name: 'Home',
    component: Home,
  },
  profile: {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  transactions: {
    path: '/transactions',
    name: 'Giao dịch',
    component: Transactions,
  },
};

export default privateRoute;
