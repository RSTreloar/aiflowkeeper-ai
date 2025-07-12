const { Anthropic } = require('@anthropic-ai/sdk');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AIFlowKeeper is ready!',
    features: [
      'Claude AI Integration',
      'Conversation Management',
      'Project Tracking'
    ]
  });
});

// Chat route
app.all('/chat', async (req, res) => {
  try {
    // Extract API key from environment
    const apiKey = process.env.CLAUDE_API_KEY;

    // Validate API key
    if (!apiKey) {
      return res.status(401).json({ 
        error: "Authentication failed", 
        details: "No API key provided" 
      });
    }

    // Initialize Anthropic with API key
    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    const message = req.body.message || "Hello, how can I help you?";
    
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{ role: "user", content: message }]
    });

    res.json({ 
      reply: response.content[0].text,
      metadata: {
        model: "claude-3-sonnet",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Claude AI Error:', error);
    res.status(500).json({ 
      error: "AI interaction failed", 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AIFlowKeeper running on port ${PORT}`);
  console.log(`Features activated:
    - Basic Server
    - Claude AI Integration
    - Conversation Management`);
});