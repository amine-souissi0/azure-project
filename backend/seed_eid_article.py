import asyncio
from app.core.database import AsyncSessionLocal
from app.models.article import Article
from sqlalchemy import select
import uuid

eid_article = {
    "title_en": "Eid al-Adha Guide: Qurbani, Charity, and Celebration",
    "slug": "eid-al-adha-guide-qurbani-charity",
    "excerpt_en": "Everything you need to know about Eid al-Adha: the significance of sacrifice, how to perform qurbani, and ways to celebrate this blessed occasion.",
    "body_en": """# Eid al-Adha Guide: Qurbani, Charity, and Celebration

Eid al-Adha, the Festival of Sacrifice, is one of the most important celebrations in Islam. It commemorates Prophet Ibrahim's willingness to sacrifice his son in obedience to Allah.

## The Significance of Eid al-Adha

Eid al-Adha falls on the 10th day of Dhul Hijjah, the final month of the Islamic calendar. It marks:
- The completion of Hajj pilgrimage
- Prophet Ibrahim's ultimate test of faith
- The spirit of sacrifice and devotion to Allah

## Qurbani (Udhiyah): The Sacrifice

### Who Must Perform Qurbani?

Qurbani is obligatory for every adult Muslim who:
- Possesses the nisab (minimum wealth threshold)
- Is not traveling
- Has the financial means

### What Animals Can Be Sacrificed?

**Acceptable animals:**
- Sheep or goat (1 person)
- Cow or buffalo (up to 7 people)
- Camel (up to 7 people)

**Requirements:**
- Must be healthy and free from defects
- Must meet minimum age requirements
- Should be well-fed and cared for

### When to Perform Qurbani?

- After Eid prayer on the 10th of Dhul Hijjah
- Can continue until sunset on the 13th of Dhul Hijjah
- Total of 4 days to complete the sacrifice

## Distribution of Meat

The meat should be divided into three parts:
1. **One-third** for your family
2. **One-third** for friends and neighbors
3. **One-third** for the poor and needy

This ensures the blessings reach everyone in the community.

## Eid al-Adha Prayers and Celebrations

### The Eid Prayer

- Performed in congregation after sunrise
- No adhan or iqamah
- Consists of two rak'ahs with extra takbirs
- Followed by a khutbah (sermon)

### Sunnah Acts on Eid Day

1. Wake up early and perform ghusl (ritual bath)
2. Wear your best clothes
3. Apply perfume (for men)
4. Delay eating until after prayer (unlike Eid al-Fitr)
5. Take a different route to and from the prayer
6. Recite takbir on the way to prayer

### Takbir of Eid

Recite frequently from Fajr of the 9th until Asr of the 13th:

**Allahu Akbar, Allahu Akbar, La ilaha illallahu Wallahu Akbar, Allahu Akbar wa lillahil hamd**

(Allah is the Greatest, Allah is the Greatest, there is no god but Allah, and Allah is the Greatest, Allah is the Greatest, and to Allah belongs all praise)

## Modern Ways to Fulfill Qurbani

If you cannot perform the sacrifice yourself:

1. **Donate through trusted organizations** that perform qurbani on your behalf
2. **Sponsor qurbani in needy countries** where meat is scarce
3. **Ensure proper Islamic slaughter** and distribution

### Recommended Organizations

- Islamic Relief
- Penny Appeal
- Muslim Aid
- Local mosques and Islamic centers

## Celebrating with Family

- Visit relatives and friends
- Exchange gifts with children
- Prepare special meals
- Give charity to those in need
- Strengthen community bonds

## Important Reminders

- The spirit of sacrifice is about devotion, not just ritual
- Share the joy with those less fortunate
- Maintain the sanctity of the days of Dhul Hijjah
- Remember those performing Hajj in your prayers

## For Those Not Performing Qurbani

If qurbani is not obligatory for you, you can still:
- Give sadaqah (voluntary charity)
- Feed the poor
- Help organize community Eid celebrations
- Visit the sick and elderly

May Allah accept our sacrifices and grant us the spirit of Prophet Ibrahim's devotion. Eid Mubarak!

---

*Note: For specific rulings regarding your situation, consult a qualified Islamic scholar.*
""",
    "category": "eid",
    "published": True,
    "read_time_minutes": 8
}

async def seed_eid_article():
    async with AsyncSessionLocal() as db:
        # Check if article already exists
        result = await db.execute(
            select(Article).where(Article.slug == eid_article["slug"])
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            print(f"⏭️  Article '{eid_article['title_en']}' already exists")
            return
        
        article = Article(
            id=uuid.uuid4(),
            **eid_article
        )
        db.add(article)
        await db.commit()
        print(f"✓ Created Eid article: {eid_article['title_en']}")
        print("\n✅ Eid al-Adha article created successfully!")

if __name__ == '__main__':
    asyncio.run(seed_eid_article())
