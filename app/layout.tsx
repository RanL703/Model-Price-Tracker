import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Model Pricing Comparison",
  description: "Compare input and output costs across different AI models",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            color-scheme: dark;
          }
          
          body {
            background-color: #000000;
            color: #ffffff;
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          .card {
            background-color: #000000;
            border-radius: 8px;
            border: 1px solid #333;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .button {
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
          }
          
          .button:hover {
            background-color: #1d4ed8;
          }
          
          .button-outline {
            background-color: transparent;
            color: white;
            border: 1px solid #4b5563;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
          }
          
          .button-outline:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
