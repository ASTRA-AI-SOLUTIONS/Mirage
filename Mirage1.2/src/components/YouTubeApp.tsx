import React, { useEffect, useRef } from 'react';
import { Search, Bell, Menu, Home, Compass, PlaySquare, MonitorPlay, MoreVertical, ThumbsUp, ThumbsDown, Share2, Download, PlusSquare } from 'lucide-react';

const DUMMY_VIDEOS = [
  {
    id: 1,
    title: 'I Created a Movie Using ONLY AI (100% Generated)',
    channel: 'AI Filmmaker',
    avatar: 'https://picsum.photos/seed/ytuser1/100/100',
    thumbnail: 'https://picsum.photos/seed/ytthumb1/600/337',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    views: '1.2M views',
    time: '2 days ago',
    duration: '14:20'
  },
  {
    id: 2,
    title: 'Real vs Fake: Can you spot the AI video?',
    channel: 'Tech Review',
    avatar: 'https://picsum.photos/seed/ytuser2/100/100',
    thumbnail: 'https://picsum.photos/seed/ytthumb2/600/337',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    views: '450K views',
    time: '5 hours ago',
    duration: '8:45'
  },
  {
    id: 3,
    title: 'Exploring the Swiss Alps in 4K',
    channel: 'Travel Vlog',
    avatar: 'https://picsum.photos/seed/ytuser3/100/100',
    thumbnail: 'https://picsum.photos/seed/ytthumb3/600/337',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    views: '89K views',
    time: '1 week ago',
    duration: '22:15'
  }
];

export const YouTubeApp = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const videos = containerRef.current.querySelectorAll('.yt-video-container');
    let maxVisibleArea = 0;
    let mostVisibleVideo: Element | null = null;

    videos.forEach((video) => {
      const rect = video.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      if (visibleHeight > maxVisibleArea) {
        maxVisibleArea = visibleHeight;
        mostVisibleVideo = video;
      }
    });

    videos.forEach(v => {
      const vidEl = v.querySelector('video');
      if (vidEl) {
        if (v === mostVisibleVideo) {
          vidEl.play().catch(() => {});
          v.setAttribute('data-visible', 'true');
        } else {
          vidEl.pause();
          v.removeAttribute('data-visible');
        }
      }
    });
  };

  useEffect(() => {
    setTimeout(handleScroll, 100);
  }, []);

  return (
    <div className="w-full h-full bg-[#0f0f0f] text-white flex flex-col font-sans">
      <div className="h-14 flex items-center justify-between px-4 pt-4 shrink-0 bg-[#0f0f0f] z-10">
        <div className="flex items-center gap-1">
          <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
          </div>
          <span className="font-bold text-xl tracking-tighter">YouTube</span>
        </div>
        <div className="flex gap-4 items-center">
          <Search size={22} className="text-white" />
          <Bell size={22} className="text-white" />
          <img src="https://picsum.photos/seed/myuser/100/100" className="w-7 h-7 rounded-full" />
        </div>
      </div>

      <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar shrink-0 border-b border-white/10">
        <div className="bg-white text-black px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">All</div>
        <div className="bg-white/10 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">Gaming</div>
        <div className="bg-white/10 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">Music</div>
        <div className="bg-white/10 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">Live</div>
        <div className="bg-white/10 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">News</div>
      </div>

      <div 
        className="flex-1 overflow-y-auto pb-16" 
        ref={containerRef}
        onScroll={handleScroll}
      >
        {DUMMY_VIDEOS.map((video) => (
          <div key={video.id} className="social-post mb-4">
            <div className="yt-video-container relative w-full aspect-video bg-black">
              <video 
                src={video.media} 
                className="post-media w-full h-full object-cover"
                crossOrigin="anonymous"
                muted
                loop
                playsInline
                poster={video.thumbnail}
                onLoadedData={handleScroll}
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                {video.duration}
              </div>
            </div>
            
            <div className="flex gap-3 p-3">
              <img src={video.avatar} alt={video.channel} className="w-10 h-10 rounded-full object-cover shrink-0 mt-1" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm leading-tight line-clamp-2 pr-4">{video.title}</h3>
                <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
                  <span>{video.channel}</span>
                  <span>•</span>
                  <span>{video.views}</span>
                  <span>•</span>
                  <span>{video.time}</span>
                </div>
              </div>
              <MoreVertical size={18} className="text-white/80 shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="h-14 border-t border-white/10 flex items-center justify-around bg-[#0f0f0f] shrink-0 pb-safe">
        <div className="flex flex-col items-center gap-1 text-white">
          <Home size={22} />
          <span className="text-[10px]">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-white/60">
          <Compass size={22} />
          <span className="text-[10px]">Shorts</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-white/60">
          <PlusSquare size={32} strokeWidth={1} />
        </div>
        <div className="flex flex-col items-center gap-1 text-white/60">
          <PlaySquare size={22} />
          <span className="text-[10px]">Subscriptions</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-white/60">
          <MonitorPlay size={22} />
          <span className="text-[10px]">Library</span>
        </div>
      </div>
    </div>
  );
};
