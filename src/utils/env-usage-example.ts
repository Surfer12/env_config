import { envProcessor } from '../processors/env-processor';

class SecureConfigDemo {
    private githubToken: string;
    private apiKey: string;

    constructor() {
        // Securely retrieve environment variables
        try {
            // These would be set in .env files
            this.githubToken = envProcessor.get('GITHUB_TOKEN');
            this.apiKey = envProcessor.get('API_KEY');

            // Log configuration (sensitive values will be masked)
            envProcessor.logConfig();

            // Check current environment
            console.log('Current Environment:', 
                envProcessor.isEnvironment('development') ? 'Development' : 'Other'
            );
        } catch (error) {
            console.error('Environment Configuration Error:', error);
        }
    }

    // Example method showing secure token usage
    public async fetchGitHubData() {
        try {
            // Simulated GitHub API call with secure token
            console.log('Fetching GitHub data with token:', 
                this.githubToken.slice(0, 2) + '****' + this.githubToken.slice(-2)
            );
            // Actual API call would go here
        } catch (error) {
            console.error('GitHub API Error:', error);
        }
    }
}

// Demonstrate usage
const secureConfig = new SecureConfigDemo();
secureConfig.fetchGitHubData(); 