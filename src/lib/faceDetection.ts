
import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;
  
  try {
    // Load face detection models from CDN
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    modelsLoaded = true;
  } catch (error) {
    console.error('Failed to load face detection models:', error);
    // Fallback: try loading from CDN
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    await faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    modelsLoaded = true;
  }
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG and PNG images are allowed' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 10MB' };
  }

  return { isValid: true };
};

export const detectFaces = async (imageElement: HTMLImageElement): Promise<{ isValid: boolean; error?: string }> => {
  try {
    await loadModels();
    
    // Detect faces with landmarks
    const detections = await faceapi.detectAllFaces(
      imageElement,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();

    if (detections.length === 0) {
      return { isValid: false, error: 'No human face detected in the image. Please upload a clear photo with a visible face.' };
    }

    if (detections.length > 3) {
      return { isValid: false, error: 'Too many faces detected. Please upload a photo with 1-3 people maximum.' };
    }

    // Check if faces are of reasonable size (not too small)
    const minFaceSize = 50; // minimum face box dimension
    for (const detection of detections) {
      const box = detection.detection.box;
      if (box.width < minFaceSize || box.height < minFaceSize) {
        return { isValid: false, error: 'Detected faces are too small. Please upload a clearer photo with larger faces.' };
      }
    }

    return { isValid: true };
  } catch (error) {
    console.error('Face detection error:', error);
    return { isValid: false, error: 'Failed to process image. Please try again with a different photo.' };
  }
};

export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
