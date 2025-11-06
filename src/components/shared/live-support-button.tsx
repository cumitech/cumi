"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Card, Space, Typography, Avatar, Input, message, Badge, Spin, Divider } from 'antd';
import { 
  MessageOutlined, 
  RobotOutlined, 
  UserOutlined, 
  SendOutlined,
  WhatsAppOutlined,
  SettingOutlined,
  CloseOutlined,
  CustomerServiceOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useTranslation } from '@contexts/translation.context';
import AIService, { AIServiceConfig, AIMessage } from '../../service/ai.sevice';

const { Text } = Typography;
const { TextArea } = Input;

// Add modern CUMI-themed styles
const modernSupportStyles = `
  .modern-support-modal .ant-modal-content {
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(34, 197, 94, 0.15);
    overflow: hidden;
    border: 1px solid rgba(34, 197, 94, 0.1);
  }

.modern-support-modal .ant-modal-header {
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%);
    border-bottom: 2px solid rgba(34, 197, 94, 0.1);
    padding: 24px;
  }

.modern-support-modal .ant-modal-body {
    padding: 0;
  }

.modern-support-modal .ant-modal-close {
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.1);
    transition: all 0.3s ease;
  }

.modern-support-modal .ant-modal-close:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: rotate(90deg);
  }

@media (max-width: 768px) {
    .modern-support-modal {
      max-width: 95vw !important;
      margin: 10px auto !important;
    }

.modern-support-modal .ant-modal-content {
      max-height: 90vh;
    }
  }
`;

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'agent';
  message: string;
  timestamp: Date;
  sender?: string;
  isStreaming?: boolean;
}

interface LiveSupportProps {
  aiConfig?: AIServiceConfig;
  companyName?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;
}

export const LiveSupportButton: React.FC<LiveSupportProps> = ({ 
  aiConfig,
  companyName = 'CumiTech',
  supportEmail = 'info@cumi.dev',
  supportPhone = '+237-673-687-549',
  whatsappNumber = '+237681289411'
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [supportMode, setSupportMode] = useState<'ai' | 'agent'>('ai');
  const [agentStatus, setAgentStatus] = useState<'available' | 'busy' | 'offline'>('available');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiService, setAIService] = useState<AIService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiConfig) {
      try {
        const service = new AIService(aiConfig);
        setAIService(service);

        const greeting: ChatMessage = {
          id: '1',
          type: 'ai',
          message: `Hello! I'm your assistant for ${companyName}. How can I help you today?`,
          timestamp: new Date(),
        };
        setMessages([greeting]);
      } catch (error) {
        console.error('Failed to initialize service:', error);
        message.error('Service initialization failed. Please check your configuration.');
      }
    } else {
      // Fallback to demo mode
      const greeting: ChatMessage = {
        id: '1',
        type: 'ai',
        message: 'Hello! I\'m your assistant (Demo Mode). How can I help you today?',
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [aiConfig, companyName]);

// Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

// Create system prompt based on company context
  const createSystemPrompt = (): string => {
    return `You are a helpful customer support assistant for ${companyName}. 

Your role:
    - Provide friendly, professional customer support
    - Answer questions about products, services, and policies
    - Help resolve customer issues
    - If you cannot help with something, offer to connect them with a human agent
    - Keep responses concise and helpful

Company Information:
    - Company: ${companyName}
    - Support Email: ${supportEmail}
    - Support Phone: ${supportPhone}

Guidelines:
    - Be empathetic and understanding
    - Provide accurate information only
    - If unsure, admit it and offer alternative help
    - Use a conversational but professional tone`;
  };

const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
    };

setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

