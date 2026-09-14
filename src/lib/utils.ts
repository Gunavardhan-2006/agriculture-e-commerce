export const formatCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
export const formatQuantity = (value: number, unit = "kg") => `${new Intl.NumberFormat("en-IN").format(value)} ${unit}`;
export const cn = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");
