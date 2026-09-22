import type {
  Interaction,
  InteractionCategory,
  InteractionType,
  MediaAttachment,
  MediaKind,
  OriginalContent,
  ProviderMetadata,
  Reply,
  SocialProvider,
  WorkflowStatus,
} from '@/domain'
import { PROVIDER_CAPABILITIES, resolvePublicVisibility } from '@/domain'
import { ACCOUNT_IDS, ORG_ID, seedAccounts } from './seed-accounts'
import { minutesAgo } from './time'

type AccountKey = keyof typeof ACCOUNT_IDS

interface MediaSeed {
  kind: MediaKind
  alt: string
  seconds?: number
}

interface ThreadSeed {
  by: 'business' | 'customer'
  text: string
  at: number
  failed?: boolean
}

interface InteractionSeed {
  id: string
  account: AccountKey
  type: InteractionType
  authorName: string
  authorHandle: string | null
  text: string
  /** Minutes before load time. */
  at: number
  /**
   * Authored rather than derived. Production assigns this from the classifier
   * on ingest; here it is written per seed so the demo inbox shows a realistic
   * spread across all five categories instead of whatever keyword matching
   * happens to produce on 60 rows.
   */
  category: InteractionCategory
  read?: boolean
  status?: WorkflowStatus
  context?: { excerpt: string; at: number; media?: MediaSeed[] }
  media?: MediaSeed[]
  thread?: ThreadSeed[]
}

/**
 * Replying to this one fails on the first attempt and succeeds on retry, so the
 * reply error + retry path is reachable without editing code. See
 * `mock/inbox.ts`.
 */
export const FLAKY_INTERACTION_ID = 'int_x_04'

const PROVIDER_BY_ACCOUNT: Record<AccountKey, SocialProvider> = {
  igCafe: 'instagram',
  igStore: 'instagram',
  facebook: 'facebook',
  tiktok: 'tiktok',
  x: 'x',
}

/**
 * Themes cover stock, hours, delivery, prices, complaints and compliments, in
 * a mix of short and long messages, so the inbox reads like real traffic
 * rather than a list of variations on one sentence.
 */
