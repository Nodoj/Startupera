import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | TORAFLOW AI Agency",
  description: "Create your account to access TORAFLOW admin panel and manage your AI automation flows.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
