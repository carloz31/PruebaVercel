import Head from "next/head";
import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import {Nunito} from "next/font/google";

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

const RootLayout = ({ children }) => (
  <html lang="es">
    <Head>
      <link rel="shortcut icon" href="./favicon.ico" />
    </Head>
    <body className={nunito.variable}>
      <AntdRegistry>{children}</AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
