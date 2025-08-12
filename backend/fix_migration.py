#!/usr/bin/env python3
"""
Script to fix alembic migration and create database tables
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings
from app.core.database import Base

def fix_migration():
    """Fix the migration issue and create tables"""
    try:
        print("Connecting to database...")
        engine = create_engine(settings.database_url)
        
        # Check if alembic_version table exists and clean it up
        with engine.connect() as conn:
            # Check if alembic_version table exists
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'alembic_version'
                );
            """))
            alembic_version_exists = result.scalar()
            
            if alembic_version_exists:
                print("Cleaning up stale alembic_version table...")
                conn.execute(text("DROP TABLE alembic_version;"))
                conn.commit()
                print("Stale alembic_version table removed.")
            else:
                print("No stale alembic_version table found.")
        
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
        
        # Create alembic_version table with current revision
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE alembic_version (
                    version_num VARCHAR(32) NOT NULL,
                    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
                );
            """))
            conn.execute(text("""
                INSERT INTO alembic_version (version_num) VALUES ('f926a832a0e8');
            """))
            conn.commit()
            print("Alembic version table updated.")
        
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    fix_migration()
