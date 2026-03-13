import React, { useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2 } from 'lucide-react';

const DUMMY_POSTS = [
  {
    id: 1,
    type: 'video',
    user: 'tech_reviewer',
    avatar: 'https://picsum.photos/seed/user5/100/100',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    caption: 'Testing the new AI video generation tools. What do you think? 🤖🎥',
    likes: 15420,
  },
  {
    id: 2,
    type: 'image',
    user: 'nature_lover',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    media: 'https://picsum.photos/seed/nature1/600/800',
    caption: 'Beautiful sunset at the beach today! #nature #sunset',
    likes: 1240,
  },
  {
    id: 3,
    type: 'video',
    user: 'ai_filmmaker',
    avatar: 'https://picsum.photos/seed/user6/100/100',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    caption: 'Generated this entire sequence using the latest models. The consistency is getting insane. #aivideo',
    likes: 45200,
  },
  {
    id: 4,
    type: 'image',
    user: 'ai_art_daily',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    media: 'https://picsum.photos/seed/cyberpunk/600/800',
    caption: 'Cyberpunk city streets glowing in the neon rain. #aiart #midjourney',
    likes: 8900,
  }
];

export const SocialApp = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const posts = containerRef.current.querySelectorAll('.social-post');
    let maxVisibleArea = 0;
    let mostVisiblePost: Element | null = null;

    posts.forEach((post) => {
      const rect = post.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      if (visibleHeight > maxVisibleArea) {
        maxVisibleArea = visibleHeight;
        mostVisiblePost = post;
      }
    });

    posts.forEach(p => {
      const vidEl = p.querySelector('video');
      if (vidEl) {
        if (p === mostVisiblePost) {
          vidEl.play().catch(() => {});
          p.setAttribute('data-visible', 'true');
        } else {
          vidEl.pause();
          p.removeAttribute('data-visible');
        }
      } else {
        if (p === mostVisiblePost) {
          p.setAttribute('data-visible', 'true');
        } else {
          p.removeAttribute('data-visible');
        }
      }
    });
  };

  useEffect(() => {
    setTimeout(handleScroll, 100);
  }, []);

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 pt-4 shrink-0">
        <div className="font-serif text-xl italic font-bold">Social</div>
        <div className="flex gap-4">
          <Heart size={24} />
          <MessageCircle size={24} />
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto pb-10" 
        ref={containerRef}
        onScroll={handleScroll}
      >
        {DUMMY_POSTS.map((post) => (
          <div key={post.id} className="social-post border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <img src={post.avatar} alt={post.user} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                <span className="font-medium text-sm">{post.user}</span>
              </div>
              <MoreHorizontal size={20} />
            </div>
            
            <div className="relative w-full h-[400px] bg-gray-900">
              {post.type === 'video' ? (
                <>
                  <video 
                    src={post.media} 
                    className="post-media w-full h-full object-cover"
                    crossOrigin="anonymous"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={handleScroll}
                  />
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Volume2 size={16} className="text-white" />
                  </div>
                </>
              ) : (
                <img 
                  src={post.media} 
                  alt="Post content" 
                  className="post-media w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onLoad={handleScroll}
                />
              )}
            </div>
            
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Heart size={24} />
                  <MessageCircle size={24} />
                  <Send size={24} />
                </div>
                <Bookmark size={24} />
              </div>
              <div className="font-medium text-sm">{post.likes.toLocaleString()} likes</div>
              <div className="text-sm">
                <span className="font-medium mr-2">{post.user}</span>
                {post.caption}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