try {
      if (supportMode === 'ai' && aiService) {
        await handleAIResponse(userMessage);
      } else {
        await handleAgentResponse(userMessage);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      setIsTyping(false);

const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact our support team directly.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

const handleAIResponse = async (userMessage: ChatMessage) => {
    if (!aiService) {
      // Fallback to simple responses if no service
      setTimeout(() => {
        const response = getSimpleResponse(userMessage.message);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          message: response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
      return;
    }

// Build conversation history
    const conversationHistory: AIMessage[] = [
      { role: 'system', content: createSystemPrompt() },
      ...messages
        .filter(m => m.type !== 'agent')
        .slice(-10) // Keep last 10 messages for context
        .map(m => ({
          role: m.type === 'user' ? 'user' as const : 'assistant' as const,
          content: m.message,
        })),
      { role: 'user', content: userMessage.message },
    ];

// Create a streaming response message
    const streamingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      message: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, streamingMessage]);
    setIsTyping(false);

try {
      await aiService.generateStreamingResponse(
        conversationHistory,
        (token: string) => {
          // Update the streaming message with new tokens
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, message: msg.message + token }
              : msg
          ));
        },
        (response: any) => {
          // Mark streaming as complete
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          ));
        },
        (error: any) => {
          console.error('AI Streaming Error:', error);
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { 
                  ...msg, 
                  message: 'I apologize, but I\'m having trouble responding right now. Please try again.',
                  isStreaming: false 
                }
              : msg
          ));
        }
      );
    } catch (error) {
      // Fallback to regular response
      const response = await aiService.generateResponse(conversationHistory);
      setMessages(prev => prev.map(msg => 
        msg.id === streamingMessage.id 
          ? { ...msg, message: response.content, isStreaming: false }
          : msg
      ));
    }
  };

const handleAgentResponse = async (userMessage: ChatMessage) => {
    // Simulate agent response (replace with your live chat integration)
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        message: 'Thank you for your message. A live agent will respond to you shortly. Our typical response time is under 5 minutes.',
        timestamp: new Date(),
        sender: 'Live Support Team',
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

const getSimpleResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

if (message.includes('help') || message.includes('support')) {
      return `I'm here to help! You can ask me about our services, or contact us directly at ${supportEmail} or ${supportPhone}. Would you like to connect with a live agent?`;
    }

if (message.includes('course') || message.includes('learn')) {
      return 'We offer various courses and learning opportunities. You can browse our courses page or contact our team for more information about enrollment.';
    }

if (message.includes('event') || message.includes('workshop')) {
      return 'We regularly host events and workshops! Check our events page for upcoming sessions. You can also register for events directly from the website.';
    }

if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return `You can reach us at ${supportEmail} or call us at ${supportPhone}. Our support hours are Monday-Friday, 9 AM - 6 PM. Would you like to speak with someone directly?`;
    }

return `Thank you for your message! I'm here to help with any questions about ${companyName}. Could you provide more details about what you need assistance with?`;
  };

const connectToAgent = () => {
    if (agentStatus === 'offline') {
      message.warning('Live agents are currently offline. Please try again later or continue chatting with AI.');
      return;
    }

if (agentStatus === 'busy') {
      message.info('All agents are currently busy. You\'re in queue. Please wait...');
      return;
    }

try {
      // Clean the phone number - remove all non-numeric characters
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

// Validate phone number
      if (!cleanNumber || cleanNumber.length < 10) {
        message.error('Invalid WhatsApp number. Please contact support via email.');
        return;
      }

// Create WhatsApp message
      const whatsappMessage = `Hello! I need support from ${companyName}. I was chatting with your AI assistant and would like to speak with a live agent.`;

// Create WhatsApp URL with proper encoding
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// Use setTimeout to prevent browser issues
      setTimeout(() => {
        try {
          // Open WhatsApp in a new tab with error handling
          const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

if (newWindow) {
            message.success('Opening WhatsApp to connect with our live agent!');
          } else {
            // Fallback if popup is blocked - try direct navigation
            try {
              window.location.href = whatsappUrl;
            } catch (fallbackError) {
              console.error('Fallback navigation failed:', fallbackError);
              message.info('Please allow popups or copy this number to WhatsApp: ' + whatsappNumber);
            }
          }
        } catch (windowError) {
          console.error('Window open failed:', windowError);
          message.error('Unable to open WhatsApp. Please contact us directly at: ' + supportEmail);
        }
      }, 100);

} catch (error) {
      console.error('Error opening WhatsApp:', error);
      message.error('Unable to open WhatsApp. Please contact us directly at: ' + supportEmail);
    }
  };

