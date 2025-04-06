
import * as tf from '@tensorflow/tfjs';
import { supabase } from "@/integrations/supabase/client";

// Interface for the Dataset table from Supabase
interface PlacementDataRecord {
  CGPA: number;
  high_school_score: number;
  SSC_score: number;
  Web_Development: number;
  Machine_Learning_Experience: number;
  Cloud_Computing_Experience: number;
  Database_Experience: number;
  Other_Personal_Skills: number;
  DSA_CP: number;
  Tech_Internships: number;
  Package_LPA: number;
  Hackathon_participation: number;
  Projects_completed: number;
}

// Fallback data in case Supabase fetch fails
const fallbackData: PlacementDataRecord[] = [
  { CGPA: 8.5, high_school_score: 85, SSC_score: 90, Web_Development: 4, Machine_Learning_Experience: 3, Cloud_Computing_Experience: 2, Database_Experience: 3, Other_Personal_Skills: 4, DSA_CP: 4, Tech_Internships: 2, Package_LPA: 10.5, Hackathon_participation: 3, Projects_completed: 4 },
  { CGPA: 9.2, high_school_score: 92, SSC_score: 95, Web_Development: 5, Machine_Learning_Experience: 4, Cloud_Computing_Experience: 4, Database_Experience: 4, Other_Personal_Skills: 5, DSA_CP: 5, Tech_Internships: 3, Package_LPA: 18.5, Hackathon_participation: 4, Projects_completed: 5 },
  { CGPA: 7.8, high_school_score: 76, SSC_score: 82, Web_Development: 3, Machine_Learning_Experience: 2, Cloud_Computing_Experience: 1, Database_Experience: 2, Other_Personal_Skills: 3, DSA_CP: 2, Tech_Internships: 1, Package_LPA: 7.2, Hackathon_participation: 1, Projects_completed: 2 },
  { CGPA: 8.9, high_school_score: 88, SSC_score: 91, Web_Development: 4, Machine_Learning_Experience: 5, Cloud_Computing_Experience: 3, Database_Experience: 4, Other_Personal_Skills: 3, DSA_CP: 5, Tech_Internships: 2, Package_LPA: 14.0, Hackathon_participation: 3, Projects_completed: 4 },
  { CGPA: 6.5, high_school_score: 72, SSC_score: 75, Web_Development: 2, Machine_Learning_Experience: 1, Cloud_Computing_Experience: 1, Database_Experience: 1, Other_Personal_Skills: 2, DSA_CP: 1, Tech_Internships: 0, Package_LPA: 5.5, Hackathon_participation: 0, Projects_completed: 2 }
];

// Model management
let model: tf.Sequential | null = null;
let isModelLoading = false;
let modelLoadError: string | null = null;

// Normalized ranges for each feature (will be determined from training data)
let featureRanges: {min: number[], max: number[]} | null = null;
let outputRange: {min: number, max: number} | null = null;

// Function to load all placement data from Supabase
export const loadPlacementData = async (): Promise<PlacementDataRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('Dataset')
      .select('*');

    if (error) {
      console.error('Error fetching placement data:', error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.warn('No data returned from Supabase, using fallback data');
      return fallbackData;
    }

    console.log(`Successfully loaded ${data.length} records from Supabase`);
    
    // Transform the raw data into our expected format
    return data.map(record => ({
      CGPA: record['CGPA/GPA/Degree_score'] || 0,
      high_school_score: record['12th_grade/Diploma_score/high_school_score'] || 0,
      SSC_score: record['10th_grade_score/SSC_score'] || 0,
      Web_Development: Number(record['Web_Devopment'] || 0),
      Machine_Learning_Experience: Number(record['Machine_Learning_Experience'] || 0),
      Cloud_Computing_Experience: Number(record['Cloud_Computing_Experience'] || 0),
      Database_Experience: Number(record['Database_Experience'] || 0),
      Other_Personal_Skills: Number(record['Other_Personal_Skills'] || 0),
      DSA_CP: Number(record['Data_Structures/Algorithms/Competitive_Programming'] || 0),
      Tech_Internships: Number(record['No_of_Tech_Internships'] || 0),
      Package_LPA: record['Package(in LPA)'] || 0,
      Hackathon_participation: Number(record['No_of_Hackathon_participation'] || 0),
      Projects_completed: Number(record['Number_of_projects_completed'] || 0),
    }));
  } catch (error) {
    console.error('Failed to load placement data from Supabase, using fallback data:', error);
    return fallbackData;
  }
};

// Feature normalization (min-max scaling)
const normalizeFeatures = (data: number[], min: number[], max: number[]): number[] => {
  return data.map((val, i) => {
    if (max[i] - min[i] === 0) return 0; // Handle case where min and max are the same
    return (val - min[i]) / (max[i] - min[i]);
  });
};

// Denormalize the output
const denormalizeOutput = (normalizedVal: number, min: number, max: number): number => {
  return normalizedVal * (max - min) + min;
};

