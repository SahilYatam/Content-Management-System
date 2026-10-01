import architecture from "@/assets/editorial-architecture.jpg";
import design from "@/assets/editorial-design.jpg";
import culture from "@/assets/editorial-culture.jpg";

export const articles = [
    {
        slug: "the-art-of-paying-attention",
        category: "Perspective",
        title: "The art of paying attention",
        description:
            "In a world designed to distract us, noticing the details might be the most radical thing we can do.",
        author: "Elena Rivers",
        date: "Sep 18, 2026",
        readTime: "8 min read",
        image: architecture,
        status: "Published",
    },
    {
        slug: "spaces-that-make-us-feel",
        category: "Design",
        title: "Spaces that make us feel something",
        description:
            "How thoughtful design shapes the everyday moments we remember.",
        author: "Marcus Chen",
        date: "Sep 14, 2026",
        readTime: "6 min read",
        image: design,
        status: "Published",
    },
    {
        slug: "a-slower-kind-of-city",
        category: "Culture",
        title: "A slower kind of city",
        description:
            "Finding room to breathe, reconnect, and rediscover the places we call home.",
        author: "Amara Okafor",
        date: "Sep 10, 2026",
        readTime: "5 min read",
        image: culture,
        status: "Published",
    },
    {
        slug: "the-beauty-of-less",
        category: "Ideas",
        title: "The beauty of less",
        description:
            "A fresh perspective on making space for what really matters.",
        author: "Sophie Laurent",
        date: "Sep 7, 2026",
        readTime: "7 min read",
        image: design,
        status: "Published",
    },
    {
        slug: "where-we-go-to-think",
        category: "Perspective",
        title: "Where we go to think",
        description:
            "On the quiet corners and familiar places that help ideas take shape.",
        author: "Daniel Foster",
        date: "Sep 3, 2026",
        readTime: "9 min read",
        image: culture,
        status: "Published",
    },
];

export const editorialArticles = [
    {
        title: "The art of paying attention",
        author: "Elena Rivers",
        category: "Perspective",
        date: "Sep 18, 2026",
        status: "Published",
    },
    {
        title: "A quieter way to create",
        author: "You",
        category: "Ideas",
        date: "Sep 17, 2026",
        status: "In review",
    },
    {
        title: "Notes from the in-between",
        author: "You",
        category: "Culture",
        date: "Sep 15, 2026",
        status: "Draft",
    },
    {
        title: "Spaces that make us feel something",
        author: "Marcus Chen",
        category: "Design",
        date: "Sep 14, 2026",
        status: "Published",
    },
    {
        title: "The case for a creative pause",
        author: "You",
        category: "Perspective",
        date: "Sep 12, 2026",
        status: "Draft",
    },
];

export const roleRequests = [
    {
        initials: "JD",
        name: "Jordan Davis",
        email: "jordan.davis@example.com",
        role: "Editor",
        date: "Sep 20, 2026",
    },
    {
        initials: "SK",
        name: "Samira Khan",
        email: "samira.khan@example.com",
        role: "Editor",
        date: "Sep 19, 2026",
    },
    {
        initials: "AL",
        name: "Alex Lee",
        email: "alex.lee@example.com",
        role: "Editor",
        date: "Sep 18, 2026",
    },
];

export const activity = [
    {
        initials: "ER",
        name: "Elena Rivers",
        action: "published",
        subject: "The art of paying attention",
        time: "2 hours ago",
        tone: "green",
    },
    {
        initials: "MC",
        name: "Marcus Chen",
        action: "submitted for review",
        subject: "A study in light",
        time: "4 hours ago",
        tone: "amber",
    },
    {
        initials: "SK",
        name: "Samira Khan",
        action: "requested editor access",
        subject: "",
        time: "Yesterday",
        tone: "blue",
    },
    {
        initials: "AL",
        name: "Alex Lee",
        action: "joined Folio",
        subject: "",
        time: "Yesterday",
        tone: "neutral",
    },
];

export const auditActivity = [
    {
        event: "Article published",
        actor: "Elena Rivers",
        time: "Today, 10:42 AM",
    },
    {
        event: "Role request submitted",
        actor: "Samira Khan",
        time: "Yesterday, 3:18 PM",
    },
    {
        event: "Article sent for review",
        actor: "Marcus Chen",
        time: "Yesterday, 11:05 AM",
    },
];

export type CardArticle = {
    slug: string;
    category: string;
    title: string;
    description: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    status?: string;
};
