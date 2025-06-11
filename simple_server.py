#!/usr/bin/env python3
"""
Simple Python server to handle Stripe payment intents
This is a temporary solution until Node.js is properly installed
"""

import http.server
import socketserver
import json
import urllib.parse
import os
from datetime import datetime

class StripeHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/create-payment-intent':
            self.handle_payment_intent()
        else:
            self.send_error(404, "Not Found")
    
    def handle_payment_intent(self):
        try:
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            amount = data.get('amount', 0)
            currency = data.get('currency', 'gbp')
            
            # Validate amount
            if amount < 1:
                self.send_error(400, "Invalid amount")
                return
            
            # Create mock payment intent (for testing without real Stripe)
            # In production, this would use the real Stripe API
            mock_payment_intent = {
                'id': f'pi_mock_{datetime.now().strftime("%Y%m%d%H%M%S")}',
                'client_secret': f'pi_mock_{datetime.now().strftime("%Y%m%d%H%M%S")}_secret_mock',
                'amount': amount * 100,  # Stripe uses cents
                'currency': currency,
                'status': 'requires_payment_method'
            }
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                'clientSecret': mock_payment_intent['client_secret'],
                'paymentIntentId': mock_payment_intent['id'],
                'amount': amount,
                'currency': currency
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            print(f"✅ Mock payment intent created: {mock_payment_intent['id']} for £{amount}")
            
        except Exception as e:
            print(f"❌ Error handling payment intent: {e}")
            self.send_error(500, f"Server error: {str(e)}")
    
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            health_data = {
                'status': 'OK',
                'timestamp': datetime.now().isoformat(),
                'server': 'Python Mock Server',
                'stripe_configured': 'Mock Mode',
                'note': 'This is a mock server for testing. Payments will not be processed.'
            }
            
            self.wfile.write(json.dumps(health_data, indent=2).encode('utf-8'))
        else:
            # Serve static files normally
            super().do_GET()

def run_server(port=3000):
    handler = StripeHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 Mock Stripe Server running on http://localhost:{port}")
            print(f"📍 Health check: http://localhost:{port}/health")
            print(f"⚠️  Note: This is a MOCK server - no real payments will be processed")
            print(f"💳 Stripe payments will simulate success for testing")
            print(f"🔄 Use Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {port} is already in use. Trying port {port + 1}...")
            run_server(port + 1)
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    run_server()
