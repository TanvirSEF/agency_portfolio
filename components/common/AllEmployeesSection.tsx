"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import EmployeeAvatarComponent from "./EmployeeAvatarComponent";
import { allEmployeesSectionContentAboutUs as defaultContent } from "../contents/about-us/content";
import { ContentPath, useContent } from "../contents/useContent";
import { ChevronDown } from "lucide-react";
import Magnet from "../Magnet";
import { RichTextBlock } from "./RichTextContent";

interface AllEmployeesSectionProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

/** Two rows on lg (4 cols) = 8 items initially visible */
const INITIAL_VISIBLE = 8;

export default function AllEmployeesSection({ contentPath, content }: AllEmployeesSectionProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    const [isExpanded, setIsExpanded] = useState(false);

    const employees = finalContent.employees;
    const firstRowEmployees = employees.slice(0, INITIAL_VISIBLE);
    const restEmployees = employees.slice(INITIAL_VISIBLE);
    const hasMore = employees.length > INITIAL_VISIBLE;

    return (
        <div className="bg-[#F2F3F6]">
            <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-8 lg:px-10">
                <RichTextBlock
                    as="div"
                    content={finalContent.eyebrow}
                    defaultTag="p"
                    className="text-center text-[1.25rem] text-[#06457F]"
                />
                <RichTextBlock
                    as="div"
                    content={finalContent.title}
                    defaultTag="h2"
                    className="text-center font-bold text-[#1E1F21]"
                    style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                />
            </div>

            <div className="container mx-auto px-4 pb-12 lg:px-10">
                <div className="grid py-8 grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
                    {firstRowEmployees.map((employee) => (
                        <EmployeeAvatarComponent
                            key={employee.id}
                            name={employee.name}
                            title={employee.title}
                            imageSrc={employee.imageSrc}
                            imageSeo={(employee as any).imageSeo}
                            hoverImageSrc={employee.hoverImageSrc}
                            hoverImageSeo={(employee as any).hoverImageSeo}
                        />
                    ))}
                </div>
                {hasMore && (
                    <motion.div
                        initial={false}
                        animate={{
                            maxHeight: isExpanded ? 2000 : 0,
                            opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-10 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
                            {restEmployees.map((employee) => (
                                <EmployeeAvatarComponent
                                    key={employee.id}
                                    name={employee.name}
                                    title={employee.title}
                                    imageSrc={employee.imageSrc}
                                    imageSeo={(employee as any).imageSeo}
                                    hoverImageSrc={employee.hoverImageSrc}
                                    hoverImageSeo={(employee as any).hoverImageSeo}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {hasMore && (
                <div className="container mx-auto flex w-full max-w-2xl items-center gap-4 px-4 pb-24 lg:px-10">
                    <hr className="h-px flex-1 border-0 bg-[#06457F]/40" aria-hidden />
                    <Magnet padding={48} magnetStrength={4} wrapperClassName="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="flex shrink-0 items-center justify-center rounded-full bg-[#F2F3F6] p-2 text-[#06457F] ring-2 ring-[#06457F]/40 transition-colors hover:bg-[#06457F]/10 hover:ring-[#06457F] focus:outline-none focus:ring-2 focus:ring-[#06457F] focus:ring-offset-2 focus:ring-offset-[#F2F3F6]"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "Collapse team list" : "Expand to show all team members"}
                    >
                        <Magnet padding={48} magnetStrength={6} wrapperClassName="flex items-center justify-center">
                            <ChevronDown
                                className={`h-6 w-6 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            />
                        </Magnet>
                    </button>
                    </Magnet>
                    <hr className="h-px flex-1 border-0 bg-[#06457F]/40" aria-hidden />
                </div>
            )}
        </div>
    );
}
