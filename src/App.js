import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Hander from "./hander/head";
function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/home" component={Layout}></Route>
            <Route path="/login" component={Login}></Route>

            <Route>
              <Hander />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}
export default App;
