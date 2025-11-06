export const CONFIG = {
  API_BASE_URL:
    process.env.API_BASE_URL ||
    (process.env.RN_DEV_TARGET === 'android-emulator'
      ? 'http://10.0.2.2:5000'
      : 'http://localhost:5000'),
};
