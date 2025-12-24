export interface HeroMedia {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  title?: string;
}

export const heroMedia: HeroMedia[] = [
  {
    id: 'radio-studio-1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&h=800&fit=crop',
    alt: 'Modern radio studio with equipment',
    title: 'Professional Broadcasting Studio'
  },
  {
    id: 'radio-host-1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=800&fit=crop',
    alt: 'Radio host in action',
    title: 'Live Radio Broadcasting'
  },
  {
    id: 'audio-equipment-1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
    alt: 'High-end audio equipment',
    title: 'Studio-Grade Audio Equipment'
  },
  {
    id: 'radio-waves-1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop',
    alt: 'Radio waves visualization',
    title: 'Digital Radio Transmission'
  },
  {
    id: 'podcast-studio-1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&h=800&fit=crop',
    alt: 'Podcast recording studio',
    title: 'Content Creation Hub'
  },
  {
    id: 'live-stream-1',
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Live Streaming Demo'
  },
  {
    id: 'music-production-1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
    alt: 'Music production setup',
    title: 'Music Production Suite'
  },
  {
    id: 'audience-engagement-1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop',
    alt: 'Audience engagement',
    title: 'Interactive Broadcasting'
  }
];

export default heroMedia;