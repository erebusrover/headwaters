import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../utils/history';
import Calendar from './Calendar/Calendar.jsx';
import Journal from './Journal.jsx';
import JournalHistory from './JournalHistory.jsx';
import NavBar from './NavBar.jsx';
import Pillbox from './Pillbox.jsx';
import MedTracker from './MedTracker.jsx';
import Home from './Home.jsx';
import { useAuth0 } from '../react-auth0-spa.jsx';

// eslint-disable-next-line no-unused-vars
const App = props => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth0(); 

  return (
    <div className="App">
      <Router history={history}>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact />
          <Route path="/calendar" component={Calendar} />{' '}
          <Route path="/journal" component={Journal} />{' '}
          <Route path="/journalHistory" component={JournalHistory} />{' '}
          <Route path="/pillbox" component={Pillbox} />{' '}
          <Route path="/medTracker" component={MedTracker} />{' '}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
