#!/usr/bin/env python3
"""
Live Stripe Server for Real Payment Processing
⚠️ WARNING: This processes REAL MONEY!
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import subprocess
import sys
from datetime import datetime

# Try to import stripe, create a simple fallback if not available
try:
    import stripe
    STRIPE_AVAILABLE = True
except ImportError:
    print("⚠️ Stripe library not available. Install with: pip3 install stripe")
    STRIPE_AVAILABLE = False

    # Create a mock stripe module for basic functionality
    class MockStripe:
        class error:
            class StripeError(Exception):
                pass

        @staticmethod
        def PaymentIntent():
            return None

        api_key = None

    stripe = MockStripe()

class LiveStripeHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Initialize Stripe with secret key
        stripe_secret = os.getenv('STRIPE_SECRET_KEY', 'sk_live_YOUR_ACTUAL_SECRET_KEY_HERE')

        if not STRIPE_AVAILABLE:
            print("❌ ERROR: Stripe library not installed!")
            print("Install with: pip3 install stripe")
            self.stripe_configured = False
        elif stripe_secret == 'sk_live_YOUR_ACTUAL_SECRET_KEY_HERE':
            print("❌ ERROR: STRIPE_SECRET_KEY not configured!")
            print("Please edit .env file and add your real sk_live_... key")
            self.stripe_configured = False
        else:
            stripe.api_key = stripe_secret
            self.stripe_configured = True
            print(f"✅ Stripe configured with key: {stripe_secret[:12]}...")

        super().__init__(*args, **kwargs)
    
    def do_POST(self):
        if self.path == '/create-payment-intent':
            self.handle_payment_intent()
        else:
            self.send_error(404, "Not Found")
    
    def handle_payment_intent(self):
        try:
            if not self.stripe_configured:
                self.send_error(500, "Stripe not configured")
                return
            
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
            
            print(f"💳 Creating LIVE payment intent for £{amount} {currency.upper()}")

            if not STRIPE_AVAILABLE:
                raise Exception("Stripe library not available")

            # Create REAL Stripe payment intent
            payment_intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to pence
                currency=currency,
                automatic_payment_methods={
                    'enabled': True,
                },
                metadata={
                    'conference': 'Wealth Creation & Leadership Conference',
                    'amount_gbp': str(amount),
                    'created_at': datetime.now().isoformat(),
                    'source': 'live_registration_form'
                },
                description='Wealth Creation & Leadership Conference Registration'
            )
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                'clientSecret': payment_intent.client_secret,
                'paymentIntentId': payment_intent.id,
                'amount': amount,
                'currency': currency
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            print(f"✅ LIVE payment intent created: {payment_intent.id}")
            print(f"💰 Amount: £{amount} {currency.upper()}")
            
        except stripe.error.StripeError as e:
            print(f"❌ Stripe error: {e}")
            self.send_error(400, f"Stripe error: {str(e)}")
        except Exception as e:
            print(f"❌ Server error: {e}")
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
                'server': 'Live Stripe Server',
                'stripe_configured': self.stripe_configured,
                'warning': '⚠️ LIVE MODE - REAL MONEY WILL BE PROCESSED',
                'stripe_key_configured': bool(os.getenv('STRIPE_SECRET_KEY') and 
                                            os.getenv('STRIPE_SECRET_KEY') != 'sk_live_YOUR_ACTUAL_SECRET_KEY_HERE')
            }
            
            self.wfile.write(json.dumps(health_data, indent=2).encode('utf-8'))
        else:
            # Serve static files normally
            super().do_GET()

def load_env():
    """Load environment variables from .env file"""
    try:
        with open('.env', 'r') as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value
    except FileNotFoundError:
        print("⚠️ .env file not found")

def run_server(port=3000):
    # Load environment variables
    load_env()
    
    handler = LiveStripeHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 LIVE Stripe Server running on http://localhost:{port}")
            print(f"📍 Health check: http://localhost:{port}/health")
            print(f"⚠️  WARNING: This server processes REAL MONEY!")
            print(f"💳 Live Stripe payments will charge actual cards")
            print(f"🔄 Use Ctrl+C to stop the server")
            print(f"")
            
            # Check if Stripe key is configured
            stripe_key = os.getenv('STRIPE_SECRET_KEY', '')
            if stripe_key == 'sk_live_YOUR_ACTUAL_SECRET_KEY_HERE' or not stripe_key:
                print("❌ STRIPE_SECRET_KEY not configured!")
                print("Please edit .env file and add your real sk_live_... key")
                print("Server will not process payments until configured.")
            else:
                print(f"✅ Stripe key configured: {stripe_key[:12]}...")
            
            print(f"")
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
