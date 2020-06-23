import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

// import components
import Alert from '../../components/Alert';

// import styles
import './Login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errMsg: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      return this.props.history.push('/profile');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.loggedIn) {
      nextProps.history.push('/profile');
      return false;
    }
    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    //const { email, password } = this.state;
    var options = {
      showDialog: true, // Whether or not to force the user to approve the app again if they’ve already done so.
      requestPermissions: ['user-read-email','playlist-modify-private', 'user-library-read','user-follow-read', 'playlist-read-private','streaming'] // Spotify access scopes.
    };
    

    Meteor.loginWithSpotify(options, function(err) {
      console.log(err || "No error");
    });
   
  }
  render() {
    if (this.props.loggedIn) {
      return null;
    }

    

    const { errMsg } = this.state;
    return (
      <section className="login-page">
        <div className="card mx-auto" style={{ maxWidth: '28rem' }}>
          <div className="card-header">
            <div className="brand">
              <div className="text-center">
                
              </div>
            </div>
            <div className="card-body">
              <h4 className="card-title">Login</h4>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">E-Mail Address</label>

                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="spread-container">
                    <label htmlFor="password">Password</label>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={e => this.setState({ password: e.target.value })}
                    required
                  />
                  <NavLink to="/recover-password">Forgot Password?</NavLink>
                </div>
                <div className="form-group no-margin">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-2"
                  >
                    Login
                  </button>
                  {errMsg && <Alert errMsg={errMsg} />}
                </div>
                <div className="margin-top20">
                  Don&apos;t have an account?{' '}
                  <NavLink to="/signup">Create one</NavLink>
                </div>
              </form>
            </div>
          </div>
          <div className="footer text-center">
            &copy; {new Date().getFullYear()}
          </div>
        </div>
      </section>
    );
  }
}

export default Login;

Login.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
