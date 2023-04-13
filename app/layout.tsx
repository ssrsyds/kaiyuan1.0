import { ACCESS_CODES } from "./api/access";
import "./styles/globals.scss";
import "./styles/markdown.scss";
import "./styles/prism.scss";

export const metadata = {
  title: "Ai 百晓生",
  description: "Your personal ChatGPT Chat Bot.",
  appleWebApp: {
    title: "Ai 百晓生",
    statusBarStyle: "black-translucent",
  },
  themeColor: "#fafafa",
};

const COMMIT_ID = process.env.COMMIT_ID;

function Meta() {
  const metas = {
    version: COMMIT_ID,
    access: ACCESS_CODES.size > 0 ? "enabled" : "disabled",
  };

  return (
    <>
      {Object.entries(metas).map(([k, v]) => (
        <meta name={k} content={v} key={k} />
      ))}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <Meta />
        <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700;900&display=swap"
          rel="stylesheet"></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
