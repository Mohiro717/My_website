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
import type { Post, Work } from '../types';

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

  const worksData: Work[] = [
    {
      id: 1,
      category: 'UEFN Game',
      title: '個人制作マップ',
      description:
        '初めてUEFNとVerseに触れ、アスレチックとスマブラ風アクションゲームの要素を詰め込んだマップ。手探り状態から、ゲームを「創る」ことの楽しさと難しさを学びました。僕のクリエイターとしての原点です。',
      imageUrl: '/images/portfolio-uefn.jpg',
      link: 'https://www.fortnite.com/@mohiro?lang=ja',
      linkLabel: 'マップをプレイする',
      skills: ['UEFN', 'Verse', 'Game Design'],
    },
    {
      id: 2,
      category: 'UEFN Contribution',
      title: 'BGL制作マップ協力',
      description:
        'BGLのプロジェクトで、Verseを用いた特殊能力システムの開発に協力しました。チームでの開発、他のクリエイターとの連携を通して、コードがゲームに命を吹き込む瞬間を体験しました。',
      imageUrl: '/images/roguelike_bgl.jpg',
      link: 'https://www.fortnite.com/@bgl/1305-1553-1636?lang=ja',
      linkLabel: 'マップをプレイする',
      skills: ['Verse', 'Team Development', 'System Design'],
    },
    {
      id: 3,
      category: 'Development',
      title: 'Webサイト制作',
      description:
        'Vibe Codingで、デザインの再現性はもちろん、コンポーネント設計やパフォーマンスを意識して実装したWebサイトです。実装には Next.js (React) を採用し、Sass (SCSS) と CSS Modules でスタイリングを行うことで、再利用性が高く保守性に優れたコードを目指しました。私にとって、モダンなフロントエンド開発の基礎を固める上で、大きな一歩となった大切な作品です。',
      imageUrl: '/images/portfolio-screenshot.jpg',
      link: 'https://mokumokuhouse.vercel.app/',
      linkLabel: 'サイトを見る',
      skills: ['Next.js', 'Sass', 'CSS Modules', 'UI/UX Design'],
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
          <section
            id="home"
            className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-16 text-center md:px-10 lg:flex-row lg:items-stretch lg:gap-16 lg:px-14 lg:py-24"
          >
            <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-accent-pink/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 right-1/4 h-72 w-72 rounded-full bg-accent-blue/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0)_60%)]" />

            <div className="relative w-full">
              <div className="relative rounded-3xl p-10 md:p-12 lg:px-16 lg:py-14">
                <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between lg:gap-16">
                  <div className="flex-1 space-y-6 text-center sm:text-left">
                    <p className="inline-flex items-center justify-center rounded-full bg-white/20 px-5 py-1.5 text-xs font-semibold tracking-[0.35em] uppercase text-accent-blue backdrop-blur-lg dark:text-accent-pink lg:text-sm">
                      Craft & Challenge
                    </p>
                    <h1 className="text-4xl font-extrabold leading-tight text-main-text dark:text-gray-100 sm:text-5xl lg:text-6xl xl:text-7xl">
                      Welcome to My Creative Space
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-300 md:text-lg lg:text-xl lg:leading-relaxed">
                      I'm Mohiro, a developer and storyteller exploring UEFN, Verse, and web experiences.
                      <br />
                      家族と共に歩む挑戦の記録を、この場所から発信しています。
                    </p>
                  <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-start">
                    <Link
                      to="/#works"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7d0ef] via-[#fbe4d4] to-[#cde6ff] px-10 py-4 text-base font-semibold text-main-text shadow-[0_18px_40px_-22px_rgba(236,72,153,0.7)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-20px_rgba(236,72,153,0.55)]"
                    >
                      Works
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      to="/blog"
                      className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-9 py-3.5 text-base font-semibold text-accent-blue backdrop-blur-lg transition duration-300 hover:-translate-y-0.5 hover:bg-white/25 dark:text-accent-pink"
                    >
                      Blog
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="relative hidden flex-1 items-center justify-center sm:flex">
                  <div className="absolute -left-16 top-4 h-48 w-8 rounded-full bg-gradient-to-b from-pink-200/50 via-transparent to-blue-200/50 blur-3xl" />
                  <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80 lg:translate-x-4">
                    <div className="absolute -left-9 bottom-0 h-32 w-28 -rotate-[16deg] overflow-hidden rounded-[1.6rem] border border-white/30 bg-white/20 shadow-[0_30px_46px_-20px_rgba(15,23,42,0.5)] backdrop-blur-xl z-10 sm:h-36 sm:w-32">
                      <img
                        src="/images/portfolio-uefn.jpg"
                        alt="Mohiro's UEFN creation"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="relative h-64 w-64 rotate-[4deg] overflow-hidden rounded-[2.6rem] border border-white/35 bg-gradient-to-br from-white/35 via-white/15 to-transparent shadow-[0_40px_70px_-28px_rgba(14,23,42,0.6)] backdrop-blur-2xl z-20 sm:h-72 sm:w-72 lg:h-[19rem] lg:w-[22rem] lg:rotate-[6deg]">
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.58),rgba(255,255,255,0)_62%)] opacity-92" />
                      <img
                        src="/images/portfolio-screenshot.jpg"
                        alt="Web project screenshot"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="absolute -right-10 -bottom-6 z-30 flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border border-white/50 bg-white/25 text-xs font-semibold uppercase tracking-[0.3em] text-accent-blue backdrop-blur-2xl shadow-[0_18px_35px_-22px_rgba(14,23,42,0.55)] dark:text-accent-pink">
                      <span className="text-sm">UEFN</span>
                      <span className="text-sm tracking-[0.08em] text-main-text dark:text-gray-100">Website</span>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
        
        <div className="content-wrapper rounded-3xl shadow-xl px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="space-y-16">
            {/* About Section */}
            <AnimatedSection animation="fadeUp" delay={200}>
              <Section title="About me" id="about">
                <div className="mx-auto max-w-5xl text-center">
                  <AnimatedSection animation="scale" delay={600}>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      こんにちはMohiroです！
                      <br className="hidden md:block" />
                      ようこそ僕のホームページに！
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  僕は以前は会社員として三交代勤務、週末は家族と公園で過ごす、
                  <br className="hidden md:block" />
                  ごく普通の毎日を送っていました。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  しかし、2023年に長男の難病が判明し生活は一変。
                  <br className="hidden md:block" />
                  入退院の繰り返し、上の子の心のケア、そして私自身も過労で、文字通り心身ともにダウンしました。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  このままでは家族が立ち行かないと覚悟し、
                  <br className="hidden md:block" />
                  育児休業を取得後、日勤に切り替えました。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  収入は減りましたが、家族を最優先するこの選択が、
                  <br className="hidden md:block" />
                  僕たち家族にとっての最適解だと信じています。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  そんな大変な時期に出会ったのがBGLです。
                  <br className="hidden md:block" />
                  そこには「学び」「創造」「遊び」が活発に行き交う心地よい空間が広がっていました。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  BGLに参加することで、長い間忘れていた「何かに熱中する」という感覚が、
                  <br className="hidden md:block" />
                  僕の中に蘇りました。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  スキルがなくても、一歩ずつ着実に積み重ねていけばやがて形になる——。
                  <br className="hidden md:block" />
                  そんな手応えを改めて感じています。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  現在は父親としての時間を大切にしながら、
                  <br className="hidden md:block" />
                  創作活動と学び直しを地道に続けています。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  よちよち歩きを始めた長男に「こんな生き方もあるんだよ」と伝えられるように。
                  <br className="hidden md:block" />
                  日々小さな一歩を積み上げています。
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  これからも、同じような境遇にいる誰かの希望となるようなコンテンツを発信しつつ、
                  <br className="hidden md:block" />
                  私自身の学びも深めていきたいと思っています。
                </p>
              </AnimatedSection>
                </div>
            </Section>
          </AnimatedSection>

          {/* Works Section */}
          <AnimatedSection animation="fadeUp" delay={300}>
            <Section title="制作実績" id="works">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {worksData.map((work, index) => (
                  <AnimatedSection
                    key={work.id}
                    animation="fadeUp"
                    delay={400 + index * 150}
                  >
                    <a
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                      aria-label={`${work.title} - ${work.linkLabel}`}
                    >
                      <Card className="h-full">
                        <div className="overflow-hidden rounded-t-lg">
                          <OptimizedImage
                            src={work.imageUrl}
                            alt={work.title}
                            width={600}
                            height={400}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col flex-1 p-6 space-y-4">
                          <span className="inline-flex w-fit items-center rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-blue">
                            {work.category}
                          </span>
                          <h3 className="text-xl font-bold text-main-text dark:text-gray-100">
                            {work.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            {work.description}
                          </p>
                          <div className="mt-auto flex flex-wrap gap-2">
                            {work.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-accent-pink/15 px-3 py-1 text-xs font-semibold text-accent-pink"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue transition-colors duration-300 group-hover:text-accent-pink">
                            {work.linkLabel}
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14M12 5l7 7-7 7"
                              />
                            </svg>
                          </span>
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
                    日々の学習の様子はXで、よりカジュアルな音声配信はstand.fmで行っています。
                    <br className="hidden md:block" />
                    ブログも準備中です。フォローやDM、いつでも大歓迎です！
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
        </div>
      </div>
    </>
  );
};

export default HomePage;
