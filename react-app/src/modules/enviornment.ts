export function isDevEnv(): Boolean {
  console.log(window.location.hostname);
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}
