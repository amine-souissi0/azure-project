import asyncio
from app.core.database import AsyncSessionLocal
from app.models.article import Article
from sqlalchemy import select
import uuid

sample_articles = [
    {
        "title_en": "Understanding Riba: The Islamic Perspective on Interest",
        "slug": "understanding-riba-islamic-perspective",
        "excerpt_en": "Learn why interest (riba) is prohibited in Islam and explore halal alternatives for modern financial needs.",
        "body_en": """# Understanding Riba: The Islamic Perspective on Interest

Riba, commonly translated as usury or interest, is one of the most significant prohibitions in Islamic finance. The Quran explicitly forbids riba in multiple verses, emphasizing its harmful effects on society and individuals.

## What is Riba?

Riba refers to any predetermined increase on a loan or debt. In modern terms, this includes:
- Bank interest on loans
- Credit card interest
- Interest-bearing savings accounts

## Why is Riba Prohibited?

1. **Economic Justice**: Riba creates wealth inequality by allowing money to generate money without productive effort
2. **Social Harm**: It can trap people in cycles of debt
3. **Moral Concerns**: It exploits those in financial need

## Halal Alternatives

Islam offers several ethical alternatives:
- **Murabaha**: Cost-plus financing for purchases
- **Musharaka**: Profit-sharing partnerships
- **Ijara**: Islamic leasing arrangements
- **Qard Hassan**: Interest-free benevolent loans

## Practical Steps

For modern Muslims, avoiding riba means:
1. Seeking Islamic banking options
2. Using debit cards instead of credit cards with interest
3. Exploring halal investment vehicles
4. Consulting scholars for complex financial situations

Remember: This is educational guidance. For personal rulings, consult a qualified Islamic scholar.""",
        "category": "riba",
        "published": True,
        "read_time_minutes": 5
    },
    {
        "title_en": "Halal Investment Guide: Building Wealth the Islamic Way",
        "slug": "halal-investment-guide",
        "excerpt_en": "Discover how to grow your wealth through Shariah-compliant investments while avoiding prohibited sectors.",
        "body_en": """# Halal Investment Guide: Building Wealth the Islamic Way

Investing is not only permissible in Islam but encouraged, as long as it follows Shariah principles. This guide will help you understand halal investment options.

## Core Principles

1. **No Riba**: Avoid interest-based returns
2. **No Gharar**: Avoid excessive uncertainty
3. **No Haram Sectors**: Avoid alcohol, gambling, pork, conventional finance

## Halal Investment Options

### 1. Shariah-Compliant Stocks
Invest in companies that:
- Don't deal in prohibited goods
- Keep debt-to-asset ratios low
- Derive minimal income from interest

### 2. Islamic Mutual Funds & ETFs
- Professionally managed portfolios
- Screened for Shariah compliance
- Examples: AMAGX, HLAL, SPUS

### 3. Real Estate
- Rental properties (halal income)
- REITs (if Shariah-compliant)
- Avoid interest-based mortgages

### 4. Sukuk (Islamic Bonds)
- Asset-backed certificates
- Profit-sharing instead of interest
- Government and corporate options

## Getting Started

1. **Educate Yourself**: Understand basic investment principles
2. **Screen Investments**: Use tools like Zoya or Islamicly
3. **Diversify**: Don't put all eggs in one basket
4. **Purify Returns**: Donate any impermissible income to charity
5. **Consult Experts**: Work with Shariah-compliant financial advisors

## Common Questions

**Q: Are all stocks haram?**
A: No, many stocks are halal if the company meets Shariah criteria.

**Q: What about retirement accounts?**
A: 401(k) and IRA accounts can be halal if invested in Shariah-compliant funds.

**Q: Is cryptocurrency halal?**
A: Scholars differ. Some permit it with conditions, others advise caution.

Remember to always verify with qualified scholars for your specific situation.""",
        "category": "halal_finance",
        "published": True,
        "read_time_minutes": 7
    },
    {
        "title_en": "Zakat Calculator: Understanding Your Obligation",
        "slug": "zakat-calculator-guide",
        "excerpt_en": "Learn how to calculate your zakat accurately and fulfill this important pillar of Islam.",
        "body_en": """# Zakat Calculator: Understanding Your Obligation

Zakat is one of the five pillars of Islam, requiring Muslims to give 2.5% of their qualifying wealth to those in need annually.

## What Wealth is Zakatable?

### Assets Subject to Zakat:
- Cash and savings
- Gold and silver
- Business inventory
- Stocks and investments
- Rental income (after expenses)

### Assets NOT Subject to Zakat:
- Primary residence
- Personal car
- Household items
- Tools of trade

## Nisab Threshold

Zakat is only due if your wealth exceeds the nisab (minimum threshold):
- **Gold Standard**: 87.48 grams of gold
- **Silver Standard**: 612.36 grams of silver
- Current value varies with market prices

## How to Calculate

1. **Add up all zakatable assets**
2. **Subtract immediate debts**
3. **If total ≥ nisab, calculate 2.5%**

### Example:
- Savings: $10,000
- Investments: $5,000
- Gold jewelry: $2,000
- **Total**: $17,000
- **Zakat due**: $17,000 × 0.025 = $425

## When to Pay

- Once per lunar year (Hijri calendar)
- Many choose Ramadan for extra blessings
- Can be paid in installments

## Who Receives Zakat?

The Quran specifies eight categories:
1. The poor (fuqara)
2. The needy (masakin)
3. Zakat administrators
4. Those whose hearts are to be reconciled
5. Those in bondage
6. Those in debt
7. In the cause of Allah
8. Travelers in need

## Tips

- Keep records of your wealth throughout the year
- Use online zakat calculators for accuracy
- Give to verified charitable organizations
- Don't delay payment once due

Zakat purifies your wealth and helps those in need. Calculate yours today!""",
        "category": "sadaqah",
        "published": True,
        "read_time_minutes": 6
    }
]

async def seed_articles():
    async with AsyncSessionLocal() as db:
        for article_data in sample_articles:
            # Check if article already exists
            result = await db.execute(
                select(Article).where(Article.slug == article_data["slug"])
            )
            existing = result.scalar_one_or_none()
            
            if existing:
                print(f"⏭️  Article '{article_data['title_en']}' already exists")
                continue
            
            article = Article(
                id=uuid.uuid4(),
                **article_data
            )
            db.add(article)
            print(f"✓ Created article: {article_data['title_en']}")
        
        await db.commit()
        print("\n✅ All sample articles created successfully!")

if __name__ == '__main__':
    asyncio.run(seed_articles())