const SEEDS: InteractionSeed[] = [
  {
    id: 'int_ig_01',
    account: 'igCafe',
    type: 'comment',
    authorName: 'منيرة القحطاني',
    authorHandle: 'munira.q',
    text: 'حبوب الإثيوبي المذكورة في الفيديو متوفرة الحين؟ أبي أطلب كيلو.',
    at: 6,
    category: 'sales_intent',
    status: 'new',
    context: {
      excerpt: 'وصلتنا دفعة جديدة من إثيوبيا — يرغاتشيف، تحميص فاتح. متوفرة الآن في المحمصة وأونلاين.',
      at: 180,
      media: [{ kind: 'image', alt: 'أكياس قهوة إثيوبية على طاولة خشبية' }],
    },
  },
  {
    id: 'int_ig_02',
    account: 'igCafe',
    type: 'direct_message',
    authorName: 'فهد العنزي',
    authorHandle: 'f.alanzi',
    text: 'مساء الخير، طلبي رقم ٤٨٢١ صار له ثلاثة أيام ولا وصلني تحديث. ممكن تتابعونه؟',
    at: 21,
    category: 'customer_service',
    status: 'open',
    thread: [
      {
        by: 'business',
        text: 'مساء النور فهد، نعتذر عن التأخير. راجعنا الطلب والآن مع شركة الشحن، ويصلك خلال ٢٤ ساعة بإذن الله.',
        at: 12,
      },
    ],
  },
  {
    id: 'int_ig_03',
    account: 'igCafe',
    type: 'comment',
    authorName: 'ريم الدوسري',
    authorHandle: 'reem_d',
    text: 'القهوة وصلتني اليوم والرائحة خيالية 🤎 شكراً لكم على التغليف المرتب.',
    at: 47,
    category: 'positive',
    read: true,
    status: 'open',
    thread: [
      { by: 'business', text: 'سعدنا كثيراً بهذا يا ريم، وننتظرك في الطلب القادم 🤎', at: 40 },
    ],
    context: {
      excerpt: 'التغليف الجديد وصل. صندوق أصغر، وحماية أفضل للحبوب أثناء الشحن.',
      at: 60 * 20,
      media: [{ kind: 'image', alt: 'صندوق شحن بالهوية الجديدة' }],
    },
  },
  {
    id: 'int_ig_04',
    account: 'igCafe',
    type: 'comment',
    authorName: 'عبدالعزيز الغامدي',
    authorHandle: 'a.alghamdi',
    text: 'كم سعر الكيلو؟ وهل فيه خصم لو طلبت أكثر من كيلو؟',
    at: 96,
    category: 'sales_intent',
    status: 'new',
    context: {
      excerpt: 'وصلتنا دفعة جديدة من إثيوبيا — يرغاتشيف، تحميص فاتح. متوفرة الآن في المحمصة وأونلاين.',
      at: 180,
      media: [{ kind: 'image', alt: 'أكياس قهوة إثيوبية على طاولة خشبية' }],
    },
  },
  {
    id: 'int_ig_05',
    account: 'igCafe',
    type: 'direct_message',
    authorName: 'لمى السبيعي',
    authorHandle: 'lama.s',
    text: 'هل عندكم دورة تحضير قهوة للمبتدئين؟ وكم مدتها؟',
    at: 140,
    category: 'sales_intent',
    read: true,
    status: 'open',
    thread: [
      {
        by: 'business',
        text: 'أهلاً لمى، عندنا جلسة تذوق كل خميس لمدة ساعة ونصف. نفتح الحجز يوم الثلاثاء، ونرسل لك الرابط أول ما يتوفر.',
        at: 130,
      },
      { by: 'customer', text: 'تمام، بانتظاركم. وهل فيه مقاعد للمجموعات؟', at: 122 },
    ],
  },
  {
    id: 'int_ig_06',
    account: 'igCafe',
    type: 'comment',
    authorName: 'تركي الشهري',
    authorHandle: 'turki.sh',
    text: 'الفرع مفتوح الجمعة؟',
    at: 210,
    category: 'customer_service',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'نعم، من ٢ ظهراً إلى ١٢ منتصف الليل.', at: 205 }],
  },
  {
    id: 'int_ig_07',
    account: 'igCafe',
    type: 'comment',
    authorName: 'هند المطيري',
    authorHandle: 'hind.m',
    text: 'طلبت أمس واختار لي الموقع فرع غير الفرع اللي أبيه. أقدر أغيره؟',
    at: 320,
    category: 'customer_service',
    status: 'open',
  },
  {
    id: 'int_ig_08',
    account: 'igCafe',
    type: 'direct_message',
    authorName: 'خالد البقمي',
    authorHandle: 'khaled.b',
    text: 'أبي أهدي صديقي اشتراك شهري. كيف الطريقة؟',
    at: 460,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_ig_09',
    account: 'igCafe',
    type: 'comment',
    authorName: 'أمل الزهراني',
    authorHandle: 'amal.z',
    text: 'التحميص الغامق متى يرجع؟ كل ما أدخل ألقاه خلص.',
    at: 610,
    category: 'sales_intent',
    status: 'new',
  },

  {
    id: 'int_igs_01',
    account: 'igStore',
    type: 'comment',
    authorName: 'سلطان الحارثي',
    authorHandle: 'sultan.h',
    text: 'الشحن للدمام كم ياخذ يوم؟',
    at: 1900,
    category: 'customer_service',
    read: true,
    status: 'open',
  },
  {
    id: 'int_igs_02',
    account: 'igStore',
    type: 'comment',
    authorName: 'جواهر العتيبي',
    authorHandle: 'jawaher.o',
    text: 'وصلني الطلب ناقص كيس. تواصلت مع الدعم ولا رد.',
    at: 2150,
    category: 'negative',
    status: 'open',
  },
  {
    id: 'int_igs_03',
    account: 'igStore',
    type: 'direct_message',
    authorName: 'ماجد الرشيدي',
    authorHandle: 'majed.r',
    text: 'عندكم فواتير ضريبية للشركات؟',
    at: 2400,
    category: 'customer_service',
    read: true,
    status: 'open',
  },

  {
    id: 'int_fb_01',
    account: 'facebook',
    type: 'comment',
    authorName: 'نوف الشمري',
    authorHandle: null,
    text: 'هل يمكن الطلب واستلامه من الفرع بدون توصيل؟',
    at: 34,
    category: 'sales_intent',
    status: 'new',
    context: {
      excerpt: 'صار بإمكانك الطلب من الموقع واستلامه من المحمصة خلال ٣٠ دقيقة.',
      at: 60 * 8,
    },
  },
  {
    id: 'int_fb_02',
    account: 'facebook',
    type: 'direct_message',
    authorName: 'بدر الخالدي',
    authorHandle: null,
    text: 'السلام عليكم، أبحث عن تجهيز قهوة لمناسبة ١٥٠ شخص يوم الخميس القادم. هل تقدمون هذي الخدمة؟ وكم التكلفة التقريبية؟',
    at: 75,
    category: 'sales_intent',
    status: 'open',
    thread: [
      {
        by: 'business',
        text: 'وعليكم السلام أستاذ بدر، نعم نقدمها. نحتاج نعرف المكان وعدد الباريستا المطلوب، ونرسل لك عرض سعر اليوم.',
        at: 62,
      },
    ],
  },
  {
    id: 'int_fb_03',
    account: 'facebook',
    type: 'comment',
    authorName: 'دانة الفيفي',
    authorHandle: null,
    text: 'جربت الحلى الجديد أمس، صراحة ممتاز. بس الأسعار ارتفعت شوي عن قبل.',
    at: 190,
    category: 'other',
    read: true,
    status: 'open',
  },
  {
    id: 'int_fb_04',
    account: 'facebook',
    type: 'comment',
    authorName: 'راكان السهلي',
    authorHandle: null,
    text: 'فيه مواقف للسيارات قريبة من الفرع؟',
    at: 255,
    category: 'customer_service',
    read: true,
    status: 'open',
    thread: [
      { by: 'business', text: 'نعم، يوجد موقف خلف المبنى ومدخله من نفس الشارع.', at: 250 },
    ],
  },
  {
    id: 'int_fb_05',
    account: 'facebook',
    type: 'comment',
    authorName: 'شهد المالكي',
    authorHandle: null,
    text: 'الطلب تأخر ثلاث ساعات عن الوقت المذكور، وما وصلني أي إشعار. هذي ثاني مرة تصير.',
    at: 400,
    category: 'negative',
    status: 'open',
    context: {
      excerpt: 'التوصيل السريع الآن داخل الرياض خلال ٩٠ دقيقة.',
      at: 60 * 30,
    },
  },
  {
    id: 'int_fb_06',
    account: 'facebook',
    type: 'direct_message',
    authorName: 'يزيد الجهني',
    authorHandle: null,
    text: 'هل تبيعون ماكينات إسبريسو منزلية؟',
    at: 980,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_fb_07',
    account: 'facebook',
    type: 'comment',
    authorName: 'رزان القرني',
    authorHandle: null,
    text: 'وين باقي الفروع؟ نبي فرع في الشمال.',
    at: 1420,
    category: 'customer_service',
    read: true,
    status: 'open',
    thread: [
      { by: 'business', text: 'وصلتنا الفكرة يا رزان، ونشتغل على فرع جديد شمال الرياض هذي السنة.', at: 1400 },
    ],
  },

  {
    id: 'int_tt_01',
    account: 'tiktok',
    type: 'comment',
    authorName: 'وليد العمري',
    authorHandle: 'waleed.om',
    text: 'وش اسم الطاحونة المستخدمة في الفيديو؟',
    at: 15,
    category: 'sales_intent',
    status: 'new',
    context: {
      excerpt: 'طريقة تحضير V60 خطوة بخطوة ☕️',
      at: 60 * 5,
      media: [{ kind: 'video', alt: 'فيديو تحضير قهوة بطريقة V60', seconds: 48 }],
    },
  },
  {
    id: 'int_tt_02',
    account: 'tiktok',
    type: 'comment',
    authorName: 'أفنان الثقفي',
    authorHandle: 'afnan.t',
    text: 'الفيديو مفيد جداً، كملوا هالسلسلة 👏',
    at: 58,
    category: 'positive',
    status: 'new',
    context: {
      excerpt: 'طريقة تحضير V60 خطوة بخطوة ☕️',
      at: 60 * 5,
      media: [{ kind: 'video', alt: 'فيديو تحضير قهوة بطريقة V60', seconds: 48 }],
    },
  },
  {
    id: 'int_tt_03',
    account: 'tiktok',
    type: 'comment',
    authorName: 'مشعل الدايل',
    authorHandle: 'meshal.d',
    text: 'كم درجة حرارة الماء المناسبة؟',
    at: 132,
    category: 'customer_service',
    status: 'open',
    context: {
      excerpt: 'طريقة تحضير V60 خطوة بخطوة ☕️',
      at: 60 * 5,
      media: [{ kind: 'video', alt: 'فيديو تحضير قهوة بطريقة V60', seconds: 48 }],
    },
  },
  {
    id: 'int_tt_04',
    account: 'tiktok',
    type: 'comment',
    authorName: 'غادة السلمي',
    authorHandle: 'ghada.s',
    text: 'الموقع ما يفتح عندي، يطلع لي صفحة بيضاء.',
    at: 260,
    category: 'customer_service',
    read: true,
    status: 'open',
  },
  {
    id: 'int_tt_05',
    account: 'tiktok',
    type: 'comment',
    authorName: 'سعود الحمدان',
    authorHandle: 'saud.h',
    text: 'توصلون خارج الرياض؟',
    at: 520,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_tt_06',
    account: 'tiktok',
    type: 'comment',
    authorName: 'ملاك العنزي',
    authorHandle: 'malak.a',
    text: 'أسعاركم مرتفعة مقارنة بغيركم بصراحة.',
    at: 880,
    category: 'negative',
    status: 'open',
  },
  {
    id: 'int_tt_07',
    account: 'tiktok',
    type: 'comment',
    authorName: 'عمر الزيد',
    authorHandle: 'omar.z',
    text: 'وين الفرع بالضبط؟',
    at: 1600,
    category: 'customer_service',
    read: true,
    status: 'open',
  },

  {
    id: 'int_x_01',
    account: 'x',
    type: 'comment',
    authorName: 'سلمان الفهد',
    authorHandle: 'salman_f',
    text: 'طلبت أمس ووصل اليوم الصباح. سرعة ممتازة 👌',
    at: 28,
    category: 'positive',
    status: 'new',
    context: {
      excerpt: 'التوصيل داخل الرياض خلال ٩٠ دقيقة، وبقية المدن خلال ٤٨ ساعة.',
      at: 60 * 12,
    },
  },
  {
    id: 'int_x_02',
    account: 'x',
    type: 'comment',
    authorName: 'نايف العريفي',
    authorHandle: 'naif_ar',
    text: 'تطبيقكم ما يقبل بطاقة مدى عندي، يطلع خطأ في كل مرة.',
    at: 110,
    category: 'customer_service',
    status: 'open',
  },
  {
    id: 'int_x_03',
    account: 'x',
    type: 'direct_message',
    authorName: 'بشاير الصقر',
    authorHandle: 'bashayer_s',
    text: 'مرحباً، أمثل مقهى في جدة ونبي نوزع منتجاتكم. مع من أتواصل؟',
    at: 300,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: FLAKY_INTERACTION_ID,
    account: 'x',
    type: 'comment',
    authorName: 'إبراهيم الدوسري',
    authorHandle: 'ibrahim_d',
    text: 'متى يرجع مزيج الصباح؟ صار له أسبوعين غير متوفر.',
    at: 430,
    category: 'sales_intent',
    status: 'new',
  },
  {
    id: 'int_x_05',
    account: 'x',
    type: 'comment',
    authorName: 'ريما الحمد',
    authorHandle: 'reema_h',
    text: 'شكراً على التعامل الراقي أمس في الفرع، الموظف كان متعاون جداً.',
    at: 1250,
    category: 'positive',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'هذا واجبنا، وسعدنا بزيارتك 🤎', at: 1240 }],
  },
  {
    id: 'int_x_06',
    account: 'x',
    type: 'comment',
    authorName: 'طلال المنصور',
    authorHandle: 'talal_m',
    text: 'فيه خطط اشتراك شهرية؟',
    at: 2600,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },

  /*
   * Older history, 4–45 days back.
   *
   * Without it the dashboard trend would be two bars against 28 empty days and
   * the date filters would have nothing to separate. Mostly read and resolved,
   * the way a worked-through inbox actually looks.
   */
  {
    id: 'int_h_01',
    account: 'igCafe',
    type: 'comment',
    authorName: 'عبير الشهراني',
    authorHandle: 'abeer.sh',
    text: 'وصلني الطلب اليوم والتغليف ممتاز، شكراً لكم.',
    at: 60 * 24 * 4,
    category: 'positive',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'شكراً لك، نسعد بخدمتك دائماً.', at: 60 * 24 * 4 - 40 }],
  },
  {
    id: 'int_h_02',
    account: 'facebook',
    type: 'comment',
    authorName: 'عادل الزهراني',
    authorHandle: null,
    text: 'هل يوجد توصيل للخرج؟',
    at: 60 * 24 * 4 + 300,
    category: 'sales_intent',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'نعم، خلال ٤٨ ساعة.', at: 60 * 24 * 4 + 240 }],
  },
  {
    id: 'int_h_03',
    account: 'tiktok',
    type: 'comment',
    authorName: 'ندى العامري',
    authorHandle: 'nada.am',
    text: 'الفيديو الأخير مفيد، شكراً.',
    at: 60 * 24 * 5,
    category: 'other',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_04',
    account: 'x',
    type: 'comment',
    authorName: 'حسام النمر',
    authorHandle: 'hussam_n',
    text: 'الموقع بطيء عندي من الجوال.',
    at: 60 * 24 * 5 + 420,
    category: 'customer_service',
    read: true,
    status: 'open',
    thread: [
      { by: 'business', text: 'شكراً على الملاحظة، حسّنا سرعة الموقع في التحديث الأخير.', at: 60 * 24 * 5 + 320 },
    ],
  },
  {
    id: 'int_h_05',
    account: 'igCafe',
    type: 'direct_message',
    authorName: 'رهف السديري',
    authorHandle: 'rahaf.s',
    text: 'أبي أعرف مواعيد جلسة التذوق القادمة.',
    at: 60 * 24 * 6,
    category: 'sales_intent',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'كل خميس الساعة ٧ مساءً، والحجز من الموقع.', at: 60 * 24 * 6 - 90 }],
  },
  {
    id: 'int_h_06',
    account: 'facebook',
    type: 'comment',
    authorName: 'سامي القثامي',
    authorHandle: null,
    text: 'كم مدة صلاحية الحبوب بعد التحميص؟',
    at: 60 * 24 * 7,
    category: 'customer_service',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'أفضل مدة خلال ٣٠ يوماً من تاريخ التحميص.', at: 60 * 24 * 7 - 60 }],
  },
  {
    id: 'int_h_07',
    account: 'igCafe',
    type: 'comment',
    authorName: 'مي الخطيب',
    authorHandle: 'mai.kh',
    text: 'هل التحميص الفاتح مناسب للإسبريسو؟',
    at: 60 * 24 * 8,
    category: 'customer_service',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_08',
    account: 'tiktok',
    type: 'comment',
    authorName: 'زياد الحربي',
    authorHandle: 'ziyad.h',
    text: 'وين ألقى هالأكواب؟',
    at: 60 * 24 * 9,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_09',
    account: 'x',
    type: 'direct_message',
    authorName: 'لينا القاسم',
    authorHandle: 'lina_q',
    text: 'نبي نطلب كمية لمكتب الشركة، مع من نتواصل؟',
    at: 60 * 24 * 10,
    category: 'sales_intent',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'أرسلنا لك تفاصيل طلبات الشركات على البريد.', at: 60 * 24 * 10 - 180 }],
  },
  {
    id: 'int_h_10',
    account: 'facebook',
    type: 'comment',
    authorName: 'عمر باعشن',
    authorHandle: null,
    text: 'الطلب وصل متأخر يومين.',
    at: 60 * 24 * 11,
    category: 'negative',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'نعتذر عن التأخير، وعوّضناك بقسيمة على الطلب القادم.', at: 60 * 24 * 11 - 120 }],
  },
  {
    id: 'int_h_11',
    account: 'igCafe',
    type: 'comment',
    authorName: 'أسماء الغانم',
    authorHandle: 'asma.g',
    text: 'متى يفتح الفرع الجديد؟',
    at: 60 * 24 * 12,
    category: 'customer_service',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_12',
    account: 'tiktok',
    type: 'comment',
    authorName: 'فيصل المطرفي',
    authorHandle: 'faisal.m',
    text: 'كم سعر الطاحونة؟',
    at: 60 * 24 * 13,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_13',
    account: 'x',
    type: 'comment',
    authorName: 'هيا السويلم',
    authorHandle: 'haya_s',
    text: 'تجربة ممتازة في الفرع أمس.',
    at: 60 * 24 * 14,
    category: 'positive',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'سعدنا بزيارتك 🤎', at: 60 * 24 * 14 - 50 }],
  },
  {
    id: 'int_h_14',
    account: 'igStore',
    type: 'comment',
    authorName: 'محمد العتيق',
    authorHandle: 'm.alateeq',
    text: 'هل أقدر أرجع المنتج لو ما عجبني؟',
    at: 60 * 24 * 15,
    category: 'customer_service',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'نعم، الإرجاع متاح خلال ٧ أيام إذا كان المنتج مغلقاً.', at: 60 * 24 * 15 - 90 }],
  },
  {
    id: 'int_h_15',
    account: 'facebook',
    type: 'direct_message',
    authorName: 'نجود الفالح',
    authorHandle: null,
    text: 'عندكم بطاقات هدايا؟',
    at: 60 * 24 * 17,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_16',
    account: 'igCafe',
    type: 'comment',
    authorName: 'خلود الرشود',
    authorHandle: 'kholoud.r',
    text: 'الكولد برو متوفر طول الأسبوع؟',
    at: 60 * 24 * 19,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_17',
    account: 'tiktok',
    type: 'comment',
    authorName: 'ريان الشمراني',
    authorHandle: 'rayan.sh',
    text: 'أسلوب الشرح واضح، استمروا.',
    at: 60 * 24 * 21,
    category: 'positive',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_18',
    account: 'x',
    type: 'comment',
    authorName: 'سلطانة الدغيم',
    authorHandle: 'sultana_d',
    text: 'الطلب وصل بارد، ممكن تتحققون من التغليف؟',
    at: 60 * 24 * 23,
    category: 'customer_service',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'راجعنا التغليف مع شركة الشحن، ونعتذر عن التجربة.', at: 60 * 24 * 23 - 200 }],
  },
  {
    id: 'int_h_19',
    account: 'facebook',
    type: 'comment',
    authorName: 'أنس الطويل',
    authorHandle: null,
    text: 'هل يوجد خصم للطلاب؟',
    at: 60 * 24 * 26,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_20',
    account: 'igCafe',
    type: 'comment',
    authorName: 'جود الحمدان',
    authorHandle: 'joud.h',
    text: 'أفضل طريقة لحفظ الحبوب في البيت؟',
    at: 60 * 24 * 28,
    category: 'customer_service',
    read: true,
    status: 'open',
    thread: [{ by: 'business', text: 'في عبوة محكمة بعيداً عن الحرارة والضوء.', at: 60 * 24 * 28 - 70 }],
  },
  {
    id: 'int_h_21',
    account: 'igStore',
    type: 'direct_message',
    authorName: 'وسام الحميد',
    authorHandle: 'wesam.h',
    text: 'طلبي ما وصلني إشعار شحن.',
    at: 60 * 24 * 31,
    category: 'customer_service',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_22',
    account: 'tiktok',
    type: 'comment',
    authorName: 'بسمة العنقري',
    authorHandle: 'basma.a',
    text: 'أول مرة أعرف هالطريقة، شكراً.',
    at: 60 * 24 * 34,
    category: 'other',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_23',
    account: 'x',
    type: 'comment',
    authorName: 'صالح المزروع',
    authorHandle: 'saleh_m',
    text: 'هل تصدّرون خارج السعودية؟',
    at: 60 * 24 * 38,
    category: 'sales_intent',
    read: true,
    status: 'open',
  },
  {
    id: 'int_h_24',
    account: 'facebook',
    type: 'comment',
    authorName: 'غيداء البراك',
    authorHandle: null,
    text: 'الفرع يقبل الدفع بالمحفظة؟',
    at: 60 * 24 * 42,
    category: 'customer_service',
    read: true,
    status: 'open',
  },
  /*
   * Junk. Every network gets some, and the two Meta accounts show it taken
   * off the post while TikTok and X show what happens when the network gives
   * us no way to do that.
   */
  {
    id: 'int_ig_10',
    account: 'igCafe',
    type: 'comment',
    authorName: 'متجر المتابعين',
    authorHandle: 'followers.deal',
    text: 'متابعين حقيقيين وتفاعل مضمون بأرخص الأسعار 🔥 تواصل معنا خاص.',
    at: 12,
    category: 'spam',
  },
  {
    id: 'int_fb_08',
    account: 'facebook',
    type: 'comment',
    authorName: 'نقل وتغليف الرياض',
    authorHandle: null,
    text: 'أفضل شركة نقل وتغليف أثاث بالرياض، خصم ٣٠٪ هذا الأسبوع. اتصل الآن.',
    at: 47,
    category: 'spam',
  },
  {
    id: 'int_tt_08',
    account: 'tiktok',
    type: 'comment',
    authorName: 'ربح من الجوال',
    authorHandle: 'daily.profit',
    text: 'ربح يومي مضمون من البيت وبدون خبرة 💰 الرابط في الحساب.',
    at: 19,
    category: 'spam',
  },
  {
    id: 'int_x_07',
    account: 'x',
    type: 'comment',
    authorName: 'حساب مجهول',
    authorHandle: null,
    text: 'حساب فاشل وتسويق أفشل، سكّروا أحسن لكم 🤡',
    at: 52,
    category: 'spam',
  },
]

