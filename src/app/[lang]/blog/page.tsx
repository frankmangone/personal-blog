import fs from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<PageParams>;
}

interface PageParams {
  lang: string;
}

export async function generateStaticParams() {
  const contentPath = path.join(process.cwd(), "src", "content");

  try {
    const languages = await fs.readdir(contentPath);
    return languages
      .filter(async (lang) => {
        const langPath = path.join(contentPath, lang);
        const langStat = await fs.stat(langPath);
        return langStat.isDirectory();
      })
      .map((lang) => ({
        lang,
      }));
  } catch (error) {
    console.error("Error generating params:", error);
    return [{ lang: "en" }];
  }
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  redirect(`/${lang}/blog/page/1`);
}
