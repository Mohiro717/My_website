import React from 'react';

// Define SVG icons as components
const XIcon = () => (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const ZennIcon = () => (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 128 128" aria-hidden="true">
        <path d="M116.33 16.33a8 8 0 00-8-8H20a8 8 0 00-8 8v96a8 8 0 008 8h88.33a8 8 0 008-8v-96zM35.61 95.89H23.33V32.11h12.28v63.78zm23.87 0h-12V64h12v31.89zm23.78 0h-11.72V48.11h11.72v47.78zm23.71 0h-11.72V32.11h11.72v63.78z"></path>
    </svg>
);

const GitHubIcon = () => (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 20.312c-2.157 0-3.9-1.744-3.9-3.9V7.588c0-2.157 1.744-3.9 3.9-3.9h7.103c2.157 0 3.9 1.744 3.9 3.9v8.824c0 2.157-1.744 3.9-3.9 3.9H8.449z"/>
        <path d="M12.017 7.056c-2.745 0-4.961 2.217-4.961 4.961s2.217 4.961 4.961 4.961 4.961-2.217 4.961-4.961-2.216-4.961-4.961-4.961zm0 8.131c-1.751 0-3.17-1.42-3.17-3.17s1.42-3.17 3.17-3.17 3.17 1.42 3.17 3.17-1.419 3.17-3.17 3.17zM16.7 6.288c-.39.39-1.023.39-1.414 0-.39-.39-.39-1.023 0-1.414.39-.39 1.023-.39 1.414 0 .39.39.39 1.024 0 1.414z"/>
    </svg>
);

const StandFmIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a5 5 0 00-5 5v4a5 5 0 003.5 4.773V19a1.5 1.5 0 003 0v-3.227A5 5 0 0017 11V7a5 5 0 00-5-5zm0 2a3 3 0 013 3v4a3 3 0 11-6 0V7a3 3 0 013-3z" />
        <path d="M7 11a5 5 0 007.732 4.213l1.558 1.557a1.25 1.25 0 101.77-1.77l-1.556-1.558A5 5 0 0017 11h-2a3 3 0 11-6 0H7z" />
    </svg>
);

const MailIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v.217l8 5 8-5V6H4zm16 2.783l-7.445 4.653a1 1 0 01-1.11 0L4 8.783V18h16V8.783z" />
    </svg>
);


const socialIcons: { [key: string]: React.FC } = {
  x: XIcon,
  github: GitHubIcon,
  instagram: InstagramIcon,
  zenn: ZennIcon,
  standfm: StandFmIcon,
  mail: MailIcon,
};

export interface SocialProfile {
  name: string;
  url: string;
  icon: keyof typeof socialIcons;
}

interface SocialLinksProps {
  profiles: SocialProfile[];
  className?: string;
  linkClassName?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  profiles,
  className = '',
  linkClassName = 'text-gray-500 hover:text-accent-pink transition duration-300',
}) => {
  return (
    <div className={`flex justify-center space-x-6 ${className}`}>
      {profiles.map((profile) => {
        const Icon = socialIcons[profile.icon];
        return (
          <a
            key={profile.name}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={profile.name}
            className={linkClassName}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
