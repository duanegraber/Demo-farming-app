import "./globals.css";
import AuthGate from "./components/AuthGate";

export const metadata = {
  title: "Demo Farm Manager",
  description: "Mobile-first cattle notebook for Demo Farm Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><AuthGate>{children}</AuthGate></body>
    </html>
  );
}
