"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContent, ContentPath } from "../contents/useContent";
import { termsAndConditionsContent as defaultContent } from "../contents/terms-conditions/content";
import { cn } from "@/lib/utils";
import { RichTextBlock, RichTextInline, richTextToPlainText } from "./RichTextContent";

interface LegalLayoutProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function LegalLayout({ contentPath, content }: LegalLayoutProps) {
    const finalContent = useContent(contentPath, content || defaultContent);

    const contentRef = useRef<HTMLDivElement | null>(null);
    const [activeSection, setActiveSection] = useState<string>("");
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

    const isValidSectionId = useCallback(
        (sectionId: string) => finalContent.toc.some((item) => item.id === sectionId),
        [finalContent.toc]
    );

    const syncHash = useCallback((sectionId: string, historyMode: "push" | "replace" = "push") => {
        if (typeof window === "undefined") return;
        const nextUrl = `${window.location.pathname}${window.location.search}#${sectionId}`;
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (nextUrl === currentUrl) return;
        window.history[historyMode === "replace" ? "replaceState" : "pushState"](
            window.history.state,
            "",
            nextUrl
        );
    }, []);

    const scrollToSection = useCallback((
        sectionId: string,
        options?: { behavior?: ScrollBehavior; historyMode?: "push" | "replace"; syncUrl?: boolean }
    ) => {
        const element = document.getElementById(sectionId);
        if (!element) return;
        const behavior = options?.behavior ?? "smooth";
        const historyMode = options?.historyMode ?? "push";
        const shouldSyncUrl = options?.syncUrl ?? true;

        const container = contentRef.current;
        const useContainer = !!container && container.scrollHeight > container.clientHeight;
        if (useContainer && container) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const offset = elementRect.top - containerRect.top + container.scrollTop - 120;
            container.scrollTo({ top: offset, behavior });
            if (shouldSyncUrl) {
                syncHash(sectionId, historyMode);
            }
            return;
        }

        element.scrollIntoView({ behavior, block: "start" });
        if (shouldSyncUrl) {
            syncHash(sectionId, historyMode);
        }
    }, [syncHash]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const applyHashState = () => {
            const hashSectionId = window.location.hash.replace(/^#/, "");
            if (!hashSectionId) {
                setActiveSection("");
                return;
            }
            if (!isValidSectionId(hashSectionId)) return;
            setActiveSection(hashSectionId);
            scrollToSection(hashSectionId, { behavior: "auto", syncUrl: false });
        };

        // Allow initial render/layout to settle before scrolling to hash.
        const timeoutId = window.setTimeout(applyHashState, 0);
        const handlePopState = () => applyHashState();
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [finalContent.toc, isValidSectionId, scrollToSection]);

