// All site content lives here — edit this file to update the portfolio.

// Files in /public, resolved against the deploy base (/portfolio/ on GitHub Pages).
const asset = (path) => import.meta.env.BASE_URL + path

export const profile = {
  name: 'Trần Ngọc Huy',
  short: 'TNH',
  role: 'Fullstack Developer · Java / Spring Boot',
  location: 'Ho Chi Minh City',
  status: 'Open to Java Backend Intern / Fresher roles',
  email: 'htn.ngochuy@gmail.com',
  phone: '0901 097 912',
  github: 'https://github.com/nghuyne',
  linkedin: 'https://www.linkedin.com/in/huytran74',
  resumeUrl: '', // e.g. /resume.pdf (put the file in /public) — hidden while empty
  photo: asset('photo.jpg'),
}

export const heroWords = ['BACKEND', 'SPRING BOOT', 'FULL-STACK']

export const about = {
  lead: 'I build backend systems that hold up in production.',
  body:
    'Final-year IT student at Saigon University with two internships behind me — most recently shipping an attendance platform used daily by ~200 staff. I work mainly in Java & Spring, lead a 4-person graduation team, and use AI to speed up research and review while owning every final design decision.',
  stats: [
    { value: '2', label: 'Internships' },
    { value: '~200', label: 'Staff on my production system' },
    { value: 'B2', label: 'English · APTIS' },
  ],
}

export const services = [
  {
    key: 'backend',
    title: 'BACKEND',
    subtitle: 'Java · Spring ecosystem',
    text: 'RESTful & real-time APIs with Spring Boot, secured with RBAC, kept correct under concurrency with JPA locking.',
    tags: ['Spring Boot', 'Spring Security', 'JPA / Hibernate', 'MySQL', 'Redis', 'Docker'],
  },
  {
    key: 'fullstack',
    title: 'FULL-STACK',
    subtitle: 'From API to UI',
    text: 'Spring Boot + React features in production at ITX, and an e-commerce store built for a real client, now live.',
    tags: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'],
  },
  {
    key: 'ai',
    title: 'AI WORKFLOW',
    subtitle: 'Discuss → plan → implement → validate',
    text: 'Claude + Agent SDK as a research and review pair, with structured memory and context management — humans own the final call.',
    tags: ['Claude Agent SDK', 'Structured prompting', 'Code review'],
  },
]

// Real work experience + education (projects live in `projects` below).
export const career = [
  {
    period: 'May – Aug 2026',
    title: 'Fullstack Intern',
    org: 'ITX Company',
    role: 'Java · Spring Boot · React',
    points: [
      'Built core modules of a Smart Attendance & Check-in System serving ~200 office staff in production.',
      'Multi-factor check-in: Wi-Fi MAC as primary auth, GPS + live photo as evidence — solving indoor GPS drift.',
      'State-machine attendance logic, RBAC multi-level approval, automated OT & Vietnamese holiday calculation.',
    ],
  },
  {
    period: 'Jan – Apr 2026',
    title: 'Backend Developer Intern',
    org: 'HOLA Group',
    role: 'Node.js',
    points: [
      'Backend modules and RESTful APIs for an internal accounting system, keeping financial records consistent.',
      'Learned Node.js and async patterns from scratch within one month; debugged and optimized production code.',
    ],
  },
  {
    period: '2022 – 2026',
    title: 'B.Sc. Information Technology',
    org: 'Saigon University',
    points: ['Academic Encouragement Scholarship (semester 9).'],
  },
]

export const projects = [
  {
    id: 'nexchain',
    kind: 'Graduation · Team Lead',
    title: 'NexChain',
    summary: 'AI-driven crypto exchange: real-time order matching, a custom PoW blockchain as audit trail, an AI risk module and a block explorer.',
    points: [
      'Designed API contracts across 4 services and led integration between sub-teams',
      'Matching engine on Spring Boot + WebSocket with push-based order book updates',
      'Rule-based risk layer (ML layer in progress) — explainable for auditors',
    ],
    stack: ['Spring Boot', 'WebSocket', 'PoW chain', 'Docker'],
    code: 'matching',
    file: 'MatchingEngine.java',
    links: [{ label: 'GitHub', href: 'https://github.com/nghuyne' }],
  },
  {
    id: 'booking',
    kind: 'Personal · Backend',
    title: 'Room & Seat Booking',
    summary: 'High-concurrency booking engine on Spring Boot 3.2.',
    points: [
      'Optimistic locking, verified with JUnit concurrency tests',
      'Redis sessions reduce auth-path DB load',
      'Migrating to Spring Cloud Gateway + Eureka',
    ],
    stack: ['Spring Boot 3.2', 'JPA', 'MySQL', 'Redis', 'JUnit'],
    code: 'booking',
    file: 'BookingService.java',
    links: [{ label: 'GitHub', href: 'https://github.com/nghuyne' }],
  },
  {
    id: 'tho-ngoo',
    kind: 'Client project · Live',
    title: 'Thỏ Ngoo Store',
    summary: 'E-commerce store + admin panel built for a real client.',
    points: [
      'Per-variant stock, QR payment with pre-filled order code',
      'Order tracking with automatic status emails',
    ],
    stack: ['Next.js', 'React', 'Cloudflare Workers'],
    image: asset('work/tho-ngoo/cover.jpg'),
    video: asset('work/tho-ngoo/preview.mp4'),
    links: [{ label: 'Live site', href: 'https://shop.thongoo.workers.dev/' }],
  },
]

export const stack = [
  { group: 'Languages', items: ['Java', 'JavaScript', 'SQL', 'HTML / CSS'] },
  { group: 'Backend', items: ['Spring Boot', 'Spring Security', 'Spring Data JPA', 'Spring Cloud', 'Node.js / Express', 'WebSocket'] },
  { group: 'Data', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS'] },
  { group: 'Tools & Practices', items: ['Docker', 'Git', 'JUnit', 'Postman', 'Swagger / OpenAPI', 'CI/CD'] },
]

// Code shown on the 3D monitor and on project cards.
export const snippets = {
  matching: `public class MatchingEngine {
  private final PriorityQueue<Order> bids =
      new PriorityQueue<>(BY_PRICE_DESC);
  private final PriorityQueue<Order> asks =
      new PriorityQueue<>(BY_PRICE_ASC);

  public synchronized List<Trade> submit(Order o) {
    var book = o.isBuy() ? asks : bids;
    var trades = new ArrayList<Trade>();
    while (!book.isEmpty() && o.crosses(book.peek())) {
      trades.add(execute(o, book.peek()));
      if (book.peek().isFilled()) book.poll();
    }
    if (!o.isFilled()) (o.isBuy() ? bids : asks).add(o);
    return trades;
  }
}`,
  booking: `@Service
@RequiredArgsConstructor
public class BookingService {

  @Transactional
  @Retryable(OptimisticLockException.class)
  public BookingResponse book(BookingRequest req) {
    Seat seat = seats.findById(req.seatId())
        .orElseThrow(() -> new NotFoundException("seat"));
    if (!seat.isAvailable())
      throw new ConflictException("Seat taken");
    seat.reserve(currentUser(), req.slot());
    return mapper.toResponse(bookings.save(
        Booking.of(seat, currentUser(), req.slot())));
  }
}`,
}
