'use client';

const AnimatedButton = ({ href, children, animate = true }: { href: string; children: React.ReactNode; animate?: boolean }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="animated-button">
    {animate && (
      <>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </>
    )}
    <div className="button-content">
      {children}
    </div>
    <style>{`
      .animated-button {
        position: relative;
        height: 40px;
        border: none;
        padding: 0;
        background: transparent;
        border-radius: 2px;
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        display: block;
        overflow: hidden;
        box-shadow: 0 4px 50px 0 rgb(0 0 0 / 7%);
      }

      .animated-button .button-content {
        position: relative;
        z-index: 2;
        height: calc(100% - 2px);
        width: calc(100% - 2px);
        margin: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1.5px;
        color: #4b5563;
        background: #f3f4f6;
        gap: 8px;
      }

      .animated-button span:nth-child(1) {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(to right, transparent, black);
        animation: animate1 3s linear infinite;
      }

      @keyframes animate1 {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      .animated-button span:nth-child(2) {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 1px;
        background: linear-gradient(to bottom, transparent, black);
        animation: animate2 3s linear infinite;
        animation-delay: 1.5s;
      }

      @keyframes animate2 {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(100%);
        }
      }

      .animated-button span:nth-child(3) {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(to left, transparent, black);
        animation: animate3 3s linear infinite;
      }

      @keyframes animate3 {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }

      .animated-button span:nth-child(4) {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 1px;
        background: linear-gradient(to top, transparent, black);
        animation: animate4 3s linear infinite;
        animation-delay: 1.5s;
      }

      @keyframes animate4 {
        0% {
          transform: translateY(100%);
        }
        100% {
          transform: translateY(-100%);
        }
      }

      .animated-button:hover .button-content {
        background: #e5e7eb;
      }
    `}</style>
  </a>
);

export default function SocialButtons({showGithub = false, showTwitter = false}: {showGithub?: boolean, showTwitter?: boolean}) {
  return (
    <div className="flex flex-col gap-2 p-2 mt-4">
      {showGithub && (
        <AnimatedButton href="https://github.com/saulamsal/apple-news-ui">
        <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
          Star on GitHub
        </AnimatedButton>
      )}

      {showTwitter && (
        <AnimatedButton href="https://twitter.com/intent/follow?screen_name=saul_sharma" animate={false}>
          <img src="https://i.imgur.com/6wdPxeP.jpeg" alt="Twitter" className="w-4 h-4 rounded-full" />
          Follow Saúl on 𝕏
        </AnimatedButton>
      )}
    </div>
  );
}
