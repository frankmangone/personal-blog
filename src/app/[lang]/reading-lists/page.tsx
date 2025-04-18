import fs from "fs/promises";
import path from "path";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { readingLists } from "@/lib/reading-lists";
import { MainLayout } from "@/components/layouts/main-layout";
import { ReadingListsPage } from "@/features/reading-lists/list";
import { getDictionary } from "@/lib/dictionaries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ReadingListsPageParams extends Promise<any> {
  lang: string;
}

interface ReadingListsPageProps {
  params: ReadingListsPageParams;
}

export const metadata: Metadata = {
  title: "Reading Lists",
  description: "Curated lists of articles on various topics",
};

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

export default async function Page({ params }: ReadingListsPageProps) {
  const { lang } = params;
  const localizedReadingLists = readingLists[lang].getAllReadingLists();
  const dict = await getDictionary(lang);

  if (!localizedReadingLists) {
    return notFound();
  }

  return (
    <MainLayout lang={lang}>
      <ReadingListsPage
        lang={lang}
        dictionary={dict}
        readingLists={localizedReadingLists}
      />
    </MainLayout>
  );
}