function buildMedia(seeds: MediaSeed[] | undefined): MediaAttachment[] {
  return (seeds ?? []).map((media) => ({
    kind: media.kind,
    // No binary assets ship with the mock: the UI renders a labelled
    // placeholder instead of a fabricated photo.
    url: null,
    thumbnailUrl: null,
    alt: media.alt,
    durationSeconds: media.seconds ?? null,
  }))
}

function buildMetadata(provider: SocialProvider, seed: InteractionSeed): ProviderMetadata {
  const suffix = seed.id.replace(/\D/g, '')
  switch (provider) {
    case 'facebook':
      return { provider: 'facebook', pageId: '10215544', postId: seed.context ? `post_${suffix}` : null }
    case 'instagram':
      return {
        provider: 'instagram',
        mediaId: seed.context ? `media_${suffix}` : null,
        isStoryReply: false,
      }
    case 'tiktok':
      return { provider: 'tiktok', videoId: seed.context ? `video_${suffix}` : null }
    case 'x':
      return { provider: 'x', tweetId: seed.context ? `tweet_${suffix}` : null, isQuote: false }
  }
}

function buildContext(seed: InteractionSeed): OriginalContent | null {
  if (!seed.context) return null
  return {
    providerContentId: `content_${seed.id}`,
    excerpt: seed.context.excerpt,
    publishedAt: minutesAgo(seed.context.at),
    media: buildMedia(seed.context.media),
    // Permalinks are omitted rather than invented: a fabricated provider URL
    // would be a dead external link in a product demo.
    permalink: null,
  }
}

