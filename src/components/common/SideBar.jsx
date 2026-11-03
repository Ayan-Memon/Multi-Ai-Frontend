"use client";
import { Menu, PanelLeftIcon, Search, SquarePen, X } from "lucide-react";
import Image from "next/image";
import { useProfile } from "../hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/chat.queries";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SIDEBAR_TRANSITION = { duration: 0.22, ease: [0.32, 0.72, 0, 1] };
const CONTENT_FADE = { duration: 0.12, ease: [0.4, 0, 0.2, 1] };

const sidebarVariants = {
  open: { width: 280 },
  closed: { width: 70 },
};

const drawerVariants = {
  open: { x: "0%", visibility: "visible" },
  closed: { x: "-100%", transitionEnd: { visibility: "hidden" } },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ...CONTENT_FADE, delay: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

const SidebarContent = ({
  expanded,
  mobile = false,
  onToggle,
  onExpand,
  onNavigate,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { data, isPending } = useProfile();
  const { name: username, avatar } = data ?? {};
  const params = useParams();

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <>
      <div className="header flex flex-col shrink-0 px-3.5">
        <div
          className={`flex items-center min-h-10 ${
            expanded ? "justify-between px-2" : "justify-center px-0"
          }`}
        >
          <div className="relative shrink-0 w-[108px] h-10">
            <AnimatePresence mode="wait" initial={false}>
              {expanded ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={CONTENT_FADE}
                  className="absolute inset-0"
                >
                  <Image
                    src={"/light-logo.png"}
                    alt="NEXORA"
                    width={120}
                    height={40}
                    priority
                    className="w-[108px] h-auto object-contain hidden dark:block"
                  />
                  <Image
                    src={"/dark-logo.png"}
                    alt="NEXORA"
                    width={120}
                    height={40}
                    priority
                    className="w-[108px] h-auto object-contain block dark:hidden"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="logo-small"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={CONTENT_FADE}
                  className="absolute inset-0 flex items-center justify-center px-4"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Image
                    src={"/small-light-logo.png"}
                    alt="NEXORA"
                    width={40}
                    height={40}
                    priority
                    className="w-[56px] h-auto object-contain hidden dark:block"
                  />
                  <Image
                    src={"/small-dark-logo.png"}
                    alt="NEXORA"
                    width={40}
                    height={40}
                    priority
                    className="w-[56px] h-auto object-contain block dark:hidden"
                  />
                  {isHovered && (
                    <button
                      aria-label="Expand sidebar"
                      className="
                        flex items-center justify-center
                        rounded-md
                        text-muted-foreground
                        hover:text-foreground
                        hover:bg-black/[0.045]
                        transition-colors duration-150
                        cursor-e-resize
                        bg-sidebar!
                        z-10
                        absolute inset-0
                      "
                      onClick={onToggle}
                    >
                      <PanelLeftIcon size={17} strokeWidth={1.8} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {expanded && (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                aria-label={mobile ? "Close sidebar" : "Collapse sidebar"}
                className={`
                  ${mobile ? "w-10 h-10" : "w-8 h-8"}
                  flex items-center justify-center
                  rounded-md
                  text-muted-foreground
                  hover:text-foreground
                  hover:bg-black/[0.045]
                  transition-colors duration-150
                  cursor-pointer
                `}
                onClick={onToggle}
              >
                {mobile ? (
                  <X size={20} strokeWidth={1.8} />
                ) : (
                  <PanelLeftIcon size={17} strokeWidth={1.8} />
                )}
              </button>

              {!mobile && (
                <button
                  aria-label="Search"
                  className="
                    w-8 h-8
                    flex items-center justify-center
                    rounded-md
                    text-muted-foreground
                    hover:text-foreground
                    hover:bg-black/[0.045]
                    cursor-pointer
                    overflow-hidden
                  "
                >
                  <Search size={17} strokeWidth={1.8} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative mt-4">
          <Search
            size={16}
            strokeWidth={1.8}
            className={`
              absolute
              top-1/2
              -translate-y-1/2
              transition-all duration-200
              ${!expanded ? "-translate-x-1/2 left-1/2!" : "left-3"}
              text-text-muted
              pointer-events-none
            `}
          />

          <input
            type="text"
            placeholder={!expanded ? "" : "Search"}
            className={`
              w-full
              ${mobile ? "h-11 text-base" : "h-10 text-[13px]"}
              ${!expanded ? "p-0" : "pl-9 pr-3"}
              rounded-md
              bg-white
              dark:bg-background/50
              border border-black/[0.08]
              dark:border-sidebar-border
              shadow-[0_1px_2px_rgba(0,0,0,0.02)]
              outline-none
              text-text-primary
              placeholder:text-text-placeholder
              transition-all duration-200
              focus:border-black/[0.16]
              focus:shadow-[0_0_0_3px_rgba(0,0,0,0.035)]
            `}
            onFocus={() => onExpand?.()}
          />
        </div>

        <Link
          href={"/"}
          onClick={onNavigate}
          className={`
            group
            mt-4
            ${mobile ? "h-11" : "h-10"}
            px-3
            flex items-center gap-2.5
            rounded-md
            bg-sidebar-primary
            text-sidebar-primary-foreground
            shadow-[0_1px_2px_rgba(0,0,0,0.08)]
            hover:shadow-[0_3px_10px_rgba(0,0,0,0.12)]
            hover:-translate-y-[1px]
            active:translate-y-0
            transition-all duration-200
            cursor-pointer
            shrink-0
            overflow-hidden
            whitespace-nowrap
          `}
        >
          <SquarePen
            size={17}
            strokeWidth={1.9}
            className="shrink-0 transition-transform duration-200 group-hover:scale-105"
          />

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.span
                key="new-chat-label"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                className={`${mobile ? "text-sm" : "text-[13px]"} font-medium tracking-[-0.01em] whitespace-nowrap`}
              >
                New chat
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="recents"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariants}
            className="mt-6 flex-1 min-h-0 flex flex-col"
          >
            <div className="px-4 mb-2 shrink-0">
              <h2
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-text-muted
                "
              >
                Recents
              </h2>
            </div>
            <div className="space-y-0.5 sidebar-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain px-4">
              {conversations?.map((chat) => (
                <Link
                  key={`conversation-${chat._id}`}
                  href={`/c/${chat._id}`}
                  onClick={onNavigate}
                  className={`
                    group
                    relative
                    w-full
                    flex items-center
                    text-left
                    px-3
                    ${mobile ? "h-11 text-sm" : "h-9 text-[13px]"}
                    rounded-sm
                    tracking-[-0.01em]
                    transition-all duration-150
                    cursor-pointer
                    ${
                      chat._id === params?.conversationId
                        ? "bg-black/[0.055] text-text-primary font-medium dark:bg-surface-muted"
                        : "text-text-secondary hover:bg-black/[0.035] dark:hover:bg-surface-muted hover:text-text-primary"
                    }
                  `}
                >
                  <span className="truncate">{chat.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`
          shrink-0 w-full px-4 pt-3 flex gap-2 items-center
          border-t border-sidebar-border/50
          ${!expanded ? "mt-auto justify-center" : ""}
        `}
      >
        {isPending || !avatar ? (
          <div className="w-9 h-9 rounded-full bg-black/[0.08] shrink-0" />
        ) : (
          <Image
            src={avatar}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full w-9 h-9 object-cover shrink-0"
          />
        )}

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="profile-info"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
              className={`content min-w-0 flex flex-col overflow-hidden whitespace-nowrap ${
                isPending ? "gap-2" : ""
              }`}
            >
              {isPending ? (
                <span className="block h-4 w-24 bg-black/[0.08] rounded-md" />
              ) : (
                <h3 className="font-heading text-[13px] tracking-[-0.01em] truncate">
                  {username}
                </h3>
              )}
              {isPending ? (
                <span className="block h-4 w-10 bg-black/[0.08] rounded-md" />
              ) : (
                <p className="plan text-[13px] tracking-[-0.01em] text-text-secondary font-medium">
                  Free
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SideBar = () => {
  const artifact = useSelector((state) => state?.artifact ?? []);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    if (artifact.length > 0) {
      setIsSidebarOpen(false);
      setIsDrawerOpen(false);
    }
  }, [artifact.length]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = (e) => {
      if (e.matches) setIsDrawerOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onResize);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onResize);
    };
  }, [isDrawerOpen]);

  return (
    <>
      <motion.aside
        className="
          hidden md:flex
          h-dvh
          flex-col
          py-3
          bg-sidebar
          border-r border-sidebar-border
          font-inter
          overflow-hidden
          shrink-0
        "
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={SIDEBAR_TRANSITION}
      >
        <SidebarContent
          expanded={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          onExpand={() => setIsSidebarOpen(true)}
        />
      </motion.aside>

      {!isDrawerOpen && (
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setIsDrawerOpen(true)}
          className="
            md:hidden
            fixed z-30
            top-[max(0.75rem,env(safe-area-inset-top))]
            left-3
            w-10 h-10
            flex items-center justify-center
            rounded-lg
            bg-sidebar
            border border-sidebar-border
            text-muted-foreground
            active:scale-95
            transition-transform duration-150
          "
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>
      )}

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={closeDrawer}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`
          md:hidden
          fixed inset-y-0 left-0 z-50
          flex flex-col
          w-[85vw] max-w-[300px]
          h-dvh
          pt-[max(0.75rem,env(safe-area-inset-top))]
          pb-[max(0.75rem,env(safe-area-inset-bottom))]
          bg-sidebar
          border-r border-sidebar-border
          font-inter
          overflow-hidden
          ${isDrawerOpen ? "shadow-2xl" : ""}
        `}
        initial={false}
        animate={isDrawerOpen ? "open" : "closed"}
        variants={drawerVariants}
        transition={SIDEBAR_TRANSITION}
      >
        <SidebarContent
          expanded
          mobile
          onToggle={closeDrawer}
          onNavigate={closeDrawer}
        />
      </motion.aside>
    </>
  );
};