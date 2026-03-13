import React, { useEffect, useRef } from 'react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Volume2, Search, Bell, Menu, Home, Users, MonitorPlay } from 'lucide-react';

const DUMMY_POSTS = [
  {
    id: 1,
    type: 'video',
    user: 'AI Tech Enthusiasts',
    avatar: 'https://picsum.photos/seed/fbuser1/100/100',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    caption: 'Check out this amazing AI-generated short film! The rendering is incredible. #AI #Tech',
    likes: 1200,
    comments: 45,
    shares: 120,
    time: '2 hrs'
  },
  {
    id: 2,
    type: 'image',
    user: 'Jane Doe',
    avatar: 'https://picsum.photos/seed/fbuser2/100/100',
    media: 'https://picsum.photos/seed/fbpost1/600/400',
    caption: 'Had a great time hiking this weekend! Nature is beautiful.',
    likes: 45,
    comments: 12,
    shares: 2,
    time: '5 hrs'
  },
  {
    id: 3,
    type: 'video',
    user: 'Creative AI Lab',
    avatar: 'https://picsum.photos/seed/fbuser3/100/100',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'We used the latest generative models to create this commercial. What do you think?',
    likes: 3400,
    comments: 210,
    shares: 890,
    time: '1 day'
  }
];

export const FacebookApp = () => {
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
    <div className="w-full h-full bg-slate-100 text-slate-900 flex flex-col">
      <div className="bg-white pt-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center justify-between px-4 pb-2">
          <div className="text-blue-600 font-bold text-2xl tracking-tighter">facebook</div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <Search size={20} className="text-slate-700" />
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <Menu size={20} className="text-slate-700" />
            </div>
          </div>
        </div>
        <div className="flex justify-between px-2 pb-2 border-b border-slate-200">
          <div className="flex-1 flex justify-center py-2 border-b-2 border-blue-600">
            <Home size={24} className="text-blue-600" />
          </div>
          <div className="flex-1 flex justify-center py-2">
            <MonitorPlay size={24} className="text-slate-500" />
          </div>
          <div className="flex-1 flex justify-center py-2">
            <Users size={24} className="text-slate-500" />
          </div>
          <div className="flex-1 flex justify-center py-2">
            <Bell size={24} className="text-slate-500" />
          </div>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto pb-10" 
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div className="bg-white p-4 mb-2 flex gap-3 items-center">
          <img src="https://picsum.photos/seed/myuser/100/100" className="w-10 h-10 rounded-full" />
          <div className="flex-1 bg-slate-100 rounded-full py-2 px-4 text-slate-500 text-sm">
            What's on your mind?
          </div>
        </div>

        {DUMMY_POSTS.map((post) => (
          <div key={post.id} className="social-post bg-white mb-2 pb-2">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <div className="font-semibold text-sm">{post.user}</div>
                  <div className="text-xs text-slate-500">{post.time} • 🌎</div>
                </div>
              </div>
              <MoreHorizontal size={20} className="text-slate-500" />
            </div>
            
            <div className="px-3 pb-2 text-sm">
              {post.caption}
            </div>

            <div className="relative w-full bg-black flex items-center justify-center min-h-[300px] max-h-[500px]">
              {post.type === 'video' ? (
                <>
                  <video 
                    src={post.media} 
                    className="post-media w-full max-h-[500px] object-contain"
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
                  className="post-media w-full max-h-[500px] object-contain"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onLoad={handleScroll}
                />
              )}
            </div>
            
            <div className="px-3 py-2 border-b border-slate-100 flex justify-between text-slate-500 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                  <ThumbsUp size={10} className="text-white" />
                </div>
                {post.likes.toLocaleString()}
              </div>
              <div>
                {post.comments} comments • {post.shares} shares
              </div>
            </div>

            <div className="flex px-2 pt-1">
              <div className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:bg-slate-50 rounded-md cursor-pointer">
                <ThumbsUp size={20} />
                <span className="text-sm font-medium">Like</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:bg-slate-50 rounded-md cursor-pointer">
                <MessageCircle size={20} />
                <span className="text-sm font-medium">Comment</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:bg-slate-50 rounded-md cursor-pointer">
                <Share2 size={20} />
                <span className="text-sm font-medium">Share</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
