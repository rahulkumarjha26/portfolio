
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './Home';
import About from './About'
import Work from './Work'
import Contact from './Contact'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/About' component={About}/>
        <Route path='/Work' component={Work}/>
        <Route path='/Contact' component={Contact}/>
        <Route/>
      </Switch>
    </Router>
  );
}

export default App;
