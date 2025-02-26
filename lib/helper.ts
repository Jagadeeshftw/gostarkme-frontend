// Helper function to convert hex to decimal and format it
export const formatNumber = (hex: number) => {
  const decimal = parseInt(hex.toString(), 16);
  return decimal.toString();
};