// Create and train the TensorFlow.js model
export const trainPlacementModel = async (): Promise<void> => {
  try {
    isModelLoading = true;
    modelLoadError = null;
    
    // Load data from Supabase
    const placementData = await loadPlacementData();
    
    if (placementData.length === 0) {
      throw new Error('No placement data available for training');
    }
    
    console.log(`Loaded ${placementData.length} records for training`);
    
    // Extract features and labels
    const features = placementData.map(record => [
      record.CGPA,
      record.high_school_score,
      record.SSC_score,
      record.Web_Development,
      record.Machine_Learning_Experience,
      record.Cloud_Computing_Experience, 
      record.Database_Experience,
      record.Other_Personal_Skills,
      record.DSA_CP,
      record.Tech_Internships,
      record.Hackathon_participation,
      record.Projects_completed
    ]);
    
    const labels = placementData.map(record => record.Package_LPA);
    
    // Calculate min and max for each feature for normalization
    const numFeatures = features[0].length;
    const featureMin = Array(numFeatures).fill(Infinity);
    const featureMax = Array(numFeatures).fill(-Infinity);
    
    features.forEach(row => {
      row.forEach((val, j) => {
        featureMin[j] = Math.min(featureMin[j], val);
        featureMax[j] = Math.max(featureMax[j], val);
      });
    });
    
    // Calculate min and max for labels
    const labelMin = Math.min(...labels);
    const labelMax = Math.max(...labels);
    
    // Store normalization ranges
    featureRanges = { min: featureMin, max: featureMax };
    outputRange = { min: labelMin, max: labelMax };
    
    // Normalize the data
    const normalizedFeatures = features.map(row => 
      normalizeFeatures(row, featureMin, featureMax)
    );
    
    const normalizedLabels = labels.map(val => 
      (val - labelMin) / (labelMax - labelMin)
    );
    
    // Convert to tensors
    const xs = tf.tensor2d(normalizedFeatures);
    const ys = tf.tensor1d(normalizedLabels);
    
    // Define the model architecture - FIXED: using tf.sequential() instead of LayersModel
    model = tf.sequential();
    
    // Add layers - FIXED: correct method calls on Sequential model
    model.add(tf.layers.dense({
      inputShape: [numFeatures],
      units: 16,
      activation: 'relu',
    }));
    
    model.add(tf.layers.dense({
      units: 8,
      activation: 'relu',
    }));
    
    model.add(tf.layers.dense({
      units: 1,
      activation: 'linear',
    }));
    
    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError',
    });
    
    // Train the model
    console.log('Starting model training...');
    await model.fit(xs, ys, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
          }
        }
      }
    });
    
    console.log('Model training complete!');
    
    // Clean up tensors
    xs.dispose();
    ys.dispose();
    
    // Return the trained model
    isModelLoading = false;
    return;
    
  } catch (error) {
    console.error('Error training model:', error);
    isModelLoading = false;
    modelLoadError = error instanceof Error ? error.message : 'Unknown error';
    throw error;
  }
};

// Check if model is loaded
export const isModelReady = (): boolean => {
  return model !== null && !isModelLoading;
};

// Check if model is currently loading
export const isModelTraining = (): boolean => {
  return isModelLoading;
};

// Get any model loading error
export const getModelError = (): string | null => {
  return modelLoadError;
};

// Make a prediction using the trained model
export const predictPackage = async (studentData: {
  cgpa: number;
  highSchoolScore: number;
  sscScore: number;
  webDev: number;
  machineLearning: number;
  cloudComputing: number;
  database: number;
  otherSkills: number;
  dsaCP: number;
  techInternships: number;
  hackathons: number;
  projects: number;
}): Promise<number> => {
  if (!model || !featureRanges || !outputRange) {
    throw new Error('Model not trained yet');
  }

  // Format input as array
  const inputFeatures = [
    studentData.cgpa,
    studentData.highSchoolScore,
    studentData.sscScore,
    studentData.webDev,
    studentData.machineLearning,
    studentData.cloudComputing,
    studentData.database,
    studentData.otherSkills,
    studentData.dsaCP,
    studentData.techInternships,
    studentData.hackathons,
    studentData.projects
  ];

  // Normalize input
  const normalizedInput = normalizeFeatures(
    inputFeatures,
    featureRanges.min,
    featureRanges.max
  );

  // Make prediction
  const inputTensor = tf.tensor2d([normalizedInput]);
  const predictionTensor = model.predict(inputTensor) as tf.Tensor;
  const normalizedPrediction = await predictionTensor.data();

  // Clean up tensors
  inputTensor.dispose();
  predictionTensor.dispose();

  // Denormalize the prediction
  const predictedPackage = denormalizeOutput(
    normalizedPrediction[0],
    outputRange.min,
    outputRange.max
  );

  return Math.max(0, predictedPackage); // Ensure no negative salary predictions
};
