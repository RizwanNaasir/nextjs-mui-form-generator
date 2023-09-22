const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/forms/list',
        permanent: true
      },
      {
        source: '/',
        destination: '/dashboard',
        permanent: true
      }
    ];
  }
};

module.exports = withImages(redirects);
