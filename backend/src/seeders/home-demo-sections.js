import { HomeSectionItem } from '../models/index.js'
import { safeLog, tableExists } from './helpers.js'

const HOME_TABLE = 'home_section_items'

const defaultHomeSections = {
    hero: [
        {
            badge: 'Offset Printing',
            title: 'Large volume jobs with crystal-clear detail',
            description:
                'Premium offset presses, metallic inks, and bulk finishing built for retail-ready packaging and publications.',
            image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80',
        },
        {
            badge: 'Digital Print Lab',
            title: 'Launch campaigns overnight with zero compromise',
            description:
                'Vibrant short runs, variable data, and personalized collateral for ambitious service brands across Bihar.',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80',
        },
        {
            badge: 'Installation Crew',
            title: 'From flex hoardings to illuminated storefronts',
            description:
                'Our on-ground team fabricates and installs with precision so your presence dominates every high street.',
            image: 'https://images.unsplash.com/photo-1451471016731-e963a8588be8?auto=format&fit=crop&w=1800&q=80',
        },
        {
            badge: 'Creative Studio',
            title: 'Design, prototyping, and motion support in-house',
            description:
                'Strategy, copy, and art direction merge to give you scroll-stopping assets across print and digital.',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
        },
    ],
    stats: [
        { value: '500+', title: 'Custom cards yearly', description: null },
        { value: '1200+', title: 'Orders fulfilled', description: null },
        { value: '24h', title: 'Average proof time', description: null },
    ],
    capability: [
        {
            title: 'End-to-end printing',
            description: 'Wedding cards, flex, visiting cards, cash memos, calendars, and every custom brief under one roof.',
        },
        {
            title: 'Reliable turnaround',
            description: 'Express delivery windows plus QC at each stage keeps your launch on track.',
        },
        {
            title: 'Transparent pricing',
            description: 'Upfront estimates, packaged services, and support for retail, SMB, and government bids.',
        },
        {
            title: 'Installation crew',
            description: 'On-ground team for hoardings, in-store branding, and high-street storefront makeovers.',
        },
    ],
    service: [
        {
            badge: 'Most Loved',
            detail: 'Shaadi Card',
            title: 'Wedding Card Printing',
            description:
                'Foil, emboss, laser-cut, or bilingual layouts that match your ceremony’s energy with premium stocks.',
            price: 'From ₹24 / card',
            linkLabel: 'View details',
            linkUrl: '/services',
        },
        {
            badge: 'Fast Moving',
            detail: 'Retail Docs',
            title: 'Cash Memo & Invoice Pads',
            description:
                'Triplicate, perforated, or carbonless memo books branded with your shop details and numbering.',
            price: 'From ₹220 / pad',
            linkLabel: 'View details',
            linkUrl: '/services',
        },
        {
            badge: 'Studio Pick',
            detail: 'Stationery',
            title: 'Letter Pad & Visiting Cards',
            description:
                'Crisp typography, watermark logos, and smooth writing experience for offices, schools, and hospitals.',
            price: 'From ₹180 / set',
            linkLabel: 'View details',
            linkUrl: '/services',
        },
    ],
    portfolio: [
        {
            badge: 'Wedding Cards',
            title: 'Wedding Card Design',
            description: 'Layered matte finish with foil stamping, bilingual typography, and custom monogram sheath.',
            image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
        },
        {
            badge: 'Visiting Cards',
            title: 'Minimal Visiting Card',
            description: 'Frosted PVC visiting cards with spot UV treatment and laser-rounded corners for durability.',
            image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80',
        },
        {
            badge: 'Banners / Flex',
            title: 'Event Flex Banner',
            description: '10ft flex banner for a retail launch with eco-solvent inks and block-out backing.',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
        },
    ],
    contact: [
        {
            title: 'Call the Studio',
            detail: '+91 74889 86015',
            description: 'Speak directly with Sonu or Vikash for urgent print jobs and revisions.',
            linkUrl: 'tel:+917488986015',
        },
        {
            title: 'WhatsApp Orders',
            detail: '+91 62035 04230',
            description: 'Share references, get previews, and confirm delivery slots instantly.',
            linkUrl: 'https://wa.me/916203504230',
        },
        {
            title: 'Visit Sitamarhi HQ',
            detail: 'Hospital Road, Bihar 843302',
            description: 'Walk into the production floor to proof materials or explore paper libraries.',
            linkUrl: 'https://maps.app.goo.gl/6y7oNCDVEkR92i9n7',
        },
    ],
    cta: [
        {
            badge: 'Ready to collaborate?',
            title: 'Let’s combine the best of strategy, design, and print logistics',
            description:
                'Book a discovery call, send over artwork, or invite us to audit your current workflows. Home now mirrors About, Services, Portfolio, and Contact sections so you can act faster.',
            linkLabel: 'Talk to the team',
            linkUrl: '/contact',
            secondaryLabel: 'See more work',
            secondaryUrl: '/portfolio',
        },
    ],
}

const buildRows = () => {
    const rows = []
    Object.entries(defaultHomeSections).forEach(([section, items]) => {
        items.forEach((item, index) => {
            rows.push({
                section,
                sortOrder: index,
                status: 'active',
                ...item,
            })
        })
    })
    return rows
}

const homeDemoSections = async () => {
    const exists = await tableExists(HOME_TABLE)
    if (!exists) {
        safeLog('home_section_items table missing; skipping home demo seed.')
        return
    }

    const total = await HomeSectionItem.count()
    if (total > 0) {
        safeLog('Home sections already populated; demo seed skipped.')
        return
    }

    const rows = buildRows()
    await HomeSectionItem.bulkCreate(rows)
    safeLog(`Inserted ${rows.length} demo home section entries.`)
}

export default homeDemoSections
