import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import Spinner from '../components/ui/Spinner';
import OptimizedImage from '../components/ui/OptimizedImage';
import SEOHead from '../components/ui/SEOHead';
import AnimatedSection from '../components/ui/AnimatedSection';
import SocialLinks from '../components/ui/SocialLinks';
import { sanityService, urlFor } from '../services/sanityService';
import { isSanityConfigured, missingSanityConfigMessage } from '../sanity.client';
import type { Post } from '../types';

const Section: React.FC<{title: string; children: React.ReactNode; className?: string, id?: string}> = ({ title, children, className, id }) => (
    <section id={id} className={`py-12 sm:py-16 ${className}`}>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-center mb-8 text-main-text dark:text-gray-100">{title}</h2>
        {children}
    </section>
);

const HomePage: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sanityError, setSanityError] = useState<string | null>(null);
  const navigate = useNavigate();

  const socialProfiles = [
    {
      name: 'メール: mohiro954@gmail.com',
      url: 'mailto:mohiro954@gmail.com',
      icon: 'mail' as const,
    },
    {
      name: 'stand.fm チャンネル',
      url: 'https://stand.fm/channels/6892ddc1b09e6a462a52dd21',
      icon: 'standfm' as const,
    },
    {
      name: 'X (旧Twitter): @3537Hi',
      url: 'https://x.com/3537Hi',
      icon: 'x' as const,
    },
  ];

  const worksData = [
    {
      id: 1,
      title: 'Mohiro\'s Portfolio',
      description: 'Next.js, TypeScript, Tailwind CSSで構築したポートフォリオサイトです。',
      imageUrl: 'https://picsum.photos/seed/work-portfolio/600/400',
      link: 'https://mohiro-portfolio.vercel.app/',
    },
    {
      id: 2,
      title: 'Recipe App',
      description: '外部APIを使用してレシピを検索するアプリです。Reactで構築し、デザインはFigmaで行いました。',
      imageUrl: 'https://picsum.photos/seed/work-recipe/600/400',
      link: 'https://recipe-app-zeta-kohl.vercel.app/',
    },
    {
      id: 3,
      title: 'Blog',
      description: 'Next.jsとmicroCMSで構築したブログサイトです。',
      imageUrl: 'https://picsum.photos/seed/work-blog/600/400',
      link: 'https://next-microcms-blog-brown.vercel.app/',
    },
    {
      id: 4,
      title: 'Landing Page',
      description: 'Figma, HTML, CSS, JavaScriptを使用したランディングページです。',
      imageUrl: 'https://picsum.photos/seed/work-landing/600/400',
      link: 'https://mohiro-frontend-one.vercel.app/',
    },
  ];


  useEffect(() => {
    const fetchLatestPosts = async () => {
      if (!isSanityConfigured) {
        console.warn(missingSanityConfigMessage);
        setSanityError('Sanity が未設定のため記事を取得できません。環境変数を設定して再読み込みしてください。');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching posts from Sanity...');
        const posts = await sanityService.getPosts();
        console.log('Fetched posts:', posts);
        console.log('Number of posts:', posts.length);
        setLatestPosts(posts.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error details:', message);
        setSanityError(
          'Sanity から記事を取得できませんでした。設定を確認してもう一度お試しください。'
        );
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <>
      <SEOHead
        title="Mohiro's Portfolio & Blog - Web Developer & Designer"
        description="Mohiroのポートフォリオとブログサイト。React、TypeScript、デザインに関する情報を発信するWeb開発者です。"
        keywords="Mohiro, portfolio, web developer, designer, React, TypeScript, Next.js, フロントエンド"
        url="/"
        type="website"
      />
      <div className="space-y-16">
        {/* Hero Section */}
        <AnimatedSection animation="fadeUp" duration={0.8}>
          <section id="home" className="text-center py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-inner">
            <h1 className="text-4xl md:text-6xl font-extrabold font-serif text-main-text dark:text-gray-100 leading-tight">
              Welcome to My Creative Space
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              I'm Mohiro, a passionate developer and designer. Here you'll find my work, thoughts, and creative journey.
            </p>
          </section>
        </AnimatedSection>

        {/* About Section */}
        <AnimatedSection animation="fadeUp" delay={200}>
          <Section title="About Me" id="about">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection animation="scale" delay={600}>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  I'm a creative developer passionate about building exceptional digital experiences. 
                  With expertise in React, TypeScript, and modern web technologies, I create solutions that are both beautiful and functional.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  With a background in both design and development, I strive to build products that are not only functional but also beautiful and intuitive. My journey in tech is driven by a constant curiosity and a desire to solve real-world problems.
                </p>
              </AnimatedSection>
            </div>
          </Section>
        </AnimatedSection>

        {/* Works Section */}
        <AnimatedSection animation="fadeUp" delay={300}>
          <Section title="Works" id="works">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {worksData.map((work, index) => (
                <AnimatedSection 
                  key={work.id}
                  animation="fadeUp" 
                  delay={400 + (index * 150)}
                >
                  <a href={work.link} target="_blank" rel="noopener noreferrer" className="block group">
                    <Card>
                      <div className="overflow-hidden rounded-t-lg">
                        <OptimizedImage 
                          src={work.imageUrl} 
                          alt={work.title} 
                          width={600} 
                          height={400}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-main-text dark:text-gray-100">{work.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm h-16">{work.description}</p>
                      </div>
                    </Card>
                  </a>
                </AnimatedSection>
              ))}
            </div>
          </Section>
        </AnimatedSection>

        {/* Latest Blog Section */}
        <AnimatedSection animation="fadeUp" delay={400}>
          <Section title="Latest Blog Posts" id="blog-section">
            {sanityError && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                <p className="font-semibold">{sanityError}</p>
                <p className="mt-2 text-sm">
                  公式ドキュメント: <a href="https://www.sanity.io/docs" target="_blank" rel="noreferrer" className="underline">Sanity Docs</a>
                </p>
              </div>
            )}
            {loading ? <Spinner /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestPosts.map((post, index) => (
                  <AnimatedSection 
                    key={post._id}
                    animation="fadeUp" 
                    delay={500 + (index * 150)}
                  >
                    <Card onClick={() => navigate(`/blog/${post.slug.current}`)}>
                      {post.mainImage ? (
                        <OptimizedImage 
                          src={urlFor(post.mainImage).width(600).height(400).url()} 
                          alt={post.title} 
                          width={600} 
                          height={400}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <OptimizedImage 
                          src="https://picsum.photos/600/400" 
                          alt={post.title} 
                          width={600} 
                          height={400}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 h-14 overflow-hidden text-main-text dark:text-gray-100">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 h-20 overflow-hidden">{post.excerpt}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{(post.viewCount ?? 0).toLocaleString()} views</p>
                        <div className="flex flex-wrap gap-2">
                          {(post.tags ?? []).slice(0, 2).map(tag => (
                            <Tag key={tag._id} color="pink">{tag.title}</Tag>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            )}
            <AnimatedSection animation="fadeUp" delay={800}>
              <div className="text-center mt-12">
                <Link to="/blog" className="inline-block bg-accent-blue text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300">
                  View All Posts
                </Link>
              </div>
            </AnimatedSection>
          </Section>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection animation="fadeUp" delay={500}>
          <Section title="Contact" id="contact">
            <AnimatedSection animation="scale" delay={700}>
              <div className="max-w-xl mx-auto text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-lg shadow-inner">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  お仕事のご相談・ご依頼など、お気軽にご連絡ください。
                </p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  メールまたはアイコンからお気軽にご連絡ください。
                </p>
                <div className="mt-6">
                  <SocialLinks
                    profiles={socialProfiles}
                    className="space-x-8"
                    linkClassName="text-accent-blue hover:text-accent-pink transition duration-300"
                  />
                </div>
              </div>
            </AnimatedSection>
          </Section>
        </AnimatedSection>
      </div>
    </>
  );
};

export default HomePage;
