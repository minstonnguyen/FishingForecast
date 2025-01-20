
import './App.css';
import Map from './screens/Map';
import TopBar from './components/TopBar'
import Home from './screens/Home';
import Login from './screens/Login';
import CreateAccount from './screens/CreateAccount';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
function App() {
  return (
    <Router>
      <div className='App'>
        <TopBar/>
          <Routes>
            <Route exact path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createaccount" element={<CreateAccount />} />
          </Routes>
      </div>    
    </Router>

  );
}

export default App;
