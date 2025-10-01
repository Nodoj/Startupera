import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | TORAFLOW AI Agency",
  description: "Reset your password to regain access to your TORAFLOW account.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
