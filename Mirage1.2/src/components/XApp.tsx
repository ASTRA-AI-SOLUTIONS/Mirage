import React, { useEffect, useRef } from 'react';
import { MessageCircle, Repeat2, Heart, BarChart2, Share, MoreHorizontal, Home, Search, Bell, Mail } from 'lucide-react';

const DUMMY_POSTS = [
  {
    id: 1,
    type: 'image',
    user: 'Elon Musk',
    handle: '@elonmusk',
    avatar: 'https://picsum.photos/seed/xuser1/100/100',
    media: 'https://picsum.photos/seed/xpost1/600/400',
    caption: 'Just saw this incredible AI generated image. The future is wild.',
    likes: 124000,
    retweets: 45000,
    replies: 12000,
    views: '12M',
    time: '4h'
  },
  {
    id: 2,
    type: 'video',
    user: 'Tech News',
    handle: '@technews',
    avatar: 'https://picsum.photos/seed/xuser2/100/100',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'BREAKING: New AI video model released today. Here is a sample of what it can do. 🤯',
    likes: 4500,
    retweets: 1200,
    replies: 340,
    views: '450K',
    time: '6h'
  },
  {
    id: 3,
    type: 'image',
    user: 'Daily Nature',
    handle: '@naturedaily',
    avatar: 'https://picsum.photos/seed/xuser3/100/100',
    media: 'https://picsum.photos/seed/nature3/600/400',
    caption: 'A beautiful morning in the mountains. No AI here, just pure nature.',
    likes: 34000,
    retweets: 2100,
    replies: 890,
    views: '1.2M',
    time: '12h'
  }
];

export const XApp = () => {
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
    <div className="w-full h-full bg-black text-white flex flex-col font-sans">
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 pt-4 shrink-0 bg-black/80 backdrop-blur-md z-10">
        <img src="https://picsum.photos/seed/myuser/100/100" className="w-8 h-8 rounded-full" />
        <div className="font-bold text-xl tracking-tighter">𝕏</div>
        <div className="w-8" />
      </div>

      <div className="flex border-b border-gray-800 shrink-0">
        <div className="flex-1 text-center py-3 font-bold border-b-4 border-blue-500">For you</div>
        <div className="flex-1 text-center py-3 text-gray-500 font-medium">Following</div>
      </div>

      <div 
        className="flex-1 overflow-y-auto pb-16" 
        ref={containerRef}
        onScroll={handleScroll}
      >
        {DUMMY_POSTS.map((post) => (
          <div key={post.id} className="social-post border-b border-gray-800 p-4 flex gap-3">
            <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 truncate">
                  <span className="font-bold truncate">{post.user}</span>
                  <span className="text-gray-500 text-sm truncate">{post.handle}</span>
                  <span className="text-gray-500 text-sm">· {post.time}</span>
                </div>
                <MoreHorizontal size={18} className="text-gray-500 shrink-0" />
              </div>
              
              <div className="mt-1 text-[15px] leading-snug">
                {post.caption}
              </div>

              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800 relative w-full bg-gray-900 flex items-center justify-center max-h-[400px]">
                {post.type === 'video' ? (
                  <video 
                    src={post.media} 
                    className="post-media w-full max-h-[400px] object-cover"
                    crossOrigin="anonymous"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={handleScroll}
                  />
                ) : (
                  <img 
                    src={post.media} 
                    alt="Post content" 
                    className="post-media w-full max-h-[400px] object-cover"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onLoad={handleScroll}
                  />
                )}
              </div>
              
              <div className="flex justify-between mt-3 text-gray-500 text-sm">
                <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2">
                    <MessageCircle size={18} />
                  </div>
                  <span>{post.replies > 1000 ? (post.replies/1000).toFixed(1) + 'K' : post.replies}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-green-500/10 -ml-2">
                    <Repeat2 size={18} />
                  </div>
                  <span>{post.retweets > 1000 ? (post.retweets/1000).toFixed(1) + 'K' : post.retweets}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-pink-500/10 -ml-2">
                    <Heart size={18} />
                  </div>
                  <span>{post.likes > 1000 ? (post.likes/1000).toFixed(1) + 'K' : post.likes}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2">
                    <BarChart2 size={18} />
                  </div>
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2">
                    <Share size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-14 border-t border-gray-800 flex items-center justify-around bg-black shrink-0 pb-safe">
        <Home size={26} className="text-white" />
        <Search size={26} className="text-gray-500" />
        <Bell size={26} className="text-gray-500" />
        <Mail size={26} className="text-gray-500" />
      </div>
    </div>
  );
};
