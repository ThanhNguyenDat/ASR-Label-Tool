module.exports = {
    __DEV__: true,
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
      STATIC_URL: JSON.stringify('http://localhost:5001'),
      BASE_API_URL: JSON.stringify('http://localhost:5000/api')
    }
  };
  