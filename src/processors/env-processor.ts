import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ProcessingLayer } from '../layers/processing-layers';
import { StateObserver } from '../monitoring/state-observer';

// Custom error for environment configuration
class EnvironmentConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EnvironmentConfigError';
    }
}

// Interface for environment configuration
interface EnvConfig {
    [key: string]: string | undefined;
}

class EnvironmentProcessor {
    private static instance: EnvironmentProcessor;
    private config: EnvConfig = {};
    private metaState: Map<string, unknown>;
    private stateObserver: StateObserver;

    private constructor() {
        this.metaState = new Map();
        this.stateObserver = new StateObserver();
        this.loadEnvironmentVariables();
        this.initializeProcessingLayers();
    }

    // Singleton pattern
    public static getInstance(): EnvironmentProcessor {
        if (!EnvironmentProcessor.instance) {
            EnvironmentProcessor.instance = new EnvironmentProcessor();
        }
        return EnvironmentProcessor.instance;
    }

    // Load environment variables with multiple file support
    private loadEnvironmentVariables(): void {
        const envFiles = [
            '.env',
            `.env.${process.env.NODE_ENV || 'development'}`,
            '.env.local'
        ];

        envFiles.forEach(file => {
            const envPath = path.resolve(process.cwd(), 'config', file);
            
            if (fs.existsSync(envPath)) {
                const result = dotenv.config({ path: envPath });
                
                if (result.error) {
                    console.warn(`Warning: Could not load environment file ${file}`);
                }
            }
        });

        this.config = { ...process.env };
        this.validateRequiredVariables();
    }

    // Validate critical environment variables
    private validateRequiredVariables(): void {
        const requiredVars = [
            'NODE_ENV',
            'DEBUG'
        ];

        requiredVars.forEach(varName => {
            if (!this.config[varName]) {
                throw new EnvironmentConfigError(`Missing required environment variable: ${varName}`);
            }
        });
    }

    // Securely retrieve an environment variable
    public get(key: string, defaultValue?: string): string {
        const value = this.config[key] || defaultValue;

        if (value === undefined) {
            throw new EnvironmentConfigError(`Environment variable ${key} is not set and no default provided`);
        }

        // Prevent logging of sensitive values
        if (this.isSensitiveKey(key)) {
            return this.maskSensitiveValue(value);
        }

        return value;
    }

    // Check if a key is considered sensitive
    private isSensitiveKey(key: string): boolean {
        const sensitivePatterns = [
            'TOKEN', 
            'SECRET', 
            'PASSWORD', 
            'KEY', 
            'CREDENTIALS'
        ];

        return sensitivePatterns.some(pattern => 
            key.toUpperCase().includes(pattern)
        );
    }

    // Mask sensitive values for logging or display
    private maskSensitiveValue(value: string): string {
        if (value.length <= 4) return '****';
        return value.slice(0, 2) + '****' + value.slice(-2);
    }

    // Get all environment variables (with sensitive values masked)
    public getAllConfig(): EnvConfig {
        return Object.keys(this.config).reduce((acc, key) => {
            acc[key] = this.isSensitiveKey(key) 
                ? this.maskSensitiveValue(this.config[key] || '') 
                : this.config[key];
            return acc;
        }, {} as EnvConfig);
    }

    // Check if running in a specific environment
    public isEnvironment(env: string): boolean {
        return this.get('NODE_ENV') === env;
    }

    // Debug logging with sensitive information protection
    public logConfig(): void {
        if (this.get('DEBUG') === 'true') {
            console.log('Environment Configuration:', this.getAllConfig());
        }
    }

    private initializeProcessingLayers(): void {
        // Layer 1: Environment Recognition
        dotenv.config();
        
        // Layer 2: Meta-state initialization
        this.metaState.set('processingMode', 'adaptive');
        this.metaState.set('recursionDepth', 0);
        
        this.stateObserver.observe(ProcessingLayer.ENVIRONMENT, this.metaState);
    }

    public async processStandardEnv(): Promise<Record<string, unknown>> {
        try {
            // Layer 3: Dynamic Processing
            const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf8');
            const processedEnv = this.parseEnvContent(envContent);
            
            // Layer 4: Configuration Assembly
            const mcpConfig = this.transformToMCPConfig(processedEnv);
            
            this.stateObserver.observe(ProcessingLayer.TRANSFORMATION, mcpConfig);
            
            return mcpConfig;
        } catch (error) {
            this.metaState.set('lastError', error);
            this.stateObserver.observe(ProcessingLayer.META_ANALYSIS, { error });
            throw new Error('Environment processing failed');
        }
    }

    private parseEnvContent(content: string): Record<string, string> {
        return content
            .split('\n')
            .filter(line => line && !line.startsWith('#'))
            .reduce((acc, line) => {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=').trim();
                acc[key.trim()] = value.replace(/^["']|["']$/g, '');
                return acc;
            }, {} as Record<string, string>);
    }

    private transformToMCPConfig(envVars: Record<string, string>): Record<string, unknown> {
        // Layer 5: Configuration Emergence
        return {
            mcpServers: {
                github: {
                    command: 'npx',
                    args: [
                        '-y',
                        '@modelcontextprotocol/server-github'
                    ],
                    env: {
                        GITHUB_PERSONAL_ACCESS_TOKEN: envVars.GITHUB_TOKEN || envVars.GITHUB_PERSONAL_ACCESS_TOKEN
                    }
                }
            }
        };
    }
}

// Export a singleton instance
export const envProcessor = EnvironmentProcessor.getInstance();
