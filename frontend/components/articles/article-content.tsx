import { Feedback } from "@/lib/types/prototype-store";
import { formatDateTime } from "@/lib/types/prototype-store";

type ArticleBodyProps = {
    content: string;
};

export function ArticleBody({ content }: ArticleBodyProps) {
    const blocks = content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

    return (
        <>
            {blocks.map((block, index) => {
                if (block.startsWith("## ")) {
                    return <h2 key={index}>{block.slice(3)}</h2>;
                }

                if (block.startsWith("> ")) {
                    return (
                        <blockquote key={index}>{block.slice(2)}</blockquote>
                    );
                }

                return (
                    <p
                        key={index}
                        className={index === 0 ? "lead-paragraph" : undefined}
                    >
                        {block}
                    </p>
                );
            })}
        </>
    );
}

type FeedbackNoteProps = {
    feedback: Feedback;
};

export function FeedbackNote({ feedback }: FeedbackNoteProps) {
    const label =
        feedback.kind === "changes" ? "CHANGES REQUESTED" : "REJECTED";

    return (
        <div className={`feedback-note feedback-${feedback.kind}`}>
            {" "}
            <span className="eyebrow">
                {label} · {feedback.by} · {formatDateTime(feedback.at)}{" "}
            </span>
            <p>{feedback.message || "No reason was given."}</p>
        </div>
    );
}
