
export type Emotion = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'surprised' 
  | 'neutral' 
  | 'fearful' 
  | 'disgusted';

export interface EmotionData {
  emotion: Emotion;
  probability: number;
}

export interface DetectionResult {
  emotions: EmotionData[];
  dominantEmotion: EmotionData;
  faceDetected: boolean;
  timestamp: number;
}

export interface ArtStyle {
  name: string;
  description: string;
  backgroundStyles: string;
  elements: ArtElement[];
}

export interface ArtElement {
  type: 'circle' | 'square' | 'triangle' | 'line' | 'wave';
  styles: string;
  animation?: string;
}

export interface GeneratedArt {
  style: ArtStyle;
  emotion: Emotion;
  svgContent: string;
  timestamp: number;
}
