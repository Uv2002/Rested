import './NavBar.css';
import { BrowserRouter as Router,Routes, Route, NavLink } from 'react-router-dom'; 
import MapView from './pages/MapView';
import Reservation from './pages/Reservation';
import LoginView from './pages/LoginView';
import OrderView from './pages/OrderView';
import ReactApp from './react-sample/ReactApp';
import NoPage from './pages/NoPage';
import MetricesView from './pages/MetricesView'
import EmployeeView from './pages/EmployeeView';
import MenuView from './pages/MenuView';
import { ThemeProvider } from './context/ThemeContext';

import { useTheme } from './context/ThemeContext';
import ClockInOut from './pages/ClockInOut';

const routes = [
  // To add new pages, simply add them to this array (and import them above)
  // { path: '/react', element: <ReactApp />, label: 'React Test' },
  // { path: '/login', element: <LoginView />, label: 'Login' },
  { path: '/clockinout', element: <ClockInOut />, label: 'Clock In/Out' },
  { path: '/map', element: <MapView />, label: 'Map' },
  { path: '/menu', element: <MenuView />, label: 'Menu' },
  { path: '/reservation', element: <Reservation />, label: 'Reservation'},
  { path: '/orders', element: <OrderView />, label: 'Orders' },
  { path: '/metrices', element:<MetricesView />, label: 'Metrices'},
  { path: '/employee', element: <EmployeeView />, label: 'Employee' },
];


const ThemedContent = () => {
  
  const { theme } = useTheme(); // useTheme is called within a child component of ThemeProvider
  

  return (
    <Router>  
        <div className={`NavBar bg-${theme}-secondary transition duration-300 `}> 
            <ul className='sticky'>
                {/* This snippet generates LINKS for all of the routes above */
                /* It also sets whether the button is green for the current page */
                routes.map((link) => (
                <li key={link.path}>
                    <NavLink to={link.path} className={({ isActive }) => isActive ? `active bg-${theme}-primary transition duration-300` : ""}>
                      <div className={`text-${theme}-text transition duration-300`}>
                        {link.label}
                      </div>
                    </NavLink>
                </li>
                ))
                /* example: <Link to="/map">Map</Link> */}
            </ul>
        </div> 

        <Routes> 
            {/* This snippet generates ROUTES for all of the routes above */
            routes.map((route) => (
                <Route key={route.path} exact path={route.path} element={route.element} />
            ))
            /* example: <Route exact path='/map' element={< MapView />}></Route> */}
            <Route path="*" element={<NoPage />} />
        </Routes> 
    </Router>
  );
};


function App() {

  return (
    <ThemeProvider>
      <ThemedContent />
    </ThemeProvider>
  );
}

export default App;