function buildThread(seed: InteractionSeed): Reply[] {
  return (seed.thread ?? []).map((entry, index) => ({
    id: `${seed.id}_r${index + 1}`,
    interactionId: seed.id,
    authorKind: entry.by,
    author:
      entry.by === 'customer'
        ? {
            providerUserId: `u_${seed.id}`,
            displayName: seed.authorName,
            handle: seed.authorHandle,
            avatarUrl: null,
          }
        : null,
    text: entry.text,
    createdAt: minutesAgo(entry.at),
    state: entry.failed ? 'failed' : 'sent',
    failureReason: entry.failed ? 'تعذر إرسال الرد. حاول مرة أخرى.' : null,
  }))
}

function buildOne(
  seed: InteractionSeed,
  overrides?: { accountId?: string; organizationId?: string },
): Interaction {
  const provider = PROVIDER_BY_ACCOUNT[seed.account]
  const replies = buildThread(seed)
  const businessReplied = replies.some((r) => r.authorKind === 'business' && r.state === 'sent')

  return {
    id: seed.id,
    organizationId: overrides?.organizationId ?? ORG_ID,
    provider,
    connectedAccountId: overrides?.accountId ?? ACCOUNT_IDS[seed.account],
    providerInteractionId: `${provider}_${seed.id}`,
    type: seed.type,
    author: {
      providerUserId: `u_${seed.id}`,
      displayName: seed.authorName,
      handle: seed.authorHandle,
      avatarUrl: null,
    },
    text: seed.text,
    createdAt: minutesAgo(seed.at),
    isRead: seed.read ?? false,
    status: seed.status ?? 'new',
    category: seed.category,
    // Derived, never authored: the one place that decides whether a flagged
    // comment actually came off the post is the domain resolver.
    publicVisibility: resolvePublicVisibility(
      seed.category,
      seed.type,
      PROVIDER_CAPABILITIES[provider],
    ),
    replyState: businessReplied ? 'sent' : 'none',
    replies,
    originalContent: buildContext(seed),
    media: buildMedia(seed.media),
    capabilities: PROVIDER_CAPABILITIES[provider],
    metadata: buildMetadata(provider, seed),
  } satisfies Interaction
}

const byNewestFirst = (a: Interaction, b: Interaction) => b.createdAt.localeCompare(a.createdAt)

export function buildSeedInteractions(): Interaction[] {
  return SEEDS.map((seed) => buildOne(seed)).sort(byNewestFirst)
}

/**
 * Backfill used when a brand-new tenant connects its first account — the mock
 * equivalent of a provider's initial history sync. Seeds for the provider are
 * re-pointed at the freshly created account so ids stay consistent.
 */
export function buildInteractionsForProvider(input: {
  provider: SocialProvider
  accountId: string
  organizationId: string
}): Interaction[] {
  return SEEDS.filter((seed) => PROVIDER_BY_ACCOUNT[seed.account] === input.provider)
    .map((seed) =>
      buildOne(seed, { accountId: input.accountId, organizationId: input.organizationId }),
    )
    .sort(byNewestFirst)
}

/** Guard against a seed pointing at an account that does not exist. */
export function assertSeedIntegrity(): void {
  const ids = new Set(seedAccounts.map((account) => account.id))
  for (const seed of SEEDS) {
    if (!ids.has(ACCOUNT_IDS[seed.account])) {
      throw new Error(`Seed ${seed.id} references unknown account ${seed.account}`)
    }
  }
}
