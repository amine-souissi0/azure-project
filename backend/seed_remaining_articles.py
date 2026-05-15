import asyncio
from app.core.database import AsyncSessionLocal
from app.models.article import Article
from sqlalchemy import select
import uuid

remaining_articles = [
    {
        "title_en": "5 Daily Habits for Financial Wellness in Islam",
        "slug": "daily-habits-financial-wellness-islam",
        "excerpt_en": "Simple daily practices to maintain financial health while staying true to Islamic principles.",
        "body_en": """# 5 Daily Habits for Financial Wellness in Islam

Building wealth and maintaining financial health doesn't happen overnight. It's the small, consistent actions we take every day that compound into lasting prosperity. Here are five daily habits rooted in Islamic principles that can transform your financial life.

## 1. Start Your Day with Gratitude and Intention

**Morning Practice:**
- Thank Allah for your provisions
- Set a clear financial intention for the day
- Review your spending plan

**Quranic Reminder:**
*"If you are grateful, I will surely increase you [in favor]"* (Quran 14:7)

Gratitude shifts your mindset from scarcity to abundance, helping you make better financial decisions throughout the day.

## 2. Track Every Expense

**Why It Matters:**
- Awareness is the first step to control
- Identifies wasteful spending patterns
- Helps you stay within halal boundaries

**How to Do It:**
- Use a simple notebook or app
- Record every purchase, no matter how small
- Review weekly to spot trends

The Prophet (peace be upon him) said: *"Take account of yourselves before you are taken to account."*

## 3. Give Sadaqah Daily

**The Power of Daily Charity:**
- Even small amounts create a habit of generosity
- Purifies your wealth
- Opens doors of barakah (blessings)

**Practical Ideas:**
- Set aside $1-5 daily for charity
- Help a neighbor or colleague
- Share beneficial knowledge
- Smile and offer kind words (also sadaqah!)

**Hadith:** *"Protect yourself from the Fire even with half a date [in charity]."* (Bukhari & Muslim)

## 4. Avoid Impulse Purchases

**The 24-Hour Rule:**
Before making any non-essential purchase:
1. Wait 24 hours
2. Ask: Do I need this or just want it?
3. Consider: Is this halal and beneficial?
4. Pray Istikhara for major purchases

**Questions to Ask:**
- Will this bring lasting value?
- Can I afford it without debt?
- Is there a halal alternative?
- Am I buying to impress others?

## 5. End Your Day with Financial Review

**Evening Reflection:**
- Review today's spending
- Celebrate wins (stayed within budget, avoided temptation)
- Plan tomorrow's financial priorities
- Make dua for provision and guidance

**Night Dua:**
*"O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, and from being overcome by debt and the oppression of men."*

## Bonus: Weekly Financial Check-In

Set aside 30 minutes each week to:
- Review your budget
- Check savings progress
- Adjust spending categories
- Plan for upcoming expenses
- Calculate and set aside zakat

## The Compound Effect

These habits may seem small, but their impact compounds over time:
- **Day 1:** You start tracking expenses
- **Week 1:** You identify $50 in wasteful spending
- **Month 1:** You save $200 by cutting unnecessary costs
- **Year 1:** You've saved $2,400 and built an emergency fund
- **Year 5:** You're debt-free with growing halal investments

## Remember

Financial wellness in Islam isn't about hoarding wealth—it's about:
- Being a good steward of Allah's provisions
- Supporting your family
- Helping those in need
- Preparing for the Hereafter

Start with one habit today. Master it. Then add another. Small, consistent steps lead to lasting transformation.

*"The most beloved deeds to Allah are those that are most consistent, even if they are small."* (Bukhari & Muslim)
""",
        "category": "tips",
        "published": True,
        "read_time_minutes": 6
    },
    {
        "title_en": "Halal Money Management: A Beginner's Guide",
        "slug": "halal-money-management-beginners-guide",
        "excerpt_en": "Essential principles and practical steps for managing your finances according to Islamic teachings.",
        "body_en": """# Halal Money Management: A Beginner's Guide

Managing money can feel overwhelming, especially when you want to ensure everything aligns with Islamic principles. This guide breaks down the essentials into simple, actionable steps.

## Core Islamic Financial Principles

### 1. Avoid Riba (Interest)
- No interest-based loans or savings
- Seek Islamic banking alternatives
- Use profit-sharing arrangements

### 2. Avoid Gharar (Excessive Uncertainty)
- Clear contracts and agreements
- Transparent transactions
- Avoid gambling and speculation

### 3. Avoid Haram Industries
- No investment in alcohol, pork, gambling
- Screen stocks and funds for Shariah compliance
- Choose ethical businesses

### 4. Pay Zakat
- 2.5% of qualifying wealth annually
- Purifies your wealth
- Helps those in need

## Building Your Halal Financial Foundation

### Step 1: Assess Your Current Situation

**Calculate Your Net Worth:**
- List all assets (savings, investments, property)
- List all debts
- Net Worth = Assets - Debts

**Track Your Cash Flow:**
- Monthly income
- Monthly expenses
- Surplus or deficit?

### Step 2: Create an Islamic Budget

**The 50/30/20 Rule (Halal Version):**
- **50%** Necessities (housing, food, utilities)
- **30%** Discretionary (halal entertainment, dining)
- **20%** Savings, investments, and charity

**Add Islamic Priorities:**
- Zakat (2.5% of wealth)
- Sadaqah (voluntary charity)
- Emergency fund (3-6 months expenses)

### Step 3: Eliminate Riba-Based Debt

**Priority Order:**
1. Credit card debt (highest interest)
2. Personal loans
3. Car loans
4. Student loans

**Halal Debt Elimination Strategies:**
- Snowball method (smallest to largest)
- Avalanche method (highest interest first)
- Negotiate with creditors
- Seek family assistance (interest-free)

### Step 4: Build an Emergency Fund

**Why It's Important:**
- Avoid riba-based loans in emergencies
- Provides peace of mind
- Protects your family

**How Much:**
- Start with $1,000
- Build to 3-6 months of expenses
- Keep in halal savings account

### Step 5: Start Halal Investing

**Options for Beginners:**
- Shariah-compliant mutual funds
- Islamic ETFs (HLAL, SPUS, UMMA)
- Halal stocks (screened companies)
- Real estate (without riba)
- Small business ventures

**Investment Principles:**
- Diversify your portfolio
- Invest for long-term
- Purify any impermissible income
- Consult with Islamic finance advisors

## Common Mistakes to Avoid

### 1. Lifestyle Inflation
- Don't increase spending with every raise
- Maintain modest living standards
- Save and invest the difference

### 2. Keeping Up with Others
- Avoid showing off wealth
- Don't compete with neighbors
- Focus on your own journey

### 3. Neglecting Charity
- Charity doesn't decrease wealth
- It brings barakah (blessings)
- Make it a priority, not an afterthought

### 4. Ignoring Financial Education
- Learn about Islamic finance
- Understand investment basics
- Stay informed about halal options

## Tools and Resources

**Budgeting Apps:**
- YNAB (You Need A Budget)
- Mint
- EveryDollar

**Islamic Finance Apps:**
- Zoya (stock screening)
- Islamicly (prayer times + finance)
- Muslim Pro (includes zakat calculator)

**Learning Resources:**
- Islamic Finance courses online
- Books on halal investing
- Consult local Islamic scholars

## Monthly Financial Checklist

- [ ] Track all expenses
- [ ] Review budget and adjust
- [ ] Pay bills on time
- [ ] Set aside zakat portion
- [ ] Give sadaqah
- [ ] Review investments
- [ ] Check emergency fund
- [ ] Learn something new about Islamic finance

## Remember

Financial success in Islam is not measured by how much you accumulate, but by:
- How you earn it (halal means)
- How you spend it (wisely and generously)
- How you share it (zakat and sadaqah)
- How it helps you serve Allah

Start today. Take one step. Then another. Allah will bless your efforts.

*"And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect."* (Quran 65:2-3)
""",
        "category": "general",
        "published": True,
        "read_time_minutes": 9
    },
    {
        "title_en": "Quick Tips: Saving Money the Halal Way",
        "slug": "quick-tips-saving-money-halal-way",
        "excerpt_en": "Practical, actionable tips to save money while maintaining Islamic values in your daily life.",
        "body_en": """# Quick Tips: Saving Money the Halal Way

Saving money doesn't mean being stingy—it means being wise with Allah's blessings. Here are practical tips you can implement today.

## Food & Groceries

### 1. Plan Your Meals
- Create weekly meal plans
- Shop with a list
- Avoid shopping when hungry
- **Savings: $200-300/month**

### 2. Buy in Bulk (Wisely)
- Non-perishables and staples
- Split bulk purchases with family
- Store properly to avoid waste
- **Savings: $50-100/month**

### 3. Reduce Food Waste
- Use leftovers creatively
- Freeze excess food
- Compost when possible
- **Islamic Reminder:** Wasting food is prohibited

### 4. Cook at Home
- Eating out costs 3-5x more
- Healthier and halal-assured
- Family bonding time
- **Savings: $300-500/month**

## Transportation

### 5. Carpool or Use Public Transit
- Share rides with colleagues
- Use bus/train when possible
- Walk or bike for short distances
- **Savings: $100-200/month**

### 6. Maintain Your Vehicle
- Regular oil changes
- Proper tire pressure
- Avoid aggressive driving
- **Prevents costly repairs**

### 7. Compare Insurance Rates
- Shop around annually
- Consider Islamic insurance (Takaful)
- Bundle policies for discounts
- **Savings: $50-100/month**

## Housing

### 8. Reduce Energy Costs
- Turn off lights when leaving rooms
- Unplug unused electronics
- Use LED bulbs
- Adjust thermostat by 2-3 degrees
- **Savings: $30-50/month**

### 9. DIY When Possible
- Learn basic home repairs
- YouTube tutorials are free
- Ask knowledgeable friends/family
- **Savings: $100-300/year**

### 10. Negotiate Bills
- Call providers annually
- Ask for loyalty discounts
- Compare competitor rates
- **Savings: $20-50/month**

## Shopping & Entertainment

### 11. Wait Before Buying
- 30-day rule for wants
- Pray Istikhara for big purchases
- Ask: Need or want?
- **Prevents impulse buying**

### 12. Buy Quality Over Quantity
- Invest in durable items
- Avoid fast fashion
- Choose timeless over trendy
- **Long-term savings**

### 13. Use Cash for Discretionary Spending
- Envelope system
- More mindful spending
- Avoid credit card debt
- **Prevents overspending**

### 14. Free Halal Entertainment
- Community events at masjid
- Nature walks and parks
- Library books and programs
- Family game nights
- **Savings: $100-200/month**

## Banking & Finance

### 15. Avoid ATM Fees
- Use your bank's ATMs
- Get cash back at stores
- Plan ahead for cash needs
- **Savings: $20-40/month**

### 16. Review Subscriptions
- Cancel unused services
- Share family plans
- Rotate streaming services
- **Savings: $50-100/month**

### 17. Automate Savings
- Set up automatic transfers
- "Pay yourself first"
- Out of sight, out of mind
- **Builds wealth consistently**

## Charity & Community

### 18. Give Regularly
- Even small amounts
- Creates barakah in wealth
- Opens doors of provision
- **Quranic promise of increase**

### 19. Share Resources
- Tool libraries
- Clothing swaps
- Skill exchanges
- **Builds community, saves money**

### 20. Buy Local and Support Muslims
- Strengthen Muslim economy
- Better quality often
- Build relationships
- **Barakah in supporting believers**

## Technology & Communication

### 21. Negotiate Phone Plans
- Switch to prepaid
- Use WiFi calling
- Family plans save money
- **Savings: $30-50/month**

### 22. Use Free Software
- Open-source alternatives
- Free trials wisely
- Educational discounts
- **Savings: $20-50/month**

## Health & Wellness

### 23. Preventive Care
- Regular checkups
- Exercise (free!)
- Healthy eating
- **Prevents expensive treatments**

### 24. Generic Medications
- Same active ingredients
- Much lower cost
- Ask your doctor
- **Savings: 50-80% on prescriptions**

## The Mindset Shift

Remember:
- Saving isn't hoarding—it's stewardship
- Frugality isn't stinginess—it's wisdom
- Simplicity isn't deprivation—it's freedom

**Prophet Muhammad (ﷺ) said:**
*"Richness is not having many possessions, but richness is being content with oneself."* (Bukhari)

## Your Action Plan

**This Week:**
1. Pick 3 tips to implement
2. Track your savings
3. Celebrate small wins

**This Month:**
1. Add 3 more tips
2. Calculate total savings
3. Allocate savings: emergency fund, investments, charity

**This Year:**
1. Make these habits automatic
2. Watch your wealth grow
3. Increase your sadaqah

Start small. Stay consistent. Trust Allah's provision.

*"And whoever is mindful of Allah, He will make a way out for them, and provide for them from sources they could never imagine."* (Quran 65:2-3)
""",
        "category": "tips",
        "published": True,
        "read_time_minutes": 7
    }
]

async def seed_remaining_articles():
    async with AsyncSessionLocal() as db:
        for article_data in remaining_articles:
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
        print("\n✅ All remaining articles created successfully!")

if __name__ == '__main__':
    asyncio.run(seed_remaining_articles())