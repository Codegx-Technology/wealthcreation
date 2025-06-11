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
        
        print(f"Return code: {result.returncode}")
        if result.stdout.strip():
            print(f"Output: {result.stdout.strip()}")
        if result.stderr.strip():
            print(f"Error: {result.stderr.strip()}")
            
        return result.returncode == 0
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("🚀 PUSHING TO REMOTE REPOSITORY")
    print("===============================")
    print("Repository: https://github.com/Codegx-Technology/wealthcreation.git")
    
    # Change to project directory
    project_dir = '/home/oduor/Downloads/wealthcreation-main'
    if not os.path.exists(project_dir):
        print(f"❌ Project directory not found: {project_dir}")
        sys.exit(1)
    
    print(f"📍 Working in: {project_dir}")
    
    # Check current status
    print("\n🔍 Checking current git status...")
    run_command("git status", "Current git status")
    
    # Check current branch
    print("\n🌿 Checking current branch...")
    run_command("git branch", "Current branch")
    
    # Check remote configuration
    print("\n🔗 Checking remote configuration...")
    run_command("git remote -v", "Remote configuration")
    
    # Add all files (just in case)
    print("\n📝 Adding any uncommitted files...")
    run_command("git add .", "Adding files")
    
    # Check if there are any changes to commit
    print("\n📊 Checking for uncommitted changes...")
    result = run_command("git diff --cached --name-only", "Checking staged files")
    
    # Commit if there are changes
    run_command("git status --porcelain", "Checking working directory status")
    
    # Push to remote
    print("\n🚀 Pushing to remote main branch...")
    if run_command("git push origin main", "Pushing to remote"):
        print("\n✅ SUCCESS! Push completed successfully!")
        print("🔗 Check your repository at: https://github.com/Codegx-Technology/wealthcreation")
        
        # Show final status
        print("\n📊 Final git status:")
        run_command("git status", "Final status")
        
        print("\n📊 Recent commits:")
        run_command("git log --oneline -3", "Recent commits")
        
    else:
        print("\n❌ Push failed. Please check the error messages above.")
        print("You may need to run these commands manually:")
        print("1. cd /home/oduor/Downloads/wealthcreation-main")
        print("2. git status")
        print("3. git push origin main")

if __name__ == "__main__":
    main()
