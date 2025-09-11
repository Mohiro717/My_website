
import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CustomBackground from './components/ui/CustomBackground';
import Spinner from './components/ui/Spinner';
import InstallPrompt from './components/ui/InstallPrompt';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const BlogListPage = React.lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const FilteredBlogListPage = React.lazy(() => import('./pages/FilteredBlogListPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));

const App: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Handle scrolling for hash links or scroll to top
    if (location.hash) {
      const id = location.hash.substring(1);
      // Use timeout to ensure the element is rendered before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-main-text dark:text-gray-100 relative">
      <CustomBackground imagePath="/images/background.webp" priority={true} />
      <Header />
      <main className="flex-grow">
        <div className="content-wrapper max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 my-8 rounded-lg shadow-xl">
          <Suspense fallback={
            <div className="flex justify-center items-center py-20">
              <Spinner />
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/blog/category/:category" element={<FilteredBlogListPage type="category" />} />
              <Route path="/blog/tag/:tag" element={<FilteredBlogListPage type="tag" />} />
              <Route path="/terms-of-service" element={<TermsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  );
};

export default App;