const getStatusColor = () => {
    switch (agentStatus) {
      case 'available': return '#52c41a';
      case 'busy': return '#faad14';
      case 'offline': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

const getStatusText = () => {
    switch (agentStatus) {
      case 'available': return t('support.available') || 'Available';
      case 'busy': return t('support.busy') || 'Busy';
      case 'offline': return t('support.offline') || 'Offline';
      default: return 'Unknown';
    }
  };

return (
    <>
      {}
      <style dangerouslySetInnerHTML={{ __html: modernSupportStyles }} />

{}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
        }}
      >
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<CustomerServiceOutlined />}
          onClick={() => setIsOpen(true)}
          style={{
            width: '64px',
            height: '64px',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
            background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(34, 197, 94, 0.4)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #0d9488 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)';
          }}
        />

{}
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />
      </div>

{}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '8px 0',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <Space>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
              }}>
                <CustomerServiceOutlined style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                {t('support.title') || 'Customer Support'}
              </span>
            </Space>
            <Badge 
              status={agentStatus === 'available' ? 'success' : agentStatus === 'busy' ? 'warning' : 'error'} 
              text={getStatusText()}
              style={{ fontSize: '13px', fontWeight: 600 }}
            />
          </div>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={600}
        style={{ top: 20, maxWidth: '95vw' }}
        styles={{ body: { padding: 0 } }}
        className="modern-support-modal"
        centered
      >
        <Card style={{ 
          backgroundColor: 'white', 
          border: 'none', 
          height: 'clamp(400px, 70vh, 600px)', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '0',
        }}>
          {}
          <div style={{ 
            padding: '24px', 
            borderBottom: '2px solid rgba(34, 197, 94, 0.1)',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ fontSize: '15px', color: '#1f2937', fontWeight: 600 }}>
                Choose Support Option
              </Text>
            </div>
            <Space size="middle" wrap style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                type={supportMode === 'ai' ? 'primary' : 'default'}
                icon={<RobotOutlined />}
                onClick={() => setSupportMode('ai')}
                size="large"
                style={{
                  borderRadius: '12px',
                  height: '44px',
                  padding: '0 24px',
                  fontWeight: 600,
                  ...(supportMode === 'ai' ? {
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #0284c7 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                  } : {
                    borderColor: '#e5e7eb',
                  })
                }}
              >
                {t('support.ai_chat') || 'AI Assistant'}
              </Button>
              <Button
                type="default"
                icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
                onClick={connectToAgent}
                size="large"
                disabled={agentStatus === 'offline'}
                style={{
                  borderRadius: '12px',
                  height: '44px',
                  padding: '0 24px',
                  fontWeight: 600,
                  borderColor: agentStatus === 'offline' ? '#e5e7eb' : '#25D366',
                  color: agentStatus === 'offline' ? '#9ca3af' : '#25D366',
                  background: agentStatus === 'offline' ? '#f9fafb' : 'white',
                }}
              >
                {t('support.live_agent') || 'WhatsApp'}
              </Button>
            </Space>
            {!aiConfig && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                  Demo Mode - Configure AI settings for full functionality
                </Text>
              </div>
            )}
          </div>

