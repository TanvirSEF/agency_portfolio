"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useEffect, useMemo, useState } from "react";

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

type StackDirection = "forward" | "backward";

interface StackCard {
  id: number;
  sourceIndex: number;
  content: React.ReactNode;
}

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
      return;
    }

    x.set(0);
    y.set(0);
  }

  if (disableDrag) {
    return (
      <motion.div className="absolute inset-0" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

function normalizeIndex(index: number, length: number) {
  if (!length) return 0;
  return ((index % length) + length) % length;
}

function getDeterministicRotation(id: number) {
  const seed = Math.sin(id * 12.9898) * 43758.5453;
  const normalized = seed - Math.floor(seed);
  return normalized * 10 - 5;
}

function mapCards(cards: React.ReactNode[]): StackCard[] {
  return cards.map((content, index) => ({ id: index + 1, sourceIndex: index, content }));
}

function buildScrollStackCards(cards: React.ReactNode[], topIndex: number, direction: StackDirection): StackCard[] {
  const mapped = mapCards(cards);
  if (!mapped.length) return mapped;

  const normalizedTopIndex = normalizeIndex(topIndex, mapped.length);
  const orderedIndexes: number[] = [];

  for (let step = 1; step <= mapped.length; step += 1) {
    const index =
      direction === "backward"
        ? normalizeIndex(normalizedTopIndex - step, mapped.length)
        : normalizeIndex(normalizedTopIndex + step, mapped.length);
    orderedIndexes.push(index);
  }

  return orderedIndexes.map((index) => mapped[index]);
}

const DEFAULT_CARDS: React.ReactNode[] = [
  <div
    key="default-card-1"
    aria-hidden
    className="h-full w-full bg-[linear-gradient(135deg,#06195a,#2d5eff)]"
  />,
  <div
    key="default-card-2"
    aria-hidden
    className="h-full w-full bg-[linear-gradient(135deg,#0a3065,#00a4d6)]"
  />,
  <div
    key="default-card-3"
    aria-hidden
    className="h-full w-full bg-[linear-gradient(135deg,#34175f,#8836ff)]"
  />,
  <div
    key="default-card-4"
    aria-hidden
    className="h-full w-full bg-[linear-gradient(135deg,#142f25,#27a86e)]"
  />,
];

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
  controlledByScroll?: boolean;
  scrollIndex?: number;
  scrollDirection?: StackDirection;
  containerClassName?: string;
  cardClassName?: string;
}

function classNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  controlledByScroll = false,
  scrollIndex = 0,
  scrollDirection = "forward",
  containerClassName,
  cardClassName,
}: StackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sourceCards = cards.length ? cards : DEFAULT_CARDS;
  const [interactiveStack, setInteractiveStack] = useState<StackCard[]>(() => mapCards(sourceCards));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  const controlledStack = useMemo(
    () => buildScrollStackCards(sourceCards, scrollIndex, scrollDirection),
    [sourceCards, scrollIndex, scrollDirection],
  );

  const stack = controlledByScroll ? controlledStack : interactiveStack;
  const shouldDisableDrag = controlledByScroll || (mobileClickOnly && isMobile);
  const shouldEnableClick = !controlledByScroll && (sendToBackOnClick || shouldDisableDrag);

  const sendToBack = (id: number) => {
    setInteractiveStack((previousStack) => {
      const nextStack = [...previousStack];
      const index = nextStack.findIndex((card) => card.id === id);
      if (index < 0) return previousStack;
      const [card] = nextStack.splice(index, 1);
      nextStack.unshift(card);
      return nextStack;
    });
  };

  useEffect(() => {
    if (!autoplay || controlledByScroll || interactiveStack.length < 2 || isPaused) return;

    const interval = window.setInterval(() => {
      const topCardId = interactiveStack[interactiveStack.length - 1]?.id;
      if (topCardId) {
        sendToBack(topCardId);
      }
    }, autoplayDelay);

    return () => window.clearInterval(interval);
  }, [autoplay, autoplayDelay, controlledByScroll, interactiveStack, isPaused]);

  return (
    <div
      className={classNames("relative h-full w-full overflow-visible", containerClassName)}
      style={{ perspective: 600 }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const randomRotate = randomRotation ? getDeterministicRotation(card.id) : 0;
        const transition = controlledByScroll
          ? {
              duration: 0.46,
              ease: [0.22, 1, 0.36, 1] as const,
            }
          : {
              type: "spring" as const,
              stiffness: animationConfig.stiffness,
              damping: animationConfig.damping,
            };
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className={classNames("h-full w-full transform-gpu overflow-hidden rounded-[30px]", cardClassName)}
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              animate={{
                rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                scale: 1 - (stack.length - index - 1) * 0.06,
                transformOrigin: "90% 90%",
              }}
              style={{ backfaceVisibility: "hidden" }}
              initial={false}
              transition={transition}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
