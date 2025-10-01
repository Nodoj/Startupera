import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | TORAFLOW AI Agency",
  description: "Create a new password for your TORAFLOW account.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
