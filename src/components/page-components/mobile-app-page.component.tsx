"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";

export default function MobileAppPageComponent() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>
      
      {/* Hero Section */}
      <section style={{ 
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: "100px 0 80px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Enhanced Background Pattern */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322C55E' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* Floating Elements */}
        <div style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)",
          filter: "blur(40px)",
          animation: "float 6s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
          filter: "blur(30px)",
          animation: "float 8s ease-in-out infinite reverse"
        }} />
        
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
            {/* Enhanced Badge */}
            <div style={{ 
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px", 
              background: "linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)", 
              borderRadius: "50px", 
              marginBottom: "40px",
              color: "white",
              fontSize: "15px",
              fontWeight: "700",
              boxShadow: "0 8px 24px rgba(34, 197, 94, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)"
            }}>
              <span style={{ fontSize: "18px" }}>🚀</span>
              <span>COMING SOON</span>
            </div>
            
            {/* Enhanced Title */}
            <h1 style={{ 
              fontSize: "clamp(2.75rem, 7vw, 4.5rem)", 
              marginBottom: "32px",
              background: "linear-gradient(135deg, #1e293b 0%, #22C55E 50%, #0EA5E9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: "1.05",
              fontWeight: "900",
              letterSpacing: "-0.03em",
              textShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}>
              CUMI Mobile App
            </h1>
            
            {/* Enhanced Subtitle */}
            <p style={{ 
              fontSize: "clamp(1.25rem, 3vw, 1.5rem)", 
              color: "#64748b", 
              maxWidth: "700px", 
              margin: "0 auto 56px",
              lineHeight: "1.7",
              fontWeight: "400"
            }}>
              Transform your learning and teaching experience with our powerful mobile app. 
              Access the complete LMS and Creator Dashboard seamlessly on iOS and Android.
            </p>

            {/* Enhanced Platform Icons */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: "40px",
              marginBottom: "64px",
              flexWrap: "wrap"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "16px",
                padding: "20px 32px",
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
              }}
              >
                <span style={{ fontSize: "32px" }}>🍎</span>
                <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "18px" }}>iOS</span>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "16px",
                padding: "20px 32px",
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
              }}
              >
                <span style={{ fontSize: "32px" }}>🤖</span>
                <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "18px" }}>Android</span>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section style={{ padding: "100px 0", background: "white" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)",
              borderRadius: "20px",
              marginBottom: "24px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              <span>✨</span>
              <span>FEATURES</span>
            </div>
            <h2 style={{
              fontSize: "clamp(2.25rem, 5vw, 3rem)",
              fontWeight: "800",
              color: "#1e293b",
              marginBottom: "20px",
              lineHeight: "1.1",
              letterSpacing: "-0.02em"
            }}>
              Powerful Features
            </h2>
            <p style={{
              fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
              color: "#64748b",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.7",
              fontWeight: "400"
            }}>
              Everything you need for seamless mobile learning and teaching
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "40px",
            marginBottom: "80px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "28px",
              padding: "48px 40px",
              textAlign: "center",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.06)";
            }}
            >
              {/* Background decoration */}
              <div style={{
                position: "absolute",
                top: "-50%",
                right: "-20%",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)",
                zIndex: 0
              }} />
              
              <div style={{
                width: "96px",
                height: "96px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                fontSize: "40px",
                boxShadow: "0 12px 32px rgba(34, 197, 94, 0.3)",
                position: "relative",
                zIndex: 1
              }}>
                📱
              </div>
              <h3 style={{ 
                fontSize: "1.5rem",
                fontWeight: "700", 
                color: "#1e293b",
                marginBottom: "20px",
                lineHeight: "1.3"
              }}>
                Seamless Learning
              </h3>
              <p style={{ 
                color: "#64748b", 
                lineHeight: "1.7",
                fontSize: "1.125rem",
                maxWidth: "280px",
                margin: "0 auto"
              }}>
                Access all courses, lessons, and content from anywhere, anytime with our intuitive mobile interface designed for optimal learning.
              </p>
            </div>
            
            <div style={{
              background: "white",
              borderRadius: "28px",
              padding: "48px 40px",
              textAlign: "center",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.06)";
            }}
            >
              {/* Background decoration */}
              <div style={{
                position: "absolute",
                top: "-50%",
                right: "-20%",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
                zIndex: 0
              }} />
              
              <div style={{
                width: "96px",
                height: "96px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                fontSize: "40px",
                boxShadow: "0 12px 32px rgba(14, 165, 233, 0.3)",
                position: "relative",
                zIndex: 1
              }}>
                🎯
              </div>
              <h3 style={{ 
                fontSize: "1.5rem",
                fontWeight: "700", 
                color: "#1e293b",
                marginBottom: "20px",
                lineHeight: "1.3"
              }}>
                Creator Dashboard
              </h3>
              <p style={{ 
                color: "#64748b", 
                lineHeight: "1.7",
                fontSize: "1.125rem",
                maxWidth: "280px",
                margin: "0 auto"
              }}>
                Manage courses, track analytics, engage with students, and monitor your content performance with powerful mobile tools.
              </p>
            </div>
            
            <div style={{
              background: "white",
              borderRadius: "28px",
              padding: "48px 40px",
              textAlign: "center",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.06)";
            }}
            >
              {/* Background decoration */}
              <div style={{
                position: "absolute",
                top: "-50%",
                right: "-20%",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%)",
                zIndex: 0
              }} />
              
              <div style={{
                width: "96px",
                height: "96px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                fontSize: "40px",
                boxShadow: "0 12px 32px rgba(245, 158, 11, 0.3)",
                position: "relative",
                zIndex: 1
              }}>
                ⚡
              </div>
              <h3 style={{ 
                fontSize: "1.5rem",
                fontWeight: "700", 
                color: "#1e293b",
                marginBottom: "20px",
                lineHeight: "1.3"
              }}>
                Offline Access
              </h3>
              <p style={{ 
                color: "#64748b", 
                lineHeight: "1.7",
                fontSize: "1.125rem",
                maxWidth: "280px",
                margin: "0 auto"
              }}>
                Download content for offline viewing. Learn and teach even without an internet connection, anywhere you go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: "100px 0",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Enhanced background elements */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)",
          filter: "blur(60px)",
          animation: "float 10s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
          filter: "blur(50px)",
          animation: "float 12s ease-in-out infinite reverse"
        }} />
        
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ 
            background: "white", 
            borderRadius: "40px", 
            padding: "80px 64px", 
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 32px 80px rgba(0, 0, 0, 0.12)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Enhanced background decoration */}
            <div style={{
              position: "absolute",
              top: "-60%",
              right: "-25%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(14, 165, 233, 0.06) 100%)",
              zIndex: 0
            }} />
            <div style={{
              position: "absolute",
              bottom: "-40%",
              left: "-20%",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(14, 165, 233, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)",
              zIndex: 0
            }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)",
                borderRadius: "25px",
                marginBottom: "32px",
                color: "white",
                fontSize: "15px",
                fontWeight: "700",
                boxShadow: "0 8px 24px rgba(34, 197, 94, 0.3)"
              }}>
                <span style={{ fontSize: "18px" }}>🚀</span>
                <span>LAUNCH TIMELINE</span>
              </div>
              
              <h2 style={{ 
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: "900", 
                color: "#1e293b",
                marginBottom: "24px",
                lineHeight: "1.05",
                letterSpacing: "-0.02em"
              }}>
                Expected Launch
              </h2>
              
              <div style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: "800",
                marginBottom: "32px",
                letterSpacing: "-0.01em"
              }}>
                Q2 2025
              </div>
              
              <p style={{ 
                color: "#64748b", 
                fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
                lineHeight: "1.7",
                maxWidth: "700px",
                margin: "0 auto 48px",
                fontWeight: "400"
              }}>
                We&apos;re working hard to bring you the best mobile learning experience. 
                Join our waitlist to be the first to know when we launch!
              </p>
              
              <button 
                style={{
                  background: "linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "24px 48px",
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 12px 32px rgba(34, 197, 94, 0.4)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isHovered ? "translateY(-6px) scale(1.05)" : "translateY(0) scale(1)",
                  minWidth: "320px",
                  letterSpacing: "0.01em"
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span style={{ fontSize: "20px", marginRight: "8px" }}>🔔</span>
                Notify Me When Ready
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section style={{ padding: "80px 0", background: "white" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ 
            textAlign: "center", 
            padding: "56px 48px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRadius: "32px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Subtle background decoration */}
            <div style={{
              position: "absolute",
              top: "-30%",
              right: "-20%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, rgba(14, 165, 233, 0.03) 100%)",
              zIndex: 0
            }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "rgba(34, 197, 94, 0.1)",
                borderRadius: "20px",
                marginBottom: "24px",
                color: "#22C55E",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                <span>💡</span>
                <span>WHILE YOU WAIT</span>
              </div>
              
              <p style={{ 
                color: "#64748b", 
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                lineHeight: "1.7",
                margin: "0 0 24px 0",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto"
              }}>
                In the meantime, you can access all our features through our web platform
              </p>
              
              <Link 
                href="/" 
                style={{ 
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#22C55E", 
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "1.25rem",
                  transition: "all 0.3s ease",
                  padding: "12px 24px",
                  borderRadius: "16px",
                  background: "rgba(34, 197, 94, 0.05)",
                  border: "1px solid rgba(34, 197, 94, 0.1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "rgba(34, 197, 94, 0.1)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(34, 197, 94, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(34, 197, 94, 0.05)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>cumi.dev</span>
                <span style={{ fontSize: "18px" }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
