"use client"

export default function LandingPageStyles() {
  return (
    <style jsx global>{`
      .landing-page {
        font-family: system-ui, -apple-system, sans-serif;
      }

      .hero-section {
        position: relative;
        padding: 6rem 2rem;
        overflow: hidden;
        background: linear-gradient(135deg, #000B3F 0%, #0D0034 100%);
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 4rem;
        text-align: center;
        color: white;
      }

      .hero-content {
        position: relative;
        z-index: 2;
        max-width: 800px;
      }

      .hero-title {
        font-size: 4rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        line-height: 1.2;
      }

      .subtitle {
        font-size: 1.5rem;
        font-weight: 500;
        margin-top: 0.5rem;
      }

      .gradient-text {
        background: linear-gradient(45deg, #FF5F6D, #FFC371);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
      }

      .hero-description {
        font-size: 1.5rem;
        margin-bottom: 2.5rem;
        opacity: 0.9;
        display: block;
        line-height: 1.5;
      }

      .hero-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      .primary-button {
        background: linear-gradient(45deg, #5F2EEA, #4263EB);
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
        transition: all 0.3s ease;
        border: none;
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .primary-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
      }

      .secondary-button {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .secondary-button:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .hero-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }

      .floating-cube {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        border-radius: 1rem;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: float 8s infinite ease-in-out;
      }

      .cube-1 {
        width: 120px;
        height: 120px;
        top: 20%;
        left: 15%;
        animation-delay: 0s;
      }

      .cube-2 {
        width: 80px;
        height: 80px;
        top: 50%;
        right: 20%;
        animation-delay: 1s;
      }

      .cube-3 {
        width: 60px;
        height: 60px;
        bottom: 20%;
        left: 30%;
        animation-delay: 2s;
      }

      .pulse-circle {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(104, 89, 222, 0.3) 0%, rgba(104, 89, 222, 0) 70%);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 4s infinite ease-in-out;
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(5deg);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 0.2;
        }
      }

      .section-title {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 3rem;
        background: linear-gradient(45deg, #5F2EEA, #4263EB);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
      }

      .features-section {
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        width: 100%;
        max-width: 1200px;
      }

      .feature-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        text-align: center;
      }

      .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
      }

      .feature-card h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .feature-card p {
        color: #666;
        line-height: 1.6;
        margin: 0;
        font-size: 1rem;
      }

      .code-demo-section {
        padding: 4rem 2rem;
        background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
        border-radius: 1rem;
        margin: 4rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .code-container {
        width: 100%;
        max-width: 700px;
        margin-bottom: 2rem;
      }

      .code-block {
        background: #1E293B;
        color: #E2E8F0;
        padding: 2rem;
        border-radius: 0.75rem;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        line-height: 1.6;
        overflow-x: auto;
      }

      .code-description {
        font-size: 1.125rem;
        color: #475569;
        text-align: center;
        margin-top: 1rem;
        font-weight: 500;
      }

      .stats-section {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 2rem;
        padding: 3rem 2rem;
        max-width: 1000px;
        margin: 0 auto 4rem;
      }

      .stat-item {
        text-align: center;
      }

      .stat-number {
        font-size: 3.5rem;
        font-weight: 800;
        color: #5F2EEA;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 1.25rem;
        color: #64748B;
        font-weight: 500;
      }

      .cta-section {
        padding: 4rem 2rem;
        text-align: center;
        background: linear-gradient(135deg, #000B3F 0%, #0D0034 100%);
        color: white;
        border-radius: 1rem;
        margin-bottom: 3rem;
      }

      .cta-description {
        font-size: 1.25rem;
        max-width: 600px;
        margin: 0 auto 2rem;
        opacity: 0.9;
        line-height: 1.5;
      }

      .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .github-button {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
        gap: 0.5rem;
      }

      .github-button:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .hero-title {
          font-size: 2.5rem;
        }
        
        .subtitle {
          font-size: 1.2rem;
        }
        
        .hero-description {
          font-size: 1.2rem;
        }
        
        .hero-buttons {
          flex-direction: column;
        }
        
        .section-title {
          font-size: 2rem;
        }
        
        .features-grid {
          grid-template-columns: 1fr;
        }
        
        .cube-1, .cube-2, .cube-3 {
          display: none;
        }
      }
      
      /* Custom MDX p component style */
      .mdx-p {
        display: block;
        margin-bottom: 1rem;
        line-height: 1.6;
        font-size: inherit;
        color: inherit;
      }
      
      /* Span style within buttons */
      .primary-button span,
      .secondary-button span,
      .github-button span {
        display: inline-block;
      }
    `}</style>
  )
} 