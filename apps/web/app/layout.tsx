"use client"
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../redux/store";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <SessionProvider>
        <Provider store={store}>
        {children}
         </Provider>
       </SessionProvider>
      </body>
    </html>
  );
}
