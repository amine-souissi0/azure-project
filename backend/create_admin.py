import asyncio
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import hash_password
from sqlalchemy import select

async def make_admin():
    async with AsyncSessionLocal() as db:
        # Check if admin exists
        result = await db.execute(select(User).where(User.email == 'admin@dawah.com'))
        existing = result.scalar_one_or_none()
        
        if existing:
            print('Admin user already exists: admin@dawah.com')
            return
            
        admin = User(
            email='admin@dawah.com',
            name='Admin',
            hashed_password=hash_password('admin123'),
            role='admin'
        )
        db.add(admin)
        await db.commit()
        print('✓ Admin user created successfully!')
        print('  Email: admin@dawah.com')
        print('  Password: admin123')

if __name__ == '__main__':
    asyncio.run(make_admin())