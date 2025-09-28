import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('API proxy error - backend server not running');
            // Provide fallback response for API calls when backend is down
            if (req.url?.includes('/market-prices')) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                data: [
                  { commodity: 'Rice', price: 2500, unit: 'per quintal', market: 'Guntur', state: 'ANDHRA PRADESH' },
                  { commodity: 'Wheat', price: 2200, unit: 'per quintal', market: 'Krishna', state: 'ANDHRA PRADESH' },
                  { commodity: 'Cotton', price: 8500, unit: 'per quintal', market: 'Warangal', state: 'TELANGANA' },
                  { commodity: 'Tomato', price: 3000, unit: 'per quintal', market: 'Ranga Reddy', state: 'TELANGANA' }
                ],
                timestamp: new Date().toISOString()
              }));
            } else {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Backend service unavailable', useBlockchain: true }));
            }
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
