// import { getDictionary } from "@/lib/dictionaries";
import { PostContent } from "./components/content";
import { getPostBySlug } from "./actions";
import { PostHeader } from "./components/header";
import { Metadata } from "next";
import { NotFoundInLanguage } from "@/components/not-found-in-language";

interface PostPageProps {
  lang: string;
  slug: string;
}

interface MetadataParams {
  params: PostPageProps;
}

export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug, lang);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    authors: [{ name: post.metadata.author }],
    keywords: post.metadata.tags,
  };
}

export async function PostPage(props: PostPageProps) {
  const { lang, slug } = props;

  // const dict = await getDictionary(lang);
  const post = await getPostBySlug(slug, lang);

  if (!post) {
    return <NotFoundInLanguage lang={lang} />;
  }

  // Get the PostHeader component and await it
  const header = await PostHeader({ post, lang });

  return (
    <article className="container py-8 max-w-3xl mx-auto">
      {header}
      <PostContent post={post} />
      {/* <PostFooter post={post} lang={lang} dictionary={dict} /> */}
      {/* <RelatedPosts
        tags={post.tags}
        currentPostId={post.id}
        lang={lang}
        dictionary={dict}
      /> */}
    </article>
  );
}
