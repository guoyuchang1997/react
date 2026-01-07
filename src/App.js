// src/App.js
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import LayoutPage from "./pages/Layout";
import AiText from './pages/AiText';
import { ThemeProvider } from './theme';
import { useThemeEffect } from '../src/hooks/useThemeEffect'
import './index.css';
import './theme/theme.css';

function AppContent() {
  // 初始化主题并同步到 Zustand store（向后兼容）
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
