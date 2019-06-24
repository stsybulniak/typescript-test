import React, { Component } from 'react';
import CustomSnackBar from '../components/UI/CustomSnackBar';
import { get } from 'lodash';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    };

    componentWillMount() {
      this.reqInterceptor = axios.interceptors.request.use(req => {
        this.setState({ error: null });
        return req;
      });
      this.resInterceptor = axios.interceptors.response.use(
        res => res,
        error => {
          this.setState({ error: error });
        }
      );
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      const { error } = this.state;
      return (
        <>
          {error && (
            <CustomSnackBar
              isOpen={Boolean(error)}
              onClose={this.errorConfirmedHandler}
              variant="error"
              message={get(error, 'response.data.error.message') || get(error, 'message', 'Error occurred')}
            />
          )}
          <WrappedComponent {...this.props} />
        </>
      );
    }
  };
};

export default withErrorHandler;
