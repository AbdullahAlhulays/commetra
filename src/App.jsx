import { useEffect, useState } from 'react'
import './App.css'

const contactEmail = 'contact@commetra.app'

const icons = {
  inbox: <><path d="M3 7.5h18v10.75a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z"/><path d="M3 8 6.1 3.75h11.8L21 8M3 15h4.1l1.5 2h7.8l1.5-2H21"/></>,
  reply: <><path d="M20.5 11.5c0-4-4-7.25-9-7.25-4.7 0-8.5 3.2-8.5 7.25s3.8 7.25 8.5 7.25c1 0 1.95-.15 2.8-.45l4.2 1.45-1.1-3.3c1.95-1.3 3.1-3 3.1-4.95Z"/><path d="M8.25 11.5h6.5M11.5 8.25l3.25 3.25-3.25 3.25"/></>,
  shield: <><path d="M12 21s7.25-3.5 7.25-9.1V5.25L12 2.5 4.75 5.25v6.65C4.75 17.5 12 21 12 21Z"/><path d="m8.75 11.75 2.1 2.1 4.4-4.45"/></>,
  filter: <><path d="M3.5 5.25h17M6.5 12h11M9.5 18.75h5"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.25"/><path d="m15.25 15.25 5.25 5.25"/></>,
  chart: <><path d="M4 19.5V14M9.35 19.5V9.5M14.7 19.5V4.5M20 19.5V12"/><path d="M3.5 19.5h17"/></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  check: <path d="m5 12 4.25 4.25L19 6.5"/>,
  spark: <path d="m12 2.5 1.95 6.55L20.5 11l-6.55 1.95L12 19.5l-1.95-6.55L3.5 11l6.55-1.95L12 2.5Z"/>,
}

