import { Emotion, EmotionData, DetectionResult, ArtStyle, GeneratedArt } from '../models';

// Map emotions to color classes
export const emotionColorMap: Record<Emotion, string> = {
  happy: 'bg-emotion-happy',
  sad: 'bg-emotion-sad',
  angry: 'bg-emotion-angry',
  surprised: 'bg-emotion-surprised',
  neutral: 'bg-emotion-neutral',
  fearful: 'bg-emotion-fearful',
  disgusted: 'bg-emotion-disgusted',
};

// Map emotions to gradient classes
export const emotionGradientMap: Record<Emotion, string> = {
  happy: 'from-yellow-300 to-amber-500',
  sad: 'from-blue-400 to-blue-700',
  angry: 'from-red-500 to-red-800',
  surprised: 'from-purple-400 to-purple-700',
  neutral: 'from-slate-300 to-slate-500',
  fearful: 'from-purple-800 to-indigo-900',
  disgusted: 'from-green-800 to-teal-900',
};

// Map emotions to descriptions
export const emotionDescriptionMap: Record<Emotion, string> = {
  happy: 'Joy and happiness radiate through your expression',
  sad: 'There\'s a gentle melancholy in your eyes',
  angry: 'Powerful emotions surge through your features',
  surprised: 'Wonder and astonishment are clear in your expression',
  neutral: 'Your expression is balanced and centered',
  fearful: 'Caution and concern show in your features',
  disgusted: 'Strong aversion registers in your expression',
};

// Get art style based on emotion
export const getArtStyleForEmotion = (emotion: Emotion): ArtStyle => {
  const styles: Record<Emotion, ArtStyle> = {
    happy: {
      name: 'Radiant Joy',
      description: 'Vibrant patterns celebrating happiness',
      backgroundStyles: 'bg-gradient-to-r from-yellow-300 to-amber-500',
      elements: [
        { type: 'circle', styles: 'fill-yellow-200 opacity-70', animation: 'animate-float' },
        { type: 'circle', styles: 'fill-amber-300 opacity-60', animation: 'animate-pulse-emotion' },
        { type: 'triangle', styles: 'fill-yellow-400 opacity-50', animation: 'animate-wave' },
      ]
    },
    // Define styles for other emotions similarly
  };

  const style = styles[emotion];

  if (!style || !style.elements || style.elements.length === 0) {
    console.warn(`No elements defined for emotion: ${emotion}`);
    return {
      name: 'Unknown',
      description: 'No art available',
      backgroundStyles: '',
      elements: []
    };
  }

  return style;
};

// Generate SVG art based on emotion
export const generateArt = (emotion: Emotion): GeneratedArt => {
  const style = getArtStyleForEmotion(emotion);

  const svgElements: string[] = [];
  for (let i = 0; i < 12; i++) {
    const element = style.elements[i % style.elements.length];
    const x = Math.random() * 300;
    const y = Math.random() * 300;
    const size = 20 + Math.random() * 60;
    const opacity = 0.2 + Math.random() * 0.6;
    const animationClass = element.animation || '';

    switch(element.type) {
      case 'circle':
        svgElements.push(`<circle cx="${x}" cy="${y}" r="${size / 2}" class="${element.styles} ${animationClass}" />`);
        break;
      case 'square':
        svgElements.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" class="${element.styles} ${animationClass}" />`);
        break;
      // Handle other types (triangle, line, wave)
    }
  }

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" class="w-full h-full">${svgElements.join('\n')}</svg>`;

  return {
    style,
    emotion,
    svgContent,
    timestamp: Date.now()
  };
};

// Get top emotions based on probability (for handling fluctuations)
export const getTopEmotions = (emotions: EmotionData[], topN = 3): EmotionData[] => {
  return emotions
    .sort((a, b) => b.probability - a.probability)
    .slice(0, topN);
};

// Sample emotion data for testing (add default happy, shocked, sad)
export const getSampleEmotionData = (): DetectionResult => {
  const emotions: EmotionData[] = [
    { emotion: 'neutral', probability: 0 },
    { emotion: 'happy', probability: 0.7 },
    { emotion: 'sad', probability: 0.05 },
    { emotion: 'surprised', probability: 0.2 },
    { emotion: 'angry', probability: 0 },
    { emotion: 'fearful', probability: 0 },
    { emotion: 'disgusted', probability: 0 }
  ];

  const topEmotions = getTopEmotions(emotions);

  return {
    emotions: topEmotions,
    dominantEmotion: topEmotions[0],
    faceDetected: false,
    timestamp: Date.now()
  };
};
