#!/usr/bin/env python3
import subprocess
import os
import sys

def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}")
    print(f"Command: {cmd}")
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd='/home/oduor/Downloads/wealthcreation-main')
        
        if result.returncode == 0:
            print(f"✅ Success: {description}")
            if result.stdout.strip():
                print(f"Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ Error: {description}")
            print(f"Error: {result.stderr.strip()}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("🛡️ PYTHON GIT BACKUP SCRIPT")
    print("============================")
    
    # Change to project directory
    project_dir = '/home/oduor/Downloads/wealthcreation-main'
    if not os.path.exists(project_dir):
        print(f"❌ Project directory not found: {project_dir}")
        sys.exit(1)
    
    print(f"📍 Working in: {project_dir}")
    
    # Step 1: Add all files
    if not run_command("git add .", "Adding all production changes"):
        print("❌ Failed to add files")
        sys.exit(1)
    
    # Step 2: Create safe_branch
    if not run_command("git checkout -b safe_branch", "Creating safe_branch"):
        print("❌ Failed to create safe_branch")
        sys.exit(1)
    
    # Step 3: Commit with production message
    commit_msg = """PRODUCTION BACKUP: Complete Live Payment System

LIVE FEATURES PRESERVED:
✅ Stripe Live Keys: Working live payment processing
✅ Production Environment: NODE_ENV=production  
✅ Live Payment Processing: Real money transactions
✅ Custom Amount Validation: £1-£10,000
✅ Mobile Responsive Design: All devices optimized
✅ Firebase Live Integration: Production database
✅ Payment Card Improvements: White text visibility
✅ Bank Transfer: Virgin Money (82-19-74, 50458257)

TECHNICAL STACK:
- Environment: Production ready
- Payments: Live Stripe integration  
- Database: Firebase Firestore
- Security: Enhanced validation
- Performance: Mobile optimized

This branch contains ALL working production features."""
    
    if not run_command(f'git commit -m "{commit_msg}"', "Committing production changes"):
        print("❌ Failed to commit")
        sys.exit(1)
    
    # Step 4: Push safe_branch
    if not run_command("git push origin safe_branch", "Pushing safe_branch to remote"):
        print("❌ Failed to push safe_branch")
        sys.exit(1)
    
    # Step 5: Switch back to main
    if not run_command("git checkout main", "Switching back to main"):
        print("❌ Failed to switch to main")
        sys.exit(1)
    
    # Show final status
    print("\n🎉 SUCCESS! PRODUCTION CHANGES SAFELY BACKED UP!")
    print("=" * 50)
    
    run_command("git branch -a", "Showing all branches")
    
    print("\n🛡️ PRODUCTION CHANGES ARE SAFE!")
    print("✅ safe_branch contains all live Stripe integration")
    print("✅ safe_branch contains production environment")
    print("✅ safe_branch contains mobile optimizations")
    print("✅ safe_branch contains Firebase enhancements")
    print("\n🔄 Ready for main branch sanitization and merge back")

if __name__ == "__main__":
    main()
