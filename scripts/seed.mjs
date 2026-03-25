// // Run: node scripts/seed.mjs
// import mongoose from "mongoose";
// import * as dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";

// const __dirname = dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: join(__dirname, "../.env.local") });

// const packageSchema = new mongoose.Schema(
//   {
//     title: String,
//     description: String,
//     destination: String,
//     division: String,
//     price: Number,
//     oldPrice: Number,
//     duration: String,
//     image: String,
//     gallery: [String],
//     category: String,
//     rating: Number,
//     featured: Boolean,
//     isFlashDeal: Boolean,
//     maxGroupSize: Number,
//     includes: [String],
//     excludes: [String],
//     highlights: [String],
//     itinerary: [{ day: Number, title: String, description: String }],
//   },
//   { timestamps: true },
// );

// const Package =
//   mongoose.models.Package || mongoose.model("Package", packageSchema);

// // const packages = [
// //   {
// //     title: "কক্সবাজার সানসেট প্যাকেজ",
// //     description:
// //       "বিশ্বের দীর্ঘতম সমুদ্র সৈকতে ৩ দিনের অসাধারণ অভিজ্ঞতা। হিমছড়ি ঝর্ণা, ইনানী বিচ ও রাডার হিল ভ্রমণ সহ সম্পূর্ণ প্যাকেজ। সূর্যাস্তের সোনালি আভায় সমুদ্রের ঢেউয়ের সাথে মিশে যান।",
// //     destination: "কক্সবাজার",
// //     division: "Chittagong",
// //     price: 8500,
// //     oldPrice: 10000,
// //     duration: "৩ দিন / ২ রাত",
// //     image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80",
// //     gallery: [
// //       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
// //       "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
// //       "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80",
// //     ],
// //     category: "beach",
// //     rating: 4.9,
// //     featured: true,
// //     isFlashDeal: true,
// //     maxGroupSize: 20,
// //     includes: ["এসি হোটেল (২ রাত)", "ঢাকা-কক্সবাজার বাস", "সকালের নাস্তা", "লোকাল গাইড", "হিমছড়ি এন্ট্রি ফি"],
// //     excludes: ["লাঞ্চ ও ডিনার", "ব্যক্তিগত খরচ", "বিমান টিকিট"],
// //     highlights: ["সূর্যাস্ত দেখা", "হিমছড়ি ঝর্ণা", "ইনানী বিচ", "সামুদ্রিক খাবার", "রাডার হিল"],
// //     itinerary: [
// //       { day: 1, title: "ঢাকা থেকে যাত্রা শুরু", description: "রাত ১০টায় ঢাকা থেকে এসি বাসে রওনা। পথে বিশ্রাম।" },
// //       { day: 2, title: "কক্সবাজার আগমন ও সৈকত অন্বেষণ", description: "সকালে পৌঁছানো, হোটেল চেক-ইন। বিকেলে হিমছড়ি ও ইনানী বিচ। সন্ধ্যায় সূর্যাস্ত উপভোগ।" },
// //       { day: 3, title: "রাডার হিল ও প্রত্যাবর্তন", description: "সকালে রাডার হিল ভ্রমণ। দুপুরে হোটেল চেক-আউট। রাতে ঢাকার উদ্দেশ্যে রওনা।" },
// //     ],
// //   },
// //   {
// //     title: "সুন্দরবন রয়েল বেঙ্গল ট্যুর",
// //     description:
// //       "ইউনেস্কো বিশ্ব ঐতিহ্যবাহী সুন্দরবনে ৪ দিনের রোমাঞ্চকর অভিযান। রয়েল বেঙ্গল টাইগার, ইরাবতী ডলফিন ও অসংখ্য পাখির সাথে পরিচিত হোন। নৌকায় ভেসে ম্যানগ্রোভ বনের গভীরে যান।",
// //     destination: "সুন্দরবন",
// //     division: "Khulna",
// //     price: 12000,
// //     oldPrice: 14500,
// //     duration: "৪ দিন / ৩ রাত",
// //     image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
// //     gallery: [
// //       "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
// //       "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
// //     ],
// //     category: "adventure",
// //     rating: 4.8,
// //     featured: true,
// //     isFlashDeal: false,
// //     maxGroupSize: 12,
// //     includes: ["লঞ্চে থাকা ও খাওয়া", "ঢাকা-খুলনা বাস", "বন বিভাগের অনুমতি", "অভিজ্ঞ গাইড", "লাইফ জ্যাকেট"],
// //     excludes: ["ব্যক্তিগত বীমা", "ব্যক্তিগত খরচ"],
// //     highlights: ["বাঘ দেখার সুযোগ", "ডলফিন দেখা", "করমজল ভ্রমণ", "কটকা বিচ", "হিরণ পয়েন্ট"],
// //     itinerary: [
// //       { day: 1, title: "খুলনা যাত্রা", description: "ঢাকা থেকে বাসে খুলনা। লঞ্চে উঠে সুন্দরবনের উদ্দেশ্যে রওনা।" },
// //       { day: 2, title: "করমজল ও কটকা", description: "সকালে করমজল বন্যপ্রাণী কেন্দ্র। বিকেলে কটকা বিচ।" },
// //       { day: 3, title: "হিরণ পয়েন্ট", description: "ভোরে হিরণ পয়েন্টে বাঘ দেখার সুযোগ। ডলফিন দেখা।" },
// //       { day: 4, title: "ফিরে আসা", description: "সকালে লঞ্চে ফিরতি যাত্রা। বিকেলে খুলনা থেকে ঢাকা।" },
// //     ],
// //   },
// //   {
// //     title: "বান্দরবান মেঘের রাজ্য ট্রেক",
// //     description:
// //       "বান্দরবানের নীলগিরি, বগালেক ও নাফাখুম ঝর্ণায় ৫ দিনের অ্যাডভেঞ্চার ট্রেক। মেঘের মধ্যে হেঁটে যান, পাহাড়ি জনগোষ্ঠীর সংস্কৃতি উপভোগ করুন।",
// //     destination: "বান্দরবান",
// //     division: "Chittagong",
// //     price: 9800,
// //     oldPrice: null,
// //     duration: "৫ দিন / ৪ রাত",
// //     image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
// //     gallery: [
// //       "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
// //       "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
// //     ],
// //     category: "adventure",
// //     rating: 4.9,
// //     featured: true,
// //     isFlashDeal: false,
// //     maxGroupSize: 10,
// //     includes: ["রিসোর্ট ও গেস্টহাউস", "সব খাবার", "ট্রেকিং গাইড", "পোর্টার সার্ভিস", "ঢাকা-বান্দরবান বাস"],
// //     excludes: ["ব্যক্তিগত ট্রেকিং গিয়ার", "ব্যক্তিগত বীমা"],
// //     highlights: ["নীলগিরি সূর্যোদয়", "বগালেক", "নাফাখুম ঝর্ণা", "কেওক্রাডং", "আদিবাসী গ্রাম"],
// //     itinerary: [
// //       { day: 1, title: "বান্দরবান আগমন", description: "ঢাকা থেকে রাতের বাসে বান্দরবান। সকালে হোটেলে বিশ্রাম।" },
// //       { day: 2, title: "নীলগিরি ভ্রমণ", description: "নীলগিরিতে মেঘের মধ্যে সূর্যোদয়। শৈলপ্রপাত ঝর্ণা।" },
// //       { day: 3, title: "বগালেক ট্রেক", description: "রুমা বাজার থেকে বগালেক ট্রেক। রাতে লেকের পাড়ে ক্যাম্প।" },
// //       { day: 4, title: "নাফাখুম ঝর্ণা", description: "বগালেক থেকে নাফাখুম ঝর্ণায় ট্রেক। বাংলাদেশের নায়াগ্রা।" },
// //       { day: 5, title: "ফিরে আসা", description: "সকালে ফিরতি যাত্রা। বিকেলে বান্দরবান থেকে ঢাকা।" },
// //     ],
// //   },
// //   {
// //     title: "সিলেট চা বাগান ও হাওর ট্যুর",
// //     description:
// //       "সবুজ চা বাগান, রাতারগুল জলাবন, বিছানাকান্দি ও জাফলংয়ে ৩ দিনের প্রকৃতি ভ্রমণ। সিলেটের অপরূপ সৌন্দর্য উপভোগ করুন।",
// //     destination: "সিলেট",
// //     division: "Sylhet",
// //     price: 7500,
// //     oldPrice: 9000,
// //     duration: "৩ দিন / ২ রাত",
// //     image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
// //     gallery: [
// //       "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
// //     ],
// //     category: "cultural",
// //     rating: 4.7,
// //     featured: false,
// //     isFlashDeal: false,
// //     maxGroupSize: 15,
// //     includes: ["হোটেল (২ রাত)", "ঢাকা-সিলেট ট্রেন", "নৌকা ভাড়া", "গাইড", "সকালের নাস্তা"],
// //     excludes: ["লাঞ্চ ও ডিনার", "ব্যক্তিগত খরচ"],
// //     highlights: ["রাতারগুল জলাবন", "বিছানাকান্দি", "জাফলং", "লালাখাল", "চা বাগান"],
// //     itinerary: [
// //       { day: 1, title: "সিলেট আগমন", description: "ট্রেনে সিলেট। বিকেলে চা বাগান ভ্রমণ। রাতে হোটেলে বিশ্রাম।" },
// //       { day: 2, title: "রাতারগুল ও বিছানাকান্দি", description: "সকালে রাতারগুল জলাবনে নৌকা ভ্রমণ। বিকেলে বিছানাকান্দি।" },
// //       { day: 3, title: "জাফলং ও প্রত্যাবর্তন", description: "সকালে জাফলং ও লালাখাল। বিকেলে ঢাকার উদ্দেশ্যে রওনা।" },
// //     ],
// //   },
// //   {
// //     title: "সেন্ট মার্টিন প্রবাল দ্বীপ ট্যুর",
// //     description:
// //       "বাংলাদেশের একমাত্র প্রবাল দ্বীপে ৪ দিনের স্বপ্নের ছুটি। স্বচ্ছ নীল জলে স্নোরকেলিং, ছেঁড়াদ্বীপ ভ্রমণ ও সানরাইজ উপভোগ করুন।",
// //     destination: "সেন্ট মার্টিন",
// //     division: "Chittagong",
// //     price: 11500,
// //     oldPrice: 13000,
// //     duration: "৪ দিন / ৩ রাত",
// //     image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
// //     gallery: [
// //       "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
// //     ],
// //     category: "beach",
// //     rating: 4.7,
// //     featured: true,
// //     isFlashDeal: false,
// //     maxGroupSize: 12,
// //     includes: ["রিসোর্ট (৩ রাত)", "কক্সবাজার-সেন্ট মার্টিন জাহাজ", "সব খাবার", "স্নোরকেলিং গিয়ার"],
// //     excludes: ["ঢাকা-কক্সবাজার যাতায়াত", "ব্যক্তিগত খরচ"],
// //     highlights: ["প্রবাল প্রাচীর", "ছেঁড়াদ্বীপ", "স্নোরকেলিং", "সানরাইজ বিচ", "তাজা সামুদ্রিক খাবার"],
// //     itinerary: [
// //       { day: 1, title: "কক্সবাজার থেকে জাহাজে", description: "সকালে কক্সবাজার থেকে জাহাজে সেন্ট মার্টিন। রিসোর্টে চেক-ইন।" },
// //       { day: 2, title: "দ্বীপ অন্বেষণ", description: "সকালে স্নোরকেলিং। বিকেলে দ্বীপের চারপাশে হাঁটা।" },
// //       { day: 3, title: "ছেঁড়াদ্বীপ", description: "ট্রলারে ছেঁড়াদ্বীপ। প্রবাল সংগ্রহ ও ফটোগ্রাফি।" },
// //       { day: 4, title: "ফিরে আসা", description: "সকালে সানরাইজ দেখা। জাহাজে কক্সবাজার ফিরে আসা।" },
// //     ],
// //   },
// //   {
// //     title: "রাঙামাটি কাপ্তাই লেক ট্যুর",
// //     description:
// //       "কাপ্তাই লেকের নীল জলে নৌকায় ভেসে পাহাড়ি জীবনের স্বাদ নিন। ঝুলন্ত সেতু, সুবলং ঝর্ণা ও আদিবাসী সংস্কৃতির সাথে পরিচিত হোন।",
// //     destination: "রাঙামাটি",
// //     division: "Chittagong",
// //     price: 6500,
// //     oldPrice: null,
// //     duration: "২ দিন / ১ রাত",
// //     image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
// //     gallery: [],
// //     category: "cultural",
// //     rating: 4.6,
// //     featured: false,
// //     isFlashDeal: true,
// //     maxGroupSize: 15,
// //     includes: ["হোটেল (১ রাত)", "নৌকা ভাড়া", "গাইড", "সকালের নাস্তা"],
// //     excludes: ["ঢাকা-রাঙামাটি যাতায়াত", "লাঞ্চ ও ডিনার"],
// //     highlights: ["কাপ্তাই লেক", "ঝুলন্ত সেতু", "সুবলং ঝর্ণা", "পেদা টিং টিং", "আদিবাসী গ্রাম"],
// //     itinerary: [
// //       { day: 1, title: "রাঙামাটি আগমন", description: "সকালে রাঙামাটি পৌঁছানো। নৌকায় কাপ্তাই লেক ভ্রমণ। ঝুলন্ত সেতু।" },
// //       { day: 2, title: "সুবলং ঝর্ণা ও প্রত্যাবর্তন", description: "সকালে সুবলং ঝর্ণা। পেদা টিং টিং রেস্তোরাঁয় লাঞ্চ। বিকেলে ফিরে আসা।" },
// //     ],
// //   },
// //   {
// //     title: "কক্সবাজার হানিমুন স্পেশাল",
// //     description:
// //       "নবদম্পতিদের জন্য বিশেষভাবে সাজানো রোমান্টিক প্যাকেজ। বিচফ্রন্ট রিসোর্ট, ক্যান্ডেল-লিট ডিনার ও প্রাইভেট বিচ অ্যাক্সেস সহ।",
// //     destination: "কক্সবাজার",
// //     division: "Chittagong",
// //     price: 18000,
// //     oldPrice: 22000,
// //     duration: "৪ দিন / ৩ রাত",
// //     image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
// //     gallery: [],
// //     category: "honeymoon",
// //     rating: 5.0,
// //     featured: true,
// //     isFlashDeal: false,
// //     maxGroupSize: 2,
// //     includes: ["বিচফ্রন্ট রিসোর্ট", "সব খাবার", "ক্যান্ডেল-লিট ডিনার", "স্পা সেশন", "প্রাইভেট ট্রান্সফার"],
// //     excludes: ["ব্যক্তিগত খরচ"],
// //     highlights: ["প্রাইভেট বিচ", "সানসেট ক্রুজ", "স্পা ও ম্যাসাজ", "ক্যান্ডেল-লিট ডিনার", "ফুলের সাজসজ্জা"],
// //     itinerary: [
// //       { day: 1, title: "আগমন ও স্বাগত", description: "বিমানবন্দর থেকে প্রাইভেট গাড়িতে রিসোর্ট। ওয়েলকাম ড্রিংক ও ফুলের সাজসজ্জা।" },
// //       { day: 2, title: "বিচ ও স্পা", description: "সকালে প্রাইভেট বিচে সময়। বিকেলে স্পা সেশন। সন্ধ্যায় সানসেট ক্রুজ।" },
// //       { day: 3, title: "দ্বীপ ভ্রমণ", description: "মহেশখালী দ্বীপ ভ্রমণ। রাতে ক্যান্ডেল-লিট ডিনার।" },
// //       { day: 4, title: "বিদায়", description: "সকালে বিচে শেষ হাঁটা। চেক-আউট ও প্রত্যাবর্তন।" },
// //     ],
// //   },
// //   {
// //     title: "সিলেট ফ্যামিলি ফান প্যাকেজ",
// //     description:
// //       "পরিবারের সবার জন্য আনন্দময় সিলেট ভ্রমণ। শিশুদের জন্য বিশেষ কার্যক্রম সহ চা বাগান, ঝর্ণা ও হাওরের অপরূপ সৌন্দর্য উপভোগ করুন।",
// //     destination: "সিলেট",
// //     division: "Sylhet",
// //     price: 15000,
// //     oldPrice: 18000,
// //     duration: "৪ দিন / ৩ রাত",
// //     image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
// //     gallery: [],
// //     category: "family",
// //     rating: 4.8,
// //     featured: false,
// //     isFlashDeal: false,
// //     maxGroupSize: 20,
// //     includes: ["ফ্যামিলি রুম (৩ রাত)", "সব খাবার", "এসি গাড়ি", "গাইড", "শিশু কার্যক্রম"],
// //     excludes: ["ঢাকা-সিলেট যাতায়াত", "ব্যক্তিগত খরচ"],
// //     highlights: ["চা বাগানে পিকনিক", "রাতারগুল নৌকা", "জাফলং পাথর সংগ্রহ", "মাধবকুণ্ড ঝর্ণা"],
// //     itinerary: [
// //       { day: 1, title: "সিলেট আগমন", description: "হোটেলে চেক-ইন। বিকেলে চা বাগান ভ্রমণ।" },
// //       { day: 2, title: "রাতারগুল ও বিছানাকান্দি", description: "নৌকায় রাতারগুল। বিকেলে বিছানাকান্দি।" },
// //       { day: 3, title: "জাফলং ও মাধবকুণ্ড", description: "সকালে জাফলং। বিকেলে মাধবকুণ্ড ঝর্ণা।" },
// //       { day: 4, title: "প্রত্যাবর্তন", description: "সকালে শেষ কেনাকাটা। বিকেলে ঢাকার উদ্দেশ্যে রওনা।" },
// //     ],
// //   },
// // ];

// async function seed() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ MongoDB connected");

//     await mongoose.connection.collection("packages").deleteMany({});
//     console.log("🗑️  Old packages cleared");

//     await Package.insertMany(packages);
//     console.log(`✅ ${packages.length} packages inserted successfully`);

//     await mongoose.disconnect();
//     console.log("✅ Done! Visit /packages to see the data.");
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     process.exit(1);
//   }
// }

// seed();
