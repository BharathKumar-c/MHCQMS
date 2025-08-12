"""add_full_name_to_users

Revision ID: 7d7a19083b72
Revises: f926a832a0e8
Create Date: 2025-08-12 14:58:25.483999

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7d7a19083b72'
down_revision: Union[str, None] = 'f926a832a0e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add full_name column to users table
    op.add_column('users', sa.Column('full_name', sa.String(), nullable=False, server_default='Unknown'))


def downgrade() -> None:
    # Remove full_name column from users table
    op.drop_column('users', 'full_name')