function Icon({ name, size = 20 }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

function Logo() {
  return <a className="brand" href="/" aria-label="Commetra home"><span className="brand-mark"><span></span><span></span><span></span></span><span>commetra</span></a>
}

function Header({ compact = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    ['Features', '#features'], ['How It Works', '#how-it-works'], ['Platforms', '#platforms'], ['Contact', '#contact'],
  ]

  return <header className={`site-header ${compact ? 'legal-header' : ''}`}>
    <div className="container nav-wrap">
      <Logo />
      {!compact && <>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu"><Icon name={menuOpen ? 'close' : 'menu'} size={23} /></button>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-cta mobile-cta" href="#contact" onClick={() => setMenuOpen(false)}>Get Started <Icon name="arrow" size={16} /></a>
        </nav>
        <a className="nav-cta desktop-cta" href="#contact">Get Started <Icon name="arrow" size={16} /></a>
      </>}
      {compact && <a className="nav-cta" href="/#contact">Get Started <Icon name="arrow" size={16} /></a>}
    </div>
  </header>
}

function SectionIntro({ eyebrow, title, text }) {
  return <div className="section-intro">
    {eyebrow && <p className="eyebrow"><span></span>{eyebrow}</p>}
    <h2>{title}</h2>
    {text && <p className="section-text">{text}</p>}
  </div>
}

function DashboardPreview() {
  const messages = [
    { initials: 'AR', color: 'lavender', name: 'Aisha Rahman', platform: 'Instagram', time: '2m', text: 'Is this available in a smaller size?', status: 'New' },
    { initials: 'JM', color: 'blue', name: 'Jordan Miller', platform: 'YouTube', time: '8m', text: 'This guide was incredibly helpful, thank you!', status: 'Replied' },
    { initials: 'SL', color: 'peach', name: 'Sam Lee', platform: 'TikTok', time: '14m', text: 'Where can I find the full collection?', status: 'New' },
  ]
  return <div className="dashboard-shadow">
    <div className="dashboard-preview" aria-label="Illustration of the Commetra dashboard">
      <div className="dash-topbar"><div className="dash-logo"><span className="brand-mark small"><span></span><span></span><span></span></span>commetra</div><div className="dash-search">⌕ <span>Search conversations</span></div><div className="dash-avatar">ME</div></div>
      <div className="dash-body">
        <aside className="dash-sidebar"><span className="side-active"><Icon name="inbox" size={15} /> Inbox <b>12</b></span><span><Icon name="chart" size={15} /> Insights</span><span><Icon name="filter" size={15} /> Filters</span><i></i><span><Icon name="shield" size={15} /> Moderation</span></aside>
        <section className="dash-inbox"><div className="dash-title"><div><strong>All comments</strong><small>12 unread</small></div><button type="button"><Icon name="filter" size={14} /></button></div><div className="dash-tabs"><b>All</b><span>Unread</span><span>Assigned</span></div>{messages.map((message) => <div className={`message-row ${message.status === 'New' ? 'unread' : ''}`} key={message.name}><div className={`avatar ${message.color}`}>{message.initials}</div><div className="message-copy"><div><strong>{message.name}</strong><time>{message.time}</time></div><small>{message.platform}</small><p>{message.text}</p></div>{message.status === 'New' && <em></em>}</div>)}</section>
        <section className="dash-detail"><div className="detail-person"><div className="avatar lavender">AR</div><div><strong>Aisha Rahman</strong><small>Instagram · 2 minutes ago</small></div><button type="button">•••</button></div><div className="comment-bubble">Is this available in a smaller size?</div><div className="reply-box"><span>Write a reply…</span><button type="button">Reply <Icon name="arrow" size={13} /></button></div><div className="dash-tags"><span>Product question</span><span>Priority</span></div></section>
      </div>
    </div>
  </div>
}

function Hero() {
  return <section className="hero-section" id="top"><div className="hero-orb orb-one"></div><div className="hero-orb orb-two"></div><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow"><span></span>ONE PLACE FOR EVERY CONVERSATION</p><h1>All Your Social Media Comments. <em>One Simple Dashboard.</em></h1><p className="hero-description">Commetra helps businesses monitor, organize, and respond to comments across their social media accounts from one place.</p><div className="hero-actions"><a className="button button-primary" href="#contact">Get Started <Icon name="arrow" size={17} /></a><a className="button button-secondary" href="#features">Learn More</a></div><p className="hero-note"><Icon name="spark" size={15} /> Thoughtfully built for growing teams</p></div><div className="hero-visual"><DashboardPreview /><div className="floating-card platform-card"><span className="platform-mini instagram">◎</span><div><strong>New comment</strong><small>Instagram · just now</small></div></div><div className="floating-card reply-card"><span className="reply-tick"><Icon name="check" size={13} /></span><div><strong>Reply sent</strong><small>Conversation updated</small></div></div></div></div></section>
}

const features = [
  ['inbox', 'Unified comment inbox', 'Bring conversations from connected social accounts into one focused workspace.'],
  ['reply', 'Reply with context', 'Respond to your audience without switching tabs or losing the thread.'],
  ['shield', 'Thoughtful moderation', 'Hide or manage inappropriate comments where the platform supports it.'],
  ['filter', 'Filter by platform', 'Focus on the channels, accounts, or conversations that need attention.'],
  ['search', 'Search and organize', 'Find past conversations quickly and keep your engagement workflow clear.'],
  ['chart', 'Practical insights', 'Understand comment volume and engagement patterns at a glance.'],
]

function Features() {
  return <section className="section features-section" id="features"><div className="container"><SectionIntro eyebrow="A CLEARER VIEW OF ENGAGEMENT" title="Every conversation, easier to manage." text="Commetra is designed to give your team a calmer, more organized way to keep up with the people who engage with your brand." /><div className="features-grid">{features.map(([icon, title, description]) => <article className="feature-card" key={title}><div className="feature-icon"><Icon name={icon} size={21} /></div><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
}

function HowItWorks() {
  const steps = [
    ['01', 'Connect your accounts', 'Link the social accounts your team manages as integrations become available.'],
    ['02', 'See comments together', 'Comments from connected platforms arrive in one organized dashboard.'],
    ['03', 'Respond with confidence', 'Review, reply, and manage engagement while keeping context close at hand.'],
  ]
  return <section className="section how-section" id="how-it-works"><div className="container how-grid"><div className="how-copy"><SectionIntro eyebrow="HOW IT WORKS" title="A better rhythm for community management." text="Built around a straightforward workflow that helps teams stay present in the conversations that matter." /><a className="text-link" href="#contact">Start a conversation <Icon name="arrow" size={17} /></a></div><div className="steps-list">{steps.map(([number, title, text]) => <div className="step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div><span className="step-arrow"><Icon name="arrow" size={18} /></span></div>)}</div></div></section>
}

const platforms = [
  ['TikTok', '♪', 'tiktok'], ['Instagram', '◎', 'instagram'], ['Facebook', 'f', 'facebook'], ['YouTube', '▶', 'youtube'], ['X', '𝕏', 'x-platform'],
]

function Platforms() {
  return <section className="section platforms-section" id="platforms"><div className="container"><SectionIntro eyebrow="SUPPORTED PLATFORMS" title="Built for the places your audience talks." text="Commetra is being developed for the social platforms where customer conversations happen every day." /><div className="platform-grid">{platforms.map(([name, mark, className]) => <div className="platform-item" key={name}><span className={`platform-logo ${className}`}>{mark}</span><span>{name}</span></div>)}</div><div className="availability-note"><span><Icon name="spark" size={16} /></span><p><strong>Integration availability depends on each platform’s API approval and access requirements.</strong> Some integrations are still in development and may not be available at launch.</p></div></div></section>
}

function About() {
  return <section className="section about-section" id="about"><div className="container about-card"><div><p className="eyebrow"><span></span>BUILDING WITH INTENTION</p><h2>Made to help businesses stay close to their customers.</h2></div><div><p>Commetra is currently in development. We’re building a focused platform to help businesses manage customer engagement more efficiently, with the tools and context teams need to respond well.</p><p>Our approach is simple: make the everyday work of listening and responding feel less scattered, while respecting the rules and capabilities of every connected platform.</p></div></div></section>
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  function handleSubmit(event) { event.preventDefault(); setSubmitted(true); event.currentTarget.reset() }
  return <section className="section contact-section" id="contact"><div className="container contact-grid"><div className="contact-copy"><p className="eyebrow"><span></span>LET’S CONNECT</p><h2>Bring more clarity to every comment.</h2><p>Interested in Commetra or want to follow along as we build? Send us a note and we’ll be in touch.</p><a href={`mailto:${contactEmail}`} className="email-link">{contactEmail} <Icon name="arrow" size={17} /></a></div><form className="contact-form" onSubmit={handleSubmit}><div className="form-row"><label>Name<input required name="name" type="text" placeholder="Your name" /></label><label>Email<input required name="email" type="email" placeholder="you@company.com" /></label></div><label>Company <span className="optional">Optional</span><input name="company" type="text" placeholder="Your company" /></label><label>Message<textarea required name="message" rows="4" placeholder="How can we help?"></textarea></label><button className="button button-primary form-button" type="submit">Send message <Icon name="arrow" size={17} /></button>{submitted && <p className="form-success" role="status"><Icon name="check" size={16} /> Thanks — we’ll be in touch soon.</p>}</form></div></section>
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-top"><Logo /><div className="footer-links"><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/data-deletion">Data Deletion</a><a href="#contact">Contact</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Commetra. All rights reserved.</span><span>Social comment management, thoughtfully built.</span></div></footer>
}

const legalContent = {
  '/privacy': {
    label: 'Privacy Policy', title: 'Privacy that respects your business and your audience.', updated: 'Last updated: August 2, 2026', sections: [
      ['Overview', 'Commetra is currently in development. This Privacy Policy describes how we may collect, use, and protect information when the service becomes available.'],
      ['Information we may collect', 'We may collect account and contact information you provide, such as your name, email address, company name, and account preferences. We may also collect limited usage and technical information needed to operate, secure, and improve the service.'],
      ['Connected social media data', 'When you choose to connect a supported social media account, Commetra may process information made available through that platform’s authorized APIs. This may include comments, conversation metadata, account identifiers, and engagement-related information. We process this data only to provide the requested comment-management functionality and as permitted by the relevant platform and applicable law.'],
      ['How information may be used', 'We may use information to operate and support the service, communicate with you, maintain security, respond to requests, and improve Commetra. We do not sell personal information or connected social media data.'],
      ['Data sharing and retention', 'We may use carefully selected service providers to host and operate Commetra, subject to appropriate safeguards. We retain data only for as long as reasonably necessary for the purposes described here, unless a longer period is required by law.'],
      ['Your choices and deletion requests', <>You may request deletion of your account and connected-platform data by emailing <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. For more detail, see our <a href="/data-deletion">Data Deletion instructions</a>. We may need to verify your request before completing it.</>],
      ['Contact', <>For privacy questions, contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</>],
    ],
  },
  '/terms': {
    label: 'Terms of Service', title: 'Clear expectations for using Commetra.', updated: 'Last updated: August 2, 2026', sections: [
      ['Overview', 'These Terms of Service govern your use of Commetra when it becomes available. By accessing or using the service, you agree to these terms.'],
      ['Acceptable use', 'You may use Commetra only for lawful, authorized business purposes. You must not misuse the service, interfere with its operation, attempt to gain unauthorized access, or use it in a way that violates another person’s rights or the terms of a connected social media platform.'],
      ['Account responsibilities', 'You are responsible for maintaining the confidentiality of your account credentials, for the accuracy of the information you provide, and for activity conducted through your account. You must ensure that you have authority to connect and manage any social media account you link to Commetra.'],
      ['Third-party platforms', 'Commetra’s features depend on the APIs, permissions, policies, and availability of third-party social media platforms. Platform access can change or be restricted at any time. We do not guarantee that a particular integration, feature, or platform will be available, approved, or uninterrupted.'],
      ['Service limitations', 'Commetra is provided on an “as is” and “as available” basis to the extent permitted by law. As a service in development, functionality may change, be delayed, or be unavailable. We do not guarantee that the service will meet every business need or operate without interruption or error.'],
      ['Changes and contact', 'We may update these terms as Commetra evolves. Continued use after an update indicates acceptance of the revised terms. Questions can be sent to ' + contactEmail + '.'],
    ],
  },
  '/data-deletion': {
    label: 'Data Deletion', title: 'Request deletion of your Commetra data.', updated: 'Last updated: August 2, 2026', sections: [
      ['How to make a request', <>To request deletion of your Commetra account and any connected-platform data, email <a href={`mailto:${contactEmail}?subject=Data%20Deletion%20Request`}>{contactEmail}</a> with the subject line “Data Deletion Request.”</>],
      ['What to include', 'Please include the email address associated with your account, your company name if applicable, and the social media accounts you believe were connected. This helps us locate the correct information and process the request accurately.'],
      ['What we will delete', 'Once we verify your request, we will delete or de-identify your Commetra account information and connected-platform data that we control, unless we are required to retain certain information for legal, security, or compliance purposes.'],
      ['Timing and confirmation', 'We aim to acknowledge requests promptly and will confirm completion after processing. The timing may depend on the scope of the request and any required verification.'],
      ['Questions', <>If you need help with a deletion request, contact <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</>],
    ],
  },
}

function LegalPage({ content }) {
  return <div className="legal-page"><Header compact /><main className="legal-main"><div className="container legal-container"><a className="back-link" href="/">← Back to Commetra</a><p className="eyebrow"><span></span>{content.label.toUpperCase()}</p><h1>{content.title}</h1><p className="legal-updated">{content.updated}</p><div className="legal-content">{content.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</div></div></main><Footer /></div>
}

function HomePage() { return <><Header /><main><Hero /><Features /><HowItWorks /><Platforms /><About /><Contact /></main><Footer /></> }

function App() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => { const updatePath = () => setPath(window.location.pathname); window.addEventListener('popstate', updatePath); return () => window.removeEventListener('popstate', updatePath) }, [])
  return legalContent[path] ? <LegalPage content={legalContent[path]} /> : <HomePage />
}

export default App
