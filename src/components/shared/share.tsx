import React, { useState } from "react";
import {
  IoLogoFacebook,
  IoLogoLinkedin,
  IoLogoPinterest,
  IoLogoTwitter,
} from "react-icons/io5";
import { Button, Tooltip, Space, message } from "antd";
import { ShareAltOutlined, LinkOutlined } from "@ant-design/icons";

interface ShareProps {
  title: string;
  description?: string;
  slug: string;
  className?: string;
  type?: 'blog-posts' | 'projects' | 'events' | 'courses' | 'opportunities';
  showModern?: boolean;
}

const Share: React.FC<ShareProps> = ({
  title,
  description,
  slug,
  className,
  type = 'blog-posts',
  showModern = false
}) => {
  const [copied, setCopied] = useState(false);

let base_url = "";

if (typeof window !== "undefined") {
    base_url = window.location.origin;
  }

const pageUrl = `${base_url}/${type}/${slug}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      message.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error('Failed to copy link');
    }
  };

const shareLinks = [
    {
      name: 'Facebook',
      icon: IoLogoFacebook,
      url: `https://facebook.com/sharer/sharer.php?u=${pageUrl}`,
      color: '#1877F2',
      ariaLabel: `Share on Facebook - ${title}`
    },
    {
      name: 'Twitter',
      icon: IoLogoTwitter,
      url: `https://twitter.com/intent/tweet/?text=${encodedTitle}&url=${pageUrl}`,
      color: '#1DA1F2',
      ariaLabel: `Share on Twitter - ${title}`
    },
    {
      name: 'LinkedIn',
      icon: IoLogoLinkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${encodedTitle}&summary=${encodedDescription}&source=${base_url}`,
      color: '#0A66C2',
      ariaLabel: `Share on LinkedIn - ${title}`
    },
    {
      name: 'Pinterest',
      icon: IoLogoPinterest,
      url: `https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${encodedDescription}`,
      color: '#E60023',
      ariaLabel: `Share on Pinterest - ${title}`
    }
  ];

if (showModern) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ marginBottom: '16px' }}>
          <Space align="center">
            <ShareAltOutlined style={{ fontSize: '18px', color: '#22C55E' }} />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
              Share this {type.replace('_', ' ')}
            </span>
          </Space>
        </div>

<Space size="middle" wrap>
          {shareLinks.map((link) => (
            <Tooltip key={link.name} title={`Share on ${link.name}`}>
              <Button
                type="default"
                shape="circle"
                size="large"
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={link.ariaLabel}
                icon={<link.icon size={20} />}
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${link.color}20`,
                  color: link.color,
                  background: 'white',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = link.color;
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 16px ${link.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = link.color;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </Tooltip>
          ))}

<Tooltip title={copied ? 'Copied!' : 'Copy link'}>
            <Button
              type="default"
              shape="circle"
              size="large"
              onClick={handleCopyLink}
              aria-label="Copy link to clipboard"
              icon={<LinkOutlined style={{ fontSize: '18px' }} />}
              style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #22C55E20',
                color: copied ? 'white' : '#22C55E',
                background: copied ? '#22C55E' : 'white',
                transition: 'all 0.3s ease',
              }}
            />
          </Tooltip>
        </Space>
      </div>
    );
  }

// Legacy/Classic view
  return (
    <ul className={className} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {shareLinks.map((link) => (
        <li key={link.name} className="inline-block">
          <a
            aria-label={link.ariaLabel}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="me-2"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              color: link.color,
              transition: 'all 0.2s ease'
            }}
          >
            <link.icon size={25} />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Share;
