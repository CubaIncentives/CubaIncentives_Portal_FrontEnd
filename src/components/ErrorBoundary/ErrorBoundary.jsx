import { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2 className='text-red-700'>
            There was an error with this listing.
          </h2>
          <Link to='/' className='text-blue-500'>
            Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
