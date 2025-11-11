// AI provider configuration (OpenRouter / OpenAI switch)
module.exports = {
  provider: process.env.AI_PROVIDER || 'openrouter',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openAiApiKey: process.env.OPENAI_API_KEY || ''
};
