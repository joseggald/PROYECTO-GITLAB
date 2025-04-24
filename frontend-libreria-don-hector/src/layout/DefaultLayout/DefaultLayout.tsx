import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

interface DefaultLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  keywords?: string;
}

export default function DefaultLayout({
  children,
  title,
  description,
  keywords,
}: DefaultLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {keywords && <meta content={keywords} name="keywords" />}
      </Helmet>
      {children}
    </>
  );
}
