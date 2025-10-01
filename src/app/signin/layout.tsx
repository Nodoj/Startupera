import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | TORAFLOW AI Agency",
  description: "Sign in to access the TORAFLOW admin panel and manage your AI automation flows.",
};

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
