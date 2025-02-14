export const generateOtp = (): string =>
   Math.floor(1000 + Math.random() * 9000).toString();
