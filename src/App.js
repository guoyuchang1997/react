import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
// import Hander from "./hander/head";
import Main from "./pages/Main";
function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/home" component={Layout}></Route>
            <Route path="/login" component={Login}></Route>

            <Route>
              <Main></Main>
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}
export default App;
