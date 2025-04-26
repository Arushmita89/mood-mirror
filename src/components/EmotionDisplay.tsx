
import React from 'react';
import { DetectionResult, EmotionData } from '../models';
import { Progress } from "@/components/ui/progress";
import { emotionColorMap, emotionDescriptionMap } from '../utils/emotionUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmotionDisplayProps {
  detectionResult: DetectionResult | null;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ detectionResult }) => {
  if (!detectionResult) {
    return (
      <Card className="bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Waiting for emotion data...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Look at the camera to begin emotion detection
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { dominantEmotion, emotions, faceDetected } = detectionResult;
  
  // Display up to top 4 emotions
  const topEmotions = emotions
    .filter(emotion => emotion.probability > 0.05)
    .slice(0, 4);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Current Emotion</span>
          {faceDetected ? (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Face Detected
            </span>
          ) : (
            <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">
              No Face Detected
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {faceDetected ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-xl font-bold capitalize">{dominantEmotion.emotion}</h3>
                <span className="text-sm text-muted-foreground">
                  {Math.round(dominantEmotion.probability * 100)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {emotionDescriptionMap[dominantEmotion.emotion as any]}
              </p>
            </div>
            
            <div className="space-y-3">
              {topEmotions.map((emotion) => (
                <div key={emotion.emotion} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize">{emotion.emotion}</span>
                    <span>{Math.round(emotion.probability * 100)}%</span>
                  </div>
                  <Progress 
                    value={emotion.probability * 100} 
                    className={`h-2 ${emotionColorMap[emotion.emotion as any]}`}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            <p>No face detected. Position yourself in front of the camera.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
