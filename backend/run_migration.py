#!/usr/bin/env python3
"""
Script to run database migration manually
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from alembic import command
from alembic.config import Config

def run_migration():
    """Run the database migration"""
    try:
        # Create Alembic configuration
        alembic_cfg = Config("alembic.ini")
        
        # Set the database URL from environment
        alembic_cfg.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))
        
        print("Creating initial migration...")
        command.revision(alembic_cfg, autogenerate=True, message="Initial migration - create users, patients, and queue tables")
        
        print("Applying migration...")
        command.upgrade(alembic_cfg, "head")
        
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_migration()