    useEffect(() => {
        const handleScroll = () => {
            const sections = finalContent.toc.map((item) => item.id);
            let current = "";
            const container = contentRef.current;
            const useContainer = !!container && container.scrollHeight > container.clientHeight;
            const containerRect = useContainer ? container.getBoundingClientRect() : undefined;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (!element) continue;
                const rect = element.getBoundingClientRect();
                const offsetTop = containerRect
                    ? rect.top - containerRect.top
                    : rect.top;
                if (offsetTop <= 150) { // Offset for navbar
                    current = section;
                }
            }

            setActiveSection(current);
            if (current) {
                syncHash(current, "replace");
            }
        };

        const container = contentRef.current;
        const useContainer = !!container && container.scrollHeight > container.clientHeight;
        if (useContainer && container) {
            container.addEventListener("scroll", handleScroll);
        } else {
            window.addEventListener("scroll", handleScroll);
        }

        handleScroll();

        return () => {
            if (useContainer && container) {
                container.removeEventListener("scroll", handleScroll);
            } else {
                window.removeEventListener("scroll", handleScroll);
            }
        };
    }, [finalContent.toc, syncHash]);

    return (
        <div className="min-h-screen w-full bg-[#FCFCFD]">
            {/* Main Container - Responsive Padding and Flex Logic */}
            <div className="container mx-auto flex max-w-[1180px] flex-col gap-[30px] px-4 py-[60px] lg:flex-row lg:items-start lg:py-[100px]">

                {/* Mobile TOC - Visible below LG */}
                <div className="w-full lg:hidden block order-1">
                    <button
                        onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                        className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm border border-gray-100"
                    >
                        <span className="font-nunito text-[16px] font-bold text-[#1E1F21]">Table of Contents</span>
                        <span className={`transform transition-transform ${isMobileTocOpen ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>
                    {isMobileTocOpen && (
                        <nav className="mt-2 flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                            {finalContent.toc.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={cn(
                                        "block font-nunito text-[14px] font-semibold leading-[24px] tracking-[0.49px] transition-colors",
                                        activeSection === item.id
                                            ? "text-[#06457F]"
                                            : "text-[#667085] hover:text-[#06457F]"
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(item.id);
                                        setIsMobileTocOpen(false);
                                    }}
                                >
                                    <RichTextInline content={item.label} />
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                {/* Main Content Column - Responsive Width */}
                <main
                    ref={contentRef}
                    className="w-full flex-none lg:w-[848px] order-2 lg:order-1 lg:h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-4"
                >
                    <div className="flex flex-col gap-[30px] lg:gap-[40px]">

                        {/* Header Block inside Main Content */}
                        <div className="flex flex-col items-start gap-[20px] lg:gap-[25px]">
                            <RichTextBlock
                                as="div"
                                content={finalContent.header.title}
                                defaultTag="h1"
                                className="font-dm-sans text-[28px] lg:text-[38px] font-normal leading-[1.2] lg:leading-[48px] tracking-[0.5px] lg:tracking-[1.425px] text-[#1E2022]"
                            />

                            {finalContent.header.lastUpdated && (
                                <div className="flex h-auto lg:h-[30px] w-auto lg:w-[343px] items-center justify-center rounded-[4px] bg-[#06457F] px-4 py-1 lg:px-0 lg:py-0">
                                    <span className="font-dm-sans text-[12px] lg:text-[14px] font-semibold leading-[20px] lg:leading-[26px] tracking-[0.49px] text-[#F0F5FA] text-center">
                                        <RichTextInline content={finalContent.header.lastUpdated} />
                                    </span>
                                </div>
                            )}

                            <div className="h-px w-full bg-[#EAECF0]" />
                        </div>

                        {/* Welcome Section */}
                        {finalContent.header.welcome && (
                            <section className="flex flex-col gap-[10px]">
                                <RichTextBlock
                                    as="div"
                                    content={finalContent.header.welcome.title}
                                    defaultTag="h2"
                                    className="font-dm-sans text-[16px] lg:text-[18px] font-normal leading-[24px] lg:leading-[26px] tracking-[0.675px] text-[#1E1F21]"
                                />
                                <RichTextBlock
                                    as="div"
                                    content={finalContent.header.welcome.text}
                                    defaultTag="p"
                                    className="font-dm-sans text-[15px] lg:text-[17px] font-normal leading-[24px] lg:leading-[27px] tracking-[0.6px] text-[#667085]"
                                />
                            </section>
                        )}

                        {/* Dynamic Sections */}
                        {finalContent.sections.map((section) => (
                            <section key={section.id} id={section.id} className="scroll-mt-32 flex flex-col gap-[10px]">
                                <RichTextBlock
                                    as="div"
                                    content={section.title}
                                    defaultTag="h2"
                                    className="font-dm-sans text-[16px] lg:text-[18px] font-normal leading-[24px] lg:leading-[26px] tracking-[0.675px] text-[#1E1F21]"
                                />
                                <div className="flex flex-col gap-[10px]">
                                    {section.content.map((paragraph, idx) => {
                                        const plainParagraph = richTextToPlainText(paragraph);

                                        if (plainParagraph.startsWith("Email:")) {
                                            const email = plainParagraph.replace("Email:", "").trim();
                                            return (
                                                <a
                                                    key={idx}
                                                    href={`mailto:${email}`}
                                                    className="font-dm-sans text-[15px] lg:text-[17px] font-normal leading-[24px] lg:leading-[27px] tracking-[0.6px] text-[#06457F] hover:underline block"
                                                    style={{ overflowWrap: "break-word" }}
                                                >
                                                    {plainParagraph}
                                                </a>
                                            );
                                        }
                                        if (plainParagraph.startsWith("Website:")) {
                                            const url = plainParagraph.replace("Website:", "").trim();
                                            return (
                                                <a
                                                    key={idx}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-dm-sans text-[15px] lg:text-[17px] font-normal leading-[24px] lg:leading-[27px] tracking-[0.6px] text-[#06457F] hover:underline block"
                                                    style={{ overflowWrap: "break-word" }}
                                                >
                                                    {plainParagraph}
                                                </a>
                                            );
                                        }
                                        return (
                                            <RichTextBlock
                                                key={idx}
                                                as="div"
                                                content={paragraph}
                                                defaultTag="p"
                                                className="font-dm-sans text-[15px] lg:text-[17px] font-normal leading-[24px] lg:leading-[27px] tracking-[0.6px] text-[#667085]"
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>

                {/* Sidebar Navigation - Width 300px - Right Side (Desktop Only) */}
                <aside className="hidden w-[300px] flex-none lg:block order-1 lg:order-2">
                    <div className="sticky top-[100px] flex flex-col gap-[10px]">
                        <nav className="flex flex-col gap-[10px]">
                            {finalContent.toc.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={cn(
                                        "block w-[280px] font-nunito text-[14px] font-semibold leading-[26px] tracking-[0.49px] transition-colors",
                                        activeSection === item.id
                                            ? "text-[#06457F]"
                                            : "text-[#667085] hover:text-[#06457F]"
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(item.id);
                                    }}
                                >
                                    <RichTextInline content={item.label} />
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

            </div>
        </div>
    );
}
