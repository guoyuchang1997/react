// src/App.js
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import LayoutPage from "./pages/Layout"; // 重命名以免跟antd组件混淆
import { useThemeEffect } from './hooks/useThemeEffect';
import AiText from './pages/AiText';
import './index.css'
function App() {
  useThemeEffect();
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route path="/login" component={Login}></Route>
          <Route path="/home" component={LayoutPage}></Route>
          <Route path="/ai-text" component={AiText}></Route>
        </Switch>
      </div>
    </Router>
  );
}
export default App;