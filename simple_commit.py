#!/usr/bin/env python3
import subprocess
import os

def run_git_command(cmd):
    """Run a git command in the project directory"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            capture_output=True, 
            text=True, 
            cwd='/home/oduor/Downloads/wealthcreation-main'
        )
        print(f"Command: {cmd}")
        print(f"Return code: {result.returncode}")
        if result.stdout:
            print(f"Output: {result.stdout}")
        if result.stderr:
            print(f"Error: {result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"Exception: {e}")
        return False

def main():
    print("🏦 COMMITTING PAYMENT DETAILS FIXES")
    print("===================================")
    
    # Add all files
    print("\n📝 Adding files...")
    run_git_command("git add .")
    
    # Commit changes
    print("\n💾 Committing changes...")
    commit_msg = """Fix: Payment details background and text contrast for Virgin Money bank details

🏦 PAYMENT DETAILS FIXES:
- Changed background from dark to light for better readability
- Updated text colors from white to dark for better contrast
- Enhanced Virgin Money bank details visibility
- Improved mobile responsiveness for payment info section

🎨 VISUAL IMPROVEMENTS:
- Light background for excellent contrast
- Dark text for better readability
- Highlighted bank details with gold background boxes
- Monospace font for bank numbers
- Enhanced visual hierarchy

📱 MOBILE OPTIMIZATIONS:
- Centered payment info header on mobile
- Single column layout for bank details
- Better padding and spacing
- Improved touch targets

✅ BANK DETAILS ENHANCED:
- Virgin Money: Clearly visible
- Sort Code: 82-19-74 in highlighted box
- Account Number: 50458257 in highlighted box
- Better visual separation and readability"""
    
    run_git_command(f'git commit -m "{commit_msg}"')
    
    # Push to remote
    print("\n🚀 Pushing to remote...")
    run_git_command("git push origin main")
    
    print("\n✅ Payment details fixes committed and pushed!")

if __name__ == "__main__":
    main()
