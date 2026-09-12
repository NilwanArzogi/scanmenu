const variants = {
  default: "bg-background text-text-secondary border border-border",
  success: "bg-green-50 text-success border border-green-200",
  danger: "bg-red-50 text-danger border border-red-200",
  primary: "bg-orange-50 text-primary-dark border border-orange-200",
};

export default function Badge({ children, variant = "default" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}