# Cognitive Processing Framework

## Overview

This is an adaptive environment variable processing framework designed to handle `.env` files through a recursive, emergence-based approach.

## Project Structure

```
src/
├── config/           # Configuration-related modules
├── layers/           # Processing layer definitions
│   └── processing-layers.ts
├── monitoring/       # System state observation
│   └── state-observer.ts
├── processors/       # Core processing logic
│   └── env-processor.ts
├── types/            # Type definitions
├── utils/            # Utility functions
└── index.ts          # Main entry point
```

## Key Features

- Dynamic environment variable processing
- Recursive configuration analysis
- Meta-system observation
- Adaptive configuration generation

## Installation

```bash
npm install
npm run build
```

## Usage

```typescript
import { initializeConfig } from './src';

async function main() {
  const config = await initializeConfig();
  console.log(config);
}
```

## Processing Layers

1. **Environment Recognition**
2. **Meta-state Initialization**
3. **Dynamic Processing**
4. **Configuration Assembly**
5. **Configuration Emergence**

## License

MIT License

# Secure Environment Variable Processor

## Overview

This project provides a robust, secure mechanism for handling environment variables in a TypeScript application. The `EnvironmentProcessor` ensures:

- Secure loading of environment variables from multiple sources
- Masking of sensitive information
- Validation of critical configuration parameters
- Flexible environment-specific configuration

## Features

- 🔒 Secure Environment Variable Handling
- 🌐 Multi-Environment Support
- 🕵️ Sensitive Data Protection
- 🚦 Configuration Validation

## Installation

```bash
npm install
```

## Usage

### Basic Configuration

1. Create a `.env` file in the `config/` directory:

```
NODE_ENV=development
DEBUG=true
GITHUB_TOKEN=your_github_token
API_KEY=your_api_key
```

2. Use the environment processor in your code:

```typescript
import { envProcessor } from './processors/env-processor';

// Retrieve a configuration value
const githubToken = envProcessor.get('GITHUB_TOKEN');

// Log configuration (sensitive values will be masked)
envProcessor.logConfig();

// Check current environment
if (envProcessor.isEnvironment('development')) {
    console.log('Running in development mode');
}
```

## Security Mechanisms

- Sensitive keys (containing TOKEN, SECRET, PASSWORD, etc.) are automatically masked
- Multiple environment files are supported (`.env`, `.env.development`, `.env.local`)
- Required variables are validated during initialization

## Error Handling

The processor throws `EnvironmentConfigError` for:
- Missing required environment variables
- Attempts to access undefined variables without a default

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License 