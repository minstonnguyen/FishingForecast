
import './styles/App.css';
import Map from './screens/Map';
import TopBar from './components/TopBar'
import Home from './screens/Home';
import Login from './screens/Login';
import CreateAccount from './screens/CreateAccount';
import FishingForecast from './screens/FishingForecast';
import Logbook from './screens/Logbook';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { GoogleMapsProvider } from './GoogleMapContext';
import AuthContextProvider from './context/AuthContext';


function App() {
  return (
    <AuthContextProvider>
      <GoogleMapsProvider >
        <Router>
          <div className='App'>
            <TopBar/>
              <Routes>
                <Route exact path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/createaccount" element={<CreateAccount />} />
                <Route path="/fishingforecast" element={<FishingForecast />} />
                <Route path="/logbook" element={<Logbook />} />
              </Routes>
          </div>    
        </Router>
    </GoogleMapsProvider >
  </AuthContextProvider>  
    
    

  );
}


export default App;
