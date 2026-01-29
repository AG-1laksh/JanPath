import "./globals.css";

export const metadata = {
  title: "Janpath",
  description: "Civic Grievance Intelligence Platform"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
