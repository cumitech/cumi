// services/chatService.ts
export interface AIServiceConfig {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    maxRetries?: number;
    retryDelay?: number;
}

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

class AIService {
    private config: AIServiceConfig;

    constructor(config: AIServiceConfig) {
        this.config = {
            maxRetries: 3,
            retryDelay: 1000,
            ...config,
        };
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async makeRequestWithRetry(
        url: string,
        options: RequestInit,
        retryCount = 0
    ): Promise<Response> {
        try {
            const response = await fetch(url, options);
            
            if (response.status === 429 && retryCount < (this.config.maxRetries || 3)) {
                const retryAfter = response.headers.get('retry-after');
                const delayMs = retryAfter 
                    ? parseInt(retryAfter) * 1000 
                    : (this.config.retryDelay || 1000) * Math.pow(2, retryCount);
                
                await this.delay(delayMs);
                return this.makeRequestWithRetry(url, options, retryCount + 1);
            }

            if (!response.ok) {
                const errorBody = await response.text();
                let errorMessage = `API error: ${response.status} ${response.statusText}`;
                
                try {
                    const errorData = JSON.parse(errorBody);
                    if (errorData.error?.message) {
                        errorMessage = errorData.error.message;
                    }
                } catch {
                    // Use default error message if parsing fails
                }
                
                throw new Error(errorMessage);
            }

            return response;
        } catch (error: any) {
            if (retryCount < (this.config.maxRetries || 3) && 
                (error instanceof TypeError || error.message.includes('network'))) {
                await this.delay((this.config.retryDelay || 1000) * Math.pow(2, retryCount));
                return this.makeRequestWithRetry(url, options, retryCount + 1);
            }
            throw error;
        }
    }

    async generateResponse(messages: AIMessage[]): Promise<AIResponse> {
        try {
            const response = await this.makeRequestWithRetry('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.config.model || 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: this.config.maxTokens || 150,
                    temperature: this.config.temperature || 0.7,
                    stream: false,
                }),
            });

            const data = await response.json();
            return {
                content: data.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
                usage: {
                    promptTokens: data.usage?.prompt_tokens || 0,
                    completionTokens: data.usage?.completion_tokens || 0,
                    totalTokens: data.usage?.total_tokens || 0,
                },
            };
        } catch (error) {
            console.error('Service Error:', error);
            
            // Return user-friendly error messages
            if (error instanceof Error) {
                if (error.message.includes('429')) {
                    throw new Error('I\'m receiving too many requests right now. Please wait a moment and try again.');
                } else if (error.message.includes('401')) {
                    throw new Error('There\'s an authentication issue. Please check the API configuration.');
                } else if (error.message.includes('quota')) {
                    throw new Error('The API quota has been exceeded. Please try again later.');
                } else if (error.message.includes('network') || error instanceof TypeError) {
                    throw new Error('There\'s a network connectivity issue. Please check your connection and try again.');
                }
            }
            throw new Error('I\'m experiencing technical difficulties. Please try again in a moment.');
        }
    }

    // Streaming support with retry logic
    async generateStreamingResponse(
        messages: AIMessage[],
        onToken: (token: string) => void,
        onComplete: (response: AIResponse) => void,
        onError: (error: Error) => void
    ): Promise<void> {
        let retryCount = 0;
        
        const attemptStream = async (): Promise<void> => {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.config.apiKey}`,
                    },
                    body: JSON.stringify({
                        model: this.config.model || 'gpt-3.5-turbo',
                        messages: messages,
                        max_tokens: this.config.maxTokens || 150,
                        temperature: this.config.temperature || 0.7,
                        stream: true,
                    }),
                });

                if (response.status === 429 && retryCount < (this.config.maxRetries || 3)) {
                    const retryAfter = response.headers.get('retry-after');
                    const delayMs = retryAfter 
                        ? parseInt(retryAfter) * 1000 
                        : (this.config.retryDelay || 1000) * Math.pow(2, retryCount);
                    
                    retryCount++;
                    await this.delay(delayMs);
                    return attemptStream();
                }

                if (!response.ok) {
                    const errorBody = await response.text();
                    let errorMessage = `API error: ${response.status}`;
                    
                    try {
                        const errorData = JSON.parse(errorBody);
                        if (errorData.error?.message) {
                            errorMessage = errorData.error.message;
                        }
                    } catch {
                        // Use default error message
                    }
                    
                    throw new Error(errorMessage);
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let fullContent = '';

                if (!reader) {
                    throw new Error('Failed to get response reader');
                }

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                onComplete({
                                    content: fullContent,
                                });
                                return;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                const token = parsed.choices[0]?.delta?.content || '';
                                if (token) {
                                    fullContent += token;
                                    onToken(token);
                                }
                            } catch (e) {
                                // Ignore parsing errors for malformed chunks
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Streaming Error:', error);
                
                // Handle specific error types with user-friendly messages
                let userMessage = 'I\'m experiencing technical difficulties. Please try again in a moment.';
                
                if (error instanceof Error) {
                    if (error.message.includes('429')) {
                        userMessage = 'I\'m receiving too many requests right now. Please wait a moment and try again.';
                    } else if (error.message.includes('401')) {
                        userMessage = 'There\'s an authentication issue. Please check the API configuration.';
                    } else if (error.message.includes('quota')) {
                        userMessage = 'The API quota has been exceeded. Please try again later.';
                    } else if (error.message.includes('network') || error instanceof TypeError) {
                        userMessage = 'There\'s a network connectivity issue. Please check your connection and try again.';
                    }
                }
                
                onError(new Error(userMessage));
            }
        };

        await attemptStream();
    }
}

export default AIService;
