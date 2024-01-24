import packageJson from '../../package.json';

const { version } = packageJson;

const uri: { [key: string]: string } = {
  development: 'https://api.spotify.com/v1',
  production: 'https://api.spotify.com/v1',
  test: 'https://'
};

const NODE_ENV = process.env.NODE_ENV;

export { uri, version, NODE_ENV };
