import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import DefaultAppTheme from './ui';
import RoutePaths from './configs';
import {
  LoginPage,
  ForgotPasswordPage,
  NotFoundPage,
  LogoutPage,
  HomePage,
  ResetPasswordPage,
  SignupPage,
} from './views';
import { ToastrProvider } from './contexts/ToastrContext';

const App = () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={DefaultAppTheme}>
      <CssBaseline />
      <ToastrProvider>
        <Router>
          <Switch>
            <Route exact path={RoutePaths.HOME} component={HomePage} />
            <Route exact path={RoutePaths.SIGN_UP} component={SignupPage} />
            <Route exact path={RoutePaths.LOGIN} component={LoginPage} />
            <Route exact path={RoutePaths.FORGOT_PASSWORD} component={ForgotPasswordPage} />
            <Route exact path={RoutePaths.RESET_PASSWORD} component={ResetPasswordPage} />
            <Route exact path={RoutePaths.LOGOUT} component={LogoutPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </ToastrProvider>
    </ThemeProvider>
  </StyledEngineProvider>
);

export default App;