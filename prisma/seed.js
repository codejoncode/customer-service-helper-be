"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createdBy = 'system'; // Replace with actual seeded user ID if needed
const tagWrap = (entries) => entries.map(entry => (Object.assign(Object.assign({}, entry), { createdBy })));
const accountFaqs = tagWrap([
    {
        question: 'How do I create a new account?',
        answer: "Visit the signup page and fill in your basic information. You'll receive a confirmation email.",
        tags: ['signup', 'account', 'onboarding'],
    },
    {
        question: 'Do I need an email to sign up?',
        answer: 'Yes, a valid email is required for verification and account recovery.',
        tags: ['signup', 'email', 'requirements'],
    },
    {
        question: 'Can I sign up using a phone number?',
        answer: 'Not currently. Sign-up requires a valid email address.',
        tags: ['signup', 'phone', 'limitations'],
    },
    {
        question: 'Why didn’t I receive my confirmation email?',
        answer: "Check your spam folder and ensure you've entered a valid address. You can request a new one on the login screen.",
        tags: ['signup', 'email', 'troubleshooting'],
    },
    {
        question: 'Is there a waiting period after signing up?',
        answer: 'No — your account is active as soon as it’s confirmed by email.',
        tags: ['signup', 'activation', 'account'],
    },
]);
const loginFaqs = tagWrap([
    {
        question: 'How do I reset my password?',
        answer: "Click 'Forgot Password' on the login screen and follow the instructions sent to your email.",
        tags: ['login', 'password', 'security'],
    },
    {
        question: 'I forgot my username — what do I do?',
        answer: 'Contact support or use the email lookup feature on the login page.',
        tags: ['login', 'username', 'recovery'],
    },
    {
        question: 'Why was my account locked?',
        answer: 'Accounts lock after repeated failed login attempts. Wait 15 minutes or contact support to unlock.',
        tags: ['login', 'locked', 'security'],
    },
    {
        question: 'Can I enable two-factor authentication?',
        answer: 'Yes! Visit your account settings and choose your preferred authentication method.',
        tags: ['security', '2FA', 'settings'],
    },
    {
        question: 'Is my account secure?',
        answer: 'We use encryption and access controls to ensure your data is protected. Keep your password private and updated.',
        tags: ['security', 'account', 'data'],
    },
]);
const featureFaqs = tagWrap([
    {
        question: 'Where can I find my recent activity?',
        answer: 'Your dashboard displays recent interactions, updates, and call history.',
        tags: ['dashboard', 'activity', 'navigation'],
    },
    {
        question: 'Can I customize my homepage?',
        answer: 'Yes — under settings you can choose what widgets and panels appear on your main view.',
        tags: ['homepage', 'customization', 'features'],
    },
    {
        question: 'How do I search for articles?',
        answer: 'Use the search bar at the top of the Articles tab. You can filter by tag or keyword.',
        tags: ['search', 'articles', 'features'],
    },
    {
        question: 'Is dark mode available?',
        answer: 'Absolutely. Go to your profile settings and toggle on Dark Mode.',
        tags: ['features', 'UI', 'settings'],
    },
    {
        question: 'What’s the Loop integration for?',
        answer: 'Loop lets you collaborate with agents and view live summaries tied to call logs and transcripts.',
        tags: ['loop', 'collaboration', 'integration'],
    },
]);
const troubleshootingFaqs = tagWrap([
    {
        question: 'Why isn’t my checklist saving?',
        answer: 'Make sure all required fields are filled and that your connection is stable.',
        tags: ['checklist', 'save', 'troubleshooting'],
    },
    {
        question: 'The system froze during a call — what should I do?',
        answer: 'Try refreshing your browser. If the issue persists, log out and back in. If unresolved, report a bug.',
        tags: ['crash', 'call', 'performance'],
    },
    {
        question: 'Why can’t I access my organization page?',
        answer: "Check that you're assigned to an active organization. Managers can update your access.",
        tags: ['organization', 'access', 'troubleshooting'],
    },
    {
        question: 'Notifications aren’t showing up.',
        answer: 'Check browser permissions and confirm notification settings are enabled under your profile.',
        tags: ['notifications', 'settings', 'troubleshooting'],
    },
    {
        question: 'My agent summary isn’t loading.',
        answer: 'It may be delayed by transcript processing. Wait a moment or refresh the Loop tab.',
        tags: ['summary', 'agent', 'performance'],
    },
]);
const trainingFaqs = tagWrap([
    {
        question: 'What is Training Mode?',
        answer: 'Training Mode simulates agent tasks with feedback. It’s perfect for new hires or refresher sessions.',
        tags: ['training', 'simulation', 'onboarding'],
    },
    {
        question: 'How do I mark a call as reviewed?',
        answer: 'Use the ‘Mark Reviewed’ button at the end of the call log view. Managers can track completions.',
        tags: ['review', 'call', 'training'],
    },
    {
        question: 'Is there a guide for new agents?',
        answer: 'Yes — access the Help Center tab and select ‘New Agent Guide’. It walks you through all key functions.',
        tags: ['guide', 'new agent', 'training'],
    },
    {
        question: 'How do I connect with my trainer?',
        answer: 'Use Teams to message your assigned trainer directly or join the onboarding channel.',
        tags: ['trainer', 'Teams', 'support'],
    },
    {
        question: 'Can I rewatch past training simulations?',
        answer: 'Yes — past sessions are saved under the Training tab. You can replay and view feedback.',
        tags: ['training', 'sessions', 'feedback'],
    },
]);
const faqs = [
    ...accountFaqs,
    ...loginFaqs,
    ...featureFaqs,
    ...troubleshootingFaqs,
    ...trainingFaqs,
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const faq of faqs) {
            yield prisma.fAQ.create({ data: faq });
        }
    });
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