{}
          <div style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto', 
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  {msg.type !== 'user' && (
                    <Avatar
                      size="default"
                      icon={msg.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                      style={{
                        background: msg.type === 'ai' 
                          ? 'linear-gradient(135deg, #0EA5E9 0%, #0284c7 100%)'
                          : 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '2px solid white',
                      }}
                    />
                  )}
                  <div
                    style={{
                      maxWidth: '75%',
                      background: msg.type === 'user' 
                        ? 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)'
                        : 'white',
                      color: msg.type === 'user' ? 'white' : '#1f2937',
                      padding: '14px 18px',
                      borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
                      border: msg.type === 'user' ? 'none' : '1px solid rgba(34, 197, 94, 0.1)',
                      order: msg.type === 'user' ? -1 : 0,
                    }}
                  >
                    {msg.sender && (
                      <Text style={{ 
                        fontSize: '11px', 
                        opacity: 0.8, 
                        display: 'block',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        {msg.sender}
                      </Text>
                    )}
                    <div style={{ 
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.4',
                      fontSize: '14px'
                    }}>
                      {msg.message}
                      {msg.isStreaming && <Spin size="small" style={{ marginLeft: '8px' }} />}
                    </div>
                    <Text style={{ 
                      fontSize: '10px', 
                      opacity: 0.6, 
                      display: 'block', 
                      marginTop: '6px',
                      textAlign: 'right'
                    }}>
                      {msg.timestamp.toLocaleTimeString()}
                    </Text>
                  </div>
                  {msg.type === 'user' && (
                    <Avatar 
                      size="default" 
                      icon={<UserOutlined />} 
                      style={{ 
                        background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '2px solid white',
                      }} 
                    />
                  )}
                </div>
              ))}

{isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar 
                    size="default" 
                    icon={<RobotOutlined />} 
                    style={{ 
                      background: 'linear-gradient(135deg, #0EA5E9 0%, #0284c7 100%)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      border: '2px solid white',
                    }} 
                  />
                  <div style={{
                    backgroundColor: 'white',
                    padding: '14px 18px',
                    borderRadius: '18px 18px 18px 4px',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(14, 165, 233, 0.1)'
                  }}>
                    <Space>
                      <Spin size="small" style={{ color: '#0EA5E9' }} />
                      <Text style={{ fontStyle: 'italic', color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
                        {supportMode === 'ai' ? 'AI is thinking...' : 'Agent is typing...'}
                      </Text>
                    </Space>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </Space>
          </div>

{}
          <div style={{ 
            padding: '24px', 
            borderTop: '2px solid rgba(34, 197, 94, 0.1)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
          }}>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{ 
                  borderRadius: '14px 0 0 14px',
                  border: '1.5px solid #e5e7eb',
                  height: '52px',
                  fontSize: '15px',
                  padding: '0 20px',
                }}
                disabled={isTyping}
                size="large"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                loading={isTyping}
                style={{
                  borderRadius: '0 14px 14px 0',
                  height: '52px',
                  width: '52px',
                  background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isTyping && inputMessage.trim()) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #0d9488 100%)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
                }}
                size="large"
              />
            </Space.Compact>

{}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Space size="middle" wrap style={{ justifyContent: 'center' }}>
                <Button 
                  size="middle" 
                  icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
                  onClick={connectToAgent}
                  style={{
                    borderRadius: '24px',
                    borderColor: '#25D366',
                    color: '#25D366',
                    fontWeight: 600,
                    height: '36px',
                    padding: '0 16px',
                  }}
                >
                  WhatsApp
                </Button>
                <Button 
                  size="middle" 
                  icon={<MailOutlined />}
                  onClick={() => window.open(`mailto:${supportEmail}`, '_blank')}
                  style={{ 
                    borderRadius: '24px',
                    borderColor: '#0EA5E9',
                    color: '#0EA5E9',
                    fontWeight: 600,
                    height: '36px',
                    padding: '0 16px',
                  }}
                >
                  Email
                </Button>
                <Button 
                  size="middle" 
                  onClick={() => {
                    setMessages(messages.slice(0, 1)); // Keep initial greeting
                    message.success('Chat cleared');
                  }}
                  style={{ 
                    borderRadius: '24px',
                    fontWeight: 600,
                    height: '36px',
                    padding: '0 16px',
                  }}
                >
                  Clear
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </Modal>
    </>
  );
};
