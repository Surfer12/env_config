import { AdaptiveEnvProcessor } from './processors/env-processor';

async function initializeConfig() {
  const processor = new AdaptiveEnvProcessor();
  
  try {
    const config = await processor.processStandardEnv();
    return config;
  } catch (error) {
    console.error('Configuration initialization failed:', error);
    throw error;
  }
}

export { initializeConfig };
